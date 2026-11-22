"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  Printer,
  Download,
  ExternalLink,
  ArrowLeft,
  Calendar,
  User,
  Baby,
  Hash,
} from "lucide-react";
import { ZusLogo } from "@/components/ZusLogo";

function WeryfikacjaContent() {
  const searchParams = useSearchParams();

  const upo = searchParams.get("upo") || "UPO-ZUS-2026-760075";
  const name = searchParams.get("name") || "Anna Kowalska";
  const pesel = searchParams.get("pesel") || "92041203456";
  const child = searchParams.get("child") || "Jan Kowalski";
  const birthDate = searchParams.get("date") || "2026-03-15";
  const rate = searchParams.get("rate") || "81.5";
  const hash = searchParams.get("hash") || "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f4912";
  const dateStr = searchParams.get("submittedAt") || new Date().toLocaleDateString("pl-PL");

  // Zamaskowany PESEL dla ochrony danych osobowych
  const maskedPesel = pesel.length === 11 
    ? `${pesel.slice(0, 6)}*****` 
    : pesel;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadProof = () => {
    const text = `RZECZPOSPOLITA POLSKA
ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
URZĘDOWE POŚWIADCZENIE PRZEDŁOŻENIA I ODBIORU (UPO)
Identyfikator dokumentu: ${upo}
Data wygenerowania: ${new Date().toLocaleString("pl-PL")}

DANE WNIOSKODAWCY:
Imię i nazwisko: ${name}
PESEL: ${pesel}

PRZEDMIOT SPRAWY:
Wniosek o zasiłek macierzyński i rodzicielski (formularz ZUS ZAM wersja 2026.10)
Wnioskowana stawka: ${rate === "81.5" ? "81,5% (procedura Fast-Track)" : "100% / 70%"}
Dane dziecka: ${child} (data urodzenia: ${birthDate})

STATUS DOKUMENTU:
Status w rejestrze ZUS: POŚWIADCZONY / PRZYJĘTY DO PRZETWORZENIA
Kwalifikowana pieczęć cyfrowa: ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH (eIDAS)
Skrót kryptograficzny SHA-256: ${hash}

Dokument sporządzony w systemie teleinformatycznym ZUS na podstawie art. 39¹ Kodeksu postępowania administracyjnego.`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Poswiadczenie_ZUS_${upo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#10371E] py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Nawigacja powrotu */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/e-uslugi"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007834] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót do kreatora wniosku</span>
          </Link>
          <span className="text-[11px] text-[#425B4A]">System Weryfikacji eZUS</span>
        </div>

        {/* Nagłówek Urzędowy */}
        <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DCE8D3] pb-6">
            <div className="flex items-center gap-3">
              <ZusLogo size="md" />
              <div>
                <h1 className="text-lg sm:text-xl font-black text-[#10371E] tracking-tight">
                  Weryfikacja Autentyczności Wniosku
                </h1>
                <p className="text-xs text-[#425B4A]">
                  Oficjalny rejestr dokumentów Zakładu Ubezpieczeń Społecznych
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#10371E] text-white flex items-center justify-center font-bold text-xs shrink-0 self-center sm:self-auto shadow-xs">
              RP
            </div>
          </div>

          {/* Baner Statusu: POZYTYWNIE ZWERYFIKOWANY */}
          <div className="p-4 sm:p-5 bg-[#EFF3EA] border-2 border-[#007834] rounded-xl flex items-start gap-3.5">
            <CheckCircle2 className="w-7 h-7 text-[#007834] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#007834] block">
                Dokument zweryfikowany pomyślnie
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#10371E]">
                Wniosek ZUS ZAM zarejestrowany w systemie
              </h2>
              <p className="text-xs text-[#425B4A] leading-relaxed">
                Poniższy dokument został opatrzony pieczęcią elektroniczną ZUS i przekazany do rozpatrzenia przez właściwy Oddział Zakładu Ubezpieczeń Społecznych.
              </p>
            </div>
          </div>

          {/* Tabela Parametrów Wniosku */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E4B38] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#007834]" />
              <span>Parametry metrykalne dokumentu:</span>
            </h3>

            <div className="bg-[#FAF8F2] border border-[#B9CCB6] rounded-xl p-4 space-y-3 text-xs divide-y divide-[#DCE8D3]">
              <div className="flex justify-between items-center pt-0">
                <span className="text-[#425B4A] flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Numer sprawy / UPO:</span>
                </span>
                <strong className="text-[#10371E] font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-[#B9CCB6]">
                  {upo}
                </strong>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#425B4A] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Wnioskodawca:</span>
                </span>
                <strong className="text-[#10371E] font-bold text-sm">
                  {name}
                </strong>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#425B4A]">Identyfikator PESEL:</span>
                <strong className="text-[#10371E] font-mono">
                  {maskedPesel}
                </strong>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#425B4A] flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Dziecko:</span>
                </span>
                <strong className="text-[#10371E]">
                  {child} (ur. {birthDate})
                </strong>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#425B4A]">Forma wniosku:</span>
                <span className="font-semibold text-[#10371E]">
                  Zasiłek macierzyński i rodzicielski ({rate === "81.5" ? "Stawka jednolita 81,5%" : "Stawka 100% / 70%"})
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#425B4A] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Data wpłynięcia do ZUS:</span>
                </span>
                <span className="font-semibold text-[#10371E]">{dateStr}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#425B4A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Podpis kwalifikowany:</span>
                </span>
                <span className="text-[#007834] font-bold flex items-center gap-1">
                  <span>Pieczęć cyfrowa ZUS (eIDAS)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Suma Kontrolna SHA256 */}
          <div className="p-3 bg-white border border-[#DCE8D3] rounded-lg text-[11px] font-mono text-slate-500 space-y-1">
            <span className="font-bold text-[#10371E] block font-sans text-xs">
              Kryptograficzna suma kontrolna (SHA-256):
            </span>
            <div className="break-all select-all bg-[#EFF3EA] p-2 rounded text-[#1D4029]">
              {hash}
            </div>
          </div>

          {/* Przyciski Akcji: Wydruk i Pobranie */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Drukuj / Zapisz jako PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadProof}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EFF3EA] text-[#10371E] border border-[#B9CCB6] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-[#007834]" />
              <span>Pobierz poświadczenie (.txt)</span>
            </button>
          </div>

          {/* Linki Urzędowe */}
          <div className="pt-4 border-t border-[#DCE8D3] flex flex-wrap items-center justify-between gap-3 text-xs text-[#425B4A] print:hidden">
            <Link href="/" className="hover:text-[#007834] hover:underline font-semibold">
              ← Przewodnik Rodzica ZUS
            </Link>
            <a
              href="https://www.zus.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#007834] hover:underline"
            >
              <span>Portal oficjalny ZUS (zus.pl)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Informacja o Mocy Prawnej */}
        <p className="text-[11px] text-center text-[#425B4A] leading-relaxed">
          Urzędowe Poświadczenie Przedłożenia (UPP/UPO) wygenerowane zgodnie z art. 39¹ Kodeksu postępowania administracyjnego.
          Weryfikator stanowi element Zasiłkowego Przewodnika Rodzica w ramach HackNation 2026.
        </p>
      </div>
    </div>
  );
}

export default function WeryfikacjaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center text-sm font-bold text-[#10371E]">
          Weryfikacja dokumentu w toku...
        </div>
      }
    >
      <WeryfikacjaContent />
    </Suspense>
  );
}
