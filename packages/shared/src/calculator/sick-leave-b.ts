import { ContractType, LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface SickLeavePregnancyInput {
  sickDaysRequested: number;
  contractType: ContractType;
  isEmployeeUnder50?: boolean;
  daysAlreadyPaidByEmployerThisYear?: number;
}

export interface SickLeavePregnancyResult {
  totalDaysGranted: number;
  ratePercent: number; // 100%
  dailyBenefitAmount: number;
  totalAmountGross: number;
  employerPaidDays: number;
  employerPaidAmount: number;
  zusPaidDays: number;
  zusPaidAmount: number;
  maxZusAllowanceDays: number; // 270 dni
  waitingPeriodDays: number; // 30 dla UoP, 90 dla zlecenia/JDG
}

/**
 * Calculates sick leave benefit during pregnancy (kod e-ZLA "B").
 * 
 * Reguły:
 * - Wysokość: 100% podstawy wymiaru.
 * - Maksymalny okres zasiłkowy: 270 dni.
 * - Pracownik < 50 lat: pierwsze 33 dni w roku kalendarzowym finansuje pracodawca, od 34. dnia ZUS.
 * - Pracownik >= 50 lat: pierwsze 14 dni finansuje pracodawca, od 15. dnia ZUS.
 * - Niepracownicy: od 1. dnia finansuje ZUS.
 * - Okres wyczekiwania: 30 dni (UoP) / 90 dni (Zlecenie, JDG).
 */
export function calculateSickLeavePregnancy(
  input: SickLeavePregnancyInput,
  dailyBaseAmount: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): SickLeavePregnancyResult {
  const maxAllowanceDays = 270;
  const requestedDays = Math.min(input.sickDaysRequested, maxAllowanceDays);
  const ratePercent = params.sickLeavePregnancyRatePercent; // 100%
  const dailyBenefitAmount = Math.round(dailyBaseAmount * (ratePercent / 100) * 100) / 100;
  const totalAmountGross = Math.round(dailyBenefitAmount * requestedDays * 100) / 100;

  const isUnder50 = input.isEmployeeUnder50 ?? true;
  const employerQuotaDays = isUnder50 ? 33 : 14;
  const alreadyPaid = input.daysAlreadyPaidByEmployerThisYear ?? 0;

  let employerPaidDays = 0;
  let zusPaidDays = 0;

  if (input.contractType === 'employment') {
    const remainingEmployerDays = Math.max(0, employerQuotaDays - alreadyPaid);
    employerPaidDays = Math.min(requestedDays, remainingEmployerDays);
    zusPaidDays = requestedDays - employerPaidDays;
  } else {
    // JDG oraz Zleceniobiorcy: 100% finansuje ZUS od 1. dnia
    employerPaidDays = 0;
    zusPaidDays = requestedDays;
  }

  const employerPaidAmount = Math.round(dailyBenefitAmount * employerPaidDays * 100) / 100;
  const zusPaidAmount = Math.round(dailyBenefitAmount * zusPaidDays * 100) / 100;

  const waitingPeriodDays = input.contractType === 'employment'
    ? params.waitingPeriodEmploymentDays
    : params.waitingPeriodMandateOrB2bDays;

  return {
    totalDaysGranted: requestedDays,
    ratePercent,
    dailyBenefitAmount,
    totalAmountGross,
    employerPaidDays,
    employerPaidAmount,
    zusPaidDays,
    zusPaidAmount,
    maxZusAllowanceDays: maxAllowanceDays,
    waitingPeriodDays,
  };
}
