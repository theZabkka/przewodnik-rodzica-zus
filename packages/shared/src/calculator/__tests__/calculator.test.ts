import { describe, it, expect } from 'vitest';
import { calculateBenefits } from '../index';
import { calculateNetBase } from '../base';
import { calculateFamilySharing } from '../family-sharing-planner';
import { OFFICIAL_ZUS_TEST_CASES } from '../../constants/legislative-2026';
import { BenefitCalculationInput } from '../../types';

describe('ZUS Parental Benefit Calculation Engine (2026 Statutory Rules)', () => {

  // =========================================================================
  // SUITE 1: Podstawa Wymiaru Zasiłku i Parametry Bazowe (13,71%, min/max, 1/30)
  // =========================================================================
  describe('1. Podstawa wymiaru i parametry bazowe (13,71%, dzielnik 30, limity)', () => {
    it('poprawnie odlicza 13,71% składek pracowniczych dla standardowego wynagrodzenia UoP', () => {
      const grossMonthly = 10000.00;
      const res = calculateNetBase(grossMonthly, 'employment');

      // 10 000 * (1 - 0.1371) = 8 629.00 zł
      expect(res.netBaseMonthly).toBe(8629.00);
      // Stawka dzienna = 8 629.00 / 30 = 287.63 zł
      expect(res.dailyBaseAmount).toBe(287.63);
      expect(res.isMinBaseApplied).toBe(false);
      expect(res.isMaxBaseApplied).toBe(false);
    });

    it('gwarantuje minimalną podstawę wymiaru dla pracownika UoP (4 147,10 zł) przy pensji minimalnej 4 806 zł', () => {
      const minWage = 4806.00;
      const res = calculateNetBase(minWage, 'employment');

      // 4 806 * (1 - 0.1371) = 4 147.10 zł
      expect(res.netBaseMonthly).toBe(4147.10);
      expect(res.dailyBaseAmount).toBe(138.24);
    });

    it('podwyższa zaniżoną podstawę UoP do ustawowej minimalnej podstawy 4 147,10 zł', () => {
      const lowerGross = 3000.00;
      const res = calculateNetBase(lowerGross, 'employment');

      expect(res.isMinBaseApplied).toBe(true);
      expect(res.netBaseMonthly).toBe(4147.10);
      expect(res.dailyBaseAmount).toBe(138.24);
    });

    it('stosuje limit maksymalnej podstawy dobrowolnego ubezpieczenia chorobowego dla JDG (23 550,00 zł brutto / 20 321,30 zł netto)', () => {
      const highJdgGross = 30000.00; // Powyżej limitu 23 550 zł
      const res = calculateNetBase(highJdgGross, 'b2b');

      expect(res.isMaxBaseApplied).toBe(true);
      // 23 550 * (1 - 0.1371) = 20 321.30 zł
      expect(res.netBaseMonthly).toBe(20321.30);
      expect(res.dailyBaseAmount).toBe(677.38);
    });

    it('zawsze stosuje ustawowy dzielnik 30 do wyliczenia stawki dziennej (art. 11 ust. 5 ustawy)', () => {
      const res = calculateNetBase(6000.00, 'mandate');
      // 6 000 * (1 - 0.1371) = 5 177.40 zł
      // 5 177.40 / 30 = 172.58 zł
      expect(res.netBaseMonthly).toBe(5177.40);
      expect(res.dailyBaseAmount).toBe(172.58);
    });
  });

  // =========================================================================
  // SUITE 2: Warianty Zasiłku (81,5% Długi Wniosek vs 100%/70% Standardowy)
  // =========================================================================
  describe('2. Warianty zasiłku (Długi wniosek 81,5% w 21 dni vs 100%/70% standard)', () => {
    it('przyznaje uśrednioną stawkę 81,5% dla matki za macierzyński i rodzicielski, a za 9 tyg. ojca ZAWSZE 70%', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true, // Wniosek w 21 dni -> wariant 81,5%
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);

      expect(result.maternityWeeks).toBe(20);
      expect(result.parentalTotalWeeks).toBe(41);
      expect(result.parentalMomWeeks).toBe(32);
      expect(result.parentalDadReservedWeeks).toBe(9);

      // Stawki procentowe
      expect(result.momMaternityRatePercent).toBe(81.5);
      expect(result.momParentalRatePercent).toBe(81.5);
      expect(result.dadParentalReservedRatePercent).toBe(70); // Żelazny wyjątek: ojciec zawsze 70%

      // Sprawdzenie kwot miesięcznych
      // Podstawa netto = 6000 * 0.8629 = 5177.40 zł
      // 81.5% z 5177.40 zł = 4219.58 zł
      expect(result.maternityMonthlyBenefit).toBeCloseTo(4219.58, 1);
      expect(result.parentalMonthlyBenefitMom).toBeCloseTo(4219.58, 1);
      // 70% z 5177.40 zł = 3624.18 zł
      expect(result.parentalMonthlyBenefitDad).toBeCloseTo(3624.18, 1);
    });

    it('przy wniosku po 21 dniach przyznaje 100% za macierzyński i 70% za rodzicielski', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: false, // Po 21 dniach -> wariant standardowy 100/70
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);

      expect(result.momMaternityRatePercent).toBe(100);
      expect(result.momParentalRatePercent).toBe(70);
      expect(result.dadParentalReservedRatePercent).toBe(70);

      // 100% z 5177.40 = 5177.40 zł
      expect(result.maternityMonthlyBenefit).toBeCloseTo(5177.40, 1);
      // 70% z 5177.40 = 3624.18 zł
      expect(result.parentalMonthlyBenefitMom).toBeCloseTo(3624.18, 1);
    });

    it('poprawnie wyznacza wymiar urlopu macierzyńskiego dla porodów mnogich (2, 3, 4, 5+ dzieci)', () => {
      const baseInput: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 5000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      // 1 dziecko: 20 tyg. mac. + 41 tyg. rodz.
      expect(calculateBenefits({ ...baseInput, childrenCount: 1 }).maternityWeeks).toBe(20);
      expect(calculateBenefits({ ...baseInput, childrenCount: 1 }).parentalTotalWeeks).toBe(41);

      // 2 dzieci (bliźniaki): 31 tyg. mac. + 43 tyg. rodz.
      expect(calculateBenefits({ ...baseInput, childrenCount: 2 }).maternityWeeks).toBe(31);
      expect(calculateBenefits({ ...baseInput, childrenCount: 2 }).parentalTotalWeeks).toBe(43);

      // 3 dzieci (trojaczki): 33 tyg. mac. + 43 tyg. rodz.
      expect(calculateBenefits({ ...baseInput, childrenCount: 3 }).maternityWeeks).toBe(33);
      expect(calculateBenefits({ ...baseInput, childrenCount: 3 }).parentalTotalWeeks).toBe(43);

      // 4 dzieci (czworaczki): 35 tyg. mac. + 43 tyg. rodz.
      expect(calculateBenefits({ ...baseInput, childrenCount: 4 }).maternityWeeks).toBe(35);

      // 5+ dzieci: 37 tyg. mac. + 43 tyg. rodz.
      expect(calculateBenefits({ ...baseInput, childrenCount: 5 }).maternityWeeks).toBe(37);
    });
  });

  // =========================================================================
  // SUITE 3: Uzupełniający Urlop Macierzyński dla Wcześniaków (Art. 180² KP)
  // =========================================================================
  describe('3. Uzupełniający urlop dla wcześniaków (art. 180² KP - 100% płatny)', () => {
    it('dla skrajnych wcześniaków (<28 tyg. lub waga <=1000g) przyznaje do 15 tygodni uzupełniającego w stawce 100%', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 7000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: true,
        birthWeek: 26, // Skrajny wcześniak (<28 tyg.)
        birthWeightGrams: 850, // <= 1000g
        hospitalDaysTotal: 70, // 10 pełnych tygodni
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);

      expect(result.supplementaryWeeks).toBe(10);
      expect(result.supplementaryRatePercent).toBe(100);
      expect(result.maternityWeeks).toBe(20);
      expect(result.parentalTotalWeeks).toBe(41);
      // Łączny czas opieki = 20 macierzyński + 10 uzupełniający + 32 rodzicielski matki = 62 tyg.
    });

    it('stosuje regułę zaokrąglenia w górę (ceil) niepełnego tygodnia hospitalizacji (art. 180² § 3 KP)', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: true,
        birthWeek: 27,
        birthWeightGrams: 900,
        hospitalDaysTotal: 10, // 10 dni / 7 = 1.43 -> zaokrąglenie w górę do 2 tygodni!
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      expect(result.supplementaryWeeks).toBe(2);
    });

    it('ogranicza wymiar uzupełniającego urlopu do ustawowego limitu 15 tygodni dla skrajnych wcześniaków', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: true,
        birthWeek: 25,
        birthWeightGrams: 750,
        hospitalDaysTotal: 140, // 20 tygodni hospitalizacji -> limit wynosi 15 tyg.
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      expect(result.supplementaryWeeks).toBe(15);
    });

    it('dla wcześniaków urodzonych między 28. a 37. tyg. z masą >1000g limituje urlop do 8 tygodni', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: true,
        birthWeek: 32, // Między 28 a 37
        birthWeightGrams: 1800, // > 1000g
        hospitalDaysTotal: 70, // 10 tygodni pobytu -> limit wynosi 8 tyg.
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      expect(result.supplementaryWeeks).toBe(8);
    });

    it('dla noworodków urodzonych po 37. tyg. z hospitalizacją min. 2 dni przyznaje urlop do 8 tygodni', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: true,
        birthWeek: 39, // Po 37 tyg.
        birthWeightGrams: 3400,
        hospitalDaysTotal: 15, // 15 dni hospitalizacji
        hospitalizationConsecutiveMin2DaysBetweenDay5And28: true, // Warunek min. 2 dni spełniony
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      // ceil(15 / 7) = 3 tygodnie
      expect(result.supplementaryWeeks).toBe(3);
    });
  });

  // =========================================================================
  // SUITE 4: Łączenie Urlopu Rodzicielskiego z Pracą (Art. 182¹ᶠ KP)
  // =========================================================================
  describe('4. Łączenie rodzicielskiego z pracą na część etatu (art. 182¹ᶠ KP)', () => {
    it('proporcjonalnie wydłuża urlop rodzicielski przy pracy na 1/2 etatu i redukuje zasiłek o wymiar etatu', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 8000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: false, // 100% macierzyński, 70% rodzicielski
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: true,
        workFteRatio: 0.5, // 1/2 etatu
        workWeeks: 32, // Łączenie przez całe 32 tygodnie rodzicielskiego matki
      };

      const result = calculateBenefits(input);

      // Wydłużenie urlopu rodzicielskiego: 32 tyg. * 0.5 = 16 tyg.
      // Łączny wymiar rodzicielskiego matki = 32 + 16 = 48 tyg. (lub przy podwojeniu przez cały czas: 64 tyg.)
      expect(result.parentalExtensionWeeks).toBeGreaterThan(0);
      expect(result.totalExtendedParentalWeeks).toBeGreaterThan(result.parentalTotalWeeks);

      // Redukcja zasiłku przy stawce bazowej 70%:
      // 70% * (1 - 0.5) = 35%
      // Przy wariancie 81,5%: 81.5% * (1 - 0.5) = 40.75%
      expect(result.timelineSegments.some(s => s.ratePercent === 35 || s.ratePercent === 40.75)).toBe(true);
    });

    it('gwarantuje zachowanie 100% łącznej puli wypłaconego zasiłku w wydłużonym okresie rodzicielskim', () => {
      const standardInput: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 8000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: false,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const partTimeInput: BenefitCalculationInput = {
        ...standardInput,
        workPartTimeDuringParental: true,
        workFteRatio: 0.5,
        workWeeks: 32,
      };

      const standardResult = calculateBenefits(standardInput);
      const partTimeResult = calculateBenefits(partTimeInput);

      // Łączna kwota zasiłków wypłaconych przez ZUS w całym cyklu opiekuńczym pozostaje niezmienna
      expect(partTimeResult.totalBenefitAmountSum).toBeCloseTo(standardResult.totalBenefitAmountSum, -1);
    });
  });

  // =========================================================================
  // SUITE 5: Ustawa „Za życiem” (Art. 4 ust. 3)
  // =========================================================================
  describe('5. Ustawa „Za życiem” (wydłużenie rodzicielskiego do 65/67 tygodni)', () => {
    it('wydłuża urlop rodzicielski do 65 tygodni dla 1 dziecka z zaświadczeniem Za życiem', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: true, // Ustawa Za życiem
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);

      expect(result.parentalTotalWeeks).toBe(65);
      expect(result.parentalMomWeeks).toBe(56); // 65 - 9 tyg. ojca = 56 tyg.
      expect(result.parentalDadReservedWeeks).toBe(9);
      expect(result.maternityWeeks).toBe(20);
    });

    it('wydłuża urlop rodzicielski do 67 tygodni dla ciąży mnogiej z zaświadczeniem Za życiem', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 2, // Bliźnięta
        hasLifeCertificate: true,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);

      expect(result.parentalTotalWeeks).toBe(67);
      expect(result.parentalMomWeeks).toBe(58); // 67 - 9 tyg. ojca = 58 tyg.
      expect(result.parentalDadReservedWeeks).toBe(9);
      expect(result.maternityWeeks).toBe(31);
    });
  });

  // =========================================================================
  // SUITE 6: Detektor Ryzyka (Risk Engine & Warnings)
  // =========================================================================
  describe('6. Detektor ryzyka i ostrzeżeń prawnych (Risk Engine)', () => {
    it('ostrzega o blokadzie wypłaty świadczeń JDG w przypadku zadłużenia > 48,06 zł (art. 2a ustawy)', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'b2b',
        monthlyBaseGross: 10000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      // Weryfikacja obecności kodu ostrzeżenia o długu składkowym
      expect(result.riskWarnings.some(w => w.code.includes('JDG_DEBT') || w.code.includes('DEBT'))).toBe(true);
    });

    it('ostrzega o utracie stawki 81,5% i konieczności wnioskowania etapowego w razie przekroczenia 21 dni', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: false, // Przekroczony termin 21 dni
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      expect(result.riskWarnings.some(w => w.code.includes('21_DAYS') || w.code.includes('DEADLINE'))).toBe(true);
    });

    it('generuje ostrzeżenie o przepadku 9 nieprzenoszalnych tygodni ojca', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      };

      const result = calculateBenefits(input);
      expect(result.riskWarnings.some(w => w.code.includes('DAD_9_WEEKS') || w.description.includes('9 tygodni'))).toBe(true);
    });
  });

  // =========================================================================
  // SUITE 7: Urlop Ojcowski (Art. 182³ KP)
  // =========================================================================
  describe('7. Urlop ojcowski (14 dni w stawce 100% do 12 m-cy życia dziecka)', () => {
    it('przyznaje 14 dni urlopu ojcowskiego w stawce 100% niezależnie od praw matki', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'father',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: false,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
        includePaternityLeave: true,
      };

      const result = calculateBenefits(input);

      expect(result.paternityWeeks).toBe(2);
      expect(result.paternityRatePercent).toBe(100);
      expect(result.paternityTotalBenefit).toBeGreaterThan(0);
      // 14 dni * (5177.40 / 30) = 14 * 172.58 = 2416.12 zł
      expect(result.paternityTotalBenefit).toBeCloseTo(2416.12, 0);
    });
  });

  // =========================================================================
  // SUITE 8: Weryfikacja 6 Oficjalnych Kazusów ZUS (Jury Sandbox Cases)
  // =========================================================================
  describe('8. Weryfikacja 6 oficjalnych spraw testowych ZUS (Jury Sandbox)', () => {
    it('Kazus 1: Standardowa Umowa o Pracę – Wniosek w 21 dni (81,5%)', () => {
      const case01 = OFFICIAL_ZUS_TEST_CASES[0];
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: case01.contractType,
        monthlyBaseGross: case01.monthlySalaryGross,
        childrenCount: case01.childrenCount,
        hasLifeCertificate: case01.hasLifeCertificate,
        submissionWithin21Days: case01.submissionWithin21Days,
        isPrematureOrHospitalized: case01.isPrematureOrHospitalized,
        workPartTimeDuringParental: case01.workPartTimeDuringParental,
      };

      const result = calculateBenefits(input);
      expect(result.maternityWeeks).toBe(20);
      expect(result.parentalMomWeeks).toBe(32);
      expect(result.parentalDadReservedWeeks).toBe(9);
      expect(result.momMaternityRatePercent).toBe(81.5);
      expect(result.momParentalRatePercent).toBe(81.5);
      expect(result.dadParentalReservedRatePercent).toBe(70);
    });

    it('Kazus 2: Wcześniak z pobytem w szpitalu (Art. 180² KP - 10 tyg. uzupełniającego)', () => {
      const case02 = OFFICIAL_ZUS_TEST_CASES[1];
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: case02.contractType,
        monthlyBaseGross: case02.monthlySalaryGross,
        childrenCount: case02.childrenCount,
        hasLifeCertificate: case02.hasLifeCertificate,
        submissionWithin21Days: case02.submissionWithin21Days,
        isPrematureOrHospitalized: case02.isPrematureOrHospitalized,
        birthWeek: case02.birthWeek,
        birthWeightGrams: case02.birthWeightGrams,
        hospitalDaysTotal: case02.hospitalDaysTotal,
        workPartTimeDuringParental: case02.workPartTimeDuringParental,
      };

      const result = calculateBenefits(input);
      expect(result.maternityWeeks).toBe(20);
      expect(result.supplementaryWeeks).toBe(10); // 70 dni hospitalizacji = 10 tygodni
      expect(result.supplementaryRatePercent).toBe(100);
      expect(result.parentalTotalWeeks).toBe(41);
    });

    it('Kazus 3: Łączenie urlopu rodzicielskiego z pracą na 1/2 etatu', () => {
      const case03 = OFFICIAL_ZUS_TEST_CASES[2];
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: case03.contractType,
        monthlyBaseGross: case03.monthlySalaryGross,
        childrenCount: case03.childrenCount,
        hasLifeCertificate: case03.hasLifeCertificate,
        submissionWithin21Days: case03.submissionWithin21Days,
        isPrematureOrHospitalized: case03.isPrematureOrHospitalized,
        workPartTimeDuringParental: case03.workPartTimeDuringParental,
        workFteRatio: case03.workFteRatio,
        workWeeks: 32,
      };

      const result = calculateBenefits(input);
      expect(result.parentalExtensionWeeks).toBeGreaterThan(0);
      expect(result.totalExtendedParentalWeeks).toBeGreaterThan(41);
    });

    it('Kazus 4: Działalność Gospodarcza (JDG) z zadłużeniem > 48,06 zł', () => {
      const case04 = OFFICIAL_ZUS_TEST_CASES[3];
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: case04.contractType,
        monthlyBaseGross: case04.monthlySalaryGross,
        childrenCount: case04.childrenCount,
        hasLifeCertificate: case04.hasLifeCertificate,
        submissionWithin21Days: case04.submissionWithin21Days,
        isPrematureOrHospitalized: case04.isPrematureOrHospitalized,
        workPartTimeDuringParental: case04.workPartTimeDuringParental,
      };

      const result = calculateBenefits(input);
      expect(result.riskWarnings.some(w => w.code.includes('JDG_DEBT') || w.code.includes('DEBT'))).toBe(true);
    });

    it('Kazus 5: Podział urlopów między rodzicami i wykorzystanie 9 tyg. ojca', () => {
      const case05 = OFFICIAL_ZUS_TEST_CASES[4];
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: case05.contractType,
        monthlyBaseGross: case05.monthlySalaryGross,
        childrenCount: case05.childrenCount,
        hasLifeCertificate: case05.hasLifeCertificate,
        submissionWithin21Days: case05.submissionWithin21Days,
        isPrematureOrHospitalized: case05.isPrematureOrHospitalized,
        workPartTimeDuringParental: case05.workPartTimeDuringParental,
      };

      const result = calculateBenefits(input);
      expect(result.maternityWeeks).toBe(20);
      expect(result.parentalDadReservedWeeks).toBe(9);
      expect(result.momMaternityRatePercent).toBe(100);
      expect(result.momParentalRatePercent).toBe(70);
      expect(result.dadParentalReservedRatePercent).toBe(70);
    });

    it('Kazus 6: Zaświadczenie z Ustawy Za życiem – 65 tygodni rodzicielskiego', () => {
      const case06 = OFFICIAL_ZUS_TEST_CASES[5];
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: case06.contractType,
        monthlyBaseGross: case06.monthlySalaryGross,
        childrenCount: case06.childrenCount,
        hasLifeCertificate: case06.hasLifeCertificate,
        submissionWithin21Days: case06.submissionWithin21Days,
        isPrematureOrHospitalized: case06.isPrematureOrHospitalized,
        workPartTimeDuringParental: case06.workPartTimeDuringParental,
      };

      const result = calculateBenefits(input);
      expect(result.parentalTotalWeeks).toBe(65);
      expect(result.parentalMomWeeks).toBe(56);
      expect(result.parentalDadReservedWeeks).toBe(9);
      expect(result.momMaternityRatePercent).toBe(81.5);
      expect(result.dadParentalReservedRatePercent).toBe(70);
    });
  });

  describe('Adopcja i Rodzina Zastępcza Niezawodowa (Art. 183 Kodeksu pracy)', () => {
    it('przyznaje standardowe 20 tygodni urlopu na warunkach macierzyńskiego dla 1 dziecka', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
        parenthoodType: 'adoption',
        childAgeMonthsAtAdoption: 24, // 2-letnie dziecko
      };

      const result = calculateBenefits(input);
      expect(result.maternityWeeks).toBe(20);
      expect(result.isAdoptionOrFoster).toBe(true);
      expect(result.parenthoodTitle).toContain('art. 183 KP');
    });

    it('gwarantuje minimalny wymiar 9 tygodni dla dziecka zbliżającego się do limitu wieku (art. 183 § 3 KP)', () => {
      const input: BenefitCalculationInput = {
        parentRole: 'mother',
        contractType: 'employment',
        monthlyBaseGross: 6000.00,
        childrenCount: 1,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
        parenthoodType: 'foster_family',
        childAgeMonthsAtAdoption: 83, // 6 lat i 11 miesięcy (tuż przed 7. rokiem życia)
      };

      const result = calculateBenefits(input);
      expect(result.maternityWeeks).toBeGreaterThanOrEqual(9);
      expect(result.isAdoptionOrFoster).toBe(true);
    });
  });

  describe('Planer Dzielenia Opieki Między Oboje Rodziców (Work-Life Balance)', () => {
    it('prawidłowo oblicza korzyści w trybie naprzemiennym (sequential)', () => {
      const result = calculateFamilySharing({
        childrenCount: 1,
        submissionWithin21Days: true,
        momGrossSalary: 6000,
        dadGrossSalary: 8000,
        momMaternityWeeksTaken: 20,
        momParentalWeeks: 20,
        dadParentalWeeks: 12,
        dadTakesExclusive9Weeks: true,
        dadTakesPaternityLeave: true,
        sharingMode: 'sequential',
      });

      expect(result.totalLeaveSpanCalendarWeeks).toBe(20 + 20 + 12 + 9); // 61 tygodni
      expect(result.momTotalBenefitsPaid).toBeGreaterThan(0);
      expect(result.dadTotalBenefitsPaid).toBeGreaterThan(0);
      expect(result.legalNotes.length).toBeGreaterThan(0);
    });

    it('prawidłowo oblicza wspólny czas w trybie jednoczesnym (simultaneous)', () => {
      const result = calculateFamilySharing({
        childrenCount: 1,
        submissionWithin21Days: true,
        momGrossSalary: 6000,
        dadGrossSalary: 8000,
        momMaternityWeeksTaken: 20,
        momParentalWeeks: 20,
        dadParentalWeeks: 12,
        dadTakesExclusive9Weeks: true,
        dadTakesPaternityLeave: true,
        sharingMode: 'simultaneous',
      });

      // W trybie simultaneous: 20 tyg. macierzyńskiego + max(20, 21) = 41 tyg.
      expect(result.totalLeaveSpanCalendarWeeks).toBe(41);
    });
  });

});
