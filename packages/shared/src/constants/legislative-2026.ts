import { LegislativeParameters, ZusTestCase } from '../types';

/**
 * Default Statutory Parameters for Year 2026
 * Single Source of Truth for ZUS Parental Benefit Calculations
 */
export const DEFAULT_LEGISLATIVE_2026: LegislativeParameters = {
  minimalWageGross: 4806.00, // Minimalne wynagrodzenie w 2026 r.
  employeeContributionDeductionPercent: 13.71, // 9.76% emerytalna + 1.5% rentowa + 2.45% chorobowa
  dailyDivisor: 30, // 1/30 podstawy za 1 dzień zasiłku (art. 11 ust. 5 i art. 31 ust. 5)
  maxJdgMonthlyBaseGross: 23550.00, // 250% przeciętnego wynagrodzenia
  jdgDebtThresholdGross: 48.06, // 1% z 4 806.00 zł
  funeralBenefitAmount: 7000.00, // Kwota zasiłku pogrzebowego w 2026 r.

  // Stawki procentowe
  maternityStandardRatePercent: 100,
  parentalStandardRatePercent: 70,
  unifiedApplicationRatePercent: 81.5,
  dadReservedParentalRatePercent: 70,
  sickLeavePregnancyRatePercent: 100, // L4 w ciąży z kodem B
  careLeaveRatePercent: 80, // Zasiłek opiekuńczy

  // Macierzyński (tygodnie)
  maternityWeeksSingle: 20,
  maternityWeeksTwins: 31,
  maternityWeeksTriplets: 33,
  maternityWeeksQuadruplets: 35,
  maternityWeeksQuintupletsPlus: 37,
  maternityMomObligatoryWeeks: 14, // Minimum wykorzystywane przez matkę

  // Rodzicielski (tygodnie)
  parentalWeeksSingle: 41,
  parentalWeeksMultiple: 43,
  parentalWeeksSingleLifeCertificate: 65,
  parentalWeeksMultipleLifeCertificate: 67,
  parentalNonTransferableWeeksPerParent: 9, // Niezbywalne 9 tygodni dla każdego z rodziców

  // Uzupełniający urlop dla wcześniaków (art. 180² KP)
  supplementaryPre28OrWeightUnder1000MaxWeeks: 15,
  supplementaryBetween28And37WeightOver1000MaxWeeks: 8,
  supplementaryPost37HospitalizedMaxWeeks: 8,

  // Ojcowski (art. 182³ KP)
  paternityWeeks: 2, // 14 dni kalendarzowych
  paternityMaxChildAgeMonths: 12,

  // Okresy wyczekiwania (dni)
  waitingPeriodEmploymentDays: 30,
  waitingPeriodMandateOrB2bDays: 90,
};

/**
 * Predefined ZUS Test Cases for Jury Sandbox
 */
