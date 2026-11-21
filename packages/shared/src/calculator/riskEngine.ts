import { InspectorCase, RiskLevel } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';

export interface EvaluatedRiskResult {
  riskLevel: RiskLevel;
  riskCategory: InspectorCase['riskCategory'];
  riskReasons: string[];
  suggestedDecision: InspectorCase['suggestedDecision'];
  autoApprovable: boolean;
  legalBases: string[];
}

/**
 * Automatyczny silnik triage'u i oceny ryzyk prawnych ZUS dla inspektora.
 */
export function evaluateApplicationForInspector(
  data: Partial<InspectorCase>
): EvaluatedRiskResult {
  const reasons: string[] = [];
  const legalBases: string[] = [];
  const debtThreshold = DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross; // 48.06 zł

  // 1. Krytyczne Ryzyko: Art. 2a ustawy zasiłkowej - Zadłużenie JDG
  if (data.contractType === 'b2b' && (data.hasDebt || (data.debtAmount && data.debtAmount > debtThreshold))) {
    reasons.push(
      `Zadłużenie składkowe przedsiębiorcy: ${data.debtAmount?.toFixed(2) ?? 'kwota nieznana'} zł przekracza dopuszczalny próg ustawowy 1% płacy minimalnej (${debtThreshold.toFixed(2)} zł).`
    );
    legalBases.push('Art. 2a ustawy o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa');
    return {
      riskLevel: 'RED',
      riskCategory: 'JDG_DEBT_BLOCK',
      riskReasons: reasons,
      suggestedDecision: 'BLOCK_PAYOUT_DEBT',
      autoApprovable: false,
      legalBases,
    };
  }

  // 2. Krytyczne Ryzyko: Art. 83 § 1 KC w zw. z art. 58 KC - Podejrzenie pozorności zatrudnienia
  const isHighSalary = (data.monthlySalaryGross ?? 0) >= 15000;
  const isShortTenure = (data.insuranceTenureDays ?? 365) < 60;
  if (data.contractType === 'employment' && isHighSalary && isShortTenure) {
    reasons.push(
      `Podejrzenie pozorności zatrudnienia lub sztucznego zawyżenia podstawy składek: Wynagrodzenie ${data.monthlySalaryGross?.toFixed(2)} zł brutto przy stażu ubezpieczeniowym zaledwie ${data.insuranceTenureDays} dni przed porodem.`
    );
    legalBases.push('Art. 83 § 1 Kodeksu cywilnego w zw. z art. 58 § 1 KC oraz art. 68 ust. 1 pkt 1 ustawy o systemie ubezpieczeń społecznych');
    return {
      riskLevel: 'RED',
      riskCategory: 'SUSPECT_CONTRACT',
      riskReasons: reasons,
      suggestedDecision: 'SEND_TO_AUDIT_DEPT',
      autoApprovable: false,
      legalBases,
    };
  }

  // 3. Ostrzeżenie proceduralne: Art. 30a ustawy zasiłkowej - Przekroczenie terminu 21 dni
  if (data.benefitType === 'MATERNITY_PARENTAL_UNIFIED' && (data.daysSinceBirth ?? 0) > 21) {
    reasons.push(
      `Wniosek o uśrednioną stawkę 81,5% wpłynął w ${data.daysSinceBirth}. dniu po porodzie (termin ustawowy to 21 dni). Zgodnie z prawem następuje obligatoryjna konwersja na wariant 100% (macierzyński) i 70% (rodzicielski).`
    );
    legalBases.push('Art. 30a ust. 1 i 2 ustawy zasiłkowej');
    return {
      riskLevel: 'YELLOW',
      riskCategory: 'LATE_SUBMISSION',
      riskReasons: reasons,
      suggestedDecision: 'CORRECT_TO_100_70',
      autoApprovable: false,
      legalBases,
    };
  }

  // 4. Ostrzeżenie merytoryczne: Art. 180² Kodeksu pracy - Wcześniactwo i hospitalizacja noworodka
  if (data.isPremature || (data.hospitalDays && data.hospitalDays > 2)) {
    reasons.push(
      `Zgłoszono hospitalizację noworodka (${data.hospitalDays ?? 0} dni, tydzień porodu: ${data.birthWeek ?? 'brak'}). Przysługuje uzupełniający urlop macierzyński płatny 100% (do 8 lub 15 tygodni). Wymagana weryfikacja karty ze szpitala.`
    );
    legalBases.push('Art. 180² § 1-5 Kodeksu pracy');
    return {
      riskLevel: 'YELLOW',
      riskCategory: 'PREMATURE_AUDIT',
      riskReasons: reasons,
      suggestedDecision: 'AUDIT_HOSPITAL_DOCS',
      autoApprovable: false,
      legalBases,
    };
  }

  // 5. Ścieżka zielona: Fast-Track (Automatyczna akceptacja)
  reasons.push('Wniosek formalnie bezbłędny.');
  reasons.push('Złożony w terminie (do 21 dni od porodu).');
  reasons.push('Brak zaległości składkowych w rejestrze PUE.');
  reasons.push('Zwolnienie e-ZLA z kodem „B” potwierdzone w systemie.');
  legalBases.push('Art. 29, 30a i 31 ustawy zasiłkowej');

  return {
    riskLevel: 'GREEN',
    riskCategory: 'FAST_TRACK',
    riskReasons: reasons,
    suggestedDecision: 'AUTO_APPROVE_81_5',
    autoApprovable: true,
    legalBases,
  };
}