"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Phone, MapPin, Clock, FileCheck2, Lock } from "lucide-react";
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
    <footer className="w-full bg-[#EFF3EA] text-[#10371E] border-t-2 border-[#10371E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolumna 1: ZUS */}
          <div className="space-y-3">
            <ZusLogo size="sm" />
            <p className="text-xs text-[#59636e] leading-relaxed">
              Zasiłkowy Przewodnik Rodzica — informacje o świadczeniach, kalkulator zasiłków oraz wniosek ZAM zgodne ze stanem prawnym 2026.
            </p>
            <p className="text-[11px] text-[#007834] font-semibold">
              Standard dostępności WCAG 2.1 (AA/AAA)
            </p>
          </div>

          {/* Kolumna 2: Nawigacja */}
          <div>
            <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#dce1e5]">
              Na skróty
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/przewodnik" className="text-[#333333] hover:text-[#007834] hover:underline">
                  Co mi przysługuje? (Przewodnik)
                </Link>
              </li>
              <li>
                <Link href="/kalkulator" className="text-[#333333] hover:text-[#007834] hover:underline">
                  Kalkulator zasiłku macierzyńskiego
                </Link>
              </li>
              <li>
                <Link href="/e-uslugi" className="text-[#333333] hover:text-[#007834] hover:underline">
                  Wniosek ZAM i e-usługi ZUS
                </Link>
              </li>
              <li>
                <Link href="/trudne-sytuacje" className="text-[#333333] hover:text-[#007834] hover:underline">
                  Sytuacje trudne i wsparcie
                </Link>
              </li>
              <li>
                <Link href="/asystent-ai" className="text-[#333333] hover:text-[#007834] hover:underline">
                  Asystent AI (pytania i odpowiedzi)
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Serwisy ZUS */}
          <div>
            <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#dce1e5]">
              Serwisy publiczne
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.zus.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#333333] hover:text-[#007834] hover:underline inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-[#007834]" />
                  <span>Portal ZUS (zus.pl)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.zus.pl/portal/logowanie.npi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#333333] hover:text-[#007834] hover:underline inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-[#007834]" />
                  <span>Platforma Usług Elektronicznych (PUE/eZUS)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://bip.zus.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#333333] hover:text-[#007834] hover:underline inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-[#007834]" />
                  <span>Biuletyn Informacji Publicznej (BIP)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#333333] hover:text-[#007834] hover:underline inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-[#007834]" />
                  <span>Serwis RP gov.pl</span>
                </a>
              </li>
              {!isInMobileFrame && (
                <li>
                  <Link
                    href="/jury-sandbox"
                    className="text-[#59636e] hover:text-[#007834] hover:underline inline-flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-3 h-3 text-[#007834]" />
                    <span>Jury Sandbox & Weryfikacja kazusów</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Kolumna 4: Kontakt */}
          <div>
            <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider mb-3 pb-1.5 border-b border-[#dce1e5]">
              Centrum Kontaktu Klientów
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-white p-3.5 rounded border border-[#dce1e5] space-y-1">
                <div className="flex items-center gap-1.5 text-[#59636e] text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Infolinia ZUS:</span>
                </div>
                <p className="text-[#007834] font-extrabold text-lg leading-tight">22 560 16 00</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#59636e]">
                  <Clock className="w-3 h-3" />
                  <span>pn.–pt. 7:00–18:00</span>
                </div>
                <div className="pt-1.5 border-t border-[#edf0f2] flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <a href="mailto:mama@zus.pl" className="text-[#007834] hover:underline font-semibold">
                    mama@zus.pl
                  </a>
                  <a
                    href="https://www.zus.pl/e-wizyta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00416E] hover:underline font-semibold"
                  >
                    zus.pl/e-wizyta
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-[#59636e] flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#59636e] shrink-0 mt-0.5" />
                <span>Centrala ZUS: ul. Szamocka 3, 5, 01-748 Warszawa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dolna belka prawna */}
      <div className="bg-[#FAF8F2] py-3.5 px-4 sm:px-8 text-xs text-[#425B4A] border-t border-[#C8D7C5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p>&copy; 2026 Zakład Ubezpieczeń Społecznych</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
            <span className="hover:text-[#007834] cursor-pointer">Deklaracja dostępności</span>
            <span className="text-[#dce1e5]">|</span>
            <span className="hover:text-[#007834] cursor-pointer">Polityka prywatności</span>
            {!isInMobileFrame && (
              <>
                <span className="text-[#dce1e5]">|</span>
                <Link
                  href="/panel-pracownika"
                  className="text-[#59636e] hover:text-[#007834] inline-flex items-center gap-1 text-[11px]"
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
