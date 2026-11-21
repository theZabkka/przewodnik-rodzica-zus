"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Building2,
  TrendingUp,
  Sliders,
  Scale,
  Sparkles,
  LogOut,
  Calendar,
  Layers,
} from "lucide-react";
import { ZusLogo } from "@/components/ZusLogo";
import {
  InspectorCase,
  generateAdministrativeDecision,
  generateZ3Certificate,
  calculateWorkSharingSchedule,
} from "@hacknation/shared";

// Domyślne kazusy operacyjne ZUS (reprezentujące wszystkie profile ryzyk prawnych)
const INITIAL_ZUS_CASES: InspectorCase[] = [
  {
    id: "case-zus-001",
    caseNumber: "ZUS/2026/ZAM/04912",
    submissionDate: "2026-11-20",
    applicantName: "Anna Kowalska",
    pesel: "92041203456",
    email: "anna.kowalska@example.com",
    phone: "601 234 567",
    bankAccountNumber: "12 1020 1013 0000 1234 5678 9012",
    benefitType: "MATERNITY_PARENTAL_UNIFIED",
    contractType: "employment",
    monthlySalaryGross: 6500,
    childBirthDate: "2026-11-16",
    daysSinceBirth: 4,
    isPremature: false,
    employerNip: "5260250995",
    employerName: "TechCorp Poland Sp. z o.o.",
    isEmployerOver20: true,
    hasDebt: false,
    insuranceTenureDays: 480,
    riskLevel: "GREEN",
    riskCategory: "FAST_TRACK",
    riskReasons: [
      "Wniosek złożony w 4. dniu po porodzie (termin ustawowy do 21 dni zachowany).",
      "Elektroniczne zwolnienie lekarskie e-ZLA z kodem „B” w rejestrze ZUS.",
      "Płatnik opłaca składki terminowo, brak zadłużenia.",
      "Zakwalifikowano do procedury Fast-Track (autozgoda 81,5%).",
    ],
    suggestedDecision: "AUTO_APPROVE_81_5",
    status: "NEW",
    upoHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f4912",
  },
  {
    id: "case-zus-002",
    caseNumber: "ZUS/2026/ZAM/04915",
    submissionDate: "2026-11-19",
    applicantName: "Monika Lewandowska",
    pesel: "94082205678",
    email: "monika.lewandowska@example.com",
    phone: "502 987 654",
    bankAccountNumber: "88 1140 2004 0000 3402 1234 5678",
    benefitType: "MATERNITY_PARENTAL_UNIFIED",
    contractType: "employment",
    monthlySalaryGross: 7200,
    childBirthDate: "2026-10-25",
    daysSinceBirth: 26,
    isPremature: true,
    birthWeek: 31,
    hospitalDays: 32,
    employerNip: "7010456123",
    employerName: "Medica Logistyka S.A.",
    isEmployerOver20: true,
    hasDebt: false,
    insuranceTenureDays: 720,
    riskLevel: "YELLOW",
    riskCategory: "PREMATURE_AUDIT",
    riskReasons: [
      "Noworodek przedwcześnie urodzony (31. tc) z hospitalizacją 32 dni.",
      "Zgodnie z art. 180² Kodeksu pracy przysługuje uzupełniający urlop macierzyński płatny 100% (do 8 tygodni).",
      "Wymagane załączenie i weryfikacja karty informacyjnej ze szpitala (KOC/OION).",
    ],
    suggestedDecision: "AUDIT_HOSPITAL_DOCS",
    status: "IN_REVIEW",
    upoHash: "SHA256:91ac3b726dd04f41b31278148a1d65dfc2d4b1f4915",
  },
  {
    id: "case-zus-003",
    caseNumber: "ZUS/2026/ZAM/04918",
    submissionDate: "2026-11-18",
    applicantName: "Piotr Wiśniewski",
    pesel: "89110507890",
    email: "kontakt@wisniewski-it.pl",
    phone: "690 112 233",
    bankAccountNumber: "44 1050 1445 1000 0090 1234 5678",
    benefitType: "MATERNITY_STANDARD",
    contractType: "b2b",
    monthlySalaryGross: 11000,
    childBirthDate: "2026-11-10",
    daysSinceBirth: 10,
    isPremature: false,
    employerNip: "5272891234",
    employerName: "Wiśniewski Usługi IT (JDG)",
    isEmployerOver20: false,
    hasDebt: true,
    debtAmount: 350.0,
    insuranceTenureDays: 400,
    riskLevel: "RED",
    riskCategory: "JDG_DEBT_BLOCK",
    riskReasons: [
      "Zadłużenie na indywidualnym koncie składkowym (NRS) w kwocie 350,00 zł.",
      "Przekroczenie ustawowego progu 1% płacy minimalnej (48,06 zł w 2026 r.).",
      "Zgodnie z art. 2a ustawy zasiłkowej wypłata świadczenia zostaje wstrzymana z mocy prawa.",
      "Płatnikowi przysługuje 6 miesięcy na spłatę z prawem do wyrównania wstecz.",
    ],
    suggestedDecision: "BLOCK_PAYOUT_DEBT",
    status: "BLOCKED",
    upoHash: "SHA256:4ca2b1657ff1fc53b92dc18148a1d65dfc2d4b1f4918",
  },
  {
    id: "case-zus-004",
    caseNumber: "ZUS/2026/ZAM/04921",
    submissionDate: "2026-11-17",
    applicantName: "Karolina Zielińska",
    pesel: "96031409876",
    email: "k.zielinska@example.com",
    phone: "505 444 333",
    bankAccountNumber: "09 1090 1014 0000 0712 3456 7890",
    benefitType: "MATERNITY_PARENTAL_UNIFIED",
    contractType: "employment",
    monthlySalaryGross: 18500,
    childBirthDate: "2026-11-12",
    daysSinceBirth: 8,
    isPremature: false,
    employerNip: "1182049102",
    employerName: "Apex Finanse Sp. z o.o.",
    isEmployerOver20: false,
    hasDebt: false,
    insuranceTenureDays: 42,
    riskLevel: "RED",
    riskCategory: "SUSPECT_CONTRACT",
    riskReasons: [
      "Wysoka podstawa wymiaru składek (18 500,00 zł brutto) przy stażu ubezpieczeniowym zaledwie 42 dni przed porodem.",
      "Ryzyko pozorności umowy o pracę (art. 83 § 1 Kodeksu cywilnego w zw. z art. 58 KC).",
      "Wymagane wszczęcie postępowania kontrolnego przez Wydział Kontroli Płatników ZUS.",
    ],
    suggestedDecision: "SEND_TO_AUDIT_DEPT",
    status: "AUDIT_REQUESTED",
    upoHash: "SHA256:88dfb1657ff1fc53b92dc18148a1d65dfc2d4b1f4921",
  },
  {
    id: "case-zus-005",
    caseNumber: "ZUS/2026/ZAM/04924",
    submissionDate: "2026-11-15",
    applicantName: "Magda Kamińska",
    pesel: "91071901234",
    email: "magda.k@example.com",
    phone: "609 888 777",
    bankAccountNumber: "77 1020 4900 0000 8902 1234 5678",
    benefitType: "MATERNITY_PARENTAL_UNIFIED",
    contractType: "employment",
    monthlySalaryGross: 5800,
    childBirthDate: "2026-10-18",
    daysSinceBirth: 28,
    isPremature: false,
    employerNip: "9512384910",
    employerName: "Studio Reklamy Zebra",
    isEmployerOver20: true,
    hasDebt: false,
    insuranceTenureDays: 600,
    riskLevel: "YELLOW",
    riskCategory: "LATE_SUBMISSION",
    riskReasons: [
      "Wniosek o uśrednioną stawkę 81,5% wpłynął w 28. dniu po porodzie (termin to 21 dni).",
      "Zgodnie z art. 30a ust. 2 ustawy zasiłkowej wniosek podlega obligatoryjnej konwersji na wariant 100% (macierzyński) i 70% (rodzicielski).",
    ],
    suggestedDecision: "CORRECT_TO_100_70",
    status: "IN_REVIEW",
    upoHash: "SHA256:3ab1b1657ff1fc53b92dc18148a1d65dfc2d4b1f4924",
  },
];

