import { getBrowserClient } from "@hacknation/db";
import { InspectorCase } from "@hacknation/shared";

const LOCAL_STORAGE_KEY = "zus_submitted_applications";

export interface SyncResult {
  cases: InspectorCase[];
  isCloudConnected: boolean;
  cloudCount: number;
  lastSyncedAt: string;
}

/**
 * Zapisuje wniosek obywatela w chmurze Supabase (tabela benefit_calculation_history)
 * z automatycznym zapisem lokalnym (fallback w localStorage).
 */
export async function saveApplicationToCloud(
  caseData: InspectorCase
): Promise<{ success: boolean; cloudSaved: boolean; error?: string }> {
  // 1. Zawsze zapisujemy w localStorage jako niezawodny bufor lokalny
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      const filtered = stored.filter((c: InspectorCase) => c.caseNumber !== caseData.caseNumber);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([caseData, ...filtered]));
    } catch (e) {
      console.warn("Błąd zapisu wniosku do localStorage:", e);
    }
  }

  // 2. Zapis w chmurze Supabase
  try {
    const supabase = getBrowserClient() as any;
    const { error } = await supabase.from("benefit_calculation_history").insert({
      session_token: caseData.caseNumber,
      calculation_input: {
        ...caseData,
        source: "cloud",
      },
      calculation_output: {
        caseNumber: caseData.caseNumber,
        status: caseData.status,
        riskLevel: caseData.riskLevel,
        riskCategory: caseData.riskCategory,
        riskReasons: caseData.riskReasons,
        suggestedDecision: caseData.suggestedDecision,
        upoHash: caseData.upoHash,
        submissionDate: caseData.submissionDate,
        applicantName: caseData.applicantName,
        pesel: caseData.pesel,
        contractType: caseData.contractType,
        monthlySalaryGross: caseData.monthlySalaryGross,
      },
    });

    if (error) {
      console.warn("Błąd zapisu wniosku do Supabase (użyto bufora lokalnego):", error.message);
      return { success: true, cloudSaved: false, error: error.message };
    }

    return { success: true, cloudSaved: true };
  } catch (err: any) {
    console.warn("Nieoczekiwany wyjątek podczas zapisu do Supabase:", err);
    return { success: true, cloudSaved: false, error: err?.message || String(err) };
  }
}

/**
 * Pobiera wnioski z chmury Supabase i łączy je z buforem lokalnym.
 */