export const OFFICIAL_ZUS_TEST_CASES: ZusTestCase[] = [
  {
    id: 'case-01-standard-uop',
    caseNumber: 'KAZUS-01',
    title: 'Standardowa Umowa o Pracę – Wniosek w 21 dni (Wariant 81,5%)',
    description: 'Pani Anna zatrudniona na UoP rodzi jedno dziecko. W terminie 14 dni po porodzie składa wniosek ZAM o pełny wymiar urlopów.',
    category: 'standard',
    pdfFileName: 'sprawa_1_uop_standard.pdf',
    contractType: 'employment',
    monthlySalaryGross: 6500.00,
    childrenCount: 1,
    hasLifeCertificate: false,
    submissionWithin21Days: true,
    isPrematureOrHospitalized: false,
    workPartTimeDuringParental: false,
    hasDebtExceedingThreshold: false,
    expectedResult: {
      insuranceVerified: true,
      totalWeeksGranted: 61, // 20 tyg. macierzyńskiego + 32 tyg. rodzicielskiego mamy + 9 tyg. taty
      benefitRateDescription: '81,5% dla mamy (20 + 32 tyg.), 70% za 9 nieprzenoszalnych tyg. dla taty',
      keyVerdictNote: 'Zasiłek przyznany. Prawo do uśrednionej stawki 81,5% z uwagi na wniosek w 21 dni (łącznie 61 tyg. dla rodziny).'
    }
  },
  {
    id: 'case-02-premature-hospitalized',
    caseNumber: 'KAZUS-02',
    title: 'Wcześniak z pobytem w szpitalu (Art. 180² KP)',
    description: 'Dziecko urodzone w 27. tygodniu ciąży z masą 950g. Łączny pobyt w szpitalu: 10 tygodni (70 dni).',
    category: 'premature',
    pdfFileName: 'sprawa_2_wczesniak_szpital.pdf',
    contractType: 'employment',
    monthlySalaryGross: 7200.00,
    childrenCount: 1,
    hasLifeCertificate: false,
    submissionWithin21Days: true,
    isPrematureOrHospitalized: true,
    birthWeek: 27,
    birthWeightGrams: 950,
    hospitalDaysTotal: 70,
    workPartTimeDuringParental: false,
    hasDebtExceedingThreshold: false,
    expectedResult: {
      insuranceVerified: true,
      totalWeeksGranted: 71, // 20 tyg. macierzyński + 10 tyg. uzupełniający + 32 tyg. rodzicielski mamy + 9 tyg. taty
      benefitRateDescription: '100% za uzupełniający urlop (10 tyg.), 81,5% za macierzyński i rodzicielski mamy, 70% za 9 tyg. taty',
      keyVerdictNote: 'Przyznano 10 tygodni uzupełniającego urlopu macierzyńskiego w stawce 100% na wniosek ze szpitala (łącznie 71 tyg. dla rodziny).'
    }
  },
  {
    id: 'case-03-part-time-parental',
    caseNumber: 'KAZUS-03',
    title: 'Łączenie urlopu rodzicielskiego z pracą na 1/2 etatu',
    description: 'Pracownik łączy urlop rodzicielski z pracą na 1/2 etatu u dotychczasowego pracodawcy przez 32 tygodnie.',
    category: 'part_time',
    pdfFileName: 'sprawa_3_laczenie_pracy_z_urlopem.pdf',
    contractType: 'employment',
    monthlySalaryGross: 8000.00,
    childrenCount: 1,
    hasLifeCertificate: false,
    submissionWithin21Days: false,
    isPrematureOrHospitalized: false,
    workPartTimeDuringParental: true,
    workFteRatio: 0.5,
    hasDebtExceedingThreshold: false,
    expectedResult: {
      insuranceVerified: true,
      totalWeeksGranted: 93, // 20 macierzyński + 64 wydłużony rodzicielski (1/2 etatu) + 9 tyg. taty
      benefitRateDescription: '100% macierzyński, 35% zasiłek rodzicielski (+ 50% pensji), 70% za 9 tyg. taty',
      keyVerdictNote: 'Wydłużenie proporcjonalne do 64 tygodni rodzicielskiego + 20 tyg. macierzyńskiego + 9 tyg. taty = 93 tyg. łącznie.'
    }
  },
  {
    id: 'case-04-jdg-debt-blocked',
    caseNumber: 'KAZUS-04',
    title: 'Działalność Gospodarcza (JDG) ze stanem zadłużenia > 48,06 zł',
    description: 'Przedsiębiorczyni z dobrowolnym chorobowym wnioskuje o zasiłek, lecz na dzień porodu zalega ze składkami na kwotę 250 zł.',
    category: 'jdg_debt',
    pdfFileName: 'sprawa_4_jdg_zaleglosc_skladek.pdf',
    contractType: 'b2b',
    monthlySalaryGross: 12000.00,
    childrenCount: 1,
    hasLifeCertificate: false,
    submissionWithin21Days: true,
    isPrematureOrHospitalized: false,
    workPartTimeDuringParental: false,
    hasDebtExceedingThreshold: true,
    expectedResult: {
      insuranceVerified: false,
      totalWeeksGranted: 0,
      benefitRateDescription: 'Wypłata wstrzymana (zadłużenie > 1% płacy minimalnej = 48,06 zł)',
      keyVerdictNote: 'Odmowa wypłaty do czasu uregulowania długu. Spłata w 6 miesięcy odblokuje prawo do zasiłku wstecz.'
    }
  },
  {
    id: 'case-05-parents-split-father-reserved',
    caseNumber: 'KAZUS-05',
    title: 'Podział urlopów między rodzicami i wykorzystanie 9 tyg. ojca',
    description: 'Matka wykorzystuje 14 tygodni macierzyńskiego i wraca do pracy. Ojciec przejmuje 6 tyg. macierzyńskiego oraz pełną pulę rodzicielską.',
    category: 'parents_split',
    pdfFileName: 'sprawa_5_podzial_mama_tata.pdf',
    contractType: 'employment',
    monthlySalaryGross: 6000.00,
    childrenCount: 1,
    hasLifeCertificate: false,
    submissionWithin21Days: false,
    isPrematureOrHospitalized: false,
    workPartTimeDuringParental: false,
    hasDebtExceedingThreshold: false,
    expectedResult: {
      insuranceVerified: true,
      totalWeeksGranted: 61, // 20 tyg. macierzyński + 41 tyg. rodzicielski
      benefitRateDescription: '100% macierzyński (mama 14 tyg., tata 6 tyg.), 70% rodzicielski',
      keyVerdictNote: 'Prawidłowy podział. Ojciec wykorzystuje także 9 tygodni nieprzenoszalnego urlopu rodzicielskiego.'
    }
  },
  {
    id: 'case-06-life-certificate',
    caseNumber: 'KAZUS-06',
    title: 'Zaświadczenie z Ustawy „Za życiem” – Wydłużony Urlop Rodzicielski',
    description: 'Narodziny dziecka z ciężką chorobą zagrażającą życiu, potwierdzoną zaświadczeniem lekarza specjalisty wg art. 4 ust. 3 ustawy.',
    category: 'life_certificate',
    pdfFileName: 'sprawa_6_za_zyciem_65_tyg.pdf',
    contractType: 'employment',
    monthlySalaryGross: 7000.00,
    childrenCount: 1,
    hasLifeCertificate: true,
    submissionWithin21Days: true,
    isPrematureOrHospitalized: false,
    workPartTimeDuringParental: false,
    hasDebtExceedingThreshold: false,
    expectedResult: {
      insuranceVerified: true,
      totalWeeksGranted: 85, // 20 tyg. macierzyński + 65 tyg. rodzicielski (56 mama + 9 tata)
      benefitRateDescription: '81,5% dla mamy (20 tyg. mac. + 56 tyg. rodz.), 70% za 9 tyg. taty',
      keyVerdictNote: 'Wydłużony urlop rodzicielski do 65 tygodni na mocy ustawy „Za życiem”.'
    }
  }
];
