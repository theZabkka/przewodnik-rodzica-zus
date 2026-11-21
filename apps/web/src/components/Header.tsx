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
  BookOpen,
  Sparkles,
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
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Link dostępności dla czytników ekranu (Skip link) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#007834] focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007834]"
      >
        Przejdź do treści głównej
      </a>

      {/* Rząd 1: Pasek Rządowy i Dostępności ZUS (ukrywany w kompaktowym podglądzie mobilnym) */}
      {!isInMobileFrame && (
        <div className="bg-[#f8f9fa] border-b border-slate-200 text-xs text-slate-700 py-1.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            {/* Godło RP i oficjalna tożsamość */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <PolishEmblem className="w-4 h-4 shadow-2xs" />
                <span>Rzeczpospolita Polska</span>
              </div>
              <span className="hidden md:inline text-slate-300">|</span>
              <span className="hidden md:inline text-slate-600 font-normal">
                Oficjalny serwis Zakładu Ubezpieczeń Społecznych &bull; zus.pl
              </span>
            </div>

            {/* Infolinia, Dostępność, Język oraz Przycisk eZUS */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="tel:225601600"
                className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-[#007834] transition-colors"
                title="Centrum Obsługi Telefonicznej ZUS (pn-pt 7:00-18:00)"
              >
                <Phone className="w-3.5 h-3.5 text-[#007834]" />
                <span className="hidden lg:inline text-slate-500">Infolinia:</span>
                <span className="font-bold text-slate-800">22 560 16 00</span>
              </a>

              {/* Narzędzia dostępności WCAG */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-0.5">
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    highContrast
                      ? "bg-black text-yellow-300 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  aria-pressed={highContrast}
                  title="Przełącz wysoki kontrast (WCAG AAA)"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Kontrast</span>
                </button>

                <span className="text-slate-300">|</span>

                <button
                  type="button"
                  onClick={() => setFontSizeLevel((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Zmień rozmiar czcionki"
                >
                  <Type className="w-3 h-3" />
                  <span>
                    {fontSizeLevel === 0 ? "A" : fontSizeLevel === 1 ? "A+" : "A++"}
                  </span>
                </button>
              </div>

              {/* Wybór języka jak na zus.pl */}
              <span className="hidden xs:inline-block text-xs font-bold text-[#007834] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PL
              </span>

              {/* Przycisk Logowania do PUE/eZUS w stylu zus.pl */}
              <Link
                href="/e-uslugi"
                className="inline-flex items-center gap-1.5 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs px-2.5 sm:px-3 py-1 rounded transition-colors shadow-2xs whitespace-nowrap"
                title="Przejdź do e-usług ZUS i wniosku ZAM"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zaloguj do</span>
                <span>PUE/eZUS</span>
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
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
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
                    : "text-slate-600 hover:bg-slate-200"
                }`}
                aria-pressed={highContrast}
                title="Wysoki kontrast"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
                className="px-1 py-0.5 rounded text-[10px] font-extrabold text-slate-700 hover:bg-slate-200 transition-colors"
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
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#f4f6f7] text-[#222222] hover:text-[#007834] border border-[#dce1e5] hover:border-[#007834] font-semibold text-[11px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded transition-colors focus:outline-none whitespace-nowrap"
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
                ? "bg-[#eef6f1] hover:bg-[#e1f0e7] text-[#007834] border-[#007834]"
                : "bg-[#007834] hover:bg-[#005f29] text-white border-[#007834]"
            }`}
            title="Otwórz konfigurator profilu rodziny"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
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
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#f4f6f7] text-[#222222] hover:text-[#007834] border border-[#dce1e5] hover:border-[#007834] font-semibold text-xs px-2.5 sm:px-3 py-2 rounded transition-colors focus:outline-none whitespace-nowrap"
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
            className="p-1.5 sm:p-2 text-slate-700 hover:text-[#007834] hover:bg-slate-100 rounded-lg lg:hidden focus:outline-none shrink-0"
            aria-expanded={mobileMenuOpen}
            aria-label="Otwórz menu nawigacji"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Rząd 3: Czysta, płaska nawigacja w stylu zus.pl (białe tło + zielone podkreślenie) */}
      <nav className="hidden lg:block bg-white border-t border-[#edf0f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-3 text-[13px] font-semibold border-b-[3px] transition-colors ${
                pathname === "/"
                  ? "border-[#007834] text-[#007834]"
                  : "border-transparent text-[#222222] hover:text-[#007834] hover:border-[#c2e4cc]"
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
                  className={`px-3.5 py-3 text-[13px] font-semibold border-b-[3px] transition-colors ${
                    isActive
                      ? "border-[#007834] text-[#007834]"
                      : "border-transparent text-[#222222] hover:text-[#007834] hover:border-[#c2e4cc]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <span className="text-xs text-[#59636e]">
            Stan prawny: <strong className="text-[#222222]">2026</strong>
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
                : "text-slate-800 hover:bg-slate-100"
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
                    : "text-slate-800 hover:bg-slate-100"
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
