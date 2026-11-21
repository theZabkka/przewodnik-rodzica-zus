"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateParentalBenefits,
  BenefitCalculationInput,
  ContractType,
  ParentRole,
} from "@hacknation/shared";
import {
  Calculator,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Baby,
  Clock,
  ArrowRight,
  RotateCcw,
  Download,
  Layers,
  FileCheck,
} from "lucide-react";

export default function KalkulatorPage() {
  // Stan formularza wejściowego
  const [parentRole, setParentRole] = useState<ParentRole>("mother");
  const [contractType, setContractType] = useState<ContractType>("employment");
  const [grossSalary, setGrossSalary] = useState<number>(7500);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [submittedIn21Days, setSubmittedIn21Days] = useState<boolean>(true);
  const [hasLifeCertificate, setHasLifeCertificate] = useState<boolean>(false);
  const [includePaternityLeave, setIncludePaternityLeave] = useState<boolean>(true);

  // Wcześniactwo i hospitalizacja (art. 180² KP)
  const [isPretermOrHospitalized, setIsPretermOrHospitalized] = useState<boolean>(false);
  const [birthWeek, setBirthWeek] = useState<number>(27);
  const [birthWeightGrams, setBirthWeightGrams] = useState<number>(920);
  const [hospitalDaysTotal, setHospitalDaysTotal] = useState<number>(70); // 10 tyg

  // Praca na część etatu w trakcie rodzicielskiego (art. 182¹ᶠ KP)
  const [worksPartTime, setWorksPartTime] = useState<boolean>(false);
  const [workFteRatio, setWorkFteRatio] = useState<number>(0.5); // 1/2 etatu
  const [workWeeks, setWorkWeeks] = useState<number>(16);

  // Presety scenariuszy
  const loadPreset = (preset: "standard" | "preterm" | "parttime" | "father" | "jdg") => {
    if (preset === "standard") {
      setParentRole("mother");
      setContractType("employment");
      setGrossSalary(7500);
      setChildrenCount(1);
      setSubmittedIn21Days(true);
      setHasLifeCertificate(false);
      setIsPretermOrHospitalized(false);
      setWorksPartTime(false);
      setIncludePaternityLeave(true);
    } else if (preset === "preterm") {
      setParentRole("mother");
      setContractType("employment");
      setGrossSalary(7000);
      setChildrenCount(1);
      setSubmittedIn21Days(true);
      setHasLifeCertificate(false);
      setIsPretermOrHospitalized(true);
      setBirthWeek(27);
      setBirthWeightGrams(950);
      setHospitalDaysTotal(70);
      setWorksPartTime(false);
      setIncludePaternityLeave(true);
    } else if (preset === "parttime") {
      setParentRole("mother");
      setContractType("employment");
      setGrossSalary(8000);
      setChildrenCount(1);
      setSubmittedIn21Days(true);
      setHasLifeCertificate(false);
      setIsPretermOrHospitalized(false);
      setWorksPartTime(true);
      setWorkFteRatio(0.5);
      setWorkWeeks(16);
      setIncludePaternityLeave(true);
    } else if (preset === "father") {
      setParentRole("father");
      setContractType("employment");
      setGrossSalary(9000);
      setChildrenCount(1);
      setSubmittedIn21Days(true);
      setHasLifeCertificate(false);
      setIsPretermOrHospitalized(false);
      setWorksPartTime(false);
      setIncludePaternityLeave(true);
    } else if (preset === "jdg") {
      setParentRole("mother");
      setContractType("b2b");
      setGrossSalary(5000);
      setChildrenCount(1);
      setSubmittedIn21Days(true);
      setHasLifeCertificate(false);
      setIsPretermOrHospitalized(false);
      setWorksPartTime(false);
    }
  };

  // Wyliczenia z silnika @hacknation/shared dla aktywnego wariantu oraz wariantu alternatywnego
  const activeInput: BenefitCalculationInput = useMemo(
    () => ({
      parentRole,
      contractType,
      monthlyBaseGross: grossSalary,
      childrenCount,
      hasLifeCertificate,
      submissionWithin21Days: submittedIn21Days,
      isPrematureOrHospitalized: isPretermOrHospitalized,
      birthWeek: isPretermOrHospitalized ? birthWeek : undefined,
      birthWeightGrams: isPretermOrHospitalized ? birthWeightGrams : undefined,
      hospitalDaysTotal: isPretermOrHospitalized ? hospitalDaysTotal : undefined,
      workPartTimeDuringParental: worksPartTime,
      workFteRatio: worksPartTime ? workFteRatio : undefined,
      workWeeks: worksPartTime ? workWeeks : undefined,
      includePaternityLeave,
    }),
    [
      parentRole,
      contractType,
      grossSalary,
      childrenCount,
      hasLifeCertificate,
      submittedIn21Days,
      isPretermOrHospitalized,
      birthWeek,
      birthWeightGrams,
      hospitalDaysTotal,
      worksPartTime,
      workFteRatio,
      workWeeks,
      includePaternityLeave,
    ]
  );

  const activeResults = useMemo(() => {
    return calculateParentalBenefits(activeInput);
  }, [activeInput]);

  // Porównanie z wariantem przeciwnym (81,5% vs 100/70%)
  const comparisonResults = useMemo(() => {
    const inputAlt: BenefitCalculationInput = {
      ...activeInput,
      submissionWithin21Days: !submittedIn21Days,
    };
    const altResults = calculateParentalBenefits(inputAlt);

    const variantUnified = submittedIn21Days ? activeResults : altResults;
    const variantStandard = submittedIn21Days ? altResults : activeResults;

    const diff = Math.round(
      Math.abs(variantUnified.totalBenefitAmountSum - variantStandard.totalBenefitAmountSum) * 100
    ) / 100;

    const recommended =
      variantUnified.totalBenefitAmountSum >= variantStandard.totalBenefitAmountSum
        ? "unified"
        : "standard";

    return {
      variantUnified,
      variantStandard,
      diff,
      recommended,
    };
  }, [activeInput, activeResults, submittedIn21Days]);

  // Harmonogram kaskadowy miesięcy (miesiąc po miesiącu)
  const monthlyCascade = useMemo(() => {
    const months = [];
    const netBase = activeResults.netBaseMonthly;

    // Miesiące macierzyńskiego (np. 20 tyg -> ok. 4,6 miesiąca)
    const matRate = activeResults.momMaternityRatePercent;
    const matMonthly = Math.round(netBase * (matRate / 100));

    // Uzupełniający wcześniaka (art. 180²)
    const suppWeeks = activeResults.supplementaryWeeks;
    const suppMonthly = Math.round(netBase); // 100%

    // Rodzicielski matki
    const parRate = activeResults.momParentalRatePercent;
    let parMonthly = Math.round(netBase * (parRate / 100));
    let salaryFromWork = 0;

    if (worksPartTime) {
      salaryFromWork = Math.round(grossSalary * workFteRatio);
    }

    // Generujemy 12 miesięcy standardowego roku opieki
    for (let m = 1; m <= 12; m++) {
      let stageName = "";
      let benefit = 0;
      let workSalary = 0;
      let badge = "";

      if (m <= 5) {
        stageName = `Miesiąc ${m}: Urlop macierzyński`;
        benefit = matMonthly;
        badge = `${matRate}%`;
      } else if (suppWeeks > 0 && m === 6) {
        stageName = `Miesiąc ${m}: Dodatkowy macierzyński (art. 180² KP)`;
        benefit = suppMonthly;
        badge = "100% wcześniak";
      } else {
        stageName = `Miesiąc ${m}: Urlop rodzicielski`;
        benefit = parMonthly;
        workSalary = salaryFromWork;
        badge = worksPartTime ? `${parRate.toFixed(1)}% + 1/2 etatu` : `${parRate}%`;
      }

      months.push({
        monthNumber: m,
        stageName,
        benefitAmount: benefit,
        workSalary,
        totalIncome: benefit + workSalary,
        badge,
      });
    }

    return months;
  }, [activeResults, worksPartTime, workFteRatio, grossSalary]);

  // Generowanie i pobieranie pliku podsumowania kalkulacji (Download Report)
  const handleDownloadSummary = () => {
    const summaryText = `========================================================================
ZASIŁKOWY PRZEWODNIK PRZYSZŁEGO RODZICA - OFICJALNE PODSUMOWANIE KALKULACJI
Stan prawny: Luty 2026 | Zgodność: Dyrektywa Work-Life Balance & art. 180² KP
Data wygenerowania: ${new Date().toLocaleString("pl-PL")}
========================================================================

1. DANE WEJŚCIOWE:
- Wnioskodawca: ${parentRole === "mother" ? "Matka dziecka" : "Ojciec dziecka"}
- Tytuł ubezpieczenia: ${
      contractType === "employment"
        ? "Umowa o pracę (UoP)"
        : contractType === "mandate"
        ? "Umowa zlecenie"
        : "Działalność gospodarcza (JDG)"
    }
- Średnie miesięczne wynagrodzenie brutto: ${grossSalary.toLocaleString("pl-PL")} PLN
- Liczba dzieci przy jednym porodzie: ${childrenCount}
- Termin złożenia wniosku ZAM w 21 dni: ${submittedIn21Days ? "TAK (stawka uśredniona 81,5%)" : "NIE (wariant 100% / 70%)"}
- Zaświadczenie z ustawy "Za życiem": ${hasLifeCertificate ? "TAK" : "NIE"}
- Wcześniak / hospitalizacja noworodka: ${
      isPretermOrHospitalized
        ? `TAK (Tydzień ciąży: ${birthWeek}, Masa: ${birthWeightGrams}g, Szpital: ${hospitalDaysTotal} dni)`
        : "NIE"
    }
- Łączenie rodzicielskiego z pracą: ${
      worksPartTime
        ? `TAK (Wymiar: ${workFteRatio} etatu, Czas: ${workWeeks} tygodni)`
        : "NIE"
    }
- Urlop ojcowski (14 dni): ${includePaternityLeave ? "TAK" : "NIE"}

2. WYNIKI WYMIARU CZASOWEGO URLOPÓW:
- Urlop macierzyński: ${activeResults.maternityWeeks} tygodni
- Uzupełniający urlop macierzyński (art. 180² KP): ${activeResults.supplementaryWeeks} tygodni (100% płatny)
- Urlop rodzicielski (część wnioskodawcy): ${activeResults.parentalMomWeeks} tygodni
- Urlop rodzicielski (9 tygodni dla drugiego rodzica): ${activeResults.parentalDadReservedWeeks} tygodni (70%)
- Wydłużenie rodzicielskiego z tytułu pracy na część etatu: +${activeResults.parentalExtensionWeeks} tygodni
- ŁĄCZNY CZAS TRWANIA OPIEKI: ${
      activeResults.maternityWeeks +
      activeResults.supplementaryWeeks +
      activeResults.totalExtendedParentalWeeks +
      activeResults.parentalDadReservedWeeks
    } tygodni

3. WSKAŹNIKI FINANSOWE:
- Podstawa wymiaru zasiłku (po potrąceniu 13,71%): ${activeResults.netBaseMonthly.toFixed(2)} PLN
- Stawka dzienna zasiłku: ${activeResults.dailyBaseAmount.toFixed(2)} PLN
- Miesięczny zasiłek macierzyński: ${activeResults.maternityMonthlyBenefit.toFixed(2)} PLN
- Miesięczny zasiłek rodzicielski (wnioskodawca): ${activeResults.parentalMonthlyBenefitMom.toFixed(2)} PLN
- Miesięczny zasiłek za 9 tygodni drugiego rodzica: ${activeResults.parentalMonthlyBenefitDad.toFixed(2)} PLN
- Świadczenie z urlopu ojcowskiego: ${activeResults.paternityTotalBenefit.toFixed(2)} PLN
------------------------------------------------------------------------
ŁĄCZNA KWOTA ŚWIADCZEŃ W CYKLU: ${activeResults.totalBenefitAmountSum.toLocaleString("pl-PL")} PLN
========================================================================
Wygenerowano przez Zasiłkowy Przewodnik Przyszłego Rodzica (HackNation 2026).
Oficjalne rozstrzygnięcia wydaje Zakład Ubezpieczeń Społecznych.
`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Podsumowanie-Zasilkow-ZUS-2026-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      {/* Tytuł i Wprowadzenie */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#00823C] font-semibold text-xs tracking-wider uppercase mb-1">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator rodzicielski ZUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kalkulator wysokości zasiłków
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Sprawdź, ile wyniesie Twój miesięczny zasiłek, porównaj wariant uśredniony 81,5% z wariantem 100%/70% i poznaj prawa do urlopu dla taty oraz rodziców wcześniaków.
          </p>
        </div>

        {/* Szybkie presety scenariuszy */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Scenariusze:</span>
          <button
            type="button"
            onClick={() => loadPreset("standard")}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700"
          >
            Średnia UoP
          </button>
          <button
            type="button"
            onClick={() => loadPreset("preterm")}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 text-rose-700"
          >
            Wcześniak art. 180²
          </button>
          <button
            type="button"
            onClick={() => loadPreset("parttime")}
            className="px-2.5 py-1 text-xs font-semibold bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 text-[#005A9C]"
          >
            Praca 1/2 etatu
          </button>
          <button
            type="button"
            onClick={() => loadPreset("father")}
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 text-indigo-700"
          >
            Tata na urlopie
          </button>
          <button
            type="button"
            onClick={() => loadPreset("jdg")}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 text-amber-800"
          >
            Działalność JDG
          </button>
        </div>
      </div>

      {/* Banery Wykrytych Ryzyk Prawnych z Silnika */}
      {activeResults.riskWarnings && activeResults.riskWarnings.length > 0 && (
        <div className="space-y-3">
          {activeResults.riskWarnings.map((warning, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                warning.severity === "danger"
                  ? "bg-red-50 border-red-200 text-red-900"
                  : warning.severity === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-blue-50 border-blue-200 text-blue-900"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  warning.severity === "danger"
                    ? "text-red-600"
                    : warning.severity === "warning"
                    ? "text-amber-600"
                    : "text-[#005A9C]"
                }`}
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">{warning.title}</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/70 border border-current">
                    {warning.legalBasis}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{warning.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Główny Układ Siatki: Formularz (Kolumny 1-5) i Wyniki (Kolumny 6-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolumny 1-5: Panel Parametrów Wejściowych */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#005A9C]" />
              <span>Parametry ubezpieczenia i opieki</span>
            </h2>
            <button
              type="button"
              onClick={() => loadPreset("standard")}
              className="text-xs text-slate-400 hover:text-[#005A9C] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Domyślne</span>
            </button>
          </div>

          {/* Rola wnioskodawcy */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Wnioskodawca:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setParentRole("mother")}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  parentRole === "mother"
                    ? "border-[#005A9C] bg-blue-50 text-[#005A9C]"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Matka dziecka
              </button>
              <button
                type="button"
                onClick={() => setParentRole("father")}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  parentRole === "father"
                    ? "border-[#005A9C] bg-blue-50 text-[#005A9C]"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Ojciec dziecka
              </button>
            </div>
          </div>

          {/* Rodzaj umowy */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Tytuł do ubezpieczeń:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "employment" as const, label: "Umowa o pracę" },
                { id: "mandate" as const, label: "Zlecenie" },
                { id: "b2b" as const, label: "Działalność JDG" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContractType(c.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    contractType === c.id
                      ? "border-[#005A9C] bg-blue-50 text-[#005A9C]"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wynagrodzenie brutto / podstawa składek */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="gross-salary-input" className="text-xs font-bold text-slate-700">
                Średnie wynagrodzenie brutto (PLN):
              </label>
              <span className="text-xs font-bold text-[#005A9C]">
                {grossSalary.toLocaleString("pl-PL")} zł
              </span>
            </div>
            <div className="relative">
              <input
                id="gross-salary-input"
                type="number"
                min="4806"
                step="100"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                className="w-full pl-3 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">PLN</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Podstawa po potrąceniu 13,71%:</span>
              <strong className="text-slate-800">{activeResults.netBaseMonthly.toFixed(2)} zł</strong>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Stawka dzienna (dzielnik 30):</span>
              <strong className="text-slate-800">{activeResults.dailyBaseAmount.toFixed(2)} zł</strong>
            </div>
          </div>

          {/* Liczba dzieci przy jednym porodzie */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Liczba urodzonych dzieci:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 1, label: "1 dziecko (20 tyg.)" },
                { val: 2, label: "Bliźnięta (31 tyg.)" },
                { val: 3, label: "Trojaczki (33 tyg.)" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setChildrenCount(item.val)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    childrenCount === item.val
                      ? "border-[#005A9C] bg-blue-50 text-[#005A9C]"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wniosek w 21 dni */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
            <input
              id="sub-21"
              type="checkbox"
              checked={submittedIn21Days}
              onChange={(e) => setSubmittedIn21Days(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#005A9C] focus:ring-[#005A9C]"
            />
            <label htmlFor="sub-21" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold block text-slate-900">
                Wniosek ZAM złożony w ciągu 21 dni po porodzie
              </span>
              Wybór uśrednionej stawki 81,5% przez macierzyński i rodzicielski.
            </label>
          </div>

          {/* Zaświadczenie Za życiem */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-3">
            <input
              id="life-cert"
              type="checkbox"
              checked={hasLifeCertificate}
              onChange={(e) => setHasLifeCertificate(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#005A9C] focus:ring-[#005A9C]"
            />
            <label htmlFor="life-cert" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold block text-slate-900">
                Zaświadczenie z ustawy „Za życiem” (art. 4 ust. 3)
              </span>
              Wydłuża urlop rodzicielski do 65 tygodni (lub 67 przy porodzie mnogim).
            </label>
          </div>

          {/* Sekcja Wcześniactwa (art. 180² KP 2026) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5" />
                <span>Wcześniak / hospitalizacja (art. 180² KP)</span>
              </h3>
              <input
                type="checkbox"
                checked={isPretermOrHospitalized}
                onChange={(e) => setIsPretermOrHospitalized(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
            </div>

            {isPretermOrHospitalized && (
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Tydzień porodu:</label>
                    <input
                      type="number"
                      min="22"
                      max="40"
                      value={birthWeek}
                      onChange={(e) => setBirthWeek(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Masa urodzeniowa (g):</label>
                    <input
                      type="number"
                      min="400"
                      max="4500"
                      step="50"
                      value={birthWeightGrams}
                      onChange={(e) => setBirthWeightGrams(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Dni pobytu dziecka w szpitalu:</span>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={hospitalDaysTotal}
                    onChange={(e) => setHospitalDaysTotal(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                  />
                </div>
                <div className="text-[11px] text-rose-800 font-semibold">
                  Przyznano: <strong>+{activeResults.supplementaryWeeks} tyg.</strong> dodatkowego urlopu w stawce 100%!
                </div>
              </div>
            )}
          </div>

          {/* Sekcja Pracy na 1/2 etatu */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Łączenie rodzicielskiego z pracą (art. 182¹ᶠ KP)</span>
              </h3>
              <input
                type="checkbox"
                checked={worksPartTime}
                onChange={(e) => setWorksPartTime(e.target.checked)}
                className="w-4 h-4 rounded text-[#005A9C] focus:ring-[#005A9C]"
              />
            </div>

            {worksPartTime && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Wymiar etatu:</span>
                  <select
                    value={workFteRatio}
                    onChange={(e) => setWorkFteRatio(Number(e.target.value))}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                  >
                    <option value="0.25">1/4 etatu (0.25)</option>
                    <option value="0.5">1/2 etatu (0.50 - dopuszczalne max)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Liczba tygodni łączenia:</span>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={workWeeks}
                    onChange={(e) => setWorkWeeks(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center font-bold"
                  />
                </div>

                <p className="text-[11px] text-[#005A9C]">
                  Urlop zostanie wydłużony o dodatkowe{" "}
                  <strong>{activeResults.parentalExtensionWeeks} tygodni</strong>, a łączna pula świadczenia pozostaje w 100% zachowana!
                </p>
              </div>
            )}
          </div>

          {/* Urlop ojcowski (14 dni) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-3">
            <input
              id="pat-leave"
              type="checkbox"
              checked={includePaternityLeave}
              onChange={(e) => setIncludePaternityLeave(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#005A9C] focus:ring-[#005A9C]"
            />
            <label htmlFor="pat-leave" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold block text-slate-900">
                Uwzględnij 14 dni urlopu ojcowskiego (100% płatny)
              </span>
              Przysługuje tacie do ukończenia przez dziecko 12 miesięcy życia.
            </label>
          </div>
        </div>

        {/* Kolumny 6-12: Wyniki Finansowe i Porównywarka */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Główna Karta Podsumowania Świadczeń */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0C2340] to-[#005A9C] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                  Podsumowanie portfela rodzicielskiego 2026
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Łączny budżet świadczeń
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Rekomendacja: {comparisonResults.recommended === "unified" ? "Wariant 81,5%" : "Wariant 100/70%"}</span>
              </div>
            </div>

            {/* Kluczowe Liczby */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="text-xs text-blue-200">Miesięczny zasiłek wnioskodawcy:</div>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {activeResults.maternityMonthlyBenefit.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł
                  <span className="text-xs font-normal text-slate-300"> / m-c</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Stawka: <strong>{activeResults.momMaternityRatePercent}%</strong> (macierzyński)
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="text-xs text-emerald-300">Łączna kwota wypłaconych świadczeń:</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                  {activeResults.totalBenefitAmountSum.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Suma macierzyńskiego, rodzicielskiego, wcześniaka i ojcowskiego
                </div>
              </div>
            </div>

            {/* Wskaźniki Wymiaru Czasowego */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                Macierzyński: <strong>{activeResults.maternityWeeks} tyg.</strong>
              </div>
              {activeResults.supplementaryWeeks > 0 && (
                <div className="text-rose-300">
                  Wcześniak: <strong>+{activeResults.supplementaryWeeks} tyg. (100%)</strong>
                </div>
              )}
              <div>
                Rodzicielski: <strong>{activeResults.totalExtendedParentalWeeks || activeResults.parentalMomWeeks} tyg.</strong>
              </div>
              <div className="text-blue-300">
                Dla taty (WLB): <strong>{activeResults.parentalDadReservedWeeks} tyg. (70%)</strong>
              </div>
              {activeResults.parentalExtensionWeeks > 0 && (
                <div className="text-emerald-300">
                  Wydłużenie za pracę: <strong>+{activeResults.parentalExtensionWeeks} tyg.</strong>
                </div>
              )}
            </div>
          </div>

          {/* Porównanie Wariantu 81,5% z 100/70% */}
          <div className="gov-card p-6 space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#005A9C]" />
              <span>Porównanie wariantów wypłaty zasiłku</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wariant A */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  comparisonResults.recommended === "unified"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Wariant A &bull; Stałe 81,5%
                  </span>
                  {comparisonResults.recommended === "unified" && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                      Rekomendowany
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {comparisonResults.variantUnified.totalBenefitAmountSum.toLocaleString("pl-PL", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  zł
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Stała kwota przez 52 tygodnie. Brak spadku dochodu domowego po zakończeniu urlopu macierzyńskiego. Wymaga złożenia wniosku ZAM w terminie 21 dni.
                </p>
              </div>

              {/* Wariant B */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  comparisonResults.recommended === "standard"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Wariant B &bull; 100% potem 70%
                  </span>
                  {comparisonResults.recommended === "standard" && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                      Rekomendowany
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {comparisonResults.variantStandard.totalBenefitAmountSum.toLocaleString("pl-PL", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  zł
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Wyższy zasiłek przez pierwsze 20 tygodni (100%), a następnie spadek do 70%. Korzystniejszy tylko wtedy, gdy mama wraca do pracy od razu po macierzyńskim.
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
              <span>Różnica w łącznej kwocie między wariantami:</span>
              <strong className="text-[#005A9C] font-bold">
                {comparisonResults.diff.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł
              </strong>
            </div>
          </div>

          {/* Harmonogram Kaskadowy Dochodów Miesiąc po Miesiącu */}
          <div className="gov-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#005A9C]" />
                <span>Harmonogram kaskadowy dochodów (miesiąc po miesiącu)</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">Cykl roczny (12 miesięcy)</span>
            </div>

            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-1">Miesiąc</th>
                    <th className="py-2 px-2">Etap opieki</th>
                    <th className="py-2 px-2">Zasiłek ZUS</th>
                    {worksPartTime && <th className="py-2 px-2">Pensja za 1/2 etatu</th>}
                    <th className="py-2 px-2 text-right">Dochód łączny</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyCascade.map((item) => (
                    <tr key={item.monthNumber} className="hover:bg-slate-50">
                      <td className="py-2.5 px-1 font-bold text-slate-900">M{item.monthNumber}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium text-slate-800">{item.stageName}</span>
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#005A9C] font-semibold">
                          {item.badge}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-bold text-slate-900">
                        {item.benefitAmount.toLocaleString("pl-PL")} zł
                      </td>
                      {worksPartTime && (
                        <td className="py-2.5 px-2 font-semibold text-emerald-700">
                          {item.workSalary > 0 ? `+${item.workSalary.toLocaleString("pl-PL")} zł` : "-"}
                        </td>
                      )}
                      <td className="py-2.5 px-2 text-right font-extrabold text-[#005A9C]">
                        {item.totalIncome.toLocaleString("pl-PL")} zł
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Działania i Eksport Podsumowania */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Chcesz pobrać oficjalne zestawienie wyliczeń?</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadSummary}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pobierz podsumowanie</span>
              </button>

              <Link
                href="/e-uslugi"
                className="inline-flex items-center gap-1.5 bg-[#005A9C] hover:bg-[#00477d] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow-xs"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Przejdź do wniosku ZAM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
