import { ContractType, LegislativeParameters } from '../types';
import { DEFAULT_LEGISLATIVE_2026 } from '../constants/legislative-2026';
import { calculateNetBase } from './base';

export interface FamilySharingPlannerInput {
  childrenCount: number;
  hasLifeCertificate?: boolean;
  submissionWithin21Days: boolean; // Czy wniosek ZAM w 21 dni (stawka 81.5% czy 100/70%)
  
  // Dochody rodziców (brutto PLN)
  momGrossSalary: number;
  dadGrossSalary: number;
  momContractType?: ContractType;
  dadContractType?: ContractType;

  // Podział macierzyńskiego (obligatoryjne min. 14 tyg. dla mamy przy porodzie)
  momMaternityWeeksTaken?: number; // domyślnie pełne (np. 20) lub 14
  dadMaternityWeeksTaken?: number; // pozostałe (np. 6)

  // Podział rodzicielskiego ze wspólnej puli (32 tyg. przy 1 dziecku)
  momParentalWeeks: number; // np. 20 tyg.
  dadParentalWeeks: number; // np. 12 tyg.
  
  // Czy tata korzysta z wyłącznych 9 tygodni (art. 182¹ᵃ § 4 KP - stawka zawsze 70%)
  dadTakesExclusive9Weeks: boolean;
  
  // Czy tata korzysta z 2 tygodni urlopu ojcowskiego (art. 182³ KP - 100%)
  dadTakesPaternityLeave: boolean;

  // Tryb korzystania z urlopu rodzicielskiego:
  // 'sequential' = naprzemiennie (mama kończy, potem tata zaczyna) -> maksymalny czas opieki nad dzieckiem
  // 'simultaneous' = jednocześnie (oboje rodzice w tym samym czasie) -> szybsze zużywanie puli
  sharingMode: 'sequential' | 'simultaneous';
}

export interface FamilyMonthlyBudget {
  periodLabel: string;
  momStatus: 'maternity' | 'parental' | 'working';
  dadStatus: 'paternity' | 'parental' | 'working';
  momMonthlyIncome: number;
  dadMonthlyIncome: number;
  combinedFamilyMonthlyIncome: number;
}

export interface FamilySharingPlannerResult {
  totalLeaveSpanCalendarWeeks: number; // Ile tygodni kalendarzowych dziecko ma zapewnioną bezpośrednią opiekę rodzica
  totalParentalPoolWeeks: number; // 41 lub 43 tyg.
  momTotalLeaveWeeks: number;
  dadTotalLeaveWeeks: number;
  
  // Finanse łączne
  momTotalBenefitsPaid: number;
  dadTotalBenefitsPaid: number;
  familyTotalBenefitsCombined: number;
  
  // Dochód referencyjny przed narodzinami
  baselineFamilyMonthlyGross: number;
  
  // Budżet w poszczególnych fazach
  budgetPhases: FamilyMonthlyBudget[];
  
  // Pouczenia prawne i rekomendacje
  legalNotes: string[];
}

/**
 * Symulator i optymalizator dzielenia opieki nad dzieckiem między oboje rodziców
 * (zgodny z Dyrektywą Work-Life Balance i art. 180, 182¹ᵃ, 182³ Kodeksu pracy).
 */
