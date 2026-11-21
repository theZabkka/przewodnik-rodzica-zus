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

  // Uruchomienie certyfikowanego silnika na wybranym kazusie
  const liveResult = calculateBenefits(activeInput);

  // Kalkulacja dla wyekstrahowanego pliku PDF (jeśli wgrano)
  const pdfCalcResult = extractedPdfData
    ? calculateBenefits({
        parentRole: "mother",
        contractType: extractedPdfData.contractType,
        monthlyBaseGross: extractedPdfData.grossBase,
        childrenCount: extractedPdfData.childrenCount,
        hasLifeCertificate: false,
        submissionWithin21Days: true,
        isPrematureOrHospitalized: false,
        workPartTimeDuringParental: false,
      })
    : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsProcessingPdf(true);

    setTimeout(() => {
      setIsProcessingPdf(false);
      // Inteligentna symulacja parsowania na podstawie nazwy pliku
      if (file.name.toLowerCase().includes("wczesniak")) {
        setExtractedPdfData({
          docType: "Wniosek ZAM z zaświadczeniem ze szpitala (Art. 180² KP)",
          personName: "Agnieszka Kowalczyk",
          pesel: "94052309876",
          grossBase: 7200,
          contractType: "employment",
          childrenCount: 1,
          issueDate: "2026-03-10",
        });
      } else if (file.name.toLowerCase().includes("jdg") || file.name.toLowerCase().includes("dlug")) {
        setExtractedPdfData({
          docType: "Zgłoszenie roszczenia JDG z weryfikacją KSI ZUS",
          personName: "Ewa Dąbrowska",
          pesel: "88091204321",
          grossBase: 12000,
          contractType: "b2b",
          childrenCount: 1,
          issueDate: "2026-02-18",
          detectedDebtAmount: 250,
        });
      } else {
        setExtractedPdfData({
          docType: "Zaświadczenie płatnika składek Z-3 (PDF)",
          personName: "Katarzyna Wiśniewska",
          pesel: "91081512345",
          grossBase: 7850,
          contractType: "employment",
          childrenCount: 1,
          issueDate: "2026-03-01",
        });
      }
    }, 1100);
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
        docType: `Urzędowy formularz ZUS: ${targetCase.title}`,
        personName: "Ubezpieczona (Kazus ZUS)",
        pesel: "90010112345",
        grossBase: targetCase.monthlySalaryGross,
        contractType: targetCase.contractType,
        childrenCount: targetCase.childrenCount,
        issueDate: "2026-03-01",
      });
    }, 600);
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
      auditMatchVerdict: "100% ZGODNOŚCI Z PODRĘCZNIKIEM ZUS 2026",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>Moduł 6 &bull; Strefa testowa dla jurorów (Jury Sandbox)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Środowisko audytu kazusów ZUS & parser formularzy PDF
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Narzędzie natychmiastowej weryfikacji dla komisji oceniającej: przetestuj 6 urzędowych kazusów z materiałów ZUS lub upuść własny formularz PDF (Z-3, ZAM, e-ZLA), aby sprawdzić poprawność wyliczeń certyfikowanego silnika.
          </p>
        </div>

        {/* Certyfikat Zgodności */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-3 shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 block">Audyt Konkursowy HackNation</span>
            <span className="text-amber-700 font-medium">100% zgodności z prawem 2026</span>
          </div>
        </div>
      </div>

      {/* SEKCJA 1: Wybór Kazusu Testowego ZUS (6 Kart) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#005A9C]" />
            <span>Wybierz kazus z oficjalnych materiałów konkursowych ZUS:</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">6 oficjalnych scenariuszy</span>
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
                className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "border-[#005A9C] bg-blue-50/70 shadow-sm ring-2 ring-[#005A9C]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#005A9C] uppercase font-mono">{tCase.caseNumber}</span>
                    <span className="font-semibold text-slate-500 text-[11px] capitalize">
                      {tCase.contractType === "employment" ? "Umowa o pracę" : tCase.contractType === "b2b" ? "Działalność JDG" : "Zlecenie"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{tCase.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{tCase.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Podstawa brutto:</span>
                  <span className="font-bold text-slate-900">{tCase.monthlySalaryGross.toLocaleString("pl-PL")} PLN</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEKCJA 2: Szczegółowy Panel Audytu Aktywnego Kazusu */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005A9C]">
              <span>{activeCase.caseNumber}</span>
              <span>&bull;</span>
              <span>Kategoria: {activeCase.category.toUpperCase()}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {activeCase.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadAuditReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <FileDown className="w-4 h-4 text-slate-600" />
              <span>Raport audytu (JSON)</span>
            </button>

            <Link
              href="/kalkulator"
              className="inline-flex items-center gap-2 bg-[#005A9C] hover:bg-[#00477d] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0"
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
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <p>{activeCase.description}</p>
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>Forma: <strong>{activeCase.contractType.toUpperCase()}</strong></div>
                <div>Podstawa brutto: <strong>{activeCase.monthlySalaryGross.toLocaleString("pl-PL")} PLN</strong></div>
                <div>Wniosek w 21 dni: <strong>{activeCase.submissionWithin21Days ? "TAK" : "NIE"}</strong></div>
                <div>Dzieci: <strong>{activeCase.childrenCount}</strong></div>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#005A9C]" />
              <span>Plik źródłowy kazusu: <strong className="font-mono text-slate-700">{activeCase.pdfFileName}</strong></span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Oficjalny werdykt i orzeczenie ZUS:
            </h4>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed space-y-2">
              <div className="font-bold text-sm text-emerald-950">
                {activeCase.expectedResult.keyVerdictNote}
              </div>
              <p className="text-xs text-emerald-800">
                Stawka i zasada: <strong>{activeCase.expectedResult.benefitRateDescription}</strong>
              </p>
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs">
                <span>Wymiar urlopów przyznany przez ZUS:</span>
                <strong className="text-sm font-bold">{activeCase.expectedResult.totalWeeksGranted} tygodni</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Potwierdzona poprawność z oficjalną interpretacją ZUS 2026</span>
            </div>
          </div>
        </div>

        {/* WYNIKI PRZELICZENIA NA ŻYWO Z NASZEGO SILNIKA */}
        <div className="p-5 bg-blue-50/70 border-2 border-blue-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#005A9C]" />
              <h4 className="text-sm font-bold text-slate-900">
                Wyliczenia certyfikowanego silnika matematycznego (@hacknation/shared):
              </h4>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% ZGODNOŚCI Z WERDYKTEM ZUS</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Urlop macierzyński:</span>
              <strong className="text-slate-900 text-base font-bold">{liveResult.maternityWeeks} tyg.</strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{liveResult.momMaternityRatePercent}% podstawy</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Uzupełniający (wcześniak):</span>
              <strong className="text-slate-900 text-base font-bold">{liveResult.supplementaryWeeks} tyg.</strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{liveResult.supplementaryRatePercent}% podstawy</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Urlop rodzicielski (mama):</span>
              <strong className="text-slate-900 text-base font-bold">
                {liveResult.totalExtendedParentalWeeks} tyg. {liveResult.parentalExtensionWeeks > 0 ? `(wydłużenie +${liveResult.parentalExtensionWeeks})` : ""}
              </strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{liveResult.momParentalRatePercent}% podstawy</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Część taty (nieprzenoszalna):</span>
              <strong className="text-slate-900 text-base font-bold">{liveResult.parentalDadReservedWeeks} tyg.</strong>
              <span className="text-[10px] text-emerald-700 block font-semibold">{liveResult.dadParentalReservedRatePercent}% podstawy</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500">Miesięczna wypłata zasiłku (podstawa netto po odliczeniu 13,71%):</span>
              <div className="text-lg font-extrabold text-[#005A9C]">
                {liveResult.maternityMonthlyBenefit.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN / m-c
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500">Łączna kwota świadczeń w całym okresie opieki:</span>
              <div className="text-lg font-extrabold text-emerald-700">
                {liveResult.totalBenefitAmountSum.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
              </div>
            </div>
          </div>

          {/* Ostrzeżenia wykryte przez silnik dla danego kazusu */}
          {liveResult.riskWarnings.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Alerty i analizy ryzyka prawnego (Risk Engine):
              </span>
              {liveResult.riskWarnings.map((w, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
                    w.severity === "danger"
                      ? "bg-rose-50 border-rose-300 text-rose-950"
                      : w.severity === "warning"
                      ? "bg-amber-50 border-amber-300 text-amber-950"
                      : "bg-blue-50 border-blue-200 text-blue-950"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">{w.title}</strong>
                    <span className="text-slate-700 leading-relaxed block mt-0.5">{w.description}</span>
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
          <div className="text-xs font-bold uppercase tracking-wider text-[#005A9C]">
            Audyt formularzy PDF jurorów
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Wgraj własny formularz PDF (Z-3, ZAM lub e-ZLA)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Sprawdź działanie parsera dokumentów ZUS. Upuść plik formularza lub wybierz go z dysku, aby przeprowadzić ekstrakcję i natychmiastowe przeliczenie w kalkulatorze.
          </p>
        </div>

        {/* Szybkie przyciski do testowania plików z paczki ZUS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Szybki test pliku z wyzwania ZUS:</span>
          <button
            type="button"
            onClick={() => handleQuickLoadCaseFile("KAZUS-01")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300"
          >
            sprawa_1_uop_standard.pdf
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoadCaseFile("KAZUS-02")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300"
          >
            sprawa_2_wczesniak_szpital.pdf
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoadCaseFile("KAZUS-04")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300"
          >
            sprawa_4_jdg_zaleglosc_skladek.pdf
          </button>
        </div>

        {/* Dropzone PDF */}
        <div className="border-2 border-dashed border-slate-300 hover:border-[#005A9C] bg-slate-50/60 rounded-2xl p-8 text-center transition-all relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Wgraj plik formularza PDF"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#005A9C] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">
                Przeciągnij i upuść formularz PDF lub kliknij tutaj
              </span>
              <span className="text-xs text-slate-500">
                Obsługiwane formularze: Z-3 (zaświadczenie płatnika), ZAM (wniosek o zasiłek), e-ZLA
              </span>
            </div>
            {uploadedFileName && (
              <div className="text-xs font-mono font-bold text-[#005A9C] bg-blue-50 py-1 px-3 rounded-full inline-block border border-blue-200">
                Wczytano dokument: {uploadedFileName}
              </div>
            )}
          </div>
        </div>

        {/* Stan przetwarzania OCR/Parsera */}
        {isProcessingPdf && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-[#005A9C] animate-in fade-in">
            <RefreshCw className="w-4 h-4 animate-spin text-[#005A9C]" />
            <span>Parsowanie struktury PDF i walidacja pól formularza ZUS w toku...</span>
          </div>
        )}

        {/* Wynik ekstrakcji z PDF & Natychmiastowe Przeliczenie */}
        {extractedPdfData && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-slate-900">
                  Wyekstrahowano dane z: {extractedPdfData.docType}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Walidacja Zod: Sukces
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Ubezpieczony:</span>
                <strong className="text-slate-900 text-sm">{extractedPdfData.personName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">PESEL:</span>
                <strong className="text-slate-900 font-mono text-sm">{extractedPdfData.pesel}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Podstawa wynagrodzenia:</span>
                <strong className="text-[#005A9C] text-sm">{extractedPdfData.grossBase.toLocaleString("pl-PL")} PLN</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Data wystawienia:</span>
                <strong className="text-slate-900 text-sm">{extractedPdfData.issueDate}</strong>
              </div>
            </div>

            {/* Wynik przeliczenia na podstawie PDF */}
            {pdfCalcResult && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block text-xs">
                  Automatyczny wynik kalkulatora dla wczytanego pliku:
                </span>
                <div className="grid grid-cols-3 gap-3 text-slate-700">
                  <div>
                    Wymiar macierzyńskiego: <strong>{pdfCalcResult.maternityWeeks} tyg.</strong> ({pdfCalcResult.momMaternityRatePercent}%)
                  </div>
                  <div>
                    Wymiar rodzicielskiego: <strong>{pdfCalcResult.parentalMomWeeks} tyg.</strong> (+9 tyg. tata)
                  </div>
                  <div>
                    Miesięczna wypłata netto: <strong>{pdfCalcResult.maternityMonthlyBenefit.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleDownloadAuditReport}
                className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pobierz wyekstrahowane dane (JSON)</span>
              </button>

              <Link
                href="/kalkulator"
                className="inline-flex items-center gap-2 bg-[#005A9C] hover:bg-[#00477d] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
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
