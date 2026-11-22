import { LegislativeParameters, ParenthoodType } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface MaternityLeaveOptions {
  parenthoodType?: ParenthoodType;
  childAgeMonthsAtAdoption?: number;
  hasSchoolDeferral?: boolean;
}

export interface MaternityLeaveResult {
  totalWeeks: number;
  totalDays: number;
  motherObligatoryWeeks: number;
  motherObligatoryDays: number;
  transferableToFatherWeeks: number;
  transferableToFatherDays: number;
  ratePercent: number;
  dailyBenefitAmount: number;
  monthlyBenefitAmount: number;
  totalBenefitAmount: number;
  isAdoptionOrFoster?: boolean;
  guaranteedMinWeeksApplied?: boolean;
  leaveTitle: string;
}

/**
 * Calculates maternity leave dimensions and benefit amounts (Art. 180 i Art. 183 Kodeksu pracy).
 * 
 * Reguły wymiaru urlopu macierzyńskiego i urlopu na warunkach macierzyńskiego:
 * - 1 dziecko: 20 tygodni (140 dni)
 * - 2 dzieci: 31 tygodni (217 dni)
 * - 3 dzieci: 33 tygodnie (231 dni)
 * - 4 dzieci: 35 tygodni (245 dni)
 * - 5+ dzieci: 37 tygodni (259 dni)
 * 
 * Przyjęcie dziecka na wychowanie (Art. 183 KP):
 * - Rodzina zastępcza niezawodowa: do ukończenia 7 lat (lub 10 lat przy odroczeniu obowiązku szkolnego).
 * - Przysposobienie (adopcja): do ukończenia 14 lat.
 * - Gwarancja minimalna (Art. 183 § 3 KP): urlop nie może trwać krócej niż 9 tygodni!
 * 
 * Podział:
 * - Przy porodzie: pierwsze 14 tygodni (98 dni) po porodzie wyłącznie dla matki.
 * - Przy adopcji/rodzinie zastępczej: oboje rodzice mogą korzystać lub podzielić urlop.
 * 
 * Stawka:
 * - 81,5% w przypadku wniosku w ciągu 21 dni po porodzie / przyjęciu dziecka o pełen wymiar.
 * - 100% w przypadku standardowego wnioskowania etapowego.
 */
export function calculateMaternityLeave(
  childrenCount: number,
  submissionWithin21Days: boolean,
  dailyBaseAmount: number,
  netBaseMonthly: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026,
  options?: MaternityLeaveOptions
): MaternityLeaveResult {
  let totalWeeks = params.maternityWeeksSingle;
  if (childrenCount === 2) totalWeeks = params.maternityWeeksTwins;
  else if (childrenCount === 3) totalWeeks = params.maternityWeeksTriplets;
  else if (childrenCount === 4) totalWeeks = params.maternityWeeksQuadruplets;
  else if (childrenCount >= 5) totalWeeks = params.maternityWeeksQuintupletsPlus;

  const parenthoodType = options?.parenthoodType ?? 'birth';
  const isAdoptionOrFoster = parenthoodType === 'adoption' || parenthoodType === 'foster_family';
  let guaranteedMinWeeksApplied = false;

  // Sprawdzenie zasad art. 183 KP dla adopcji i rodziny zastępczej
  if (isAdoptionOrFoster) {
    const ageMonths = options?.childAgeMonthsAtAdoption ?? 0;
    const maxAgeMonths = parenthoodType === 'adoption'
      ? 168 // 14 lat
      : (options?.hasSchoolDeferral ? 120 : 84); // 10 lat z odroczeniem lub 7 lat

    // Jeżeli dziecko przekracza wiek graniczny lub zbliża się do limitu:
    // Art. 183 § 3 KP gwarantuje minimum 9 tygodni urlopu na warunkach macierzyńskiego
    if (ageMonths >= maxAgeMonths - 2) {
      if (totalWeeks < 9) {
        totalWeeks = 9;
        guaranteedMinWeeksApplied = true;
      }
    }
  }

  const totalDays = totalWeeks * 7;
  const motherObligatoryWeeks = isAdoptionOrFoster ? 0 : Math.min(params.maternityMomObligatoryWeeks, totalWeeks);
  const motherObligatoryDays = motherObligatoryWeeks * 7;
  const transferableToFatherWeeks = Math.max(0, totalWeeks - motherObligatoryWeeks);
  const transferableToFatherDays = transferableToFatherWeeks * 7;

  const ratePercent = submissionWithin21Days
    ? params.unifiedApplicationRatePercent
    : params.maternityStandardRatePercent;

  const rateFactor = ratePercent / 100;
  const dailyBenefitAmount = Math.round(dailyBaseAmount * rateFactor * 100) / 100;
  const monthlyBenefitAmount = Math.round(netBaseMonthly * rateFactor * 100) / 100;
  const totalBenefitAmount = Math.round(dailyBenefitAmount * totalDays * 100) / 100;

  const leaveTitle = isAdoptionOrFoster
    ? `Urlop na warunkach urlopu macierzyńskiego (${totalWeeks} tyg. - art. 183 KP)`
    : `Urlop macierzyński (${totalWeeks} tyg. - art. 180 KP)`;

  return {
    totalWeeks,
    totalDays,
    motherObligatoryWeeks,
    motherObligatoryDays,
    transferableToFatherWeeks,
    transferableToFatherDays,
    ratePercent,
    dailyBenefitAmount,
    monthlyBenefitAmount,
    totalBenefitAmount,
    isAdoptionOrFoster,
    guaranteedMinWeeksApplied,
    leaveTitle,
  };
}
