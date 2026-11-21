"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
 Menu,
 X,
 Eye,
 Type,
 Phone,
 Compass,
 Calculator,
 FileText,
 HeartHandshake,
 Bot,
 Smartphone,
 LogIn,
 Lock,
 BookOpen,
 UserCheck,
 Volume2,
 VolumeX,
} from "lucide-react";
import { ZusLogo, PolishEmblem } from "./ZusLogo";
import { MobileSimulatorModal } from "./MobileSimulatorModal";
import { useParentProfile } from "@/context/ParentProfileContext";
import { TrudneSlowaModal } from "./TrudneSlowaModal";
import { ParentWizard } from "./ParentWizard";

export function Header() {
 const pathname = usePathname();
 const { profile, hasProfile, isWizardOpen, openWizard, closeWizard, openGlossary } = useParentProfile();
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [highContrast, setHighContrast] = useState(false);
 const [fontSizeLevel, setFontSizeLevel] = useState<0 | 1 | 2>(0);
 const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
 const [isInMobileFrame, setIsInMobileFrame] = useState(false);
 const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Całkowite odseparowanie: ukrycie nagłówka klienta w panelu pracownika (intranet ZUS)
 if (pathname?.startsWith("/panel-pracownika")) {
 return null;
  }

 const navItems = [
    { href: "/przewodnik", label: "Co mi przysługuje?", icon: Compass },
    { href: "/kalkulator", label: "Kalkulator świadczeń", icon: Calculator },
    { href: "/e-uslugi", label: "Wniosek ZAM i eZUS", icon: FileText },
    { href: "/trudne-sytuacje", label: "Wsparcie szczególne", icon: HeartHandshake },
    { href: "/asystent-ai", label: "Pomoc i pytania AI", icon: Bot },
 ];

 return (
    <header className="w-full bg-[#FAF8F2] border-b border-[#C8D7C5] sticky top-0 z-40">
      {/* Link dostępności dla czytników ekranu (Skip link) */}
      <a
 href="#main-content"
 className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#10371E] focus:text-white focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10371E]"
      >
 Przejdź do treści głównej
      </a>

      {/* Rząd 1: Ciepły pasek dostępności w stylu Przewodnika (Posłuchaj, Aa Wielkość liter, Kontrast) */}
      {!isInMobileFrame && (
        <div className="bg-[#EFF3EA] border-b border-[#D2DFCF] text-xs text-[#10371E] py-1.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            {/* Godło RP i oficjalna tożsamość */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 font-semibold text-[#10371E]">
                <PolishEmblem className="w-4 h-4" />
                <span>Rzeczpospolita Polska</span>
              </div>
              <span className="hidden md:inline text-[#B9CCB6]">|</span>
              <a
 href="tel:225601600"
 className="hidden sm:inline-flex items-center gap-1.5 text-[#10371E] hover:text-[#007834] transition-colors"
 title="Centrum Obsługi Telefonicznej ZUS (pn-pt 7:00-18:00)"
              >
                <Phone className="w-3.5 h-3.5 text-[#007834]" />
                <span className="hidden lg:inline text-[#425B4A]">Infolinia ZUS:</span>
                <span className="font-bold">22 560 16 00</span>
              </a>
            </div>

            {/* Przyciski dostępności inspirowane makietą: Posłuchaj + Aa Wielkość liter + Kontrast */}
            <div className="flex items-center gap-2">
              <button
 type="button"
 onClick={handleToggleSpeech}
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-[1.5px] text-xs font-bold transition-colors ${
 isSpeaking
                    ? "bg-[#10371E] text-white border-[#10371E]"
                    : "bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[#10371E]"
                }`}
 aria-pressed={isSpeaking}
 title="Odsłuchaj treść strony (lektor głosowy)"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? "Zatrzymaj" : "Posłuchaj"}</span>
              </button>

              <button
 type="button"
 onClick={() => setFontSizeLevel((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-[1.5px] text-xs font-bold transition-colors ${
 fontSizeLevel > 0
                    ? "bg-[#10371E] text-white border-[#10371E]"
                    : "bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[#10371E]"
                }`}
 title="Zmień wielkość liter na całej stronie"
              >
                <Type className="w-3.5 h-3.5 hidden sm:inline" />
                <span>
 Aa Wielkość liter{fontSizeLevel === 1 ? " (+)" : fontSizeLevel === 2 ? " (++)" : ""}
                </span>
              </button>

              <button
 type="button"
 onClick={() => setHighContrast(!highContrast)}
 className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border-[1.5px] text-xs font-bold transition-colors ${
 highContrast
                    ? "bg-black text-yellow-300 border-black"
                    : "bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[#B9CCB6]"
                }`}
 aria-pressed={highContrast}
 title="Przełącz wysoki kontrast (WCAG AAA)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Kontrast</span>
              </button>

              <Link
                href="/e-uslugi"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#10371E] hover:bg-[#007834] text-white font-bold text-xs px-3 py-1 rounded-xl transition-colors whitespace-nowrap"
                title="Przejdź do e-usług ZUS i wniosku ZAM"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>PUE/eZUS</span>
              </Link>

              <Link
                href="/panel-pracownika"
                className="hidden md:inline-flex items-center gap-1.5 bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[1.5px] border-[#B9CCB6] font-bold text-xs px-2.5 py-1 rounded-xl transition-colors whitespace-nowrap"
                title="Dostęp wewnętrzny do intranetu i decyzji ZUS dla inspektorów i płatników"
              >
                <Lock className="w-3.5 h-3.5 text-[#10371E]" />
                <span>Panel pracownika</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Rząd 2: Pasek z Oficjalnym Logo ZUS i Akcjami (dopasowany do ekranu telefonu i desktopu) */}
      <div
 className={`max-w-7xl mx-auto flex items-center justify-between gap-2 ${
 isInMobileFrame ? "px-3 py-2.5" : "px-3 sm:px-8 py-3"
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <Link href="/" className="flex items-center group focus:outline-none shrink-0">
            {/* Na wąskich ekranach / w podglądzie telefonu sam sygnet ZUS, na większych pełne logo */}
            <span className={isInMobileFrame ? "block" : "sm:hidden"}>
              <ZusLogo size="sm" showText={false} />
            </span>
            {!isInMobileFrame && (
              <span className="hidden sm:block">
                <ZusLogo size="md" />
              </span>
            )}
          </Link>

          <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

          <div className="hidden sm:flex flex-col min-w-0">
            <span className="text-lg sm:text-xl font-bold text-[#10371E] tracking-tight leading-tight truncate">
 Przewodnik Rodzica
            </span>
            <span className="text-xs text-slate-500 font-medium truncate">
 Oficjalny portal uprawnień, świadczeń i kalkulatora rodzicielskiego 2026
            </span>
          </div>
        </div>

        {/* Prawy róg: Dostępność (w mobileSim), Trudne Słowa, Profil Rodzica, Symulator Mobilny, Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isInMobileFrame && (
            <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-md px-1 py-0.5">
              <button
 type="button"
 onClick={() => setHighContrast(!highContrast)}
 className={`p-1 rounded transition-colors ${
 highContrast
                    ? "bg-black text-yellow-300"
                    : "text-[#425B4A] hover:bg-slate-200"
                }`}
 aria-pressed={highContrast}
 title="Wysoki kontrast"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
 type="button"
 onClick={() => setFontSizeLevel((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
 className="px-1 py-0.5 rounded text-[10px] font-extrabold text-[#2E4B38] hover:bg-slate-200 transition-colors"
 title="Zmień rozmiar czcionki"
              >
                {fontSizeLevel === 0 ? "A" : fontSizeLevel === 1 ? "A+" : "A++"}
              </button>
            </div>
          )}

          {/* Przycisk Słowniczka Trudnych Słów */}
          <button
 type="button"
 onClick={() => openGlossary()}
 className="inline-flex items-center gap-1.5 bg-white hover:bg-[#EFF3EA] text-[#222222] hover:text-[#007834] border border-[#C6D6C3] hover:border-[#007834] font-semibold text-[11px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded transition-colors focus:outline-none whitespace-nowrap"
 title="Otwórz słowniczek trudnych pojęć ZUS"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#007834] shrink-0" />
            <span className="hidden sm:inline">Trudne słowa</span>
            <span className="sm:hidden">Słownik</span>
          </button>

          {/* Przycisk Profilu Rodzica */}
          <button
 type="button"
 onClick={openWizard}
 className={`inline-flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded transition-colors focus:outline-none border whitespace-nowrap ${
 hasProfile
                ? "bg-[#DCE8D3] hover:bg-[#e1f0e7] text-[#007834] border-[#007834]"
                : "bg-[#007834] hover:bg-[#005f29] text-white border-[#007834]"
            }`}
 title="Otwórz konfigurator profilu rodziny"
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            {hasProfile ? (
              <span className="hidden md:inline">
 Profil: {profile?.whoOnLeave === "both" ? "Oboje" : profile?.whoOnLeave === "father" ? "Tata" : "Mama"} ({profile?.monthlySalaryGross.toLocaleString("pl-PL")} zł)
              </span>
            ) : null}
            <span className={hasProfile ? "md:hidden" : ""}>
              {hasProfile ? "Profil" : isInMobileFrame ? "Start" : "Szybki start"}
            </span>
          </button>

          {!isInMobileFrame && (
            <button
 type="button"
 onClick={() => setIsSimulatorOpen(true)}
 className="inline-flex items-center gap-1.5 bg-white hover:bg-[#EFF3EA] text-[#222222] hover:text-[#007834] border border-[#C6D6C3] hover:border-[#007834] font-semibold text-xs px-2.5 sm:px-3 py-2 rounded transition-colors focus:outline-none whitespace-nowrap"
 title="Otwórz symulator smartfona z aplikacją mobilną"
            >
              <Smartphone className="w-4 h-4 text-[#007834]" />
              <span className="hidden xl:inline">Aplikacja mobilna</span>
              <span className="xl:hidden">Mobilna</span>
            </button>
          )}

          <button
 type="button"
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="p-1.5 sm:p-2 text-[#2E4B38] hover:text-[#007834] hover:bg-[#EFF3EA] rounded-lg lg:hidden focus:outline-none shrink-0"
 aria-expanded={mobileMenuOpen}
 aria-label="Otwórz menu nawigacji"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Rząd 3: Czysta, ciepła nawigacja w motywie Przewodnika Rodzica */}
      <nav className="hidden lg:block bg-[#FAF8F2] border-t border-[#DCE8D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
 href="/"
 className={`px-3.5 py-3 text-[13px] font-bold border-b-[3px] transition-colors ${
 pathname === "/"
                  ? "border-[#10371E] text-[#10371E]"
                  : "border-transparent text-[#355240] hover:text-[#10371E] hover:border-[#B9CCB6]"
              }`}
            >
 Strona główna
            </Link>

            {navItems.map((item) => {
 const isActive =
 pathname === item.href || pathname.startsWith(`${item.href}/`);
 return (
                <Link
 key={item.href}
 href={item.href}
 className={`px-3.5 py-3 text-[13px] font-bold border-b-[3px] transition-colors ${
 isActive
                      ? "border-[#10371E] text-[#10371E]"
                      : "border-transparent text-[#355240] hover:text-[#10371E] hover:border-[#B9CCB6]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <span className="text-xs text-[#425B4A]">
 Stan prawny: <strong className="text-[#10371E]">2026</strong>
          </span>
        </div>
      </nav>

      {/* Mobilne Menu (Drawer) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl px-4 py-4 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
 Menu Przewodnika Rodzica ZUS
          </div>
          <Link
 href="/"
 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold ${
 pathname === "/"
                ? "bg-[#007834] text-white"
                : "text-[#1D4029] hover:bg-[#EFF3EA]"
            }`}
          >
            <span>Strona główna</span>
          </Link>
          {navItems.map((item) => {
 const isActive =
 pathname === item.href || pathname.startsWith(`${item.href}/`);
 const Icon = item.icon;
 return (
              <Link
 key={item.href}
 href={item.href}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold ${
 isActive
                    ? "bg-[#007834] text-white"
                    : "text-[#1D4029] hover:bg-[#EFF3EA]"
                }`}
              >
                <Icon
 className={`w-4 h-4 ${
 isActive ? "text-white" : "text-[#007834]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal Symulatora Mobilnego */}
      <MobileSimulatorModal
 isOpen={isSimulatorOpen}
 onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Słowniczek Trudnych Słów ZUS */}
      <TrudneSlowaModal />

      {/* Modal Szybkiego Startu Rodzica */}
      {isWizardOpen && (
        <ParentWizard isModal onClose={closeWizard} />
      )}
    </header>
  );
}
