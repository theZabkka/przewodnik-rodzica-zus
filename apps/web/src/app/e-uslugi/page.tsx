"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
 ArrowLeft,
 ArrowRight,
 Check,
 ChevronRight,
 BookOpen,
} from "lucide-react";
import { calculateBenefits, DEFAULT_LEGISLATIVE_2026 } from "@hacknation/shared";
import { ZusLogo } from "../../components/ZusLogo";
import { DocumentZamIllustration } from "@/components/ZusIllustrations";
import { useParentProfile } from "@/context/ParentProfileContext";

function validatePesel(value: string): boolean {
 const digits = value.replace(/\D/g, "");
 if (digits.length !== 11) return false;
 const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
 const sum = weights.reduce((acc, w, idx) => acc + w * Number(digits[idx]), 0);
 const control = (10 - (sum % 10)) % 10;
 return control === Number(digits[10]);
}

function validateNip(value: string): boolean {
 const digits = value.replace(/\D/g, "");
 if (digits.length !== 10) return false;
 const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
 const sum = weights.reduce((acc, w, idx) => acc + w * Number(digits[idx]), 0);
 return sum % 11 === Number(digits[9]);
}

function validateNrb(value: string): boolean {
 const digits = value.replace(/\D/g, "");
 return digits.length === 26;
}

