import { LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface PaternityLeaveResult {
  totalWeeks: number;
  totalDays: number;
  ratePercent: number; // 100%
  dailyBenefitAmount: number;
  totalBenefitAmount: number;
  maxChildAgeMonths: number;
  minPartDays: number;
  maxPartsCount: number;
}

/**
 * Calculates paternity leave dimensions and benefits (Art. 182³ Kodeksu pracy).
 * 
 * Reguły:
 * - Wymiar: 2 tygodnie (14 dni kalendarzowych, wliczając weekendy).
 * - Stawka: 100% podstawy wymiaru.
 * - Wyłączne i samodzielne prawo ojca, niezależne od ubezpieczenia i uprawnień matki.
 * - Ważność: do ukończenia przez dziecko 12. miesiąca życia.
 * - Podział: jednorazowo (14 dni) albo w 2 częściach po minimum 7 dni każda.
 */
export function calculatePaternityLeave(
  dailyBaseAmount: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): PaternityLeaveResult {
  const totalWeeks = params.paternityWeeks; // 2
  const totalDays = totalWeeks * 7; // 14
  const ratePercent = params.maternityStandardRatePercent; // 100%

  const dailyBenefitAmount = Math.round(dailyBaseAmount * (ratePercent / 100) * 100) / 100;
  const totalBenefitAmount = Math.round(dailyBenefitAmount * totalDays * 100) / 100;

  return {
    totalWeeks,
    totalDays,
    ratePercent,
    dailyBenefitAmount,
    totalBenefitAmount,
    maxChildAgeMonths: params.paternityMaxChildAgeMonths, // 12
    minPartDays: 7,
    maxPartsCount: 2,
  };
}
