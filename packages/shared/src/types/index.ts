/**
 * ZUS Domain Types (2026 Legal State)
 * Single Source of Truth for HackNation Monorepo
 */

export type ContractType = 'employment' | 'mandate' | 'b2b'; // Umowa o pracę | Zlecenie | Działalność gospodarcza (JDG)
export type ParentRole = 'mother' | 'father';
export type BenefitRateVariant = 'unified_81_5' | 'standard_100_70';

export interface BenefitCalculationInput {
  parentRole: ParentRole;
  contractType: ContractType;
  monthlyBaseGross: number; // Miesięczna podstawa wymiaru / wynagrodzenie brutto (PLN)
  childrenCount: number; // Liczba dzieci urodzonych przy jednym porodzie lub przyjętych (1..5+)
  hasLifeCertificate: boolean; // Zaświadczenie z ustawy "Za życiem" (art. 4 ust. 3)
  submissionWithin21Days: boolean; // Czy wniosek ZAM o pełen okres złożony w ciągu 21 dni po porodzie
  
  // Wcześniactwo i hospitalizacja (art. 180² KP)
  isPrematureOrHospitalized: boolean;
  birthWeek?: number; // Tydzień ciąży w chwili porodu (np. 27, 32, 38)
  birthWeightGrams?: number; // Masa urodzeniowa w gramach (np. 950, 1500)
  hospitalDaysTotal?: number; // Suma dni hospitalizacji w oknie referencyjnym
  hospitalizationConsecutiveMin2DaysBetweenDay5And28?: boolean; // Dla dzieci urodzonych po 37 tyg.
  
  // Praca w trakcie urlopu rodzicielskiego (art. 182¹ᶠ KP)
  workPartTimeDuringParental: boolean;
  workFteRatio?: number; // Wymiar etatu, max 0.5 (np. 0.25, 0.5)
  workWeeks?: number; // Liczba tygodni łączenia urlopu z pracą

  // Urlop ojcowski (art. 182³ KP)
  includePaternityLeave?: boolean;

  // Opieka nad dzieckiem / członkiem rodziny (art. 32-35 ustawy zasiłkowej)
  careLeaveDaysRequested?: number;
  careSubjectAge?: number;
  careSubjectIsDisabled?: boolean;
}

export interface BenefitTimelineSegment {
  title: string; // np. "Urlop macierzyński", "Urlop rodzicielski", "Urlop ojcowski"
  recipient: 'mother' | 'father' | 'both';
  durationWeeks: number;
  durationDays: number;
  ratePercent: number; // 100, 81.5, 70, 80
  monthlyAmountGross: number;
  dailyRateGross: number;
  totalGrossAmount: number;
  notes?: string;
}

export interface BenefitCalculationOutput {
  // Wymiary urlopów (w tygodniach)
  maternityWeeks: number;
  supplementaryWeeks: number; // Uzupełniający dla wcześniaków
  parentalTotalWeeks: number;
  parentalMomWeeks: number;
  parentalDadReservedWeeks: number; // 9 tygodni nieprzenoszalne dla ojca
  paternityWeeks: number; // Urlop ojcowski (2 tygodnie)
  
  // Łączenie z pracą na rodzicielskim
  parentalExtensionWeeks: number;
  totalExtendedParentalWeeks: number;

  // Finanse (PLN)
  netBaseMonthly: number; // Podstawa po odliczeniu 13.71%
  dailyBaseAmount: number; // Podstawa dzienna (netBaseMonthly / 30)
  
  // Wartości miesięczne i łączne
  maternityMonthlyBenefit: number;
  parentalMonthlyBenefitMom: number;
  parentalMonthlyBenefitDad: number;
  supplementaryMonthlyBenefit: number;
  paternityTotalBenefit: number;
  totalBenefitAmountSum: number;

  // Wskaźniki procentowe
  momMaternityRatePercent: number; // 100 lub 81.5
  momParentalRatePercent: number; // 70 lub 81.5
  dadParentalReservedRatePercent: number; // Zawsze 70
  supplementaryRatePercent: number; // Zawsze 100
  paternityRatePercent: number; // Zawsze 100

  // Oś czasu i segmenty
  timelineSegments: BenefitTimelineSegment[];

  // Ostrzeżenia i ryzyka prawne
  riskWarnings: RiskWarning[];
}

export interface RiskWarning {
  code: string;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  legalBasis: string;
}

