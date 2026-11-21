-- ==============================================================================
-- SEED: 2026_parameters_and_cases.sql
-- PROJECT: Zasiłkowy Przewodnik Przyszłego Rodzica (HackNation ZUS 2026)
-- DESCRIPTION: Initial Seed Data for 2026 Legislative Parameters & 6 ZUS Test Cases
-- ==============================================================================

-- 1. Domyślne parametry legislacyjne ZUS na rok 2026
INSERT INTO public.legislative_parameters (
    id,
    version,
    effective_from,
    is_active,
    minimum_wage_gross,
    employee_deduction_rate,
    debt_threshold_pct,
    jdg_max_contribution_base,
    funeral_benefit_amount,
    maternity_standard_rate,
    parental_standard_rate,
    unified_long_rate,
    dad_reserved_rate,
    supplementary_preterm_rate,
    paternity_rate,
    care_allowance_rate,
    pregnancy_sick_rate,
    maternity_single_weeks,
    maternity_twins_weeks,
    maternity_triplets_weeks,
    maternity_quadruplets_weeks,
    maternity_quintuplets_weeks,
    maternity_mandatory_mother_weeks,
    parental_single_weeks,
    parental_multi_weeks,
    parental_life_single_weeks,
    parental_life_multi_weeks,
    parental_reserved_dad_weeks,
    preterm_max_weeks_early,
    preterm_max_weeks_standard,
    waiting_period_uop_days,
    waiting_period_other_days,
    long_app_deadline_days,
    debt_grace_period_months
) VALUES (
    '00000000-0000-0000-0000-000000002026',
    '2026.1',
    '2026-01-01',
    true,
    4806.00,
    0.1371,
    0.0100,
    23550.00,
    7000.00,
    1.0000,
    0.7000,
    0.8150,
    0.7000,
    1.0000,
    1.0000,
    0.8000,
    1.0000,
    20,
    31,
    33,
    35,
    37,
    14,
    41,
    43,
    65,
    67,
    9,
    15,
    8,
    30,
    90,
    21,
    6
) ON CONFLICT (version) DO UPDATE SET
    minimum_wage_gross = EXCLUDED.minimum_wage_gross,
    employee_deduction_rate = EXCLUDED.employee_deduction_rate,
    debt_threshold_pct = EXCLUDED.debt_threshold_pct,
    unified_long_rate = EXCLUDED.unified_long_rate,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- 2. 6 Oficjalnych Kazusów Testowych ZUS
INSERT INTO public.zus_test_cases (
    case_code,
    title,
    category,
    description,
    input_data,
    expected_output,
    pdf_fixture_url,
    is_seeded
) VALUES 

-- Kazus 1: Standard UoP
(
    'KAZUS_01',
    'Sprawa 1: Standard UoP – Wniosek w 21 dni (Wariant 81,5%)',
    'Standard UoP',
    'Pracownica na umowie o pracę (wynagrodzenie 6000 zł brutto), poród o czasie jednego dziecka. Złożenie wniosku ZAM w terminie 21 dni po porodzie (wariant uśredniony 81,5%). Ojciec korzysta z 9 tygodni rodzicielskiego (70%) oraz 14 dni ojcowskiego (100%).',
    '{
        "parentRole": "mother",
        "contractType": "employment",
        "monthlyBaseGross": 6000.00,
        "childrenCount": 1,
        "submittedWithin21Days": true,
        "hasLifeCertificate": false,
        "isPrematureOrHospitalized": false,
        "motherTakesFullMaternity": true,
        "startMaternityWeeksBeforeBirth": 0,
        "dadTakesReserved9Weeks": true,
        "dadTakesPaternityLeave": true,
        "dadMonthlyBaseGross": 6500.00,
        "workDuringParental": false,
        "insuranceDurationMonths": 24
    }'::jsonb,
    '{
        "netMonthlyBase": 5177.40,
        "dailyBaseRate": 172.58,
        "maternityRatePct": 0.815,
        "maternityWeeks": 20,
        "parentalMomWeeks": 32,
        "parentalDadWeeks": 9,
        "parentalMomRatePct": 0.815,
        "parentalDadRatePct": 0.70,
        "paternityDays": 14,
        "paternityRatePct": 1.00,
        "recommendedOption": "optionA"
    }'::jsonb,
    '/fixtures/pdf/kazus_01_standard_uop.pdf',
    true
),

