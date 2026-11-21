"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParentProfile } from "@/context/ParentProfileContext";
import {
  calculateParentalBenefits,
  BenefitCalculationInput,
  ContractType,
  ParentRole,
} from "@hacknation/shared";
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Layers,
  ChevronRight,
  User,
  Users,
  Building2,
  Check,
  ListFilter,
  FileText,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function KalkulatorPage() {
  const router = useRouter();
  const { profile, openGlossary } = useParentProfile();
  // Tryb wyświetlania: wizard (krok po kroku) vs compact (wszystko na jednym ekranie)
  const [viewMode, setViewMode] = useState<"wizard" | "full">("wizard");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Stan formularza wejściowego
  const [parentRole, setParentRole] = useState<ParentRole>("mother");
  const [contractType, setContractType] = useState<ContractType>("employment");
  const [grossSalary, setGrossSalary] = useState<number>(7500);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [submittedIn21Days, setSubmittedIn21Days] = useState<boolean>(true);
  const [hasLifeCertificate, setHasLifeCertificate] = useState<boolean>(false);
  const [includePaternityLeave, setIncludePaternityLeave] = useState<boolean>(true);

  // Wcześniactwo i hospitalizacja (art. 180² KP 2026)
  const [isPretermOrHospitalized, setIsPretermOrHospitalized] = useState<boolean>(false);
  const [birthWeek, setBirthWeek] = useState<number>(27);
  const [birthWeightGrams, setBirthWeightGrams] = useState<number>(920);
  const [hospitalDaysTotal, setHospitalDaysTotal] = useState<number>(70);

  // Praca na część etatu w trakcie rodzicielskiego (art. 182¹ᶠ KP)
  const [worksPartTime, setWorksPartTime] = useState<boolean>(false);
  const [workFteRatio, setWorkFteRatio] = useState<number>(0.5);
  const [workWeeks, setWorkWeeks] = useState<number>(16);

  // Wczytaj dane z Centralnego Profilu Rodziny, jeśli użytkownik przeszedł wcześniej kreator
  useEffect(() => {
    if (profile) {
      if (profile.whoOnLeave === "father") setParentRole("father");
      else setParentRole("mother");
      if (profile.contractType) setContractType(profile.contractType);
      if (profile.monthlySalaryGross) setGrossSalary(profile.monthlySalaryGross);
      if (profile.childrenCount) setChildrenCount(profile.childrenCount);
      if (typeof profile.submittedIn21Days === "boolean") setSubmittedIn21Days(profile.submittedIn21Days);
      if (typeof profile.isPretermOrHospitalized === "boolean") {
        setIsPretermOrHospitalized(profile.isPretermOrHospitalized);
        if (profile.hospitalDays) setHospitalDaysTotal(profile.hospitalDays);
      }
      if (typeof profile.worksPartTime === "boolean") {
        setWorksPartTime(profile.worksPartTime);
        if (profile.workFteRatio) setWorkFteRatio(profile.workFteRatio);
      }
    }
  }, [profile]);

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

  // Wyliczenia z silnika obliczeniowego
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

    const diff =
      Math.round(
        Math.abs(
          variantUnified.totalBenefitAmountSum - variantStandard.totalBenefitAmountSum
        ) * 100
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

    const matRate = activeResults.momMaternityRatePercent;
    const matMonthly = Math.round(netBase * (matRate / 100));

    const suppWeeks = activeResults.supplementaryWeeks;
    const suppMonthly = Math.round(netBase);

    const parRate = activeResults.momParentalRatePercent;
    const parMonthly = Math.round(netBase * (parRate / 100));
    let salaryFromWork = 0;

    if (worksPartTime) {
      salaryFromWork = Math.round(grossSalary * workFteRatio);
    }

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

  // Pobieranie oficjalnego raportu
  const handleDownloadSummary = () => {
    const summaryText = `========================================================================
ZASIŁKOWY PRZEWODNIK PRZYSZŁEGO RODZICA - OFICJALNE PODSUMOWANIE KALKULACJI ZUS
Stan prawny: 2026 | Zgodność: Dyrektywa Work-Life Balance & art. 180² KP
Data wygenerowania: ${new Date().toLocaleString("pl-PL")}
========================================================================

1. DANE Z FORMULARZA:
- Wnioskodawca: ${parentRole === "mother" ? "Matka dziecka" : "Ojciec dziecka"}
- Tytuł do ubezpieczeń: ${
      contractType === "employment"
        ? "Umowa o pracę (UoP)"
        : contractType === "mandate"
        ? "Umowa zlecenie"
        : "Działalność gospodarcza (JDG)"
    }
- Średnie miesięczne wynagrodzenie brutto: ${grossSalary.toLocaleString("pl-PL")} PLN
- Liczba dzieci przy jednym porodzie: ${childrenCount}
- Termin wniosku ZAM do 21 dni po porodzie: ${
      submittedIn21Days
        ? "TAK (uśredniona stawka 81,5%)"
        : "NIE (wariant standardowy 100% / 70%)"
    }
- Zaświadczenie z ustawy "Za życiem": ${hasLifeCertificate ? "TAK" : "NIE"}
- Wcześniak / hospitalizacja noworodka: ${
      isPretermOrHospitalized
        ? `TAK (Tydzień ciąży: ${birthWeek}, Waga: ${birthWeightGrams}g, Szpital: ${hospitalDaysTotal} dni)`
        : "NIE"
    }
- Łączenie rodzicielskiego z pracą: ${
      worksPartTime
        ? `TAK (Wymiar: ${workFteRatio} etatu, Okres: ${workWeeks} tygodni)`
        : "NIE"
    }
- 14 dni urlopu ojcowskiego: ${includePaternityLeave ? "TAK" : "NIE"}

2. WYMIAR CZASOWY URLOPÓW:
- Urlop macierzyński: ${activeResults.maternityWeeks} tygodni
- Uzupełniający macierzyński dla wcześniaka (art. 180² KP): ${
      activeResults.supplementaryWeeks
    } tygodni (100% płatne)
- Urlop rodzicielski (część wnioskodawcy): ${activeResults.parentalMomWeeks} tygodni
- Urlop rodzicielski (9 tygodni dla drugiego rodzica): ${
      activeResults.parentalDadReservedWeeks
    } tygodni (70%)
- Wydłużenie urlopu z tytułu pracy: +${activeResults.parentalExtensionWeeks} tygodni
- ŁĄCZNY OKRES OPIEKI: ${
      activeResults.maternityWeeks +
      activeResults.supplementaryWeeks +
      activeResults.totalExtendedParentalWeeks +
      activeResults.parentalDadReservedWeeks
    } tygodni

3. WYNIKI FINANSOWE ZASIŁKÓW:
- Miesięczna podstawa wymiaru zasiłku: ${activeResults.netBaseMonthly.toFixed(2)} PLN
- Stawka dzienna zasiłku: ${activeResults.dailyBaseAmount.toFixed(2)} PLN
- Miesięczny zasiłek macierzyński: ${activeResults.maternityMonthlyBenefit.toFixed(2)} PLN
- Miesięczny zasiłek rodzicielski: ${activeResults.parentalMonthlyBenefitMom.toFixed(2)} PLN
- Zasiłek za 9 tygodni drugiego rodzica: ${activeResults.parentalMonthlyBenefitDad.toFixed(2)} PLN
- Świadczenie za urlop ojcowski (14 dni): ${activeResults.paternityTotalBenefit.toFixed(2)} PLN
------------------------------------------------------------------------
ŁĄCZNA KWOTA ŚWIADCZEŃ: ${activeResults.totalBenefitAmountSum.toLocaleString("pl-PL")} PLN
========================================================================
Wygenerowano w portalu: Zasiłkowy Przewodnik Rodzica (zus.pl).
`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Kalkulacja-Zasilku-ZUS-2026-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTransferToZam = () => {
    const mappedContract: "employment" | "mandate" | "b2b" =
      contractType === "employment"
        ? "employment"
        : contractType === "mandate"
        ? "mandate"
        : "b2b";

    const payload = {
      contractType: mappedContract,
      monthlySalaryGross: grossSalary,
      childrenCount,
      chosenRate: submittedIn21Days ? "815" : "100_70",
      isPremature: isPretermOrHospitalized,
      hospitalDays: hospitalDaysTotal,
      hasLifeCert: hasLifeCertificate,
      transferredAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem("zus_zam_prefill", JSON.stringify(payload));
    } catch {
      // Fallback jeśli localStorage zablokowany
    }

    router.push("/e-uslugi?prefill=1");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6 w-full">
      {/* Pasek Okruszków (Breadcrumbs) ZUS */}
      <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
        <Link href="/">Strona główna</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/przewodnik">Świadczenia</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">
          Kalkulator wysokości zasiłków
        </span>
      </nav>

      {/* Nagłówek Sekcji Kalkulatora */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="zus-badge">
              <Calculator className="w-3.5 h-3.5 mr-1 text-[#007834]" />
              OFICJALNY KALKULATOR ZUS 2026
            </span>
            <span className="zus-badge-navy">KROK PO KROKU</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00416E] tracking-tight mt-1.5">
            Kalkulator świadczeń rodzicielskich
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Odpowiedz na kilka prostych pytań jedno po drugim. Formularz automatycznie dopasuje przepisy Kodeksu Pracy i wyliczy Twoje miesięczne świadczenie.
          </p>
        </div>

        {/* Przełącznik trybu oraz presety */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openGlossary()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#00416E] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00416E]" />
            <span>Trudne słowa (Słownik)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === "wizard" ? "full" : "wizard")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#007834] bg-emerald-50 hover:bg-emerald-100 border border-[#c2e4cc] rounded transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{viewMode === "wizard" ? "Pokaż pełny formularz" : "Włącz tryb pytań krok po kroku"}</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset("standard")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700"
            title="Przywróć domyślne parametry"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {profile && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#007834] shrink-0" />
            <span>
              Wczytano Twój profil: <strong>{profile.whoOnLeave === "both" ? "Oboje rodzice" : profile.whoOnLeave === "father" ? "Tata" : "Mama"}</strong>, pensja <strong>{profile.monthlySalaryGross.toLocaleString("pl-PL")} zł brutto</strong> ({profile.contractType === "employment" ? "Umowa o pracę" : profile.contractType === "b2b" ? "JDG" : "Zlecenie"}).
            </span>
          </div>
          <span className="text-[11px] font-bold bg-[#007834] text-white px-2.5 py-1 rounded-md shrink-0">
            Kalkulator zsynchronizowany
          </span>
        </div>
      )}

      {/* GŁÓWNA CZĘŚĆ: INTERAKTYWNY KREATOR PYTANIE PO PYTANIU */}
      {viewMode === "wizard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolumny 1-7: Aktywne pytanie formularza */}
          <div className="lg:col-span-7 bg-white border border-[#dee2e6] rounded-lg shadow-xs p-6 sm:p-8 space-y-6">
            {/* Pasek postępu kroków */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#007834] uppercase tracking-wider">
                  Pytanie {currentStep} z {totalSteps}
                </span>
                <span className="text-slate-500 font-medium">
                  {Math.round((currentStep / totalSteps) * 100)}% ukończono
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#007834] transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Treść poszczególnych pytań */}
            <div className="min-h-[290px] flex flex-col justify-between">
              {/* PYTANIE 1 */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 1: Wnioskodawca
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Kto składa wniosek o zasiłek i będzie korzystać z urlopu?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Wybierz rolę rodzica wnioskującego. Matce przysługuje urlop macierzyński i rodzicielski, a ojciec ma dodatkowo gwarantowane 9 tygodni w dyrektywie WLB oraz 14 dni urlopu ojcowskiego.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setParentRole("mother");
                      }}
                      className={`p-5 rounded-lg border-2 text-left flex items-start gap-4 transition-all ${
                        parentRole === "mother"
                          ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          parentRole === "mother"
                            ? "bg-[#007834] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>Matka dziecka</span>
                          {parentRole === "mother" && (
                            <Check className="w-4 h-4 text-[#007834]" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Urlop macierzyński (20 tyg.) oraz część rodzicielskiego (do 32 tyg.).
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setParentRole("father");
                      }}
                      className={`p-5 rounded-lg border-2 text-left flex items-start gap-4 transition-all ${
                        parentRole === "father"
                          ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          parentRole === "father"
                            ? "bg-[#007834] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>Ojciec dziecka</span>
                          {parentRole === "father" && (
                            <Check className="w-4 h-4 text-[#007834]" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          9 tygodni wyłącznego urlopu rodzicielskiego (70%) oraz 14 dni ojcowskiego.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* PYTANIE 2 */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 2: Forma zatrudnienia
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Jaki jest Twój tytuł do ubezpieczeń społecznych?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Podstawa wymiaru zasiłku zależy od formy opłacania składek na ubezpieczenie chorobowe w ZUS.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                    {[
                      {
                        id: "employment" as const,
                        label: "Umowa o pracę (UoP)",
                        desc: "Obowiązkowe ubezpieczenie chorobowe. Ochrona przed zwolnieniem.",
                        icon: Building2,
                      },
                      {
                        id: "mandate" as const,
                        label: "Umowa zlecenie",
                        desc: "Dobrowolne ubezpieczenie chorobowe zgłoszone w ZUS.",
                        icon: FileText,
                      },
                      {
                        id: "b2b" as const,
                        label: "Działalność (JDG)",
                        desc: "Własna działalność z opłacaniem dobrowolnej składki chorobowej.",
                        icon: Briefcase,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = contractType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setContractType(item.id)}
                          className={`p-4 rounded-lg border-2 text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="space-y-2">
                            <div
                              className={`w-8 h-8 rounded flex items-center justify-center ${
                                isSelected
                                  ? "bg-[#007834] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="font-bold text-xs sm:text-sm text-slate-900">
                              {item.label}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-[11px] font-bold text-[#007834] mt-2 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Wybrano
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PYTANIE 3 */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 3: Wynagrodzenie i podstawa
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Ile wynosi Twoje średnie miesięczne wynagrodzenie brutto?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Podaj średnie wynagrodzenie brutto z ostatnich 12 miesięcy kalendarzowych poprzedzających miesiąc porodu.
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Pole z dużą kwotą */}
                    <div className="bg-[#f8f9fa] border border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label
                          htmlFor="wizard-salary-input"
                          className="text-xs font-bold text-slate-600 block mb-1"
                        >
                          Kwota brutto (PLN):
                        </label>
                        <div className="relative max-w-xs">
                          <input
                            id="wizard-salary-input"
                            type="number"
                            min="4666"
                            step="100"
                            value={grossSalary}
                            onChange={(e) =>
                              setGrossSalary(Math.max(0, Number(e.target.value)))
                            }
                            className="w-full pl-3 pr-12 py-2.5 bg-white border border-slate-300 rounded text-xl font-black text-[#00416E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
                          />
                          <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                            PLN
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 sm:text-right space-y-1">
                        <div>
                          Podstawa ZUS (-13,71%):{" "}
                          <strong className="text-slate-900 font-bold">
                            {activeResults.netBaseMonthly.toFixed(2)} zł
                          </strong>
                        </div>
                        <div>
                          Stawka dzienna zasiłku:{" "}
                          <strong className="text-[#007834] font-bold">
                            {activeResults.dailyBaseAmount.toFixed(2)} zł
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Szybkie propozycje kwot */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Szybki wybór popularnych stawek:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "4 806 zł (Min. krajowa 2026)", val: 4806 },
                          { label: "6 000 zł", val: 6000 },
                          { label: "7 500 zł (Średnia)", val: 7500 },
                          { label: "10 000 zł", val: 10000 },
                          { label: "14 000 zł", val: 14000 },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => setGrossSalary(btn.val)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                              grossSalary === btn.val
                                ? "bg-[#007834] text-white border-[#007834]"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PYTANIE 4 */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 4: Liczba dzieci
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Ile dzieci urodziło się lub urodzi przy jednym porodzie?
                    </h2>
                    <p className="text-xs text-slate-600">
                      W przypadku porodu mnogiego (np. bliźniąt) wymiar urlopu macierzyńskiego i rodzicielskiego jest znacząco wydłużony.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                    {[
                      {
                        count: 1,
                        title: "1 dziecko",
                        maternity: "20 tyg. macierzyńskiego",
                        parental: "41 tyg. rodzicielskiego",
                      },
                      {
                        count: 2,
                        title: "Bliźnięta (2 dzieci)",
                        maternity: "31 tyg. macierzyńskiego",
                        parental: "43 tyg. rodzicielskiego",
                      },
                      {
                        count: 3,
                        title: "Trojaczki lub więcej",
                        maternity: "33–37 tyg. macierzyńskiego",
                        parental: "43 tyg. rodzicielskiego",
                      },
                    ].map((item) => {
                      const isSelected = childrenCount === item.count;
                      return (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setChildrenCount(item.count)}
                          className={`p-4 rounded-lg border-2 text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-black text-slate-900">
                                {item.title}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#007834]" />
                              )}
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div className="font-semibold text-[#007834]">
                                {item.maternity}
                              </div>
                              <div className="text-slate-500">
                                + {item.parental}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PYTANIE 5 */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 5: Termin wniosku ZAM
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Kiedy planujesz złożyć wniosek o zasiłek macierzyński (druk ZAM)?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Termin 21 dni po porodzie to kluczowa data w Kodeksie Pracy i ustawie zasiłkowej, decydująca o sposobie wypłaty świadczeń.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmittedIn21Days(true)}
                      className={`p-5 rounded-lg border-2 text-left space-y-2 transition-all ${
                        submittedIn21Days
                          ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#007834] bg-emerald-100/70 px-2 py-0.5 rounded">
                          Rekomendowane
                        </span>
                        {submittedIn21Days && (
                          <Check className="w-5 h-5 text-[#007834]" />
                        )}
                      </div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900">
                        W terminie do 21 dni po porodzie
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Otrzymujesz równą, uśrednioną stawkę <strong>81,5%</strong> podstawy przez cały rok (zarówno urlop macierzyński, jak i rodzicielski). Brak spadku domowego budżetu po 20 tygodniach.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmittedIn21Days(false)}
                      className={`p-5 rounded-lg border-2 text-left space-y-2 transition-all ${
                        !submittedIn21Days
                          ? "border-[#00416E] bg-blue-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Wariant standardowy
                        </span>
                        {!submittedIn21Days && (
                          <Check className="w-5 h-5 text-[#00416E]" />
                        )}
                      </div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900">
                        Po 21 dniach od porodu
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Otrzymujesz <strong>100%</strong> podstawy za okres macierzyńskiego (20 tyg.), a następnie spadek do <strong>70%</strong> za urlop rodzicielski.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* PYTANIE 6 */}
              {currentStep === 6 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 6: Wcześniactwo i hospitalizacja
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Czy noworodek urodził się przedwcześnie lub wymagał dłuższego pobytu w szpitalu?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Nowe przepisy Kodeksu Pracy (art. 180² KP) przyznają rodzicom hospitalizowanych dzieci nawet do <strong>15 dodatkowych tygodni 100% płatnego urlopu</strong>.
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPretermOrHospitalized(false)}
                        className={`p-3.5 rounded-lg border-2 text-center text-xs font-bold transition-all ${
                          !isPretermOrHospitalized
                            ? "border-[#007834] bg-emerald-50/50 text-[#007834]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Nie, poród o czasie
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPretermOrHospitalized(true)}
                        className={`p-3.5 rounded-lg border-2 text-center text-xs font-bold transition-all ${
                          isPretermOrHospitalized
                            ? "border-[#007834] bg-emerald-50/70 text-[#007834]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Tak, dziecko było w szpitalu / wcześniak
                      </button>
                    </div>

                    {isPretermOrHospitalized && (
                      <div className="p-4 bg-emerald-50/50 border border-[#c2e4cc] rounded-lg space-y-3 animate-in fade-in">
                        <div className="text-xs font-bold text-[#007834]">
                          Podaj parametry urodzeniowe noworodka:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Tydzień ciąży:
                            </label>
                            <input
                              type="number"
                              min="22"
                              max="40"
                              value={birthWeek}
                              onChange={(e) => setBirthWeek(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-bold"
                            />
                            <span className="text-[10px] text-slate-500">
                              (np. 27. tydzień)
                            </span>
                          </div>

                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Masa urodzeniowa (g):
                            </label>
                            <input
                              type="number"
                              min="400"
                              max="4500"
                              step="50"
                              value={birthWeightGrams}
                              onChange={(e) =>
                                setBirthWeightGrams(Number(e.target.value))
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-bold"
                            />
                            <span className="text-[10px] text-slate-500">
                              (np. 950 g)
                            </span>
                          </div>

                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Dni w szpitalu:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="180"
                              value={hospitalDaysTotal}
                              onChange={(e) =>
                                setHospitalDaysTotal(Number(e.target.value))
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-bold"
                            />
                            <span className="text-[10px] text-slate-500">
                              (do 8. lub 15. tyg.)
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border border-[#c2e4cc] rounded text-xs text-[#007834] font-bold flex items-center justify-between">
                          <span>Przyznane dodatkowe uprawnienie:</span>
                          <span className="text-sm text-[#007834]">
                            +{activeResults.supplementaryWeeks} tyg. dodatkowego urlopu w 100%!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PYTANIE 7 */}
              {currentStep === 7 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 7: Praca na część etatu
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Czy w trakcie urlopu rodzicielskiego planujesz pracować na część etatu (np. 1/2 etatu)?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Zgodnie z art. 182¹ᶠ Kodeksu Pracy możesz łączyć opiekę z pracą u dotychczasowego pracodawcy. Zasiłek nie przepada, a urlop ulega proporcjonalnemu wydłużeniu!
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWorksPartTime(false)}
                        className={`p-3.5 rounded-lg border-2 text-center text-xs font-bold transition-all ${
                          !worksPartTime
                            ? "border-[#007834] bg-emerald-50/50 text-[#007834]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Nie, 100% czasu na opiekę
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorksPartTime(true)}
                        className={`p-3.5 rounded-lg border-2 text-center text-xs font-bold transition-all ${
                          worksPartTime
                            ? "border-[#00416E] bg-blue-50/70 text-[#00416E]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Tak, chcę łączyć urlop z pracą
                      </button>
                    </div>

                    {worksPartTime && (
                      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg space-y-3 animate-in fade-in text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Wymiar etatu:
                            </label>
                            <select
                              value={workFteRatio}
                              onChange={(e) => setWorkFteRatio(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-bold"
                            >
                              <option value="0.25">1/4 etatu (0.25)</option>
                              <option value="0.5">1/2 etatu (0.50 - maksymalny dopuszczalny)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Liczba tygodni łączenia:
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="32"
                              value={workWeeks}
                              onChange={(e) => setWorkWeeks(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-bold"
                            />
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border border-blue-200 rounded text-xs text-blue-900 font-bold flex items-center justify-between">
                          <span>Wydłużenie urlopu rodzicielskiego:</span>
                          <span className="text-[#007834]">
                            +{activeResults.parentalExtensionWeeks} tygodni
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PYTANIE 8 */}
              {currentStep === 8 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Krok 8: Dodatkowe uprawnienia
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#00416E]">
                      Czy w kalkulacji uwzględnić urlop ojcowski lub ustawę „Za życiem”?
                    </h2>
                    <p className="text-xs text-slate-600">
                      Zaznacz opcje, które dotyczą Twojej rodziny, aby poznać pełną sumę przysługujących świadczeń.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="bg-[#f8f9fa] p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                      <input
                        id="wizard-pat"
                        type="checkbox"
                        checked={includePaternityLeave}
                        onChange={(e) => setIncludePaternityLeave(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#007834] focus:ring-[#007834]"
                      />
                      <label htmlFor="wizard-pat" className="text-xs text-slate-700 cursor-pointer">
                        <span className="font-bold block text-slate-900 text-sm">
                          14 dni urlopu ojcowskiego (100% płatne)
                        </span>
                        Przysługuje ojcu do ukończenia przez dziecko 12. miesiąca życia. Nie wpływa na urlop macierzyński matki.
                      </label>
                    </div>

                    <div className="bg-[#f8f9fa] p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                      <input
                        id="wizard-life"
                        type="checkbox"
                        checked={hasLifeCertificate}
                        onChange={(e) => setHasLifeCertificate(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#007834] focus:ring-[#007834]"
                      />
                      <label htmlFor="wizard-life" className="text-xs text-slate-700 cursor-pointer">
                        <span className="font-bold block text-slate-900 text-sm">
                          Zaświadczenie z ustawy „Za życiem” (art. 4 ust. 3)
                        </span>
                        Wydłuża urlop rodzicielski do 65 tygodni (lub 67 przy ciąży mnogiej).
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Przyciski Nawigacji Formularza */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded text-xs font-bold transition-colors ${
                  currentStep === 1
                    ? "text-slate-300 cursor-not-allowed bg-slate-50"
                    : "text-slate-700 hover:bg-slate-100 bg-white border border-slate-300"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Wstecz</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                  className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-colors shadow-2xs"
                >
                  <span>Następne pytanie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("results-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zobacz pełne wyliczenie wyników</span>
                </button>
              )}
            </div>
          </div>

          {/* Kolumny 8-12: Boczny panel podglądu Twoich odpowiedzi */}
          <div className="lg:col-span-5 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#00416E] flex items-center gap-1.5">
                <ListFilter className="w-4 h-4 text-[#007834]" />
                <span>Twoje odpowiedzi:</span>
              </h3>
              <span className="text-[11px] text-slate-400">Kliknij, by zmienić</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { step: 1, label: "Wnioskodawca", val: parentRole === "mother" ? "Matka dziecka" : "Ojciec dziecka" },
                { step: 2, label: "Umowa", val: contractType === "employment" ? "Umowa o pracę (UoP)" : contractType === "mandate" ? "Zlecenie" : "Działalność JDG" },
                { step: 3, label: "Średnie brutto", val: `${grossSalary.toLocaleString("pl-PL")} PLN` },
                { step: 4, label: "Liczba dzieci", val: childrenCount === 1 ? "1 dziecko (20 tyg.)" : childrenCount === 2 ? "Bliźnięta (31 tyg.)" : "Trojaczki+" },
                { step: 5, label: "Termin 21 dni", val: submittedIn21Days ? "TAK (stawka 81,5%)" : "NIE (100% / 70%)" },
                { step: 6, label: "Wcześniak / Szpital", val: isPretermOrHospitalized ? `TAK (+${activeResults.supplementaryWeeks} tyg.)` : "NIE" },
                { step: 7, label: "Łączenie z pracą", val: worksPartTime ? `TAK (${workFteRatio} etatu)` : "NIE" },
                { step: 8, label: "Urlop ojcowski", val: includePaternityLeave ? "TAK (14 dni)" : "NIE" },
              ].map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setCurrentStep(item.step)}
                  className={`w-full flex items-center justify-between p-2 rounded border text-left transition-colors ${
                    currentStep === item.step
                      ? "bg-white border-[#007834] font-bold text-[#007834] shadow-2xs"
                      : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white"
                  }`}
                >
                  <span className="text-slate-500 font-medium">{item.label}:</span>
                  <span className="font-bold">{item.val}</span>
                </button>
              ))}
            </div>

            {/* Szybki podgląd wyliczonej kwoty */}
            <div className="pt-2 border-t border-slate-200">
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-medium">Aktualnie wyliczony zasiłek miesięczny:</span>
                <div className="text-xl font-black text-[#007834]">
                  {activeResults.maternityMonthlyBenefit.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł
                  <span className="text-xs font-normal text-slate-500"> / m-c</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Łączna pula świadczeń: <strong>{activeResults.totalBenefitAmountSum.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALTERNATYWNY WIDOK: PEŁNY FORMULARZ (dla zaawansowanych / jurorów) */}
      {viewMode === "full" && (
        <div className="bg-white p-6 rounded-lg border border-[#dee2e6] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#00416E] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#007834]" />
              <span>Wszystkie parametry kalkulacji (widok pełny)</span>
            </h2>
            <button
              type="button"
              onClick={() => setViewMode("wizard")}
              className="text-xs text-[#007834] font-bold hover:underline"
            >
              Wróć do pytań krok po kroku
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rola */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Wnioskodawca:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setParentRole("mother")}
                  className={`py-2 px-2.5 rounded text-xs font-semibold border transition-all text-center ${
                    parentRole === "mother"
                      ? "border-[#007834] bg-emerald-50 text-[#007834]"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Matka dziecka
                </button>
                <button
                  type="button"
                  onClick={() => setParentRole("father")}
                  className={`py-2 px-2.5 rounded text-xs font-semibold border transition-all text-center ${
                    parentRole === "father"
                      ? "border-[#007834] bg-emerald-50 text-[#007834]"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Ojciec dziecka
                </button>
              </div>
            </div>

            {/* Umowa */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Tytuł do ubezpieczeń:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "employment" as const, label: "UoP" },
                  { id: "mandate" as const, label: "Zlecenie" },
                  { id: "b2b" as const, label: "JDG" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContractType(c.id)}
                    className={`py-2 px-2 rounded text-xs font-semibold border transition-all text-center ${
                      contractType === c.id
                        ? "border-[#007834] bg-emerald-50 text-[#007834]"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wynagrodzenie */}
            <div className="space-y-2">
              <label htmlFor="full-salary-input" className="text-xs font-bold text-slate-700">
                Średnie brutto: {grossSalary.toLocaleString("pl-PL")} zł
              </label>
              <input
                id="full-salary-input"
                type="number"
                min="4806"
                step="100"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SEKCJA WYNIKÓW I PORÓWNYWARKA FINANSOWA */}
      <div id="results-section" className="space-y-6 pt-4">
        {/* Banery Ryzyk Prawnych z Silnika */}
        {activeResults.riskWarnings && activeResults.riskWarnings.length > 0 && (
          <div className="space-y-3">
            {activeResults.riskWarnings.map((warning, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border flex items-start gap-3 ${
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
                      ? "text-[#f39200]"
                      : "text-[#00416E]"
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

        {/* Główna Karta Podsumowania Świadczeń w Kolorystyce ZUS */}
        <div className="bg-[#00416E] text-white p-6 sm:p-8 rounded-lg shadow-sm space-y-6 border-t-4 border-[#007834]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Podsumowanie finansowe świadczeń rodzicielskich 2026
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Łączny budżet świadczeń z ZUS
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#007834] text-white px-3 py-1 rounded text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>
                Rekomendacja:{" "}
                {comparisonResults.recommended === "unified"
                  ? "Wariant 81,5%"
                  : "Wariant 100/70%"}
              </span>
            </div>
          </div>

          {/* Kluczowe Liczby */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded border border-white/15">
              <div className="text-xs text-blue-200">
                Miesięczny zasiłek wnioskodawcy:
              </div>
              <div className="text-3xl font-extrabold text-white mt-1">
                {activeResults.maternityMonthlyBenefit.toLocaleString("pl-PL", {
                  maximumFractionDigits: 0,
                })}{" "}
                zł
                <span className="text-xs font-normal text-slate-300"> / m-c</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Stawka: <strong>{activeResults.momMaternityRatePercent}%</strong> (macierzyński)
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded border border-white/15">
              <div className="text-xs text-emerald-300">
                Łączna kwota wypłaconych świadczeń:
              </div>
              <div className="text-3xl font-extrabold text-emerald-300 mt-1">
                {activeResults.totalBenefitAmountSum.toLocaleString("pl-PL", {
                  maximumFractionDigits: 0,
                })}{" "}
                zł
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Suma macierzyńskiego, rodzicielskiego, wcześniaka i ojcowskiego
              </div>
            </div>
          </div>

          {/* Wskaźniki Wymiaru Czasowego */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
            <div>
              Macierzyński: <strong>{activeResults.maternityWeeks} tyg.</strong>
            </div>
            {activeResults.supplementaryWeeks > 0 && (
              <div className="text-emerald-300">
                Wcześniak (art. 180²): <strong>+{activeResults.supplementaryWeeks} tyg. (100%)</strong>
              </div>
            )}
            <div>
              Rodzicielski:{" "}
              <strong>
                {activeResults.totalExtendedParentalWeeks ||
                  activeResults.parentalMomWeeks}{" "}
                tyg.
              </strong>
            </div>
            <div className="text-emerald-300">
              Dla drugiego rodzica (WLB):{" "}
              <strong>{activeResults.parentalDadReservedWeeks} tyg. (70%)</strong>
            </div>
            {activeResults.parentalExtensionWeeks > 0 && (
              <div className="text-emerald-300">
                Wydłużenie za pracę:{" "}
                <strong>+{activeResults.parentalExtensionWeeks} tyg.</strong>
              </div>
            )}
          </div>
        </div>

        {/* Porównanie Wariantu 81,5% vs 100/70% */}
        <div className="zus-card p-6 space-y-4">
          <h4 className="text-base font-bold text-[#00416E] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#007834]" />
            <span>Porównanie wariantów wypłaty zasiłku macierzyńskiego</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wariant A */}
            <div
              className={`p-4 rounded border-2 transition-all ${
                comparisonResults.recommended === "unified"
                  ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#007834]">
                  Wariant A &bull; Stałe 81,5%
                </span>
                {comparisonResults.recommended === "unified" && (
                  <span className="text-[10px] bg-[#007834] text-white font-bold px-2 py-0.5 rounded">
                    Rekomendowany
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-slate-900">
                {comparisonResults.variantUnified.totalBenefitAmountSum.toLocaleString(
                  "pl-PL",
                  { maximumFractionDigits: 0 }
                )}{" "}
                zł
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Równa kwota przez cały rok opieki. Zapewnia stały budżet domowy. Wymaga złożenia wniosku ZAM w terminie 21 dni po porodzie.
              </p>
            </div>

            {/* Wariant B */}
            <div
              className={`p-4 rounded border-2 transition-all ${
                comparisonResults.recommended === "standard"
                  ? "border-[#007834] bg-emerald-50/50 shadow-2xs"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Wariant B &bull; 100% potem 70%
                </span>
                {comparisonResults.recommended === "standard" && (
                  <span className="text-[10px] bg-[#007834] text-white font-bold px-2 py-0.5 rounded">
                    Rekomendowany
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-slate-900">
                {comparisonResults.variantStandard.totalBenefitAmountSum.toLocaleString(
                  "pl-PL",
                  { maximumFractionDigits: 0 }
                )}{" "}
                zł
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Wyższy zasiłek przez pierwsze 20 tygodni (100%), a następnie spadek do 70%. Korzystniejszy tylko wtedy, gdy mama wraca do pracy od razu po macierzyńskim.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-slate-700 flex items-center justify-between">
            <span>Różnica w łącznej kwocie między wariantami:</span>
            <strong className="text-[#007834] font-bold">
              {comparisonResults.diff.toLocaleString("pl-PL", {
                maximumFractionDigits: 0,
              })}{" "}
              zł
            </strong>
          </div>
        </div>

        {/* Harmonogram Kaskadowy Dochodów Miesiąc po Miesiącu */}
        <div className="zus-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-[#00416E] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#007834]" />
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
                    <td className="py-2.5 px-1 font-bold text-slate-900">
                      M-c {item.monthNumber}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800">{item.stageName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {item.badge}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-[#007834]">
                      {item.benefitAmount.toLocaleString("pl-PL")} zł
                    </td>
                    {worksPartTime && (
                      <td className="py-2.5 px-2 font-semibold text-[#00416E]">
                        {item.workSalary > 0
                          ? `+${item.workSalary.toLocaleString("pl-PL")} zł`
                          : "—"}
                      </td>
                    )}
                    <td className="py-2.5 px-2 text-right font-black text-slate-900">
                      {item.totalIncome.toLocaleString("pl-PL")} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Przyciski Pobrania Raportu i Przejścia do Wniosku ZAM */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDownloadSummary}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-4 py-2.5 rounded transition-colors"
            >
              <Download className="w-4 h-4 text-[#007834]" />
              <span>Pobierz raport kalkulacji (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handleTransferToZam}
              className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs px-5 py-2.5 rounded transition-colors shadow-2xs"
            >
              <FileText className="w-4 h-4" />
              <span>Wypełnij wniosek ZAM tymi danymi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
