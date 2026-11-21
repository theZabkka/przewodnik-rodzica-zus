import React from "react";
import Link from "next/link";
import { ExternalLink, Heart, Phone, HelpCircle, ShieldCheck, Lock } from "lucide-react";
import { ZusLogo } from "./ZusLogo";

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t-4 border-[#00823C] mt-auto">
      {/* Sekcja Główna */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolumna 1: ZUS i Misja */}
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
              <ZusLogo size="sm" />
            </div>
            <h3 className="text-white font-extrabold text-base">
              Przewodnik Rodzica
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Oficjalna platforma Zakładu Ubezpieczeń Społecznych stworzona z myślą o przyszłych i obecnych rodzicach. Proste wyjaśnienia, bezpieczne wyliczenia i bezbłędne wnioski.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standard dostępności WCAG 2.1 AAA</span>
            </div>
          </div>

          {/* Kolumna 2: Sprawy rodzica */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Twoje sprawy i uprawnienia
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/przewodnik" className="hover:text-white transition-colors">
                  Co mi przysługuje (od ciąży po powrót do pracy)
                </Link>
              </li>
              <li>
                <Link href="/kalkulator" className="hover:text-white transition-colors">
                  Kalkulator wysokości zasiłku (81,5% vs 100/70%)
                </Link>
              </li>
              <li>
                <Link href="/e-uslugi" className="hover:text-white transition-colors">
                  Wniosek ZAM oraz konto ubezpieczonego w eZUS
                </Link>
              </li>
              <li>
                <Link href="/trudne-sytuacje" className="hover:text-white transition-colors">
                  Wsparcie w sytuacjach szczególnych i trudnych
                </Link>
              </li>
              <li>
                <Link href="/asystent-ai" className="hover:text-white transition-colors">
                  Zadaj pytanie asystentowi prawnemu
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolumna 3: Instytucje i prawo */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Instytucje państwowe
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://www.zus.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Oficjalny portal zus.pl</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Serwis Rzeczypospolitej Polskiej (gov.pl)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://empatia.mpips.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Portal Informacyjno-Usługowy Emp@tia</span>
                </a>
              </li>
              <li>
                <a
                  href="https://pacjent.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Internetowe Konto Pacjenta (pacjent.gov.pl)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Kolumna 4: Pomoc telefoniczna */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Infolinia i pomoc
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Phone className="w-4 h-4 text-[#00823C]" />
                  <span>Centrum Obsługi Telefonicznej ZUS:</span>
                </div>
                <p className="text-emerald-400 font-extrabold text-base">22 560 16 00</p>
                <p className="text-[11px] text-slate-400">Konsultanci dostępni pn.–pt. 7:00–18:00</p>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Rzecznik Praw Pacjenta: 800 190 590</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dolna belka */}
      <div className="bg-slate-950 py-4 px-4 sm:px-8 text-xs text-slate-500 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p>
            &copy; 2026 Zakład Ubezpieczeń Społecznych &bull; Projekt Przewodnik Rodzica
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-slate-400">
            <span>Dyrektywa Work-Life Balance</span>
            <span>&bull;</span>
            <span>Kodeks pracy 2026</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-300">
              Dla polskich rodzin z <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
            <span>&bull;</span>
            <Link
              href="/panel-pracownika"
              className="text-slate-600 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
              title="ZSI ZUS: Dostęp wewnętrzny dla pracowników i płatników"
            >
              <Lock className="w-3 h-3" />
              <span>Intranet ZUS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};