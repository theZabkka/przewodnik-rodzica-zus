"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Calculator,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Baby,
  HeartHandshake,
  Bot,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      {/* Sekcja Powitalna - Ciepła, uspokajająca i przestrzenna */}
      <section className="bg-gradient-to-b from-white to-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-14 shadow-xs text-center sm:text-left relative overflow-hidden">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00823C] border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#00823C]" />
            <span>Oficjalny serwis Zakładu Ubezpieczeń Społecznych</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Wszystko o prawach i zasiłkach dla Twojej rodziny — prosto i spokojnie
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
            Spodziewasz się dziecka lub właśnie zostałeś rodzicem? Pomożemy Ci zrozumieć przysługujące świadczenia, dokładnie policzyć kwoty i dopilnować ważnych terminów.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3 justify-center sm:justify-start">
            <Link
              href="/kalkulator"
              className="inline-flex items-center gap-2 bg-[#00823C] hover:bg-[#006e33] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl transition-all shadow-sm focus:outline-none"
            >
              <Calculator className="w-5 h-5" />
              <span>Oblicz wysokość zasiłku</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/przewodnik"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl border border-slate-300 transition-all shadow-2xs focus:outline-none"
            >
              <Compass className="w-5 h-5 text-[#00823C]" />
              <span>Zobacz plan krok po kroku</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trzy Główne Pytania Rodzica (Core UI - Zero Szumu) */}
      <section className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Wybierz to, czego teraz najbardziej potrzebujesz
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Kliknij jedną z trzech głównych ścieżek, aby przejść od razu do odpowiedzi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pytanie 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#00823C] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00823C] flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#00823C] uppercase tracking-wider">
                  Krok 1 &bull; Uprawnienia
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 leading-snug group-hover:text-[#00823C] transition-colors">
                  Planuję dziecko lub jestem w ciąży — co mi przysługuje?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Dowiedz się, jak działa zwolnienie lekarskie w ciąży (100% płatne z kodem B), kiedy rozpocząć urlop macierzyński oraz jak chronione jest Twoje zatrudnienie.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zwolnienia w ciąży do 270 dni</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ochrona przed wypowiedzeniem</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <Link
                href="/przewodnik"
                className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-[#00823C] text-slate-800 hover:text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
              >
                <span>Sprawdź uprawnienia</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pytanie 2 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#00823C] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005A9C] flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">
                  Krok 2 &bull; Finanse
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 leading-snug group-hover:text-[#005A9C] transition-colors">
                  Ile pieniędzy dostanę podczas urlopu?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Skorzystaj z prostego kalkulatora: wpisz swoje wynagrodzenie i zobacz porównanie równej stawki 81,5% przez cały rok z wariantem 100% i 70%.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#005A9C] shrink-0" />
                  <span>Wariant 81,5% vs 100/70%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#005A9C] shrink-0" />
                  <span>Łączenie urlopu z pracą na 1/2 etatu</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <Link
                href="/kalkulator"
                className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-[#005A9C] text-slate-800 hover:text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
              >
                <span>Przejdź do kalkulatora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pytanie 3 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-amber-600 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Krok 3 &bull; Terminy
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 leading-snug group-hover:text-amber-700 transition-colors">
                  Jakie terminy muszę dopilnować, aby nie stracić zasiłku?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  Najważniejszy jest termin 21 dni po porodzie na wniosek ZAM. Sprawdź także 14 dni urlopu ojcowskiego i formalności w USC oraz u pracodawcy.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Kluczowy termin 21 dni po porodzie</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Checklista formalności z odliczaniem</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4">
              <Link
                href="/przewodnik"
                className="w-full inline-flex items-center justify-between bg-slate-50 hover:bg-amber-600 text-slate-800 hover:text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
              >
                <span>Sprawdź kalendarz terminów</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trzy Ważne Zasady, Które Warto Znać */}
      <section className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trzy zasady, o których pamięta niewielu rodziców
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Nowe przepisy dają rodzicom większą elastyczność i dodatkowe uprawnienia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#00823C] font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>9 tygodni tylko dla drugiego rodzica</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tata ma wyłączne prawo do 9 tygodni rodzicielskiego (płatne 70%). Te tygodnie nie pomniejszają urlopu mamy!
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Baby className="w-4 h-4" />
              <span>Wcześniaki: do 15 tyg. w 100%</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jeśli dziecko urodziło się przed 37. tygodniem lub było w szpitalu, przysługuje dodatkowy pełnopłatny urlop macierzyński.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#005A9C] font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Praca na pół etatu i wydłużenie</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Możesz wrócić do pracy na część etatu u swojego pracodawcy — urlop się wydłuży, a kwota zasiłku nie przepada!
            </p>
          </div>
        </div>
      </section>

      {/* Sprawy Szczególne i Pomoc AI */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Wsparcie w sytuacjach szczególnych i trudnych
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Informacje i formalności krok po kroku w razie poronienia lub martwego urodzenia (8 tygodni urlopu w 100%, zasiłek pogrzebowy 7000 zł) oraz uprawnienia z ustawy „Za życiem”.
            </p>
          </div>
          <Link
            href="/trudne-sytuacje"
            className="inline-flex items-center gap-2 text-rose-700 font-bold text-xs sm:text-sm hover:underline"
          >
            <span>Przejdź do wsparcia</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Masz nietypową sytuację? Zapytaj asystenta
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nasz doradca sztucznej inteligencji wyjaśnia przepisy prostym, ludzkim językiem bez prawniczego żargonu. Możesz zapytać o umowy, terminy i sytuacje szczególne.
            </p>
          </div>
          <Link
            href="/asystent-ai"
            className="inline-flex items-center gap-2 text-[#00823C] font-bold text-xs sm:text-sm hover:underline"
          >
            <span>Zadaj pytanie asystentowi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