-- Kazus 2: Wcześniak hospitalizowany
(
    'KAZUS_02',
    'Sprawa 2: Wcześniak hospitalizowany (Art. 180² KP)',
    'Wcześniak hospitalizowany',
    'Skrajny wcześniak urodzony w 26. tygodniu ciąży z wagą 850 g. Hospitalizacja noworodka trwała 70 dni. Przyznanie 10 tygodni (zaokrąglenie w górę ceil(70/7)) uzupełniającego urlopu macierzyńskiego w stawce 100% bezpośrednio po macierzyńskim.',
    '{
        "parentRole": "mother",
        "contractType": "employment",
        "monthlyBaseGross": 7000.00,
        "childrenCount": 1,
        "submittedWithin21Days": true,
        "hasLifeCertificate": false,
        "isPrematureOrHospitalized": true,
        "birthWeek": 26,
        "birthWeightGrams": 850,
        "hospitalizationDaysTotal": 70,
        "motherTakesFullMaternity": true,
        "dadTakesReserved9Weeks": true,
        "dadTakesPaternityLeave": true,
        "insuranceDurationMonths": 36
    }'::jsonb,
    '{
        "netMonthlyBase": 6040.30,
        "supplementaryWeeks": 10,
        "supplementaryRatePct": 1.00,
        "supplementaryLegalBasis": "Art. 180² § 1 pkt 1 KP",
        "maternityWeeks": 20,
        "parentalTotalWeeks": 41,
        "totalCareWeeks": 71
    }'::jsonb,
    '/fixtures/pdf/kazus_02_wczesniak_hosp.pdf',
    true
),

-- Kazus 3: Praca 1/2 etatu z wydłużeniem
(
    'KAZUS_03',
    'Sprawa 3: Praca 1/2 etatu z wydłużeniem (Art. 182¹ᶠ KP)',
    'Praca 1/2 etatu z wydłużeniem',
    'Matka po urlopie macierzyńskim decyduje się łączyć urlop rodzicielski z pracą u dotychczasowego pracodawcy w wymiarze 1/2 etatu przez okres 20 tygodni. Urlop rodzicielski ulega proporcjonalnemu wydłużeniu o 10 tygodni (łącznie 30 tygodni opieki łączonej z pracą), a zasiłek macierzyński wynosi 40,75% podstawy obok 50% pensji.',
    '{
        "parentRole": "mother",
        "contractType": "employment",
        "monthlyBaseGross": 5500.00,
        "childrenCount": 1,
        "submittedWithin21Days": true,
        "hasLifeCertificate": false,
        "isPrematureOrHospitalized": false,
        "motherTakesFullMaternity": true,
        "workDuringParental": true,
        "workFteRatio": 0.5,
        "workWeeksCount": 20,
        "dadTakesReserved9Weeks": true,
        "insuranceDurationMonths": 18
    }'::jsonb,
    '{
        "extensionWeeks": 10,
        "reducedBenefitRatePct": 0.4075,
        "employerSalaryPct": 0.50,
        "totalIncomeCombinedMonthly": 4900.00,
        "isTotalBenefitPoolPreserved": true
    }'::jsonb,
    '/fixtures/pdf/kazus_03_praca_pol_etatu.pdf',
    true
),

-- Kazus 4: JDG z długiem > 48.06 zł
(
    'KAZUS_04',
    'Sprawa 4: JDG z długiem > 48.06 zł (Art. 2a Ustawy)',
    'JDG z długiem >48.06 zł',
    'Kobieta prowadząca jednoosobową działalność gospodarczą z deklarowaną podstawą składek 8000 zł. Na dzień porodu posiada zadłużenie z tytułu składek w wysokości 120,50 zł (przekracza 1% minimalnego wynagrodzenia, tj. 48,06 zł). Wypłata zasiłku zostaje wstrzymana z procedurą spłaty w terminie 6 miesięcy.',
    '{
        "parentRole": "mother",
        "contractType": "b2b",
        "monthlyBaseGross": 8000.00,
        "childrenCount": 1,
        "submittedWithin21Days": true,
        "hasLifeCertificate": false,
        "isPrematureOrHospitalized": false,
        "motherTakesFullMaternity": true,
        "insuranceDurationMonths": 14,
        "jdgCurrentDebtAmount": 120.50
    }'::jsonb,
    '{
        "isBlockedByDebt": true,
        "debtThreshold": 48.06,
        "currentDebt": 120.50,
        "gracePeriodMonths": 6,
        "riskCode": "DEBT_BLOCK",
        "legalReference": "Art. 2a ustawy zasiłkowej"
    }'::jsonb,
    '/fixtures/pdf/kazus_04_jdg_zadluzenie.pdf',
    true
),

