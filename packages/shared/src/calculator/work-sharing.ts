export interface WorkSharingInput {
  nominalParentalWeeks: number;
  fteRatio: number; // np. 0.5 (1/2 etatu)
  workWeeks?: number; // Tygodnie łączenia
  nominalRatePercent: number; // 70% lub 81.5%
  netBaseMonthly: number;
  dailyBaseAmount: number;
  grossSalaryMonthly: number;
  hasLifeCertificate: boolean;
  childrenCount: number;
}

export interface WorkSharingResult {
  isApplicable: boolean;
  fteRatioApplied: number;
  nominalParentalWeeks: number;
  extensionWeeksGranted: number;
  totalExtendedParentalWeeks: number;
  maxPermittedCapWeeks: number;
  reducedBenefitRatePercent: number;
  monthlyBenefitDuringWorkGross: number;
  monthlySalaryFromEmployerGross: number;
  totalMonthlyCombinedIncomeGross: number;
  totalBenefitPaidAcrossPeriod: number;
  nominalBenefitWithoutWork: number;
  benefitPreservationRatio: number; // Powinno wynosić 1.0 (100% zachowanej puli zasiłku)
}

/**
 * Calculates parental leave extension and reduced benefit when combining leave with part-time work (Art. 182¹ᶠ KP i Art. 31 ust. 4a ustawy).
 * 
 * Reguły:
 * 1. Dopuszczalny wymiar etatu: maksymalnie 1/2 pełnego wymiaru (0.5 FTE).
 * 2. Wydłużenie urlopu rodzicielskiego: iloczyn tygodni łączenia i wymiaru etatu.
 *    Wydłużenie = Tygodnie_pracy * Wymiar_etatu
 * 3. Ustawowe limity maksymalnego trwania urlopu po wydłużeniu (Art. 182¹ᶠ § 1 KP):
 *    - 1 dziecko: do 82 tygodni (41 * 2)
 *    - 2+ dzieci: do 86 tygodni (43 * 2)
 *    - 1 dziecko z zaświadczeniem „Za życiem”: do 130 tygodni (65 * 2)
 *    - 2+ dzieci z zaświadczeniem „Za życiem”: do 134 tygodni (67 * 2)
 * 4. Zmniejszenie zasiłku (Art. 31 ust. 4a ustawy zasiłkowej):
 *    Zasiłek ulega pomniejszeniu proporcjonalnie do wymiaru czasu pracy:
 *    Stawka_pomniejszona = Stawka_nominalna * (1 - Wymiar_etatu)
 *    (np. przy 1/2 etatu i stawce 70% pracownik otrzymuje 35% zasiłku + 50% pensji z umowy).
 */
export function calculateWorkSharing(input: WorkSharingInput): WorkSharingResult {
  const fte = Math.min(0.5, Math.max(0, input.fteRatio));
  if (fte <= 0) {
    return {
      isApplicable: false,
      fteRatioApplied: 0,
      nominalParentalWeeks: input.nominalParentalWeeks,
      extensionWeeksGranted: 0,
      totalExtendedParentalWeeks: input.nominalParentalWeeks,
      maxPermittedCapWeeks: input.hasLifeCertificate ? 130 : 82,
      reducedBenefitRatePercent: input.nominalRatePercent,
      monthlyBenefitDuringWorkGross: Math.round(input.netBaseMonthly * (input.nominalRatePercent / 100) * 100) / 100,
      monthlySalaryFromEmployerGross: input.grossSalaryMonthly,
      totalMonthlyCombinedIncomeGross: Math.round((input.grossSalaryMonthly + input.netBaseMonthly * (input.nominalRatePercent / 100)) * 100) / 100,
      totalBenefitPaidAcrossPeriod: Math.round(input.dailyBaseAmount * (input.nominalRatePercent / 100) * input.nominalParentalWeeks * 7 * 100) / 100,
      nominalBenefitWithoutWork: Math.round(input.dailyBaseAmount * (input.nominalRatePercent / 100) * input.nominalParentalWeeks * 7 * 100) / 100,
      benefitPreservationRatio: 1.0,
    };
  }

  // Maksymalny limit ustawowy
  let maxCap = input.childrenCount > 1 ? 86 : 82;
  if (input.hasLifeCertificate) {
    maxCap = input.childrenCount > 1 ? 134 : 130;
  }

  // Obliczenie wydłużenia przy ciągłym łączeniu pracy z urlopem
  const weeksToWork = input.workWeeks ?? input.nominalParentalWeeks;
  let totalExtendedWeeks = Math.round((weeksToWork / (1 - fte)) * 10) / 10;
  if (totalExtendedWeeks > maxCap) {
    totalExtendedWeeks = maxCap;
  }
  const extensionWeeksGranted = Math.round((totalExtendedWeeks - weeksToWork) * 10) / 10;

  // Stawka pomniejszona
  const reducedBenefitRatePercent = Math.round(input.nominalRatePercent * (1 - fte) * 100) / 100;
  const monthlyBenefitDuringWorkGross = Math.round(input.netBaseMonthly * (reducedBenefitRatePercent / 100) * 100) / 100;
  const monthlySalaryFromEmployerGross = Math.round(input.grossSalaryMonthly * fte * 100) / 100;
  const totalMonthlyCombinedIncomeGross = Math.round((monthlyBenefitDuringWorkGross + monthlySalaryFromEmployerGross) * 100) / 100;

  const totalExtendedDays = Math.round(totalExtendedWeeks * 7);
  const totalBenefitPaidAcrossPeriod = Math.round(input.dailyBaseAmount * (reducedBenefitRatePercent / 100) * totalExtendedDays * 100) / 100;
  const nominalBenefitWithoutWork = Math.round(input.dailyBaseAmount * (input.nominalRatePercent / 100) * input.nominalParentalWeeks * 7 * 100) / 100;

  const benefitPreservationRatio = nominalBenefitWithoutWork > 0
    ? Math.round((totalBenefitPaidAcrossPeriod / nominalBenefitWithoutWork) * 100) / 100
    : 1.0;

  return {
    isApplicable: true,
    fteRatioApplied: fte,
    nominalParentalWeeks: input.nominalParentalWeeks,
    extensionWeeksGranted,
    totalExtendedParentalWeeks: totalExtendedWeeks,
    maxPermittedCapWeeks: maxCap,
    reducedBenefitRatePercent,
    monthlyBenefitDuringWorkGross,
    monthlySalaryFromEmployerGross,
    totalMonthlyCombinedIncomeGross,
    totalBenefitPaidAcrossPeriod,
    nominalBenefitWithoutWork,
    benefitPreservationRatio,
  };
}
