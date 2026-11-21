import { LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface SupplementaryLeaveInput {
  isPrematureOrHospitalized: boolean;
  birthWeek?: number;
  birthWeightGrams?: number;
  hospitalDaysTotal?: number;
  hospitalizationConsecutiveMin2DaysBetweenDay5And28?: boolean;
}

export interface SupplementaryLeaveResult {
  isEligible: boolean;
  maxPermittedWeeks: number;
  hospitalWeeksCalculated: number;
  weeksGranted: number;
  daysGranted: number;
  ratePercent: number; // 100%
  dailyBenefitAmount: number;
  monthlyBenefitAmount: number;
  totalBenefitAmount: number;
  qualifyingReason: string;
}

/**
 * Calculates supplementary maternity leave for premature or hospitalized infants (Art. 180² KP).
 * 
 * Reguły kwalifikacji:
 * 1. Skrajne wcześniaki (< 28. tydzień ciąży LUB waga <= 1000 g):
 *    - Max do 15 tygodni uzupełniającego urlopu.
 * 2. Wcześniaki średnie (28-36 tydzień ciąży ORAZ waga > 1000 g):
 *    - Max do 8 tygodni uzupełniającego urlopu.
 * 3. Dzieci urodzone o czasie (od 37. tygodnia) wymagające hospitalizacji:
 *    - Warunek: pobyt min. 2 kolejne dni w oknie między 5. a 28. dniem po porodzie.
 *    - Max do 8 tygodni uzupełniającego urlopu.
 * 
 * Reguła matematyczna ceil (Art. 180² § 3 KP):
 * - 1 tydzień urlopu za każdy tydzień hospitalizacji.
 * - Niepełny tydzień zaokrągla się w górę: Math.ceil(hospitalDaysTotal / 7).
 * - Stawka zasiłku wynosi ZAWSZE 100% podstawy wymiaru.
 */
export function calculateSupplementaryLeave(
  input: SupplementaryLeaveInput,
  dailyBaseAmount: number,
  netBaseMonthly: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): SupplementaryLeaveResult {
  if (!input.isPrematureOrHospitalized || !input.hospitalDaysTotal || input.hospitalDaysTotal <= 0) {
    return {
      isEligible: false,
      maxPermittedWeeks: 0,
      hospitalWeeksCalculated: 0,
      weeksGranted: 0,
      daysGranted: 0,
      ratePercent: 100,
      dailyBenefitAmount: 0,
      monthlyBenefitAmount: 0,
      totalBenefitAmount: 0,
      qualifyingReason: 'Brak wcześniactwa lub hospitalizacji noworodka',
    };
  }

  const birthWeek = input.birthWeek ?? 40;
  const weight = input.birthWeightGrams ?? 3500;
  let maxPermittedWeeks = 0;
  let qualifyingReason = '';

  // Kategoria 1: Skrajne wcześniaki (< 28 tyg. LUB waga <= 1000g)
  if (birthWeek < 28 || weight <= 1000) {
    maxPermittedWeeks = params.supplementaryPre28OrWeightUnder1000MaxWeeks; // 15
    qualifyingReason = 'Urodzenie przed 28. tygodniem ciąży lub masa urodzeniowa <= 1000g (limit do 15 tyg.)';
  }
  // Kategoria 2: Wcześniaki średnie (28-36 tyg. i waga > 1000g)
  else if (birthWeek >= 28 && birthWeek < 37) {
    maxPermittedWeeks = params.supplementaryBetween28And37WeightOver1000MaxWeeks; // 8
    qualifyingReason = 'Urodzenie między 28. a 36. tygodniem ciąży z masą > 1000g (limit do 8 tyg.)';
  }
  // Kategoria 3: Dzieci urodzone o czasie (>= 37 tyg.)
  else if (birthWeek >= 37) {
    if (input.hospitalizationConsecutiveMin2DaysBetweenDay5And28) {
      maxPermittedWeeks = params.supplementaryPost37HospitalizedMaxWeeks; // 8
      qualifyingReason = 'Hospitalizacja min. 2 kolejne dni między 5. a 28. dniem po porodzie (limit do 8 tyg.)';
    } else {
      return {
        isEligible: false,
        maxPermittedWeeks: 0,
        hospitalWeeksCalculated: 0,
        weeksGranted: 0,
        daysGranted: 0,
        ratePercent: 100,
        dailyBenefitAmount: 0,
        monthlyBenefitAmount: 0,
        totalBenefitAmount: 0,
        qualifyingReason: 'Urodzenie po 37. tyg. bez spełnienia warunku 2 kolejnych dni hospitalizacji między 5. a 28. dniem życia',
      };
    }
  }

  // Reguła zaokrąglenia w górę (ceil)
  const hospitalWeeksCalculated = Math.ceil(input.hospitalDaysTotal / 7);
  const weeksGranted = Math.min(hospitalWeeksCalculated, maxPermittedWeeks);
  const daysGranted = weeksGranted * 7;

  const ratePercent = params.maternityStandardRatePercent; // 100%
  const dailyBenefitAmount = Math.round(dailyBaseAmount * (ratePercent / 100) * 100) / 100;
  const monthlyBenefitAmount = Math.round(netBaseMonthly * (ratePercent / 100) * 100) / 100;
  const totalBenefitAmount = Math.round(dailyBenefitAmount * daysGranted * 100) / 100;

  return {
    isEligible: weeksGranted > 0,
    maxPermittedWeeks,
    hospitalWeeksCalculated,
    weeksGranted,
    daysGranted,
    ratePercent,
    dailyBenefitAmount,
    monthlyBenefitAmount,
    totalBenefitAmount,
    qualifyingReason,
  };
}
