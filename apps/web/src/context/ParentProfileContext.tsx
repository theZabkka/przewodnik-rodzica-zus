"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ParentProfile } from "@hacknation/shared";

interface ParentProfileContextType {
  profile: ParentProfile | null;
  hasProfile: boolean;
  updateProfile: (data: Partial<ParentProfile>) => void;
  clearProfile: () => void;
  // Stan modali
  isWizardOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
  isGlossaryOpen: boolean;
  activeGlossaryTermId: string | null;
  openGlossary: (termId?: string) => void;
  closeGlossary: () => void;
}

const STORAGE_KEY = "zus_parent_profile";
const ZAM_PREFILL_KEY = "zus_zam_prefill";

const ParentProfileContext = createContext<ParentProfileContextType | undefined>(undefined);

export function ParentProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [activeGlossaryTermId, setActiveGlossaryTermId] = useState<string | null>(null);

  // Inicjalizacja z localStorage po stronie klienta
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ParentProfile = JSON.parse(stored);
        setProfile(parsed);
      }
    } catch (e) {
      console.error("Błąd odczytu profilu z localStorage:", e);
    }
  }, []);

  const updateProfile = useCallback((data: Partial<ParentProfile>) => {
    setProfile((prev) => {
      const updated: ParentProfile = {
        whoOnLeave: data.whoOnLeave ?? prev?.whoOnLeave ?? "mother",
        childrenCount: data.childrenCount ?? prev?.childrenCount ?? 1,
        contractType: data.contractType ?? prev?.contractType ?? "employment",
        monthlySalaryGross: data.monthlySalaryGross ?? prev?.monthlySalaryGross ?? 7500,
        isPretermOrHospitalized: data.isPretermOrHospitalized ?? prev?.isPretermOrHospitalized ?? false,
        hospitalDays: data.hospitalDays ?? prev?.hospitalDays ?? 0,
        birthWeek: data.birthWeek ?? prev?.birthWeek ?? 38,
        birthWeightGrams: data.birthWeightGrams ?? prev?.birthWeightGrams ?? 3200,
        worksPartTime: data.worksPartTime ?? prev?.worksPartTime ?? false,
        workFteRatio: data.workFteRatio ?? prev?.workFteRatio ?? 0.5,
        submittedIn21Days: data.submittedIn21Days ?? prev?.submittedIn21Days ?? true,
        hasLifeCertificate: data.hasLifeCertificate ?? prev?.hasLifeCertificate ?? false,
        updatedAt: new Date().toISOString(),
      };

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Automatyczna synchronizacja z mostkiem ZAM dla e-usług
        const zamPayload = {
          contractType: updated.contractType,
          monthlySalaryGross: updated.monthlySalaryGross,
          childrenCount: updated.childrenCount,
          chosenRate: updated.submittedIn21Days ? "815" : "100_70",
          isPremature: updated.isPretermOrHospitalized,
          hospitalDays: updated.hospitalDays,
          hasLifeCert: updated.hasLifeCertificate,
        };
        window.localStorage.setItem(ZAM_PREFILL_KEY, JSON.stringify(zamPayload));
      } catch (e) {
        console.error("Błąd zapisu profilu do localStorage:", e);
      }

      return updated;
    });
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openWizard = useCallback(() => setIsWizardOpen(true), []);
  const closeWizard = useCallback(() => setIsWizardOpen(false), []);

  const openGlossary = useCallback((termId?: string) => {
    setActiveGlossaryTermId(termId || null);
    setIsGlossaryOpen(true);
  }, []);

  const closeGlossary = useCallback(() => {
    setIsGlossaryOpen(false);
    setActiveGlossaryTermId(null);
  }, []);

  return (
    <ParentProfileContext.Provider
      value={{
        profile,
        hasProfile: profile !== null,
        updateProfile,
        clearProfile,
        isWizardOpen,
        openWizard,
        closeWizard,
        isGlossaryOpen,
        activeGlossaryTermId,
        openGlossary,
        closeGlossary,
      }}
    >
      {children}
    </ParentProfileContext.Provider>
  );
}

export function useParentProfile() {
  const context = useContext(ParentProfileContext);
  if (!context) {
    throw new Error("useParentProfile musi być używane wewnątrz ParentProfileProvider");
  }
  return context;
}
