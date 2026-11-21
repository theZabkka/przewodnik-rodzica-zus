import { Z3Certificate, Z3SalaryMonth, WorkSharingSchedule } from '../types';

const MONTH_NAMES_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

/**
 * Generuje zaświadczenie płatnika składek ZUS Z-3 z zestawieniem 12 miesięcy.
 * Zgodnie z art. 3 pkt 3 i art. 36-47 ustawy zasiłkowej, podstawa wymiaru
 * to średnie wynagrodzenie brutto z 12 miesięcy kalendarzowych poprzedzających miesiąc powstania niezdolności,
 * pomniejszone o kwotę odpowiadającą 13,71% (składki finansowane przez pracownika).
 */
export function generateZ3Certificate(
  employerName: string,
  employerNip: string,
  employeeName: string,
  employeePesel: string,
  monthlyGross: number,
  employeePosition = 'Specjalista'
): Z3Certificate {
  const currentYear = 2026;
  const currentMonthIdx = 10; // Listopad (indeks 10)

  const months: Z3SalaryMonth[] = [];
  let totalGross = 0;
  let totalBase = 0;

  for (let i = 12; i >= 1; i--) {
    let mIdx = currentMonthIdx - i;
    let year = currentYear;
    if (mIdx < 0) {
      mIdx += 12;
      year -= 1;
    }
    const deduction = monthlyGross * 0.1371;
    const netBase = monthlyGross - deduction;

    months.push({
      monthName: MONTH_NAMES_PL[mIdx],
      year,
      grossAmount: monthlyGross,
      pensionAndDisabilityDeduction: Number(deduction.toFixed(2)),
      netBenefitBase: Number(netBase.toFixed(2)),
    });

    totalGross += monthlyGross;
    totalBase += netBase;
  }

  const averageMonthlyGross = totalGross / 12;
  const averageMonthlyBase = totalBase / 12;
  const dailyBenefitBase = averageMonthlyBase / 30;

  return {
    employerName,
    employerNip,
    employeeName,
    employeePesel,
    employeePosition,
    months,
    averageMonthlyGross: Number(averageMonthlyGross.toFixed(2)),
    averageMonthlyBase: Number(averageMonthlyBase.toFixed(2)),
    dailyBenefitBase: Number(dailyBenefitBase.toFixed(2)),
  };
}

/**
 * Oblicza harmonogram proporcjonalnego wydłużenia urlopu rodzicielskiego
 * przy łączeniu urlopu z pracą na część etatu (art. 182¹ᶠ Kodeksu pracy).
 * Urlop rodzicielski ulega wydłużeniu proporcjonalnie do wymiaru czasu pracy
 * (np. 16 tygodni na 1/2 etatu wydłuża urlop o kolejne 8 tygodni pełnego urlopu).
 */
export function calculateWorkSharingSchedule(
  childName: string,
  parentName: string,
  baseParentalWeeks = 32,
  fteRatio = 0.5,
  workWeeksCount = 16,
  monthlyGross = 6000
): WorkSharingSchedule {
  // Wydłużenie urlopu = liczba tygodni pracy * wymiar etatu
  const extensionWeeksCount = Math.round(workWeeksCount * fteRatio);
  const totalParentalWeeksAfterExtension = baseParentalWeeks + extensionWeeksCount;

  // Finanse:
  // Wynagrodzenie za pracę (np. 1/2 z 6000 zł = 3000 zł/miesiąc => 750 zł/tydzień)
  const monthlyWorkPay = monthlyGross * fteRatio;
  const weeklySalaryAmount = (monthlyWorkPay * 12) / 52;

  // Zasiłek macierzyński pomniejszony proporcjonalnie o wymiar czasu pracy
  // (art. 31 ust. 4b ustawy zasiłkowej: kwota zasiłku ulega pomniejszeniu proporcjonalnie do wymiaru etatu)
  const baseNet = monthlyGross * (1 - 0.1371);
  const fullMonthlyBenefit = baseNet * 0.815;
  const reducedMonthlyBenefit = fullMonthlyBenefit * (1 - fteRatio);
  const weeklyBenefitAmount = (reducedMonthlyBenefit * 12) / 52;

  return {
    childName,
    parentName,
    baseParentalWeeks,
    fteRatio,
    workWeeksCount,
    extensionWeeksCount,
    totalParentalWeeksAfterExtension,
    weeklySalaryAmount: Number(weeklySalaryAmount.toFixed(2)),
    weeklyBenefitAmount: Number(weeklyBenefitAmount.toFixed(2)),
    totalWeeklyCombinedIncome: Number((weeklySalaryAmount + weeklyBenefitAmount).toFixed(2)),
  };
}