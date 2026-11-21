"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Phone, Lock } from "lucide-react";
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

  if (pathname?.startsWith("/panel-pracownika")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#EFF3EA] text-[#10371E] border-t border-[#C6D6C3] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          {/* Kolumna 1: ZUS */}
          <div className="space-y-3">
            <ZusLogo size="sm" />
            <p className="text-[#425B4A] leading-relaxed">
              Zasiłkowy Przewodnik Rodzica. Obliczenia i wzory wniosków zgodne ze stanem prawnym 2026.
            </p>
            <p className="text-[#425B4A]">
              Centrala ZUS, ul. Szamocka 3, 5, 01-748 Warszawa
            </p>
          </div>

          {/* Kolumna 2: Linki */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#10371E]">Na skróty</h4>
            <ul className="space-y-1.5 text-[#355240]">
              <li>
                <Link href="/przewodnik" className="hover:text-[#007834] hover:underline">
                  Przewodnik krok po kroku
                </Link>
              </li>
              <li>
                <Link href="/kalkulator" className="hover:text-[#007834] hover:underline">
                  Kalkulator zasiłku
                </Link>
              </li>
              <li>
                <Link href="/e-uslugi" className="hover:text-[#007834] hover:underline">
                  Wniosek ZAM i eZUS
                </Link>
              </li>
              <li>
                <Link href="/trudne-sytuacje" className="hover:text-[#007834] hover:underline">
                  Wsparcie w trudnych sytuacjach
                </Link>
              </li>
              <li>
                <a
                  href="https://www.zus.pl/documents/10182/167567/1184_26+Poradnik+dla+rodzic%C3%B3w.pdf/9378de60-151e-9b9f-ba65-abdf41d9f5b4?t=1777453101936"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#007834] hover:underline inline-flex items-center gap-1"
                >
                  <span>Oficjalny Poradnik ZUS 2026 (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Kontakt */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#10371E]">Kontakt z ZUS</h4>
            <div className="space-y-1.5 text-[#355240]">
              <a
                href="tel:225601600"
                className="inline-flex items-center gap-1.5 font-extrabold text-base text-[#10371E] hover:text-[#007834]"
              >
                <Phone className="w-4 h-4 text-[#007834]" />
                <span>22 560 16 00</span>
              </a>
              <p>Poniedziałek – piątek, 7:00 – 18:00</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="mailto:mama@zus.pl" className="font-bold text-[#007834] hover:underline">
                  mama@zus.pl
                </a>
                <a
                  href="https://www.zus.pl/e-wizyta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#10371E] hover:underline"
                >
                  e-wizyta ZUS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dolna belka */}
      <div className="bg-[#FAF8F2] py-3 px-4 sm:px-6 text-xs text-[#425B4A] border-t border-[#C6D6C3]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Zakład Ubezpieczeń Społecznych</span>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.zus.pl/o-zus/o-nas/deklaracja-dostepnosci"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10371E] hover:underline"
            >
              Deklaracja dostępności
            </a>
            {!isInMobileFrame && (
              <>
                <span className="text-[#B9CCB6]">|</span>
                <Link href="/jury-sandbox" className="hover:text-[#10371E] hover:underline">
                  Strefa testowa
                </Link>
                <span className="text-[#B9CCB6]">|</span>
                <Link href="/admin" className="hover:text-[#10371E] hover:underline">
                  Parametry ZUS
                </Link>
                <span className="text-[#B9CCB6]">|</span>
                <Link
                  href="/panel-pracownika"
                  className="hover:text-[#10371E] hover:underline inline-flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Panel pracownika (Logowanie)</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
