"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
 Sprout,
 Heart,
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
        <span className="text-[#1D4029] font-semibold">
 Zasiłkowy Przewodnik Przyszłego i Obecnego Rodzica
        </span>
      </nav>

      {/* Ciepły szałwiowy Hero Banner inspirowany projektem Przewodnika Rodzica */}
      <section className="bg-[#DCE8D3] rounded-2xl px-6 sm:px-10 py-7 sm:py-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10371E] tracking-tight leading-[1.12]">
 Zasiłkowy Przewodnik Przyszłego Rodzica
            </h1>

            <p className="text-base sm:text-lg text-[#1D4029] leading-relaxed max-w-2xl">
 Sprawdź, jakie pieniądze możesz dostać, gdy opiekujesz się dzieckiem. Oblicz zasiłek krok po kroku i wygeneruj gotowy wniosek ZAM do ZUS.
            </p>

            {/* Główne przyciski akcji */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
 href="/kalkulator"
 className="inline-flex items-center gap-2 bg-[#10371E] hover:bg-[#007834] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors focus:outline-none"
              >
                <Calculator className="w-4 h-4" />
                <span>Oblicz wysokość zasiłku</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
 href="/e-uslugi"
 className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F2] text-[#10371E] font-bold text-sm px-5 py-3 rounded-xl border-[1.5px] border-[#10371E] transition-colors focus:outline-none"
              >
                <FileText className="w-4 h-4" />
                <span>Wniosek ZAM i eZUS</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <Image
 src="/images/family-hero.png"
 alt="Uśmiechnięci rodzice na spacerze z wózkiem dziecięcym w parku"
 width={640}
 height={480}
 priority
 className="w-full max-w-[360px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Sekcja wyboru sytuacji: "Jaka jest Twoja sytuacja?" */}
      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10371E] tracking-tight">
 Jaka jest Twoja sytuacja?
          </h2>
          <p className="text-sm sm:text-base text-[#425B4A]">
 Wybierz jedną odpowiedź, a przejdziesz prosto do właściwych informacji.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
 href="/przewodnik"
 className="bg-white border-[1.5px] border-[#9BB39A] hover:border-[#10371E] rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all group"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#DCE8D3] flex items-center justify-center ">
              <Sprout className="w-11 h-11 text-[#10371E]" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#10371E]">
 Planuję dziecko
            </span>
          </Link>

          <Link
 href="/kalkulator"
 className="bg-white border-[1.5px] border-[#9BB39A] hover:border-[#10371E] rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all group"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#F6E9C8] flex items-center justify-center ">
              <Heart className="w-11 h-11 text-[#8A4B16]" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#10371E]">
 Oczekuję dziecka
            </span>
          </Link>

          <Link
 href="/e-uslugi"
 className="bg-white border-[1.5px] border-[#9BB39A] hover:border-[#10371E] rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all group"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#F5DFD7] flex items-center justify-center ">
              <Baby className="w-11 h-11 text-[#8C3B2B]" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#10371E]">
 Dziecko już się urodziło
            </span>
          </Link>

          <Link
 href="/trudne-sytuacje"
 className="bg-white border-[1.5px] border-[#9BB39A] hover:border-[#10371E] rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all group"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#D8EAF7] flex items-center justify-center ">
              <ShieldCheck className="w-11 h-11 text-[#10371E]" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#10371E]">
 Przyjmuję dziecko pod opiekę
            </span>
          </Link>
        </div>

        {/* 2 wyróżnione przyciski pomocnicze pod kafelkami (jak na wzorze) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <button
 type="button"
 onClick={() => openGlossary()}
 className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[1.5px] border-[#10371E] font-bold text-sm sm:text-base px-7 py-3 rounded-xl transition-colors min-w-[220px]"
          >
            <BookOpen className="w-5 h-5" />
            <span>Trudne słowa</span>
          </button>

          <Link
 href="/trudne-sytuacje"
 className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#DCE8D3] text-[#10371E] border-[1.5px] border-[#10371E] font-bold text-sm sm:text-base px-7 py-3 rounded-xl transition-colors min-w-[220px]"
          >
            <HeartHandshake className="w-5 h-5" />
            <span>Potrzebuję wsparcia</span>
          </Link>
        </div>
      </section>

      {/* Interaktywny Kreator: Szybki Start Rodzica */}
      <section className="bg-white border border-[#C6D6C3] rounded p-6 sm:p-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE8D3] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#DCE8D3] text-[#007834] rounded">
              <Baby className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#10371E]">
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
 className="text-xs text-[#10371E] hover:underline font-bold flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Wyjaśnij trudne pojęcia ZUS</span>
          </button>
        </div>

        <ParentWizard />
      </section>

      {/* Ważny Komunikat Urzędowy ZUS (stonowany styl zus.pl) */}
      <section className="bg-white border border-[#C6D6C3] border-l-4 border-l-[#007834] rounded p-5">
        <div className="flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-[#007834] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm text-[#333333]">
            <p className="font-bold text-[#222222] uppercase tracking-wider text-xs">
 Ważne terminy i zasady wypłaty zasiłków w 2026 r.:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#2E4B38]">
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#10371E] tracking-tight">
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

              <h3 className="text-lg font-bold text-[#10371E] leading-snug">
 Co mi przysługuje w ciąży i po porodzie?
              </h3>

              <p className="text-xs sm:text-sm text-[#425B4A] leading-relaxed">
 Zasady zwolnienia lekarskiego w ciąży (100% płatne z kodem B do 270 dni), ochrona stosunku pracy, urlop macierzyński i ojcowski.
              </p>

              <ul className="space-y-2 text-xs text-[#2E4B38] pt-2 border-t border-slate-100">
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
 className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-[#007834] text-[#1D4029] hover:text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded border border-slate-200 hover:border-[#007834] transition-all"
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

              <h3 className="text-lg font-bold text-[#10371E] leading-snug">
 Kalkulator wysokości zasiłku macierzyńskiego
              </h3>

              <p className="text-xs sm:text-sm text-[#425B4A] leading-relaxed">
 Wpisz swoje wynagrodzenie brutto i sprawdź porównanie finansowe: uśredniona stawka 81,5% vs wariant 100% i 70%.
              </p>

              <ul className="space-y-2 text-xs text-[#2E4B38] pt-2 border-t border-slate-100">
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
                <FileText className="w-5 h-5 text-[#10371E]" />
              </div>

              <h3 className="text-lg font-bold text-[#10371E] leading-snug">
 Wniosek ZAM i elektroniczne usługi eZUS
              </h3>

              <p className="text-xs sm:text-sm text-[#425B4A] leading-relaxed">
 Wygeneruj gotowy wniosek ZAM o zasiłek macierzyński i rodzicielski. Instrukcja krok po kroku składania dokumentu w portalu PUE/eZUS.
              </p>

              <ul className="space-y-2 text-xs text-[#2E4B38] pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10371E] shrink-0" />
                  <span>Generator formularza ZAM z walidacją</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10371E] shrink-0" />
                  <span>Kroki logowania przez Profil Zaufany</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10371E] shrink-0" />
                  <span>Weryfikacja załączników i skróconego aktu urodzenia</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
 href="/e-uslugi"
 className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-[#10371E] text-[#1D4029] hover:text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded border border-slate-200 hover:border-[#10371E] transition-all"
              >
                <span>Wypełnij wniosek ZAM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trzy Ważne Zasady ZUS (Styl Kafelków Informacyjnych) */}
      <section className="bg-white border border-[#C6D6C3] rounded-lg p-6 sm:p-8">
        <div className="max-w-3xl mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#10371E] tracking-tight">
 Kluczowe uprawnienia rodzicielskie wynikające z przepisów
          </h2>
          <p className="text-xs sm:text-sm text-[#425B4A] mt-1">
 Standardy Kodeksu Pracy i ustawy zasiłkowej gwarantujące stabilność i bezpieczeństwo rodziny.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#FAF8F2] p-4.5 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#007834] font-bold text-xs uppercase tracking-wide">
              <Users className="w-4 h-4" />
              <span>9 tygodni tylko dla taty</span>
            </div>
            <p className="text-xs text-[#2E4B38] leading-relaxed">
 Urlop rodzicielski w wymiarze 9 tygodni przysługuje drugiemu z rodziców i nie może zostać przeniesiony. Zasiłek wynosi 70% podstawy.
            </p>
          </div>

          <div className="bg-[#FAF8F2] p-4.5 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#b45309] font-bold text-xs uppercase tracking-wide">
              <Baby className="w-4 h-4" />
              <span>Dodatkowy urlop dla wcześniaków</span>
            </div>
            <p className="text-xs text-[#2E4B38] leading-relaxed">
 Rodzice dzieci urodzonych przed 37. tygodniem lub hospitalizowanych mogą otrzymać do 15 dodatkowych tygodni płatnych w 100%.
            </p>
          </div>

          <div className="bg-[#FAF8F2] p-4.5 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#10371E] font-bold text-xs uppercase tracking-wide">
              <Clock className="w-4 h-4" />
              <span>Łączenie urlopu z pracą (1/2 etatu)</span>
            </div>
            <p className="text-xs text-[#2E4B38] leading-relaxed">
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
            <h3 className="text-base sm:text-lg font-bold text-[#10371E]">
 Poronienie, martwe urodzenie i ustawa „Za życiem”
            </h3>
            <p className="text-xs sm:text-sm text-[#425B4A] leading-relaxed">
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
            <h3 className="text-base sm:text-lg font-bold text-[#10371E]">
 Masz nietypową sytuację? Zapytaj asystenta
            </h3>
            <p className="text-xs sm:text-sm text-[#425B4A] leading-relaxed">
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
      <section className="bg-white border border-[#C6D6C3] rounded-lg p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#007834] uppercase tracking-wider">
 Oficjalne źródła i kontakt ZUS dla rodziców (stan prawny: kwiecień 2026)
          </div>
          <p className="text-xs sm:text-sm text-[#425B4A]">
 Zasiłek macierzyński możesz rozpocząć już do <strong>6 tygodni przed porodem</strong> (wniosek min. 14 dni wcześniej). W razie wątpliwości skontaktuj się bezpośrednio z ekspertami ZUS:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
 href="mailto:mama@zus.pl"
 className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EFF3EA] hover:bg-[#e2f2e6] text-[#007834] border border-[#B9CCB6] rounded text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>mama@zus.pl</span>
          </a>

          <a
 href="https://www.zus.pl/e-wizyta"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EFF3EA] hover:bg-[#e1eef7] text-[#10371E] border border-[#B9CCB6] rounded text-xs font-bold transition-colors"
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