function ZamQrCode({ seed }: { seed: string }) {
 const size = 21;
 const cells: boolean[][] = [];
 let hash = 2166136261;
 for (let i = 0; i < seed.length; i++) {
 hash ^= seed.charCodeAt(i);
 hash = Math.imul(hash, 16777619);
  }
 const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

 for (let r = 0; r < size; r++) {
 const row: boolean[] = [];
 for (let c = 0; c < size; c++) {
 if (isFinder(r, c)) {
 const lr = r >= size - 7 ? r - (size - 7) : r;
 const lc = c >= size - 7 ? c - (size - 7) : c;
 const on =
 lr === 0 ||
 lr === 6 ||
 lc === 0 ||
 lc === 6 ||
          (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
 row.push(on);
      } else {
 const bit = ((hash >>> ((r * 7 + c * 13) % 24)) ^ (r * 31 + c * 17)) & 1;
 row.push(bit === 1);
      }
    }
 cells.push(row);
  }

 return (
    <svg
 viewBox={`0 0 ${size} ${size}`}
 className="w-14 h-14 shrink-0 border border-slate-300 bg-white p-0.5"
 aria-label="Kod QR weryfikacji dokumentu ZUS ZAM"
    >
      {cells.map((row, r) =>
 row.map((on, c) =>
 on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" /> : null
        )
      )}
    </svg>
  );
}

export default function EUslugiPage() {
 const { profile, openGlossary } = useParentProfile();
 const [activeTab, setActiveTab] = useState<"zam" | "mobywatel" | "pue" | "ezla">("zam");

  // Stan widoku kreatora wniosku ZAM
 const [zamStep, setZamStep] = useState<number>(1);
 const totalZamSteps = 6;

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
 const [prefilledFromCalc, setPrefilledFromCalc] = useState<boolean>(false);

  // Automatyczne wczytanie danych z Profilu Rodziny lub Kalkulatora Świadczeń
 useEffect(() => {
 try {
 if (profile) {
 if (profile.contractType) setContractType(profile.contractType);
 if (typeof profile.monthlySalaryGross === "number")
 setMonthlySalaryGross(profile.monthlySalaryGross);
 if (typeof profile.childrenCount === "number")
 setChildrenCount(profile.childrenCount);
 if (typeof profile.submittedIn21Days === "boolean")
 setChosenRate(profile.submittedIn21Days ? "815" : "100_70");
 if (typeof profile.isPretermOrHospitalized === "boolean")
 setIsPremature(profile.isPretermOrHospitalized);
 if (typeof profile.hospitalDays === "number")
 setHospitalDays(profile.hospitalDays);
 if (typeof profile.hasLifeCertificate === "boolean")
 setHasLifeCert(profile.hasLifeCertificate);
 setPrefilledFromCalc(true);
      }

 const params = new URLSearchParams(window.location.search);
 if (params.get("prefill") === "1") {
 const raw = window.localStorage.getItem("zus_zam_prefill");
 if (raw) {
 const parsed = JSON.parse(raw) as {
 contractType?: "employment" | "mandate" | "b2b";
 monthlySalaryGross?: number;
 childrenCount?: number;
 chosenRate?: "815" | "100_70";
 isPremature?: boolean;
 hospitalDays?: number;
 hasLifeCert?: boolean;
          };
 if (parsed.contractType) setContractType(parsed.contractType);
 if (typeof parsed.monthlySalaryGross === "number")
 setMonthlySalaryGross(parsed.monthlySalaryGross);
 if (typeof parsed.childrenCount === "number")
 setChildrenCount(parsed.childrenCount);
 if (parsed.chosenRate) setChosenRate(parsed.chosenRate);
 if (typeof parsed.isPremature === "boolean")
 setIsPremature(parsed.isPremature);
 if (typeof parsed.hospitalDays === "number")
 setHospitalDays(parsed.hospitalDays);
 if (typeof parsed.hasLifeCert === "boolean")
 setHasLifeCert(parsed.hasLifeCert);
 setActiveTab("zam");
 setPrefilledFromCalc(true);
        }
      }
    } catch {
      // Ignoruj błędy parsowania localStorage
    }
  }, [profile]);

  // Walidacja formalna pól ZUS
 const peselValid = useMemo(() => validatePesel(pesel), [pesel]);
 const nipValid = useMemo(() => validateNip(employerNip), [employerNip]);
 const nrbValid = useMemo(() => validateNrb(bankAccount), [bankAccount]);

  // Automatyczny kalkulator żelaznego terminu 21 dni od porodu (art. 30a)
 const deadline21Info = useMemo(() => {
 if (!childBirthDate) return null;
 const birth = new Date(`${childBirthDate}T00:00:00`);
 if (Number.isNaN(birth.getTime())) return null;
 const deadline = new Date(birth.getTime() + 21 * 24 * 60 * 60 * 1000);
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
 return {
 deadlineStr: deadline.toLocaleDateString("pl-PL"),
 daysLeft: diffDays,
 isExpired: diffDays < 0,
    };
  }, [childBirthDate]);

  // Dynamiczna lista wymaganych załączników do kartki A4
 const requiredAttachments = useMemo(() => {
 const items: string[] = [
      "Skrócony odpis aktu urodzenia dziecka (lub pobranie automatyczne z rejestru USC).",
 ];
 if (contractType === "employment" || contractType === "mandate") {
 items.push("Zaświadczenie płatnika składek ZUS Z-3 / Z-3a (przekazywane przez pracodawcę).");
    } else {
 items.push("Zaświadczenie Z-3b dla osoby prowadzącej pozarolniczą działalność (JDG).");
    }
 if (isPremature) {
 items.push(
        `Zaświadczenie ze szpitala o okresie pobytu dziecka (${hospitalDays} dni) oraz tygodniu ciąży / masie urodzeniowej (art. 180² KP).`
      );
    }
 if (hasLifeCert) {
 items.push(
        "Zaświadczenie lekarskie potwierdzające ciężkie i nieodwracalne upośledzenie lub nieuleczalną chorobę (ustawa „Za życiem”)."
      );
    }
 return items;
  }, [contractType, isPremature, hospitalDays, hasLifeCert]);

 const hasBlockingJdgDebt =
 contractType === "b2b" && jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross;

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

 const submittedCase = {
 id: `case-${randomId}`,
 caseNumber: `ZUS/2026/ZAM/${randomId}`,
 submissionDate: now.toISOString().split("T")[0],
 applicantName: parentName,
 pesel,
 bankAccountNumber: bankAccount,
 benefitType: chosenRate === "815" ? "MATERNITY_PARENTAL_UNIFIED" : "MATERNITY_STANDARD",
 contractType,
 monthlySalaryGross,
 childBirthDate,
 daysSinceBirth: 4,
 isPremature,
 birthWeek: isPremature ? 31 : 39,
 hospitalDays: isPremature ? hospitalDays : 0,
 employerNip,
 employerName: contractType === "b2b" ? "Własna Działalność Gospodarcza" : "Pracodawca Zgłoszony w ZUS",
 isEmployerOver20: contractType === "employment",
 hasDebt: contractType === "b2b" && jdgDebtAmount > 48.06,
 debtAmount: contractType === "b2b" ? jdgDebtAmount : 0,
 insuranceTenureDays: 365,
 riskLevel: isPremature ? "YELLOW" : (contractType === "b2b" && jdgDebtAmount > 48.06 ? "RED" : "GREEN"),
 riskCategory: isPremature ? "PREMATURE_AUDIT" : (contractType === "b2b" && jdgDebtAmount > 48.06 ? "JDG_DEBT_BLOCK" : "FAST_TRACK"),
 riskReasons: [
          `Wniosek złożony w portalu obywatelskim (UPO: UPO-ZUS-2026-${randomId})`,
 isPremature ? `Zgłoszono hospitalizację noworodka (${hospitalDays} dni)` : "Wniosek terminowy 81,5%",
 ],
 suggestedDecision: isPremature ? "AUDIT_HOSPITAL_DOCS" : "AUTO_APPROVE_81_5",
 status: "NEW",
 upoHash: hash,
      };

 try {
 const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("zus_submitted_applications") || "[]") : [];
 localStorage.setItem("zus_submitted_applications", JSON.stringify([submittedCase, ...stored]));
      } catch (err) {
 console.error("Failed to store submitted application in local registry", err);
      }

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
 rateVariant:
 chosenRate === "815"
            ? "81.5% uśredniona w 21 dni"
            : "100% macierzyński + 70% rodzicielski",
 maternityWeeks: liveCalculation.maternityWeeks,
 supplementaryWeeks: liveCalculation.supplementaryWeeks,
 parentalMomWeeks: liveCalculation.parentalMomWeeks,
 parentalDadReservedWeeks: liveCalculation.parentalDadReservedWeeks,
 totalBenefitSumGrossPln: liveCalculation.totalBenefitAmountSum,
      },
    };

 const blob = new Blob([JSON.stringify(payload, null, 2)], {
 type: "application/json",
    });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6 w-full">
      {/* Pasek Okruszków (Breadcrumbs) ZUS */}
      <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
        <Link href="/">Strona główna</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/e-uslugi">E-usługi</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">
 Generator wniosku ZAM i portal eZUS
        </span>
      </nav>

      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dce1e5] pb-5">
        <div className="flex items-center gap-5">
          <div className="hidden lg:block w-36 shrink-0">
            <DocumentZamIllustration className="w-full h-auto" />
          </div>
          <div>
          <div className="flex items-center gap-2">
            <span className="zus-badge">
              <FileText className="w-3.5 h-3.5 mr-1 text-[#007834]" />
 ZUS PUE / eZUS &bull; OFICJALNY SYSTEM ELEKTRONICZNY
            </span>
            <span className="zus-badge-navy">DRUK ZAM 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00416E] tracking-tight mt-1.5">
 Wniosek ZAM i usługi elektroniczne ZUS
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
 Wypełnij zunifikowany wniosek o zasiłek macierzyński (druk ZAM) krok po kroku. Poniżej formularza na bieżąco generowany jest autentyczny podgląd urzędowego dokumentu ZUS.
          </p>
        </div>
        </div>

        {/* Węzeł krajowy & status tożsamości */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded flex items-center gap-2.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#007834] animate-pulse"></div>
            <div className="text-xs">
              <span className="font-bold text-[#007834] block leading-none">Węzeł krajowy gov.pl</span>
              <span className="text-[10px] text-emerald-800">KSI ZUS &bull; Połączono</span>
            </div>
          </div>

          <button
 type="button"
 onClick={() => setIsLoggedIn(!isLoggedIn)}
 className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 ${
 isLoggedIn
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                : "bg-[#007834] hover:bg-[#00622a] text-white border-[#007834]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? "Zalogowano (Wyloguj)" : "Zaloguj się"}</span>
          </button>
        </div>
      </div>

      {/* Nawigacja Zakładkowa ZUS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#dce1e5] pb-2">
        <button
 type="button"
 onClick={() => setActiveTab("zam")}
 className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${
 activeTab === "zam"
              ? "bg-[#007834] text-white "
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Wniosek ZAM (krok po kroku)</span>
        </button>

        <button
 type="button"
 onClick={() => setActiveTab("mobywatel")}
 className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${
 activeTab === "mobywatel"
              ? "bg-[#007834] text-white "
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>mObywatel 2.0 (Alerty & mDowód)</span>
        </button>

        <button
 type="button"
 onClick={() => setActiveTab("pue")}
 className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${
 activeTab === "pue"
              ? "bg-[#007834] text-white "
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>PUE / eZUS (Konto płatnika & zadłużenie JDG)</span>
        </button>

        <button
 type="button"
 onClick={() => setActiveTab("ezla")}
 className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${
 activeTab === "ezla"
              ? "bg-[#007834] text-white "
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>e-ZLA (Zwolnienia lekarskie w ciąży kod B)</span>
        </button>

        <button
 type="button"
 onClick={() => openGlossary()}
 className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-[#00416E] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors "
        >
          <BookOpen className="w-3.5 h-3.5 text-[#00416E]" />
          <span>Trudne słowa (Słownik)</span>
        </button>
      </div>

      {/* ZAKŁADKA 1: GENERATOR WNIOSKU ZAM KROK PO KROKU */}
      {activeTab === "zam" && (
        <div className="flex flex-col gap-8 w-full">
          {prefilledFromCalc && (
            <div className="p-3.5 bg-emerald-50 border border-[#007834] rounded flex items-center justify-between gap-3 text-xs text-emerald-950 print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                <span>
                  <strong>Dane zostały przeniesione z Kalkulatora Świadczeń!</strong> Zweryfikuj dane osobowe i numer konta — kartka A4 poniżej jest już uzupełniona.
                </span>
              </div>
              <button
 type="button"
 onClick={() => setPrefilledFromCalc(false)}
 className="text-[11px] font-bold text-[#007834] hover:underline shrink-0"
              >
 Ukryj
              </button>
            </div>
          )}
          {/* GÓRNY BLOK: FORMULARZ KROK PO KROKU */}
          <div className="bg-white border border-[#dee2e6] rounded p-6 sm:p-8 space-y-6">
            {/* Pasek postępu kroków wniosku */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#007834] uppercase tracking-wider">
 Krok {zamStep} z {totalZamSteps}:{" "}
                  {zamStep === 1 && "Dane wnioskodawcy (rodzica)"}
                  {zamStep === 2 && "Forma zatrudnienia i płatnik składek"}
                  {zamStep === 3 && "Dane dziecka / dzieci"}
                  {zamStep === 4 && "Okoliczności szczególne w porodzie"}
                  {zamStep === 5 && "Wybór wnioskowanej stawki zasiłku"}
                  {zamStep === 6 && "Weryfikacja, podpis cyfrowy i wysyłka"}
                </span>
                <span className="text-slate-500 font-medium">
                  {Math.round((zamStep / totalZamSteps) * 100)}% wypełniono
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
 className="h-full bg-[#007834] transition-all duration-300 rounded-full"
 style={{ width: `${(zamStep / totalZamSteps) * 100}%` }}
                ></div>
              </div>

              {/* Szybkie przełączniki kroków */}
              <div className="hidden sm:grid grid-cols-6 gap-2 pt-1 text-center">
                {[
                  { step: 1, label: "1. Rodzic" },
                  { step: 2, label: "2. Płatnik" },
                  { step: 3, label: "3. Dziecko" },
                  { step: 4, label: "4. Szpital" },
                  { step: 5, label: "5. Stawka" },
                  { step: 6, label: "6. Podpis" },
 ].map((s) => (
                  <button
 key={s.step}
 type="button"
 onClick={() => setZamStep(s.step)}
 className={`py-1 px-2 rounded text-[11px] font-bold border transition-colors ${
 zamStep === s.step
                        ? "bg-[#007834] text-white border-[#007834]"
                        : zamStep > s.step
                        ? "bg-emerald-50 text-[#007834] border-[#c2e4cc]"
                        : "bg-[#f4f6f7] text-slate-500 border-[#dce1e5] hover:bg-slate-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Treść bieżącego pytania / kroku */}
            <div className="min-h-[220px] flex flex-col justify-between pt-2">
              {/* KROK 1: Dane wnioskodawcy */}
              {zamStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Część I wniosku
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00416E]">
 Dane osobowe wnioskodawcy (rodzica ubiegającego się o zasiłek)
                    </h3>
                    <p className="text-xs text-slate-600">
 Podaj imię, nazwisko, PESEL oraz numer konta, na który ZUS ma przekazywać środki.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 Imię i nazwisko:
                      </label>
                      <input
 type="text"
 value={parentName}
 onChange={(e) => setParentName(e.target.value)}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 Numer PESEL:
                      </label>
                      <input
 type="text"
 maxLength={11}
 value={pesel}
 onChange={(e) => setPesel(e.target.value)}
 className={`w-full px-3 py-2 bg-white border rounded text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 ${
 peselValid
                            ? "border-[#007834] focus:ring-[#007834]"
                            : "border-amber-500 focus:ring-amber-500"
                        }`}
                      />
                      <span
 className={`text-[11px] mt-1 flex items-center gap-1 font-medium ${
 peselValid ? "text-[#007834]" : "text-amber-700"
                        }`}
                      >
                        {peselValid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Poprawny numer PESEL (suma kontrolna zweryfikowana)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Wpisz 11 cyfr z poprawną sumą kontrolną PESEL</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 Numer rachunku bankowego (IBAN) do wypłaty świadczeń:
                      </label>
                      <input
 type="text"
 value={bankAccount}
 onChange={(e) => setBankAccount(e.target.value)}
 className={`w-full px-3 py-2 bg-white border rounded text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 ${
 nrbValid
                            ? "border-[#007834] focus:ring-[#007834]"
                            : "border-amber-500 focus:ring-amber-500"
                        }`}
                      />
                      <span
 className={`text-[11px] mt-1 flex items-center gap-1 font-medium ${
 nrbValid ? "text-[#007834]" : "text-amber-700"
                        }`}
                      >
                        {nrbValid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Poprawny 26-cyfrowy rachunek NRB (polski bank / SKOK)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Rachunek NRB powinien zawierać dokładnie 26 cyfr</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* KROK 2: Forma zatrudnienia i płatnik */}
              {zamStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Część II wniosku
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00416E]">
 Tytuł ubezpieczenia i dane płatnika składek
                    </h3>
                    <p className="text-xs text-slate-600">
 Wybierz formę zatrudnienia oraz podaj NIP pracodawcy lub zleceniodawcy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 Tytuł ubezpieczenia:
                      </label>
                      <select
 value={contractType}
 onChange={(e) =>
 setContractType(e.target.value as "employment" | "mandate" | "b2b")
                        }
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
                      >
                        <option value="employment">Umowa o pracę (UoP)</option>
                        <option value="mandate">Umowa zlecenie</option>
                        <option value="b2b">Działalność gospodarcza (JDG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 NIP płatnika składek / pracodawcy:
                      </label>
                      <input
 type="text"
 maxLength={10}
 value={employerNip}
 onChange={(e) => setEmployerNip(e.target.value)}
 className={`w-full px-3 py-2 bg-white border rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 ${
 nipValid
                            ? "border-[#007834] focus:ring-[#007834]"
                            : "border-amber-500 focus:ring-amber-500"
                        }`}
                      />
                      <span
 className={`text-[10.5px] mt-1 flex items-center gap-1 font-medium ${
 nipValid ? "text-[#007834]" : "text-amber-700"
                        }`}
                      >
                        {nipValid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Poprawny NIP (suma kontrolna OK)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Wymagane 10 cyfr (poprawny NIP)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Średnie wynagrodzenie brutto (PLN):
                      </label>
                      <input
 type="number"
 min="4666"
 step="100"
 value={monthlySalaryGross}
 onChange={(e) => setMonthlySalaryGross(Number(e.target.value))}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
                      />
                    </div>
                  </div>

                  {hasBlockingJdgDebt && (
                    <div className="p-3.5 bg-amber-50 border border-amber-400 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">
 Wykryto zadłużenie składkowe JDG ({jdgDebtAmount.toFixed(2)} PLN &gt; 48,06 PLN)
                          </strong>
                          <span>
 Zgodnie z art. 2a ustawy zasiłkowej wypłata zasiłku zostanie wstrzymana do czasu spłaty zaległości.
                          </span>
                        </div>
                      </div>
                      <button
 type="button"
 onClick={handlePayDebt}
 disabled={isPayingDebt}
 className="px-3 py-1.5 bg-[#007834] hover:bg-[#00622a] text-white rounded font-bold text-xs shrink-0 transition-colors"
                      >
                        {isPayingDebt ? "Opłacanie..." : "Spłać dług teraz"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* KROK 3: Dane dziecka */}
              {zamStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Część III wniosku
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00416E]">
 Dane nowonarodzonego dziecka / dzieci
                    </h3>
                    <p className="text-xs text-slate-600">
 Wpisz imię, datę urodzenia oraz określ liczbę dzieci przy tym porodzie.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 Imię i nazwisko dziecka:
                      </label>
                      <input
 type="text"
 value={childName}
 onChange={(e) => setChildName(e.target.value)}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
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
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
 Liczba dzieci przy porodzie:
                      </label>
                      <select
 value={childrenCount}
 onChange={(e) => setChildrenCount(Number(e.target.value))}
 className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007834]"
                      >
                        <option value={1}>1 dziecko (20 tyg. macierzyńskiego)</option>
                        <option value={2}>2 dzieci - bliźnięta (31 tyg.)</option>
                        <option value={3}>3 dzieci - trojaczki (33 tyg.)</option>
                        <option value={4}>4 dzieci (35 tyg.)</option>
                        <option value={5}>5+ dzieci (37 tyg.)</option>
                      </select>
                    </div>
                  </div>

                  {deadline21Info && (
                    <div
 className={`p-3 rounded border text-xs flex items-start gap-2 ${
 deadline21Info.isExpired
                          ? "bg-amber-50 border-amber-300 text-amber-950"
                          : "bg-emerald-50 border-emerald-200 text-emerald-950"
                      }`}
                    >
                      <Clock
 className={`w-4 h-4 shrink-0 mt-0.5 ${
 deadline21Info.isExpired ? "text-amber-600" : "text-[#007834]"
                        }`}
                      />
                      <div>
                        <strong>Żelazny termin 21 dni od porodu (art. 30a): </strong>
 upływa dnia <strong>{deadline21Info.deadlineStr}</strong>{" "}
                        {deadline21Info.isExpired ? (
                          <span>
                            (termin minął {Math.abs(deadline21Info.daysLeft)} dni temu — wariant uśredniony 81,5% może wymagać przywrócenia terminu; standardowo obowiązuje 100% / 70%).
                          </span>
                        ) : (
                          <span>
                            (pozostało <strong>{deadline21Info.daysLeft} dni</strong> na złożenie długiego wniosku ze stawką 81,5%).
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* KROK 4: Okoliczności szczególne porodu (wcześniak / Za życiem) */}
              {zamStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Część IV wniosku
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00416E]">
 Okoliczności szczególne porodu i stan zdrowia dziecka
                    </h3>
                    <p className="text-xs text-slate-600">
 Sprawdź, czy przysługuje Ci dodatkowy uzupełniający urlop macierzyński (art. 180² KP 2026).
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Wcześniak w zielonym motywie ZUS */}
                    <div
 className={`p-4 rounded border-2 transition-all ${
 isPremature
                          ? "border-[#007834] bg-emerald-50/50"
                          : "border-[#dce1e5] bg-[#f4f6f7]"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
 type="checkbox"
 checked={isPremature}
 onChange={(e) => setIsPremature(e.target.checked)}
 className="mt-1 w-4 h-4 rounded text-[#007834] focus:ring-[#007834]"
                        />
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-slate-900 block text-sm">
 Dziecko przedwcześnie urodzone lub hospitalizowane po porodzie (art. 180² KP)
                          </span>
                          <p className="text-slate-600 leading-relaxed">
 Przysługuje do 15 dodatkowych tygodni 100% płatnego urlopu macierzyńskiego na czas pobytu noworodka w szpitalu.
                          </p>
                        </div>
                      </label>

                      {isPremature && (
                        <div className="pl-7 pt-3 mt-2 border-t border-[#c2e4cc] flex flex-wrap items-center gap-3 text-xs">
                          <span className="font-bold text-slate-700">Liczba dni pobytu dziecka w szpitalu:</span>
                          <input
 type="number"
 min={1}
 max={120}
 value={hospitalDays}
 onChange={(e) => setHospitalDays(Number(e.target.value))}
 className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-center font-bold"
                          />
                          <span className="text-xs text-[#007834] font-bold">
                            + {liveCalculation.supplementaryWeeks} tyg. dodatkowego urlopu w 100%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ustawa Za życiem */}
                    <div
 className={`p-4 rounded border-2 transition-all ${
 hasLifeCert
                          ? "border-[#007834] bg-emerald-50/50"
                          : "border-[#dce1e5] bg-[#f4f6f7]"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
 type="checkbox"
 checked={hasLifeCert}
 onChange={(e) => setHasLifeCert(e.target.checked)}
 className="mt-1 w-4 h-4 rounded text-[#007834] focus:ring-[#007834]"
                        />
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-slate-900 block text-sm">
 Zaświadczenie z ustawy „Za życiem” (art. 4 ust. 3)
                          </span>
                          <p className="text-slate-600 leading-relaxed">
 Ciężkie i nieodwracalne upośledzenie albo nieuleczalna choroba zagrażająca życiu, powstała w okresie prenatalnym. Wydłuża urlop rodzicielski do 65/67 tygodni.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* KROK 5: Wybór wariantu stawki */}
              {zamStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Część V wniosku
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00416E]">
 Wybór wariantu stawki zasiłku macierzyńskiego
                    </h3>
                    <p className="text-xs text-slate-600">
 Wybierz sposób wypłaty świadczenia zgodnie z art. 30a ustawy zasiłkowej.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <button
 type="button"
 onClick={() => setChosenRate("815")}
 className={`p-4 rounded border-2 text-left space-y-2 transition-all ${
 chosenRate === "815"
                          ? "border-[#007834] bg-emerald-50/50 "
                          : "border-[#dce1e5] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#007834] bg-emerald-100/70 px-2 py-0.5 rounded">
 Rekomendowane
                        </span>
                        {chosenRate === "815" && (
                          <Check className="w-5 h-5 text-[#007834]" />
                        )}
                      </div>
                      <div className="font-bold text-sm text-slate-900">
 Wariant A: Równa stawka uśredniona 81,5%
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
 Wniosek składany w terminie 21 dni po porodzie. Stała kwota przez cały rok bez spadku budżetu domowego po 20 tygodniach.
                      </p>
                    </button>

                    <button
 type="button"
 onClick={() => setChosenRate("100_70")}
 className={`p-4 rounded border-2 text-left space-y-2 transition-all ${
 chosenRate === "100_70"
                          ? "border-[#00416E] bg-blue-50/50 "
                          : "border-[#dce1e5] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
 Wariant B
                        </span>
                        {chosenRate === "100_70" && (
                          <Check className="w-5 h-5 text-[#00416E]" />
                        )}
                      </div>
                      <div className="font-bold text-sm text-slate-900">
 Wariant B: 100% (macierzyński) + 70% (rodzicielski)
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
 Wyższa kwota przez pierwsze 20 tygodni, a następnie spadek do 70%. Stosowany także w przypadku złożenia wniosku po 21 dniach.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* KROK 6: Weryfikacja i wysyłka do ZUS */}
              {zamStep === 6 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
 Część VI wniosku
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00416E]">
 Weryfikacja kompletu danych i cyfrowa autoryzacja
                    </h3>
                    <p className="text-xs text-slate-600">
 Wszystkie sekcje zostały wypełnione. Sprawdź podsumowanie poniżej, a następnie podpisz wniosek Profilem Zaufanym.
                    </p>
                  </div>

                  {/* Podsumowanie kontroli formalnej przed wysyłką */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div
 className={`p-2.5 rounded border flex items-center gap-2 font-semibold ${
 peselValid
                          ? "bg-emerald-50/70 border-emerald-200 text-[#007834]"
                          : "bg-amber-50 border-amber-300 text-amber-800"
                      }`}
                    >
                      {peselValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>PESEL: {peselValid ? "Zweryfikowany" : "Wymaga poprawy"}</span>
                    </div>
                    <div
 className={`p-2.5 rounded border flex items-center gap-2 font-semibold ${
 nipValid
                          ? "bg-emerald-50/70 border-emerald-200 text-[#007834]"
                          : "bg-amber-50 border-amber-300 text-amber-800"
                      }`}
                    >
                      {nipValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>NIP płatnika: {nipValid ? "Zweryfikowany" : "Wymaga poprawy"}</span>
                    </div>
                    <div
 className={`p-2.5 rounded border flex items-center gap-2 font-semibold ${
 nrbValid
                          ? "bg-emerald-50/70 border-emerald-200 text-[#007834]"
                          : "bg-amber-50 border-amber-300 text-amber-800"
                      }`}
                    >
                      {nrbValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>Rachunek NRB: {nrbValid ? "Poprawny (26 cyfr)" : "Wymaga poprawy"}</span>
                    </div>
                  </div>

                  {hasBlockingJdgDebt && (
                    <div className="p-3.5 bg-amber-50 border border-amber-400 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">
 Blokada wypłaty z art. 2a ustawy zasiłkowej (dług JDG: {jdgDebtAmount.toFixed(2)} PLN)
                          </strong>
                          <span>
 Spłać zaległość przed wysłaniem wniosku, aby uniknąć zawieszenia wypłaty świadczenia.
                          </span>
                        </div>
                      </div>
                      <button
 type="button"
 onClick={handlePayDebt}
 disabled={isPayingDebt}
 className="px-3 py-1.5 bg-[#007834] hover:bg-[#00622a] text-white rounded font-bold text-xs shrink-0 transition-colors"
                      >
                        {isPayingDebt ? "Opłacanie..." : "Spłać dług przez Paybynet"}
                      </button>
                    </div>
                  )}

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-xs text-emerald-950">
                      <div className="font-bold text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#007834]" />
                        <span>Gotowy do wysłania do Zakładu Ubezpieczeń Społecznych</span>
                      </div>
                      <p className="text-emerald-800">
 Wniosek zostanie skierowany do właściwego Oddziału ZUS zgodnie z Twoim miejscem zamieszkania.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
 type="button"
 onClick={handleSimulateSubmit}
 disabled={isSubmitting}
 className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Autoryzacja w toku...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Podpisz Profilem Zaufanym i wyślij</span>
                          </>
                        )}
                      </button>

                      <button
 type="button"
 onClick={handleDownloadZamJson}
 className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-[#f4f6f7] text-slate-800 rounded text-xs font-bold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#007834]" />
                        <span>Pobierz (JSON)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dolne przyciski nawigacji kreatora */}
            <div className="pt-4 border-t border-[#dce1e5] flex items-center justify-between gap-3">
              <button
 type="button"
 disabled={zamStep === 1}
 onClick={() => setZamStep((prev) => Math.max(1, prev - 1))}
 className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition-colors ${
 zamStep === 1
                    ? "text-slate-300 cursor-not-allowed bg-[#f4f6f7]"
                    : "text-slate-700 hover:bg-slate-100 bg-white border border-slate-300"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Wstecz</span>
              </button>

              {zamStep < totalZamSteps ? (
                <button
 type="button"
 onClick={() => setZamStep((prev) => Math.min(totalZamSteps, prev + 1))}
 className="inline-flex items-center gap-1.5 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs px-5 py-2 rounded transition-colors "
                >
                  <span>Następny krok</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
 type="button"
 onClick={() => {
 const el = document.getElementById("zam-preview-section");
 el?.scrollIntoView({ behavior: "smooth" });
                  }}
 className="inline-flex items-center gap-1.5 bg-[#00416E] hover:bg-[#003457] text-white font-bold text-xs px-5 py-2 rounded transition-colors "
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Zobacz pełny druk urzędowy poniżej</span>
                </button>
              )}
            </div>
          </div>

          {/* DOLNY BLOK: PODGLĄD URZĘDOWEGO DOKUMENTU ZAM W FORMIE KARTKI A4 GOTOWEJ DO WYDRUKU */}
          <div id="zam-preview-section" className="space-y-4 w-full">
            {/* Pasek narzędzi nad kartką A4 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded border border-[#dce1e5] print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#f0f8f3] border border-[#c2e4cc] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#007834]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#00416E]">
 Podgląd wydruku A4 — Urzędowy Wniosek ZUS ZAM
                  </h3>
                  <p className="text-xs text-slate-500">
 Format A4 (210 × 297 mm) &bull; Aktualizuje się na żywo podczas wypełniania kroków
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
 type="button"
 onClick={handlePrintUpo}
 className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007834] hover:bg-[#00622a] text-white rounded text-xs font-bold transition-colors "
                >
                  <Printer className="w-4 h-4" />
                  <span>Drukuj / Zapisz jako PDF (A4)</span>
                </button>
                <button
 type="button"
 onClick={handleDownloadZamJson}
 className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-[#f4f6f7] rounded text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4 text-[#007834]" />
                  <span>Pobierz JSON</span>
                </button>
              </div>
            </div>

            {/* Komunikat o sukcesie i UPO (jeśli wysłano) */}
            {submissionSuccess && (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded flex flex-col gap-3 text-emerald-950 animate-in fade-in print:hidden">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#007834] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#007834]">
 Wniosek ZAM został skutecznie doręczony do Zakładu Ubezpieczeń Społecznych!
                    </h4>
                    <p className="text-xs text-slate-700">
 Urzędowe Poświadczenie Odbioru (UPO):{" "}
                      <strong className="font-mono text-slate-900">{upoNumber}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
 Data i czas wpływu: {submissionTimestamp} &bull; {upoHash}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Podkładka "biurka" pod kartkę A4 */}
            <div className="bg-slate-200/80 p-3 sm:p-8 rounded border border-slate-300 overflow-x-auto">
              {/* REALISTYCZNA KARTKA A4 (210mm x 297mm) */}
              <div
 id="zam-a4-sheet"
 className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-900 shadow-[0_12px_36px_rgba(15,23,42,0.18)] border border-slate-300 p-6 sm:p-[15mm] flex flex-col justify-between font-sans text-[11px] leading-snug"
              >
                <div className="space-y-4">
                  {/* GÓRNY NAGŁÓWEK DRUKU ZUS ZAM */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-3 border-b-2 border-slate-900">
                    <div className="sm:col-span-7 flex flex-col justify-between gap-2">
                      <ZusLogo size="sm" />
                      <div className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">
 Zakład Ubezpieczeń Społecznych &bull; Wzór obowiązujący od 24.10.2026 r.
                      </div>
                    </div>

                    <div className="sm:col-span-5 flex flex-col items-end justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-bold text-slate-500">
 Symbol druku:
                        </span>
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-xs font-black tracking-widest">
 ZUS ZAM
                        </span>
                      </div>

                      {/* Ramka na pieczęć wpływu ZUS / UPO */}
                      <div className="w-full border border-dashed border-slate-400 bg-[#f4f6f7]/70 p-2 text-center min-h-[44px] flex flex-col items-center justify-center">
                        {submissionSuccess ? (
                          <>
                            <span className="text-[9px] font-black uppercase text-[#007834] tracking-wider">
 WPŁYNĘŁO ELEKTRONICZNIE &bull; UPO
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-900">
                              {upoNumber}
                            </span>
                            <span className="font-mono text-[8.5px] text-slate-600">
                              {submissionTimestamp}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[8.5px] font-bold uppercase text-slate-400 tracking-wider">
 Pieczęć wpływu / Data rejestracji w ZUS
                            </span>
                            <span className="text-[8px] text-slate-400">
                              (Wypełnia Zakład Ubezpieczeń Społecznych)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TYTUŁ FORMULARZA */}
                  <div className="text-center py-2 border-b border-slate-300 space-y-1">
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950">
 WNIOSEK O ZASIŁEK MACIERZYŃSKI
                    </h2>
                    <p className="text-[10.5px] font-semibold text-slate-700">
 za okres urlopu macierzyńskiego, uzupełniającego urlopu macierzyńskiego oraz urlopu rodzicielskiego
                    </p>
                    <p className="text-[8.5px] text-slate-500">
 Instrukcja: Wypełnij wielkimi literami. Pola wyboru zaznacz znakiem X. Podstawa prawna: ustawa z dnia 25 czerwca 1999 r. (Dz. U. z 2026 r.).
                    </p>
                  </div>

                  {/* SEKCJA I: DANE OSOBY SKŁADAJĄCEJ WNIOSEK */}
                  <div className="border border-slate-800">
                    <div className="bg-slate-100 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between">
                      <span className="font-black text-[10.5px] uppercase tracking-wide text-slate-900">
 SEKCJA I. DANE OSOBY SKŁADAJĄCEJ WNIOSEK (UBEZPIECZONEGO)
                      </span>
                      <button
 type="button"
 onClick={() => setZamStep(1)}
 className="text-[9.5px] text-[#007834] font-bold hover:underline print:hidden print-hidden"
                      >
 Edytuj krok 1 &uarr;
                      </button>
                    </div>

                    <div className="p-3 space-y-2.5">
                      {/* Kratki na PESEL */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[9.5px] font-bold uppercase text-slate-600">
 1. Numer PESEL:
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 11 }).map((_, idx) => {
 const digits = (pesel || "").replace(/\D/g, "");
 return (
                              <span
 key={idx}
 className="w-6 h-6 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-950 bg-white"
                              >
                                {digits[idx] || ""}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Imię i nazwisko + Podstawa */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-8 border border-slate-400 px-2.5 py-1.5">
                          <span className="block text-[8.5px] uppercase text-slate-500 font-semibold">
 2. Imię i nazwisko wnioskodawcy
                          </span>
                          <span className="font-bold text-xs uppercase text-slate-950 tracking-wide">
                            {parentName || "—"}
                          </span>
                        </div>
                        <div className="sm:col-span-4 border border-slate-400 px-2.5 py-1.5">
                          <span className="block text-[8.5px] uppercase text-slate-500 font-semibold">
 3. Podstawa wymiaru (brutto)
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-950">
                            {monthlySalaryGross.toLocaleString("pl-PL")} PLN
                          </span>
                        </div>
                      </div>

                      {/* Tytuł ubezpieczenia (kratki X) */}
                      <div className="border border-slate-400 px-2.5 py-1.5">
                        <span className="block text-[8.5px] uppercase text-slate-500 font-semibold mb-1">
 4. Tytuł do ubezpieczenia chorobowego
                        </span>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10.5px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px]">
                              {contractType === "employment" ? "X" : ""}
                            </span>
                            <span>Umowa o pracę (UoP)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px]">
                              {contractType === "mandate" ? "X" : ""}
                            </span>
                            <span>Umowa zlecenie</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px]">
                              {contractType === "b2b" ? "X" : ""}
                            </span>
                            <span>Pozarolnicza działalność (JDG)</span>
                          </div>
                        </div>
                      </div>

                      {/* Numer rachunku bankowego */}
                      <div className="border border-slate-400 px-2.5 py-1.5">
                        <span className="block text-[8.5px] uppercase text-slate-500 font-semibold">
 5. Numer rachunku bankowego do wypłaty zasiłku (IBAN / NRB)
                        </span>
                        <span className="font-mono font-bold text-xs text-slate-950 tracking-wider">
                          {bankAccount || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SEKCJA II: DANE PŁATNIKA SKŁADEK */}
                  <div className="border border-slate-800">
                    <div className="bg-slate-100 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between">
                      <span className="font-black text-[10.5px] uppercase tracking-wide text-slate-900">
 SEKCJA II. DANE PŁATNIKA SKŁADEK (PRACODAWCY / ZLECENIODAWCY)
                      </span>
                      <button
 type="button"
 onClick={() => setZamStep(2)}
 className="text-[9.5px] text-[#007834] font-bold hover:underline print:hidden print-hidden"
                      >
 Edytuj krok 2 &uarr;
                      </button>
                    </div>
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[9.5px] font-bold uppercase text-slate-600 block">
 6. Numer NIP płatnika składek:
                        </span>
                        <span className="text-[8.5px] text-slate-500">
 Zaświadczenie płatnika Z-3 przekazywane elektronicznie przez PUE/eZUS.
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 10 }).map((_, idx) => {
 const digits = (employerNip || "").replace(/\D/g, "");
 return (
                            <span
 key={idx}
 className="w-6 h-6 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-950 bg-white"
                            >
                              {digits[idx] || ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SEKCJA III: DANE DZIECKA ORAZ OKOLICZNOŚCI PORODU */}
                  <div className="border border-slate-800">
                    <div className="bg-slate-100 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between">
                      <span className="font-black text-[10.5px] uppercase tracking-wide text-slate-900">
 SEKCJA III. DANE DZIECKA / DZIECI ORAZ OKOLICZNOŚCI SZCZEGÓLNE
                      </span>
                      <button
 type="button"
 onClick={() => setZamStep(3)}
 className="text-[9.5px] text-[#007834] font-bold hover:underline print:hidden print-hidden"
                      >
 Edytuj krok 3–4 &uarr;
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-6 border border-slate-400 px-2.5 py-1.5">
                          <span className="block text-[8.5px] uppercase text-slate-500 font-semibold">
 7. Imię i nazwisko dziecka
                          </span>
                          <span className="font-bold text-xs uppercase text-slate-950">
                            {childName || "—"}
                          </span>
                        </div>
                        <div className="sm:col-span-3 border border-slate-400 px-2.5 py-1.5">
                          <span className="block text-[8.5px] uppercase text-slate-500 font-semibold">
 8. Data urodzenia
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-950">
                            {childBirthDate || "—"}
                          </span>
                        </div>
                        <div className="sm:col-span-3 border border-slate-400 px-2.5 py-1.5">
                          <span className="block text-[8.5px] uppercase text-slate-500 font-semibold">
 9. Liczba dzieci
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-950">
                            {childrenCount}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                        <div className="border border-slate-400 px-2.5 py-1.5 flex items-start gap-2">
                          <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px] shrink-0 mt-0.5">
                            {isPremature ? "X" : ""}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">
 Wcześniak / Hospitalizacja (art. 180² KP)
                            </span>
                            <span className="text-[9px] text-slate-600">
                              {isPremature
                                ? `Zadeklarowany okres hospitalizacji: ${hospitalDays} dni`
                                : "Nie dotyczy / brak zaświadczenia szpitalnego"}
                            </span>
                          </div>
                        </div>

                        <div className="border border-slate-400 px-2.5 py-1.5 flex items-start gap-2">
                          <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px] shrink-0 mt-0.5">
                            {hasLifeCert ? "X" : ""}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">
 Zaświadczenie z ustawy „Za życiem” (art. 4 ust. 3)
                            </span>
                            <span className="text-[9px] text-slate-600">
                              {hasLifeCert
                                ? "Wydłużony wymiar urlopu rodzicielskiego (65/67 tyg.)"
                                : "Nie dotyczy"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEKCJA IV: OŚWIADCZENIE W SPRAWIE STAWKI I WYLICZONY WYMIAR KSI ZUS */}
                  <div className="border border-slate-800">
                    <div className="bg-slate-100 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between">
                      <span className="font-black text-[10.5px] uppercase tracking-wide text-slate-900">
 SEKCJA IV. WYBÓR STAWKI I PODSUMOWANIE WYMIARU ŚWIADCZEŃ (KSI ZUS)
                      </span>
                      <button
 type="button"
 onClick={() => setZamStep(5)}
 className="text-[9.5px] text-[#007834] font-bold hover:underline print:hidden print-hidden"
                      >
 Zmień stawkę &uarr;
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <div className="space-y-1.5 text-[10.5px]">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px] shrink-0">
                            {chosenRate === "815" ? "X" : ""}
                          </span>
                          <span>
                            <strong>Wariant uśredniony 81,5%</strong> — długi wniosek złożony w terminie do 21 dni od porodu (art. 30a ustawy)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border border-slate-800 inline-flex items-center justify-center font-mono font-black text-[11px] shrink-0">
                            {chosenRate === "100_70" ? "X" : ""}
                          </span>
                          <span>
                            <strong>Wariant standardowy 100% / 70%</strong> — 100% za okres macierzyńskiego oraz 70% za okres rodzicielskiego
                          </span>
                        </div>
                      </div>

                      {/* Tabela urzędowa wymiaru */}
                      <table className="w-full border-collapse border border-slate-700 text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800">
                            <th className="border border-slate-600 px-2 py-1 text-left font-bold">
 Rodzaj świadczenia / urlopu
                            </th>
                            <th className="border border-slate-600 px-2 py-1 text-center font-bold w-24">
 Wymiar
                            </th>
                            <th className="border border-slate-600 px-2 py-1 text-center font-bold w-24">
 Stawka
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-500 px-2 py-1">
 Urlop macierzyński podstawowy
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold">
                              {liveCalculation.maternityWeeks} tyg.
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold text-[#007834]">
                              {liveCalculation.momMaternityRatePercent}%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-500 px-2 py-1">
 Uzupełniający urlop macierzyński (art. 180² KP)
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold">
                              {liveCalculation.supplementaryWeeks} tyg.
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold text-[#007834]">
 100%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-500 px-2 py-1">
 Urlop rodzicielski (część matki)
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold">
                              {liveCalculation.parentalMomWeeks} tyg.
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold text-[#007834]">
                              {liveCalculation.momParentalRatePercent}%
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-500 px-2 py-1">
 Urlop rodzicielski — część nieprzenoszalna drugiego rodzica (WLB)
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold">
                              {liveCalculation.parentalDadReservedWeeks} tyg.
                            </td>
                            <td className="border border-slate-500 px-2 py-1 text-center font-mono font-bold text-[#00416E]">
 70% (stała)
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="flex items-center justify-between bg-[#f0f8f3] border border-[#007834] px-3 py-2">
                        <span className="text-[10px] font-bold uppercase text-slate-800">
 Szacowana miesięczna kwota zasiłku (pierwszy okres):
                        </span>
                        <span className="font-mono text-sm font-black text-[#007834]">
                          {liveCalculation.maternityMonthlyBenefit.toLocaleString("pl-PL", {
 minimumFractionDigits: 2,
                          })}{" "}
 PLN / mies.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SEKCJA V: OŚWIADCZENIE I PODPIS */}
                  <div className="border border-slate-800">
                    <div className="bg-slate-100 border-b border-slate-800 px-3 py-1.5">
                      <span className="font-black text-[10.5px] uppercase tracking-wide text-slate-900">
 SEKCJA V. OŚWIADCZENIE WNIOSKODAWCY I PODPIS
                      </span>
                    </div>
                    <div className="p-3 space-y-4">
                      <p className="text-[9px] text-slate-700 leading-relaxed text-justify">
 Oświadczam, że dane zawarte we wniosku podałem/am zgodnie z prawdą. Jestem świadomy/a odpowiedzialności karnej za złożenie fałszywego oświadczenia (art. 233 § 1 Kodeksu karnego). Zobowiązuję się niezwłocznie poinformować Zakład Ubezpieczeń Społecznych o wszelkich zmianach mających wpływ na prawo do zasiłku lub jego wysokość.
                      </p>

                      <div className="grid grid-cols-2 gap-8 pt-3">
                        <div className="flex flex-col justify-end">
                          <div className="border-b border-dotted border-slate-600 pb-1 text-center font-mono text-[10.5px] font-semibold text-slate-900">
                            {new Date().toLocaleDateString("pl-PL")} r.
                          </div>
                          <span className="text-[8.5px] text-slate-500 text-center mt-1">
 Miejscowość i data sporządzenia wniosku
                          </span>
                        </div>

                        <div className="flex flex-col justify-end">
                          {submissionSuccess ? (
                            <div className="border border-[#007834] bg-[#f0f8f3] px-2 py-1 text-center">
                              <div className="text-[9px] font-black text-[#007834] uppercase flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>PODPISANO PROFILEM ZAUFANYM</span>
                              </div>
                              <div className="font-mono text-[8.5px] text-slate-700 truncate">
                                {parentName} &bull; {upoHash}
                              </div>
                            </div>
                          ) : (
                            <div className="border-b border-dotted border-slate-600 pb-1 text-center text-[10px] text-slate-400 italic">
                              (miejsce na czytelny podpis / Profil Zaufany)
                            </div>
                          )}
                          <span className="text-[8.5px] text-slate-500 text-center mt-1">
 Czytelny podpis wnioskodawcy / podpis elektroniczny
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* SEKCJA VI: WYKAZ WYMAGANYCH ZAŁĄCZNIKÓW */}
                  <div className="border border-slate-800">
                    <div className="bg-slate-100 border-b border-slate-800 px-3 py-1.5">
                      <span className="font-black text-[10.5px] uppercase tracking-wide text-slate-900">
 SEKCJA VI. WYKAZ WYMAGANYCH ZAŁĄCZNIKÓW DO WNIOSKU
                      </span>
                    </div>
                    <div className="p-2.5">
                      <ul className="space-y-1 text-[9.5px] text-slate-800">
                        {requiredAttachments.map((att, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-3.5 h-3.5 border border-slate-700 inline-flex items-center justify-center font-mono font-black text-[9px] shrink-0 mt-0.5">
 X
                            </span>
                            <span>{att}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* STOPKA KARTKI A4 Z KODEM QR WERYFIKACJI */}
                <div className="pt-3 mt-4 border-t border-slate-300 flex items-center justify-between gap-4 text-[8.5px] text-slate-500 font-mono">
                  <div className="flex items-center gap-3">
                    <ZamQrCode seed={`${upoNumber || "DRAFT"}-${pesel}-${childBirthDate}-${chosenRate}`} />
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800">
 ZUS ZAM (wersja 2026.10) &bull; Zgodny z rozporządzeniem MRPiPS
                      </div>
                      <div>
 Kod kontrolny dokumentu:{" "}
                        <span className="text-slate-800 font-semibold">
                          {upoNumber || `ZAM-DRAFT-${pesel.slice(-4) || "0000"}`}
                        </span>
                      </div>
                      <div>Wygenerowano w systemie Przewodnik Rodzica ZUS (eZUS)</div>
                    </div>
                  </div>
                  <span className="shrink-0 font-bold text-slate-700">Strona 1 z 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZAKŁADKA 2: mObywatel */}
      {activeTab === "mobywatel" && (
        <div className="zus-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf0f2] pb-4">
            <div className="w-10 h-10 rounded bg-red-600 text-white flex items-center justify-center font-bold text-lg ">
 mO
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#00416E]">
 Symulacja portfela mObywatel 2.0 & centrum powiadomień rodzica
              </h2>
              <p className="text-xs text-slate-500">
 Weryfikacja tożsamości obywatela, automatyczne alerty push o terminach ustawowych i rejestr spraw ZUS.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* mDowód */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-5 rounded space-y-4">
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

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-900 block">
 Pilne: Pozostało 9 dni na złożenie wniosku ZAM (stawka 81,5%)!
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">
 Urodzenie dziecka zarejestrowano w USC. Złóż wniosek ZAM w terminie 21 dni po porodzie, aby zachować równą stawkę 81,5% przez cały okres macierzyńskiego i rodzicielskiego.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded flex items-start gap-3">
                <Info className="w-5 h-5 text-[#00416E] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#00416E] block">
 Nowe zwolnienie lekarskie e-ZLA (kod literowy „B”)
                  </span>
                  <p className="text-xs text-slate-600">
 Lekarz ginekolog wystawił zwolnienie lekarskie w okresie ciąży na 28 dni. Przysługuje 100% zasiłku chorobowego bez okresu wyczekiwania.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#007834] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#007834] block">
 Przypomnienie dla taty: 9 nieprzenoszalnych tygodni rodzicielskiego
                  </span>
                  <p className="text-xs text-emerald-800">
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
        <div className="zus-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#edf0f2] pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#00416E]">
 Pulpit ubezpieczonego w portalu eZUS / PUE ZUS
              </h2>
              <p className="text-xs text-slate-500">
 Historia składek, tytuły ubezpieczeniowe i kontrola zadłużenia płatnika w działalności gospodarczej.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-[#007834] font-bold border border-emerald-200">
 Konto zweryfikowane
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#f4f6f7] rounded border border-[#dce1e5] space-y-1">
              <span className="text-xs text-slate-500">Tytuł do ubezpieczeń:</span>
              <div className="text-sm font-bold text-slate-900">
                {contractType === "b2b" ? "05 10 (Działalność gospodarcza)" : "01 10 (Umowa o pracę)"}
              </div>
              <div className="text-xs text-emerald-700 font-bold">
 Ubezpieczenie chorobowe: {contractType === "employment" ? "Obowiązkowe" : "Dobrowolne (Aktywne)"}
              </div>
            </div>

            <div className="p-4 bg-[#f4f6f7] rounded border border-[#dce1e5] space-y-1">
              <span className="text-xs text-slate-500">Średnia podstawa składek:</span>
              <div className="text-sm font-bold text-slate-900">
                {monthlySalaryGross.toLocaleString("pl-PL")} PLN
              </div>
              <div className="text-xs text-slate-500">
 Podstawa netto (po 13,71%): {liveCalculation.netBaseMonthly.toLocaleString("pl-PL")} PLN
              </div>
            </div>

            {/* Monitor Zadłużenia z progiem 48.06 zł */}
            <div
 className={`p-4 rounded border space-y-1 ${
 jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross
                  ? "bg-red-50 border-red-300"
                  : "bg-emerald-50 border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Stan zadłużenia płatnika:</span>
                <span
 className={`text-xs font-bold ${
 jdgDebtAmount > 0 ? "text-red-700" : "text-[#007834]"
                  }`}
                >
                  {jdgDebtAmount.toFixed(2)} PLN
                </span>
              </div>

              {debtPaymentSuccess && (
                <p className="text-[11px] text-emerald-800 pt-1 font-semibold">
 Płatność została zaksięgowana pomyślnie. Saldo wynosi 0,00 zł.
                </p>
              )}
              {jdgDebtAmount > DEFAULT_LEGISLATIVE_2026.jdgDebtThresholdGross ? (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-red-800 leading-tight">
 Uwaga! Zadłużenie przekracza 1% minimalnego wynagrodzenia (48,06 zł). Wypłata zasiłku zostanie zablokowana do czasu uregulowania zaległości.
                  </p>
                  <button
 type="button"
 onClick={handlePayDebt}
 disabled={isPayingDebt}
 className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isPayingDebt ? "Opłacanie..." : "Spłać zadłużenie przez Paybynet"}</span>
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-emerald-800 pt-1">
 Brak zaległości składkowych. Prawo do zasiłku jest w pełni chronione.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ZAKŁADKA 4: e-ZLA */}
      {activeTab === "ezla" && (
        <div className="zus-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#edf0f2] pb-4">
            <h2 className="text-lg font-bold text-[#00416E]">
 Rejestr elektronicznych zwolnień lekarskich (e-ZLA)
            </h2>
            <p className="text-xs text-slate-500">
 Podgląd zwolnień lekarskich wystawionych przez lekarza ginekologa w okresie ciąży (kod literowy „B”).
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#f4f6f7] rounded border border-[#dce1e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Zwolnienie ZUS ZLA / 2026 / 884912</span>
                  <span className="bg-emerald-100 text-[#007834] font-bold px-2 py-0.5 rounded text-[10px]">
 KOD B &bull; 100% PŁATNE
                  </span>
                </div>
                <div className="text-slate-500">
 Wystawione przez: lek. med. Ewa Wiśniewska (Specjalista Ginekologii i Położnictwa)
                </div>
                <div className="text-slate-600">
 Okres zwolnienia: <strong>2026-02-01 &ndash; 2026-02-28 (28 dni)</strong> &bull; Wykorzystano: 84 / 270 dni limitu ciążowego
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-[11px] text-slate-500 block">Stawka dzienna zasiłku:</span>
                <strong className="text-base text-[#007834] font-black">
                  {liveCalculation.dailyBaseAmount.toFixed(2)} PLN / dzień
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
