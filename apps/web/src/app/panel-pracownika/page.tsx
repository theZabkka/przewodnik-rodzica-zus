"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  LogOut,
  Calendar,
  Layers,
  Cloud,
  RefreshCw,
  Edit3,
  Mail,
  FileSignature,
  Send,
  Baby,
  HeartPulse,
  CreditCard,
  X,
} from "lucide-react";
import { ZusLogo, PolishEmblem } from "@/components/ZusLogo";
import {
  InspectorCase,
  generateAdministrativeDecision,
  generateZ3Certificate,
  calculateWorkSharingSchedule,
} from "@hacknation/shared";
import {
  fetchCasesFromCloud,
  updateCaseStatusInCloud,
} from "@/services/casesSyncService";

// Domyślne kazusy operacyjne ZUS (wzbogacone o pełne dane rodzinne, medyczne i rejestrowe)
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
    childName: "Jan Kowalski",
    otherParentName: "Piotr Kowalski",
    otherParentPesel: "89110507890",
    isPremature: false,
    birthWeek: 39,
    birthWeightGrams: 3450,
    employerNip: "5260250995",
    employerName: "TechCorp Poland Sp. z o.o.",
    isEmployerOver20: true,
    hasDebt: false,
    debtAmount: 0,
    insuranceTenureDays: 480,
    riskLevel: "GREEN",
    riskCategory: "FAST_TRACK",
    riskReasons: [
      "Wniosek złożony w 4. dniu po porodzie (termin ustawowy do 21 dni zachowany).",
      "Elektroniczne zwolnienie lekarskie e-ZLA z kodem „B” w rejestrze ZUS.",
      "Płatnik opłaca składki terminowo, brak zadłużenia na indywidualnym koncie NRS.",
      "Zakwalifikowano do procedury Fast-Track (autozgoda 81,5% z urzędu).",
    ],
    suggestedDecision: "AUTO_APPROVE_81_5",
    status: "NEW",
    upoHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f4912",
    source: "cloud",
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
    childName: "Alicja Lewandowska",
    otherParentName: "Tomasz Lewandowski",
    otherParentPesel: "88051403210",
    isPremature: true,
    birthWeek: 31,
    birthWeightGrams: 1420,
    hospitalDays: 32,
    hospitalName: "Szpital Kliniczny im. ks. Anny Mazowieckiej (OION / Neonatologia)",
    employerNip: "7010456123",
    employerName: "Medica Logistyka S.A.",
    isEmployerOver20: true,
    hasDebt: false,
    insuranceTenureDays: 720,
    riskLevel: "YELLOW",
    riskCategory: "PREMATURE_AUDIT",
    riskReasons: [
      "Noworodek przedwcześnie urodzony (31. tc, 1420 g) z hospitalizacją 32 dni.",
      "Zgodnie z art. 180² Kodeksu pracy przysługuje uzupełniający urlop macierzyński płatny 100% (do 8 tygodni).",
      "Wymagane załączenie i weryfikacja karty informacyjnej leczenia szpitalnego (OION).",
    ],
    suggestedDecision: "AUDIT_HOSPITAL_DOCS",
    status: "IN_REVIEW",
    upoHash: "SHA256:91ac3b726dd04f41b31278148a1d65dfc2d4b1f4915",
    source: "cloud",
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
    childName: "Michał Wiśniewski",
    otherParentName: "Katarzyna Wiśniewska",
    otherParentPesel: "92070308912",
    isPremature: false,
    birthWeek: 38,
    birthWeightGrams: 3200,
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
      "Płatnikowi przysługuje 6 miesięcy na spłatę zaległości z prawem do wyrównania wstecz.",
    ],
    suggestedDecision: "BLOCK_PAYOUT_DEBT",
    status: "BLOCKED",
    upoHash: "SHA256:4ca2b1657ff1fc53b92dc18148a1d65dfc2d4b1f4918",
    source: "cloud",
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
    childName: "Maja Zielińska",
    otherParentName: "Grzegorz Zieliński",
    otherParentPesel: "94021804567",
    isPremature: false,
    birthWeek: 40,
    birthWeightGrams: 3600,
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
    source: "cloud",
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
    childName: "Tymon Kamiński",
    otherParentName: "Łukasz Kamiński",
    otherParentPesel: "90061208765",
    isPremature: false,
    birthWeek: 39,
    birthWeightGrams: 3300,
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
    source: "cloud",
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

  // Lista spraw & synchronizacja z chmurą
  const [cases, setCases] = useState<InspectorCase[]>(INITIAL_ZUS_CASES);
  const [selectedCase, setSelectedCase] = useState<InspectorCase>(INITIAL_ZUS_CASES[0]);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [cloudCount, setCloudCount] = useState<number>(INITIAL_ZUS_CASES.length);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modale operacyjne
  const [decisionModalOpen, setDecisionModalOpen] = useState<boolean>(false);
  const [decisionLanguage, setDecisionLanguage] = useState<"formal" | "plain">("plain");
  const [decisionCustomText, setDecisionCustomText] = useState<string>("");
  const [requisitionModalOpen, setRequisitionModalOpen] = useState<boolean>(false);
  const [requisitionDocType, setRequisitionDocType] = useState<string>("karta_szpital");
  const [requisitionDaysLimit, setRequisitionDaysLimit] = useState<number>(14);
  const [requisitionSentSuccess, setRequisitionSentSuccess] = useState<boolean>(false);
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

  // Funkcja pobierająca sprawy z Supabase
  const loadCloudCases = useCallback(async () => {
    setIsSyncing(true);
    try {
      const syncResult = await fetchCasesFromCloud();
      setIsCloudConnected(syncResult.isCloudConnected);
      setLastSyncedAt(syncResult.lastSyncedAt);

      if (syncResult.cases.length > 0) {
        // Połącz pobrane sprawy z wbudowanymi sprawami testowymi, eliminując duplikaty tego samego wnioskodawcy
        const initialMap = new Map<string, InspectorCase>();
        const seenApplicants = new Set<string>();

        // Najpierw sprawy zsynchronizowane z chmury (najnowsze zgłoszenia obywateli)
        syncResult.cases.forEach((c) => {
          const key = `${c.applicantName?.trim().toLowerCase()}_${c.pesel}`;
          if (!seenApplicants.has(key)) {
            seenApplicants.add(key);
            initialMap.set(c.caseNumber, c);
          }
        });

        // Uzupełnij o unikalne kazusy referencyjne ZUS (np. wcześniak, zadłużenie JDG, adopcja)
        INITIAL_ZUS_CASES.forEach((c) => {
          const key = `${c.applicantName?.trim().toLowerCase()}_${c.pesel}`;
          if (!seenApplicants.has(key) && !initialMap.has(c.caseNumber)) {
            seenApplicants.add(key);
            initialMap.set(c.caseNumber, c);
          }
        });

        const mergedList = Array.from(initialMap.values());
        setCases(mergedList);
        setCloudCount(syncResult.cloudCount);

        // Aktualizuj zaznaczoną sprawę jeśli istnieje
        setSelectedCase((prev) => initialMap.get(prev.caseNumber) || mergedList[0]);
      }
    } catch (e) {
      console.warn("Błąd podczas synchronizacji z Supabase:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Automatyczna synchronizacja w tle co 8 sekund, aby nowe wnioski pojawiały się natychmiast
  useEffect(() => {
    const timer = setInterval(() => {
      loadCloudCases();
    }, 8000);
    return () => clearInterval(timer);
  }, [loadCloudCases]);

  // Inicjalizacja sesji oraz pobranie spraw z Supabase przy starcie
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("zus_inspector_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setAuthRole(parsed.role || "inspector");
        setOfficerName(parsed.name || "mgr Monika Kowalska");
        setOfficerId(parsed.id || "ZUS-INSP-4812");
      } catch (e) {
        console.error(e);
      }
    }

    loadCloudCases();
  }, [loadCloudCases]);

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

  // Szybka akcja: 1-Click Auto-Approve (dla GREEN Fast-Track)
  const handleApproveFastTrack = async (targetCase: InspectorCase) => {
    const baseDecision = generateAdministrativeDecision(targetCase, "plain");
    const doc = {
      formal: baseDecision.formalText,
      plainLanguage: baseDecision.plainLanguageText,
      generatedAt: new Date().toISOString(),
      officerSignature: `${officerName} (${officerId})`,
    };

    setCases((prev) =>
      prev.map((c) => (c.id === targetCase.id ? { ...c, status: "APPROVED", decisionDocument: doc } : c))
    );
    if (selectedCase.id === targetCase.id) {
      setSelectedCase((prev) => ({ ...prev, status: "APPROVED", decisionDocument: doc }));
    }

    await updateCaseStatusInCloud(targetCase.caseNumber, "APPROVED", doc);
    setSignedCaseNumber(targetCase.caseNumber);
    setDecisionSuccessModal(true);
  };

  // Otwarcie modala edycji decyzji
  const handleOpenDecisionModal = (c: InspectorCase) => {
    setSelectedCase(c);
    const baseDec = generateAdministrativeDecision(c, decisionLanguage);
    setDecisionCustomText(
      decisionLanguage === "plain" ? baseDec.plainLanguageText : baseDec.formalText
    );
    setDecisionModalOpen(true);
  };

  // Zmiana języka w edytorze decyzji
  const handleChangeDecisionLanguage = (lang: "formal" | "plain") => {
    setDecisionLanguage(lang);
    const baseDec = generateAdministrativeDecision(selectedCase, lang);
    setDecisionCustomText(lang === "plain" ? baseDec.plainLanguageText : baseDec.formalText);
  };

  // Podpisanie decyzji z edytora
  const handleSignCustomDecision = async () => {
    const baseDec = generateAdministrativeDecision(selectedCase, "formal");
    const doc = {
      formal: decisionLanguage === "formal" ? decisionCustomText : baseDec.formalText,
      plainLanguage: decisionLanguage === "plain" ? decisionCustomText : baseDec.plainLanguageText,
      generatedAt: new Date().toISOString(),
      officerSignature: `${officerName} (${officerId})`,
    };

    const newStatus = selectedCase.riskCategory === "JDG_DEBT_BLOCK" ? "BLOCKED" : "APPROVED";

    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: newStatus, decisionDocument: doc } : c))
    );
    setSelectedCase((prev) => ({ ...prev, status: newStatus, decisionDocument: doc }));

    await updateCaseStatusInCloud(selectedCase.caseNumber, newStatus, doc);
    setDecisionModalOpen(false);
    setSignedCaseNumber(selectedCase.caseNumber);
    setDecisionSuccessModal(true);
  };

  // Wysłanie urzędowego wezwania do uzupełnienia braków (art. 64 § 2 KPA)
  const handleSendRequisition = async () => {
    const docNotice = {
      formal: `WEZWANIE DO UZUPEŁNIENIA BRAKÓW FORMALNYCH (art. 64 § 2 KPA)\nZnak sprawy: ${selectedCase.caseNumber}\nWzywa się ubezpieczoną ${selectedCase.applicantName} (PESEL: ${selectedCase.pesel}) do przedłożenia w terminie ${requisitionDaysLimit} dni:\n- ${
        requisitionDocType === "karta_szpital"
          ? "Karta informacyjna leczenia szpitalnego noworodka (wymóg art. 180² KP)"
          : requisitionDocType === "zaświadczenie_z3"
          ? "Zaświadczenie płatnika składek ZUS Z-3 z 12 miesięcy"
          : "Potwierdzenie uregulowania zadłużenia z art. 2a ustawy zasiłkowej"
      }.\nPouczenie: Niedopełnienie obowiązku w terminie spowoduje pozostawienie wniosku bez rozpoznania.`,
      plainLanguage: `Szanowna Pani ${selectedCase.applicantName},\n\nAbyśmy mogli wypłacić zasiłek w pełnej wysokości, prosimy o przesłanie brakującego dokumentu w ciągu ${requisitionDaysLimit} dni:\n👉 ${
        requisitionDocType === "karta_szpital"
          ? "Karta ze szpitala potwierdzająca pobyt dziecka na oddziale (pozwoli przyznać dodatkowe tygodnie urlopu 100%)"
          : requisitionDocType === "zaświadczenie_z3"
          ? "Druk Z-3 od Twojego pracodawcy"
          : "Dowód opłacenia zaległości składkowej na indywidualny numer rachunku składkowego"
      }.\n\nDokument możesz wgrać bezpośrednio przez swój profil na PUE/eZUS.`,
      generatedAt: new Date().toISOString(),
      officerSignature: `${officerName} (${officerId})`,
    };

    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: "IN_REVIEW", decisionDocument: docNotice } : c))
    );
    setSelectedCase((prev) => ({ ...prev, status: "IN_REVIEW", decisionDocument: docNotice }));

    await updateCaseStatusInCloud(selectedCase.caseNumber, "IN_REVIEW", docNotice);
    setRequisitionSentSuccess(true);
    setTimeout(() => {
      setRequisitionSentSuccess(false);
      setRequisitionModalOpen(false);
    }, 2200);
  };

  // Skierowanie do Wydziału Kontroli Płatników
  const handleSendToAuditDept = async () => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: "AUDIT_REQUESTED" } : c))
    );
    setSelectedCase((prev) => ({ ...prev, status: "AUDIT_REQUESTED" }));
    await updateCaseStatusInCloud(selectedCase.caseNumber, "AUDIT_REQUESTED");
  };

  // Kalkulacja zaświadczenia płatnika Z-3
  const z3Cert = useMemo(() => {
    return generateZ3Certificate(
      z3EmployerName,
      z3EmployerNip,
      z3EmployeeName,
      z3EmployeePesel,
      z3EmployeeSalary,
      "Specjalista"
    );
  }, [z3EmployerName, z3EmployerNip, z3EmployeeName, z3EmployeePesel, z3EmployeeSalary]);

  // Kalkulacja harmonogramu łączenia z pracą na 1/2 etatu
  const workSharing = useMemo(() => {
    return calculateWorkSharingSchedule(
      selectedCase.childName || "Jan Kowalski",
      selectedCase.applicantName || "Anna Kowalska",
      32,
      workSharingFte,
      workSharingWeeks,
      z3EmployeeSalary
    );
  }, [workSharingWeeks, workSharingFte, z3EmployeeSalary, selectedCase.childName, selectedCase.applicantName]);

  // =========================================================================
  // 1. EKRAN LOGOWANIA DO PORTALU PRACOWNIKA (NOWY MOTYW ZUS SAGE & CREAM)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#C8D7C5] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <PolishEmblem className="w-10 h-10" />
              <ZusLogo size="md" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF3EA] text-[#10371E] border border-[#B9CCB6] text-xs font-bold font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>KSI ZUS &bull; ZSI 2026.2</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#10371E]">
              Pulpit Urzędnika i Płatnika Składek
            </h1>
            <p className="text-xs text-[#425B4A] leading-relaxed">
              Zintegrowany System Informatyczny Zakładu Ubezpieczeń Społecznych.
              Dostęp zabezpieczony certyfikatem kwalifikowanym inspektora lub kontem płatnika.
            </p>
          </div>

          <div className="p-3.5 bg-[#EFF3EA] border border-[#B9CCB6] rounded-2xl flex items-start gap-2.5 text-xs text-[#1D4029]">
            <ShieldCheck className="w-4 h-4 text-[#007834] shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Centralny rejestr spraw ZUS:</strong> Aktywne połączenie z chmurową bazą wniosków rodzicielskich (stan: 2026).
            </p>
          </div>

          {/* Formularz symulacji poświadczeń */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Identyfikator profilu ZUS</label>
              <input
                type="text"
                readOnly
                value={`${officerName} (${officerId})`}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#C8D7C5] rounded-xl font-mono text-slate-700 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Karta kryptograficzna / PIN kwalifikowany</label>
              <input
                type="password"
                readOnly
                value={authPassword}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#C8D7C5] rounded-xl font-mono text-slate-700 text-xs"
              />
            </div>
          </div>

          {/* Przyciski logowania */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleLogin("inspector", "mgr Monika Kowalska", "ZUS-INSP-4812")}
              className="w-full p-3.5 bg-[#10371E] hover:bg-[#007834] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <div>
                  <div className="font-extrabold">Inspektor Zasiłkowy ZUS</div>
                  <div className="text-[11px] text-emerald-200 font-normal">
                    Wydział Świadczeń Krótkoterminowych (Triage, Audyt 360°, Decyzje)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-300" />
            </button>

            <button
              type="button"
              onClick={() => handleLogin("employer", "Jan Wiśniewski", "NIP-5260250995")}
              className="w-full p-3.5 bg-white hover:bg-[#EFF3EA] text-[#10371E] border-[1.5px] border-[#10371E] rounded-2xl text-xs font-bold transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 text-left">
                <Building2 className="w-5 h-5 text-[#007834]" />
                <div>
                  <div className="font-extrabold">Płatnik Składek HR (&gt;20 ubezpieczonych)</div>
                  <div className="text-[11px] text-[#425B4A] font-normal">
                    TechCorp Poland &bull; Zaświadczenia Z-3 i Planer 1/2 etatu
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#10371E]" />
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-[#007834] hover:underline font-bold inline-flex items-center gap-1"
            >
              &larr; Wróć do portalu obywatelskiego zus.pl
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. GŁÓWNY PULPIT OPERACYJNY KSI ZUS (NOWY INSTYTUCJONALNY SAGE & CREAM)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col font-sans text-slate-800">
      {/* Intranetowy Pasek Górny ZUS (Szlachetna zieleń urzędowa ZUS) */}
      <nav className="bg-[#0F2918] text-white border-b border-[#007834] relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg shadow-xs">
              <ZusLogo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-[#007834] text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  KSI ZUS 2026.2
                </span>
                <span className="text-xs text-emerald-200 hidden sm:inline font-bold">
                  Pulpit Inspektora Zasiłkowego &amp; Płatnika
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                I Oddział ZUS w Warszawie &bull; Wydział Świadczeń Krótkoterminowych
              </div>
            </div>
          </div>

          {/* Profil zalogowanego urzędnika + status chmury */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* Status Live Sync Supabase */}
            <div className="hidden sm:flex items-center gap-2 bg-[#1A3D25] border border-emerald-600/40 px-3 py-1 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Cloud className="w-3.5 h-3.5 text-emerald-300" />
              <div className="text-[11px]">
                <span className="text-white font-bold">Chmura ZUS:</span>{" "}
                <span className="text-emerald-300">
                  {isCloudConnected ? `Aktywna (${cloudCount} spraw)` : "Tryb lokalny"}
                </span>
              </div>
              <button
                type="button"
                onClick={loadCloudCases}
                disabled={isSyncing}
                title="Odśwież dane z centralnego rejestru ZUS"
                className="text-emerald-300 hover:text-white transition-colors ml-1 p-0.5"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="text-right hidden md:block">
              <div className="font-bold text-white flex items-center gap-1.5 justify-end">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{officerName}</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-mono">
                {authRole === "inspector" ? `Inspektor (${officerId})` : "Dyrektor HR / Płatnik"}
              </div>
            </div>

            {/* Skróty administracyjne */}
            <div className="hidden lg:flex items-center gap-2 border-l border-emerald-800 pl-3">
              <Link
                href="/admin"
                className="px-2.5 py-1 bg-[#1A3D25] hover:bg-[#255234] border border-emerald-700/50 rounded-lg text-[11px] font-semibold text-emerald-100 transition-colors flex items-center gap-1.5"
                title="Konfiguracja parametrów prawnych ZUS"
              >
                <Sliders className="w-3 h-3 text-amber-300" />
                <span>Parametry prawne</span>
              </Link>
              <Link
                href="/jury-sandbox"
                className="px-2.5 py-1 bg-[#1A3D25] hover:bg-[#255234] border border-emerald-700/50 rounded-lg text-[11px] font-semibold text-emerald-100 transition-colors flex items-center gap-1.5"
                title="Strefa Kazusów Jurora ZUS"
              >
                <Scale className="w-3 h-3 text-sky-300" />
                <span>Kazusy testowe</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/80 rounded-xl text-xs font-bold transition-colors"
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
        {/* Baner KPI i Efektywności */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#C8D7C5] shadow-xs flex items-center gap-3">
            <div className="p-3 bg-[#EFF3EA] text-[#007834] rounded-xl shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#10371E]">{stats.total}</div>
              <div className="text-xs text-[#425B4A] font-semibold">Spraw w toku dzisiaj</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#C8D7C5] shadow-xs flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-800">1.8 min</div>
              <div className="text-xs text-[#425B4A] font-semibold">Średni czas decyzji (vs 18 dni)</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#C8D7C5] shadow-xs flex items-center gap-3">
            <div className="p-3 bg-[#EFF3EA] text-[#10371E] rounded-xl shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#10371E]">{stats.fastTrackPct}%</div>
              <div className="text-xs text-[#425B4A] font-semibold">Wskaźnik Fast-Track 81,5%</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#C8D7C5] shadow-xs flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-800">{stats.red}</div>
              <div className="text-xs text-[#425B4A] font-semibold">Wykryte blokady (art. 2a / 83 KC)</div>
            </div>
          </div>
        </section>

        {/* Zakładki Nawigacji Pulpitu Urzędnika */}
        <div className="bg-white p-1.5 rounded-2xl border border-[#C8D7C5] shadow-xs flex flex-wrap gap-1.5 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("queue")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "queue"
                  ? "bg-[#10371E] text-white shadow-xs"
                  : "text-[#2E4B38] hover:bg-[#EFF3EA]"
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
                  ? "bg-[#10371E] text-white shadow-xs"
                  : "text-[#2E4B38] hover:bg-[#EFF3EA]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audyt Sprawy 360° &amp; Rozstrzygnięcie</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("employer_z3")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "employer_z3"
                  ? "bg-[#10371E] text-white shadow-xs"
                  : "text-[#2E4B38] hover:bg-[#EFF3EA]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Dział Płatnika Składek (Z-3 &amp; 1/2 etatu)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "analytics"
                  ? "bg-[#10371E] text-white shadow-xs"
                  : "text-[#2E4B38] hover:bg-[#EFF3EA]"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analityka i Efektywność ZUS</span>
            </button>
          </div>

          {/* Przycisk natychmiastowego odświeżenia z chmury */}
          <div className="pr-2 hidden sm:flex items-center gap-2 text-xs text-[#425B4A]">
            {lastSyncedAt && <span>Ostatnia synchronizacja: <strong>{lastSyncedAt}</strong></span>}
            <button
              type="button"
              onClick={loadCloudCases}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF3EA] hover:bg-[#DCE8D3] text-[#10371E] font-bold rounded-xl border border-[#B9CCB6] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#007834] ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Pobieranie..." : "Odśwież z chmury"}</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ZAKŁADKA 1: KOLEJKA WNIOSKÓW I TRIAGE                             */}
        {/* ================================================================= */}
        {activeTab === "queue" && (
          <div className="space-y-4">
            {/* Filtry i Wyszukiwarka */}
            <div className="bg-white p-4 rounded-2xl border border-[#C8D7C5] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#425B4A] mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#007834]" />
                  Poziom ryzyka:
                </span>
                <button
                  type="button"
                  onClick={() => setFilterRisk("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterRisk === "ALL"
                      ? "bg-[#10371E] text-white"
                      : "bg-[#EFF3EA] text-[#2E4B38] hover:bg-[#DCE8D3]"
                  }`}
                >
                  Wszystkie ({cases.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("GREEN")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterRisk === "GREEN"
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  🟢 Fast-Track ({stats.green})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("YELLOW")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterRisk === "YELLOW"
                      ? "bg-amber-700 text-white"
                      : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  🟡 Wymaga uwagi ({stats.yellow})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRisk("RED")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterRisk === "RED"
                      ? "bg-rose-700 text-white"
                      : "bg-rose-50 text-rose-900 border border-rose-300 hover:bg-rose-100"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  🔴 Blokada / Audyt ({stats.red})
                </button>
              </div>

              {/* Szukajka */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Szukaj po nazwisku, PESEL, NIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF8F2] border border-[#C8D7C5] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007834]"
                />
              </div>
            </div>

            {/* Tabela Spraw */}
            <div className="bg-white rounded-2xl border border-[#C8D7C5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFF3EA] border-b border-[#C8D7C5] text-[#10371E] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Sygnatura &amp; Wpływ</th>
                      <th className="py-3.5 px-4">Wnioskodawca &amp; PESEL</th>
                      <th className="py-3.5 px-4">Zatrudnienie &amp; Pensja</th>
                      <th className="py-3.5 px-4">Ocena Triage &amp; Ryzyko ZUS</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Działanie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((c) => {
                      const isSelected = selectedCase.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-[#FAF8F2] transition-colors ${
                            isSelected ? "bg-emerald-50/60" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{c.caseNumber}</span>
                              {c.source === "cloud" && (
                                <span title="Pobrane na żywo z centralnego rejestru ZUS">
                                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-[#007834]" />
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
                            <div className="text-[11px] text-slate-500">
                              {c.contractType === "employment"
                                ? "Umowa o pracę (etat)"
                                : c.contractType === "b2b"
                                ? "Działalność JDG"
                                : "Umowa zlecenie"}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-md">
                            {c.riskLevel === "GREEN" && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Fast-Track: Zgoda 81,5%</span>
                              </div>
                            )}
                            {c.riskLevel === "YELLOW" && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-lg font-bold text-[11px]">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>
                                  {c.riskCategory === "PREMATURE_AUDIT"
                                    ? `Wcześniak: ${c.hospitalDays || 30} dni w szpitalu (art. 180²)`
                                    : "Korekta terminu 21 dni"}
                                </span>
                              </div>
                            )}
                            {c.riskLevel === "RED" && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-100 text-rose-900 rounded-lg font-bold text-[11px]">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>
                                  {c.riskCategory === "JDG_DEBT_BLOCK"
                                    ? `Dług JDG: ${c.debtAmount || 350} zł (art. 2a)`
                                    : "Podejrzenie pozorności (art. 83 KC)"}
                                </span>
                              </div>
                            )}
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                              {c.riskReasons[0]}
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            {c.status === "APPROVED" ? (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ZATWIERDZONA
                              </span>
                            ) : c.status === "BLOCKED" ? (
                              <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-bold text-[10px] inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                WSTRZYMANA
                              </span>
                            ) : c.status === "AUDIT_REQUESTED" ? (
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold text-[10px] inline-flex items-center gap-1">
                                KONTROLA PŁATNIKA
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold text-[10px] inline-flex items-center gap-1">
                                NOWY WPŁYW
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCase(c);
                                setActiveTab("audit");
                              }}
                              className="px-3 py-1.5 bg-[#EFF3EA] hover:bg-[#DCE8D3] text-[#10371E] font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1 border border-[#B9CCB6]"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#007834]" />
                              <span>Audyt 360°</span>
                            </button>

                            {c.status === "NEW" && c.riskLevel === "GREEN" && (
                              <button
                                type="button"
                                onClick={() => handleApproveFastTrack(c)}
                                className="px-3 py-1.5 bg-[#007834] hover:bg-[#00622a] text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1 shadow-2xs"
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
        {/* ZAKŁADKA 2: AUDYT SPRAWY 360° (KOMPLETNE DANE PROCEDURALNE ZUS)   */}
        {/* ================================================================= */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            {/* Pasek Nagłówkowy Wybranej Sprawy */}
            <div className="bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#EFF3EA] border border-[#B9CCB6] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#007834]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#10371E] bg-[#EFF3EA] px-2.5 py-0.5 rounded-md border border-[#B9CCB6]">
                      {selectedCase.caseNumber}
                    </span>
                    {selectedCase.source === "cloud" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Cloud className="w-3 h-3 text-emerald-600" />
                        Centralny rejestr ZUS
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        selectedCase.riskLevel === "GREEN"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedCase.riskLevel === "YELLOW"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-rose-100 text-rose-900"
                      }`}
                    >
                      {selectedCase.riskLevel === "GREEN"
                        ? "🟢 Fast-Track (81,5%)"
                        : selectedCase.riskLevel === "YELLOW"
                        ? "🟡 Wymaga audytu medycznego / formalnego"
                        : "🔴 Blokada wypłaty (art. 2a / 83 KC)"}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#10371E] mt-1">
                    Audyt Sprawy 360° &bull; {selectedCase.applicantName}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("queue")}
                  className="px-3 py-2 bg-[#EFF3EA] hover:bg-[#DCE8D3] text-[#10371E] rounded-xl text-xs font-bold border border-[#B9CCB6] transition-colors"
                >
                  &larr; Wróć do kolejki
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Drukuj kartę</span>
                </button>
              </div>
            </div>

            {/* Siatka 4 Modułów Audytu 360° */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* MODUŁ 1: DANE WNIOSKODAWCY I DRUGIEGO RODZICA */}
              <div className="bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#EFF3EA] pb-3 text-sm font-bold text-[#10371E]">
                  <UserCheck className="w-4 h-4 text-[#007834]" />
                  <span>1. Ubezpieczeni: Wnioskodawca &amp; Drugi Rodzic</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#DCE8D3] space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#425B4A]">
                      Wnioskodawca (Ubezpieczona / Ubezpieczony):
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Imię i nazwisko:</span>
                      <strong className="text-slate-900 text-sm">{selectedCase.applicantName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Numer PESEL:</span>
                      <strong className="font-mono text-slate-800">{selectedCase.pesel}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Rachunek bankowy (IBAN):</span>
                      <span className="font-mono text-slate-800 text-[11px]">
                        {selectedCase.bankAccountNumber || "Brak (wypłata przekazem pocztowym)"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Kontakt e-mail / telefon:</span>
                      <span className="text-slate-700">
                        {selectedCase.email || "anna.kowalska@example.com"} &bull; {selectedCase.phone || "601 234 567"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#DCE8D3] space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#425B4A]">
                      Drugi Rodzic (Status praw rodzicielskich i WLB):
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Imię i nazwisko / PESEL:</span>
                      <strong className="text-slate-900 font-mono">
                        {selectedCase.otherParentName || "Piotr Kowalski"} ({selectedCase.otherParentPesel || "89110507890"})
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Prawo do 9 tyg. nieprzenoszalnych (WLB):</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Aktywne (stawka 70% z mocy dyrektywy)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Oświadczenie o podziale opieki:</span>
                      <span className="text-slate-700 font-semibold">Złożone w deklaracji ZAM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODUŁ 2: DANE DZIECKA I WERYFIKACJA MEDYCZNA */}
              <div className="bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#EFF3EA] pb-3 text-sm font-bold text-[#10371E]">
                  <Baby className="w-4 h-4 text-[#007834]" />
                  <span>2. Dziecko &amp; Weryfikacja Medyczna (art. 180² KP)</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#DCE8D3] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Imię dziecka:</span>
                      <strong className="text-slate-900 text-sm">{selectedCase.childName || "Jan Kowalski"}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Data porodu:</span>
                      <span className="font-bold text-slate-800">{selectedCase.childBirthDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Dni od porodu w dacie wpływu:</span>
                      <span className="font-bold text-slate-800">
                        {selectedCase.daysSinceBirth} dni{" "}
                        {selectedCase.daysSinceBirth <= 21 ? (
                          <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                            &le; 21 dni (ZACHOWANY TERMIN 81,5%)
                          </span>
                        ) : (
                          <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                            &gt; 21 dni (KONWERSJA 100% / 70%)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Tydzień porodu i waga:</span>
                      <span className="font-bold text-slate-800">
                        {selectedCase.birthWeek || 39}. tydzień ciąży &bull;{" "}
                        {selectedCase.birthWeightGrams || (selectedCase.isPremature ? 1420 : 3450)} g
                      </span>
                    </div>
                  </div>

                  {/* Kwalifikacja hospitalizacji i urlopu uzupełniającego */}
                  <div
                    className={`p-3.5 rounded-xl border space-y-1.5 ${
                      selectedCase.isPremature
                        ? "bg-amber-50 border-amber-300 text-amber-950"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-emerald-700" />
                      <span>
                        {selectedCase.isPremature
                          ? `Hospitalizacja noworodka: ${selectedCase.hospitalDays || 32} dni`
                          : "Poród o czasie (brak hospitalizacji patologicznej)"}
                      </span>
                    </div>
                    {selectedCase.isPremature ? (
                      <>
                        <div className="text-[11px] text-amber-800">
                          Oddział: {selectedCase.hospitalName || "Szpital Kliniczny im. ks. Anny Mazowieckiej (OION)"}
                        </div>
                        <div className="text-[11px] font-bold text-amber-900 bg-white/80 p-2 rounded border border-amber-200">
                          Kwalifikacja prawna: Art. 180² § 2 KP &rarr; Przysługuje do 8 dodatkowych tygodni uzupełniającego urlopu macierzyńskiego w stawce 100%!
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-emerald-800">
                        Zwolnienie ze szpitala w standardowym terminie. Podstawowy wymiar urlopu: 20 tyg. macierzyńskiego + 41 tyg. rodzicielskiego.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* MODUŁ 3: PŁATNIK SKŁADEK & REJESTR SKŁADKOWY NRS */}
              <div className="bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#EFF3EA] pb-3 text-sm font-bold text-[#10371E]">
                  <Building2 className="w-4 h-4 text-[#007834]" />
                  <span>3. Płatnik Składek &amp; Weryfikacja Długu (art. 2a)</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#DCE8D3] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Płatnik składek:</span>
                      <strong className="text-slate-900">{selectedCase.employerName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">NIP płatnika:</span>
                      <strong className="font-mono text-slate-800">{selectedCase.employerNip}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Wielkość pracodawcy (&gt;20 ubezpieczonych):</span>
                      <span className="font-bold text-slate-800">
                        {selectedCase.isEmployerOver20 ? "Tak (pracodawca sam wypłaca zasiłek)" : "Nie (zasiłek wypłaca ZUS)"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Podstawa wymiaru składek:</span>
                      <span className="font-bold text-emerald-800 font-mono text-sm">
                        {selectedCase.monthlySalaryGross.toLocaleString("pl-PL")} zł brutto
                      </span>
                    </div>
                  </div>

                  {/* Weryfikacja art. 2a (Zadłużenie na koncie NRS) */}
                  <div
                    className={`p-3.5 rounded-xl border space-y-1.5 ${
                      selectedCase.hasDebt
                        ? "bg-rose-50 border-rose-300 text-rose-950"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-slate-700" />
                        <span>Konto składkowe ubezpieczonego (NRS):</span>
                      </div>
                      <span className="font-mono font-bold">
                        {selectedCase.hasDebt ? `Zadłużenie: ${selectedCase.debtAmount?.toFixed(2)} zł` : "Brak zaległości (0,00 zł)"}
                      </span>
                    </div>
                    {selectedCase.hasDebt ? (
                      <div className="text-[11px] text-rose-800 space-y-1">
                        <p>
                          <strong>BLOKADA WYPŁATY Z MOCY PRAWA:</strong> Zadłużenie przekracza 1% minimalnego wynagrodzenia (48,06 zł w 2026 r.).
                        </p>
                        <p className="bg-white/80 p-2 rounded border border-rose-200">
                          Płatnik ma 6 miesięcy od dnia porodu na spłatę z prawem do wyrównania. Jeśli nie spłaci w 6 miesięcy — prawo do zasiłku przedawnia się z mocy art. 2a ust. 2.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-emerald-800">
                        Stan rozliczeń prawidłowy. Składki na ubezpieczenie chorobowe i wypadkowe opłacane terminowo.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* MODUŁ 4: PODPIS CYFROWY, UPO I STATUS e-ZLA */}
              <div className="bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#EFF3EA] pb-3 text-sm font-bold text-[#10371E]">
                  <FileSignature className="w-4 h-4 text-[#007834]" />
                  <span>4. Podpis Cyfrowy, UPO &amp; Rejestr e-ZLA</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#DCE8D3] space-y-1.5 font-mono text-[11px]">
                    <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">
                      Urzędowe Poświadczenie Odbioru (UPO):
                    </div>
                    <div className="text-slate-800 truncate font-bold">
                      Hash: {selectedCase.upoHash}
                    </div>
                    <div className="text-slate-600 font-sans">
                      Autoryzacja: Podpis zaufany obywatela (Węzeł Krajowy gov.pl) &bull; Zweryfikowano
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#DCE8D3] space-y-1.5">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">
                      Elektroniczne zwolnienie lekarskie (e-ZLA):
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Rejestr e-ZLA ZUS:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Kod „B” (Ciąża) &bull; 100% płatne
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Wystawione przez lekarza prowadzącego: dr n. med. A. Wiśniewski (NPWZ: 4891204)
                    </div>
                  </div>

                  {/* Status wydanej decyzji jeśli istnieje */}
                  {selectedCase.decisionDocument && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                      <div className="font-bold text-emerald-900 flex items-center justify-between">
                        <span>Wydana Decyzja Administracyjna:</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                          Podpisana kwalifikowanie
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Podpisał: {selectedCase.decisionDocument.officerSignature} &bull;{" "}
                        {new Date(selectedCase.decisionDocument.generatedAt).toLocaleString("pl-PL")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PASEK ROZSTRZYGNIĘCIA I AKCJI INSPEKTORA NA DOLE */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#10371E] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFF3EA] pb-3">
                <div>
                  <div className="text-xs font-bold text-[#425B4A] uppercase tracking-wider">
                    Rozstrzygnięcie sprawy i algorytm decyzyjny ZUS:
                  </div>
                  <div className="text-base font-black text-[#10371E] mt-0.5 flex items-center gap-2">
                    <span>
                      Sugerowana sentencja:{" "}
                      {selectedCase.suggestedDecision === "AUTO_APPROVE_81_5"
                        ? "Przyznanie uśrednionego zasiłku macierzyńskiego w stawce 81,5%"
                        : selectedCase.suggestedDecision === "BLOCK_PAYOUT_DEBT"
                        ? "Wstrzymanie wypłaty świadczenia z mocy prawa (art. 2a dłużnik JDG)"
                        : selectedCase.suggestedDecision === "AUDIT_HOSPITAL_DOCS"
                        ? "Weryfikacja karty ze szpitala i przyznanie do 8 tyg. urlopu uzupełniającego 100%"
                        : selectedCase.suggestedDecision === "SEND_TO_AUDIT_DEPT"
                        ? "Skierowanie do Wydziału Kontroli Płatników (art. 83 KC)"
                        : "Korekta stawki na 100% i 70% (art. 30a ust. 2)"}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Wyliczone świadczenie:</div>
                  <div className="text-lg font-black text-emerald-800 font-mono">
                    ok. {Math.round(selectedCase.monthlySalaryGross * 0.8629 * 0.815).toLocaleString("pl-PL")} zł / m-c
                  </div>
                </div>
              </div>

              {/* Przyciski decyzyjne dla urzędnika */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {selectedCase.status !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => handleApproveFastTrack(selectedCase)}
                    className="flex-1 py-3 px-5 bg-[#007834] hover:bg-[#00622a] text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Akceptuj z automatu (1-Click Podpis Kwalifikowany)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenDecisionModal(selectedCase)}
                  className="py-3 px-5 bg-[#FAF8F2] hover:bg-[#EFF3EA] text-[#10371E] rounded-xl text-xs sm:text-sm font-bold border border-[#B9CCB6] transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-[#007834]" />
                  <span>Podgląd i edycja decyzji administracyjnej</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequisitionModalOpen(true)}
                  className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs sm:text-sm font-bold border border-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-amber-700" />
                  <span>Wezwij do uzupełnienia braków (art. 64 § 2 KPA)</span>
                </button>

                {selectedCase.riskCategory === "SUSPECT_CONTRACT" && (
                  <button
                    type="button"
                    onClick={handleSendToAuditDept}
                    className="py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs sm:text-sm font-bold border border-purple-300 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Skieruj do Kontroli Płatników (art. 83 KC)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ZAKŁADKA 3: DZIAŁ PŁATNIKA SKŁADEK (Z-3 & 1/2 ETATU)              */}
        {/* ================================================================= */}
        {activeTab === "employer_z3" && (
          <div className="space-y-6">
            <div className="bg-[#0F2918] text-white p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#007834]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Moduł dla Płatników Składek zatrudniających &gt;20 ubezpieczonych</span>
                </div>
                <h2 className="text-xl font-bold">
                  Zaświadczenie Płatnika ZUS Z-3 oraz Planer Pracy na Urlopie (art. 182¹ᶠ KP)
                </h2>
                <p className="text-xs text-emerald-100 max-w-3xl leading-relaxed">
                  Zgodnie z art. 61 ustawy zasiłkowej pracodawcy zatrudniający powyżej 20 osób sami ustalają prawo i wypłacają zasiłki. Moduł automatyzuje potrącenie 13,71% oraz proporcjonalne wydłużenie urlopu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sekcja 1: Generator ZUS Z-3 */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EFF3EA] pb-3">
                  <h3 className="text-sm font-bold text-[#10371E] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#007834]" />
                    <span>Zaświadczenie Płatnika Składek (ZUS Z-3)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
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
                      className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#C8D7C5] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">PESEL</label>
                    <input
                      type="text"
                      value={z3EmployeePesel}
                      onChange={(e) => setZ3EmployeePesel(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#C8D7C5] rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Płatnik składek</label>
                    <input
                      type="text"
                      value={z3EmployerName}
                      onChange={(e) => setZ3EmployerName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#C8D7C5] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIP Płatnika</label>
                    <input
                      type="text"
                      value={z3EmployerNip}
                      onChange={(e) => setZ3EmployerNip(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#C8D7C5] rounded-lg font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="block font-semibold text-slate-700 mb-1">Wynagrodzenie zasadnicze brutto (PLN)</label>
                    <input
                      type="number"
                      value={z3EmployeeSalary}
                      onChange={(e) => setZ3EmployeeSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#C8D7C5] rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* Tabela 12 miesięcy */}
                <div className="border border-[#C8D7C5] rounded-xl overflow-hidden text-xs">
                  <div className="bg-[#EFF3EA] px-3 py-2 font-bold text-[#10371E] text-[11px] border-b border-[#C8D7C5]">
                    Zestawienie przychodów z ostatnich 12 miesięcy (art. 36 ustawy)
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F2] text-slate-500 text-[10px]">
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
                  <div className="bg-[#EFF3EA] p-3 border-t border-[#C8D7C5] flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                    <span className="text-[#10371E]">Średnia dzienna podstawa wymiaru (dzielnik 30):</span>
                    <span className="text-base text-emerald-800 font-mono">
                      {z3Cert.dailyBenefitBase.toFixed(2)} zł / dzień
                    </span>
                  </div>
                </div>
              </div>

              {/* Sekcja 2: Planer Łączenia z Pracą na 1/2 etatu */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EFF3EA] pb-3">
                  <h3 className="text-sm font-bold text-[#10371E] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Planer 1/2 Etatu (art. 182¹ᶠ KP)</span>
                  </h3>
                  <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold border border-purple-200">
                    Wydłużenie proporcjonalne
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Pracownik może łączyć urlop rodzicielski z pracą u swojego pracodawcy w wymiarze do 1/2 etatu. Urlop ulega wtedy proporcjonalnemu wydłużeniu.
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
                            ? "bg-purple-700 text-white border-purple-700"
                            : "bg-[#FAF8F2] text-slate-700 border-[#C8D7C5]"
                        }`}
                      >
                        1/4 etatu (25%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorkSharingFte(0.5)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                          workSharingFte === 0.5
                            ? "bg-purple-700 text-white border-purple-700"
                            : "bg-[#FAF8F2] text-slate-700 border-[#C8D7C5]"
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
                    <span className="font-semibold">Dodatkowy pełny urlop macierzyński:</span>
                    <span className="font-bold text-sm text-purple-900">
                      +{workSharing.extensionWeeksCount} tygodni
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-purple-200/60 pt-2">
                    <span className="font-semibold">Łączny wymiar urlopu po wydłużeniu:</span>
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
          <div className="bg-white p-6 rounded-2xl border border-[#C8D7C5] shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#10371E]">
                Pulpit Efektywności Operacyjnej ZUS (Model 2026)
              </h2>
              <p className="text-xs text-[#425B4A] mt-0.5">
                Porównanie tradycyjnego postępowania wyjaśniającego z automatycznym silnikiem reguł i triage&apos;u ZUS połączonym z centralną bazą spraw ZUS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#C8D7C5] space-y-2">
                <div className="text-[#425B4A] font-bold uppercase text-[10px]">Czas obsługi wniosku</div>
                <div className="text-2xl font-black text-emerald-800">1.8 min</div>
                <p className="text-slate-600 text-[11px]">
                  Redukcja o 92% w stosunku do średniej krajowej (18 dni w procedurze papierowej).
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#C8D7C5] space-y-2">
                <div className="text-[#425B4A] font-bold uppercase text-[10px]">Oszczędność czasu urzędników</div>
                <div className="text-2xl font-black text-[#10371E]">~18 400 h</div>
                <p className="text-slate-600 text-[11px]">
                  Rocznie w skali pojedynczego Oddziału ZUS dzięki automatycznemu triage&apos;owi.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#C8D7C5] space-y-2">
                <div className="text-[#425B4A] font-bold uppercase text-[10px]">Prewencja sporów sądowych</div>
                <div className="text-2xl font-black text-purple-800">-84%</div>
                <p className="text-slate-600 text-[11px]">
                  Dzięki standardowi Prostej Polszczyzny i natychmiastowym ostrzeżeniom o długu (art. 2a).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Intranetowa Stopka Bezpieczeństwa ZSI KSI ZUS */}
      <footer className="bg-[#0F2918] border-t border-emerald-800 text-emerald-200 py-4 px-4 sm:px-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Zakład Ubezpieczeń Społecznych &bull; Pulpit Operacyjny KSI ZUS 2026.2</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-300">
            <span>Sesja: <strong className="text-white font-mono">TLS 1.3 Kwalifikowany</strong></span>
            <span>&bull;</span>
            <span>Wydział Świadczeń Krótkoterminowych</span>
            <span>&bull;</span>
            <Link href="/" className="text-white hover:underline font-bold">
              Serwis Obywatela (zus.pl) &rarr;
            </Link>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* MODAL 1: PODGLĄD I EDYCJA DECYZJI ADMINISTRACYJNEJ (NA ŻĄDANIE)     */}
      {/* =================================================================== */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-5 border border-[#C8D7C5] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EFF3EA] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#10371E] flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-[#007834]" />
                  <span>Decyzja Administracyjna ZUS &bull; {selectedCase.caseNumber}</span>
                </h3>
                <p className="text-xs text-[#425B4A]">
                  Ubezpieczona: <strong>{selectedCase.applicantName}</strong> (PESEL: {selectedCase.pesel})
                </p>
              </div>

              {/* Przełącznik Językowy */}
              <div className="flex bg-[#EFF3EA] p-1 rounded-xl text-xs font-bold border border-[#B9CCB6]">
                <button
                  type="button"
                  onClick={() => handleChangeDecisionLanguage("plain")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    decisionLanguage === "plain"
                      ? "bg-[#10371E] text-white shadow-xs"
                      : "text-[#2E4B38] hover:text-[#10371E]"
                  }`}
                >
                  Prosta Polszczyzna
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeDecisionLanguage("formal")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    decisionLanguage === "formal"
                      ? "bg-[#10371E] text-white shadow-xs"
                      : "text-[#2E4B38] hover:text-[#10371E]"
                  }`}
                >
                  Tekst Prawny KPA
                </button>
              </div>
            </div>

            {/* Edytowalny obszar decyzji */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Treść decyzji (możesz dopisać uwagi lub numer załącznika):</span>
                <span className="text-[11px] text-[#425B4A]">Możliwa bezpośrednia edycja</span>
              </label>
              <textarea
                value={decisionCustomText}
                onChange={(e) => setDecisionCustomText(e.target.value)}
                rows={12}
                className="w-full p-4 bg-[#FAF8F2] border border-[#C8D7C5] rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#007834] resize-none flex-1"
              />
            </div>

            {/* Pasek podpisu cyfrowego */}
            <div className="p-3 bg-[#EFF3EA] border border-[#B9CCB6] rounded-xl text-xs flex items-center justify-between text-[#10371E]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#007834]" />
                <span>Podpis kwalifikowany: <strong>{officerName} ({officerId})</strong></span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">Certyfikat SHA-256 ważny</span>
            </div>

            {/* Przyciski akcji modala */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#EFF3EA]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Drukuj</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([decisionCustomText], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `DECYZJA_${selectedCase.caseNumber.replace(/\//g, "_")}.txt`;
                    a.click();
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pobierz</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSignCustomDecision}
                  className="px-5 py-2.5 bg-[#007834] hover:bg-[#00622a] text-white rounded-xl text-xs font-extrabold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zatwierdź, podpisz i wyślij na PUE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: WEZWANIE DO USUNIĘCIA BRAKÓW FORMALNYCH (art. 64 § 2 KPA)  */}
      {/* =================================================================== */}
      {requisitionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 border border-[#C8D7C5] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EFF3EA] pb-3">
              <h3 className="text-base font-bold text-[#10371E] flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <span>Wezwanie do uzupełnienia braków formalnych (art. 64 § 2 KPA)</span>
              </h3>
              <button
                type="button"
                onClick={() => setRequisitionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Sprawa: <strong>{selectedCase.caseNumber}</strong> &bull; Wnioskodawca: <strong>{selectedCase.applicantName}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jakiego dokumentu brakuje w aktach?</label>
                <select
                  value={requisitionDocType}
                  onChange={(e) => setRequisitionDocType(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F2] border border-[#C8D7C5] rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="karta_szpital">Karta informacyjna leczenia szpitalnego noworodka (OION - art. 180² KP)</option>
                  <option value="zaświadczenie_z3">Zaświadczenie płatnika składek ZUS Z-3 (od pracodawcy)</option>
                  <option value="dowód_spłaty">Dowód uregulowania zadłużenia z art. 2a ustawy zasiłkowej</option>
                  <option value="akt_urodzenia">Odpis skrócony aktu urodzenia (niezgodność danych PESEL)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Termin na uzupełnienie:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRequisitionDaysLimit(7)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      requisitionDaysLimit === 7
                        ? "bg-[#10371E] text-white border-[#10371E]"
                        : "bg-[#FAF8F2] text-slate-700 border-[#C8D7C5]"
                    }`}
                  >
                    7 dni (standard KPA)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequisitionDaysLimit(14)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      requisitionDaysLimit === 14
                        ? "bg-[#10371E] text-white border-[#10371E]"
                        : "bg-[#FAF8F2] text-slate-700 border-[#C8D7C5]"
                    }`}
                  >
                    14 dni (rodzice wcześniaków)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                <strong>Skutek procesowy:</strong> Wezwanie zostanie doręczone na skrzynkę ubezpieczonej w portalu PUE/eZUS z Urzędowym Poświadczeniem Doręczenia (UPD).
              </div>
            </div>

            {requisitionSentSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Wezwanie zostało wysłane na konto PUE obywatela!</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFF3EA]">
                <button
                  type="button"
                  onClick={() => setRequisitionModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSendRequisition}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Wyślij wezwanie elektroniczne</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: POTWIERDZENIE PODPISANIA DECYZJI                           */}
      {/* =================================================================== */}
      {decisionSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-[#C8D7C5] animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#10371E]">
                Decyzja ZUS została pomyślnie podpisana!
              </h3>
              {signedCaseNumber && (
                <div className="text-[11px] font-mono text-emerald-900 bg-emerald-50 py-1 px-3 rounded-lg border border-emerald-300 inline-block font-bold">
                  Znak sprawy: {signedCaseNumber}
                </div>
              )}
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                Złożono bezpieczny podpis kwalifikowany inspektora (<strong>{officerName}</strong>).
                Dokument został zsynchronizowany z centralną bazą spraw ZUS i przekazany do profilu rodzica na PUE/eZUS.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDecisionSuccessModal(false)}
              className="w-full py-2.5 bg-[#007834] hover:bg-[#00622a] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Zamknij i wróć do kolejki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