export interface LegislativeParameters {
  id?: string;
  minimalWageGross: number; // 4806.00 zł w 2026 r.
  employeeContributionDeductionPercent: number; // 13.71%
  dailyDivisor: number; // 30 dni (art. 11 ust. 5 ustawy)
  maxJdgMonthlyBaseGross: number; // 23550.00 zł
  jdgDebtThresholdGross: number; // 48.06 zł (1% płacy minimalnej)
  funeralBenefitAmount: number; // 7000.00 zł w 2026 r.

  // Stawki procentowe zasiłków
  maternityStandardRatePercent: number; // 100%
  parentalStandardRatePercent: number; // 70%
  unifiedApplicationRatePercent: number; // 81.5%
  dadReservedParentalRatePercent: number; // 70%
  sickLeavePregnancyRatePercent: number; // 100%
  careLeaveRatePercent: number; // 80%

  // Urlopy macierzyńskie (tygodnie)
  maternityWeeksSingle: number; // 20
  maternityWeeksTwins: number; // 31
  maternityWeeksTriplets: number; // 33
  maternityWeeksQuadruplets: number; // 35
  maternityWeeksQuintupletsPlus: number; // 37
  maternityMomObligatoryWeeks: number; // 14

  // Urlopy rodzicielskie (tygodnie)
  parentalWeeksSingle: number; // 41
  parentalWeeksMultiple: number; // 43
  parentalWeeksSingleLifeCertificate: number; // 65
  parentalWeeksMultipleLifeCertificate: number; // 67
  parentalNonTransferableWeeksPerParent: number; // 9

  // Wcześniaki (art. 180² KP)
  supplementaryPre28OrWeightUnder1000MaxWeeks: number; // 15
  supplementaryBetween28And37WeightOver1000MaxWeeks: number; // 8
  supplementaryPost37HospitalizedMaxWeeks: number; // 8

  // Ojcowski
  paternityWeeks: number; // 2 tygodnie (14 dni)
  paternityMaxChildAgeMonths: number; // 12 miesięcy

  // Okresy wyczekiwania (dni)
  waitingPeriodEmploymentDays: number; // 30 dni
  waitingPeriodMandateOrB2bDays: number; // 90 dni

  // Zaktualizowano przez
  updatedAt?: string;
  updatedBy?: string;
}

export interface AuditConfigLog {
  id: string;
  changedAt: string;
  changedBy: string;
  parameterName: string;
  oldValue: number | string;
  newValue: number | string;
  reason: string;
}

export interface ZusTestCase {
  id: string;
  caseNumber: string; // np. "KAZUS-01"
  title: string;
  description: string;
  category: 'standard' | 'premature' | 'part_time' | 'jdg_debt' | 'parents_split' | 'life_certificate' | 'bereavement';
  pdfFileName?: string;
  pdfUrl?: string;
  contractType: ContractType;
  monthlySalaryGross: number;
  childrenCount: number;
  hasLifeCertificate: boolean;
  submissionWithin21Days: boolean;
  isPrematureOrHospitalized: boolean;
  birthWeek?: number;
  birthWeightGrams?: number;
  hospitalDaysTotal?: number;
  workPartTimeDuringParental: boolean;
  workFteRatio?: number;
  hasDebtExceedingThreshold?: boolean;
  expectedResult: {
    insuranceVerified: boolean;
    totalWeeksGranted: number;
    benefitRateDescription: string;
    keyVerdictNote: string;
  };
}

export interface AIQueryInput {
  question: string;
  userContext?: {
    contractType?: ContractType;
    parentRole?: ParentRole;
    monthlySalaryGross?: number;
    currentStage?: 'pregnancy' | 'after_birth' | 'parental_leave' | 'returning_to_work';
  };
}

export interface AIQueryOutput {
  answerPlainLanguage: string;
  legalBasisCitations: string[];
  recommendedSteps: string[];
  relevantFormCode?: string;
  warningAlert?: string;
}

export interface DocumentGenerationInput {
  formType: 'ZAM' | 'Z-3' | 'Z-3a' | 'Z-15A';
  insuredPerson: {
    firstName: string;
    lastName: string;
    pesel: string;
    address: string;
    bankAccountNumber: string;
  };
  child?: {
    firstName: string;
    lastName: string;
    pesel?: string;
    birthDate: string;
    birthCertificateNumber?: string;
  };
  employer?: {
    nip: string;
    name: string;
    registeredAddress: string;
    employeeCountOver20: boolean;
  };
  requestDetails: {
    startDate: string;
    rateVariant: BenefitRateVariant;
    includeParentalImmediately: boolean;
    supplementaryPrematureWeeks?: number;
  };
}

