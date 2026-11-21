"use client";

import React, { useState } from "react";
import {
  FileText,
  Smartphone,
  Building2,
  CheckCircle2,
  Send,
  RefreshCw,
  Clock,
  FileCheck,
  Info,
  AlertTriangle,
  Download,
  CreditCard,
  ShieldCheck,
  UserCheck,
  Printer,
} from "lucide-react";
import { calculateBenefits, DEFAULT_LEGISLATIVE_2026 } from "@hacknation/shared";

export default function EUslugiPage() {
  const [activeTab, setActiveTab] = useState<"zam" | "mobywatel" | "pue" | "ezla">("zam");

  // Stan logowania obywatela (mObywatel / Profil Zaufany)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Stan formularza ZAM
  const [parentName, setParentName] = useState<string>("Anna Kowalska");
  const [pesel, setPesel] = useState<string>("92041203456");
  const [contractType, setContractType] = useState<"employment" | "mandate" | "b2b">("employment");
  const [monthlySalaryGross, setMonthlySalaryGross] = useState<number>(6500);
  const [childName, setChildName] = useState<string>("Jan Kowalski");
  const [childBirthDate, setChildBirthDate] = useState<string>("2026-03-15");
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [chosenRate, setChosenRate] = useState<"815" | "100_70">("815");
  const [bankAccount, setBankAccount] = useState<string>("12 1020 1013 0000 1234 5678 9012");
  const [employerNip, setEmployerNip] = useState<string>("5260250995");

  // Dodatkowe uprawnienia w ZAM
  const [isPremature, setIsPremature] = useState<boolean>(false);
  const [hospitalDays, setHospitalDays] = useState<number>(14);
  const [hasLifeCert, setHasLifeCert] = useState<boolean>(false);

  // Stan symulacji wysyłki
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [upoNumber, setUpoNumber] = useState<string>("");
  const [submissionTimestamp, setSubmissionTimestamp] = useState<string>("");
  const [upoHash, setUpoHash] = useState<string>("");

  // Stan portfela PUE / Kontrola zadłużenia JDG
  const [jdgDebtAmount, setJdgDebtAmount] = useState<number>(0);
  const [isPayingDebt, setIsPayingDebt] = useState<boolean>(false);
  const [debtPaymentSuccess, setDebtPaymentSuccess] = useState<boolean>(false);

  // Wyliczenie na żywo z certyfikowanego silnika
  const liveCalculation = calculateBenefits({
    parentRole: "mother",
    contractType,
    monthlyBaseGross: monthlySalaryGross,
    childrenCount,
    hasLifeCertificate: hasLifeCert,
    submissionWithin21Days: chosenRate === "815",
    isPrematureOrHospitalized: isPremature,
    birthWeek: isPremature ? 31 : 39,
    birthWeightGrams: isPremature ? 1400 : 3400,
    hospitalDaysTotal: isPremature ? hospitalDays : 0,
    workPartTimeDuringParental: false,
  });

  const handleSimulateSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const dateStr = now.toISOString().replace("T", " ").substring(0, 19);
      const hash = `SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f${randomId}`;

      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setUpoNumber(`UPO-ZUS-2026-${randomId}`);
      setSubmissionTimestamp(dateStr);
      setUpoHash(hash);
    }, 1200);
  };

  const handlePayDebt = () => {
    setIsPayingDebt(true);
    setTimeout(() => {
      setIsPayingDebt(false);
      setJdgDebtAmount(0);
      setDebtPaymentSuccess(true);
      setTimeout(() => setDebtPaymentSuccess(false), 5000);
    }, 1000);
  };

  const handleDownloadZamJson = () => {
    const payload = {
      formType: "ZAM_2026",
      officialTitle: "Wniosek o zasiłek macierzyński (ZAM)",
      submissionDetails: {
        upoNumber: upoNumber || "PRZED_WYSLANIEM",
        submissionTimestamp: submissionTimestamp || new Date().toISOString(),
        sha256Hash: upoHash || "UNVERIFIED",
      },
      insuredPerson: {
        fullName: parentName,
        pesel,
        contractType,
        monthlySalaryGross,
        bankAccount,
      },
      childDetails: {
        fullName: childName,
        birthDate: childBirthDate,
        childrenCount,
        hasLifeCertificate: hasLifeCert,
        isPremature,
        hospitalDaysTotal: isPremature ? hospitalDays : 0,
      },
      employerDetails: {
        nip: employerNip,
      },
      requestedBenefit: {
        rateVariant: chosenRate === "815" ? "81.5% uśredniona w 21 dni" : "100% macierzyński + 70% rodzicielski",
        maternityWeeks: liveCalculation.maternityWeeks,
        supplementaryWeeks: liveCalculation.supplementaryWeeks,
        parentalMomWeeks: liveCalculation.parentalMomWeeks,
        parentalDadReservedWeeks: liveCalculation.parentalDadReservedWeeks,
        totalBenefitSumGrossPln: liveCalculation.totalBenefitAmountSum,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WNIOSEK_ZAM_${pesel}_2026.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintUpo = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#005A9C] font-semibold text-xs tracking-wider uppercase mb-1">
            <FileText className="w-4 h-4" />
            <span>Moduł 3 &bull; Symulator e-administracji publicznej</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Symulator e-usług & generator wniosku ZAM
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Zintegrowany panel usług publicznych: generator zunifikowanego wniosku o zasiłek macierzyński (ZAM), pulpit eZUS z kontrolą zadłużenia JDG, rejestr zwolnień e-ZLA i tożsamość w mObywatelu.
          </p>
        </div>

        {/* Status logowania i węzła państwowego */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-3 shrink-0">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="text-xs">
              <span className="font-bold text-emerald-900 block">Węzeł krajowy gov.pl</span>
              <span className="text-emerald-700">KSI ZUS &bull; Online</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
              isLoggedIn
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                : "bg-[#005A9C] hover:bg-[#00477d] text-white border-[#005A9C]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? "Zalogowano (Wyloguj)" : "Zaloguj się"}</span>
          </button>
        </div>
      </div>

      {/* Nawigacja Zakładkowa */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("zam")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "zam"
              ? "bg-[#005A9C] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Generator wniosku ZAM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mobywatel")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "mobywatel"
              ? "bg-[#005A9C] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>mObywatel (Tożsamość i alerty)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pue")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "pue"
              ? "bg-[#005A9C] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>PUE / eZUS (Konto ubezpieczonego & dług JDG)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ezla")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "ezla"
              ? "bg-[#005A9C] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>e-ZLA (Zwolnienia kod B w ciąży)</span>
        </button>
      </div>

      {/* ZAKŁADKA 1: Generator Wniosku ZAM */}
      {activeTab === "zam" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formularz wprowadzania danych wniosku */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#005A9C]" />
                  <span>Formularz ZAM: Wniosek o zasiłek macierzyński</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Zunifikowany formularz ZUS od 24 października 2026 r. (zastąpił dawne wnioski ZUR i ZAO).
                </p>
              </div>
              <span className="text-[10px] bg-blue-50 text-[#005A9C] border border-blue-200 px-2 py-1 rounded font-mono font-bold">
                Wzór 2026
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Imię i nazwisko wnioskodawcy:
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">PESEL:</label>
                  <input
                    type="text"
                    value={pesel}
                    onChange={(e) => setPesel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Forma zatrudnienia:
                  </label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as "employment" | "mandate" | "b2b")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  >
                    <option value="employment">Umowa o pracę (UoP)</option>
                    <option value="mandate">Umowa zlecenie</option>
                    <option value="b2b">Działalność gospodarcza (JDG)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Miesięczna podstawa brutto (PLN):
                  </label>
                  <input
                    type="number"
                    value={monthlySalaryGross}
                    onChange={(e) => setMonthlySalaryGross(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NIP Płatnika / Pracodawcy:
                  </label>
                  <input
                    type="text"
                    value={employerNip}
                    onChange={(e) => setEmployerNip(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Imię i nazwisko dziecka:
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Data urodzenia dziecka:
                  </label>
                  <input
                    type="date"
                    value={childBirthDate}
                    onChange={(e) => setChildBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Liczba dzieci:
                  </label>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                  >
                    <option value={1}>1 dziecko (20 tyg.)</option>
                    <option value={2}>2 dzieci (31 tyg.)</option>
                    <option value={3}>3 dzieci (33 tyg.)</option>
                    <option value={4}>4 dzieci (35 tyg.)</option>
                    <option value={5}>5+ dzieci (37 tyg.)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Numer rachunku bankowego do wypłaty świadczeń:
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
                />
              </div>

              {/* Dodatkowe okoliczności (wcześniak / Za życiem) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Okoliczności szczególne w porodzie:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremature}
                    onChange={(e) => setIsPremature(e.target.checked)}
                    className="rounded text-[#005A9C] focus:ring-[#005A9C]"
                  />
                  <span>Dziecko przedwcześnie urodzone lub hospitalizowane (art. 180² KP)</span>
                </label>
                {isPremature && (
                  <div className="pl-6 pt-1 flex items-center gap-2 text-slate-600">
                    <span>Liczba dni w szpitalu:</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={hospitalDays}
                      onChange={(e) => setHospitalDays(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                    />
                    <span className="text-[11px] text-emerald-700 font-bold">
                      +{Math.ceil(hospitalDays / 7)} tyg. uzupełniającego (100%)
                    </span>
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLifeCert}
                    onChange={(e) => setHasLifeCert(e.target.checked)}
                    className="rounded text-[#005A9C] focus:ring-[#005A9C]"
                  />
                  <span>Zaświadczenie z ustawy „Za życiem” (wydłużenie rodzicielskiego do 65/67 tyg.)</span>
                </label>
              </div>

              {/* Wybór wariantu stawki */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Wnioskowana stawka zasiłku (wybór wariantu):
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="rate"
                      checked={chosenRate === "815"}
                      onChange={() => setChosenRate("815")}
                      className="mt-0.5 text-[#005A9C] focus:ring-[#005A9C]"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">
                        Stawka uśredniona 81,5% (art. 30a ustawy zasiłkowej)
                      </span>
                      <span className="text-slate-500">
                        Wniosek składany w terminie 21 dni po porodzie na pełny okres macierzyńskiego i rodzicielskiego.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="rate"
                      checked={chosenRate === "100_70"}
                      onChange={() => setChosenRate("100_70")}
                      className="mt-0.5 text-[#005A9C] focus:ring-[#005A9C]"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">
                        Stawka standardowa: 100% (macierzyński) + 70% (rodzicielski)
                      </span>
                      <span className="text-slate-500">
                        Dla rodziców wnioskujących etapowo lub po upływie 21 dni.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSimulateSubmit}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#00477d] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Autoryzacja podpisem zaufanym w toku...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Podpisz Profilem Zaufanym i wyślij do ZUS</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadZamJson}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Pobierz wniosek (JSON)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Podgląd urzędowego dokumentu ZAM & UPO */}
          <div className="lg:col-span-6 space-y-4">
            {submissionSuccess && (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex flex-col gap-3 text-emerald-900 animate-in fade-in shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-emerald-950">
                      Wniosek ZAM został skutecznie przyjęty przez ZUS!
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Wygenerowano Urzędowe Poświadczenie Odbioru (UPO):{" "}
                      <strong className="font-mono text-emerald-950">{upoNumber}</strong>
                    </p>
                    <p className="text-[11px] text-emerald-700 font-mono">
                      Data i czas wpływu: {submissionTimestamp} &bull; {upoHash.substring(0, 32)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-emerald-200">
                  <button
                    type="button"
                    onClick={handlePrintUpo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Drukuj / Zapisz UPO</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadZamJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pobierz paczkę e-wniosku</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-sm font-sans space-y-4 relative">
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Formularz urzędowy ZUS
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">WNIOSEK ZAM</h3>
                  <p className="text-[10px] text-slate-600">
                    O zasiłek macierzyński za okres urlopu macierzyńskiego i urlopu rodzicielskiego
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-300 text-[10px] font-mono font-bold text-slate-800">
                    ZUS ZAM 2026
                  </span>
                </div>
              </div>

              {/* Dane Wnioskodawcy */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block text-[11px]">1. DANE WNIOSKODAWCY:</span>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-slate-700">
                    <div>Imię i nazwisko: <strong className="text-slate-900">{parentName}</strong></div>
                    <div>PESEL: <strong className="font-mono text-slate-900">{pesel}</strong></div>
                    <div>Forma zatrudnienia: <strong className="text-slate-900">{contractType.toUpperCase()}</strong></div>
                    <div>Podstawa brutto: <strong className="text-slate-900">{monthlySalaryGross.toLocaleString("pl-PL")} PLN</strong></div>
                    <div>NIP płatnika: <strong className="font-mono text-slate-900">{employerNip}</strong></div>
                    <div>Rachunek: <strong className="font-mono text-slate-900 text-[10px]">{bankAccount}</strong></div>
                  </div>
                </div>

                {/* Dane Dziecka */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block text-[11px]">2. DANE DZIECKA / DZIECI:</span>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-slate-700">
                    <div>Imię i nazwisko: <strong className="text-slate-900">{childName}</strong></div>
                    <div>Data urodzenia: <strong className="text-slate-900">{childBirthDate}</strong></div>
                    <div>Liczba dzieci przy porodzie: <strong className="text-slate-900">{childrenCount}</strong></div>
                    <div>Ustawa „Za życiem”: <strong className="text-slate-900">{hasLifeCert ? "TAK (art. 4 ust. 3)" : "NIE"}</strong></div>
                  </div>
                </div>

                {/* Przeliczenie przysługujących tygodni i kwot */}
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs space-y-2">
                  <span className="font-bold text-[#005A9C] block text-[11px] uppercase tracking-wider">
                    3. WYLICZONE UPRAWNIENIA ZASIŁKOWE (KSI ZUS):
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Urlop macierzyński:</span>
                      <strong className="text-slate-900 font-bold">{liveCalculation.maternityWeeks} tyg.</strong>
                      <span className="text-[10px] block text-emerald-700 font-semibold">{liveCalculation.momMaternityRatePercent}%</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">Uzupełniający (wcześniak):</span>
                      <strong className="text-slate-900 font-bold">{liveCalculation.supplementaryWeeks} tyg.</strong>
                      <span className="text-[10px] block text-emerald-700 font-semibold">100%</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">Urlop rodzicielski (mama):</span>
                      <strong className="text-slate-900 font-bold">{liveCalculation.parentalMomWeeks} tyg.</strong>
                      <span className="text-[10px] block text-emerald-700 font-semibold">{liveCalculation.momParentalRatePercent}%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600">Szacowana miesięczna wypłata (netto podst.):</span>
                    <strong className="text-base font-extrabold text-[#005A9C]">
                      {liveCalculation.maternityMonthlyBenefit.toLocaleString("pl-PL", { minimumFractionDigits: 2 })} PLN
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Podpis: Weryfikacja tożsamości Profilem Zaufanym</span>
                <span>Zgodność ze wzorem ZUS 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZAKŁADKA 2: mObywatel */}
      {activeTab === "mobywatel" && (
        <div className="gov-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
              mO
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Symulacja portfela mObywatel 2.0 & centrum powiadomień rodzica
              </h2>
              <p className="text-xs text-slate-500">
                Weryfikacja tożsamości obywatela, automatyczne alerty push o terminach ustawowych i rejestr spraw ZUS.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* mDowód */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>mDowód Osobisty</span>
                <span>Rzeczpospolita Polska</span>
              </div>
              <div className="pt-4">
                <div className="text-xs text-red-200">Właściciel dokumentu:</div>
                <div className="text-lg font-bold">{parentName}</div>
                <div className="text-xs font-mono mt-1 text-red-100">PESEL: {pesel}</div>
              </div>
              <div className="pt-2 text-[10px] text-red-200 border-t border-red-500/40 flex items-center justify-between">
                <span>Certyfikat cyfrowy: Ważny</span>
                <span>Status: Aktywny</span>
              </div>
            </div>

            {/* Powiadomienia Push */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aktywne alerty push ZUS w mObywatelu:
              </h4>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-rose-900 block">
                    Pilne: Pozostało 9 dni na złożenie wniosku ZAM (stawka 81,5%)!
                  </span>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Urodzenie dziecka zarejestrowano w USC. Złóż wniosek ZAM w terminie 21 dni po porodzie, aby zachować równą stawkę 81,5% przez cały okres macierzyńskiego i rodzicielskiego.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[#005A9C] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#005A9C] block">
                    Nowe zwolnienie lekarskie e-ZLA (kod literowy „B”)
                  </span>
                  <p className="text-xs text-slate-600">
                    Lekarz ginekolog wystawił zwolnienie lekarskie w okresie ciąży na 28 dni. Przysługuje 100% zasiłku chorobowego bez okresu wyczekiwania.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-900 block">
                    Przypomnienie dla taty: 9 nieprzenoszalnych tygodni rodzicielskiego
                  </span>
                  <p className="text-xs text-amber-800">
                    Zgodnie z Dyrektywą Work-Life Balance ojciec ma wyłączne prawo do 9 tygodni w stawce 70%. Urlop ten przepada, jeśli nie zostanie wykorzystany do końca roku 6. r.ż. dziecka.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZAKŁADKA 3: PUE / eZUS & Monitor Zadłużenia JDG */}
      {activeTab === "pue" && (
        <div className="gov-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pulpit ubezpieczonego w portalu eZUS / PUE ZUS
              </h2>
              <p className="text-xs text-slate-500">
                Historia składek, tytuły ubezpieczeniowe i kontrola zadłużenia płatnika w działalności gospodarczej.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-[#005A9C] font-semibold border border-blue-200">
              Konto zweryfikowane
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Tytuł do ubezpieczeń:</span>
              <div className="text-sm font-bold text-slate-900">
                {contractType === "b2b" ? "05 10 (Działalność gospodarcza)" : "01 10 (Umowa o pracę)"}
              </div>
              <div className="text-xs text-emerald-600 font-medium">
                Ubezpieczenie chorobowe: {contractType === "employment" ? "Obowiązkowe" : "Dobrowolne (Aktywne)"}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Średnia podstawa składek:</span>
              <div className="text-sm font-bold text-slate-900">
                {monthlySalaryGross.toLocaleString("pl-PL")} PLN
              </div>
              <div className="text-xs text-slate-500">Podstawa netto (po 13,71%): {liveCalculation.netBaseMonthly.toLocaleString("pl-PL")} PLN</div>
            </div>

            {/* Monitor Zadłużenia z progiem 48.06 zł */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross
                ? "bg-rose-50 border-rose-300"
                : "bg-emerald-50 border-emerald-300"
            }`}>
              <span className="text-xs text-slate-500">Stan rozliczeń składkowych (ZUS):</span>
              <div className={`text-sm font-bold ${
                jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross
                  ? "text-rose-700"
                  : "text-emerald-700"
              }`}>
                {jdgDebtAmount.toFixed(2)} PLN {jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross ? "(Zaległość!)" : "(Brak długu)"}
              </div>
              <div className="text-xs text-slate-600">
                Ustawowy próg blokujący: <strong>{DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross.toFixed(2)} PLN</strong>
              </div>
            </div>
          </div>

          {/* Symulacja Testu Zadłużenia JDG dla Jurora / Użytkownika */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Interaktywny symulator weryfikacji zadłużenia (Art. 2a ustawy zasiłkowej):
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Przełącz stan konta, aby sprawdzić jak system ZUS reaguje na zaległość składkową przekraczającą 1% minimalnej płacy ({DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross.toFixed(2)} zł).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setJdgDebtAmount(0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    jdgDebtAmount === 0
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Czyste konto (0 zł)
                </button>

                <button
                  type="button"
                  onClick={() => setJdgDebtAmount(250)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    jdgDebtAmount > 0
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Zadłużenie 250 zł
                </button>
              </div>
            </div>

            {jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross ? (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-rose-950 block">
                      Uwaga: Wypłata zasiłku macierzyńskiego została wstrzymana!
                    </strong>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Na dzień powstania prawa do zasiłku stwierdzono zaległość z tytułu składek w wysokości {jdgDebtAmount.toFixed(2)} zł, co przekracza 1% płacy minimalnej ({DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross.toFixed(2)} zł).
                      Zgodnie z art. 2a ustawy zasiłkowej, świadczenie nie jest wypłacane. Masz <strong>6 miesięcy</strong> na uregulowanie zadłużenia – spłata w tym terminie przywróci wypłatę zasiłku wstecz za cały okres. Po 6 miesiącach roszczenie przedawnia się!
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-rose-200">
                  <button
                    type="button"
                    onClick={handlePayDebt}
                    disabled={isPayingDebt}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition-colors"
                  >
                    {isPayingDebt ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <span>Opłać zaległość (Symulacja Paybynet / BLIK)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Stan rozliczeń prawidłowy. Brak zaległości blokujących wypłatę świadczeń macierzyńskich.</span>
              </div>
            )}

            {debtPaymentSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-400 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Zaległość została pomyślnie spłacona! Status konta: czysty. Zasiłek zostaje natychmiast odblokowany do wypłaty.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ZAKŁADKA 4: e-ZLA */}
      {activeTab === "ezla" && (
        <div className="gov-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rejestr elektronicznych zwolnień lekarskich e-ZLA
              </h2>
              <p className="text-xs text-slate-500">
                Zwolnienia lekarskie w okresie ciąży oznaczone kodem literowym „B” uprawniają do 100% zasiłku chorobowego przez okres do 270 dni.
              </p>
            </div>
            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 font-mono font-bold">
              Wykorzystano: 43 z 270 dni
            </div>
          </div>

          {/* Pasek postępu okresu zasiłkowego 270 dni */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Okres zasiłkowy w ciąży (kod B):</span>
              <span className="text-[#005A9C]">Pozostało: 227 dni (z 270 dni)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#005A9C] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(43 / 270) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500">
              * Wyjątek ciążowy: Jeśli kolejna niezdolność wystąpi w ciąży, okresów sprzed ciąży nie wlicza się do limitu 270 dni.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Seria i numer e-ZLA</th>
                  <th className="p-3">Okres niezdolności</th>
                  <th className="p-3">Kod literowy</th>
                  <th className="p-3">Wysokość zasiłku</th>
                  <th className="p-3">Płatnik świadczenia</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">ZLA/2026/08912</td>
                  <td className="p-3">01.02.2026 – 28.02.2026 (28 dni)</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                      Kod B (Ciąża)
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-700">100% podstawy</td>
                  <td className="p-3 text-slate-700">Pracodawca (pierwsze 33 dni w roku)</td>
                  <td className="p-3 text-emerald-600 font-semibold">Wypłacone</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">ZLA/2026/10450</td>
                  <td className="p-3">01.03.2026 – 15.03.2026 (15 dni)</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                      Kod B (Ciąża)
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-700">100% podstawy</td>
                  <td className="p-3 text-slate-700">
                    5 dni pracodawca (do limitu 33 dni) + 10 dni ZUS
                  </td>
                  <td className="p-3 text-blue-600 font-semibold">Przetwarzane przez ZUS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
