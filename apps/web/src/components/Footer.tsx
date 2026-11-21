"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Phone, ShieldCheck, MapPin, Clock, FileCheck2, Lock } from "lucide-react";
import { ZusLogo } from "./ZusLogo";

export function Footer() {
  const pathname = usePathname();
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

  // Całkowite odseparowanie: ukrycie stopki klienta w panelu pracownika (intranet ZUS)
  if (pathname?.startsWith("/panel-pracownika")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#212529] text-slate-300 border-t-4 border-[#007834] mt-auto">
      {/* Sekcja Główna */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolumna 1: ZUS i Misja */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded inline-block shadow-sm">
              <ZusLogo size="sm" />
            </div>
            <h3 className="text-white font-bold text-sm tracking-tight">
              Zasiłkowy Przewodnik Rodzica
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Oficjalna platforma Zakładu Ubezpieczeń Społecznych dedykowana przyszłym i obecnym rodzicom. Zapewnia rzetelne obliczenia świadczeń i bezbłędne wnioski zgodnie z Kodeksem Pracy 2026.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-[#007834]" />
              <span>Zgodność ze standardem WCAG 2.1 (poziom AA/AAA)</span>
            </div>
          </div>

          {/* Kolumna 2: Sprawy rodzica */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-700">
              Świadczenia i uprawnienia
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/przewodnik" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#007834]">&rsaquo;</span>
                  <span>Co mi przysługuje (od ciąży po powrót)</span>
                </Link>
              </li>
              <li>
                <Link href="/kalkulator" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#007834]">&rsaquo;</span>
                  <span>Kalkulator zasiłku (81,5% vs 100/70%)</span>
                </Link>
              </li>
              <li>
                <Link href="/e-uslugi" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#007834]">&rsaquo;</span>
                  <span>Wniosek ZAM oraz konto eZUS / PUE</span>
                </Link>
              </li>
              <li>
                <Link href="/trudne-sytuacje" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#007834]">&rsaquo;</span>
                  <span>Wsparcie szczególne i trudne sytuacje</span>
                </Link>
              </li>
              <li>
                <Link href="/asystent-ai" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#007834]">&rsaquo;</span>
                  <span>Asystent sztucznej inteligencji ZUS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Instytucje i prawo */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-700">
              Przydatne serwisy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.zus.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Portal główny: zus.pl</span>
                </a>
              </li>
              <li>
                <a
                  href="https://bip.zus.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Biuletyn Informacji Publicznej (BIP)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Serwis RP gov.pl</span>
                </a>
              </li>
              {!isInMobileFrame && (
                <li>
                  <Link href="/jury-sandbox" className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Jury Sandbox & Weryfikacja kazusów</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Kolumna 4: Kontakt i Infolinia */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-700">
              Centrum kontaktu z klientami
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-[#2c3237] p-3.5 rounded border border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Phone className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Centrum Obsługi Telefonicznej:</span>
                </div>
                <p className="text-[#007834] font-black text-lg">22 560 16 00</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Dostępne: pn.–pt. 7:00–18:00</span>
                </div>
                <div className="pt-1.5 border-t border-slate-700/80 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <a href="mailto:mama@zus.pl" className="text-emerald-400 hover:underline font-semibold">
                    mama@zus.pl
                  </a>
                  <a
                    href="https://www.zus.pl/e-wizyta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white hover:underline"
                  >
                    zus.pl/e-wizyta
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>Centrala ZUS: ul. Szamocka 3, 5, 01-748 Warszawa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dolna belka prawna w stylu ZUS.pl */}
      <div className="bg-[#181a1d] py-3.5 px-4 sm:px-8 text-xs text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p>
            &copy; 2026 Zakład Ubezpieczeń Społecznych &bull; Wszelkie prawa zastrzeżone
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Deklaracja dostępności</span>
            <span>&bull;</span>
            <span className="hover:text-white transition-colors cursor-pointer">Polityka prywatności i cookies</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-medium">Dyrektywa Work-Life Balance</span>
            {!isInMobileFrame && (
              <>
                <span>&bull;</span>
                <Link
                  href="/panel-pracownika"
                  className="text-slate-500 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                  title="ZSI ZUS: Dostęp wewnętrzny dla pracowników i płatników"
                >
                  <Lock className="w-3 h-3" />
                  <span>Intranet ZUS</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
