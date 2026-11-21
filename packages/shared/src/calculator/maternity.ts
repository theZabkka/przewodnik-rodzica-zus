import { LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

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
}

/**
 * Calculates maternity leave dimensions and benefit amounts (Art. 180 Kodeksu pracy).
 * 
 * Reguły wymiaru urlopu macierzyńskiego:
 * - 1 dziecko: 20 tygodni (140 dni)
 * - 2 dzieci: 31 tygodni (217 dni)
 * - 3 dzieci: 33 tygodnie (231 dni)
 * - 4 dzieci: 35 tygodni (245 dni)
 * - 5+ dzieci: 37 tygodni (259 dni)
 * 
 * Podział:
 * - Pierwsze 14 tygodni (98 dni) po porodzie wyłącznie dla matki.
 * - Pozostały okres (np. 6 tyg. przy 1 dziecku) może przejąć ubezpieczony ojciec dziecka.
 * 
 * Stawka:
 * - 81,5% w przypadku wniosku w ciągu 21 dni po porodzie o pełen wymiar.
 * - 100% w przypadku standardowego wnioskowania etapowego.
 */
export function calculateMaternityLeave(
  childrenCount: number,
  submissionWithin21Days: boolean,
  dailyBaseAmount: number,
  netBaseMonthly: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): MaternityLeaveResult {
  let totalWeeks = params.maternityWeeksSingle;
  if (childrenCount === 2) totalWeeks = params.maternityWeeksTwins;
  else if (childrenCount === 3) totalWeeks = params.maternityWeeksTriplets;
  else if (childrenCount === 4) totalWeeks = params.maternityWeeksQuadruplets;
  else if (childrenCount >= 5) totalWeeks = params.maternityWeeksQuintupletsPlus;

  const totalDays = totalWeeks * 7;
  const motherObligatoryWeeks = Math.min(params.maternityMomObligatoryWeeks, totalWeeks);
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
  };
}
