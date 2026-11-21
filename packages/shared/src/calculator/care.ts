import { LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface CareLeaveInput {
  daysRequested: number;
  subjectAge: number;
  subjectIsDisabled?: boolean;
  hasOtherHouseholdCaregiver?: boolean;
  daysAlreadyUsedThisYear?: number;
}

export interface CareLeaveResult {
  isEligible: boolean;
  daysGranted: number;
  ratePercent: number; // 80%
  dailyBenefitAmount: number;
  totalBenefitAmountGross: number;
  categoryLimitDays: number; // 60, 30, lub 14 dni
  remainingFamilyDaysThisYear: number;
  ineligibilityReason?: string;
}

/**
 * Calculates care allowance (zasiłek opiekuńczy - Art. 32-35 ustawy zasiłkowej).
 * 
 * Reguły:
 * - Wysokość: 80% podstawy wymiaru.
 * - Limity roczne w roku kalendarzowym:
 *   * 60 dni: opieka nad chorym dzieckiem do 14 lat (lub zdrowym do 8 lat).
 *   * 30 dni: opieka nad chorym dzieckiem z niepełnosprawnością w wieku 14-18 lat.
 *   * 14 dni: opieka nad innym chorym członkiem rodziny (powyżej 14 lat).
 *   * ŁĄCZNY LIMIT ROCZNY: 60 dni na całą rodzinę.
 * - Warunek domownika: zasiłek nie przysługuje, jeśli inny domownik może zapewnić opiekę.
 *   WYJĄTEK: Chore dziecko do lat 2 – zasiłek przysługuje ZAWSZE!
 */
export function calculateCareLeave(
  input: CareLeaveInput,
  dailyBaseAmount: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): CareLeaveResult {
  const ratePercent = params.careLeaveRatePercent; // 80%
  const alreadyUsed = input.daysAlreadyUsedThisYear ?? 0;
  const familyLimitTotal = 60;
  const remainingTotalQuota = Math.max(0, familyLimitTotal - alreadyUsed);

  // Kwalifikacja limitu kategorii
  let categoryLimit = 14;
  if (input.subjectAge < 14) {
    categoryLimit = 60;
  } else if (input.subjectAge <= 18 && input.subjectIsDisabled) {
    categoryLimit = 30;
  }

  // Weryfikacja warunku obecności innych domowników
  // Wyjątek: chore dziecko poniżej 2 lat ma prawo zawsze
  if (input.subjectAge >= 2 && input.hasOtherHouseholdCaregiver) {
    return {
      isEligible: false,
      daysGranted: 0,
      ratePercent,
      dailyBenefitAmount: 0,
      totalBenefitAmountGross: 0,
      categoryLimitDays: categoryLimit,
      remainingFamilyDaysThisYear: remainingTotalQuota,
      ineligibilityReason: 'We wspólnym gospodarstwie domowym przebywa inny członek rodziny mogący zapewnić opiekę (wyjątek dotyczy tylko chorych dzieci do 2. roku życia).',
    };
  }

  const allowableDays = Math.min(input.daysRequested, categoryLimit, remainingTotalQuota);
  const dailyBenefitAmount = Math.round(dailyBaseAmount * (ratePercent / 100) * 100) / 100;
  const totalBenefitAmountGross = Math.round(dailyBenefitAmount * allowableDays * 100) / 100;

  return {
    isEligible: allowableDays > 0,
    daysGranted: allowableDays,
    ratePercent,
    dailyBenefitAmount,
    totalBenefitAmountGross,
    categoryLimitDays: categoryLimit,
    remainingFamilyDaysThisYear: Math.max(0, remainingTotalQuota - allowableDays),
  };
}
