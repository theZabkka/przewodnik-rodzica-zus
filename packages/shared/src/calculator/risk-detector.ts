import { BenefitCalculationInput, LegislativeParameters, RiskWarning } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

/**
 * Detects statutory, financial, and procedural risks in parental benefit applications.
 */
export function detectRiskWarnings(
  input: BenefitCalculationInput,
  hasDebtExceedingThreshold?: boolean,
  debtAmount?: number,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): RiskWarning[] {
  const warnings: RiskWarning[] = [];

  // Ryzyko 1: Zadłużenie ze składek dla przedsiębiorców (JDG / współpraca)
  if (input.contractType === 'b2b') {
    const isExplicitDebt = hasDebtExceedingThreshold === true || (debtAmount !== undefined && debtAmount > params.jdgDebtThresholdGross);
    warnings.push({
      code: isExplicitDebt ? 'JDG_DEBT_BLOCK' : 'JDG_DEBT_VERIFICATION_REQUIRED',
      severity: isExplicitDebt ? 'danger' : 'warning',
      title: isExplicitDebt
        ? 'Wstrzymanie wypłaty świadczeń z powodu zaległości składkowych'
        : 'Weryfikacja stanu zadłużenia z tytułu składek ZUS (próg 48,06 zł)',
      description: isExplicitDebt
        ? `Stwierdzono zaległość z tytułu składek ZUS przekraczającą 1% płacy minimalnej (${params.jdgDebtThresholdGross.toFixed(2)} zł). Zgodnie z art. 2a ustawy zasiłkowej wypłata zasiłku zostaje wstrzymana. Uregulowanie zadłużenia w ciągu 6 miesięcy od dnia powstania prawa pozwoli na wypłatę świadczenia wstecz. Po 6 miesiącach prawo do zasiłku bezpowrotnie przedawnia się!`
        : `Dla osób prowadzących działalność gospodarczą (JDG) warunkiem wypłaty zasiłku jest brak zadłużenia z tytułu składek przekraczającego 1% minimalnego wynagrodzenia (${params.jdgDebtThresholdGross.toFixed(2)} zł) na dzień powstania prawa do świadczenia. Zaległość powyżej tej kwoty powoduje wstrzymanie wypłaty zasiłku.`,
      legalBasis: 'Art. 2a ustawy o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa',
    });
  }

  // Ryzyko 2: Przekroczenie terminu 21 dni na wniosek o uśrednioną stawkę 81,5%
  if (!input.submissionWithin21Days && input.parentRole === 'mother') {
    warnings.push({
      code: 'DEADLINE_21_DAYS_EXCEEDED',
      severity: 'warning',
      title: 'Utrata prawa do uśrednionej stawki zasiłku 81,5%',
      description: 'Niezłożenie wniosku ZAM w terminie 21 dni po porodzie oznacza brak możliwości pobierania uśrednionego zasiłku 81,5% przez cały okres. Wypłata nastąpi w wariancie standardowym: 100% za urlop macierzyński oraz 70% za urlop rodzicielski.',
      legalBasis: 'Art. 30a ust. 1 ustawy zasiłkowej',
    });
  }

  // Ryzyko 3: Niezbywalne 9 tygodni dla ojca – ryzyko utraty części urlopu
  warnings.push({
    code: 'DAD_9_WEEKS_RESERVED',
    severity: 'info',
    title: 'Nieprzenoszalne 9 tygodni urlopu rodzicielskiego dla drugiego rodzica',
    description: 'Pamiętaj: 9 tygodni urlopu rodzicielskiego przysługuje wyłącznie drugiemu rodzicowi (zazwyczaj tacie) i wynosi 70% podstawy. Prawa tego nie można przenieść na matkę. Jeżeli ojciec nie wykorzysta tych 9 tygodni do końca roku 6. r.ż. dziecka, pula ta bezpowrotnie przepada.',
    legalBasis: 'Art. 182¹ᵃ § 4 Kodeksu pracy',
  });

  // Ryzyko 4: Urlop ojcowski – termin 12 miesięcy
  if (input.includePaternityLeave || input.parentRole === 'father') {
    warnings.push({
      code: 'PATERNITY_LEAVE_EXPIRATION',
      severity: 'info',
      title: 'Termin ważności urlopu ojcowskiego (12 miesięcy)',
      description: 'Urlop ojcowski (14 dni płatne 100%) musi zostać wykorzystany w całości przed ukończeniem przez dziecko 12. miesiąca życia. Po pierwszych urodzinach dziecka prawo do urlopu wygasa.',
      legalBasis: 'Art. 182³ § 1 Kodeksu pracy',
    });
  }

  // Ryzyko 5: Brak okresu wyczekiwania na macierzyński (pozytywna informacja)
  if (input.contractType !== 'employment') {
    warnings.push({
      code: 'MATERNITY_NO_WAITING_PERIOD',
      severity: 'info',
      title: 'Brak okresu wyczekiwania na zasiłek macierzyński',
      description: 'W odróżnieniu od L4 chorobowego (gdzie dla zlecenia i JDG wymagane jest 90 dni karencji), zasiłek macierzyński przysługuje od 1. dnia podlegania ubezpieczeniu chorobowemu – warunkiem jest podleganie ubezpieczeniu w dniu porodu.',
      legalBasis: 'Art. 29 ust. 1 ustawy zasiłkowej',
    });
  }

  return warnings;
}