export async function fetchCasesFromCloud(): Promise<SyncResult> {
  const now = new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  let cloudCases: InspectorCase[] = [];
  let isCloudConnected = false;

  // 1. Próba pobrania z Supabase
  try {
    const supabase = getBrowserClient() as any;
    const { data, error } = await supabase
      .from("benefit_calculation_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data && Array.isArray(data)) {
      isCloudConnected = true;
      cloudCases = (data as any[])
        .map((row: any) => {
          const input = row.calculation_input as any;
          const output = row.calculation_output as any;

          if (!input || !input.caseNumber) {
            return null;
          }

          const parsedCase: InspectorCase = {
            id: row.id,
            caseNumber: input.caseNumber || row.session_token,
            submissionDate: input.submissionDate || row.created_at.slice(0, 10),
            applicantName: input.applicantName || "Ubezpieczona / Ubezpieczony",
            pesel: input.pesel || "00000000000",
            email: input.email,
            phone: input.phone,
            bankAccountNumber: input.bankAccountNumber,
            benefitType: input.benefitType || "MATERNITY_PARENTAL_UNIFIED",
            contractType: input.contractType || "employment",
            monthlySalaryGross: Number(input.monthlySalaryGross) || 6500,
            childBirthDate: input.childBirthDate || "2026-11-15",
            daysSinceBirth: Number(input.daysSinceBirth) || 5,
            childName: input.childName,
            otherParentName: input.otherParentName,
            otherParentPesel: input.otherParentPesel,
            isPremature: Boolean(input.isPremature),
            birthWeek: input.birthWeek ? Number(input.birthWeek) : undefined,
            birthWeightGrams: input.birthWeightGrams ? Number(input.birthWeightGrams) : undefined,
            hospitalDays: input.hospitalDays ? Number(input.hospitalDays) : undefined,
            hospitalName: input.hospitalName,
            employerNip: input.employerNip || "5260250995",
            employerName: input.employerName || "Pracodawca / Płatnik ZUS",
            isEmployerOver20: Boolean(input.isEmployerOver20 ?? true),
            hasDebt: Boolean(input.hasDebt),
            debtAmount: input.debtAmount ? Number(input.debtAmount) : undefined,
            insuranceTenureDays: Number(input.insuranceTenureDays) || 365,
            riskLevel: (output?.riskLevel || input.riskLevel || "GREEN") as any,
            riskCategory: (output?.riskCategory || input.riskCategory || "FAST_TRACK") as any,
            riskReasons: Array.isArray(input.riskReasons) && input.riskReasons.length > 0
              ? input.riskReasons
              : [
                  output?.suggestedDecision === "AUTO_APPROVE_81_5"
                    ? "Wniosek złożony w terminie 21 dni. Spełnia kryteria Fast-Track (81,5%)."
                    : "Wniosek zsynchronizowany z chmury Supabase.",
                ],
            suggestedDecision: (output?.suggestedDecision || input.suggestedDecision || "AUTO_APPROVE_81_5") as any,
            status: (output?.status || input.status || "NEW") as any,
            upoHash: input.upoHash || `SHA256:${row.id.replace(/-/g, "").slice(0, 48)}`,
            source: "cloud",
            decisionDocument: output?.decisionDocument || input.decisionDocument,
          };

          return parsedCase;
        })
        .filter((c): c is InspectorCase => c !== null);
    } else if (error) {
      console.warn("Błąd odczytu z Supabase:", error.message);
    }
  } catch (err) {
    console.warn("Nie udało się połączyć z Supabase:", err);
  }

  // 2. Pobierz bufor lokalny z localStorage
  let localCases: InspectorCase[] = [];
  if (typeof window !== "undefined") {
    try {
      localCases = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    } catch (e) {
      console.warn("Błąd odczytu z localStorage:", e);
    }
  }

  // 3. Połącz i usuń duplikaty (priorytet mają dane z chmury, a lokalne uzupełniają brakujące)
  // Deduplikujemy wielokrotne zgłoszenia tego samego wnioskodawcy (ten sam PESEL / nazwisko)
  const caseMap = new Map<string, InspectorCase>();
  const seenApplicants = new Set<string>();

  // Dodaj sprawy z chmury (najnowsze mają pierwszeństwo, eliminujemy wielokrotne kliknięcia testowe)
  cloudCases.forEach((c) => {
    const applicantKey = `${c.applicantName?.trim().toLowerCase()}_${c.pesel}`;
    if (!seenApplicants.has(applicantKey)) {
      seenApplicants.add(applicantKey);
      caseMap.set(c.caseNumber, c);
    }
  });

  // Dodaj sprawy lokalne (jeśli nie ma ich w chmurze ani pod tym wnioskodawcą)
  localCases.forEach((c) => {
    const applicantKey = `${c.applicantName?.trim().toLowerCase()}_${c.pesel}`;
    if (!seenApplicants.has(applicantKey) && !caseMap.has(c.caseNumber)) {
      seenApplicants.add(applicantKey);
      caseMap.set(c.caseNumber, { ...c, source: "local" });
    }
  });

  const merged = Array.from(caseMap.values());

  return {
    cases: merged,
    isCloudConnected,
    cloudCount: cloudCases.length,
    lastSyncedAt: now,
  };
}

/**
 * Aktualizuje status sprawy i dokument decyzji w chmurze oraz w buforze lokalnym.
 */
export async function updateCaseStatusInCloud(
  caseNumber: string,
  newStatus: "APPROVED" | "BLOCKED" | "IN_REVIEW" | "AUDIT_REQUESTED",
  decisionDocument?: {
    formal: string;
    plainLanguage: string;
    generatedAt: string;
    officerSignature: string;
  }
): Promise<boolean> {
  // 1. Aktualizacja w localStorage
  if (typeof window !== "undefined") {
    try {
      const stored: InspectorCase[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      const updated = stored.map((c) => {
        if (c.caseNumber === caseNumber) {
          return {
            ...c,
            status: newStatus,
            decisionDocument: decisionDocument || c.decisionDocument,
          };
        }
        return c;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Błąd aktualizacji w localStorage:", e);
    }
  }

  // 2. Aktualizacja w Supabase
  try {
    const supabase = getBrowserClient() as any;
    const { data } = await supabase
      .from("benefit_calculation_history")
      .select("id, calculation_output")
      .eq("session_token", caseNumber)
      .maybeSingle();

    if (data && (data as any).id) {
      const currentOutput = ((data as any).calculation_output as any) || {};
      await supabase
        .from("benefit_calculation_history")
        .update({
          calculation_output: {
            ...currentOutput,
            status: newStatus,
            decisionDocument: decisionDocument || currentOutput.decisionDocument,
            updatedAt: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", (data as any).id);
    }
    return true;
  } catch (err) {
    console.warn("Błąd aktualizacji statusu w Supabase:", err);
    return false;
  }
}
