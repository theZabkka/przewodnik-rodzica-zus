import { LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface ParentalLeaveResult {
  totalWeeks: number;
  totalDays: number;
  motherMaxWeeks: number;
  motherMaxDays: number;
  fatherReservedWeeks: number;
  fatherReservedDays: number;
  motherRatePercent: number;
  fatherReservedRatePercent: number;
  dailyBenefitAmountMom: number;
  dailyBenefitAmountDadReserved: number;
  monthlyBenefitAmountMom: number;
  monthlyBenefitAmountDadReserved: number;
  totalBenefitAmountMom: number;
  totalBenefitAmountDadReserved: number;
  totalBenefitAmountCombined: number;
  equalizationRatePercentIfUnused: number; // 18,5% wyrównanie do 100%
}

/**
 * Calculates parental leave dimensions and benefits (Art. 182¹ᵃ Kodeksu pracy).
 * 
 * Reguły wymiaru urlopu rodzicielskiego:
 * - 1 dziecko: 41 tygodni
 * - 2+ dzieci (wieloraczki): 43 tygodnie
 * - 1 dziecko z zaświadczeniem „Za życiem”: 65 tygodni
 * - 2+ dzieci z zaświadczeniem „Za życiem”: 67 tygodni
 * 
 * Niezbywalne 9 tygodni dla ojca:
 * - Każdemu z rodziców przysługuje 9 tygodni wyłącznego, nieprzenoszalnego urlopu.
 * - Pula maksymalna dla matki: łączny wymiar minus 9 tygodni (np. 32 lub 56 tyg.).
 * 
 * Stawki procentowe:
 * - 9 tygodni zarezerwowane dla ojca wynosi ZAWSZE 70% podstawy (nigdy 81,5%).
 * - Pula matki: 81,5% przy wniosku w 21 dni, lub 70% w wariancie standardowym.
 * - Wyrównanie do 100% (art. 31 ust. 4 ustawy): 18,5% dopłaty za okres macierzyńskiego
 *   jeśli matka nie skorzysta z rodzicielskiego w pierwszym roku.
 */
export function calculateParentalLeave(
  childrenCount: number,
  hasLifeCertificate: boolean,
  submissionWithin21Days: boolean,
  dailyBaseAmount: number,
  netBaseMonthly: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): ParentalLeaveResult {
  let totalWeeks = childrenCount > 1 ? params.parentalWeeksMultiple : params.parentalWeeksSingle;

  if (hasLifeCertificate) {
    totalWeeks = childrenCount > 1
      ? params.parentalWeeksMultipleLifeCertificate
      : params.parentalWeeksSingleLifeCertificate;
  }

  const fatherReservedWeeks = params.parentalNonTransferableWeeksPerParent; // 9 tygodni
  const motherMaxWeeks = Math.max(0, totalWeeks - fatherReservedWeeks);

  const totalDays = totalWeeks * 7;
  const motherMaxDays = motherMaxWeeks * 7;
  const fatherReservedDays = fatherReservedWeeks * 7;

  // Stawki
  const motherRatePercent = submissionWithin21Days
    ? params.unifiedApplicationRatePercent
    : params.parentalStandardRatePercent;

  // Stawka dla ojca za 9 tygodni ZAWSZE 70%
  const fatherReservedRatePercent = params.dadReservedParentalRatePercent;

  const momFactor = motherRatePercent / 100;
  const dadFactor = fatherReservedRatePercent / 100;

  const dailyBenefitAmountMom = Math.round(dailyBaseAmount * momFactor * 100) / 100;
  const dailyBenefitAmountDadReserved = Math.round(dailyBaseAmount * dadFactor * 100) / 100;

  const monthlyBenefitAmountMom = Math.round(netBaseMonthly * momFactor * 100) / 100;
  const monthlyBenefitAmountDadReserved = Math.round(netBaseMonthly * dadFactor * 100) / 100;

  const totalBenefitAmountMom = Math.round(dailyBenefitAmountMom * motherMaxDays * 100) / 100;
  const totalBenefitAmountDadReserved = Math.round(dailyBenefitAmountDadReserved * fatherReservedDays * 100) / 100;
  const totalBenefitAmountCombined = Math.round((totalBenefitAmountMom + totalBenefitAmountDadReserved) * 100) / 100;

  const equalizationRatePercentIfUnused = submissionWithin21Days
    ? Math.round((params.maternityStandardRatePercent - params.unifiedApplicationRatePercent) * 10) / 10
    : 0;

  return {
    totalWeeks,
    totalDays,
    motherMaxWeeks,
    motherMaxDays,
    fatherReservedWeeks,
    fatherReservedDays,
    motherRatePercent,
    fatherReservedRatePercent,
    dailyBenefitAmountMom,
    dailyBenefitAmountDadReserved,
    monthlyBenefitAmountMom,
    monthlyBenefitAmountDadReserved,
    totalBenefitAmountMom,
    totalBenefitAmountDadReserved,
    totalBenefitAmountCombined,
    equalizationRatePercentIfUnused,
  };
}
