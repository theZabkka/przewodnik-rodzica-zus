"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParentProfile } from "@/context/ParentProfileContext";
import {
 calculateParentalBenefits,
 calculateFamilySharing,
 calculateSickLeavePregnancy,
 BenefitCalculationInput,
 ContractType,
 ParentRole,
 ParenthoodType,
} from "@hacknation/shared";
import {
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
 Baby,
 Clock,
 HeartHandshake,
 ShieldAlert,
} from "lucide-react";

export default function KalkulatorPage() {
 const router = useRouter();
 const { profile, openGlossary } = useParentProfile();
  // Tryb wyświetlania: wizard (krok po kroku) vs compact (wszystko na jednym ekranie)
 const [viewMode, setViewMode] = useState<"wizard" | "full">("wizard");
 const [currentStep, setCurrentStep] = useState<number>(1);
 const totalSteps = 8;

  // Zakładka główna kalkulatora ZUS
  const [calcTab, setCalcTab] = useState<"standard" | "family_sharing" | "pregnancy_leave">("standard");

  // Typ rodzicielstwa: poród biologiczny / adopcja / rodzina zastępcza (art. 183 KP)
  const [parenthoodType, setParenthoodType] = useState<ParenthoodType>("birth");
  const [childAgeMonthsAtAdoption, setChildAgeMonthsAtAdoption] = useState<number>(18);
  const [hasSchoolDeferral, setHasSchoolDeferral] = useState<boolean>(false);

  // Stan dla Planera Wspólnego Dzielenia Opieki (Mama & Tata)
  const [familySharingMode, setFamilySharingMode] = useState<"sequential" | "simultaneous">("sequential");
  const [dadGrossSalary, setDadGrossSalary] = useState<number>(8000);
  const [momParentalWeeksShare, setMomParentalWeeksShare] = useState<number>(20);
  const [dadParentalWeeksShare, setDadParentalWeeksShare] = useState<number>(12);
  const [dadTakesExclusive9Weeks, setDadTakesExclusive9Weeks] = useState<boolean>(true);
  const [dadTakesPaternityLeave, setDadTakesPaternityLeave] = useState<boolean>(true);

  // Stan dla Kalkulatora Świadczeń w Czasie Ciąży (L4 kod B & Karencja)
  const [pregnancySickDays, setPregnancySickDays] = useState<number>(90);
  const [insuranceTenureDays, setInsuranceTenureDays] = useState<number>(180);
  const [isEmployeeOver50, setIsEmployeeOver50] = useState<boolean>(false);

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

  // Odczyt parametru URL ?tryb=adopcja z kafelka "Przyjmuję dziecko pod opiekę"
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tryb = params.get("tryb");
      if (tryb === "adopcja") {
        setParenthoodType("adoption");
        setCalcTab("standard");
      } else if (tryb === "zastepcza") {
        setParenthoodType("foster_family");
        setCalcTab("standard");
      }
    }
  }, []);

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
      parenthoodType,
      childAgeMonthsAtAdoption: parenthoodType !== "birth" ? childAgeMonthsAtAdoption : undefined,
      hasSchoolDeferral: parenthoodType === "foster_family" ? hasSchoolDeferral : undefined,
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
      parenthoodType,
      childAgeMonthsAtAdoption,
      hasSchoolDeferral,
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

  // Kalkulacja dla Planera Dzielenia Opieki (Mama & Tata)
  const familySharingResult = useMemo(() => {
    return calculateFamilySharing({
      childrenCount,
      hasLifeCertificate,
      submissionWithin21Days: submittedIn21Days,
      momGrossSalary: grossSalary,
      dadGrossSalary,
      momMaternityWeeksTaken: activeResults.maternityWeeks,
      momParentalWeeks: momParentalWeeksShare,
      dadParentalWeeks: dadParentalWeeksShare,
      dadTakesExclusive9Weeks,
      dadTakesPaternityLeave,
      sharingMode: familySharingMode,
    });
  }, [
    childrenCount,
    hasLifeCertificate,
    submittedIn21Days,
    grossSalary,
    dadGrossSalary,
    activeResults.maternityWeeks,
    momParentalWeeksShare,
    dadParentalWeeksShare,
    dadTakesExclusive9Weeks,
    dadTakesPaternityLeave,
    familySharingMode,
  ]);

  // Kalkulacja dla Świadczeń w Czasie Ciąży (L4 kod B & Karencja)
  const pregnancySickLeaveResult = useMemo(() => {
    const netBase = Math.round(grossSalary * (1 - 0.1371) * 100) / 100;
    const dailyBase = Math.round((netBase / 30) * 100) / 100;
    const calc = calculateSickLeavePregnancy(
      {
        sickDaysRequested: pregnancySickDays,
        contractType,
        isEmployeeUnder50: !isEmployeeOver50,
      },
      dailyBase
    );
    const waitingPeriodDays = contractType === "employment" ? 30 : 90;
    const isWaitingPeriodMet = insuranceTenureDays >= waitingPeriodDays;
    return {
      ...calc,
      netBase,
      dailyBase,
      waitingPeriodDays,
      isWaitingPeriodMet,
    };
  }, [grossSalary, contractType, pregnancySickDays, isEmployeeOver50, insuranceTenureDays]);

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

 // Przy różnicy mniejszej niż 500 zł w skali roku rekomendujemy równą stawkę 81,5% (stabilny budżet domowy)
 const recommended =
 variantStandard.totalBenefitAmountSum - variantUnified.totalBenefitAmountSum > 500
        ? "standard"
        : "unified";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 w-full">
      {/* Pasek Okruszków (Breadcrumbs) ZUS */}
      <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
        <Link href="/">Strona główna</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/przewodnik">Świadczenia</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#1D4029] font-semibold">
 Kalkulator wysokości zasiłków
        </span>
      </nav>

      {/* Nagłówek Sekcji Kalkulatora */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C6D6C3] pb-5">
        <div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10371E] tracking-tight">
              Kalkulator zasiłku
            </h1>
            <p className="text-sm text-[#425B4A] mt-1 max-w-xl">
              Odpowiedz na kilka pytań, a policzymy Twoją miesięczną wypłatę.
            </p>
          </div>
        </div>

        {/* Przełącznik trybu oraz presety */}
        <div className="flex flex-wrap items-center gap-2">
          <button
 type="button"
 onClick={() => openGlossary()}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#10371E] bg-[#EFF3EA] hover:bg-[#DCE8D3] border border-[#B9CCB6] rounded transition-colors "
          >
            <BookOpen className="w-3.5 h-3.5 text-[#10371E]" />
            <span>Trudne słowa (Słownik)</span>
          </button>

          <button
 type="button"
 onClick={() => setViewMode(viewMode === "wizard" ? "full" : "wizard")}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#007834] bg-[#EFF3EA] hover:bg-[#DCE8D3] border border-[#B9CCB6] rounded transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{viewMode === "wizard" ? "Pokaż pełny formularz" : "Włącz tryb pytań krok po kroku"}</span>
          </button>

          <button
 type="button"
 onClick={() => loadPreset("standard")}
 className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-[#B9CCB6] rounded hover:bg-[#EFF3EA] text-[#2E4B38]"
 title="Przywróć domyślne parametry"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {profile && (
        <div className="p-3.5 bg-[#EFF3EA] border border-[#8CA68E] rounded text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 ">
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

      {/* 3 GŁÓWNE ZAKŁADKI KALKULATORA ZUS (WYMÓG PDF) */}
      <div className="flex border-b border-[#C6D6C3] gap-2 overflow-x-auto text-xs font-bold pt-1">
        <button
          type="button"
          onClick={() => setCalcTab("standard")}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            calcTab === "standard"
              ? "border-[#007834] text-[#10371E] bg-[#EFF3EA] rounded-t-lg shadow-xs"
              : "border-transparent text-[#425B4A] hover:text-[#10371E]"
          }`}
        >
          <Baby className="w-4 h-4 text-[#007834]" />
          <span>Zintegrowany Kalkulator Zasiłków (Urodzenie / Adopcja)</span>
        </button>

        <button
          type="button"
          onClick={() => setCalcTab("family_sharing")}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            calcTab === "family_sharing"
              ? "border-[#007834] text-[#10371E] bg-[#EFF3EA] rounded-t-lg shadow-xs"
              : "border-transparent text-[#425B4A] hover:text-[#10371E]"
          }`}
        >
          <Users className="w-4 h-4 text-[#007834]" />
          <span>Planer Dzielenia Opieki (Mama & Tata)</span>
          <span className="bg-[#10371E] text-white px-1.5 py-0.5 rounded text-[10px]">WLB 2026</span>
        </button>

        <button
          type="button"
          onClick={() => setCalcTab("pregnancy_leave")}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            calcTab === "pregnancy_leave"
              ? "border-[#007834] text-[#10371E] bg-[#EFF3EA] rounded-t-lg shadow-xs"
              : "border-transparent text-[#425B4A] hover:text-[#10371E]"
          }`}
        >
          <Clock className="w-4 h-4 text-[#007834]" />
          <span>Świadczenia w Ciąży & Detektor Karencji</span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">Kod „B”</span>
        </button>
      </div>

      {calcTab === "standard" && (
        <>

      {/* GŁÓWNA CZĘŚĆ: INTERAKTYWNY KREATOR PYTANIE PO PYTANIU (NA PEŁNĄ SZEROKOŚĆ) */}
      {viewMode === "wizard" && (
        <div className="space-y-6 w-full">
          {/* Pełnoszerokościowy blok aktywnego pytania */}
          <div className="w-full bg-white border border-[#C6D6C3] rounded-2xl p-6 sm:p-8 space-y-6">
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
              <div className="grid grid-cols-8 gap-1.5" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
                {Array.from({ length: totalSteps }).map((_, idx) => {
 const stepNum = idx + 1;
 const isCompleted = stepNum < currentStep;
 const isCurrent = stepNum === currentStep;
 return (
                    <button
 key={stepNum}
 type="button"
 onClick={() => setCurrentStep(stepNum)}
 title={`Przejdź do pytania ${stepNum}`}
 className={`h-2.5 rounded-sm transition-colors ${
 isCurrent
                          ? "bg-[#007834] ring-1 ring-offset-1 ring-[#007834]"
                          : isCompleted
                          ? "bg-[#007834]/75 hover:bg-[#007834]"
                          : "bg-[#C6D6C3] hover:bg-slate-300"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Treść poszczególnych pytań */}
            <div className="min-h-[290px] flex flex-col justify-between">
              {/* PYTANIE 1 */}
              {currentStep === 1 && (
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 1: Wnioskodawca
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Kto składa wniosek o zasiłek i będzie korzystać z urlopu?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
 Wybierz rolę rodzica wnioskującego. Matce przysługuje urlop macierzyński i rodzicielski, a ojciec ma dodatkowo gwarantowane 9 tygodni w dyrektywie WLB oraz 14 dni urlopu ojcowskiego.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
 type="button"
 onClick={() => {
 setParentRole("mother");
                      }}
 className={`p-5 rounded border-2 text-left flex items-start gap-4 transition-all ${
 parentRole === "mother"
                          ? "border-[#007834] bg-[#EFF3EA] "
                          : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                      }`}
                    >
                      <div
 className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
 parentRole === "mother"
                            ? "bg-[#007834] text-white"
                            : "bg-[#EFF3EA] text-[#425B4A]"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-[#10371E] flex items-center gap-1.5">
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
 className={`p-5 rounded border-2 text-left flex items-start gap-4 transition-all ${
 parentRole === "father"
                          ? "border-[#007834] bg-[#EFF3EA] "
                          : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                      }`}
                    >
                      <div
 className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
 parentRole === "father"
                            ? "bg-[#007834] text-white"
                            : "bg-[#EFF3EA] text-[#425B4A]"
                        }`}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-[#10371E] flex items-center gap-1.5">
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

                  {/* Wybór rodzaju rodzicielstwa: Poród / Adopcja / Rodzina zastępcza niezawodowa (art. 183 KP) */}
                  <div className="pt-4 border-t border-[#DCE8D3] space-y-3">
                    <div>
                      <span className="text-xs font-bold text-[#10371E] block">
                        Sytuacja rodzinna (poród, adopcja czy rodzina zastępcza niezawodowa?):
                      </span>
                      <p className="text-[11px] text-[#425B4A]">
                        Zgodnie z art. 183 Kodeksu pracy rodzicom adopcyjnym i rodzinie zastępczej niezawodowej przysługuje urlop na warunkach urlopu macierzyńskiego oraz urlop rodzicielski.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setParenthoodType("birth")}
                        className={`p-3.5 rounded-lg border-2 text-left transition-all ${
                          parenthoodType === "birth"
                            ? "border-[#007834] bg-[#EFF3EA]"
                            : "border-[#C6D6C3] bg-white hover:border-[#B9CCB6]"
                        }`}
                      >
                        <div className="text-xs font-bold text-[#10371E]">Urodzenie dziecka (poród)</div>
                        <div className="text-[11px] text-[#425B4A] mt-0.5">Standardowy urlop macierzyński i rodzicielski</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParenthoodType("adoption")}
                        className={`p-3.5 rounded-lg border-2 text-left transition-all ${
                          parenthoodType === "adoption"
                            ? "border-[#007834] bg-[#EFF3EA]"
                            : "border-[#C6D6C3] bg-white hover:border-[#B9CCB6]"
                        }`}
                      >
                        <div className="text-xs font-bold text-[#10371E]">Adopcja (przysposobienie)</div>
                        <div className="text-[11px] text-[#425B4A] mt-0.5">Do ukończenia przez dziecko 14 lat</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParenthoodType("foster_family")}
                        className={`p-3.5 rounded-lg border-2 text-left transition-all ${
                          parenthoodType === "foster_family"
                            ? "border-[#007834] bg-[#EFF3EA]"
                            : "border-[#C6D6C3] bg-white hover:border-[#B9CCB6]"
                        }`}
                      >
                        <div className="text-xs font-bold text-[#10371E]">Rodzina zastępcza niezawodowa</div>
                        <div className="text-[11px] text-[#425B4A] mt-0.5">Do 7 lat (lub 10 lat przy odroczeniu szkoły)</div>
                      </button>
                    </div>

                    {parenthoodType !== "birth" && (
                      <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="font-bold text-[#10371E]">
                            Wiek przyjmowanego dziecka:{" "}
                            <span className="text-[#007834]">
                              {Math.floor(childAgeMonthsAtAdoption / 12)} lat {childAgeMonthsAtAdoption % 12} mies. ({childAgeMonthsAtAdoption} mies.)
                            </span>
                          </label>
                          <span className="text-[11px] text-[#425B4A]">
                            Limit: {parenthoodType === "adoption" ? "14 lat" : hasSchoolDeferral ? "10 lat (odroczenie)" : "7 lat"} · gwarantowane min. 9 tyg.
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={parenthoodType === "adoption" ? 168 : hasSchoolDeferral ? 120 : 84}
                          value={childAgeMonthsAtAdoption}
                          onChange={(e) => setChildAgeMonthsAtAdoption(Number(e.target.value))}
                          className="w-full accent-[#007834]"
                        />
                        {parenthoodType === "foster_family" && (
                          <label className="flex items-center gap-2 cursor-pointer text-[#10371E] font-medium">
                            <input
                              type="checkbox"
                              checked={hasSchoolDeferral}
                              onChange={(e) => setHasSchoolDeferral(e.target.checked)}
                              className="accent-[#007834]"
                            />
                            <span>Dziecko ma decyzję o odroczeniu obowiązku szkolnego (wydłuża limit wieku z 7 do 10 lat)</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PYTANIE 2 */}
              {currentStep === 2 && (
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 2: Forma zatrudnienia
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Jaki jest Twój tytuł do ubezpieczeń społecznych?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
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
 className={`p-4 rounded border-2 text-left flex flex-col justify-between transition-all ${
 isSelected
                              ? "border-[#007834] bg-[#EFF3EA] "
                              : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                          }`}
                        >
                          <div className="space-y-2">
                            <div
 className={`w-8 h-8 rounded flex items-center justify-center ${
 isSelected
                                  ? "bg-[#007834] text-white"
                                  : "bg-[#EFF3EA] text-[#425B4A]"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="font-bold text-xs sm:text-sm text-[#10371E]">
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
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 3: Wynagrodzenie i podstawa
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Ile wynosi Twoje średnie miesięczne wynagrodzenie brutto?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
 Podaj średnie wynagrodzenie brutto z ostatnich 12 miesięcy kalendarzowych poprzedzających miesiąc porodu.
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Pole z dużą kwotą */}
                    <div className="bg-[#FAF8F2] border border-[#B9CCB6] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label
 htmlFor="wizard-salary-input"
 className="text-xs font-bold text-[#425B4A] block mb-1"
                        >
 Kwota brutto (PLN):
                        </label>
                        <div className="relative max-w-xs">
                          <input
 id="wizard-salary-input"
 type="number"
 min="4806"
 step="100"
 value={grossSalary}
 onChange={(e) =>
 setGrossSalary(Math.max(0, Number(e.target.value)))
                            }
 className="w-full pl-3 pr-12 py-2.5 bg-white border border-[#B9CCB6] rounded text-xl font-black text-[#10371E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
                          />
                          <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
 PLN
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#425B4A] sm:text-right space-y-1">
                        <div>
 Podstawa ZUS (-13,71%):{" "}
                          <strong className="text-[#10371E] font-bold">
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
                                : "bg-white text-[#2E4B38] border-[#B9CCB6] hover:bg-[#EFF3EA]"
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
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 4: Liczba dzieci
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Ile dzieci urodziło się lub urodzi przy jednym porodzie?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
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
 className={`p-4 rounded border-2 text-left flex flex-col justify-between transition-all ${
 isSelected
                              ? "border-[#007834] bg-[#EFF3EA] "
                              : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-black text-[#10371E]">
                                {item.title}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#007834]" />
                              )}
                            </div>
                            <div className="text-xs text-[#425B4A] space-y-1">
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

                  {/* Forma rodzicielstwa (Art. 180 vs Art. 183 Kodeksu pracy) */}
                  <div className="pt-4 border-t border-[#EFF3EA] space-y-3">
                    <label className="text-xs font-bold text-[#10371E] block">
                      Tytuł rodzicielstwa (Art. 180 vs Art. 183 Kodeksu pracy):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setParenthoodType("birth")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          parenthoodType === "birth"
                            ? "border-[#007834] bg-[#EFF3EA] text-[#10371E] font-bold"
                            : "border-[#C6D6C3] bg-white text-slate-700 hover:border-[#8CA68E]"
                        }`}
                      >
                        <div className="text-xs font-bold">Urodzenie dziecka</div>
                        <div className="text-[11px] text-[#425B4A]">Urlop macierzyński (art. 180 KP)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParenthoodType("adoption")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          parenthoodType === "adoption"
                            ? "border-[#007834] bg-[#EFF3EA] text-[#10371E] font-bold"
                            : "border-[#C6D6C3] bg-white text-slate-700 hover:border-[#8CA68E]"
                        }`}
                      >
                        <div className="text-xs font-bold">Adopcja (Przysposobienie)</div>
                        <div className="text-[11px] text-[#425B4A]">Do 14. roku życia (art. 183 KP)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setParenthoodType("foster_family")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          parenthoodType === "foster_family"
                            ? "border-[#007834] bg-[#EFF3EA] text-[#10371E] font-bold"
                            : "border-[#C6D6C3] bg-white text-slate-700 hover:border-[#8CA68E]"
                        }`}
                      >
                        <div className="text-xs font-bold">Rodzina zastępcza niezawodowa</div>
                        <div className="text-[11px] text-[#425B4A]">Do 7 / 10 lat z odroczeniem</div>
                      </button>
                    </div>

                    {parenthoodType !== "birth" && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-xs animate-in fade-in">
                        <div className="flex items-center gap-2 text-amber-900 font-bold">
                          <HeartHandshake className="w-4 h-4 text-amber-700" />
                          <span>
                            {parenthoodType === "adoption"
                              ? "Przyjęcie dziecka na wychowanie w celu przysposobienia"
                              : "Przyjęcie dziecka jako rodzina zastępcza niezawodowa"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-amber-950 block">
                              Wiek dziecka w chwili przyjęcia (miesiące):
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={parenthoodType === "adoption" ? 168 : hasSchoolDeferral ? 120 : 84}
                              value={childAgeMonthsAtAdoption}
                              onChange={(e) => setChildAgeMonthsAtAdoption(Math.max(1, Number(e.target.value)))}
                              className="w-24 px-2 py-1 bg-white border border-amber-300 rounded text-xs font-bold text-amber-900"
                            />
                            <span className="text-[10px] text-amber-800 ml-2">
                              ({Math.floor(childAgeMonthsAtAdoption / 12)} lat i {childAgeMonthsAtAdoption % 12} mies.)
                            </span>
                          </div>

                          {parenthoodType === "foster_family" && (
                            <label className="flex items-center gap-2 cursor-pointer pt-3">
                              <input
                                type="checkbox"
                                checked={hasSchoolDeferral}
                                onChange={(e) => setHasSchoolDeferral(e.target.checked)}
                                className="w-4 h-4 rounded text-[#007834]"
                              />
                              <span className="text-[11px] font-semibold text-amber-950">
                                Decyzja o odroczeniu obowiązku szkolnego (wydłuża limit wieku z 7 do 10 lat)
                              </span>
                            </label>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed border-t border-amber-200/60 pt-2">
                          <strong>Gwarancja art. 183 § 3 KP:</strong> Przysługuje urlop na warunkach macierzyńskiego w wymiarze co najmniej <strong>9 tygodni</strong>, nawet jeśli dziecko zbliża się do granicy wieku!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PYTANIE 5 */}
              {currentStep === 5 && (
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 5: Termin wniosku ZAM
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Kiedy planujesz złożyć wniosek o zasiłek macierzyński (druk ZAM)?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
 Termin 21 dni po porodzie to kluczowa data w Kodeksie Pracy i ustawie zasiłkowej, decydująca o sposobie wypłaty świadczeń.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
 type="button"
 onClick={() => setSubmittedIn21Days(true)}
 className={`p-5 rounded border-2 text-left space-y-2 transition-all ${
 submittedIn21Days
                          ? "border-[#007834] bg-[#EFF3EA] "
                          : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#007834] bg-[#DCE8D3] px-2 py-0.5 rounded">
 Rekomendowane
                        </span>
                        {submittedIn21Days && (
                          <Check className="w-5 h-5 text-[#007834]" />
                        )}
                      </div>
                      <div className="font-extrabold text-sm sm:text-base text-[#10371E]">
 W terminie do 21 dni po porodzie
                      </div>
                      <p className="text-xs text-[#425B4A] leading-relaxed">
 Otrzymujesz równą, uśrednioną stawkę <strong>81,5%</strong> podstawy przez cały rok (zarówno urlop macierzyński, jak i rodzicielski). Brak spadku domowego budżetu po 20 tygodniach.
                      </p>
                    </button>

                    <button
 type="button"
 onClick={() => setSubmittedIn21Days(false)}
 className={`p-5 rounded border-2 text-left space-y-2 transition-all ${
                        !submittedIn21Days
                          ? "border-[#10371E] bg-[#EFF3EA] "
                          : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-[#EFF3EA] px-2 py-0.5 rounded">
 Wariant standardowy
                        </span>
                        {!submittedIn21Days && (
                          <Check className="w-5 h-5 text-[#10371E]" />
                        )}
                      </div>
                      <div className="font-extrabold text-sm sm:text-base text-[#10371E]">
 Po 21 dniach od porodu
                      </div>
                      <p className="text-xs text-[#425B4A] leading-relaxed">
 Otrzymujesz <strong>100%</strong> podstawy za okres macierzyńskiego (20 tyg.), a następnie spadek do <strong>70%</strong> za urlop rodzicielski.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* PYTANIE 6 */}
              {currentStep === 6 && (
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 6: Wcześniactwo i hospitalizacja
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Czy noworodek urodził się przedwcześnie lub wymagał dłuższego pobytu w szpitalu?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
 Nowe przepisy Kodeksu Pracy (art. 180² KP) przyznają rodzicom hospitalizowanych dzieci nawet do <strong>15 dodatkowych tygodni 100% płatnego urlopu</strong>.
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <button
 type="button"
 onClick={() => setIsPretermOrHospitalized(false)}
 className={`p-3.5 rounded border-2 text-center text-xs font-bold transition-all ${
                          !isPretermOrHospitalized
                            ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                            : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                        }`}
                      >
 Nie, poród o czasie
                      </button>

                      <button
 type="button"
 onClick={() => setIsPretermOrHospitalized(true)}
 className={`p-3.5 rounded border-2 text-center text-xs font-bold transition-all ${
 isPretermOrHospitalized
                            ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                            : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                        }`}
                      >
 Tak, dziecko było w szpitalu / wcześniak
                      </button>
                    </div>

                    {isPretermOrHospitalized && (
                      <div className="p-4 bg-[#EFF3EA] border border-[#B9CCB6] rounded space-y-3 ">
                        <div className="text-xs font-bold text-[#007834]">
 Podaj parametry urodzeniowe noworodka:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="text-[#2E4B38] font-semibold block mb-1">
 Tydzień ciąży:
                            </label>
                            <input
 type="number"
 min="22"
 max="40"
 value={birthWeek}
 onChange={(e) => setBirthWeek(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-white border border-[#B9CCB6] rounded font-bold"
                            />
                            <span className="text-[10px] text-slate-500">
                              (np. 27. tydzień)
                            </span>
                          </div>

                          <div>
                            <label className="text-[#2E4B38] font-semibold block mb-1">
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
 className="w-full px-2.5 py-1.5 bg-white border border-[#B9CCB6] rounded font-bold"
                            />
                            <span className="text-[10px] text-slate-500">
                              (np. 950 g)
                            </span>
                          </div>

                          <div>
                            <label className="text-[#2E4B38] font-semibold block mb-1">
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
 className="w-full px-2.5 py-1.5 bg-white border border-[#B9CCB6] rounded font-bold"
                            />
                            <span className="text-[10px] text-slate-500">
                              (do 8. lub 15. tyg.)
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border border-[#B9CCB6] rounded text-xs text-[#007834] font-bold flex items-center justify-between">
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
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 7: Praca na część etatu
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Czy w trakcie urlopu rodzicielskiego planujesz pracować na część etatu (np. 1/2 etatu)?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
 Zgodnie z art. 182¹ᶠ Kodeksu Pracy możesz łączyć opiekę z pracą u dotychczasowego pracodawcy. Zasiłek nie przepada, a urlop ulega proporcjonalnemu wydłużeniu!
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <button
 type="button"
 onClick={() => setWorksPartTime(false)}
 className={`p-3.5 rounded border-2 text-center text-xs font-bold transition-all ${
                          !worksPartTime
                            ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                            : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                        }`}
                      >
 Nie, 100% czasu na opiekę
                      </button>

                      <button
 type="button"
 onClick={() => setWorksPartTime(true)}
 className={`p-3.5 rounded border-2 text-center text-xs font-bold transition-all ${
 worksPartTime
                            ? "border-[#10371E] bg-[#EFF3EA]/70 text-[#10371E]"
                            : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                        }`}
                      >
 Tak, chcę łączyć urlop z pracą
                      </button>
                    </div>

                    {worksPartTime && (
                      <div className="p-4 bg-[#EFF3EA]/60 border border-[#B9CCB6] rounded space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[#2E4B38] font-semibold block mb-1">
 Wymiar etatu:
                            </label>
                            <select
 value={workFteRatio}
 onChange={(e) => setWorkFteRatio(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-white border border-[#B9CCB6] rounded font-bold"
                            >
                              <option value="0.25">1/4 etatu (0.25)</option>
                              <option value="0.5">1/2 etatu (0.50 - maksymalny dopuszczalny)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[#2E4B38] font-semibold block mb-1">
 Liczba tygodni łączenia:
                            </label>
                            <input
 type="number"
 min="1"
 max="32"
 value={workWeeks}
 onChange={(e) => setWorkWeeks(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-white border border-[#B9CCB6] rounded font-bold"
                            />
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border border-[#B9CCB6] rounded text-xs text-[#10371E] font-bold flex items-center justify-between">
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
                <div className="space-y-5 ">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Krok 8: Dodatkowe uprawnienia
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#10371E]">
 Czy w kalkulacji uwzględnić urlop ojcowski lub ustawę „Za życiem”?
                    </h2>
                    <p className="text-xs text-[#425B4A]">
 Zaznacz opcje, które dotyczą Twojej rodziny, aby poznać pełną sumę przysługujących świadczeń.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="bg-[#FAF8F2] p-4 rounded border border-[#C6D6C3] flex items-start gap-3">
                      <input
 id="wizard-pat"
 type="checkbox"
 checked={includePaternityLeave}
 onChange={(e) => setIncludePaternityLeave(e.target.checked)}
 className="mt-1 w-4 h-4 rounded text-[#007834] focus:ring-[#007834]"
                      />
                      <label htmlFor="wizard-pat" className="text-xs text-[#2E4B38] cursor-pointer">
                        <span className="font-bold block text-[#10371E] text-sm">
 14 dni urlopu ojcowskiego (100% płatne)
                        </span>
 Przysługuje ojcu do ukończenia przez dziecko 12. miesiąca życia. Nie wpływa na urlop macierzyński matki.
                      </label>
                    </div>

                    <div className="bg-[#FAF8F2] p-4 rounded border border-[#C6D6C3] flex items-start gap-3">
                      <input
 id="wizard-life"
 type="checkbox"
 checked={hasLifeCertificate}
 onChange={(e) => setHasLifeCertificate(e.target.checked)}
 className="mt-1 w-4 h-4 rounded text-[#007834] focus:ring-[#007834]"
                      />
                      <label htmlFor="wizard-life" className="text-xs text-[#2E4B38] cursor-pointer">
                        <span className="font-bold block text-[#10371E] text-sm">
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
            <div className="pt-4 border-t border-[#C6D6C3] flex items-center justify-between gap-3">
              <button
 type="button"
 disabled={currentStep === 1}
 onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
 className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded text-xs font-bold transition-colors ${
 currentStep === 1
                    ? "text-slate-300 cursor-not-allowed bg-[#EFF3EA]"
                    : "text-[#2E4B38] hover:bg-[#EFF3EA] bg-white border border-[#B9CCB6]"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Wstecz</span>
              </button>

              {currentStep < totalSteps ? (
                <button
 type="button"
 onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-colors "
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
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-colors "
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Potwierdź odpowiedzi i zobacz wyniki</span>
                </button>
              )}
            </div>
          </div>

          {/* Podsumowanie odpowiedzi — pokazywane dopiero na ostatnim kroku przed wynikami */}
          {currentStep === totalSteps && (
            <div className="w-full bg-[#EFF3EA] border border-[#C6D6C3] rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C6D6C3] pb-3">
                <h3 className="text-sm font-extrabold text-[#10371E] flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-[#007834]" />
                  <span>Twoje odpowiedzi — sprawdź, czy wszystko się zgadza</span>
                </h3>
                <span className="text-xs text-[#425B4A]">Kliknij dowolny kafelek, aby zmienić odpowiedź</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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
                    className="bg-white hover:border-[#10371E] border border-[#C6D6C3] rounded-xl p-3 text-left transition-colors flex flex-col gap-1"
                  >
                    <span className="text-[11px] text-[#425B4A] font-medium">{item.step}. {item.label}</span>
                    <span className="font-bold text-[#10371E]">{item.val}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALTERNATYWNY WIDOK: PEŁNY FORMULARZ (dla zaawansowanych / jurorów) */}
      {viewMode === "full" && (
        <div className="bg-white p-6 rounded border border-[#C6D6C3] space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCE8D3] pb-3">
            <h2 className="text-base font-bold text-[#10371E] flex items-center gap-2">
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
              <label className="text-xs font-bold text-[#2E4B38]">Wnioskodawca:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
 type="button"
 onClick={() => setParentRole("mother")}
 className={`py-2 px-2.5 rounded text-xs font-semibold border transition-all text-center ${
 parentRole === "mother"
                      ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                      : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                  }`}
                >
 Matka dziecka
                </button>
                <button
 type="button"
 onClick={() => setParentRole("father")}
 className={`py-2 px-2.5 rounded text-xs font-semibold border transition-all text-center ${
 parentRole === "father"
                      ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                      : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                  }`}
                >
 Ojciec dziecka
                </button>
              </div>
            </div>

            {/* Umowa */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2E4B38]">Tytuł do ubezpieczeń:</label>
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
                        ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                        : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wynagrodzenie */}
            <div className="space-y-2">
              <label htmlFor="full-salary-input" className="text-xs font-bold text-[#2E4B38]">
                Średnie brutto: {grossSalary.toLocaleString("pl-PL")} zł
              </label>
              <input
 id="full-salary-input"
 type="number"
 min="4806"
 step="100"
 value={grossSalary}
 onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-sm font-bold text-[#10371E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
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
 className={`p-4 rounded border flex items-start gap-3 ${
 warning.severity === "danger"
                    ? "bg-red-50 border-red-200 text-red-900"
                    : warning.severity === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-[#EFF3EA] border-[#B9CCB6] text-[#10371E]"
                }`}
              >
                <AlertTriangle
 className={`w-5 h-5 shrink-0 mt-0.5 ${
 warning.severity === "danger"
                      ? "text-red-600"
                      : warning.severity === "warning"
                      ? "text-[#f39200]"
                      : "text-[#10371E]"
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
        <div className="bg-[#10371E] text-white p-6 sm:p-8 rounded space-y-6 border-t-4 border-[#007834]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
 Podsumowanie finansowe świadczeń rodzicielskich 2026
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Łączny budżet świadczeń z ZUS
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#007834] text-white px-3 py-1 rounded text-xs font-bold ">
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
          <h4 className="text-base font-bold text-[#10371E] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#007834]" />
            <span>Porównanie wariantów wypłaty zasiłku macierzyńskiego</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wariant A */}
            <div
 className={`p-4 rounded border-2 transition-all ${
 comparisonResults.recommended === "unified"
                  ? "border-[#007834] bg-[#EFF3EA] "
                  : "border-[#C6D6C3] bg-[#EFF3EA]"
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
              <div className="text-xl font-bold text-[#10371E]">
                {comparisonResults.variantUnified.totalBenefitAmountSum.toLocaleString(
                  "pl-PL",
                  { maximumFractionDigits: 0 }
                )}{" "}
 zł
              </div>
              <p className="text-xs text-[#425B4A] mt-2 leading-relaxed">
 Równa kwota przez cały rok opieki. Zapewnia stały budżet domowy. Wymaga złożenia wniosku ZAM w terminie 21 dni po porodzie.
              </p>
            </div>

            {/* Wariant B */}
            <div
 className={`p-4 rounded border-2 transition-all ${
 comparisonResults.recommended === "standard"
                  ? "border-[#007834] bg-[#EFF3EA] "
                  : "border-[#C6D6C3] bg-[#EFF3EA]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E4B38]">
 Wariant B &bull; 100% potem 70%
                </span>
                {comparisonResults.recommended === "standard" && (
                  <span className="text-[10px] bg-[#007834] text-white font-bold px-2 py-0.5 rounded">
 Rekomendowany
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-[#10371E]">
                {comparisonResults.variantStandard.totalBenefitAmountSum.toLocaleString(
                  "pl-PL",
                  { maximumFractionDigits: 0 }
                )}{" "}
 zł
              </div>
              <p className="text-xs text-[#425B4A] mt-2 leading-relaxed">
 Wyższy zasiłek przez pierwsze 20 tygodni (100%), a następnie spadek do 70%. Korzystniejszy tylko wtedy, gdy mama wraca do pracy od razu po macierzyńskim.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs text-[#2E4B38] flex items-center justify-between">
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
          <div className="flex items-center justify-between border-b border-[#DCE8D3] pb-3">
            <h4 className="text-base font-bold text-[#10371E] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#007834]" />
              <span>Harmonogram kaskadowy dochodów (miesiąc po miesiącu)</span>
            </h4>
            <span className="text-xs text-slate-500 font-medium">Cykl roczny (12 miesięcy)</span>
          </div>

          <div className="space-y-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C6D6C3] text-slate-500">
                  <th className="py-2 px-1">Miesiąc</th>
                  <th className="py-2 px-2">Etap opieki</th>
                  <th className="py-2 px-2">Zasiłek ZUS</th>
                  {worksPartTime && <th className="py-2 px-2">Pensja za 1/2 etatu</th>}
                  <th className="py-2 px-2 text-right">Dochód łączny</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyCascade.map((item) => (
                  <tr key={item.monthNumber} className="hover:bg-[#EFF3EA]">
                    <td className="py-2.5 px-1 font-bold text-[#10371E]">
 M-c {item.monthNumber}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#1D4029]">{item.stageName}</span>
                        <span className="text-[10px] bg-[#EFF3EA] text-[#425B4A] px-1.5 py-0.5 rounded border border-[#C6D6C3]">
                          {item.badge}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-[#007834]">
                      {item.benefitAmount.toLocaleString("pl-PL")} zł
                    </td>
                    {worksPartTime && (
                      <td className="py-2.5 px-2 font-semibold text-[#10371E]">
                        {item.workSalary > 0
                          ? `+${item.workSalary.toLocaleString("pl-PL")} zł`
                          : "—"}
                      </td>
                    )}
                    <td className="py-2.5 px-2 text-right font-black text-[#10371E]">
                      {item.totalIncome.toLocaleString("pl-PL")} zł
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Przyciski Pobrania Raportu i Przejścia do Wniosku ZAM */}
          <div className="pt-4 border-t border-[#DCE8D3] flex flex-wrap items-center justify-between gap-3">
            <button
 type="button"
 onClick={handleDownloadSummary}
 className="inline-flex items-center gap-2 bg-white hover:bg-[#EFF3EA] text-[#1D4029] border border-[#B9CCB6] font-bold text-xs px-4 py-2.5 rounded transition-colors"
            >
              <Download className="w-4 h-4 text-[#007834]" />
              <span>Pobierz raport kalkulacji (.txt)</span>
            </button>

            <button
 type="button"
 onClick={handleTransferToZam}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs px-5 py-2.5 rounded transition-colors "
            >
              <FileText className="w-4 h-4" />
              <span>Wypełnij wniosek ZAM tymi danymi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* ZAKŁADKA 2: PLANER DZIELENIA OPIEKI (MAMA & TATA) - WORK-LIFE BALANCE 2026 */}
      {calcTab === "family_sharing" && (
        <div className="space-y-6">
          {/* Header Card WLB */}
          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 bg-[#EFF3EA] border border-[#B9CCB6] px-3 py-1 rounded text-xs font-bold text-[#10371E]">
                <Users className="w-4 h-4 text-[#007834]" />
                <span>Dyrektywa Work-Life Balance & Kodeks Pracy 2026 (art. 182¹ᵃ KP)</span>
              </div>
              <span className="text-xs font-semibold text-[#425B4A]">
                Pula urlopu rodzicielskiego: <strong className="text-[#10371E]">{familySharingResult.totalParentalPoolWeeks} tygodni</strong>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#10371E] tracking-tight">
                Planer i Symulator Budżetu Domowego (Mama & Tata)
              </h2>
              <p className="text-sm text-[#425B4A] leading-relaxed max-w-4xl">
                Oblicz łączny dochód Waszej rodziny w trakcie urlopu macierzyńskiego i rodzicielskiego.
                Każdy z rodziców ma <strong>9 tygodni urlopu na wyłączność</strong> (zasiłek 70%), którego nie można przenieść na drugiego rodzica.
                Możecie korzystać z urlopu kolejno (maksymalizując czas opieki domowej) lub równocześnie.
              </p>
            </div>

            {/* Tryb korzystania */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setFamilySharingMode("sequential")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  familySharingMode === "sequential"
                    ? "border-[#007834] bg-[#EFF3EA] shadow-xs"
                    : "border-[#DCE8D3] bg-white hover:border-[#B9CCB6]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#10371E]">Sekwencyjnie (jedno po drugim)</span>
                  {familySharingMode === "sequential" && <CheckCircle2 className="w-4 h-4 text-[#007834]" />}
                </div>
                <p className="text-xs text-[#425B4A]">
                  Najdłuższa bezpośrednia opieka domowa. Mama korzysta ze swojej puli, a po jej powrocie do pracy tata przejmuje opiekę.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFamilySharingMode("simultaneous")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  familySharingMode === "simultaneous"
                    ? "border-[#007834] bg-[#EFF3EA] shadow-xs"
                    : "border-[#DCE8D3] bg-white hover:border-[#B9CCB6]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#10371E]">Równocześnie (oboje w tym samym czasie)</span>
                  {familySharingMode === "simultaneous" && <CheckCircle2 className="w-4 h-4 text-[#007834]" />}
                </div>
                <p className="text-xs text-[#425B4A]">
                  Oboje rodzice przebywają z dzieckiem razem (np. w pierwszych miesiącach). Tygodnie pobierane są z łącznej puli podwójnie.
                </p>
              </button>
            </div>
          </div>

          {/* Formularz Parametrów Obojga Rodziców */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Karta Mamy */}
            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D3]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EFF3EA] flex items-center justify-center text-[#007834] font-bold text-xs">
                    M
                  </div>
                  <h3 className="font-bold text-[#10371E]">Mama dziecka</h3>
                </div>
                <span className="text-xs text-[#425B4A]">Macierzyński: 20 tyg.</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E4B38] flex justify-between">
                  <span>Średnie wynagrodzenie brutto mamy:</span>
                  <span className="text-[#007834] font-bold">{grossSalary.toLocaleString("pl-PL")} zł</span>
                </label>
                <input
                  type="range"
                  min="4806"
                  max="25000"
                  step="100"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full accent-[#007834]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E4B38] flex justify-between">
                  <span>Tygodnie urlopu rodzicielskiego mamy:</span>
                  <span className="text-[#007834] font-black">{momParentalWeeksShare} z 32 tyg.</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="1"
                  value={momParentalWeeksShare}
                  onChange={(e) => {
                    const momW = Number(e.target.value);
                    setMomParentalWeeksShare(momW);
                    setDadParentalWeeksShare(32 - momW);
                  }}
                  className="w-full accent-[#007834]"
                />
                <p className="text-[11px] text-[#425B4A]">
                  Pula wspólna: 32 tygodnie (pozostałe 9 tygodni przysługuje tacie na wyłączność).
                </p>
              </div>

              <div className="p-3 bg-[#EFF3EA] rounded-xl text-xs space-y-1 text-[#1D4029]">
                <div className="flex justify-between font-semibold">
                  <span>Łączny czas urlopu mamy:</span>
                  <span>{20 + momParentalWeeksShare} tygodni</span>
                </div>
                <div className="flex justify-between font-bold text-[#007834]">
                  <span>Szacowane świadczenia mamy:</span>
                  <span>{familySharingResult.momTotalBenefitsPaid.toLocaleString("pl-PL")} zł</span>
                </div>
              </div>
            </div>

            {/* Karta Taty */}
            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D3]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EFF3EA] flex items-center justify-center text-[#007834] font-bold text-xs">
                    T
                  </div>
                  <h3 className="font-bold text-[#10371E]">Tata dziecka</h3>
                </div>
                <span className="text-xs text-[#425B4A]">Uprawnienia WLB 2026</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E4B38] flex justify-between">
                  <span>Średnie wynagrodzenie brutto taty:</span>
                  <span className="text-[#007834] font-bold">{dadGrossSalary.toLocaleString("pl-PL")} zł</span>
                </label>
                <input
                  type="range"
                  min="4806"
                  max="25000"
                  step="100"
                  value={dadGrossSalary}
                  onChange={(e) => setDadGrossSalary(Number(e.target.value))}
                  className="w-full accent-[#007834]"
                />
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#DCE8D3] hover:bg-[#EFF3EA] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dadTakesExclusive9Weeks}
                    onChange={(e) => setDadTakesExclusive9Weeks(e.target.checked)}
                    className="mt-0.5 rounded border-[#C6D6C3] text-[#007834] focus:ring-[#007834]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#10371E] block">
                      Tata wykorzystuje swoje 9 tygodni wyłączne (70%)
                    </span>
                    <span className="text-[#425B4A]">
                      Gwarancja art. 182¹ᵃ § 4 KP. Jeśli tata z nich nie skorzysta, <strong>te 9 tygodni przepada bezpowrotnie</strong>.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-[#DCE8D3] hover:bg-[#EFF3EA] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dadTakesPaternityLeave}
                    onChange={(e) => setDadTakesPaternityLeave(e.target.checked)}
                    className="mt-0.5 rounded border-[#C6D6C3] text-[#007834] focus:ring-[#007834]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#10371E] block">
                      Tata korzysta z 2 tygodni urlopu ojcowskiego (100% ZUS)
                    </span>
                    <span className="text-[#425B4A]">
                      Niezależne od urlopu macierzyńskiego i rodzicielskiego, do ukończenia przez dziecko 12 miesięcy życia.
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-[#EFF3EA] rounded-xl text-xs space-y-1 text-[#1D4029]">
                <div className="flex justify-between font-semibold">
                  <span>Łączny czas urlopu taty:</span>
                  <span>{familySharingResult.dadTotalLeaveWeeks} tygodni</span>
                </div>
                <div className="flex justify-between font-bold text-[#007834]">
                  <span>Szacowane świadczenia taty:</span>
                  <span>{familySharingResult.dadTotalBenefitsPaid.toLocaleString("pl-PL")} zł</span>
                </div>
              </div>
            </div>
          </div>

          {/* Podsumowanie Finansowe KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Łączny budżet rodziny z zasiłków
              </span>
              <p className="text-2xl font-black text-[#10371E]">
                {familySharingResult.familyTotalBenefitsCombined.toLocaleString("pl-PL")} zł
              </p>
              <span className="text-[11px] text-[#425B4A]">Zasiłki ZUS obojga rodziców łącznie</span>
            </div>

            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Czas bezpośredniej opieki
              </span>
              <p className="text-2xl font-black text-[#007834]">
                {familySharingResult.totalLeaveSpanCalendarWeeks} tygodni
              </p>
              <span className="text-[11px] text-[#425B4A]">
                {familySharingMode === "sequential"
                  ? "Tygodnie kalendarzowe opieki rodzicielskiej"
                  : "Tryb równoległy (jednocześnie oboje)"}
              </span>
            </div>

            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Świadczenia mamy (ZUS)
              </span>
              <p className="text-2xl font-black text-[#10371E]">
                {familySharingResult.momTotalBenefitsPaid.toLocaleString("pl-PL")} zł
              </p>
              <span className="text-[11px] text-[#425B4A]">{familySharingResult.momTotalLeaveWeeks} tyg. macierzyński + rodzicielski</span>
            </div>

            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Świadczenia taty (ZUS)
              </span>
              <p className="text-2xl font-black text-[#10371E]">
                {familySharingResult.dadTotalBenefitsPaid.toLocaleString("pl-PL")} zł
              </p>
              <span className="text-[11px] text-[#425B4A]">{familySharingResult.dadTotalLeaveWeeks} tyg. (WLB 9 tyg. + ojcowski)</span>
            </div>
          </div>

          {/* Alert Ryzyka Utraty 9 Tygodni WLB */}
          {!dadTakesExclusive9Weeks ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-red-950">
                <span className="font-bold text-sm block">
                  Uwaga! Bezpowrotnie tracicie 9 tygodni płatnego zasiłku (art. 182¹ᵃ § 4 KP)
                </span>
                <p>
                  Zgodnie z Kodeksem Pracy 9 tygodni urlopu rodzicielskiego jest prawem niezbywalnym drugiego rodzica.
                  Mama <strong>nie może przejąć</strong> tych tygodni. Jeśli tata ich nie wykorzysta, przepadają one w całości wraz ze świadczeniem pieniężnym.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#007834] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-[#10371E]">
                <span className="font-bold text-sm block">
                  Optymalne wykorzystanie uprawnień rodzicielskich (WLB 2026)
                </span>
                <p>
                  Wykorzystujecie 100% przysługujących świadczeń ZUS. Tata odbiera swoje 9 tygodni (70% podstawy),
                  a dziecko ma zapewnioną dłuższą bliską więź z obojgiem rodziców.
                </p>
              </div>
            </div>
          )}

          {/* Oś Czasu i Kaskada Budżetu w Poszczególnych Fazach */}
          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#10371E] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#007834]" />
              <span>Kaskada Budżetu Domowego w Poszczególnych Fazach Opieki</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DCE8D3] text-[#425B4A]">
                    <th className="py-2.5 px-3 font-bold">Okres / Faza opieki</th>
                    <th className="py-2.5 px-3 font-bold">Status Mamy</th>
                    <th className="py-2.5 px-3 font-bold">Status Taty</th>
                    <th className="py-2.5 px-3 font-bold text-right">Dochód Mamy (brutto)</th>
                    <th className="py-2.5 px-3 font-bold text-right">Dochód Taty (brutto)</th>
                    <th className="py-2.5 px-3 font-bold text-right text-[#007834]">Łączny budżet domowy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFF3EA]">
                  {familySharingResult.budgetPhases.map((phase, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#10371E]">{phase.periodLabel}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                          phase.momStatus === "maternity"
                            ? "bg-purple-100 text-purple-900"
                            : phase.momStatus === "parental"
                            ? "bg-blue-100 text-blue-900"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {phase.momStatus === "maternity" ? "Urlop macierzyński" : phase.momStatus === "parental" ? "Urlop rodzicielski" : "Praca"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                          phase.dadStatus === "paternity"
                            ? "bg-teal-100 text-teal-900"
                            : phase.dadStatus === "parental"
                            ? "bg-blue-100 text-blue-900"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {phase.dadStatus === "paternity" ? "Urlop ojcowski (100%)" : phase.dadStatus === "parental" ? "Urlop rodzicielski (70%)" : "Praca"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-[#10371E]">
                        {phase.momMonthlyIncome.toLocaleString("pl-PL")} zł
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-[#10371E]">
                        {phase.dadMonthlyIncome.toLocaleString("pl-PL")} zł
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#007834] text-sm">
                        {phase.combinedFamilyMonthlyIncome.toLocaleString("pl-PL")} zł
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pouczenia Prawne */}
            <div className="pt-3 border-t border-[#DCE8D3] space-y-2">
              <h4 className="text-xs font-bold text-[#10371E] uppercase tracking-wider">
                Wskazówki prawne ZUS i Kodeksu Pracy:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#425B4A]">
                {familySharingResult.legalNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#007834] font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ZAKŁADKA 3: ŚWIADCZENIA W CIĄŻY & DETEKTOR KARENCJI (KOD "B") */}
      {calcTab === "pregnancy_leave" && (
        <div className="space-y-6">
          {/* Header Card Ciąża */}
          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded text-xs font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>e-ZLA z Kodem „B” (Ciąża) & Art. 92 KP / Art. 11 Ustawy Zasiłkowej</span>
              </div>
              <span className="text-xs font-bold text-[#007834] bg-[#EFF3EA] px-2.5 py-1 rounded">
                Wysokość zasiłku: 100% podstawy wymiaru
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#10371E] tracking-tight">
                Kalkulator Zwolnienia w Ciąży & Detektor Karencji Ubezpieczeniowej
              </h2>
              <p className="text-sm text-[#425B4A] leading-relaxed max-w-4xl">
                W okresie ciąży za czas niezdolności do pracy z kodem „B” przysługuje <strong>100% wynagrodzenia lub zasiłku chorobowego</strong>.
                Maksymalny limit wypłaty wynosi aż <strong>270 dni</strong> (zamiast standardowych 182 dni).
                Sprawdź, czy spełniasz wymagany okres wyczekiwania (karencję) i kto finansuje Twoje świadczenie.
              </p>
            </div>
          </div>

          {/* Formularz Parametrów Ciążowych */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-5 shadow-xs">
              <h3 className="font-bold text-[#10371E] pb-3 border-b border-[#DCE8D3]">
                Dane Zatrudnienia i Wynagrodzenia
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E4B38] flex justify-between">
                  <span>Miesięczne wynagrodzenie brutto:</span>
                  <span className="text-[#007834] font-black">{grossSalary.toLocaleString("pl-PL")} zł</span>
                </label>
                <input
                  type="range"
                  min="4806"
                  max="25000"
                  step="100"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full accent-[#007834]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E4B38]">Forma zatrudnienia / ubezpieczenia:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "employment" as const, label: "Umowa o pracę (UoP)" },
                    { id: "mandate" as const, label: "Zlecenie" },
                    { id: "b2b" as const, label: "Działalność (JDG)" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setContractType(c.id)}
                      className={`p-2.5 rounded text-xs font-semibold border transition-all text-center ${
                        contractType === c.id
                          ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                          : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {contractType === "employment" && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#2E4B38]">Wiek pracownicy:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEmployeeOver50(false)}
                      className={`p-2 rounded text-xs font-semibold border transition-all text-center ${
                        !isEmployeeOver50
                          ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                          : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                      }`}
                    >
                      Do 50 roku życia (33 dni płaci firma)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEmployeeOver50(true)}
                      className={`p-2 rounded text-xs font-semibold border transition-all text-center ${
                        isEmployeeOver50
                          ? "border-[#007834] bg-[#EFF3EA] text-[#007834]"
                          : "border-[#C6D6C3] text-[#2E4B38] hover:bg-[#EFF3EA]"
                      }`}
                    >
                      Ukończone 50 lat (14 dni płaci firma)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Karta Stażu i Dni Zwolnienia */}
            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-5 shadow-xs">
              <h3 className="font-bold text-[#10371E] pb-3 border-b border-[#DCE8D3]">
                Dni Zwolnienia & Staż Ubezpieczeniowy (Karencja)
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2E4B38] flex justify-between">
                  <span>Wnioskowana liczba dni L4 w roku (kod B):</span>
                  <span className="text-[#007834] font-black">{pregnancySickDays} dni (maks. 270)</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="270"
                  step="1"
                  value={pregnancySickDays}
                  onChange={(e) => setPregnancySickDays(Number(e.target.value))}
                  className="w-full accent-[#007834]"
                />
                <div className="flex justify-between text-[11px] text-[#425B4A]">
                  <span>1 dzień</span>
                  <span>182 dni (standard)</span>
                  <span>270 dni (ciąża)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#2E4B38] flex justify-between">
                  <span>Twój nieprzerwany staż ubezpieczenia chorobowego:</span>
                  <span className="text-[#007834] font-black">{insuranceTenureDays} dni</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="365"
                  step="5"
                  value={insuranceTenureDays}
                  onChange={(e) => setInsuranceTenureDays(Number(e.target.value))}
                  className="w-full accent-[#007834]"
                />
                <p className="text-[11px] text-[#425B4A]">
                  Wymóg art. 4 ustawy zasiłkowej: <strong>30 dni</strong> przy umowie o pracę lub <strong>90 dni</strong> przy zleceniu/JDG.
                </p>
              </div>

              {/* Status Karencji */}
              {!pregnancySickLeaveResult.isWaitingPeriodMet ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1 text-red-950">
                  <span className="font-bold block">
                    ⚠️ Karencja nieupłynęła! Zasiłek obecnie NIE PRZYSŁUGUJE!
                  </span>
                  <p>
                    Brakuje jeszcze <strong>{pregnancySickLeaveResult.waitingPeriodDays - insuranceTenureDays} dni</strong> opłacania składek.
                    Wyjątki od karencji: absolwenci do 90 dni od ukończenia szkoły/studiów, wypadek w drodze do pracy lub co najmniej 10 lat ubezpieczenia obowiązkowego.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-[#EFF3EA] border border-[#B9CCB6] rounded-xl text-xs flex items-center gap-2 text-[#10371E]">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>
                    <strong>Okres wyczekiwania spełniony!</strong> Przysługuje prawo do 100% świadczenia od 1. dnia zwolnienia.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Podsumowanie Świadczenia Ciążowego */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Wynagrodzenie od pracodawcy
              </span>
              <p className="text-2xl font-black text-[#10371E]">
                {pregnancySickLeaveResult.employerPaidAmount.toLocaleString("pl-PL")} zł
              </p>
              <span className="text-[11px] text-[#425B4A]">
                {pregnancySickLeaveResult.employerPaidDays} dni (art. 92 Kodeksu Pracy – 100%)
              </span>
            </div>

            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Zasiłek chorobowy z ZUS
              </span>
              <p className="text-2xl font-black text-[#007834]">
                {pregnancySickLeaveResult.zusPaidAmount.toLocaleString("pl-PL")} zł
              </p>
              <span className="text-[11px] text-[#425B4A]">
                {pregnancySickLeaveResult.zusPaidDays} dni (Fundusz Ubezpieczeń Społecznych – 100%)
              </span>
            </div>

            <div className="bg-white border border-[#C6D6C3] rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-[#425B4A] uppercase tracking-wider block mb-1">
                Łączna kwota świadczeń
              </span>
              <p className="text-2xl font-black text-[#10371E]">
                {pregnancySickLeaveResult.totalAmountGross.toLocaleString("pl-PL")} zł
              </p>
              <span className="text-[11px] text-[#425B4A]">
                Za {pregnancySickLeaveResult.totalDaysGranted} dni zwolnienia (dzienna stawka: {pregnancySickLeaveResult.dailyBenefitAmount} zł)
              </span>
            </div>
          </div>

          {/* Karty Ochrony Prawnej Kobiety w Ciąży */}
          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#10371E] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#007834]" />
              <span>Gwarancje Prawne dla Kobiet w Ciąży (Kodeks Pracy 2026)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#2E4B38]">
              <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] space-y-1.5">
                <span className="font-bold text-[#10371E] text-sm block">
                  Szczególna ochrona przed zwolnieniem (art. 177 KP)
                </span>
                <p>
                  Pracodawca nie może wypowiedzieć ani rozwiązać umowy o pracę w okresie ciąży oraz urlopu macierzyńskiego.
                  Wypowiedzenie jest dopuszczalne wyłącznie w razie ogłoszenia upadłości lub likwidacji pracodawcy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] space-y-1.5">
                <span className="font-bold text-[#10371E] text-sm block">
                  Przedłużenie umowy na czas określony (art. 177 § 3 KP)
                </span>
                <p>
                  Jeżeli umowa o pracę na czas określony rozwiązałaby się po upływie 3. miesiąca ciąży,
                  ulega ona automatycznemu przedłużeniu z mocy prawa do dnia porodu. W dniu porodu kobieta nabywa pełne prawo do rocznego zasiłku macierzyńskiego!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] space-y-1.5">
                <span className="font-bold text-[#10371E] text-sm block">
                  Świadczenie rehabilitacyjne (100% podstawy)
                </span>
                <p>
                  Jeżeli po wyczerpaniu 270 dni zasiłku chorobowego stan zdrowia nadal nie pozwala na powrót do pracy,
                  a dalsze leczenie rokuje odzyskanie zdolności, przysługuje świadczenie rehabilitacyjne (art. 18 ustawy zasiłkowej) płatne w 100% podstawy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] space-y-1.5">
                <span className="font-bold text-[#10371E] text-sm block">
                  Zasiłek w wysokości zasiłku macierzyńskiego (art. 30 ust. 3)
                </span>
                <p>
                  Szczególne świadczenie (100% podstawy wymiaru) wypłacane <strong>do dnia porodu po ustaniu ubezpieczenia</strong>, gdy pracownica w ciąży straciła pracę z powodu upadłości, likwidacji lub śmierci pracodawcy (i nie zapewniono jej innego zatrudnienia) albo gdy umowę rozwiązano z naruszeniem prawa (potwierdzonym prawomocnym wyrokiem sądu).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF3EA] border border-[#B9CCB6] space-y-1.5">
                <span className="font-bold text-[#10371E] text-sm block">
                  Zakaz pracy w godzinach nadliczbowych i w nocy (art. 178 KP)
                </span>
                <p>
                  Pracownicy w ciąży nie wolno zatrudniać w godzinach nadliczbowych ani w porze nocnej,
                  ani też bez jej zgody delegować poza stałe miejsce pracy lub zatrudniać w systemie przerywanego czasu pracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