export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface InspectorCase {
  id: string;
  caseNumber: string; // np. "ZUS/2026/ZAM/04812"
  submissionDate: string;
  applicantName: string;
  pesel: string;
  email?: string;
  phone?: string;
  bankAccountNumber?: string;
  benefitType: 'MATERNITY_PARENTAL_UNIFIED' | 'MATERNITY_STANDARD' | 'PARENTAL_STANDARD' | 'PATERNITY';
  contractType: ContractType;
  monthlySalaryGross: number;
  childBirthDate: string;
  daysSinceBirth: number;
  isPremature: boolean;
  birthWeek?: number;
  hospitalDays?: number;
  employerNip: string;
  employerName: string;
  isEmployerOver20: boolean;
  hasDebt: boolean;
  debtAmount?: number;
  insuranceTenureDays: number;
  riskLevel: RiskLevel;
  riskCategory: 'FAST_TRACK' | 'PREMATURE_AUDIT' | 'JDG_DEBT_BLOCK' | 'SUSPECT_CONTRACT' | 'LATE_SUBMISSION';
  riskReasons: string[];
  suggestedDecision: 'AUTO_APPROVE_81_5' | 'AUDIT_HOSPITAL_DOCS' | 'BLOCK_PAYOUT_DEBT' | 'SEND_TO_AUDIT_DEPT' | 'CORRECT_TO_100_70';
  status: 'NEW' | 'IN_REVIEW' | 'APPROVED' | 'BLOCKED' | 'AUDIT_REQUESTED';
  assignedOfficer?: string;
  upoHash: string;
  decisionDocument?: {
    formal: string;
    plainLanguage: string;
    generatedAt: string;
    officerSignature: string;
  };
}

export interface Z3SalaryMonth {
  monthName: string;
  year: number;
  grossAmount: number;
  pensionAndDisabilityDeduction: number; // 13.71%
  netBenefitBase: number; // grossAmount * (1 - 0.1371)
}

export interface Z3Certificate {
  employerName: string;
  employerNip: string;
  employeeName: string;
  employeePesel: string;
  employeePosition: string;
  months: Z3SalaryMonth[];
  averageMonthlyGross: number;
  averageMonthlyBase: number;
  dailyBenefitBase: number;
}

export interface WorkSharingSchedule {
  childName: string;
  parentName: string;
  baseParentalWeeks: number;
  fteRatio: number; // np. 0.5 (pół etatu)
  workWeeksCount: number;
  extensionWeeksCount: number; // proporcjonalne wydłużenie (workWeeksCount * fteRatio)
  totalParentalWeeksAfterExtension: number;
  weeklySalaryAmount: number;
  weeklyBenefitAmount: number;
  totalWeeklyCombinedIncome: number;
}

/**
 * Centralny Profil Rodziny (Onboarding / Szybki Start Rodzica)
 * Uniwersalny stan zasilający kalkulator, przewodnik, e-usługi i asystenta AI
 */
export interface ParentProfile {
  whoOnLeave: 'mother' | 'father' | 'both';
  childrenCount: 1 | 2 | 3; // 1, 2 (bliźnięta), 3+ (trojaczki+)
  contractType: ContractType;
  monthlySalaryGross: number; // np. 7500
  isPretermOrHospitalized?: boolean; // wcześniak / hospitalizacja
  hospitalDays?: number;
  birthWeek?: number;
  birthWeightGrams?: number;
  worksPartTime?: boolean; // łączenie urlopu z pracą (1/2 etatu)
  workFteRatio?: number; // domyślnie 0.5
  submittedIn21Days?: boolean; // wariant 81.5%
  hasLifeCertificate?: boolean; // Ustawa "Za życiem"
  updatedAt?: string;
}

/**
 * Słowniczek Trudnych Słów ZUS (Standard Prostej Polszczyzny)
 */
export interface GlossaryTerm {
  id: string;
  term: string; // Urzędowa nazwa (np. "Podstawa wymiaru zasiłku")
  plainTitle: string; // Tytuł po ludzku (np. "Twoja średnia pensja do wyliczenia zasiłku")
  shortExplanation: string; // Proste wyjaśnienie w 1-2 zdaniach
  detailedExplanation: string; // Rozwinięcie z przykładem
  legalCitation?: string; // Podstawa prawna (np. "Art. 36 ustawy zasiłkowej")
  category: 'finanse' | 'urlopy' | 'formalnosci' | 'szczegolne';
  tags: string[];
}
