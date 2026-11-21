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

  // 2. Urlop macierzyński
  const maternityResult = calculateMaternityLeave(
    input.childrenCount,
    input.submissionWithin21Days,
    dailyBase,
    netBase,
    params
  );

  // 3. Urlop rodzicielski
  const parentalResult = calculateParentalLeave(
    input.childrenCount,
    input.hasLifeCertificate,
    input.submissionWithin21Days,
    dailyBase,
    netBase,
    params
  );

  // 4. Urlop uzupełniający dla wcześniaków i hospitalizowanych (art. 180² KP)
  const supplementaryResult = calculateSupplementaryLeave(
    input.isPrematureOrHospitalized,
    input.birthWeek,
    input.birthWeightGrams,
    input.hospitalDaysTotal,
    input.hospitalizationConsecutiveMin2DaysBetweenDay5And28,
    dailyBase,
    netBase,
    params
  );

  // 5. Łączenie z pracą na urlopie rodzicielskim (art. 182¹ᶠ KP)
  const workSharingResult = calculateWorkSharing(
    input.workPartTimeDuringParental,
    input.workFteRatio,
    input.workWeeks,
    parentalResult.parentalMomWeeks,
    params
  );

  // 6. Urlop ojcowski (art. 182³ KP)
  const paternityResult = calculatePaternityLeave(
    Boolean(input.includePaternityLeave),
    dailyBase,
    netBase,
    params
  );

  // 7. Oś czasu i segmenty
  const timelineSegments: BenefitTimelineSegment[] = [];

  // Segment macierzyński matki (14 tyg. obowiązkowe dla matki)
  const mandatoryMomDays = params.maternityMomObligatoryWeeks * 7;
  timelineSegments.push({
    title: 'Urlop macierzyński (część obligatoryjna dla matki)',
    recipient: 'mother',
    durationWeeks: params.maternityMomObligatoryWeeks,
    durationDays: mandatoryMomDays,
    ratePercent: maternityResult.maternityRatePercent,
    monthlyAmountGross: maternityResult.monthlyMaternityGross,
    dailyRateGross: maternityResult.dailyMaternityGross,
    totalGrossAmount: Number((maternityResult.dailyMaternityGross * mandatoryMomDays).toFixed(2)),
    notes: 'Pierwsze 14 tygodni po porodzie przysługuje wyłącznie ubezpieczonej matce.',
  });

  // Pozostała część macierzyńskiego (np. 6 tyg. dla 1 dziecka)
  const remainingMaternityWeeks = maternityResult.maternityWeeksTotal - params.maternityMomObligatoryWeeks;
  if (remainingMaternityWeeks > 0) {
    const remainingDays = remainingMaternityWeeks * 7;
    timelineSegments.push({
      title: 'Urlop macierzyński (część do podziału)',
      recipient: input.parentRole === 'father' ? 'father' : 'mother',
      durationWeeks: remainingMaternityWeeks,
      durationDays: remainingDays,
      ratePercent: maternityResult.maternityRatePercent,
      monthlyAmountGross: maternityResult.monthlyMaternityGross,
      dailyRateGross: maternityResult.dailyMaternityGross,
      totalGrossAmount: Number((maternityResult.dailyMaternityGross * remainingDays).toFixed(2)),
      notes: 'Może wykorzystać matka lub ojciec wychowujący dziecko.',
    });
  }

  // Segment uzupełniający dla wcześniaków (art. 180² KP)
  if (supplementaryResult.supplementaryWeeksGranted > 0) {
    const suppDays = supplementaryResult.supplementaryWeeksGranted * 7;
    timelineSegments.push({
      title: 'Uzupełniający urlop macierzyński (art. 180² KP)',
      recipient: 'mother',
      durationWeeks: supplementaryResult.supplementaryWeeksGranted,
      durationDays: suppDays,
      ratePercent: 100,
      monthlyAmountGross: netBase,
      dailyRateGross: dailyBase,
      totalGrossAmount: Number((dailyBase * suppDays).toFixed(2)),
      notes: supplementaryResult.statutoryBasisNote,
    });
  }

  // Segment rodzicielski matki (lub rodzica zgłaszającego)
  const momParentalDays = parentalResult.parentalMomWeeks * 7;
  timelineSegments.push({
    title: 'Urlop rodzicielski (część standardowa)',
    recipient: 'mother',
    durationWeeks: parentalResult.parentalMomWeeks,
    durationDays: momParentalDays,
    ratePercent: parentalResult.parentalMomRatePercent,
    monthlyAmountGross: parentalResult.monthlyParentalMomGross,
    dailyRateGross: parentalResult.dailyParentalMomGross,
    totalGrossAmount: Number((parentalResult.dailyParentalMomGross * momParentalDays).toFixed(2)),
    notes: workSharingResult.isWorkSharingApplied ? workSharingResult.scheduleNotes : undefined,
  });

  // Segment nieprzenoszalny dla drugiego rodzica (9 tygodni)
  const dadReservedDays = parentalResult.parentalDadReservedWeeks * 7;
  timelineSegments.push({
    title: 'Urlop rodzicielski (9 tygodni wyłącznie dla drugiego rodzica)',
    recipient: 'father',
    durationWeeks: parentalResult.parentalDadReservedWeeks,
    durationDays: dadReservedDays,
    ratePercent: parentalResult.parentalDadRatePercent,
    monthlyAmountGross: parentalResult.monthlyParentalDadGross,
    dailyRateGross: parentalResult.dailyParentalDadGross,
    totalGrossAmount: Number((parentalResult.dailyParentalDadGross * dadReservedDays).toFixed(2)),
    notes: 'Prawo nieprzenoszalne – niewykorzystane do końca 6. r.ż. dziecka bezpowrotnie przepada.',
  });

  // Segment ojcowski
  if (paternityResult.isGranted) {
    timelineSegments.push({
      title: 'Urlop ojcowski (art. 182³ KP)',
      recipient: 'father',
      durationWeeks: paternityResult.weeksGranted,
      durationDays: paternityResult.daysGranted,
      ratePercent: 100,
      monthlyAmountGross: netBase,
      dailyRateGross: dailyBase,
      totalGrossAmount: paternityResult.totalGrossBenefit,
      notes: '14 dni kalendarzowych do ukończenia 12. miesiąca życia dziecka.',
    });
  }

  // 8. Ostrzeżenia i ryzyka
  const riskWarnings = detectRiskWarnings(input, undefined, undefined, params);

  // 9. Sumaryczne kwoty brutto
  const totalBenefitAmountSum = Number(
    timelineSegments.reduce((sum, seg) => sum + seg.totalGrossAmount, 0).toFixed(2)
  );

  return {
    maternityWeeks: maternityResult.maternityWeeksTotal,
    supplementaryWeeks: supplementaryResult.supplementaryWeeksGranted,
    parentalTotalWeeks: parentalResult.parentalTotalWeeks,
    parentalMomWeeks: parentalResult.parentalMomWeeks,
    parentalDadReservedWeeks: parentalResult.parentalDadReservedWeeks,
    paternityWeeks: paternityResult.weeksGranted,

    parentalExtensionWeeks: workSharingResult.extensionWeeksGranted,
    totalExtendedParentalWeeks: workSharingResult.totalParentalWeeksAfterExtension,

    netBaseMonthly: netBase,
    dailyBaseAmount: dailyBase,

    maternityMonthlyBenefit: maternityResult.monthlyMaternityGross,
    parentalMonthlyBenefitMom: parentalResult.monthlyParentalMomGross,
    parentalMonthlyBenefitDad: parentalResult.monthlyParentalDadGross,
    supplementaryMonthlyBenefit: supplementaryResult.supplementaryWeeksGranted > 0 ? netBase : 0,
    paternityTotalBenefit: paternityResult.totalGrossBenefit,
    totalBenefitAmountSum,

    momMaternityRatePercent: maternityResult.maternityRatePercent,
    momParentalRatePercent: parentalResult.parentalMomRatePercent,
    dadParentalReservedRatePercent: parentalResult.parentalDadRatePercent,
    supplementaryRatePercent: 100,
    paternityRatePercent: 100,

    timelineSegments,
    riskWarnings,
  };
}