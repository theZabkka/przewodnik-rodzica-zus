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
  Sliders, 
  Scale, 
  Bot,
  Smartphone,
} from "lucide-react";
import { ZusLogo, PolishEmblem } from "./ZusLogo";
import { MobileSimulatorModal } from "./MobileSimulatorModal";

export function Header() {
  const pathname = usePathname();
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
    document.body.classList.remove("font-large", "font-xlarge");
    if (fontSizeLevel === 1) {
      document.body.classList.add("font-large");
    } else if (fontSizeLevel === 2) {
      document.body.classList.add("font-xlarge");
    }
  }, [fontSizeLevel]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/przewodnik", label: "Co mi przysługuje?", icon: Compass },
    { href: "/kalkulator", label: "Kalkulator świadczeń", icon: Calculator },
    { href: "/e-uslugi", label: "Wniosek ZAM i eZUS", icon: FileText },
    { href: "/trudne-sytuacje", label: "Wsparcie szczególne", icon: HeartHandshake },
    { href: "/asystent-ai", label: "Pomoc i pytania AI", icon: Bot },
    { href: "/jury-sandbox", label: "Strefa testowa", icon: Scale },
    { href: "/admin", label: "Parametry prawne", icon: Sliders },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Skip to main content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00823C] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Przejdź do treści głównej
      </a>

      {/* Rząd 1: Pasek Rządowy i Dostępności */}
      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Godło i oficjalna identyfikacja */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <PolishEmblem className="w-4 h-4 shadow-xs" />
              <span>Rzeczpospolita Polska</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-600 font-medium">
              Oficjalny serwis Zakładu Ubezpieczeń Społecznych
            </span>
          </div>

          {/* Infolinia i Dostępność */}
          <div className="flex items-center gap-4">
            <a
              href="tel:225601600"
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#00823C] transition-colors"
              title="Centrum Obsługi Telefonicznej ZUS"
            >
              <Phone className="w-3.5 h-3.5 text-[#00823C]" />
              <span className="hidden md:inline">Infolinia:</span>
              <span className="font-bold">22 560 16 00</span>
            </a>

            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2 py-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors ${
                  highContrast
                    ? "bg-black text-yellow-300 font-bold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                aria-pressed={highContrast}
                title="Włącz lub wyłącz wysoki kontrast"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="sr-only sm:not-sr-only">Kontrast</span>
              </button>

              <span className="text-slate-300" aria-hidden="true">|</span>

              <button
                type="button"
                onClick={() => setFontSizeLevel((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                title="Zmień rozmiar czcionki"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="font-bold">
                  {fontSizeLevel === 0 ? "A" : fontSizeLevel === 1 ? "A+" : "A++"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rząd 2: Główny Pasek z Logo ZUS, Tytułem i Przełącznikiem Aplikacji Mobilnej */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-4 group focus:outline-none">
          <ZusLogo size="md" />
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#00823C] transition-colors leading-none">
              Przewodnik Rodzica
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">
              Spokojny przewodnik po prawach i świadczeniach dla Twojej rodziny
            </span>
          </div>
        </Link>

        {/* Prawy róg: Przycisk Aplikacji Mobilnej oraz Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            className="inline-flex items-center gap-2 bg-[#00823C] hover:bg-[#006e33] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm focus:outline-none"
            title="Otwórz symulator smartfona dla jurorów i rodziców"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Widok aplikacji mobilnej</span>
            <span className="sm:hidden">Aplikacja</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#00823C] hover:bg-slate-100 rounded-lg lg:hidden focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Otwórz menu nawigacji"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Rząd 3: Czysta, przestronna nawigacja desktopowa */}
      <nav className="hidden lg:block bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#00823C] text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Stan prawny: 2026
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl px-5 py-4 space-y-2 animate-in fade-in duration-150">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
            Nawigacja serwisu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold ${
                  isActive
                    ? "bg-[#00823C] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#00823C]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal Symulatora Aplikacji Mobilnej */}
      <MobileSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </header>
  );
};
