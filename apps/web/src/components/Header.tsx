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

      {/* Rząd 1: Pasek Rządowy i Dostępności ZUS (jak na zus.pl) */}
      <div className="bg-[#f8f9fa] border-b border-slate-200 text-xs text-slate-700 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
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
          <div className="flex items-center gap-3 sm:gap-4">
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
            <span className="text-xs font-bold text-[#007834] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PL
            </span>

            {/* Przycisk Logowania do PUE/eZUS w stylu zus.pl */}
            <Link
              href="/e-uslugi"
              className="inline-flex items-center gap-1.5 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs px-3 py-1 rounded transition-colors shadow-2xs"
              title="Przejdź do e-usług ZUS i wniosku ZAM"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Zaloguj do</span>
              <span>PUE/eZUS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Rząd 2: Pasek z Oficjalnym Logo ZUS i Tytułem */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center group focus:outline-none">
            {/* Oficjalne SVG z zus.pl */}
            <ZusLogo size="md" />
          </Link>

          <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

          <div className="hidden sm:flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Przewodnik Rodzica
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Oficjalny portal uprawnień, świadczeń i kalkulatora rodzicielskiego 2026
            </span>
          </div>
        </div>

        {/* Prawy róg: Trudne Słowa, Profil Rodzica, Symulator Mobilny, Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Przycisk Słowniczka Trudnych Słów */}
          <button
            type="button"
            onClick={() => openGlossary()}
            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#00416E] border border-blue-200 font-bold text-xs px-2.5 sm:px-3 py-2 rounded-lg transition-all focus:outline-none shadow-2xs"
            title="Otwórz słowniczek trudnych pojęć ZUS"
          >
            <BookOpen className="w-4 h-4 text-[#00416E]" />
            <span className="hidden sm:inline">Trudne słowa</span>
            <span className="sm:hidden">Słownik</span>
          </button>

          {/* Przycisk Profilu Rodzica */}
          <button
            type="button"
            onClick={openWizard}
            className={`inline-flex items-center gap-1.5 font-bold text-xs px-2.5 sm:px-3 py-2 rounded-lg transition-all focus:outline-none shadow-2xs border ${
              hasProfile
                ? "bg-emerald-50 hover:bg-emerald-100 text-[#007834] border-emerald-300"
                : "bg-[#007834] hover:bg-[#00622a] text-white border-[#007834]"
            }`}
            title="Otwórz konfigurator profilu rodziny"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {hasProfile ? (
              <span className="hidden md:inline">
                Profil: {profile?.whoOnLeave === "both" ? "Oboje" : profile?.whoOnLeave === "father" ? "Tata" : "Mama"} ({profile?.monthlySalaryGross.toLocaleString("pl-PL")} zł)
              </span>
            ) : null}
            <span className={hasProfile ? "md:hidden" : ""}>
              {hasProfile ? "Profil" : "Szybki start"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#f0f8f3] hover:bg-[#e2f2e6] text-[#007834] border border-[#c2e4cc] font-bold text-xs px-2.5 sm:px-3 py-2 rounded-lg transition-all focus:outline-none"
            title="Otwórz symulator smartfona z aplikacją mobilną"
          >
            <Smartphone className="w-4 h-4 text-[#007834]" />
            <span className="hidden xl:inline">Aplikacja mobilna</span>
            <span className="xl:hidden">Mobilna</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#007834] hover:bg-slate-100 rounded-lg lg:hidden focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Otwórz menu nawigacji"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Rząd 3: Główny Pasek Menu w stylu ZUS.pl (ZUS Green Bar) */}
      <nav className="hidden lg:block bg-[#007834] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-0.5 py-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold transition-colors ${
                pathname === "/"
                  ? "bg-[#00622a] text-white shadow-inner"
                  : "text-emerald-50 hover:bg-[#00622a] hover:text-white"
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
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#00622a] text-white shadow-inner"
                      : "text-emerald-50 hover:bg-[#00622a] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="text-[11px] text-emerald-100 font-semibold flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-300"></span>
            <span>Stan prawny: 2026 (WLB & art. 180 KP)</span>
          </div>
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
