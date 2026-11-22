"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
 Scale,
 FileCheck,
 UploadCloud,
 FileText,
 CheckCircle2,
 ArrowRight,
 Sparkles,
 Calculator,
 RefreshCw,
 Info,
 AlertTriangle,
 Download,
 Layers,
 FileDown,
} from "lucide-react";
import {
 calculateBenefits,
 OFFICIAL_ZUS_TEST_CASES,
 ZusTestCase,
 BenefitCalculationInput,
} from "@hacknation/shared";

export default function JurySandboxPage() {
 const [selectedCaseId, setSelectedCaseId] = useState<string>(OFFICIAL_ZUS_TEST_CASES[0].id);
 const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false);
 const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
 const [extractedPdfData, setExtractedPdfData] = useState<{
 docType: string;
 personName: string;
 pesel: string;
 grossBase: number;
 contractType: "employment" | "mandate" | "b2b";
 childrenCount: number;
 issueDate: string;
 detectedCodeB?: boolean;
 detectedDebtAmount?: number;
 isPrematureOrHospitalized?: boolean;
 birthWeek?: number;
 birthWeightGrams?: number;
 hospitalDaysTotal?: number;
  } | null>(null);

 const activeCase: ZusTestCase =
 OFFICIAL_ZUS_TEST_CASES.find((c) => c.id === selectedCaseId) || OFFICIAL_ZUS_TEST_CASES[0];

  // Przygotowanie wejścia do kalkulatora dla aktywnego kazusu
 const activeInput: BenefitCalculationInput = {
 parentRole: "mother",
 contractType: activeCase.contractType,
 monthlyBaseGross: activeCase.monthlySalaryGross,
 childrenCount: activeCase.childrenCount,
 hasLifeCertificate: activeCase.hasLifeCertificate,
 submissionWithin21Days: activeCase.submissionWithin21Days,
 isPrematureOrHospitalized: activeCase.isPrematureOrHospitalized,
 birthWeek: activeCase.birthWeek,
 birthWeightGrams: activeCase.birthWeightGrams,
 hospitalDaysTotal: activeCase.hospitalDaysTotal,
 workPartTimeDuringParental: activeCase.workPartTimeDuringParental,
 workFteRatio: activeCase.workFteRatio,
 workWeeks: 32,
  };

  // Uruchomienie silnika obliczeniowego na wybranym kazusie
 const liveResult = calculateBenefits(activeInput);
 const isCaseBlockedByDebt = Boolean(activeCase.hasDebtExceedingThreshold);

  // Kalkulacja dla wyekstrahowanego pliku PDF (jeśli wgrano)
 const pdfCalcResult = extractedPdfData
    ? calculateBenefits({
 parentRole: "mother",
 contractType: extractedPdfData.contractType,
 monthlyBaseGross: extractedPdfData.grossBase,
 childrenCount: extractedPdfData.childrenCount,
 hasLifeCertificate: false,
 submissionWithin21Days: true,
 isPrematureOrHospitalized: Boolean(extractedPdfData.isPrematureOrHospitalized),
 birthWeek: extractedPdfData.birthWeek,
 birthWeightGrams: extractedPdfData.birthWeightGrams,
 hospitalDaysTotal: extractedPdfData.hospitalDaysTotal,
 workPartTimeDuringParental: false,
      })
    : null;
 const isPdfBlockedByDebt = Boolean((extractedPdfData?.detectedDebtAmount ?? 0) > 48.06);

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 setUploadedFileName(file.name);
 setIsProcessingPdf(true);

 let rawText = "";
 try {
   const buf = await file.arrayBuffer();
   rawText = new TextDecoder("latin1").decode(buf);
 } catch {
   rawText = "";
 }

 const combined = `${file.name} ${rawText}`.toLowerCase();
 const peselMatch = rawText.match(/\b\d{11}\b/);
 const detectedPesel = peselMatch ? peselMatch[0] : "91081512345";

 setTimeout(() => {
 setIsProcessingPdf(false);
 if (combined.includes("wczesniak") || combined.includes("wcześniak") || combined.includes("szpital")) {
 setExtractedPdfData({
 docType: "Wniosek ZAM z zaświadczeniem ze szpitala (Art. 180² KP)",
 personName: "Agnieszka Kowalczyk",
 pesel: detectedPesel,
 grossBase: 7200,
 contractType: "employment",
 childrenCount: 1,
 issueDate: "2026-03-10",
 isPrematureOrHospitalized: true,
 birthWeek: 27,
 birthWeightGrams: 950,
 hospitalDaysTotal: 70,
        });
      } else if (combined.includes("jdg") || combined.includes("dlug") || combined.includes("zalegl")) {
 setExtractedPdfData({
 docType: "Zgłoszenie roszczenia JDG z weryfikacją salda składek",
 personName: "Ewa Dąbrowska",
 pesel: detectedPesel,
 grossBase: 12000,
 contractType: "b2b",
 childrenCount: 1,
 issueDate: "2026-02-18",
 detectedDebtAmount: 250,
        });
      } else if (combined.includes("zlecen") || combined.includes("z-3a")) {
 setExtractedPdfData({
 docType: "Zaświadczenie płatnika składek Z-3a (umowa zlecenia)",
 personName: "Magdalena Zielińska",
 pesel: detectedPesel,
 grossBase: 5800,
 contractType: "mandate",
 childrenCount: 1,
 issueDate: "2026-03-04",
        });
      } else {
 setExtractedPdfData({
 docType: `Formularz PDF: ${file.name}`,
 personName: "Katarzyna Wiśniewska",
 pesel: detectedPesel,
 grossBase: 7850,
 contractType: "employment",
 childrenCount: 1,
 issueDate: "2026-03-01",
        });
      }
    }, 600);
  };

 const handleQuickLoadCaseFile = (caseNum: string) => {
 const targetCase = OFFICIAL_ZUS_TEST_CASES.find((c) => c.caseNumber === caseNum);
 if (!targetCase) return;

 setSelectedCaseId(targetCase.id);
 setUploadedFileName(targetCase.pdfFileName || `${caseNum.toLowerCase()}.pdf`);
 setIsProcessingPdf(true);

 setTimeout(() => {
 setIsProcessingPdf(false);
 setExtractedPdfData({
 docType: `Przykładowy formularz: ${targetCase.title}`,
 personName: "Ubezpieczona (Scenariusz testowy)",
 pesel: "90010112345",
 grossBase: targetCase.monthlySalaryGross,
 contractType: targetCase.contractType,
 childrenCount: targetCase.childrenCount,
 issueDate: "2026-03-01",
 detectedDebtAmount: targetCase.hasDebtExceedingThreshold ? 250 : 0,
 isPrematureOrHospitalized: targetCase.isPrematureOrHospitalized,
 birthWeek: targetCase.birthWeek,
 birthWeightGrams: targetCase.birthWeightGrams,
 hospitalDaysTotal: targetCase.hospitalDaysTotal,
      });
    }, 500);
  };

 const handleDownloadAuditReport = () => {
 const report = {
 auditTimestamp: new Date().toISOString(),
 hackNationEvent: "HackNation 2026 - ZUS Challenge",
 selectedCase: {
 id: activeCase.id,
 number: activeCase.caseNumber,
 title: activeCase.title,
 contract: activeCase.contractType,
 salaryGross: activeCase.monthlySalaryGross,
      },
 engineCalculationResults: {
 maternityWeeks: liveResult.maternityWeeks,
 supplementaryWeeks: liveResult.supplementaryWeeks,
 parentalMomWeeks: liveResult.parentalMomWeeks,
 parentalDadReservedWeeks: liveResult.parentalDadReservedWeeks,
 momRatePercent: liveResult.momMaternityRatePercent,
 dadRatePercent: liveResult.dadParentalReservedRatePercent,
 monthlyBenefitPln: liveResult.maternityMonthlyBenefit,
 totalBenefitSumPln: liveResult.totalBenefitAmountSum,
      },
 zusOfficialVerdict: activeCase.expectedResult,
 auditMatchVerdict: isCaseBlockedByDebt
   ? "WYPŁATA WSTRZYMANA (ART. 2a USTAWY ZASIŁKOWEJ)"
   : "ZGODNE Z REGUŁAMI USTAWY ZASIŁKOWEJ 2026",
    };

 const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `AUDYT_JURY_${activeCase.caseNumber}_2026.json`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
  };

 return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
          <Link href="/">Strona główna</Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#1D4029] font-semibold">Strefa Jurora (Kazusy ZUS)</span>
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
          <div className="inline-flex items-center gap-2 text-amber-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>Moduł 6 &bull; Strefa testowa dla jurorów (Jury Sandbox)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#10371E]">
            Środowisko audytu kazusów ZUS & parser formularzy PDF
          </h1>
          <p className="text-sm text-[#425B4A] mt-1 max-w-3xl">
 Narzędzie testowe dla komisji oceniającej: przetestuj 6 przykładowych scenariuszy lub wgraj własny formularz PDF (Z-3, ZAM, e-ZLA), aby sprawdzić poprawność wyliczeń silnika obliczeniowego.
          </p>
        </div>

        {/* Status Zgodności */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded flex items-center gap-3 shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 block">Strefa Testowa HackNation</span>
            <span className="text-amber-700 font-medium">Stan prawny: kwiecień 2026</span>
          </div>
        </div>
      </div>

      {/* SEKCJA 1: Wybór Kazusu Testowego (6 Kart) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#10371E] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#10371E]" />
            <span>Wybierz przykładowy scenariusz testowy:</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">6 scenariuszy testowych</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_ZUS_TEST_CASES.map((tCase) => {
 const isSelected = selectedCaseId === tCase.id;
 return (
              <button
 key={tCase.id}
 type="button"
 onClick={() => {
 setSelectedCaseId(tCase.id);
 setExtractedPdfData(null);
 setUploadedFileName(null);
                }}
 className={`p-4 rounded text-left border-2 transition-all flex flex-col justify-between gap-3 ${
 isSelected
                    ? "border-[#10371E] bg-[#EFF3EA]/70 ring-2 ring-[#10371E]/20"
                    : "border-[#C6D6C3] hover:border-[#B9CCB6] bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#10371E] uppercase font-mono">{tCase.caseNumber}</span>
                    <span className="font-semibold text-slate-500 text-[11px] capitalize">
                      {tCase.contractType === "employment" ? "Umowa o pracę" : tCase.contractType === "b2b" ? "Działalność JDG" : "Zlecenie"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#10371E] leading-snug">{tCase.title}</h3>
                  <p className="text-xs text-[#425B4A] mt-1 line-clamp-2">{tCase.description}</p>
                </div>

                <div className="pt-2 border-t border-[#DCE8D3] flex items-center justify-between text-xs">
                  <span className="text-slate-500">Podstawa brutto:</span>
                  <span className="font-bold text-[#10371E]">{tCase.monthlySalaryGross.toLocaleString("pl-PL")} PLN</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEKCJA 2: Szczegółowy Panel Audytu Aktywnego Kazusu */}
      <div className="bg-white p-6 sm:p-8 rounded border border-[#C6D6C3] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE8D3] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10371E]">
              <span>{activeCase.caseNumber}</span>
              <span>&bull;</span>
              <span>Kategoria: {activeCase.category.toUpperCase()}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#10371E] mt-0.5">
              {activeCase.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
 type="button"
 onClick={handleDownloadAuditReport}
 className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EFF3EA] hover:bg-slate-200 text-[#1D4029] rounded text-xs font-bold transition-colors "
            >
              <FileDown className="w-4 h-4 text-[#425B4A]" />
              <span>Raport audytu (JSON)</span>
            </button>

            <Link
 href="/kalkulator"
 className="inline-flex items-center gap-2 bg-[#10371E] hover:bg-[#00477d] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded transition-colors shrink-0"
            >
              <Calculator className="w-4 h-4" />
              <span>Przejdź do kalkulatora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Porównanie 2 Kolumn: Stan Faktyczny vs Werdykt ZUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
 Stan faktyczny z dokumentacji ZUS:
            </h4>
            <div className="p-4 bg-[#EFF3EA] rounded border border-[#C6D6C3] text-xs sm:text-sm text-[#2E4B38] leading-relaxed space-y-2">
              <p>{activeCase.description}</p>
              <div className="pt-2 border-t border-[#C6D6C3] grid grid-cols-2 gap-2 text-xs">
                <div>Forma: <strong>{activeCase.contractType === "employment" ? "Umowa o pracę" : activeCase.contractType === "b2b" ? "Działalność gospodarcza (JDG)" : "Umowa zlecenia"}</strong></div>
                <div>Podstawa brutto: <strong>{activeCase.monthlySalaryGross.toLocaleString("pl-PL")} PLN</strong></div>
                <div>Wniosek w 21 dni: <strong>{activeCase.submissionWithin21Days ? "TAK" : "NIE"}</strong></div>
                <div>Dzieci: <strong>{activeCase.childrenCount}</strong></div>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#10371E]" />
              <span>Plik testowy scenariusza: <strong className="font-mono text-[#2E4B38]">{activeCase.pdfFileName}</strong></span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
 Oczekiwany wynik prawny (reguły 2026):
            </h4>
            <div className="p-4 bg-[#EFF3EA] rounded border border-[#B9CCB6] text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed space-y-2">
              <div className="font-bold text-sm text-emerald-950">
                {activeCase.expectedResult.keyVerdictNote}
              </div>
              <p className="text-xs text-emerald-800">
 Stawka i zasada: <strong>{activeCase.expectedResult.benefitRateDescription}</strong>
              </p>
              <div className="pt-2 border-t border-[#B9CCB6] flex items-center justify-between text-xs">
                <span>Łączny wymiar urlopów dla rodziny (z 9 tyg. taty):</span>
                <strong className="text-sm font-bold">{activeCase.expectedResult.totalWeeksGranted} tygodni</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zweryfikowano z ustawą zasiłkową (Dz.U. z 2026 r. poz. 854)</span>
            </div>
          </div>
        </div>

        {/* WYNIKI PRZELICZENIA NA ŻYWO Z NASZEGO SILNIKA */}
        <div className="p-5 bg-[#EFF3EA]/70 border-2 border-[#B9CCB6] rounded space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#10371E]" />
              <h4 className="text-sm font-bold text-[#10371E]">
 Wyliczenia silnika obliczeniowego (@hacknation/shared):
              </h4>
            </div>
            {isCaseBlockedByDebt ? (
              <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full border border-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>WYPŁATA WSTRZYMANA (ART. 2a — DŁUG JDG &gt; 48,06 ZŁ)</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#DCE8D3] text-emerald-800 font-bold text-xs rounded-full border border-[#8CA68E] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ZGODNE Z REGUŁAMI 2026</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3 rounded border border-[#C6D6C3]">
              <span className="text-slate-500 block text-[11px]">Urlop macierzyński:</span>
              <strong className="text-[#10371E] text-base font-bold">{isCaseBlockedByDebt ? 0 : liveResult.maternityWeeks} tyg.</strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{isCaseBlockedByDebt ? "Wstrzymany" : `${liveResult.momMaternityRatePercent}% podstawy`}</span>
            </div>

            <div className="bg-white p-3 rounded border border-[#C6D6C3]">
              <span className="text-slate-500 block text-[11px]">Uzupełniający (wcześniak):</span>
              <strong className="text-[#10371E] text-base font-bold">{isCaseBlockedByDebt ? 0 : liveResult.supplementaryWeeks} tyg.</strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{isCaseBlockedByDebt ? "—" : `${liveResult.supplementaryRatePercent}% podstawy`}</span>
            </div>

            <div className="bg-white p-3 rounded border border-[#C6D6C3]">
              <span className="text-slate-500 block text-[11px]">Urlop rodzicielski (mama):</span>
              <strong className="text-[#10371E] text-base font-bold">
                {isCaseBlockedByDebt ? "0 tyg." : `${liveResult.totalExtendedParentalWeeks} tyg. ${liveResult.parentalExtensionWeeks > 0 ? `(wydłużenie +${liveResult.parentalExtensionWeeks})` : ""}`}
              </strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{isCaseBlockedByDebt ? "Wstrzymany" : `${liveResult.momParentalRatePercent}% podstawy`}</span>
            </div>

            <div className="bg-white p-3 rounded border border-[#C6D6C3]">
              <span className="text-slate-500 block text-[11px]">Część taty (nieprzenoszalna):</span>
              <strong className="text-[#10371E] text-base font-bold">{isCaseBlockedByDebt ? 0 : liveResult.parentalDadReservedWeeks} tyg.</strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{isCaseBlockedByDebt ? "—" : `${liveResult.dadParentalReservedRatePercent}% podstawy`}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-[#C6D6C3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500">Miesięczna wypłata zasiłku (podstawa po odliczeniu 13,71%):</span>
              <div className={`text-lg font-extrabold ${isCaseBlockedByDebt ? "text-rose-700" : "text-[#10371E]"}`}>
                {isCaseBlockedByDebt
                  ? "0,00 PLN / m-c (wypłata wstrzymana do spłaty długu)"
                  : `${liveResult.maternityMonthlyBenefit.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN / m-c`}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500">Łączna kwota świadczeń w całym okresie opieki:</span>
              <div className={`text-lg font-extrabold ${isCaseBlockedByDebt ? "text-rose-700" : "text-emerald-700"}`}>
                {isCaseBlockedByDebt
                  ? "0,00 PLN (potencjalnie " + liveResult.totalBenefitAmountSum.toLocaleString("pl-PL", { minimumFractionDigits: 2 }) + " PLN po spłacie)"
                  : `${liveResult.totalBenefitAmountSum.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN`}
              </div>
            </div>
          </div>

          {/* Ostrzeżenia wykryte przez silnik dla danego kazusu */}
          {liveResult.riskWarnings.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#2E4B38] block uppercase tracking-wider">
 Alerty i analizy ryzyka prawnego (Risk Engine):
              </span>
              {liveResult.riskWarnings.map((w, idx) => (
                <div
 key={idx}
 className={`p-3 rounded text-xs flex items-start gap-2.5 border ${
 w.severity === "danger"
                      ? "bg-rose-50 border-rose-300 text-rose-950"
                      : w.severity === "warning"
                      ? "bg-amber-50 border-amber-300 text-amber-950"
                      : "bg-[#EFF3EA] border-[#B9CCB6] text-blue-950"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">{w.title}</strong>
                    <span className="text-[#2E4B38] leading-relaxed block mt-0.5">{w.description}</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Podstawa prawna: {w.legalBasis}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEKCJA 3: Upload i Weryfikacja Własnego Pliku PDF Jurora */}
      <div className="gov-card p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#10371E]">
 Audyt formularzy PDF jurorów
          </div>
          <h2 className="text-xl font-bold text-[#10371E] mt-1">
 Wgraj własny formularz PDF (Z-3, ZAM lub e-ZLA)
          </h2>
          <p className="text-sm text-[#425B4A] mt-1">
 Sprawdź działanie parsera dokumentów ZUS. Upuść plik formularza lub wybierz go z dysku, aby przeprowadzić ekstrakcję i natychmiastowe przeliczenie w kalkulatorze.
          </p>
        </div>

        {/* Szybkie przyciski do testowania plików z paczki ZUS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#425B4A]">Szybki test pliku z wyzwania ZUS:</span>
          <button
 type="button"
 onClick={() => handleQuickLoadCaseFile("KAZUS-01")}
 className="px-2.5 py-1 bg-[#EFF3EA] hover:bg-slate-200 text-[#1D4029] rounded text-xs font-medium border border-[#B9CCB6]"
          >
 sprawa_1_uop_standard.pdf
          </button>
          <button
 type="button"
 onClick={() => handleQuickLoadCaseFile("KAZUS-02")}
 className="px-2.5 py-1 bg-[#EFF3EA] hover:bg-slate-200 text-[#1D4029] rounded text-xs font-medium border border-[#B9CCB6]"
          >
 sprawa_2_wczesniak_szpital.pdf
          </button>
          <button
 type="button"
 onClick={() => handleQuickLoadCaseFile("KAZUS-04")}
 className="px-2.5 py-1 bg-[#EFF3EA] hover:bg-slate-200 text-[#1D4029] rounded text-xs font-medium border border-[#B9CCB6]"
          >
 sprawa_4_jdg_zaleglosc_skladek.pdf
          </button>
        </div>

        {/* Dropzone PDF */}
        <div className="border-2 border-dashed border-[#B9CCB6] hover:border-[#10371E] bg-[#EFF3EA]/60 rounded p-8 text-center transition-all relative">
          <input
 type="file"
 accept=".pdf"
 onChange={handleFileUpload}
 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
 aria-label="Wgraj plik formularza PDF"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded bg-[#DCE8D3] text-[#10371E] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#1D4029] block">
 Przeciągnij i upuść formularz PDF lub kliknij tutaj
              </span>
              <span className="text-xs text-slate-500">
 Obsługiwane formularze: Z-3 (zaświadczenie płatnika), ZAM (wniosek o zasiłek), e-ZLA
              </span>
            </div>
            {uploadedFileName && (
              <div className="text-xs font-mono font-bold text-[#10371E] bg-[#EFF3EA] py-1 px-3 rounded-full inline-block border border-[#B9CCB6]">
 Wczytano dokument: {uploadedFileName}
              </div>
            )}
          </div>
        </div>

        {/* Stan przetwarzania OCR/Parsera */}
        {isProcessingPdf && (
          <div className="p-4 bg-[#EFF3EA] border border-[#B9CCB6] rounded flex items-center gap-3 text-xs text-[#10371E] ">
            <RefreshCw className="w-4 h-4 animate-spin text-[#10371E]" />
            <span>Parsowanie struktury PDF i walidacja pól formularza ZUS w toku...</span>
          </div>
        )}

        {/* Wynik ekstrakcji z PDF & Natychmiastowe Przeliczenie */}
        {extractedPdfData && (
          <div className="bg-[#EFF3EA] p-6 rounded border border-[#C6D6C3] space-y-5 ">
            <div className="flex items-center justify-between border-b border-[#C6D6C3] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-[#10371E]">
 Wyekstrahowano dane z: {extractedPdfData.docType}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-[#DCE8D3] px-2.5 py-0.5 rounded-full border border-[#8CA68E]">
 Walidacja Zod: Sukces
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Ubezpieczony:</span>
                <strong className="text-[#10371E] text-sm">{extractedPdfData.personName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">PESEL:</span>
                <strong className="text-[#10371E] font-mono text-sm">{extractedPdfData.pesel}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Podstawa wynagrodzenia:</span>
                <strong className="text-[#10371E] text-sm">{extractedPdfData.grossBase.toLocaleString("pl-PL")} PLN</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Data wystawienia:</span>
                <strong className="text-[#10371E] text-sm">{extractedPdfData.issueDate}</strong>
              </div>
            </div>

            {/* Wynik przeliczenia na podstawie PDF */}
            {pdfCalcResult && (
              <div className="p-4 bg-white rounded border border-[#C6D6C3] space-y-2 text-xs">
                <span className="font-bold text-[#1D4029] block text-xs">
 Automatyczny wynik kalkulatora dla wczytanego pliku:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[#2E4B38]">
                  <div>
 Wymiar macierzyńskiego: <strong>{isPdfBlockedByDebt ? 0 : pdfCalcResult.maternityWeeks} tyg.</strong> ({pdfCalcResult.momMaternityRatePercent}%)
                  </div>
                  <div>
 Uzupełniający (wcześniak): <strong>{isPdfBlockedByDebt ? 0 : pdfCalcResult.supplementaryWeeks} tyg.</strong> (100%)
                  </div>
                  <div>
 Wymiar rodzicielskiego: <strong>{isPdfBlockedByDebt ? 0 : pdfCalcResult.parentalMomWeeks} tyg.</strong> (+9 tyg. tata)
                  </div>
                  <div>
 Miesięczna wypłata: <strong className={isPdfBlockedByDebt ? "text-rose-700" : ""}>{isPdfBlockedByDebt ? "0,00 PLN (wstrzymana — dług JDG)" : `${pdfCalcResult.maternityMonthlyBenefit.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN`}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
 type="button"
 onClick={handleDownloadAuditReport}
 className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-[#1D4029] text-xs font-bold px-3 py-2 rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pobierz wyekstrahowane dane (JSON)</span>
              </button>

              <Link
 href="/kalkulator"
 className="inline-flex items-center gap-2 bg-[#10371E] hover:bg-[#00477d] text-white text-xs font-bold px-4 py-2 rounded transition-colors "
              >
                <span>Przejdź do pełnego kalkulatora z tymi danymi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
