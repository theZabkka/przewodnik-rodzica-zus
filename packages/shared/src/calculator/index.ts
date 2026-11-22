import {
  BenefitCalculationInput,
  BenefitCalculationOutput,
  BenefitTimelineSegment,
  LegislativeParameters,
} from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';
import { calculateNetBase } from './base';
import { calculateMaternityLeave } from './maternity';
import { calculateParentalLeave } from './parental';
import { calculateSupplementaryLeave } from './supplementary';
import { calculateWorkSharing } from './work-sharing';
import { calculatePaternityLeave } from './paternity';
import { detectRiskWarnings } from './risk-detector';

export * from './base';
export * from './maternity';
export * from './parental';
export * from './supplementary';
export * from './work-sharing';
export * from './paternity';
export * from './sick-leave-b';
export * from './care';
export * from './risk-detector';
export * from './riskEngine';
export * from './decisionGenerator';
export * from './z3Generator';
export * from './family-sharing-planner';

/**
 * Master calculation engine for ZUS parental benefits (Stan prawny 2026).
 * Pure, deterministic, TypeScript-strict implementation.
 */
export function calculateParentalBenefits(
  input: BenefitCalculationInput,
  customParams?: Partial<LegislativeParameters>
): BenefitCalculationOutput {
  const params: LegislativeParameters = {
    ...DEFAULT_LEGISLATIVE_2026,
    ...customParams,
  };

  // 1. Podstawa wymiaru
  const baseResult = calculateNetBase(input.monthlyBaseGross, input.contractType, params);
  const netBase = baseResult.netBaseMonthly;
  const dailyBase = baseResult.dailyBaseAmount;

  // 2. Urlop macierzyński / na warunkach macierzyńskiego (art. 180 i 183 KP)
  const maternityResult = calculateMaternityLeave(
    input.childrenCount,
    input.submissionWithin21Days,
    dailyBase,
    netBase,
    params,
    {
      parenthoodType: input.parenthoodType,
      childAgeMonthsAtAdoption: input.childAgeMonthsAtAdoption,
      hasSchoolDeferral: input.hasSchoolDeferral,
    }
  );

  // 3. Urlop uzupełniający dla wcześniaków (art. 180² KP)
  const supplementaryResult = calculateSupplementaryLeave(
    {
      isPrematureOrHospitalized: input.isPrematureOrHospitalized,
      birthWeek: input.birthWeek,
      birthWeightGrams: input.birthWeightGrams,
      hospitalDaysTotal: input.hospitalDaysTotal,
      hospitalizationConsecutiveMin2DaysBetweenDay5And28: input.hospitalizationConsecutiveMin2DaysBetweenDay5And28,
    },
    dailyBase,
    netBase,
    params
  );

  // 4. Urlop rodzicielski
  const parentalResult = calculateParentalLeave(
    input.childrenCount,
    input.hasLifeCertificate,
    input.submissionWithin21Days,
    dailyBase,
    netBase,
    params
  );

  // 5. Łączenie urlopu rodzicielskiego z pracą (art. 182¹ᶠ KP)
  let parentalExtensionWeeks = 0;
  let totalExtendedParentalWeeks = parentalResult.motherMaxWeeks;
  let momParentalRatePercent = parentalResult.motherRatePercent;
  let momParentalMonthlyBenefit = parentalResult.monthlyBenefitAmountMom;
  let momParentalTotalBenefit = parentalResult.totalBenefitAmountMom;

  if (input.workPartTimeDuringParental && input.workFteRatio && input.workFteRatio > 0) {
    const workSharingResult = calculateWorkSharing({
      nominalParentalWeeks: parentalResult.motherMaxWeeks,
      fteRatio: input.workFteRatio,
      workWeeks: input.workWeeks,
      nominalRatePercent: parentalResult.motherRatePercent,
      netBaseMonthly: netBase,
      dailyBaseAmount: dailyBase,
      grossSalaryMonthly: input.monthlyBaseGross,
      hasLifeCertificate: input.hasLifeCertificate,
      childrenCount: input.childrenCount,
    });

    parentalExtensionWeeks = workSharingResult.extensionWeeksGranted;
    totalExtendedParentalWeeks = workSharingResult.totalExtendedParentalWeeks;
    momParentalRatePercent = workSharingResult.reducedBenefitRatePercent;
    momParentalMonthlyBenefit = workSharingResult.monthlyBenefitDuringWorkGross;
    momParentalTotalBenefit = workSharingResult.totalBenefitPaidAcrossPeriod;
  }

  // 6. Urlop ojcowski (14 dni)
  const paternityResult = calculatePaternityLeave(dailyBase, params);
  const includePaternity = input.includePaternityLeave ?? false;
  const paternityWeeks = includePaternity ? paternityResult.totalWeeks : 0;
  const paternityTotalBenefit = includePaternity ? paternityResult.totalBenefitAmount : 0;

  // 7. Suma łączna świadczeń
  const totalBenefitAmountSum = Math.round(
    (maternityResult.totalBenefitAmount +
      supplementaryResult.totalBenefitAmount +
      momParentalTotalBenefit +
      parentalResult.totalBenefitAmountDadReserved +
      paternityTotalBenefit) *
      100
  ) / 100;

  // 8. Oś czasu (Timeline Segments)
  const timelineSegments: BenefitTimelineSegment[] = [];

  // Segment 1: Urlop macierzyński / na warunkach macierzyńskiego
  timelineSegments.push({
    title: maternityResult.leaveTitle,
    recipient: maternityResult.isAdoptionOrFoster ? 'both' : 'mother',
    durationWeeks: maternityResult.totalWeeks,
    durationDays: maternityResult.totalDays,
    ratePercent: maternityResult.ratePercent,
    monthlyAmountGross: maternityResult.monthlyBenefitAmount,
    dailyRateGross: maternityResult.dailyBenefitAmount,
    totalGrossAmount: maternityResult.totalBenefitAmount,
    notes: maternityResult.isAdoptionOrFoster
      ? (maternityResult.guaranteedMinWeeksApplied
          ? 'Zastosowano gwarantowany minimalny wymiar 9 tygodni (art. 183 § 3 KP).'
          : 'Urlop na warunkach urlopu macierzyńskiego dla opiekunów przyjmujących dziecko na wychowanie (art. 183 KP).')
      : `Pierwsze 14 tygodni obligatoryjnie dla matki; pozostałe ${maternityResult.transferableToFatherWeeks} tyg. może przejąć ojciec.`,
  });

  // Segment 2: Uzupełniający urlop macierzyński (jeśli przysługuje)
  if (supplementaryResult.isEligible && supplementaryResult.weeksGranted > 0) {
    timelineSegments.push({
      title: `Uzupełniający urlop macierzyński (${supplementaryResult.weeksGranted} tyg. - art. 180² KP)`,
      recipient: input.parentRole,
      durationWeeks: supplementaryResult.weeksGranted,
      durationDays: supplementaryResult.daysGranted,
      ratePercent: supplementaryResult.ratePercent,
      monthlyAmountGross: supplementaryResult.monthlyBenefitAmount,
      dailyRateGross: supplementaryResult.dailyBenefitAmount,
      totalGrossAmount: supplementaryResult.totalBenefitAmount,
      notes: supplementaryResult.qualifyingReason,
    });
  }

  // Segment 3: Urlop rodzicielski (część matki / wspólna)
  timelineSegments.push({
    title: input.workPartTimeDuringParental
      ? `Urlop rodzicielski łączony z pracą (${totalExtendedParentalWeeks} tyg. po wydłużeniu)`
      : `Urlop rodzicielski (${parentalResult.motherMaxWeeks} tyg.)`,
    recipient: 'mother',
    durationWeeks: totalExtendedParentalWeeks,
    durationDays: Math.round(totalExtendedParentalWeeks * 7),
    ratePercent: momParentalRatePercent,
    monthlyAmountGross: momParentalMonthlyBenefit,
    dailyRateGross: Math.round(dailyBase * (momParentalRatePercent / 100) * 100) / 100,
    totalGrossAmount: momParentalTotalBenefit,
    notes: input.workPartTimeDuringParental
      ? `Praca na ${input.workFteRatio} etatu u obecnego pracodawcy; proporcjonalne wydłużenie o ${parentalExtensionWeeks} tyg.`
      : `Maksymalny wymiar dla jednego rodzica; 9 tygodni pozostaje dla taty.`,
  });

  // Segment 4: 9 tygodni nieprzenoszalnych dla ojca
  timelineSegments.push({
    title: `Urlop rodzicielski – niezbywalna część dla ojca (9 tyg.)`,
    recipient: 'father',
    durationWeeks: parentalResult.fatherReservedWeeks,
    durationDays: parentalResult.fatherReservedDays,
    ratePercent: parentalResult.fatherReservedRatePercent,
    monthlyAmountGross: parentalResult.monthlyBenefitAmountDadReserved,
    dailyRateGross: parentalResult.dailyBenefitAmountDadReserved,
    totalGrossAmount: parentalResult.totalBenefitAmountDadReserved,
    notes: 'Wyłączne prawo ojca (Dyrektywa Work-Life Balance). Wymiar nieprzenoszalny na matkę.',
  });

  // Segment 5: Urlop ojcowski (jeśli uwzględniony)
  if (includePaternity) {
    timelineSegments.push({
      title: `Urlop ojcowski (2 tyg. / 14 dni)`,
      recipient: 'father',
      durationWeeks: paternityResult.totalWeeks,
      durationDays: paternityResult.totalDays,
      ratePercent: paternityResult.ratePercent,
      monthlyAmountGross: Math.round(netBase * (paternityResult.ratePercent / 100) * 100) / 100,
      dailyRateGross: paternityResult.dailyBenefitAmount,
      totalGrossAmount: paternityResult.totalBenefitAmount,
      notes: 'Do wykorzystania do ukończenia przez dziecko 12. miesiąca życia.',
    });
  }

  // 9. Ryzyka
  const riskWarnings = detectRiskWarnings(input, undefined, undefined, params);

  return {
    maternityWeeks: maternityResult.totalWeeks,
    supplementaryWeeks: supplementaryResult.weeksGranted,
    parentalTotalWeeks: parentalResult.totalWeeks,
    parentalMomWeeks: parentalResult.motherMaxWeeks,
    parentalDadReservedWeeks: parentalResult.fatherReservedWeeks,
    paternityWeeks,
    parentalExtensionWeeks,
    totalExtendedParentalWeeks,
    netBaseMonthly: netBase,
    dailyBaseAmount: dailyBase,
    maternityMonthlyBenefit: maternityResult.monthlyBenefitAmount,
    parentalMonthlyBenefitMom: momParentalMonthlyBenefit,
    parentalMonthlyBenefitDad: parentalResult.monthlyBenefitAmountDadReserved,
    supplementaryMonthlyBenefit: supplementaryResult.monthlyBenefitAmount,
    paternityTotalBenefit,
    totalBenefitAmountSum,
    momMaternityRatePercent: maternityResult.ratePercent,
    momParentalRatePercent,
    dadParentalReservedRatePercent: parentalResult.fatherReservedRatePercent,
    supplementaryRatePercent: supplementaryResult.ratePercent,
    paternityRatePercent: paternityResult.ratePercent,
    isAdoptionOrFoster: maternityResult.isAdoptionOrFoster,
    guaranteedMinWeeksApplied: maternityResult.guaranteedMinWeeksApplied,
    parenthoodTitle: maternityResult.leaveTitle,
    timelineSegments,
    riskWarnings,
  };
}

/**
 * Standard alias for calculateParentalBenefits
 */
export const calculateBenefits = calculateParentalBenefits;
