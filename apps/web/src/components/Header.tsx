"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Eye,
  Phone,
  Smartphone,
  Volume2,
  VolumeX,
  Lock,
  LogIn,
  LogOut,
  UserCheck,
} from "lucide-react";
import { ZusLogo } from "./ZusLogo";
import { MobileSimulatorModal } from "./MobileSimulatorModal";
import { ZusLoginModal, LoggedInCitizen } from "./ZusLoginModal";
import { useParentProfile } from "@/context/ParentProfileContext";
import { TrudneSlowaModal } from "./TrudneSlowaModal";
import { ParentWizard } from "./ParentWizard";

export function Header() {
  const pathname = usePathname();
  const { isWizardOpen, closeWizard } = useParentProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<0 | 1 | 2>(0);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [citizenUser, setCitizenUser] = useState<LoggedInCitizen | null>(null);
  const [isInMobileFrame, setIsInMobileFrame] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("zus_citizen_auth");
      if (saved) setCitizenUser(JSON.parse(saved) as LoggedInCitizen);
    } catch {
      // ignore
    }
  }, []);

  const handleCitizenLogin = (user: LoggedInCitizen) => {
    setCitizenUser(user);
    try {
      sessionStorage.setItem("zus_citizen_auth", JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleCitizenLogout = () => {
    setCitizenUser(null);
    try {
      sessionStorage.removeItem("zus_citizen_auth");
    } catch {
      // ignore
    }
  };

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const mainEl = document.querySelector("main") || document.body;
    const text = (mainEl?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 1800);
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 0.96;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [pathname]);

  useEffect(() => {
    try {
      if (window.self !== window.top) {
        setIsInMobileFrame(true);
      }
    } catch {
      setIsInMobileFrame(true);
    }
  }, []);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.remove("font-large", "font-xlarge");
    document.body.classList.remove("font-large", "font-xlarge");
    if (fontSizeLevel === 1) {
      document.documentElement.classList.add("font-large");
      document.body.classList.add("font-large");
    } else if (fontSizeLevel === 2) {
      document.documentElement.classList.add("font-xlarge");
      document.body.classList.add("font-xlarge");
    }
  }, [fontSizeLevel]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/panel-pracownika")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Strona główna" },
    { href: "/przewodnik", label: "Przewodnik" },
    { href: "/kalkulator", label: "Kalkulator zasiłku" },
    { href: "/e-uslugi", label: "Wniosek ZAM, eZUS & USC" },
    { href: "/trudne-sytuacje", label: "Wsparcie szczególne" },
    { href: "/asystent-ai", label: "Konsultant ZUS" },
  ];

  return (
    <header className="w-full bg-[#FAF8F2] border-b border-[#C6D6C3] sticky top-0 z-40">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#10371E] focus:text-white focus:rounded-xl focus:outline-none"
      >
        Przejdź do treści głównej
      </a>

      {/* RZĄD 1: Logo ZUS, tytuł, infolinia i narzędzia dostępności */}
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3 ${
          isInMobileFrame ? "px-2.5 py-2" : "px-4 sm:px-6 py-3"
        }`}
      >
        {/* Lewa strona: Logo ZUS + tytuł + infolinia (w podglądzie telefonu kompaktowe logo, żeby ikony nie nachodziły na siebie) */}
        <div className="flex items-center gap-2 sm:gap-5 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-none">
            <span className={isInMobileFrame ? "block" : "sm:hidden"}>
              <ZusLogo size="sm" showText={false} />
            </span>
            {!isInMobileFrame && (
              <span className="hidden sm:block">
                <ZusLogo size="sm" />
              </span>
            )}
            {!isInMobileFrame && (
              <span className="hidden sm:inline text-base sm:text-lg font-extrabold text-[#10371E] tracking-tight whitespace-nowrap">
                Przewodnik Rodzica
              </span>
            )}
          </Link>

          {!isInMobileFrame && (
            <a
              href="tel:225601600"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#355240] hover:text-[#007834] border-l border-[#C6D6C3] pl-4 whitespace-nowrap transition-colors"
              title="Infolinia ZUS (pn.–pt. 7:00–18:00)"
            >
              <Phone className="w-3.5 h-3.5 text-[#007834]" />
              <span>Infolinia:</span>
              <strong className="text-[#10371E]">22 560 16 00</strong>
            </a>
          )}
        </div>

        {/* Prawa strona: Posłuchaj, Aa Wielkość liter, Kontrast, Zaloguj eZUS/mObywatel, Mobilna, Intranet */}
        <div className={`flex items-center shrink-0 ${isInMobileFrame ? "gap-1" : "gap-1.5 sm:gap-2"}`}>
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] text-xs font-bold transition-colors whitespace-nowrap ${
              isInMobileFrame ? "p-1.5" : "px-2.5 sm:px-3 py-1.5"
            } ${
              isSpeaking
                ? "bg-[#10371E] text-white border-[#10371E]"
                : "bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[#10371E]"
            }`}
            aria-pressed={isSpeaking}
            title="Odsłuchaj treść strony"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 shrink-0" />}
            {!isInMobileFrame && (
              <span className="hidden sm:inline">
                {isSpeaking ? "Zatrzymaj" : "Posłuchaj"}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFontSizeLevel((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
            className={`inline-flex items-center justify-center gap-1 rounded-xl border-[1.5px] text-xs font-bold transition-colors whitespace-nowrap ${
              isInMobileFrame ? "px-2 py-1.5" : "px-2.5 sm:px-3 py-1.5"
            } ${
              fontSizeLevel > 0
                ? "bg-[#10371E] text-white border-[#10371E]"
                : "bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[#10371E]"
            }`}
            title="Zmień wielkość liter"
          >
            <span>Aa</span>
            {!isInMobileFrame && (
              <span className="hidden lg:inline">
                Wielkość liter{fontSizeLevel === 1 ? " (+)" : fontSizeLevel === 2 ? " (++)" : ""}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`rounded-xl border-[1.5px] text-xs font-bold transition-colors ${
              isInMobileFrame ? "p-1.5" : "p-1.5 sm:px-2.5 sm:py-1.5"
            } ${
              highContrast
                ? "bg-black text-yellow-300 border-black"
                : "bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[#B9CCB6]"
            }`}
            aria-pressed={highContrast}
            title="Wysoki kontrast"
            aria-label="Wysoki kontrast"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Przycisk logowania PUE/eZUS + mObywatel */}
          {citizenUser ? (
            <div className="inline-flex items-center gap-1 bg-[#DCE8D3] border border-[#8CA68E] rounded-xl px-2 py-1 text-xs font-bold text-[#10371E]">
              <Link href="/e-uslugi" className="inline-flex items-center gap-1 hover:text-[#007834] whitespace-nowrap">
                <UserCheck className="w-3.5 h-3.5 text-[#007834] shrink-0" />
                {!isInMobileFrame && <span className="hidden sm:inline">{citizenUser.name}</span>}
              </Link>
              <button
                type="button"
                onClick={handleCitizenLogout}
                className="p-0.5 text-[#425B4A] hover:text-[#10371E]"
                title="Wyloguj z eZUS"
                aria-label="Wyloguj z eZUS"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className={`inline-flex items-center gap-1.5 bg-[#10371E] hover:bg-[#007834] text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap ${
                isInMobileFrame ? "px-2 py-1.5" : "px-3 py-1.5"
              }`}
              title="Zaloguj się przez PUE/eZUS, mObywatel lub Profil Zaufany"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>{isInMobileFrame ? "Zaloguj" : "Zaloguj (eZUS)"}</span>
            </button>
          )}

          {!isInMobileFrame && (
            <>
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[1.5px] border-[#B9CCB6] rounded-xl text-xs font-bold transition-colors"
                title="Podgląd aplikacji mobilnej"
                aria-label="Podgląd aplikacji mobilnej"
              >
                <Smartphone className="w-4 h-4" />
              </button>

              <Link
                href="/panel-pracownika"
                className="hidden xl:inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-[#DCE8D3] text-[#425B4A] hover:text-[#10371E] border-[1.5px] border-[#C6D6C3] rounded-xl text-xs font-semibold transition-colors"
                title="Panel pracownika ZUS (Intranet)"
                aria-label="Panel pracownika ZUS"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#10371E] hover:bg-[#DCE8D3] rounded-xl lg:hidden focus:outline-none shrink-0"
            aria-expanded={mobileMenuOpen}
            aria-label="Otwórz menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* RZĄD 2: Wyraźny, czytelny pasek nawigacji głównej */}
      {!isInMobileFrame && (
        <nav className="hidden lg:block bg-[#EFF3EA] border-t border-[#DCE8D3]" aria-label="Menu główne">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-2.5 text-[13px] font-bold border-b-[3px] transition-colors whitespace-nowrap ${
                      isActive
                        ? "border-[#10371E] text-[#10371E] bg-[#DCE8D3]/50"
                        : "border-transparent text-[#355240] hover:text-[#10371E] hover:border-[#B9CCB6]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <span className="text-xs text-[#425B4A] whitespace-nowrap">
              Stan prawny: <strong className="text-[#10371E]">2026</strong>
            </span>
          </div>
        </nav>
      )}

      {/* Mobilne menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F2] border-t border-[#C6D6C3] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2.5 rounded-xl text-sm font-bold ${
                  isActive
                    ? "bg-[#DCE8D3] text-[#10371E]"
                    : "text-[#10371E] hover:bg-[#EFF3EA]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      <MobileSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <ZusLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleCitizenLogin}
      />

      <TrudneSlowaModal />

      {isWizardOpen && <ParentWizard isModal onClose={closeWizard} />}
    </header>
  );
}
