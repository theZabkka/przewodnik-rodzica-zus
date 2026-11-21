"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
  Info,
  RotateCcw,
  Building2,
  Hospital,
  Briefcase,
  FileText,
  Download,
} from "lucide-react";

interface Milestone {
  id: string;
  stage: 1 | 2 | 3 | 4;
  institution: "hospital" | "usc" | "employer" | "zus";
  title: string;
  description: string;
  deadlineDescription: string;
  daysFromBirth?: number;
  legalReference: string;
  category: "formal" | "benefit" | "health" | "work";
  roles: ("mother" | "father" | "preterm" | "jdg")[];
}

const MILESTONES: Milestone[] = [
  // Etap 1: Planowanie i ciąża
  {
    id: "m1",
    stage: 1,
    institution: "hospital",
    title: "Zwolnienie lekarskie e-ZLA z kodem B (ciąża)",
    description: "Zwolnienie lekarskie w okresie ciąży jest płatne w wysokości 100% podstawy wymiaru i przysługuje przez maksymalnie 270 dni bez przerwy.",
    deadlineDescription: "Wystawiane elektronicznie przez lekarza prowadzącego ciążę",
    legalReference: "Art. 11 ust. 2 pkt 1 ustawy zasiłkowej",
    category: "health",
    roles: ["mother"],
  },
  {
    id: "m2",
    stage: 1,
    institution: "employer",
    title: "Opcjonalne rozpoczęcie macierzyńskiego przed porodem",
    description: "Pracownica może złożyć wniosek do pracodawcy o wykorzystanie do 6 tygodni urlopu macierzyńskiego przed przewidywaną datą porodu.",
    deadlineDescription: "Maksymalnie 6 tygodni przed spodziewanym terminem porodu",
    legalReference: "Art. 180 § 2 Kodeksu pracy",
    category: "benefit",
    roles: ["mother"],
  },
  {
    id: "m3",
    stage: 1,
    institution: "zus",
    title: "Weryfikacja terminowości składek i długu w JDG",
    description: "Przedsiębiorca musi upewnić się, że nie posiada zaległości składkowych przekraczających 48,06 zł (1% minimalnego wynagrodzenia) oraz że upłynął 90-dniowy okres karencji ubezpieczenia chorobowego.",
    deadlineDescription: "Przed przejściem na zasiłek lub urlop",
    legalReference: "Art. 2a ustawy zasiłkowej (próg zadłużenia)",
    category: "formal",
    roles: ["jdg"],
  },

  // Etap 2: Narodziny i formalności natychmiastowe
  {
    id: "m4",
    stage: 2,
    institution: "hospital",
    title: "Karta urodzenia ze szpitala do USC",
    description: "Szpital przekazuje kartę urodzenia noworodka do urzędu stanu cywilnego w terminie do 3 dni od dnia porodu.",
    deadlineDescription: "Szpital wysyła automatycznie w ciągu 3 dni",
    daysFromBirth: 3,
    legalReference: "Ustawa Prawo o aktach stanu cywilnego",
    category: "health",
    roles: ["mother", "father"],
  },
  {
    id: "m5",
    stage: 2,
    institution: "usc",
    title: "Zgłoszenie narodzin w USC i akt urodzenia",
    description: "Zgłoś urodzenie dziecka w USC (online przez gov.pl lub stacjonarnie). Otrzymasz odpis aktu urodzenia i numer PESEL dziecka, niezbędne do wniosku ZAM.",
    deadlineDescription: "W terminie 21 dni od sporządzenia karty przez szpital",
    daysFromBirth: 21,
    legalReference: "Art. 138 Kodeksu rodzinnego i opiekuńczego",
    category: "formal",
    roles: ["mother", "father"],
  },
  {
    id: "m6",
    stage: 2,
    institution: "zus",
    title: "Kluczowy termin 21 dni: Złożenie wniosku ZAM o stawkę 81,5%",
    description: "Wniosek o zasiłek macierzyński za okres urlopu macierzyńskiego i rodzicielskiego złożony w 21 dni po porodzie gwarantuje uśrednioną stawkę 81,5% przez cały rok.",
    deadlineDescription: "Dokładnie 21 dni od dnia porodu (termin zawity)",
    daysFromBirth: 21,
    legalReference: "Art. 30a ustawy zasiłkowej",
    category: "benefit",
    roles: ["mother"],
  },
  {
    id: "m7",
    stage: 2,
    institution: "hospital",
    title: "Zaświadczenie o hospitalizacji wcześniaka (art. 180² KP)",
    description: "W przypadku porodu przedwczesnego lub pobytu noworodka w szpitalu, pobierz zaświadczenie ze szpitala potwierdzające okres hospitalizacji, aby ubiegać się o dodatkowy urlop 100%.",
    deadlineDescription: "Wystawiane przy wypisie dziecka ze szpitala",
    legalReference: "Art. 180² Kodeksu pracy 2026",
    category: "health",
    roles: ["preterm", "mother"],
  },

  // Etap 3: Urlopy macierzyński i rodzicielski
  {
    id: "m8",
    stage: 3,
    institution: "employer",
    title: "Urlop macierzyński: 20 tygodni (podział 14 + 6)",
    description: "Matka dziecka korzysta z pierwszych 14 tygodni macierzyńskiego. Po 14 tygodniach może powrócić do pracy, przekazując pozostałe 6 tygodni ubezpieczonemu ojcu.",
    deadlineDescription: "Wniosek do pracodawcy min. 7 dni przed planowanym powrotem",
    daysFromBirth: 140,
    legalReference: "Art. 180 § 4 Kodeksu pracy",
    category: "benefit",
    roles: ["mother", "father"],
  },
  {
    id: "m9",
    stage: 3,
    institution: "employer",
    title: "Urlop rodzicielski (41 tyg.) i 9 tygodni nieprzenoszalnych dla taty",
    description: "Każdy z rodziców ma wyłączne prawo do 9 tygodni urlopu rodzicielskiego w stawce 70%. Ta część nie może zostać przeniesiona na drugiego rodzica.",
    deadlineDescription: "Do końca roku kalendarzowego, w którym dziecko kończy 6 lat",
    legalReference: "Art. 182¹ᵃ Kodeksu pracy (Dyrektywa WLB)",
    category: "benefit",
    roles: ["mother", "father"],
  },

  // Etap 4: Powrót do pracy i uprawnienia ojca
  {
    id: "m10",
    stage: 4,
    institution: "employer",
    title: "Wniosek o łączenie rodzicielskiego z pracą na max 1/2 etatu",
    description: "Pracownik może łączyć urlop z pracą u macierzystego pracodawcy na część etatu (max 0.5). Urlop ulega proporcjonalnemu wydłużeniu, a 100% puli świadczenia jest zachowane.",
    deadlineDescription: "Wniosek składany pracodawcy min. 21 dni przed rozpoczęciem pracy",
    legalReference: "Art. 182¹ᶠ Kodeksu pracy",
    category: "work",
    roles: ["mother", "father"],
  },
  {
    id: "m11",
    stage: 4,
    institution: "employer",
    title: "Urlop ojcowski: 14 dni kalendarzowych w stawce 100%",
    description: "Ojciec dziecka składa wniosek o 14 dni urlopu ojcowskiego (w całości lub 2 częściach). Przysługuje 100% zasiłku.",
    deadlineDescription: "Wniosek min. 7 dni przed; wykorzystanie do 12. miesiąca życia dziecka",
    daysFromBirth: 365,
    legalReference: "Art. 182³ Kodeksu pracy",
    category: "benefit",
    roles: ["father"],
  },
  {
    id: "m12",
    stage: 4,
    institution: "zus",
    title: "Zasiłek opiekuńczy na chore dziecko (art. 32 ustawy)",
    description: "Po powrocie do pracy przysługuje do 60 dni w roku kalendarzowym płatnego zasiłku opiekuńczego (80%) na opiekę nad chorym dzieckiem do 14 roku życia.",
    deadlineDescription: "Na podstawie zwolnienia lekarskiego e-ZLA na dziecko",
    legalReference: "Art. 32-35 ustawy zasiłkowej",
    category: "benefit",
    roles: ["mother", "father"],
  },
];

