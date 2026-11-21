"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
 Sliders,
 ShieldCheck,
 Save,
 RotateCcw,
 CheckCircle2,
 History,
 FileCode,
 ArrowRight,
 TrendingUp,
 AlertTriangle,
 Sparkles,
} from "lucide-react";
import { DEFAULT_LEGISLATIVE_2026 } from "@hacknation/shared";
import { calculateBenefits } from "@hacknation/shared";

interface AuditEntry {
 id: string;
 version: string;
 timestamp: string;
 author: string;
 changesSummary: string;
 status: "published" | "draft";
}

export default function AdminPage() {
  // Stan parametrów legislacyjnych
 const [minWage, setMinWage] = useState<number>(DEFAULT_LEGISLATIVE_2026.minimalWageGross);
 const [socialContributionRate, setSocialContributionRate] = useState<number>(DEFAULT_LEGISLATIVE_2026.employeeContributionDeductionPercent);
 const [jdgDebtThreshold, setJdgDebtThreshold] = useState<number>(DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross);
 const [averageRate815, setAverageRate815] = useState<number>(DEFAULT_LEGISLATIVE_2026.unifiedApplicationRatePercent);
 const [standardMaternityRate, setStandardMaternityRate] = useState<number>(DEFAULT_LEGISLATIVE_2026.maternityStandardRatePercent);
 const [standardParentalRate, setStandardParentalRate] = useState<number>(DEFAULT_LEGISLATIVE_2026.parentalStandardRatePercent);
 const [dadReservedParentalRate, setDadReservedParentalRate] = useState<number>(DEFAULT_LEGISLATIVE_2026.dadReservedParentalRatePercent);
 const [careLeaveRate, setCareLeaveRate] = useState<number>(DEFAULT_LEGISLATIVE_2026.careLeaveRatePercent);
 const [funeralBenefitAmount, setFuneralBenefitAmount] = useState<number>(DEFAULT_LEGISLATIVE_2026.funeralBenefitAmount);
  
  // Limity tygodni
 const [maternityWeeksSingle, setMaternityWeeksSingle] = useState<number>(DEFAULT_LEGISLATIVE_2026.maternityWeeksSingle);
 const [parentalWeeksSingle, setParentalWeeksSingle] = useState<number>(DEFAULT_LEGISLATIVE_2026.parentalWeeksSingle);
 const [parentalWeeksLife, setParentalWeeksLife] = useState<number>(DEFAULT_LEGISLATIVE_2026.parentalWeeksSingleLifeCertificate);
 const [dadReservedWeeks, setDadReservedWeeks] = useState<number>(DEFAULT_LEGISLATIVE_2026.parentalNonTransferableWeeksPerParent);
 const [pretermMaxEarlyWeeks, setPretermMaxEarlyWeeks] = useState<number>(DEFAULT_LEGISLATIVE_2026.supplementaryPre28OrWeightUnder1000MaxWeeks);
 const [pretermMaxStandardWeeks, setPretermMaxStandardWeeks] = useState<number>(DEFAULT_LEGISLATIVE_2026.supplementaryBetween28And37WeightOver1000MaxWeeks);

  // Status publikacji i wersjonowanie
 const [isSaving, setIsSaving] = useState<boolean>(false);
 const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
 const [activeVersionName, setActiveVersionName] = useState<string>("2026.1-PROD (Stan oficjalny)");
 const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
 id: "log-1",
 version: "2026.1-PROD",
 timestamp: "2026-01-01 00:00",
 author: "Departament Zasiłków ZUS",
 changesSummary: "Wdrożenie stawek 2026: płaca minimalna 4806 zł, zasiłek pogrzebowy 7000 zł, uzupełniający urlop dla wcześniaków art. 180² KP",
 status: "published",
    },
    {
 id: "log-2",
 version: "2025.2-ARCHIVE",
 timestamp: "2025-07-01 10:15",
 author: "Główny Inspektorat ZUS",
 changesSummary: "Aktualizacja progu zadłużenia składkowego JDG (1% z płacy minimalnej = 48,06 zł)",
 status: "published",
    },
 ]);

  // Podgląd na żywo wpływu zmian na przykładową rodzinę
 const sampleWage = 7000.0;
  
  // Kalkulacja z domyślnymi parametrami (wzorzec bazowy)
 const baseCalc = calculateBenefits({
 parentRole: "mother",
 contractType: "employment",
 monthlyBaseGross: sampleWage,
 childrenCount: 1,
 hasLifeCertificate: false,
 submissionWithin21Days: true,
 isPrematureOrHospitalized: false,
 workPartTimeDuringParental: false,
  });

  // Kalkulacja z bieżącymi parametrami z formularza
 const customParams = {
 minimalWageGross: minWage,
 employeeContributionDeductionPercent: socialContributionRate,
 jdgDebtThresholdGross: jdgDebtThreshold,
 unifiedApplicationRatePercent: averageRate815,
 maternityStandardRatePercent: standardMaternityRate,
 parentalStandardRatePercent: standardParentalRate,
 dadReservedParentalRatePercent: dadReservedParentalRate,
 careLeaveRatePercent: careLeaveRate,
 funeralBenefitAmount: funeralBenefitAmount,
 maternityWeeksSingle: maternityWeeksSingle,
 parentalWeeksSingle: parentalWeeksSingle,
 parentalWeeksSingleLifeCertificate: parentalWeeksLife,
 parentalNonTransferableWeeksPerParent: dadReservedWeeks,
 supplementaryPre28OrWeightUnder1000MaxWeeks: pretermMaxEarlyWeeks,
 supplementaryBetween28And37WeightOver1000MaxWeeks: pretermMaxStandardWeeks,
  };

 const modifiedCalc = calculateBenefits(
    {
 parentRole: "mother",
 contractType: "employment",
 monthlyBaseGross: sampleWage,
 childrenCount: 1,
 hasLifeCertificate: false,
 submissionWithin21Days: true,
 isPrematureOrHospitalized: false,
 workPartTimeDuringParental: false,
    },
 customParams
  );

 const diffMonthly = modifiedCalc.maternityMonthlyBenefit - baseCalc.maternityMonthlyBenefit;
 const diffTotal = modifiedCalc.totalBenefitAmountSum - baseCalc.totalBenefitAmountSum;

 const handleSaveAndPublish = () => {
 setIsSaving(true);
 setSaveSuccess(false);

 setTimeout(() => {
 setIsSaving(false);
 setSaveSuccess(true);
 const newVersionCode = `2026.${auditLog.length + 1}-CUSTOM`;
 setActiveVersionName(newVersionCode);
 const newEntry: AuditEntry = {
 id: `log-${Date.now()}`,
 version: newVersionCode,
 timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
 author: "Departament Legislacji ZUS (Sesja lokalna)",
 changesSummary: `Zmiana parametrów: płaca min. ${minWage} zł, stawka 81.5% -> ${averageRate815}%, macierzyński standard -> ${standardMaternityRate}%, rodzicielski -> ${standardParentalRate}%, pogrzebowy -> ${funeralBenefitAmount} zł`,
 status: "published",
      };
 setAuditLog([newEntry, ...auditLog]);

      // Zapis w localStorage dla integracji z kalkulatorem
 if (typeof window !== "undefined") {
 window.localStorage.setItem("zus_custom_legislative_params", JSON.stringify(customParams));
      }
    }, 600);
  };

 const handleResetDefaults = () => {
 setMinWage(DEFAULT_LEGISLATIVE_2026.minimalWageGross);
 setSocialContributionRate(DEFAULT_LEGISLATIVE_2026.employeeContributionDeductionPercent);
 setJdgDebtThreshold(DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross);
 setAverageRate815(DEFAULT_LEGISLATIVE_2026.unifiedApplicationRatePercent);
 setStandardMaternityRate(DEFAULT_LEGISLATIVE_2026.maternityStandardRatePercent);
 setStandardParentalRate(DEFAULT_LEGISLATIVE_2026.parentalStandardRatePercent);
 setDadReservedParentalRate(DEFAULT_LEGISLATIVE_2026.dadReservedParentalRatePercent);
 setCareLeaveRate(DEFAULT_LEGISLATIVE_2026.careLeaveRatePercent);
 setFuneralBenefitAmount(DEFAULT_LEGISLATIVE_2026.funeralBenefitAmount);
 setMaternityWeeksSingle(DEFAULT_LEGISLATIVE_2026.maternityWeeksSingle);
 setParentalWeeksSingle(DEFAULT_LEGISLATIVE_2026.parentalWeeksSingle);
 setParentalWeeksLife(DEFAULT_LEGISLATIVE_2026.parentalWeeksSingleLifeCertificate);
 setDadReservedWeeks(DEFAULT_LEGISLATIVE_2026.parentalNonTransferableWeeksPerParent);
 setPretermMaxEarlyWeeks(DEFAULT_LEGISLATIVE_2026.supplementaryPre28OrWeightUnder1000MaxWeeks);
 setPretermMaxStandardWeeks(DEFAULT_LEGISLATIVE_2026.supplementaryBetween28And37WeightOver1000MaxWeeks);
 setActiveVersionName("2026.1-PROD (Stan oficjalny)");
 setSaveSuccess(false);

 if (typeof window !== "undefined") {
 window.localStorage.removeItem("zus_custom_legislative_params");
    }
  };

  // Presety nowelizacji do szybkiej demonstracji dla jury
 const loadPresetNovela2027 = () => {
 setAverageRate815(85.0); // Podniesienie uśrednionej do 85%
 setStandardParentalRate(75.0); // Rodzicielski do 75%
 setDadReservedWeeks(12); // Wydłużenie rezerwy taty do 12 tygodni
 setMinWage(5150.0); // Wzrost płacy minimalnej
 setJdgDebtThreshold(51.50);
 setSaveSuccess(false);
  };

 return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
          <Link href="/">Strona główna</Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#1D4029] font-semibold">Panel Legislacyjny ZUS (Admin)</span>
        </nav>
        <Link
 href="/panel-pracownika"
 className="px-3 py-1.5 bg-[#0b2447] hover:bg-[#143c72] text-white rounded text-xs font-bold transition-colors inline-flex items-center gap-1.5 "
        >
          <span>&larr; Wróć do Pulpitu Inspektora ZUS</span>
        </Link>
      </div>
      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C6D6C3] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#2E4B38] font-semibold text-xs tracking-wider uppercase mb-1">
            <Sliders className="w-4 h-4 text-[#10371E]" />
            <span>Moduł 5 &bull; Panel Konfiguracji Legislacyjnej ZUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#10371E]">
 Dynamiczne parametry legislacyjne i stawki prawne
          </h1>
          <p className="text-sm text-[#425B4A] mt-1 max-w-3xl">
 Moduł umożliwia urzędnikom ZUS i Departamentowi Zasiłków natychmiastową aktualizację wskaźników prawnych, stawek procentowych i progów bez konieczności modyfikowania kodu źródłowego aplikacji.
          </p>
        </div>

        {/* Status Środowiska */}
        <div className="bg-[#EFF3EA] border border-[#B9CCB6] p-3.5 rounded flex items-center gap-3 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div className="text-xs">
            <span className="font-bold text-[#10371E] block">Środowisko: Produkcyjne</span>
            <span className="text-[#425B4A] font-medium">Aktywna wersja: {activeVersionName}</span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#EFF3EA] border border-[#8CA68E] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900 ">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-sm">Nowa konfiguracja została pomyślnie opublikowana!</span>
 Wskaźniki w silniku kalkulatora oraz generatorze wniosków ZAM zostały zaktualizowane w czasie rzeczywistym.
            </div>
          </div>
          <Link
 href="/kalkulator"
 className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors shrink-0"
          >
            <span>Przetestuj w kalkulatorze</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Szybkie presety scenariuszy legislacyjnych */}
      <div className="bg-[#EFF3EA]/70 border border-[#B9CCB6] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-[#10371E]">
          <Sparkles className="w-4 h-4 text-[#10371E] shrink-0" />
          <span>
            <strong>Narzędzie symulacji dla jurorów:</strong> Przetestuj wpływ projektu nowelizacji ustawy (np. podniesienie stawki do 85% i 12 tyg. dla taty).
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
 type="button"
 onClick={loadPresetNovela2027}
 className="text-xs font-bold bg-[#10371E] hover:bg-[#00477d] text-white px-3.5 py-1.5 rounded transition-colors"
          >
 Załaduj projekt nowelizacji 2027
          </button>
          <button
 type="button"
 onClick={handleResetDefaults}
 className="text-xs font-medium text-[#425B4A] hover:text-[#10371E] bg-white border border-[#B9CCB6] px-3 py-1.5 rounded"
          >
 Przywróć 2026
          </button>
        </div>
      </div>

      {/* Główny Formularz Edycji Wskaźników */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-6 rounded border border-[#C6D6C3] space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCE8D3] pb-3">
            <h2 className="text-base font-bold text-[#10371E] flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#10371E]" />
              <span>Edytor wskaźników finansowych i stawek procentowych</span>
            </h2>
            <button
 type="button"
 onClick={handleResetDefaults}
 className="text-xs text-slate-500 hover:text-[#10371E] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Przywróć domyślne 2026</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Płaca minimalna */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Minimalne wynagrodzenie (PLN brutto):
              </label>
              <input
 type="number"
 value={minWage}
 onChange={(e) => {
 const val = Number(e.target.value);
 setMinWage(val);
 setJdgDebtThreshold(Number((val * 0.01).toFixed(2)));
                }}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">Podstawa dla 100% płacy minimalnej</span>
            </div>

            {/* Potrącenie składek społecznych */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Wskaźnik potrącenia składek społecznych (%):
              </label>
              <input
 type="number"
 step="0.01"
 value={socialContributionRate}
 onChange={(e) => setSocialContributionRate(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">Ustawowe 13,71% (emerytalne, rentowe, chorobowe)</span>
            </div>

            {/* Próg zadłużenia składkowego JDG */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Próg zadłużenia JDG wstrzymujący zasiłek (PLN):
              </label>
              <input
 type="number"
 step="0.01"
 value={jdgDebtThreshold}
 onChange={(e) => setJdgDebtThreshold(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">Równe 1% minimalnego wynagrodzenia (art. 2a ustawy)</span>
            </div>

            {/* Stawka uśredniona 81,5% */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Stawka uśredniona zasiłku ZAM 21 dni (%):
              </label>
              <input
 type="number"
 step="0.1"
 value={averageRate815}
 onChange={(e) => setAverageRate815(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">Art. 30a ustawy zasiłkowej (długi wniosek)</span>
            </div>

            {/* Stawka macierzyńskiego standard */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Podstawowa stawka macierzyńskiego (%):
              </label>
              <input
 type="number"
 step="0.1"
 value={standardMaternityRate}
 onChange={(e) => setStandardMaternityRate(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">100% przy wniosku poza 21 dniami</span>
            </div>

            {/* Stawka rodzicielskiego standard */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Podstawowa stawka rodzicielskiego matki (%):
              </label>
              <input
 type="number"
 step="0.1"
 value={standardParentalRate}
 onChange={(e) => setStandardParentalRate(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">70% w wariancie etapowym</span>
            </div>

            {/* Stawka 9 tyg. ojca */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Stawka za 9 tyg. nieprzenoszalnych ojca (%):
              </label>
              <input
 type="number"
 step="0.1"
 value={dadReservedParentalRate}
 onChange={(e) => setDadReservedParentalRate(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">Art. 31 ust. 3 pkt 2 ustawy (domyślnie 70%)</span>
            </div>

            {/* Zasiłek pogrzebowy */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2E4B38] block">
 Zasiłek pogrzebowy (PLN):
              </label>
              <input
 type="number"
 step="100"
 value={funeralBenefitAmount}
 onChange={(e) => setFuneralBenefitAmount(Number(e.target.value))}
 className="w-full px-3 py-2 bg-[#EFF3EA] border border-[#B9CCB6] rounded text-xs font-bold text-[#10371E] focus:bg-white focus:ring-2 focus:ring-[#10371E]"
              />
              <span className="text-[10px] text-slate-500">Kwota podwyższona w 2026 r. (7 000 zł)</span>
            </div>
          </div>

          {/* Sekcja Limitów Tygodniowych */}
          <div className="pt-4 border-t border-[#DCE8D3] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#425B4A]">
 Ustawowe limity tygodniowe urlopów
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#425B4A] block">Macierzyński (1 dz.):</label>
                <input
 type="number"
 value={maternityWeeksSingle}
 onChange={(e) => setMaternityWeeksSingle(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-[#EFF3EA] border border-[#B9CCB6] rounded-md text-xs font-bold text-[#10371E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#425B4A] block">Rodzicielski łącznie:</label>
                <input
 type="number"
 value={parentalWeeksSingle}
 onChange={(e) => setParentalWeeksSingle(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-[#EFF3EA] border border-[#B9CCB6] rounded-md text-xs font-bold text-[#10371E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#425B4A] block">Rezerwa ojca:</label>
                <input
 type="number"
 value={dadReservedWeeks}
 onChange={(e) => setDadReservedWeeks(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-[#EFF3EA] border border-[#B9CCB6] rounded-md text-xs font-bold text-[#10371E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#425B4A] block">„Za życiem” max:</label>
                <input
 type="number"
 value={parentalWeeksLife}
 onChange={(e) => setParentalWeeksLife(Number(e.target.value))}
 className="w-full px-2.5 py-1.5 bg-[#EFF3EA] border border-[#B9CCB6] rounded-md text-xs font-bold text-[#10371E]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCE8D3] flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
 Zmiany wchodzą w życie natychmiast po kliknięciu publikacji.
            </span>
            <button
 type="button"
 onClick={handleSaveAndPublish}
 disabled={isSaving}
 className="inline-flex items-center gap-2 bg-[#10371E] hover:bg-[#00477d] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Zapisywanie parametrów..." : "Opublikuj wersję legislacyjną"}</span>
            </button>
          </div>
        </div>

        {/* Kolumny 9-12: Podgląd Wpływu na Żywo i Rejestr Zmian */}
        <div className="lg:col-span-4 space-y-6">
          {/* Karta: Podgląd wpływu na żywo (Live Impact) */}
          <div className="bg-slate-900 text-white p-5 rounded space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Symulacja wpływu na żywo (UoP 7 000 zł)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
 1 dziecko
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Zasiłek miesięczny mamy:</span>
                <span className="font-bold text-white font-mono">
                  {modifiedCalc.maternityMonthlyBenefit.toFixed(2)} zł
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Różnica vs wersja bazowa 2026:</span>
                <span
 className={`font-bold font-mono ${
 diffMonthly >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {diffMonthly >= 0 ? `+${diffMonthly.toFixed(2)}` : diffMonthly.toFixed(2)} zł/mc
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                <span>Łączna pula świadczeń:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {modifiedCalc.totalBenefitAmountSum.toFixed(2)} zł
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Różnica globalna:</span>
                <span className="font-mono">
                  {diffTotal >= 0 ? `+${diffTotal.toFixed(2)}` : diffTotal.toFixed(2)} zł
                </span>
              </div>
            </div>

            {diffTotal !== 0 && (
              <div className="p-2.5 bg-slate-800 rounded text-[11px] text-slate-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
 Wykryto odchylenie od oficjalnej ustawy 2026. Zmiany wpłyną na kalkulatory wszystkich użytkowników.
                </span>
              </div>
            )}
          </div>

          {/* Karta: Rejestr Zmian (Audit Trail) */}
          <div className="bg-white p-6 rounded border border-[#C6D6C3] space-y-4">
            <div className="flex items-center gap-2 text-[#10371E] font-bold text-sm border-b border-[#DCE8D3] pb-3">
              <History className="w-4 h-4 text-[#10371E]" />
              <span>Rejestr audytu zmian (Audit Log)</span>
            </div>

            <div className="space-y-3">
              {auditLog.map((log) => (
                <div
 key={log.id}
 className="p-3 bg-[#EFF3EA] border border-[#C6D6C3] rounded space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#10371E]">{log.version}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-[#2E4B38] font-medium leading-relaxed">{log.changesSummary}</div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-[#C6D6C3] flex items-center justify-between">
                    <span>Autor: {log.author}</span>
                    <span className="text-emerald-600 font-semibold uppercase">Opublikowano</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
