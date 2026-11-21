import { ContractType, LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface BaseCalculationResult {
  grossMonthly: number;
  netBaseMonthly: number;
  dailyBaseAmount: number;
  isMinBaseApplied: boolean;
  isMaxBaseApplied: boolean;
  appliedDeductionPercent: number;
}

/**
 * Zaokrąglenie księgowe / urzędowe do 2 miejsc po przecinku (half-up)
 * chroniące przed błędami precyzji zmiennoprzecinkowej IEEE 754.
 */
export function roundCurrency(val: number): number {
  return Math.round(val * 100 + 1e-4) / 100;
}

/**
 * Calculates net calculation base (podstawa wymiaru) according to ZUS rules.
 * 
 * Reguły:
 * 1. Składki pracownicze: 13,71% (9,76% emerytalna + 1,5% rentowa + 2,45% chorobowa)
 * 2. Podstawa netto = Brutto * (1 - 0.1371) = Brutto * 0.8629
 * 3. Minimalna podstawa UoP (2026): 4 806.00 zł * 0.8629 = 4 147.10 zł
 * 4. Maksymalna podstawa JDG (2026): limit składki 23 550.00 zł -> limit podstawy 20 321.30 zł
 * 5. Stawka dzienna = Podstawa netto / 30 (zawsze dzielnik 30, art. 11 ust. 5 ustawy zasiłkowej)
 */
export function calculateNetBase(
  grossMonthly: number,
  contractType: ContractType,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): BaseCalculationResult {
  const deductionRate = params.employeeContributionDeductionPercent / 100;
  let cappedGross = grossMonthly;
  let isMaxBaseApplied = false;

  // Ograniczenie maksymalnej podstawy dla JDG (250% przeciętnego wynagrodzenia)
  if (contractType === 'b2b' && cappedGross > params.maxJdgMonthlyBaseGross) {
    cappedGross = params.maxJdgMonthlyBaseGross;
    isMaxBaseApplied = true;
  }

  // Obliczenie podstawy netto po odliczeniu składek finansowanych przez ubezpieczonego
  let netBase = roundCurrency(cappedGross * (1 - deductionRate));
  let isMinBaseApplied = false;

  // Gwarancja minimalnej podstawy dla pracowników na umowie o pracę (płaca minimalna minus 13,71%)
  if (contractType === 'employment') {
    const minNetBase = roundCurrency(params.minimalWageGross * (1 - deductionRate));
    if (netBase < minNetBase) {
      netBase = minNetBase;
      isMinBaseApplied = true;
    }
  }

  // Stawka dzienna: 1/30 podstawy miesięcznej
  const dailyBase = roundCurrency(netBase / params.dailyDivisor);

  return {
    grossMonthly,
    netBaseMonthly: netBase,
    dailyBaseAmount: dailyBase,
    isMinBaseApplied,
    isMaxBaseApplied,
    appliedDeductionPercent: params.employeeContributionDeductionPercent,
  };
}