export default function PrzewodnikPage() {
  const [selectedStage, setSelectedStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [institutionFilter, setInstitutionFilter] = useState<"all" | "hospital" | "usc" | "employer" | "zus">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "mother" | "father" | "preterm" | "jdg">("all");
  const [birthDate, setBirthDate] = useState<string>("2026-04-01");
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    m1: true,
  });

  // Obliczenia terminów na podstawie daty porodu
  const calculatedDates = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;

    const addDays = (d: Date, days: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy.toISOString().split("T")[0];
    };

    const deadline21 = addDays(birth, 21);
    const endMaternity20 = addDays(birth, 140);
    const endParentalTotal = addDays(birth, 140 + 287); // 20 + 41 tyg
    const endPaternity12M = addDays(birth, 365);
    const limitAge6 = `${birth.getFullYear() + 6}-12-31`;

    // Licznik dni pozostałych od dzisiaj
    const today = new Date();
    const deadline21Date = new Date(deadline21);
    const diffDays21 = Math.ceil((deadline21Date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      deadline21Days: deadline21,
      endMaternity20Weeks: endMaternity20,
      endParentalTotal,
      endPaternity12Months: endPaternity12M,
      limitAge6Years: limitAge6,
      daysRemainingTo21: diffDays21,
    };
  }, [birthDate]);

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((m) => {
      if (selectedStage !== 0 && m.stage !== selectedStage) return false;
      if (institutionFilter !== "all" && m.institution !== institutionFilter) return false;
      if (roleFilter !== "all" && !m.roles.includes(roleFilter)) return false;
      return true;
    });
  }, [selectedStage, institutionFilter, roleFilter]);

  const progressPct = useMemo(() => {
    const total = MILESTONES.length;
    const completed = Object.values(completedItems).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  }, [completedItems]);

  const handleDownloadChecklist = () => {
    const lines = [
      "========================================================================",
      "ZASIŁKOWY PRZEWODNIK PRZYSZŁEGO RODZICA - TWOJA CHECKLISTA ZADAŃ",
      `Data porodu: ${birthDate}`,
      `Ostateczny termin na wniosek ZAM (81,5%): ${calculatedDates?.deadline21Days || "-"}`,
      `Termin na urlop ojcowski (14 dni): ${calculatedDates?.endPaternity12Months || "-"}`,
      "========================================================================",
      "",
      ...MILESTONES.map((m, idx) => {
        const isDone = completedItems[m.id] ? "[X]" : "[ ]";
        const instLabel =
          m.institution === "hospital"
            ? "Szpital"
            : m.institution === "usc"
            ? "USC"
            : m.institution === "employer"
            ? "Pracodawca"
            : "ZUS";
        return `${isDone} ${idx + 1}. [${instLabel}] ${m.title}\n    Termin: ${m.deadlineDescription}\n    Podstawa: ${m.legalReference}\n`;
      }),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Checklista-Rodzica-${birthDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 w-full">
      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#00823C] font-semibold text-xs tracking-wider uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>Plan formalności i uprawnień rodzica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Co przysługuje Ci krok po kroku
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Spokojny przewodnik przez 4 etapy: od ciąży i przygotowań, przez poród i kluczowy termin 21 dni, po urlop dla taty i powrót do pracy.
          </p>
        </div>

        {/* Pasek postępu checklisty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Twój postęp checklisty:</span>
            <span className="text-[#005A9C] font-bold">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#005A9C] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Zrobiono {Object.values(completedItems).filter(Boolean).length} z {MILESTONES.length}
            </span>
            <button
              type="button"
              onClick={handleDownloadChecklist}
              className="text-[#005A9C] font-semibold hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Pobierz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kalkulator Kluczowych Dat i Terminów Urzędowych */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#005A9C] font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>Personalizuj harmonogram wg daty porodu:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Wprowadź przewidywaną lub rzeczywistą datę porodu, a system automatycznie przeliczy nieprzekraczalne terminy składania wniosków i długość urlopów.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="birth-date-input" className="text-xs font-bold text-slate-700">
              Data porodu:
            </label>
            <input
              id="birth-date-input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
            />
          </div>
        </div>

        {/* Dynamicznie wyliczone daty */}
        {calculatedDates && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-blue-200/80">
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs space-y-1">
              <div className="text-[11px] font-semibold text-rose-600 uppercase flex items-center justify-between">
                <span>Termin 21 dni (ZAM 81,5%):</span>
                {calculatedDates.daysRemainingTo21 > 0 && (
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                    Zostało {calculatedDates.daysRemainingTo21} dni
                  </span>
                )}
              </div>
              <div className="text-base font-bold text-slate-900">
                {calculatedDates.deadline21Days}
              </div>
              <div className="text-[11px] text-slate-500">
                Ostateczny dzień na złożenie wniosku o 81,5%
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs space-y-1">
              <div className="text-[11px] font-semibold text-[#005A9C] uppercase">
                Koniec macierzyńskiego (20 tyg):
              </div>
              <div className="text-base font-bold text-slate-900">
                {calculatedDates.endMaternity20Weeks}
              </div>
              <div className="text-[11px] text-slate-500">
                Początek urlopu rodzicielskiego
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs space-y-1">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase">
                Koniec rodzicielskiego:
              </div>
              <div className="text-base font-bold text-slate-900">
                {calculatedDates.endParentalTotal}
              </div>
              <div className="text-[11px] text-slate-500">
                Łącznie 61 tygodni opieki rodzicielskiej
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs space-y-1">
              <div className="text-[11px] font-semibold text-amber-700 uppercase">
                Urlop ojcowski (14 dni):
              </div>
              <div className="text-base font-bold text-slate-900">
                Do {calculatedDates.endPaternity12Months}
              </div>
              <div className="text-[11px] text-slate-500">
                Do 1. urodzin dziecka (100% zasiłku)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pasek Filtrów: Etapy, Instytucje i Rola */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Przyciski Etapów */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedStage(0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStage === 0
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Wszystkie etapy
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStage === 1
                  ? "bg-[#005A9C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Etap 1: Ciąża
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStage === 2
                  ? "bg-[#005A9C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Etap 2: Narodziny (21 dni)
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage(3)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStage === 3
                  ? "bg-[#005A9C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Etap 3: Urlopy
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage(4)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStage === 4
                  ? "bg-[#005A9C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Etap 4: Powrót do pracy
            </button>
          </div>

          {/* Filtry Instytucji i Roli */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtr Instytucji */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1">
              <span className="text-[11px] text-slate-500 font-semibold">Gdzie:</span>
              <select
                value={institutionFilter}
                onChange={(e) => setInstitutionFilter(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">Wszystkie instytucje</option>
                <option value="hospital">Szpital</option>
                <option value="usc">Urząd Stanu Cywilnego (USC)</option>
                <option value="employer">Pracodawca</option>
                <option value="zus">Zakład Ubezpieczeń Społecznych (ZUS)</option>
              </select>
            </div>

            {/* Filtr Roli */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1">
              <Filter className="w-3 h-3 text-slate-500" />
              <span className="text-[11px] text-slate-500 font-semibold">Dla kogo:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">Wszyscy</option>
                <option value="mother">Matka</option>
                <option value="father">Ojciec</option>
                <option value="preterm">Rodzic wcześniaka</option>
                <option value="jdg">Przedsiębiorca (JDG)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista Zadań Osi Czasu z Podziałem na Instytucje */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Brak zadań dla wybranych filtrów
            </h3>
            <p className="text-xs text-slate-500">
              Zmień filtr etapu, instytucji lub roli, aby wyświetlić zadania.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedStage(0);
                setInstitutionFilter("all");
                setRoleFilter("all");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#005A9C] font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetuj filtry</span>
            </button>
          </div>
        ) : (
          filteredMilestones.map((item) => {
            const isDone = Boolean(completedItems[item.id]);

            const instBadge =
              item.institution === "hospital" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <Hospital className="w-3 h-3" />
                  <span>Szpital</span>
                </span>
              ) : item.institution === "usc" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Building2 className="w-3 h-3" />
                  <span>Urząd Stanu Cywilnego</span>
                </span>
              ) : item.institution === "employer" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  <Briefcase className="w-3 h-3" />
                  <span>Pracodawca</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <FileText className="w-3 h-3" />
                  <span>ZUS</span>
                </span>
              );

            return (
              <div
                key={item.id}
                className={`gov-card p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isDone ? "bg-slate-50/80 border-slate-200 opacity-80" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Checkbox akcji */}
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 focus:outline-none ${
                      isDone
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 hover:border-[#005A9C] bg-white text-transparent"
                    }`}
                    aria-label={`Oznacz zadanie ${item.title} jako zrealizowane`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Etap {item.stage}
                      </span>
                      {instBadge}
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.legalReference}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold text-slate-900 ${
                        isDone ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.deadlineDescription}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href="/kalkulator"
                    className="inline-flex items-center gap-1.5 text-xs text-[#005A9C] font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 transition-colors"
                  >
                    <span>Przelicz w kalkulatorze</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Baner Przejścia do Kalkulatora */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">
            Poznaj dokładną wysokość swoich świadczeń
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Skorzystaj z certyfikowanego silnika kalkulacyjnego, aby poznać miesięczne kwoty wypłat i zoptymalizować budżet rodziny.
          </p>
        </div>
        <Link
          href="/kalkulator"
          className="inline-flex items-center gap-2 bg-[#005A9C] hover:bg-[#00477d] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <span>Otwórz kalkulator zasiłków</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
