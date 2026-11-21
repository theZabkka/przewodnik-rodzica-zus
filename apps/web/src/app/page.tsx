"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Calculator,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Baby,
  HeartHandshake,
  Bot,
  ShieldCheck,
  FileText,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Mail,
  Video,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { ParentWizard } from "@/components/ParentWizard";
import { useParentProfile } from "@/context/ParentProfileContext";

export default function HomePage() {
  const { openGlossary } = useParentProfile();
  return (
    <div className="flex flex-col gap-10 py-6 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Pasek Okruszków (Breadcrumbs) charakterystyczny dla portalu zus.pl */}
      <nav className="zus-breadcrumbs" aria-label="Ścieżka nawigacyjna">
        <Link href="/">Strona główna</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/przewodnik">Świadczenia</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">
          Zasiłkowy Przewodnik Przyszłego i Obecnego Rodzica
        </span>
      </nav>

      {/* Oficjalny Hero Banner w czystym, płaskim stylu zus.pl */}
      <section className="bg-[#f4f6f7] border border-[#dce1e5] rounded p-6 sm:p-10">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="zus-badge">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#007834]" />
              ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH
            </span>
            <span className="text-xs font-semibold text-[#59636e]">Stan prawny: 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#222222] tracking-tight leading-snug">
            Zasiłkowy Przewodnik Rodzica
          </h1>

          <p className="text-base text-[#333333] leading-relaxed">
            Spodziewasz się dziecka lub niedawno zostałeś rodzicem? W jednym miejscu sprawdzisz przysługujące Ci uprawnienia, obliczysz wysokość zasiłku macierzyńskiego oraz wygenerujesz wniosek ZAM do złożenia przez portal <strong>PUE/eZUS</strong>.
          </p>

          {/* Przyciski akcji w płaskim stylu zus.pl */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/kalkulator"
              className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#005f29] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors focus:outline-none"
            >
              <Calculator className="w-4 h-4" />
              <span>Oblicz wysokość zasiłku</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/e-uslugi"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#eef6f1] text-[#007834] font-semibold text-sm px-4 py-2.5 rounded border border-[#007834] transition-colors focus:outline-none"
            >
              <FileText className="w-4 h-4" />
              <span>Wniosek ZAM i eZUS</span>
            </Link>

            <Link
              href="/przewodnik"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f4f6f7] text-[#222222] hover:text-[#007834] font-semibold text-sm px-4 py-2.5 rounded border border-[#dce1e5] hover:border-[#007834] transition-colors focus:outline-none"
            >
              <Compass className="w-4 h-4 text-[#007834]" />
              <span>Przewodnik krok po kroku</span>
            </Link>

            <button
              type="button"
              onClick={() => openGlossary()}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f4f6f7] text-[#222222] hover:text-[#007834] font-semibold text-sm px-4 py-2.5 rounded border border-[#dce1e5] hover:border-[#007834] transition-colors focus:outline-none"
            >
              <BookOpen className="w-4 h-4 text-[#007834]" />
              <span>Trudne słowa</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interaktywny Kreator: Szybki Start Rodzica */}
      <section className="bg-white border border-[#dce1e5] rounded p-6 sm:p-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf0f2] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#eef6f1] text-[#007834] rounded">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Szybki Start Rodzica: Sprawdź swój zasiłek w 60 sekund
              </h2>
              <p className="text-xs text-slate-500">
                Wypełnij 3 proste pytania. Te dane automatycznie zasilą kalkulator, wniosek ZAM i asystenta AI!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openGlossary()}
            className="text-xs text-[#00416E] hover:underline font-bold flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Wyjaśnij trudne pojęcia ZUS</span>
          </button>
        </div>

        <ParentWizard />
      </section>

      {/* Ważny Komunikat Urzędowy ZUS (stonowany styl zus.pl) */}
      <section className="bg-white border border-[#dce1e5] border-l-4 border-l-[#007834] rounded p-5">
        <div className="flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-[#007834] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm text-[#333333]">
            <p className="font-bold text-[#222222] uppercase tracking-wider text-xs">
              Ważne terminy i zasady wypłaty zasiłków w 2026 r.:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>Termin 21 dni po porodzie:</strong> Złożenie wniosku (druk ZAM) w terminie do 21 dni po porodzie gwarantuje uśrednioną stawkę <strong>81,5%</strong> za cały okres urlopu macierzyńskiego i rodzicielskiego.
              </li>
              <li>
                <strong>9 tygodni dla drugiego rodzica:</strong> Zgodnie z dyrektywą Work-Life Balance ojciec ma wyłączne prawo do 9 tygodni rodzicielskiego (płatne 70%), które nie przepadają i nie pomniejszają urlopu matki.
              </li>
              <li>
                <strong>Wcześniaki i pobyt w szpitalu:</strong> Wprowadzono do 15 dodatkowych tygodni zasiłku w 100% dla rodziców hospitalizowanych noworodków (art. 180² KP). Wniosek składa się min. 21 dni przed końcem podstawowego macierzyńskiego.
              </li>
              <li>
                <strong>JDG i umowa zlecenie (pułapka ZUS ZUA):</strong> Z chwilą rozpoczęcia zasiłku macierzyńskiego ZUS automatycznie wyrejestrowuje z dobrowolnego chorobowego — po zakończeniu zasiłku należy ponownie złożyć druk <strong>ZUS ZUA</strong>.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Główne Moduły Portalu - Karty Katalogu Usług w Stylu ZUS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#00416E] tracking-tight">
            Katalog spraw i modułów przewodnika
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Wybierz sprawę, aby przejść do szczegółowych informacji
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Karta 1: Uprawnienia */}
          <div className="zus-card zus-card-accent p-6 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="zus-badge">KROK 1 &bull; UPRAWNIENIA</span>
                <Compass className="w-5 h-5 text-[#007834]" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Co mi przysługuje w ciąży i po porodzie?
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zasady zwolnienia lekarskiego w ciąży (100% płatne z kodem B do 270 dni), ochrona stosunku pracy, urlop macierzyński i ojcowski.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>Zasiłek chorobowy w ciąży 100%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>20 tygodni urlopu macierzyńskiego</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>14 dni urlopu ojcowskiego (100%)</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/przewodnik"
                className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-[#007834] text-slate-800 hover:text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded border border-slate-200 hover:border-[#007834] transition-all"
              >
                <span>Sprawdź uprawnienia</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Karta 2: Kalkulator */}
          <div className="zus-card zus-card-accent p-6 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="zus-badge">KROK 2 &bull; KALKULATOR</span>
                <Calculator className="w-5 h-5 text-[#007834]" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Kalkulator wysokości zasiłku macierzyńskiego
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Wpisz swoje wynagrodzenie brutto i sprawdź porównanie finansowe: uśredniona stawka 81,5% vs wariant 100% i 70%.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>Porównanie netto i brutto obu wariantów</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>Łączenie zasiłku z pracą na 1/2 etatu</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007834] shrink-0" />
                  <span>Dla umowy o pracę, zlecenia i JDG</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/kalkulator"
                className="w-full inline-flex items-center justify-between bg-[#007834] hover:bg-[#00622a] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded transition-all shadow-2xs"
              >
                <span>Otwórz kalkulator świadczeń</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Karta 3: Formalności i Wniosek ZAM */}
          <div className="zus-card zus-card-accent p-6 flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="zus-badge-navy">KROK 3 &bull; FORMALNOŚCI</span>
                <FileText className="w-5 h-5 text-[#00416E]" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                Wniosek ZAM i elektroniczne usługi eZUS
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Wygeneruj gotowy wniosek ZAM o zasiłek macierzyński i rodzicielski. Instrukcja krok po kroku składania dokumentu w portalu PUE/eZUS.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00416E] shrink-0" />
                  <span>Generator formularza ZAM z walidacją</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00416E] shrink-0" />
                  <span>Kroki logowania przez Profil Zaufany</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00416E] shrink-0" />
                  <span>Weryfikacja załączników i skróconego aktu urodzenia</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/e-uslugi"
                className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-[#00416E] text-slate-800 hover:text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded border border-slate-200 hover:border-[#00416E] transition-all"
              >
                <span>Wypełnij wniosek ZAM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trzy Ważne Zasady ZUS (Styl Kafelków Informacyjnych) */}
      <section className="bg-white border border-[#dee2e6] rounded-lg p-6 sm:p-8">
        <div className="max-w-3xl mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#00416E] tracking-tight">
            Kluczowe uprawnienia rodzicielskie wynikające z przepisów
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Standardy Kodeksu Pracy i ustawy zasiłkowej gwarantujące stabilność i bezpieczeństwo rodziny.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#f8f9fa] p-4.5 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#007834] font-bold text-xs uppercase tracking-wide">
              <Users className="w-4 h-4" />
              <span>9 tygodni tylko dla taty</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Urlop rodzicielski w wymiarze 9 tygodni przysługuje drugiemu z rodziców i nie może zostać przeniesiony. Zasiłek wynosi 70% podstawy.
            </p>
          </div>

          <div className="bg-[#f8f9fa] p-4.5 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#b45309] font-bold text-xs uppercase tracking-wide">
              <Baby className="w-4 h-4" />
              <span>Dodatkowy urlop dla wcześniaków</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Rodzice dzieci urodzonych przed 37. tygodniem lub hospitalizowanych mogą otrzymać do 15 dodatkowych tygodni płatnych w 100%.
            </p>
          </div>

          <div className="bg-[#f8f9fa] p-4.5 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#00416E] font-bold text-xs uppercase tracking-wide">
              <Clock className="w-4 h-4" />
              <span>Łączenie urlopu z pracą (1/2 etatu)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Praca u obecnego pracodawcy na część etatu wydłuża okres pobierania urlopu rodzicielskiego proporcjonalnie aż do 82 tygodni.
            </p>
          </div>
        </div>
      </section>

      {/* Pomoc AI oraz Sytuacje Szczególne */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="zus-card p-6 flex flex-col justify-between border-l-4 border-l-[#b45309]">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#b45309] font-bold text-xs uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4" />
              <span>Wsparcie szczególne</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Poronienie, martwe urodzenie i ustawa „Za życiem”
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Prawa rodziców w trudnych sytuacjach: 8 tygodni urlopu w 100%, uprawnienia do zasiłku pogrzebowego (7000 zł) oraz jednorazowe świadczenie 4000 zł.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/trudne-sytuacje"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b45309] hover:underline"
            >
              <span>Zobacz procedury wsparcia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="zus-card p-6 flex flex-col justify-between border-l-4 border-l-[#007834]">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[#007834] font-bold text-xs uppercase tracking-wide">
              <Bot className="w-4 h-4" />
              <span>Asystent AI ZUS</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Masz nietypową sytuację? Zapytaj asystenta
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Wirtualny doradca wyjaśnia przepisy prostym, przystępnym językiem. Odpowie na pytania o umowy zlecenie, JDG, łączenie etatów czy zagraniczne ubezpieczenie.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/asystent-ai"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007834] hover:underline"
            >
              <span>Zadaj pytanie asystentowi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kompaktowy pasek oficjalnych kanałów wsparcia z Poradnika ZUS 2026 (1184/2026) */}
      <section className="bg-white border border-[#dee2e6] rounded-lg p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#007834] uppercase tracking-wider">
            Oficjalne źródła i kontakt ZUS dla rodziców (stan prawny: kwiecień 2026)
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Zasiłek macierzyński możesz rozpocząć już do <strong>6 tygodni przed porodem</strong> (wniosek min. 14 dni wcześniej). W razie wątpliwości skontaktuj się bezpośrednio z ekspertami ZUS:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="mailto:mama@zus.pl"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f0f8f3] hover:bg-[#e2f2e6] text-[#007834] border border-[#c2e4cc] rounded text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>mama@zus.pl</span>
          </a>

          <a
            href="https://www.zus.pl/e-wizyta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f0f6fa] hover:bg-[#e1eef7] text-[#00416E] border border-[#bad5e8] rounded text-xs font-bold transition-colors"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Umów e-wizytę online</span>
          </a>

          <a
            href="https://www.zus.pl/documents/10182/167567/1184_26+Poradnik+dla+rodzic%C3%B3w.pdf/9378de60-151e-9b9f-ba65-abdf41d9f5b4?t=1777453101936"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#007834] hover:bg-[#00622a] text-white rounded text-xs font-bold transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Poradnik ZUS 2026 (PDF)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
