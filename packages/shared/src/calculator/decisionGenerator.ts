import { InspectorCase } from '../types';

export interface GeneratedDecision {
  formalText: string;
  plainLanguageText: string;
  signature: string;
  generatedDate: string;
  caseSignature: string;
}

export function generateAdministrativeDecision(
  caseData: InspectorCase,
  officerName = 'mgr Monika Kowalska'
): GeneratedDecision {
  const dateStr = new Date().toLocaleDateString('pl-PL');
  const caseSig = caseData.caseNumber || `ZUS/2026/ZAM/${Math.floor(10000 + Math.random() * 90000)}`;
  const signature = `Główny Specjalista ds. Świadczeń Krótkoterminowych: ${officerName} (Certyfikat ZUS-KWAL-${Math.floor(1000 + Math.random() * 9000)})`;

  // Kwoty orientacyjne
  const baseNet = caseData.monthlySalaryGross * (1 - 0.1371);
  const dailyRate815 = (baseNet / 30) * 0.815;
  const monthly815 = dailyRate815 * 30;

  let formalDecision = '';
  let plainDecision = '';

  if (caseData.status === 'BLOCKED' || caseData.riskCategory === 'JDG_DEBT_BLOCK') {
    formalDecision = `ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
I Oddział w Warszawie • Wydział Zasiłków
Znak sprawy: ${caseSig}
Warszawa, dn. ${dateStr} r.

DECYZJA O WSTRZYMANIU WYPŁATY ZASIŁKU MACIERZYŃSKIEGO

Na podstawie art. 2a ustawy z dnia 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa (Dz.U. z 2023 r. poz. 2780 ze zm.) oraz art. 104 Kodeksu postępowania administracyjnego,

ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
postanawia wstrzymać wypłatę zasiłku macierzyńskiego dla ubezpieczonej:
${caseData.applicantName}, PESEL: ${caseData.pesel}.

UZASADNIENIE:
Zgodnie z art. 2a powołanej ustawy, zasiłek z ubezpieczenia chorobowego nie przysługuje osobom prowadzącym pozarolniczą działalność w przypadku wystąpienia zadłużenia z tytułu składek na ubezpieczenia społeczne na kwotę przekraczającą 1% minimalnego wynagrodzenia za pracę (próg 2026: 48,06 zł).
W rejestrze ZUS stwierdzono zaległość w kwocie ${caseData.debtAmount?.toFixed(2) ?? '350.00'} zł. Wypłata świadczenia zostaje wstrzymana do momentu całkowitej spłaty zadłużenia.
Płatnik ma 6 miesięcy od dnia powstania prawa na uregulowanie zadłużenia pod rygorem bezpowrotnego przedawnienia prawa do świadczenia.

POUCZENIE:
Od niniejszej decyzji przysługuje odwołanie do Sądu Rejonowego – Sądu Pracy i Ubezpieczeń Społecznych za pośrednictwem Oddziału ZUS w terminie 30 dni od dnia jej doręczenia.`;

    plainDecision = `Dzień dobry, Pani/Panie ${caseData.applicantName},

Piszemy, aby poinformować o statusie wniosku o zasiłek macierzyński (sprawa nr ${caseSig}).

Dlaczego wypłata jest wstrzymana?
W naszym systemie odnotowaliśmy zaległość w opłacaniu składek w wysokości ${caseData.debtAmount?.toFixed(2) ?? '350.00'} zł. Przepisy prawa nakazują nam wstrzymać wypłatę zasiłku, jeśli dług przekracza 48,06 zł.

Co możesz zrobić, aby natychmiast otrzymać pieniądze?
1. Spłać zaległość ${caseData.debtAmount?.toFixed(2) ?? '350.00'} zł na swój indywidualny rachunek składkowy (NRS) w banku lub przez aplikację mObywatel / portal eZUS.
2. Po zaksięgowaniu wpłaty system automatycznie odblokuje wypłatę należnego zasiłku wstecz od pierwszego dnia urlopu!
3. Masz na to 6 miesięcy.

W razie pytań zadzwoń na naszą infolinię: 22 560 16 00. Chętnie pomożemy!`;
  } else if (caseData.riskCategory === 'SUSPECT_CONTRACT') {
    formalDecision = `ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
Znak sprawy: ${caseSig}
Warszawa, dn. ${dateStr} r.

POSTANOWIENIE O WSZCZĘCIU POSTĘPOWANIA KONTROLNEGO

Na podstawie art. 83 ust. 1 pkt 1 i art. 86 ust. 1 i 2 ustawy z dnia 13 października 1998 r. o systemie ubezpieczeń społecznych,
ZUS wszczyna postępowanie wyjaśniające w sprawie ustalenia prawidłowości zgłoszenia do ubezpieczeń oraz zasadności podstawy wymiaru składek ${caseData.monthlySalaryGross.toFixed(2)} zł u płatnika ${caseData.employerName} (NIP: ${caseData.employerNip}) wobec ubezpieczonej: ${caseData.applicantName}.`;

    plainDecision = `Dzień dobry,
Twój wniosek trafił do standardowej procedury weryfikacyjnej. Ponieważ umowa została zgłoszona krótko przed porodem, nasz wydział poprosi pracodawcę o przesłanie potwierdzenia zakresu obowiązków i obecności w pracy. Po otrzymaniu dokumentów niezwłocznie wydamy decyzję.`;
  } else {
    // Standardowa akceptacja (Fast-Track)
    formalDecision = `ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
I Oddział w Warszawie • Wydział Zasiłków
Znak sprawy: ${caseSig}
Warszawa, dn. ${dateStr} r.

DECYZJA O PRZYZNANIU ZASIŁKU MACIERZYŃSKIEGO

Na podstawie art. 29, art. 30a ust. 1 oraz art. 31 ustawy z dnia 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa,

ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
przyznaje ubezpieczonej: ${caseData.applicantName}, PESEL: ${caseData.pesel}
prawo do zasiłku macierzyńskiego za okres urlopu macierzyńskiego oraz urlopu rodzicielskiego:

1. Wskaźnik wysokości świadczenia: 81,5% podstawy wymiaru za cały okres (wniosek w terminie 21 dni).
2. Miesięczna podstawa wymiaru: ${caseData.monthlySalaryGross.toFixed(2)} zł brutto.
3. Podstawa po odliczeniu 13,71%: ${baseNet.toFixed(2)} zł.
4. Dzienna stawka zasiłku (81,5%): ${dailyRate815.toFixed(2)} zł/dzień.
5. Przewidywana kwota miesięczna: ${monthly815.toFixed(2)} zł brutto.
6. Wypłata nastąpi na wskazany rachunek bankowy ubezpieczonej.

POUCZENIE:
Decyzja jest ostateczna. Płatność realizowana w terminie do 30 dni od daty wpływu kompletnego wniosku.`;

    plainDecision = `Świetna wiadomość, Pani/Panie ${caseData.applicantName}!

Twój wniosek o zasiłek macierzyński (sprawa nr ${caseSig}) został pozytywnie rozpatrzony i zatwierdzony! 🎉

Najważniejsze informacje o Twojej wypłacie:
• Wybrany wariant: Zasiłek w równej wysokości 81,5% przez cały okres (macierzyński + rodzicielski).
• Twoja dzienna kwota świadczenia: ${dailyRate815.toFixed(2)} zł za każdy dzień kalendarzowy.
• Miesięcznie na Twoje konto trafi ok.: ${monthly815.toFixed(2)} zł brutto (pomniejszone jedynie o zaliczkę na podatek).
• Pieniądze przelejemy bezpośrednio na podany we wniosku numer rachunku bankowego.

Pamiętaj o urlopie dla drugiego rodzica:
Tata dziecka ma do dyspozycji 9 tygodni urlopu rodzicielskiego (płatne 70%), którego nie musisz oddawać ze swojej puli!`;
  }

  return {
    formalText: formalDecision,
    plainLanguageText: plainDecision,
    signature,
    generatedDate: dateStr,
    caseSignature: caseSig,
  };
}