"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
 Baby,
 Users,
 User,
 UserCheck,
 HeartPulse,
 Building2,
 Briefcase,
 FileText,
 Calculator,
 Compass,
 Bot,
 ArrowRight,
 ArrowLeft,
 CheckCircle2,
 Sparkles,
 RotateCcw,
 BookOpen,
} from "lucide-react";
import {
 calculateParentalBenefits,
 BenefitCalculationInput,
 ContractType,
 ParentRole,
} from "@hacknation/shared";
import { useParentProfile } from "@/context/ParentProfileContext";

interface ParentWizardProps {
 isModal?: boolean;
 onClose?: () => void;
}

export function ParentWizard({ isModal = false, onClose }: ParentWizardProps) {
 const { profile, updateProfile, openGlossary } = useParentProfile();

 const [step, setStep] = useState<number>(1);
 const totalSteps = 4;

  // Stany robocze formularza
 const [whoOnLeave, setWhoOnLeave] = useState<"mother" | "father" | "both">(
 profile?.whoOnLeave || "both"
  );
 const [childrenCount, setChildrenCount] = useState<1 | 2 | 3>(
 profile?.childrenCount || 1
  );
 const [contractType, setContractType] = useState<ContractType>(
 profile?.contractType || "employment"
  );
 const [monthlySalaryGross, setMonthlySalaryGross] = useState<number>(
 profile?.monthlySalaryGross || 7500
  );
 const [specialSituation, setSpecialSituation] = useState<"none" | "preterm" | "parttime">(
 profile?.isPretermOrHospitalized
      ? "preterm"
      : profile?.worksPartTime
      ? "parttime"
      : "none"
  );
 const [hospitalDays, setHospitalDays] = useState<number>(profile?.hospitalDays || 28);
 const submittedIn21Days = profile?.submittedIn21Days ?? true;

  // Szacunek wynagrodzenia netto (na rękę) dla umowy o pracę
 const estimatedNetSalary = useMemo(() => {
 if (contractType === "employment") {
 return Math.round(monthlySalaryGross * 0.72);
    }
 if (contractType === "b2b") {
 return Math.round(monthlySalaryGross * 0.78);
    }
 return Math.round(monthlySalaryGross * 0.75);
  }, [monthlySalaryGross, contractType]);

  // Szybkie przeliczenie z silnika `@hacknation/shared`
 const calculationPreview = useMemo(() => {
 const inputRole: ParentRole = whoOnLeave === "father" ? "father" : "mother";
 const calcInput: BenefitCalculationInput = {
 parentRole: inputRole,
 contractType,
 monthlyBaseGross: monthlySalaryGross,
 childrenCount,
 hasLifeCertificate: false,
 submissionWithin21Days: submittedIn21Days,
 isPrematureOrHospitalized: specialSituation === "preterm",
 hospitalDaysTotal: specialSituation === "preterm" ? hospitalDays : undefined,
 workPartTimeDuringParental: specialSituation === "parttime",
 workFteRatio: specialSituation === "parttime" ? 0.5 : undefined,
 workWeeks: specialSituation === "parttime" ? 16 : undefined,
 includePaternityLeave: true,
    };
 return calculateParentalBenefits(calcInput);
  }, [
 whoOnLeave,
 contractType,
 monthlySalaryGross,
 childrenCount,
 submittedIn21Days,
 specialSituation,
 hospitalDays,
 ]);

  // Zapisz do centralnego profilu i przejdź do podsumowania
 const handleSaveProfile = () => {
 updateProfile({
 whoOnLeave,
 childrenCount,
 contractType,
 monthlySalaryGross,
 isPretermOrHospitalized: specialSituation === "preterm",
 hospitalDays: specialSituation === "preterm" ? hospitalDays : 0,
 worksPartTime: specialSituation === "parttime",
 workFteRatio: specialSituation === "parttime" ? 0.5 : undefined,
 submittedIn21Days,
    });
 setStep(5); // Krok 5 to karta podsumowania
  };

 const content = (
    <div className="space-y-6">
      {/* Pasek postępu kroków */}
      {step <= totalSteps && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Krok {step} z {totalSteps}: {
 step === 1
                ? "Kto skorzysta z urlopu?"
                : step === 2
                ? "Ile maluszków?"
                : step === 3
                ? "Zarobki i umowa"
                : "Sytuacje szczególne"
            }</span>
            <span className="text-[#007834] font-mono">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < step;
              const isCurrent = stepNum === step;
              return (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setStep(stepNum)}
                  title={`Przejdź do kroku ${stepNum}`}
                  className={`h-2.5 rounded-sm transition-colors ${
                    isCurrent
                      ? "bg-[#007834] ring-1 ring-offset-1 ring-[#007834]"
                      : isCompleted
                      ? "bg-[#007834]/75 hover:bg-[#007834]"
                      : "bg-[#dce1e5] hover:bg-slate-300"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* KROK 1: KTO BĘDZIE NA URLOPIE                                       */}
      {/* =================================================================== */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#007834]">
              <Users className="w-4 h-4" />
              <span>KROK 1 &bull; PODZIAŁ OPIEKI</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
 Kto z Was planuje skorzystać z urlopu i zasiłku?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
 Wybierz, jak zamierzacie podzielić się czasem z maluchem. Możecie dzielić się urlopem elastycznie!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
 type="button"
 onClick={() => setWhoOnLeave("both")}
 className={`p-4 rounded border-2 text-left transition-all flex flex-col justify-between gap-3 ${
 whoOnLeave === "both"
                  ? "border-[#007834] bg-emerald-50/70 ring-2 ring-[#007834]/20"
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <Users className="w-6 h-6 text-[#007834]" />
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
 Najpopularniejsze
                </span>
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Oboje rodzice</div>
                <div className="text-xs text-slate-500 mt-1">
 Mama i tata dzielą się opieką. Tata korzysta z 9 tygodni niezbywalnych z dyrektywy WLB.
                </div>
              </div>
            </button>

            <button
 type="button"
 onClick={() => setWhoOnLeave("mother")}
 className={`p-4 rounded border-2 text-left transition-all flex flex-col justify-between gap-3 ${
 whoOnLeave === "mother"
                  ? "border-[#007834] bg-emerald-50/70 ring-2 ring-[#007834]/20"
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <User className="w-6 h-6 text-[#007834]" />
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Głównie mama</div>
                <div className="text-xs text-slate-500 mt-1">
 Mama wykorzystuje 20 tyg. macierzyńskiego oraz do 32 tyg. rodzicielskiego.
                </div>
              </div>
            </button>

            <button
 type="button"
 onClick={() => setWhoOnLeave("father")}
 className={`p-4 rounded border-2 text-left transition-all flex flex-col justify-between gap-3 ${
 whoOnLeave === "father"
                  ? "border-[#007834] bg-emerald-50/70 ring-2 ring-[#007834]/20"
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <UserCheck className="w-6 h-6 text-[#007834]" />
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Tata na urlopie</div>
                <div className="text-xs text-slate-500 mt-1">
 Tata przejmuje część urlopu po 14 tyg. mamy lub bierze urlop ojcowski (14 dni).
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
 type="button"
 onClick={() => setStep(2)}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-all "
            >
              <span>Dalej: Liczba dzieci</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* KROK 2: LICZBA DZIECI                                               */}
      {/* =================================================================== */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#007834]">
              <Baby className="w-4 h-4" />
              <span>KROK 2 &bull; TWOJE DZIECI</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
 Ile maluszków przyjdzie na świat?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
 Przy ciąży mnogiej (bliźnięta, trojaczki) ZUS przyznaje znacznie dłuższy płatny urlop macierzyński i rodzicielski.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
 type="button"
 onClick={() => setChildrenCount(1)}
 className={`p-4 rounded border-2 text-left transition-all flex flex-col justify-between gap-3 ${
 childrenCount === 1
                  ? "border-[#007834] bg-emerald-50/70 ring-2 ring-[#007834]/20"
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <Baby className="w-6 h-6 text-[#007834]" />
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Jedno dziecko</div>
                <div className="text-xs text-slate-500 mt-1">
 20 tyg. macierzyńskiego + 41 tyg. rodzicielskiego (łącznie 61 tygodni opieki).
                </div>
              </div>
            </button>

            <button
 type="button"
 onClick={() => setChildrenCount(2)}
 className={`p-4 rounded border-2 text-left transition-all flex flex-col justify-between gap-3 ${
 childrenCount === 2
                  ? "border-[#007834] bg-emerald-50/70 ring-2 ring-[#007834]/20"
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <div className="inline-flex items-center gap-0.5 text-[#007834]"><Baby className="w-5 h-5" /><Baby className="w-5 h-5" /></div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Bliźnięta</div>
                <div className="text-xs text-slate-500 mt-1">
 31 tyg. macierzyńskiego + 43 tyg. rodzicielskiego (łącznie 74 tygodnie opieki).
                </div>
              </div>
            </button>

            <button
 type="button"
 onClick={() => setChildrenCount(3)}
 className={`p-4 rounded border-2 text-left transition-all flex flex-col justify-between gap-3 ${
 childrenCount === 3
                  ? "border-[#007834] bg-emerald-50/70 ring-2 ring-[#007834]/20"
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <div className="inline-flex items-center gap-0.5 text-[#007834]"><Baby className="w-4 h-4" /><Baby className="w-4 h-4" /><Baby className="w-4 h-4" /></div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Trojaczki lub więcej</div>
                <div className="text-xs text-slate-500 mt-1">
 Do 37 tyg. macierzyńskiego + 43 tyg. rodzicielskiego (nawet do 80 tygodni).
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
 type="button"
 onClick={() => setStep(1)}
 className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wstecz</span>
            </button>
            <button
 type="button"
 onClick={() => setStep(3)}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-all "
            >
              <span>Dalej: Zarobki i praca</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* KROK 3: FORMA PRACY I ZAROBKI                                       */}
      {/* =================================================================== */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#007834]">
              <Briefcase className="w-4 h-4" />
              <span>KROK 3 &bull; TWOJE DOCHODY</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
 Jak pracujesz i ile zarabiasz co miesiąc?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
 Podaj swoje wynagrodzenie brutto (z umowy). Wyliczymy od razu, ile otrzymasz na rękę każdego miesiąca.
            </p>
          </div>

          {/* Wybór formy umowy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
 type="button"
 onClick={() => setContractType("employment")}
 className={`p-3 rounded border text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
 contractType === "employment"
                  ? "border-[#007834] bg-emerald-50 text-emerald-900 ring-1 ring-[#007834]"
                  : "border-[#dce1e5] bg-white text-slate-700 hover:bg-[#f4f6f7]"
              }`}
            >
              <Building2 className="w-4 h-4 text-[#007834]" />
              <span>Umowa o pracę (etat)</span>
            </button>

            <button
 type="button"
 onClick={() => setContractType("b2b")}
 className={`p-3 rounded border text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
 contractType === "b2b"
                  ? "border-[#007834] bg-emerald-50 text-emerald-900 ring-1 ring-[#007834]"
                  : "border-[#dce1e5] bg-white text-slate-700 hover:bg-[#f4f6f7]"
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#007834]" />
              <span>Działalność (JDG / B2B)</span>
            </button>

            <button
 type="button"
 onClick={() => setContractType("mandate")}
 className={`p-3 rounded border text-left text-xs font-bold flex items-center gap-2.5 transition-all ${
 contractType === "mandate"
                  ? "border-[#007834] bg-emerald-50 text-emerald-900 ring-1 ring-[#007834]"
                  : "border-[#dce1e5] bg-white text-slate-700 hover:bg-[#f4f6f7]"
              }`}
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Umowa zlecenie</span>
            </button>
          </div>

          {/* Kwota brutto i suwak */}
          <div className="bg-[#f4f6f7] p-4 rounded border border-[#dce1e5] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700">
                Średnia pensja brutto z umowy:
              </label>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900">
                  {monthlySalaryGross.toLocaleString("pl-PL")} zł brutto
                </span>
                <span className="text-xs text-slate-500 block font-normal">
                  (ok. {estimatedNetSalary.toLocaleString("pl-PL")} zł na rękę)
                </span>
              </div>
            </div>

            <input
 type="range"
 min={4806}
 max={25000}
 step={100}
 value={monthlySalaryGross}
 onChange={(e) => setMonthlySalaryGross(Number(e.target.value))}
 className="w-full accent-[#007834]"
            />

            {/* Szybkie przyciski kwot */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-semibold mr-1">Szybki wybór:</span>
              <button
 type="button"
 onClick={() => setMonthlySalaryGross(4806)}
 className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
 monthlySalaryGross === 4806
                    ? "bg-[#007834] text-white border-[#007834]"
                    : "bg-white text-slate-700 border-[#dce1e5] hover:bg-slate-100"
                }`}
              >
 4 806 zł (Min. 2026)
              </button>
              <button
 type="button"
 onClick={() => setMonthlySalaryGross(6500)}
 className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
 monthlySalaryGross === 6500
                    ? "bg-[#007834] text-white border-[#007834]"
                    : "bg-white text-slate-700 border-[#dce1e5] hover:bg-slate-100"
                }`}
              >
 6 500 zł
              </button>
              <button
 type="button"
 onClick={() => setMonthlySalaryGross(8500)}
 className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
 monthlySalaryGross === 8500
                    ? "bg-[#007834] text-white border-[#007834]"
                    : "bg-white text-slate-700 border-[#dce1e5] hover:bg-slate-100"
                }`}
              >
 8 500 zł
              </button>
              <button
 type="button"
 onClick={() => setMonthlySalaryGross(12000)}
 className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
 monthlySalaryGross === 12000
                    ? "bg-[#007834] text-white border-[#007834]"
                    : "bg-white text-slate-700 border-[#dce1e5] hover:bg-slate-100"
                }`}
              >
 12 000 zł
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
 type="button"
 onClick={() => setStep(2)}
 className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wstecz</span>
            </button>
            <button
 type="button"
 onClick={() => setStep(4)}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-all "
            >
              <span>Dalej: Ostatni krok</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* KROK 4: SYTUACJE SZCZEGÓLNE (OPCJONALNIE)                           */}
      {/* =================================================================== */}
      {step === 4 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#007834]">
              <Sparkles className="w-4 h-4" />
              <span>KROK 4 &bull; TWOJE PLANY I SYTUACJA</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
 Czy dotyczy Was któraś z poniższych sytuacji?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
 Większość porodów przebiega standardowo, ale jeśli maluch urodzi się wcześniej lub zechcesz dorabiać – ZUS daje specjalne przywileje!
            </p>
          </div>

          <div className="space-y-2.5">
            <button
 type="button"
 onClick={() => setSpecialSituation("none")}
 className={`w-full p-3.5 rounded border-2 text-left transition-all flex items-center justify-between ${
 specialSituation === "none"
                  ? "border-[#007834] bg-emerald-50/70 "
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-extrabold text-slate-900 text-sm">
 Wszystko w normie (poród o czasie, pełna opieka)
                </div>
                <div className="text-xs text-slate-500">
 Standardowy urlop macierzyński i rodzicielski bez łączenia z pracą.
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#007834] shrink-0" />
            </button>

            <button
 type="button"
 onClick={() => setSpecialSituation("preterm")}
 className={`w-full p-3.5 rounded border-2 text-left transition-all flex flex-col gap-2 ${
 specialSituation === "preterm"
                  ? "border-[#007834] bg-emerald-50/70 "
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Wcześniak lub pobyt malucha w szpitalu</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
 Art. 180² KP
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
 Przysługuje do 8 lub do 15 dodatkowych tygodni pełnego urlopu 100%!
                  </div>
                </div>
                <HeartPulse className="w-5 h-5 text-[#007834] shrink-0" />
              </div>

              {specialSituation === "preterm" && (
                <div className="pt-2 border-t border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Liczba dni pobytu dziecka w szpitalu:</span>
                    <span className="font-bold text-[#007834]">{hospitalDays} dni</span>
                  </div>
                  <input
 type="range"
 min={7}
 max={105}
 step={7}
 value={hospitalDays}
 onChange={(e) => setHospitalDays(Number(e.target.value))}
 className="w-full accent-[#007834]"
                  />
                </div>
              )}
            </button>

            <button
 type="button"
 onClick={() => setSpecialSituation("parttime")}
 className={`w-full p-3.5 rounded border-2 text-left transition-all flex items-center justify-between ${
 specialSituation === "parttime"
                  ? "border-[#007834] bg-emerald-50/70 "
                  : "border-[#dce1e5] bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>Chcę dorabiać na pół etatu na rodzicielskim</span>
                  <span className="bg-[#eef6f1] text-[#00416E] text-[10px] px-2 py-0.5 rounded-full font-bold">
 Art. 182¹ᶠ KP
                  </span>
                </div>
                <div className="text-xs text-slate-500">
 Pensja z pracy + połowa zasiłku, a urlop ulega proporcjonalnemu wydłużeniu.
                </div>
              </div>
              <Briefcase className="w-5 h-5 text-[#007834] shrink-0" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
 type="button"
 onClick={() => setStep(3)}
 className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wstecz</span>
            </button>
            <button
 type="button"
 onClick={handleSaveProfile}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generuj mój plan zasiłkowy</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* KROK 5: KARTA WYNIKÓW I CENTRALNY PROFIL RODZICA                    */}
      {/* =================================================================== */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          {/* Główny baner wyniku */}
          <div className="bg-gradient-to-br from-[#00416E] to-[#072442] text-white p-5 sm:p-7 rounded space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Twój Osobisty Plan Zasiłkowy 2026</span>
              </div>
              <button
 type="button"
 onClick={() => setStep(1)}
 className="text-xs text-slate-300 hover:text-white underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Zmień parametry</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded border border-white/10 space-y-1">
                <div className="text-xs text-slate-300">Szacowany zasiłek (81,5%):</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                  {Math.round(calculationPreview.maternityMonthlyBenefit).toLocaleString("pl-PL")} zł
                </div>
                <div className="text-[11px] text-slate-400">miesięcznie przez cały rok</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded border border-white/10 space-y-1">
                <div className="text-xs text-slate-300">Pula opieki nad maluchem:</div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {calculationPreview.maternityWeeks + calculationPreview.parentalTotalWeeks + calculationPreview.supplementaryWeeks} tyg.
                </div>
                <div className="text-[11px] text-slate-400">
                  {calculationPreview.maternityWeeks} macierzyński + {calculationPreview.parentalMomWeeks} rodzicielski + 9 dla taty
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded border border-white/10 space-y-1">
                <div className="text-xs text-slate-300">Łączny transfer z ZUS:</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {Math.round(calculationPreview.totalBenefitAmountSum).toLocaleString("pl-PL")} zł
                </div>
                <div className="text-[11px] text-slate-400">suma wszystkich świadczeń</div>
              </div>
            </div>

            {/* Rekomendacja wariantu */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Rekomendacja ZUS:</strong> Złóż wniosek ZAM w terminie <strong>do 21 dni po porodzie</strong>. Dzięki temu otrzymasz stałą, przewidywalną stawkę <strong>81,5%</strong> przez cały rok bez gwałtownego spadku dochodów w drugiej połowie urlopu.
              </div>
            </div>
          </div>

          {/* 4 Kafelki Akcji Przenoszące do Innych Modułów */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
 Gdzie chcesz przejść z tymi danymi? (Wszystko jest już wypełnione):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
 href="/kalkulator"
 onClick={onClose}
 className="p-4 bg-white border border-[#dce1e5] hover:border-[#007834] rounded transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-[#007834] rounded group-hover:bg-[#007834] group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
 Pełny kalkulator świadczeń
                    </div>
                    <div className="text-xs text-slate-500">
 Zobacz wykresy, porównanie 81,5% vs 100/70% i oś czasu
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#007834] transition-colors" />
              </Link>

              <Link
 href="/e-uslugi?prefill=1"
 onClick={onClose}
 className="p-4 bg-white border border-[#dce1e5] hover:border-[#00416E] rounded transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-[#00416E] rounded group-hover:bg-[#00416E] group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
 Generator Wniosku ZAM
                    </div>
                    <div className="text-xs text-slate-500">
 Pobierz gotowy druk A4 z kodem kreskowym lub wyślij do eZUS
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#00416E] transition-colors" />
              </Link>

              <Link
 href="/przewodnik"
 onClick={onClose}
 className="p-4 bg-white border border-[#dce1e5] hover:border-[#007834] rounded transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-[#007834] rounded group-hover:bg-[#007834] group-hover:text-white transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
 Twój terminarz i harmonogram
                    </div>
                    <div className="text-xs text-slate-500">
 Kamienie milowe od ciąży po powrót do pracy
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#007834] transition-colors" />
              </Link>

              <Link
 href="/asystent-ai"
 onClick={onClose}
 className="p-4 bg-white border border-[#dce1e5] hover:border-[#007834] rounded transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#f4f6f7] text-[#007834] rounded group-hover:bg-[#007834] group-hover:text-white transition-colors">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
 Asystent AI (zna Twoje dane)
                    </div>
                    <div className="text-xs text-slate-500">
 Zapytaj o szczegóły – AI odpowie w kontekście Twojej rodziny
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#007834] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Szybki skrót do słowniczka trudnych słów */}
          <div className="p-3.5 bg-[#f4f6f7] border border-[#dce1e5] rounded flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <BookOpen className="w-4 h-4 text-[#007834]" />
              <span>Nie rozumiesz któregoś pojęcia z decyzji lub wniosku?</span>
            </div>
            <button
 type="button"
 onClick={() => openGlossary()}
 className="font-bold text-[#007834] hover:underline"
            >
 Otwórz Słowniczek Trudnych Słów &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Jeśli modal
 if (isModal) {
 return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
        <div className="bg-white rounded max-w-2xl w-full border border-[#dce1e5] p-5 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#edf0f2] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-[#007834] rounded">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Mój Profil Rodzica ZUS 2026</h3>
            </div>
            {onClose && (
              <button
 type="button"
 onClick={onClose}
 className="text-slate-400 hover:text-slate-700 p-1.5 rounded"
              >
                ✕
              </button>
            )}
          </div>
          {content}
        </div>
      </div>
    );
  }

  // Wersja inline na stronie
 return content;
}