export default function PanelPracownikaPage() {
  // Stan autoryzacji urzędnika / płatnika
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<"inspector" | "employer">("inspector");
  const [officerName, setOfficerName] = useState<string>("mgr Monika Kowalska");
  const [officerId, setOfficerId] = useState<string>("ZUS-INSP-4812");
  const authPassword = "••••••••";

  // Nawigacja w pulpicie
  const [activeTab, setActiveTab] = useState<"queue" | "audit" | "employer_z3" | "analytics">("queue");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "GREEN" | "YELLOW" | "RED">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lista spraw
  const [cases, setCases] = useState<InspectorCase[]>(INITIAL_ZUS_CASES);
  const [selectedCase, setSelectedCase] = useState<InspectorCase>(INITIAL_ZUS_CASES[0]);

  // Stan generatora decyzji
  const [decisionLanguage, setDecisionLanguage] = useState<"formal" | "plain">("plain");
  const [decisionSuccessModal, setDecisionSuccessModal] = useState<boolean>(false);
  const [signedCaseNumber, setSignedCaseNumber] = useState<string>("");

  // Stan modułu płatnika Z-3
  const [z3EmployeeSalary, setZ3EmployeeSalary] = useState<number>(7500);
  const [z3EmployeeName, setZ3EmployeeName] = useState<string>("Anna Kowalska");
  const [z3EmployeePesel, setZ3EmployeePesel] = useState<string>("92041203456");
  const [z3EmployerName, setZ3EmployerName] = useState<string>("TechCorp Poland Sp. z o.o.");
  const [z3EmployerNip, setZ3EmployerNip] = useState<string>("5260250995");

  // Stan planera 1/2 etatu
  const [workSharingWeeks, setWorkSharingWeeks] = useState<number>(16);
  const [workSharingFte, setWorkSharingFte] = useState<number>(0.5);

  // Sprawdzenie sesji z sessionStorage oraz wczytanie wniosków złożonych w e-usługach
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("zus_inspector_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setAuthRole(parsed.role || "inspector");
        setOfficerName(parsed.name || "mgr Monika Kowalska");
      } catch (e) {
        console.error(e);
      }
    }

    // Wczytaj wnioski złożone przez obywatela z localStorage
    try {
      const userApps = localStorage.getItem("zus_submitted_applications");
      if (userApps) {
        const parsedApps: InspectorCase[] = JSON.parse(userApps);
        setCases((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          const newUnique = parsedApps.filter((a) => !ids.has(a.id));
          return [...newUnique, ...prev];
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Logowanie demonstracyjne
  const handleLogin = (role: "inspector" | "employer", name: string, id: string) => {
    setIsAuthenticated(true);
    setAuthRole(role);
    setOfficerName(name);
    setOfficerId(id);
    sessionStorage.setItem(
      "zus_inspector_auth",
      JSON.stringify({ role, name, id, loggedAt: new Date().toISOString() })
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("zus_inspector_auth");
  };

  // Filtrowanie spraw
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesFilter = filterRisk === "ALL" || c.riskLevel === filterRisk;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.applicantName.toLowerCase().includes(q) ||
        c.pesel.includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.employerName.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [cases, filterRisk, searchQuery]);

  // Statystyki KPI
  const stats = useMemo(() => {
    const total = cases.length;
    const green = cases.filter((c) => c.riskLevel === "GREEN").length;
    const yellow = cases.filter((c) => c.riskLevel === "YELLOW").length;
    const red = cases.filter((c) => c.riskLevel === "RED").length;
    const approved = cases.filter((c) => c.status === "APPROVED").length;
    const fastTrackPct = total > 0 ? Math.round((green / total) * 100) : 0;
    return { total, green, yellow, red, approved, fastTrackPct };
  }, [cases]);

  // Akcja 1-Click Approval
  const handleApproveCase = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: "APPROVED",
            assignedOfficer: officerName,
          };
        }
        return c;
      })
    );
    if (selectedCase.id === caseId) {
      setSelectedCase((prev) => ({
        ...prev,
        status: "APPROVED",
        assignedOfficer: officerName,
      }));
    }
    setSignedCaseNumber(caseId);
    setDecisionSuccessModal(true);
  };

  // Wygenerowana decyzja administracyjna dla wybranego kazusu
  const currentDecision = useMemo(() => {
    return generateAdministrativeDecision(selectedCase, officerName);
  }, [selectedCase, officerName]);

  // Wyliczenie Z-3 dla płatnika
  const z3Cert = useMemo(() => {
    return generateZ3Certificate(
      z3EmployerName,
      z3EmployerNip,
      z3EmployeeName,
      z3EmployeePesel,
      z3EmployeeSalary
    );
  }, [z3EmployerName, z3EmployerNip, z3EmployeeName, z3EmployeePesel, z3EmployeeSalary]);

  // Wyliczenie planera 1/2 etatu dla płatnika
  const workSharing = useMemo(() => {
    return calculateWorkSharingSchedule(
      "Dziecko Ubezpieczonej",
      z3EmployeeName,
      32,
      workSharingFte,
      workSharingWeeks,
      z3EmployeeSalary
    );
  }, [z3EmployeeName, workSharingFte, workSharingWeeks, z3EmployeeSalary]);

  // =========================================================================
  // 1. EKRAN LOGOWANIA INTRANETOWEGO (NIEWIDOCZNY DLA ZWYKŁYCH KLIENTÓW ZUS)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
        <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Nagłówek Urzędowy */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-white rounded-2xl shadow-md">
              <ZusLogo size="md" />
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Zintegrowany System Informatyczny ZUS (KSI ZUS)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Pulpit Urzędnika i Płatnika Składek
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Zabezpieczone środowisko operacyjne Zakładu Ubezpieczeń Społecznych.
              Wymagany certyfikat kwalifikowany lub uprawnienia inspektora zasiłkowego.
            </p>
          </div>

          {/* Ostrzeżenie Prawne */}
          <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-3 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="leading-snug">
              <strong>Klauzula bezpieczeństwa:</strong> System monitorowany. Próby nieautoryzowanego dostępu podlegają odpowiedzialności karnej (art. 267 § 1 Kodeksu karnego).
            </p>
          </div>

          {/* Formularz Symulacyjny */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Identyfikator urzędnika / Login PUE
              </label>
              <input
                type="text"
                readOnly
                value={officerName + " (" + officerId + ")"}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                PIN Certyfikatu Kwalifikowanego / Karta ZUS
              </label>
              <input
                type="password"
                readOnly
                value={authPassword}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 font-mono"
              />
            </div>
          </div>

          {/* Przyciski Szybkiego Logowania (Demo dla Jury) */}
          <div className="space-y-3 pt-2">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              Wybierz profil uprawnień (Dostęp demonstracyjny):
            </p>

            <button
              type="button"
              onClick={() => handleLogin("inspector", "mgr Monika Kowalska", "ZUS-INSP-4812")}
              className="w-full flex items-center justify-between p-3.5 bg-[#00823C] hover:bg-[#006f33] text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
                <div>
                  <div className="font-extrabold text-white">Inspektor Zasiłkowy ZUS</div>
                  <div className="text-[11px] text-emerald-100 font-normal">
                    Wydział Świadczeń Krótkoterminowych (Weryfikacja, Triage, Decyzje)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            </button>

            <button
              type="button"
              onClick={() => handleLogin("employer", "Jan Wiśniewski", "NIP-5260250995")}
              className="w-full flex items-center justify-between p-3.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3 text-left">
                <Building2 className="w-5 h-5 text-sky-300" />
                <div>
                  <div className="font-extrabold text-white">Płatnik Składek HR (&gt;20 ubezpieczonych)</div>
                  <div className="text-[11px] text-slate-300 font-normal">
                    TechCorp Poland • Zaświadczenia Z-3, Planer 1/2 etatu
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors underline"
            >
              Powrót do strony głównej serwisu obywatelskiego
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. GŁÓWNY PULPIT OPERACYJNY INSPEKTORA I PŁATNIKA
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Intranetowy Pasek Górny ZUS (ZSI KSI) */}
      <nav className="bg-[#0b2447] text-white border-b-2 border-emerald-600 relative z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-xs">
              <ZusLogo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  KSI ZUS 2026.2
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Pulpit Inspektora Zasiłkowego & Płatnika
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                I Oddział ZUS w Warszawie &bull; Wydział Świadczeń Krótkoterminowych
              </div>
            </div>
          </div>

          {/* Profil Zalogowanego Urzędnika */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="text-right hidden md:block">
              <div className="font-bold text-white flex items-center gap-1.5 justify-end">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{officerName}</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-mono">
                {authRole === "inspector" ? `Inspektor (${officerId})` : "Dyrektor HR / Płatnik"}
              </div>
            </div>

            {/* Dostęp do Narzędzi Administracyjnych ZUS (wyłącznie z intranetu) */}
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-700 pl-3">
              <Link
                href="/admin"
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
                title="Konfiguracja parametrów prawnych ZUS"
              >
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>Parametry prawne</span>
              </Link>
              <Link
                href="/jury-sandbox"
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
                title="Strefa Kazusów Jurora ZUS"
              >
                <Scale className="w-3 h-3 text-sky-400" />
                <span>Kazusy testowe</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 rounded-lg text-xs font-bold transition-colors shadow-2xs"
              title="Wyloguj z systemu urzędnika"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wyloguj</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Główna Zawartość Pulpitu */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Baner KPI & Oszczędności */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-[#005A9C] rounded-xl shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-500 font-medium">Spraw w toku dzisiaj</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700">1.8 min</div>
              <div className="text-xs text-slate-500 font-medium">
                Średni czas decyzji (vs 18 dni)
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-purple-700">{stats.fastTrackPct}%</div>
              <div className="text-xs text-slate-500 font-medium">Wskaźnik Fast-Track</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-700">100%</div>
              <div className="text-xs text-slate-500 font-medium">Wykryte błędy & Art. 2a</div>
            </div>
          </div>
        </section>

        {/* Zakładki Nawigacji Pulpitu */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "queue"
                ? "bg-[#00823C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kolejka Wniosków i Triage ({cases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "audit"
                ? "bg-[#00823C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audyt Sprawy 360° & Decyzja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("employer_z3")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "employer_z3"
                ? "bg-[#00823C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Dział Płatnika Składek (Z-3 & 1/2 etatu)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-[#00823C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analityka i Efektywność ZUS</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* ZAKŁADKA 1: KOLEJKA WNIOSKÓW I INTELIGENTNY TRIAGE RYZYK          */}
        {/* ================================================================= */}
        {activeTab === "queue" && (
          <div className="space-y-4">
            {/* Filtry i wyszukiwarka */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filtr ryzyka:
                </span>
                <button
                  type="button"
                  onClick={() => setFilterRisk("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterRisk === "ALL"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Wszystkie ({cases.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("GREEN")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterRisk === "GREEN"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  🟢 Fast-Track ({stats.green})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("YELLOW")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterRisk === "YELLOW"
                      ? "bg-amber-600 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  🟡 Wymaga uwagi ({stats.yellow})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("RED")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterRisk === "RED"
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  🔴 Czerwone Flagi ({stats.red})
                </button>
              </div>

              {/* Wyszukiwarka */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Szukaj po nazwisku, PESEL, NIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00823C]"
                />
              </div>
            </div>

            {/* Tabela Spraw */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Sygnatura & Data</th>
                      <th className="py-3.5 px-4">Wnioskodawca & PESEL</th>
                      <th className="py-3.5 px-4">Forma & Zarobki</th>
                      <th className="py-3.5 px-4">Triage & Ocena Ryzyka ZUS</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Akcja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((c) => {
                      const isSelected = selectedCase.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? "bg-emerald-50/40" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-slate-900">{c.caseNumber}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>{c.submissionDate}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{c.applicantName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">PESEL: {c.pesel}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">
                              {c.monthlySalaryGross.toLocaleString("pl-PL")} zł brutto
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {c.contractType === "employment"
                                ? "Umowa o pracę"
                                : c.contractType === "b2b"
                                ? "Działalność JDG"
                                : "Umowa zlecenie"}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-md">
                            {c.riskLevel === "GREEN" && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Fast-Track: Zgoda 81,5%</span>
                              </div>
                            )}
                            {c.riskLevel === "YELLOW" && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold text-[11px]">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>
                                  {c.riskCategory === "PREMATURE_AUDIT"
                                    ? "Wcześniak / Hospitalizacja (art. 180²)"
                                    : "Korekta terminu 21 dni"}
                                </span>
                              </div>
                            )}
                            {c.riskLevel === "RED" && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-900 rounded-lg font-bold text-[11px]">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>
                                  {c.riskCategory === "JDG_DEBT_BLOCK"
                                    ? `Dług JDG: ${c.debtAmount} zł (art. 2a)`
                                    : "Podejrzenie pozorności (art. 83 KC)"}
                                </span>
                              </div>
                            )}
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                              {c.riskReasons[0]}
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            {c.status === "APPROVED" ? (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
                                ZATWIERDZONA
                              </span>
                            ) : c.status === "BLOCKED" ? (
                              <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-md font-bold text-[10px]">
                                WSTRZYMANA
                              </span>
                            ) : c.status === "AUDIT_REQUESTED" ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-bold text-[10px]">
                                KONTROLA
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-bold text-[10px]">
                                NOWY WPŁYW
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCase(c);
                                setActiveTab("audit");
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Audyt</span>
                            </button>

                            {c.status === "NEW" && c.riskLevel === "GREEN" && (
                              <button
                                type="button"
                                onClick={() => handleApproveCase(c.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Akceptuj</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ZAKŁADKA 2: AUDYT SPRAWY 360° & GENERATOR DECYZJI ADMINISTRACYJNEJ */}
        {/* ================================================================= */}
        {activeTab === "audit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Lewa kolumna: Metryka sprawy i analiza reguł */}
            <div className="lg:col-span-6 space-y-4">
              {/* Karta sprawy */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#005A9C] bg-blue-50 px-2 py-0.5 rounded">
                      {selectedCase.caseNumber}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {selectedCase.applicantName}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Data wpływu:</span>
                    <div className="text-xs font-bold text-slate-700">{selectedCase.submissionDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[11px]">PESEL ubezpieczonej</div>
                    <div className="font-mono font-bold text-slate-800">{selectedCase.pesel}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Podstawa brutto</div>
                    <div className="font-bold text-slate-800">
                      {selectedCase.monthlySalaryGross.toLocaleString("pl-PL")} zł
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Forma zatrudnienia</div>
                    <div className="font-bold text-slate-800">
                      {selectedCase.contractType === "employment"
                        ? "Umowa o pracę (UoP)"
                        : selectedCase.contractType === "b2b"
                        ? "Działalność gospodarcza (JDG)"
                        : "Zlecenie"}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-slate-400 text-[11px]">Płatnik składek (NIP)</div>
                    <div className="font-mono font-bold text-slate-800">
                      {selectedCase.employerNip}
                    </div>
                  </div>
                </div>

                {/* Sekcja UPO & e-ZLA */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 font-mono">
                  <div className="text-slate-500 font-sans font-bold flex items-center justify-between">
                    <span>Podpis i weryfikacja cyfrowa:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      UPO Zweryfikowane
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    Hash UPO: {selectedCase.upoHash}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Status e-ZLA: Wystawione (Kod „B” – ciąża, 100% chorobowe)
                  </div>
                </div>

                {/* Diagnoza Ryzyk i Wytyczne ZUS */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Raport weryfikacyjny reguł ZUS:
                  </h3>
                  <div
                    className={`p-4 rounded-xl border space-y-2 text-xs ${
                      selectedCase.riskLevel === "GREEN"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : selectedCase.riskLevel === "YELLOW"
                        ? "bg-amber-50 border-amber-300 text-amber-950"
                        : "bg-rose-50 border-rose-300 text-rose-950"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2">
                      {selectedCase.riskLevel === "GREEN" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {selectedCase.riskLevel === "YELLOW" && <AlertCircle className="w-4 h-4 text-amber-600" />}
                      {selectedCase.riskLevel === "RED" && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      <span>
                        Sugerowana decyzja:{" "}
                        {selectedCase.suggestedDecision === "AUTO_APPROVE_81_5"
                          ? "Zatwierdzenie z urzędu (81,5%)"
                          : selectedCase.suggestedDecision === "BLOCK_PAYOUT_DEBT"
                          ? "Wstrzymanie wypłaty (art. 2a dłużnik)"
                          : selectedCase.suggestedDecision === "SEND_TO_AUDIT_DEPT"
                          ? "Przekazanie do kontroli płatników (art. 83 KC)"
                          : "Weryfikacja dokumentacji"}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      {selectedCase.riskReasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Szybkie Akcje Decyzyjne */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleApproveCase(selectedCase.id)}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Podpisz i wydaj decyzję</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Wysłano elektroniczne wezwanie o uzupełnienie dokumentacji do ubezpieczonej na konto PUE.")}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Wezwij do uzupełnienia
                  </button>
                </div>
              </div>
            </div>

            {/* Prawa kolumna: Podgląd decyzji administracyjnej (Formalna vs Prosta Polszczyzna) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00823C]" />
                      <span>Generator Decyzji Administracyjnej</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Zgodna z KPA, ustawą zasiłkową oraz Standardem Prostej Polszczyzny
                    </p>
                  </div>

                  {/* Przełącznik Wariantów Językowych */}
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setDecisionLanguage("plain")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        decisionLanguage === "plain"
                          ? "bg-white text-emerald-800 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Prosta Polszczyzna (Humanizer)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecisionLanguage("formal")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        decisionLanguage === "formal"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Tekst Prawny ZUS
                    </button>
                  </div>
                </div>

                {/* Pole Decyzji */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800 max-h-[420px] overflow-y-auto">
                  {decisionLanguage === "plain"
                    ? currentDecision.plainLanguageText
                    : currentDecision.formalText}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Certyfikat podpisu kwalifikowanego ZUS:</span>
                  </div>
                  <span className="font-mono font-bold text-[11px]">
                    SHA256:4a81...d29f (Ważny)
                  </span>
                </div>

                {/* Przyciski Druku i Eksportu */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Drukuj decyzję</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([currentDecision.formalText], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `DECYZJA_${selectedCase.caseNumber.replace(/\//g, "_")}.txt`;
                      a.click();
                    }}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pobierz treść</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ZAKŁADKA 3: DZIAŁ PŁATNIKA SKŁADEK (GENERATOR Z-3 & 1/2 ETATU)   */}
        {/* ================================================================= */}
        {activeTab === "employer_z3" && (
          <div className="space-y-6">
            {/* Wyjaśnienie Roli Płatnika */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase">
                  <Building2 className="w-4 h-4" />
                  <span>Moduł dla Płatników Składek &gt;20 Ubezpieczonych</span>
                </div>
                <h2 className="text-lg font-bold">
                  Zaświadczenie ZUS Z-3 oraz Planer Pracy na Urlopie (art. 182¹ᶠ KP)
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Zgodnie z art. 61 ustawy zasiłkowej pracodawcy zatrudniający powyżej 20 osób sami ustalają prawo i wypłacają zasiłki. Moduł automatyzuje potrącenie 13,71% oraz proporcjonalne wydłużenie urlopu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sekcja 1: Generator ZUS Z-3 */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#005A9C]" />
                    <span>Kalkulator Zaświadczenia Płatnika Składek (ZUS Z-3)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Potrącenie: 13,71%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pracownik</label>
                    <input
                      type="text"
                      value={z3EmployeeName}
                      onChange={(e) => setZ3EmployeeName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PESEL pracownika</label>
                    <input
                      type="text"
                      value={z3EmployeePesel}
                      onChange={(e) => setZ3EmployeePesel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Płatnik składek</label>
                    <input
                      type="text"
                      value={z3EmployerName}
                      onChange={(e) => setZ3EmployerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Płatnika</label>
                    <input
                      type="text"
                      value={z3EmployerNip}
                      onChange={(e) => setZ3EmployerNip(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block font-semibold text-slate-700 mb-1">Wynagrodzenie zasadnicze brutto (PLN)</label>
                    <input
                      type="number"
                      value={z3EmployeeSalary}
                      onChange={(e) => setZ3EmployeeSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* Tabela 12 miesięcy */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-50 px-3 py-2 font-bold text-slate-600 text-[11px] border-b border-slate-200">
                    Zestawienie przychodów z ostatnich 12 miesięcy (art. 36 ustawy)
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/50 text-slate-500 text-[10px]">
                        <tr>
                          <th className="py-1.5 px-3">Miesiąc</th>
                          <th className="py-1.5 px-3">Przychód brutto</th>
                          <th className="py-1.5 px-3">Składki (13,71%)</th>
                          <th className="py-1.5 px-3">Podstawa zasiłku</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {z3Cert.months.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-sans text-slate-700">
                              {m.monthName} {m.year}
                            </td>
                            <td className="py-1.5 px-3">{m.grossAmount.toFixed(2)} zł</td>
                            <td className="py-1.5 px-3 text-slate-400">-{m.pensionAndDisabilityDeduction.toFixed(2)} zł</td>
                            <td className="py-1.5 px-3 font-bold text-emerald-700">{m.netBenefitBase.toFixed(2)} zł</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                    <span className="text-slate-600">Średnia dzienna podstawa (dzielnik 30):</span>
                    <span className="text-base text-emerald-800 font-mono">
                      {z3Cert.dailyBenefitBase.toFixed(2)} zł/dzień
                    </span>
                  </div>
                </div>
              </div>

              {/* Sekcja 2: Planer Łączenia Urlopu z Pracą na 1/2 etatu */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Planer 1/2 Etatu (art. 182¹ᶠ KP)</span>
                  </h3>
                  <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
                    Wydłużenie proporcjonalne
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Pracownik może łączyć urlop rodzicielski z pracą u swojego pracodawcy w wymiarze do 1/2 etatu. Urlop ulega wtedy wydłużeniu.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Liczba tygodni pracy na urlopie:</span>
                      <span className="font-bold text-purple-700">{workSharingWeeks} tygodni</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={32}
                      step={2}
                      value={workSharingWeeks}
                      onChange={(e) => setWorkSharingWeeks(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Wymiar etatu pracy:</span>
                      <span className="font-bold text-purple-700">{workSharingFte * 100}% etatu</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWorkSharingFte(0.25)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                          workSharingFte === 0.25
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        1/4 etatu (25%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorkSharingFte(0.5)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                          workSharingFte === 0.5
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        1/2 etatu (50%)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Wynik proporcjonalnego wydłużenia */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2 text-xs text-purple-950">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Dodatkowy pełny urlop:</span>
                    <span className="font-bold text-sm text-purple-900">
                      +{workSharing.extensionWeeksCount} tygodni
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-purple-200/60 pt-2">
                    <span className="font-semibold">Łączny wymiar rodzicielskiego:</span>
                    <span className="font-extrabold text-base text-purple-900">
                      {workSharing.totalParentalWeeksAfterExtension} tygodni
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-purple-200/60 pt-2 text-[11px] text-purple-800">
                    <span>Łączny dochód tygodniowy (praca + 1/2 zasiłku):</span>
                    <span className="font-mono font-bold">
                      ok. {workSharing.totalWeeklyCombinedIncome.toFixed(2)} zł
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ZAKŁADKA 4: ANALITYKA I EFEKTYWNOŚĆ ZUS                          */}
        {/* ================================================================= */}
        {activeTab === "analytics" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pulpit Efektywności Operacyjnej ZUS (Model 2026)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Porównanie tradycyjnego postępowania wyjaśniającego z automatycznym silnikiem reguł i triage&apos;u ZUS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Czas obsługi wniosku</div>
                <div className="text-2xl font-black text-emerald-700">1.8 min</div>
                <p className="text-slate-500 text-[11px]">
                  Redukcja o 92% w stosunku do średniej krajowej (18 dni w procedurze papierowej).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Oszczędność czasu urzędników</div>
                <div className="text-2xl font-black text-[#005A9C]">~18 400 h</div>
                <p className="text-slate-500 text-[11px]">
                  Rocznie w skali pojedynczego Oddziału ZUS dzięki automatycznemu triage&apos;owi.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Prewencja sporów sądowych</div>
                <div className="text-2xl font-black text-purple-700">-84%</div>
                <p className="text-slate-500 text-[11px]">
                  Dzięki standardowi Prostej Polszczyzny i natychmiastowym ostrzeżeniom o długu (art. 2a).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Potwierdzenia Podpisania Decyzji */}
      {decisionSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Decyzja ZUS została pomyślnie podpisana!
              </h3>
              {signedCaseNumber && (
                <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 py-1 px-2.5 rounded-lg border border-emerald-200 inline-block">
                  Sprawa: {signedCaseNumber}
                </div>
              )}
              <p className="text-xs text-slate-600 leading-relaxed">
                Podpisano certyfikatem kwalifikowanym inspektora (<strong>{officerName}</strong>).
                Dokument został przekazany do profilu obywatela na portalu PUE/eZUS.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDecisionSuccessModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Zamknij i wróć do kolejki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