export function calculateFamilySharing(
  input: FamilySharingPlannerInput,
  params: LegislativeParameters = DEFAULT_LEGISLATIVE_2026
): FamilySharingPlannerResult {
  const momContract = input.momContractType ?? 'employment';
  const dadContract = input.dadContractType ?? 'employment';

  // Obliczenie podstaw zasiłków
  const momBase = calculateNetBase(input.momGrossSalary, momContract, params);
  const dadBase = calculateNetBase(input.dadGrossSalary, dadContract, params);

  // Wymiar macierzyńskiego (20 tyg. przy 1 dziecku)
  let maternityTotal = params.maternityWeeksSingle;
  if (input.childrenCount === 2) maternityTotal = params.maternityWeeksTwins;
  else if (input.childrenCount >= 3) maternityTotal = params.maternityWeeksTriplets;

  const momMaternityWeeks = Math.max(14, Math.min(maternityTotal, input.momMaternityWeeksTaken ?? maternityTotal));
  const dadMaternityWeeks = Math.max(0, maternityTotal - momMaternityWeeks);

  // Wymiar rodzicielskiego (41 tyg. lub 65 tyg. z "Za życiem")
  let parentalTotal = input.childrenCount > 1 ? params.parentalWeeksMultiple : params.parentalWeeksSingle;
  if (input.hasLifeCertificate) {
    parentalTotal = input.childrenCount > 1 ? params.parentalWeeksMultipleLifeCertificate : params.parentalWeeksSingleLifeCertificate;
  }

  const transferableParentalPool = parentalTotal - params.parentalNonTransferableWeeksPerParent; // np. 41 - 9 = 32 tyg.
  const momParental = Math.min(transferableParentalPool, Math.max(0, input.momParentalWeeks));
  const dadSharedParental = Math.min(transferableParentalPool - momParental, Math.max(0, input.dadParentalWeeks));
  const dadExclusiveParental = input.dadTakesExclusive9Weeks ? params.parentalNonTransferableWeeksPerParent : 0;
  const dadTotalParental = dadSharedParental + dadExclusiveParental;

  const dadPaternityWeeks = input.dadTakesPaternityLeave ? params.paternityWeeks : 0;

  // Stawki procentowe
  const momMaternityRate = input.submissionWithin21Days
    ? params.unifiedApplicationRatePercent / 100 // 81.5%
    : params.maternityStandardRatePercent / 100; // 100%

  const momParentalRate = input.submissionWithin21Days
    ? params.unifiedApplicationRatePercent / 100 // 81.5%
    : params.parentalStandardRatePercent / 100; // 70%

  const dadParentalRate = params.dadReservedParentalRatePercent / 100; // Zawsze 70% dla taty
  const dadPaternityRate = params.maternityStandardRatePercent / 100; // 100%

  // Kwoty świadczeń matki
  const momMaternityDaily = momBase.dailyBaseAmount * momMaternityRate;
  const momMaternityBenefit = Math.round(momMaternityDaily * momMaternityWeeks * 7 * 100) / 100;

  const momParentalDaily = momBase.dailyBaseAmount * momParentalRate;
  const momParentalBenefit = Math.round(momParentalDaily * momParental * 7 * 100) / 100;

  const momTotalBenefitsPaid = Math.round((momMaternityBenefit + momParentalBenefit) * 100) / 100;

  // Kwoty świadczeń ojca
  const dadMaternityDaily = dadBase.dailyBaseAmount * momMaternityRate;
  const dadMaternityBenefit = Math.round(dadMaternityDaily * dadMaternityWeeks * 7 * 100) / 100;

  const dadParentalDaily = dadBase.dailyBaseAmount * dadParentalRate;
  const dadParentalBenefit = Math.round(dadParentalDaily * dadTotalParental * 7 * 100) / 100;

  const dadPaternityDaily = dadBase.dailyBaseAmount * dadPaternityRate;
  const dadPaternityBenefit = Math.round(dadPaternityDaily * dadPaternityWeeks * 7 * 100) / 100;

  const dadTotalBenefitsPaid = Math.round((dadMaternityBenefit + dadParentalBenefit + dadPaternityBenefit) * 100) / 100;
  const familyTotalBenefitsCombined = Math.round((momTotalBenefitsPaid + dadTotalBenefitsPaid) * 100) / 100;

  // Długość kalendarzowa opieki nad dzieckiem
  let totalLeaveSpanCalendarWeeks = 0;
  if (input.sharingMode === 'sequential') {
    // Naprzemiennie: tydzień po tygodniu
    totalLeaveSpanCalendarWeeks = momMaternityWeeks + dadMaternityWeeks + momParental + dadTotalParental;
  } else {
    // Jednocześnie: wspólny czas liczy się równolegle
    const maxParentalSpan = Math.max(momParental, dadTotalParental);
    totalLeaveSpanCalendarWeeks = momMaternityWeeks + dadMaternityWeeks + maxParentalSpan;
  }

  // Fazy budżetowe
  const budgetPhases: FamilyMonthlyBudget[] = [
    {
      periodLabel: `Faza 1: Macierzyński matki (tygodnie 1–${momMaternityWeeks})`,
      momStatus: 'maternity',
      dadStatus: 'working',
      momMonthlyIncome: Math.round(momBase.netBaseMonthly * momMaternityRate),
      dadMonthlyIncome: input.dadGrossSalary,
      combinedFamilyMonthlyIncome: Math.round(momBase.netBaseMonthly * momMaternityRate + input.dadGrossSalary),
    },
    {
      periodLabel: input.sharingMode === 'sequential'
        ? `Faza 2: Rodzicielski matki (${momParental} tyg.)`
        : `Faza 2: Jednoczesny urlop rodzicielski obojga rodziców (${Math.min(momParental, dadTotalParental)} tyg.)`,
      momStatus: 'parental',
      dadStatus: input.sharingMode === 'sequential' ? 'working' : 'parental',
      momMonthlyIncome: Math.round(momBase.netBaseMonthly * momParentalRate),
      dadMonthlyIncome: input.sharingMode === 'sequential'
        ? input.dadGrossSalary
        : Math.round(dadBase.netBaseMonthly * dadParentalRate),
      combinedFamilyMonthlyIncome: input.sharingMode === 'sequential'
        ? Math.round(momBase.netBaseMonthly * momParentalRate + input.dadGrossSalary)
        : Math.round(momBase.netBaseMonthly * momParentalRate + dadBase.netBaseMonthly * dadParentalRate),
    },
  ];

  if (dadTotalParental > 0 && input.sharingMode === 'sequential') {
    budgetPhases.push({
      periodLabel: `Faza 3: Urlop rodzicielski ojca (${dadTotalParental} tyg. w tym 9 tyg. WLB)`,
      momStatus: 'working',
      dadStatus: 'parental',
      momMonthlyIncome: input.momGrossSalary,
      dadMonthlyIncome: Math.round(dadBase.netBaseMonthly * dadParentalRate),
      combinedFamilyMonthlyIncome: Math.round(input.momGrossSalary + dadBase.netBaseMonthly * dadParentalRate),
    });
  }

  const legalNotes: string[] = [
    `Dyrektywa Work-Life Balance: Ojcu przysługuje wyłączne prawo do 9 tygodni urlopu rodzicielskiego ze stawką 70% podstawy (część ta bezpowrotnie przepada, jeśli nie zostanie wykorzystana).`,
    `Art. 180 § 4 KP: Matka po wykorzystaniu 14 tygodni macierzyńskiego może zrezygnować z dalszej części na rzecz ubezpieczonego ojca dziecka.`,
    `Tryb ${input.sharingMode === 'sequential' ? 'naprzemienny' : 'jednoczesny'}: ${
      input.sharingMode === 'sequential'
        ? 'Maksymalizuje łączny czas obecności rodzica w domu aż do ' + totalLeaveSpanCalendarWeeks + ' tygodni.'
        : 'Pozwala obojgu rodzicom spędzać czas z niemowlakiem jednocześnie, zużywając pulę 2-krotnie szybciej.'
    }`,
  ];

  return {
    totalLeaveSpanCalendarWeeks,
    totalParentalPoolWeeks: parentalTotal,
    momTotalLeaveWeeks: momMaternityWeeks + momParental,
    dadTotalLeaveWeeks: dadMaternityWeeks + dadTotalParental + dadPaternityWeeks,
    momTotalBenefitsPaid,
    dadTotalBenefitsPaid,
    familyTotalBenefitsCombined,
    baselineFamilyMonthlyGross: input.momGrossSalary + input.dadGrossSalary,
    budgetPhases,
    legalNotes,
  };
}
