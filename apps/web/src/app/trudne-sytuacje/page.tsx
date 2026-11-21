"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
 HeartHandshake,
 Heart,
 Baby,
 ShieldAlert,
 Phone,
 AlertCircle,
 Calculator,
 CheckSquare,
 Square,
 FileText,
 Clock,
 ExternalLink,
} from "lucide-react";
import { calculateBenefits } from "@hacknation/shared";

export default function TrudneSytuacjePage() {
 const [activeTopic, setActiveTopic] = useState<"loss" | "preterm" | "zazyciem">("loss");

  // Stan kalkulatora hospitalizacji wcześniaka (art. 180² KP)
 const [pretermBirthWeek, setPretermBirthWeek] = useState<number>(27);
 const [pretermWeight, setPretermWeight] = useState<number>(950);
 const [pretermHospitalDays, setPretermHospitalDays] = useState<number>(70);
 const [pretermSalaryGross, setPretermSalaryGross] = useState<number>(6500);

  // Stan checklisty procedur po stracie
 const [checklistLoss, setChecklistLoss] = useState<{ [key: string]: boolean }>({
 step1_hospital: false,
 step2_card: false,
 step3_usc: false,
 step4_employer: false,
 step5_funeral: false,
  });

 const toggleChecklist = (key: string) => {
 setChecklistLoss((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Kalkulacja uprawnień wcześniaka w czasie rzeczywistym
 const pretermCalc = calculateBenefits({
 parentRole: "mother",
 contractType: "employment",
 monthlyBaseGross: pretermSalaryGross,
 childrenCount: 1,
 hasLifeCertificate: false,
 submissionWithin21Days: true,
 isPrematureOrHospitalized: true,
 birthWeek: pretermBirthWeek,
 birthWeightGrams: pretermWeight,
 hospitalDaysTotal: pretermHospitalDays,
 workPartTimeDuringParental: false,
  });

  // Kalkulacja świadczenia po stracie (8 tygodni = 56 dni w 100%)
 const lossNetMonthly = Math.round(pretermSalaryGross * 0.8629 * 100) / 100;
 const lossDaily = Math.round((lossNetMonthly / 30) * 100) / 100;
 const loss8WeeksAmount = Math.round(lossDaily * 56 * 100) / 100;

 return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
        <Link href="/">Strona główna</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">Sytuacje trudne i wsparcie</span>
      </nav>
      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dce1e5] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <span>Moduł 4 &bull; Empatyczne centrum wsparcia rodziców</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
 Wsparcie w sytuacjach trudnych i szczególnych
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
 Prawa rodzicielskie, świadczenia i procedury urzędowe w obliczu utraty dziecka, przedwczesnego porodu lub diagnozy ciężkiej choroby noworodka. Jesteśmy tu, by pomóc przejść przez formalności z empatią i zrozumieniem.
          </p>
        </div>

        {/* Całodobowa Infolinia Wsparcia */}
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded flex items-center gap-3 shrink-0">
          <Phone className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-rose-900 block">Infolinia Rzecznika Praw Pacjenta:</span>
            <span className="text-rose-700 font-bold text-sm">800 190 590</span>
            <span className="text-[10px] text-rose-600 block">Bezpłatna całodobowa pomoc psychologiczna</span>
          </div>
        </div>
      </div>

      {/* Wybór Tematu Pomocowego */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
 type="button"
 onClick={() => setActiveTopic("loss")}
 className={`p-5 rounded text-left border-2 transition-all flex flex-col justify-between gap-3 ${
 activeTopic === "loss"
              ? "border-rose-600 bg-rose-50/50 "
              : "border-[#dce1e5] hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded bg-rose-100 text-rose-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
 Art. 180¹ KP
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
 Poronienie lub martwe urodzenie
            </h3>
            <p className="text-xs text-slate-600 mt-1">
 8 tygodni urlopu macierzyńskiego (100% zasiłku), zasiłek pogrzebowy 7 000 zł i procedury krok po kroku.
            </p>
          </div>
        </button>

        <button
 type="button"
 onClick={() => setActiveTopic("preterm")}
 className={`p-5 rounded text-left border-2 transition-all flex flex-col justify-between gap-3 ${
 activeTopic === "preterm"
              ? "border-[#00416E] bg-blue-50/50 "
              : "border-[#dce1e5] hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded bg-blue-100 text-[#00416E] flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#00416E]">
 Art. 180² KP 2026
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
 Wcześniak lub hospitalizacja noworodka
            </h3>
            <p className="text-xs text-slate-600 mt-1">
 Kalkulator uzupełniającego urlopu (do 15 lub 8 tygodni w 100%) z regułą zaokrąglenia w górę.
            </p>
          </div>
        </button>

        <button
 type="button"
 onClick={() => setActiveTopic("zazyciem")}
 className={`p-5 rounded text-left border-2 transition-all flex flex-col justify-between gap-3 ${
 activeTopic === "zazyciem"
              ? "border-emerald-600 bg-emerald-50/50 "
              : "border-[#dce1e5] hover:border-slate-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
 Ustawa „Za życiem”
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
 Wady letalne i program „Za życiem”
            </h3>
            <p className="text-xs text-slate-600 mt-1">
 Wydłużenie urlopu rodzicielskiego do 65/67 tygodni, wsparcie hospicjów perinatalnych i 4 000 zł świadczenia.
            </p>
          </div>
        </button>
      </div>

      {/* TEMAT 1: Utrata Dziecka (Poronienie / Martwe Urodzenie) */}
      {activeTopic === "loss" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded border border-[#dce1e5] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edf0f2] pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span>Prawa i świadczenia po poronieniu lub martwym urodzeniu</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Świadczenia z Kodeksu pracy i ubezpieczenia społecznego przysługujące rodzicom po stracie ciąży.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded border border-rose-200 text-xs font-bold text-rose-800">
                <Clock className="w-4 h-4" />
                <span>Urlop macierzyński: 8 tygodni (56 dni)</span>
              </div>
            </div>

            {/* Karty Świadczeń */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f4f6f7] p-5 rounded border border-[#dce1e5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
 Urlop i zasiłek macierzyński (8 tygodni)
                  </span>
                  <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
 100% podstawy
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
 Matce przysługuje urlop macierzyński w wymiarze <strong>8 tygodni</strong> (56 dni) od dnia zdarzenia. Nie jest wymagany żaden okres wyczekiwania – świadczenie przysługuje od 1. dnia ubezpieczenia chorobowego.
                </p>
                <div className="p-2.5 bg-white rounded border border-[#dce1e5] text-xs flex justify-between items-center">
                  <span className="text-slate-600">Szacowana kwota zasiłku (dla 6 500 zł):</span>
                  <span className="font-bold text-slate-900 font-mono">{loss8WeeksAmount.toFixed(2)} zł</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-[#dce1e5]">
 Podstawa prawna: Art. 180¹ § 1 Kodeksu pracy
                </div>
              </div>

              <div className="bg-[#f4f6f7] p-5 rounded border border-[#dce1e5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00416E]">
 Zasiłek pogrzebowy w 2026 r.
                  </span>
                  <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
 7 000 zł
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
 W przypadku zorganizowania pochówku dziecka przysługuje jednorazowy zasiłek pogrzebowy w kwocie <strong>7 000 zł</strong>, bez względu na tydzień trwania ciąży, w którym nastąpiła strata.
                </p>
                <div className="p-2.5 bg-white rounded border border-[#dce1e5] text-xs flex justify-between items-center">
                  <span className="text-slate-600">Termin na złożenie wniosku:</span>
                  <span className="font-bold text-slate-900">Do 12 miesięcy od pogrzebu</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-[#dce1e5]">
 Wniosek Z-12 składany w Zakładzie Ubezpieczeń Społecznych
                </div>
              </div>
            </div>

            {/* Ważne: Procedura w razie braku możliwości ustalenia płci */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Procedura szpitalna w razie trudności z ustaleniem płci dziecka:</span>
              </div>
              <p className="leading-relaxed">
 W przypadku bardzo wczesnego poronienia, gdy lekarze nie są w stanie określić płci organoleptycznie, szpital nie może odmówić wystawienia dokumentów. Rodzice mają prawo do badań genetycznych (na własny wniosek) lub lekarz wystawia zaświadczenie o martwym urodzeniu. Na tej podstawie przysługuje pełne prawo do 8 tygodni urlopu macierzyńskiego oraz świadczenia.
              </p>
            </div>

            {/* Interaktywna Checklista Krok po Kroku */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00416E]" />
                <span>Ścieżka formalna krok po kroku (zaznacz załatwione etapy):</span>
              </h3>
              
              <div className="space-y-2 text-xs">
                <button
 type="button"
 onClick={() => toggleChecklist("step1_hospital")}
 className="w-full text-left p-3 rounded border border-[#dce1e5] bg-[#f4f6f7] hover:bg-slate-100 flex items-start gap-3 transition-colors"
                >
                  {checklistLoss.step1_hospital ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">Krok 1: Karta martwego urodzenia w szpitalu</span>
                    <span className="text-slate-600">Szpital wystawia kartę martwego urodzenia i przekazuje ją do Urzędu Stanu Cywilnego (USC) w terminie 1 dnia.</span>
                  </div>
                </button>

                <button
 type="button"
 onClick={() => toggleChecklist("step2_card")}
 className="w-full text-left p-3 rounded border border-[#dce1e5] bg-[#f4f6f7] hover:bg-slate-100 flex items-start gap-3 transition-colors"
                >
                  {checklistLoss.step2_card ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">Krok 2: Odpis aktu urodzenia z USC</span>
                    <span className="text-slate-600">USC rejestruje zdarzenie i wydaje odpis skrócony aktu urodzenia z adnotacją, że dziecko urodziło się martwe.</span>
                  </div>
                </button>

                <button
 type="button"
 onClick={() => toggleChecklist("step3_usc")}
 className="w-full text-left p-3 rounded border border-[#dce1e5] bg-[#f4f6f7] hover:bg-slate-100 flex items-start gap-3 transition-colors"
                >
                  {checklistLoss.step3_usc ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">Krok 3: Wniosek do pracodawcy / ZUS o 8 tygodni macierzyńskiego</span>
                    <span className="text-slate-600">Złożenie wniosku o urlop macierzyński wraz z odpisem aktu urodzenia (lub zaświadczeniem lekarskim). Pracodawca nie może odmówić.</span>
                  </div>
                </button>

                <button
 type="button"
 onClick={() => toggleChecklist("step4_employer")}
 className="w-full text-left p-3 rounded border border-[#dce1e5] bg-[#f4f6f7] hover:bg-slate-100 flex items-start gap-3 transition-colors"
                >
                  {checklistLoss.step4_employer ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">Krok 4: Wniosek o zasiłek pogrzebowy (Z-12) do ZUS</span>
                    <span className="text-slate-600">W razie zorganizowania pochówku, złożenie formularza Z-12 w ZUS wraz z rachunkami za pogrzeb. Wypłata następuje w 30 dni.</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMAT 2: Wcześniactwo i Hospitalizacja (Art. 180² KP 2026) */}
      {activeTopic === "preterm" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded border border-[#dce1e5] space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Baby className="w-5 h-5 text-[#00416E]" />
                <span>Uzupełniający urlop macierzyński dla rodziców wcześniaków (art. 180² KP)</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
 Nowe prawo 2026 chroni rodziców: czas spędzony w szpitalu nie pomniejsza urlopu macierzyńskiego po powrocie do domu.
              </p>
            </div>

            {/* Interaktywny Kalkulator Uzupełniającego Urlopu */}
            <div className="bg-[#f4f6f7] p-6 rounded border border-[#dce1e5] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-[#dce1e5] pb-2">
                <Calculator className="w-4 h-4 text-[#00416E]" />
                <span>Kalkulator uprawnień uzupełniającego urlopu macierzyńskiego</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Tydzień ciąży w chwili porodu:</label>
                  <input
 type="number"
 min="20"
 max="42"
 value={pretermBirthWeek}
 onChange={(e) => setPretermBirthWeek(Number(e.target.value))}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500">&lt;28 tyg. = do 15 tyg. urlopu</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Masa urodzeniowa (gramy):</label>
                  <input
 type="number"
 min="400"
 max="5000"
 step="50"
 value={pretermWeight}
 onChange={(e) => setPretermWeight(Number(e.target.value))}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500">&le;1000g = kategoria skrajna</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Łączna liczba dni w szpitalu:</label>
                  <input
 type="number"
 min="1"
 max="150"
 value={pretermHospitalDays}
 onChange={(e) => setPretermHospitalDays(Number(e.target.value))}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500">Zaokrąglane w górę (ceil)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Wynagrodzenie brutto (PLN):</label>
                  <input
 type="number"
 min="4806"
 step="500"
 value={pretermSalaryGross}
 onChange={(e) => setPretermSalaryGross(Number(e.target.value))}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500">Podstawa kalkulacji 100%</span>
                </div>
              </div>

              {/* Wynik Kalkulatora */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
 Przyznany wymiar uzupełniającego urlopu:
                  </span>
                  <div className="text-2xl font-bold text-[#00416E]">
                    {pretermCalc.supplementaryWeeks} tygodni ({pretermCalc.supplementaryWeeks * 7} dni) w 100% płatne
                  </div>
                  <span className="text-xs text-blue-700">
                    Łączny czas opieki z macierzyńskim i rodzicielskim:{" "}
                    <strong>{pretermCalc.maternityWeeks + pretermCalc.supplementaryWeeks + pretermCalc.parentalMomWeeks} tygodni</strong>
                  </span>
                </div>

                <div className="text-right sm:border-l sm:border-blue-200 sm:pl-6">
                  <span className="text-xs text-slate-600 block">Wypłata za okres uzupełniający:</span>
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {pretermCalc.supplementaryMonthlyBenefit > 0
                      ? `${(pretermCalc.dailyBaseAmount * pretermCalc.supplementaryWeeks * 7).toFixed(2)} zł`
                      : "0.00 zł"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabela Zasad Prawnych */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#f4f6f7] rounded border border-[#dce1e5] space-y-2">
                <span className="font-bold text-slate-900 block">Skrajne wcześniaki (do 15 tygodni):</span>
                <p className="text-slate-600 leading-relaxed">
 Dzieci urodzone przed 28. tygodniem ciąży LUB o masie do 1000 g. Przysługuje 1 tydzień urlopu za każdy tydzień hospitalizacji do upływu 15. tygodnia po porodzie.
                </p>
              </div>

              <div className="p-4 bg-[#f4f6f7] rounded border border-[#dce1e5] space-y-2">
                <span className="font-bold text-slate-900 block">Wcześniaki średnie i hospitalizowane (do 8 tygodni):</span>
                <p className="text-slate-600 leading-relaxed">
 Urodzone między 28. a 37. tygodniem (waga &gt;1000g) LUB po 37. tygodniu z min. 2 kolejnymi dniami hospitalizacji w oknie 5–28 dni.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMAT 3: Ustawa „Za życiem” */}
      {activeTopic === "zazyciem" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded border border-[#dce1e5] space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-700" />
                <span>Kompleksowe uprawnienia z ustawy „Za życiem”</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
 Wsparcie rodzin z dziećmi, u których zdiagnozowano ciężkie i nieodwracalne upośledzenie albo chorobę zagrażającą życiu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50/60 p-5 rounded border border-emerald-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
 Urlop rodzicielski do 65/67 tyg.
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
 Wydłużenie urlopu rodzicielskiego z 41 do <strong>65 tygodni</strong> (1 dziecko) lub do <strong>67 tygodni</strong> (poród mnogi).
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-emerald-200">
 56 tyg. dla mamy + 9 tyg. dla taty
                </div>
              </div>

              <div className="bg-[#f4f6f7] p-5 rounded border border-[#dce1e5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00416E] block">
 Jednorazowe świadczenie 4 000 zł
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
 Wypłacane bez kryterium dochodowego na wniosek złożony w MOPS/GOPS w ciągu 12 miesięcy od narodzin.
                </p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-[#dce1e5]">
 Wymaga zaświadczenia od ginekologa/neonatologa
                </div>
              </div>

              <div className="bg-[#f4f6f7] p-5 rounded border border-[#dce1e5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
 Hospicja perinatalne
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
 Bezpłatna opieka lekarzy, psychologów i położnych od momentu diagnozy prenatalnej.
                </p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-[#dce1e5]">
 Finansowane w 100% ze środków publicznych
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ważne kontakty i organizacje pomocowe */}
      <div className="bg-slate-900 text-white rounded p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>Zweryfikowane instytucje i organizacje pomocowe</span>
        </h3>
        <p className="text-xs text-slate-400">
 Nie musisz być z tym sam. Skontaktuj się z doświadczonymi psychologami i doradcami prawnymi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800 p-4 rounded border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">Fundacja Wcześniak</span>
            <p className="text-slate-400">Wypożyczalnie sprzętu, wsparcie prawne i medyczne dla rodziców.</p>
            <a
 href="https://wczesniak.pl"
 target="_blank"
 rel="noreferrer"
 className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 pt-1"
            >
              <span>wczesniak.pl</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-800 p-4 rounded border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">Fundacja Ernesta</span>
            <p className="text-slate-400">Bezpłatne konsultacje psychologiczne i prawne po stracie ciąży.</p>
            <a
 href="https://fundacjaernesta.pl"
 target="_blank"
 rel="noreferrer"
 className="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1 pt-1"
            >
              <span>fundacjaernesta.pl</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-800 p-4 rounded border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">Fundacja Gajusz (Hospicjum Perinatalne)</span>
            <p className="text-slate-400">Kompleksowe wsparcie dla rodzin oczekujących ciężko chorego dziecka.</p>
            <a
 href="https://gajusz.org.pl"
 target="_blank"
 rel="noreferrer"
 className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 pt-1"
            >
              <span>gajusz.org.pl</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