-- Kazus 5: Podział między rodzicami i 9 tyg. ojca
(
    'KAZUS_05',
    'Sprawa 5: Podział między rodzicami i 9 tyg. ojca',
    'Podział między rodzicami i 9 tyg. ojca',
    'Matka wykorzystuje 14 tygodni obligatoryjnego macierzyńskiego, po czym powraca do pracy. Ojciec przejmuje pozostałe 6 tygodni urlopu macierzyńskiego w 100% oraz wykorzystuje 9 tygodni urlopu rodzicielskiego w 70%. Matka składa wniosek o standardowy wariant rozliczenia (100% / 70%).',
    '{
        "parentRole": "mother",
        "contractType": "employment",
        "monthlyBaseGross": 6000.00,
        "childrenCount": 1,
        "submittedWithin21Days": false,
        "hasLifeCertificate": false,
        "isPrematureOrHospitalized": false,
        "motherTakesFullMaternity": false,
        "startMaternityWeeksBeforeBirth": 0,
        "dadTakesReserved9Weeks": true,
        "dadTakesPaternityLeave": true,
        "dadMonthlyBaseGross": 7200.00,
        "insuranceDurationMonths": 24
    }'::jsonb,
    '{
        "motherMaternityWeeks": 14,
        "fatherMaternityWeeks": 6,
        "maternityRatePct": 1.00,
        "fatherParentalWeeks": 9,
        "fatherParentalRatePct": 0.70,
        "motherParentalAvailableWeeks": 32,
        "motherParentalRatePct": 0.70
    }'::jsonb,
    '/fixtures/pdf/kazus_05_podzial_rodzice.pdf',
    true
),

-- Kazus 6: 'Za życiem' 65 tyg.
(
    'KAZUS_06',
    'Sprawa 6: Dziecko z zaświadczeniem "Za życiem" (65 tyg.)',
    'Program Za życiem 65 tyg.',
    'Urodzenie dziecka z ciężkim i nieodwracalnym upośledzeniem albo nieuleczalną chorobą zagrażającą życiu (zaświadczenie z art. 4 ust. 3 ustawy "Za życiem"). Wymiar urlopu rodzicielskiego zostaje wydłużony z 41 do 65 tygodni (w tym 56 tygodni dla matki i 9 tygodni dla ojca). Wsparcie hospicjum perinatalnego i zasiłek pogrzebowy w razie zgonu.',
    '{
        "parentRole": "mother",
        "contractType": "employment",
        "monthlyBaseGross": 5200.00,
        "childrenCount": 1,
        "submittedWithin21Days": true,
        "hasLifeCertificate": true,
        "isPrematureOrHospitalized": false,
        "motherTakesFullMaternity": true,
        "dadTakesReserved9Weeks": true,
        "dadTakesPaternityLeave": true,
        "insuranceDurationMonths": 30
    }'::jsonb,
    '{
        "maternityWeeks": 20,
        "parentalTotalWeeks": 65,
        "parentalMotherWeeks": 56,
        "parentalDadWeeks": 9,
        "totalCareWeeks": 85,
        "hasLifeCertificate": true,
        "legalReference": "Art. 182¹ᵃ § 2 KP w zw. z ustawą \"Za życiem\""
    }'::jsonb,
    '/fixtures/pdf/kazus_06_za_zyciem.pdf',
    true
)
ON CONFLICT (case_code) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    input_data = EXCLUDED.input_data,
    expected_output = EXCLUDED.expected_output,
    pdf_fixture_url = EXCLUDED.pdf_fixture_url,
    updated_at = now();
