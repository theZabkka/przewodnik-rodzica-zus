"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Calculator,
  ArrowRight,
  HeartHandshake,
  Bot,
  FileText,
  Phone,
  Clock,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 py-8 px-4 sm:px-8 max-w-5xl mx-auto w-full">
      {/* Proste, czytelne powitanie bez urzędowego żargonu */}
      <section className="bg-white border border-[#dee2e6] border-l-4 border-l-[#007834] rounded-xl p-6 sm:p-10 shadow-xs space-y-4">
        <span className="zus-badge">ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH &bull; POMOC DLA RODZICÓW</span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#00416E] tracking-tight leading-snug">
          Zasiłek macierzyński — prosto i krok po kroku
        </h1>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
          Nie musisz znać skomplikowanych przepisów. Wybierz poniżej, w czym chcesz dziś skorzystać z pomocy, a poprowadzimy Cię za rękę po jednym prostym pytaniu naraz.
        </p>
      </section>

      {/* 3 Wielkie, wyraźne kroki — serce strony dla osób niezaawansowanych */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#00416E]">
          Co chcesz teraz zrobić? Wybierz jedną z opcji:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Opcja 1: Policz zasiłek */}
          <div className="zus-card zus-card-accent p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#007834] text-white font-extrabold text-base">
                  1
                </span>
                <Calculator className="w-6 h-6 text-[#007834]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                Policz, ile dostaniesz pieniędzy
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Odpowiedz na kilka prostych pytań, a pokażemy dokładną kwotę wypłaty na rękę co miesiąc.
              </p>
            </div>

            <Link
              href="/kalkulator"
              className="w-full inline-flex items-center justify-between bg-[#007834] hover:bg-[#00622a] text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-lg transition-colors shadow-2xs"
            >
              <span>Policz zasiłek</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Opcja 2: Wypełnij wniosek */}
          <div className="zus-card zus-card-accent p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#00416E] text-white font-extrabold text-base">
                  2
                </span>
                <FileText className="w-6 h-6 text-[#00416E]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                Wypełnij wniosek do ZUS
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Wypełnij wniosek ZAM krok po kroku. Na końcu dostaniesz gotową kartkę A4 do wydruku lub wysłania.
              </p>
            </div>

            <Link
              href="/e-uslugi"
              className="w-full inline-flex items-center justify-between bg-[#00416E] hover:bg-[#003457] text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-lg transition-colors shadow-2xs"
            >
              <span>Wypełnij wniosek</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Opcja 3: Prosty przewodnik */}
          <div className="zus-card zus-card-accent p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 text-white font-extrabold text-base">
                  3
                </span>
                <Compass className="w-6 h-6 text-[#007834]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                Sprawdź, co Ci się należy
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Prosta lista terminów i spraw do załatwienia przed porodem oraz zaraz po narodzinach dziecka.
              </p>
            </div>

            <Link
              href="/przewodnik"
              className="w-full inline-flex items-center justify-between bg-slate-100 hover:bg-[#007834] text-slate-900 hover:text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-lg border border-slate-300 hover:border-[#007834] transition-colors"
            >
              <span>Zobacz przewodnik</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2 najprostsze rzeczy, o których warto pamiętać */}
      <section className="bg-[#f0f8f3] border border-[#c2e4cc] rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#00416E]">
          2 najważniejsze rzeczy, o których warto pamiętać:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-[#c2e4cc] flex items-start gap-3.5">
            <Clock className="w-6 h-6 text-[#007834] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Masz 21 dni od porodu na wniosek
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Jeśli złożysz wniosek w ciągu 21 dni, będziesz dostawać równą wypłatę (81,5%) przez cały rok opieki.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#c2e4cc] flex items-start gap-3.5">
            <Users className="w-6 h-6 text-[#00416E] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Tata ma swoje dodatkowe 9 tygodni
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Te 9 tygodni nie zabiera urlopu mamy. Dodatkowo tata ma 14 dni płatnego urlopu ojcowskiego.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prosta sekcja pomocy: zapytaj, trudna sytuacja lub zadzwoń */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/asystent-ai"
          className="zus-card p-6 flex items-center justify-between gap-4 hover:border-[#007834] group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f0f8f3] border border-[#c2e4cc] flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-[#007834]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#007834] transition-colors">
                Masz pytanie? Zapytaj prosto
              </h3>
              <p className="text-sm text-slate-600">
                Napisz własnymi słowami — nasz pomocnik wytłumaczy wszystko bez trudnych pojęć.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#007834] shrink-0" />
        </Link>

        <Link
          href="/trudne-sytuacje"
          className="zus-card p-6 flex items-center justify-between gap-4 hover:border-[#007834] group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-[#b45309]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#007834] transition-colors">
                Wcześniak lub trudna sytuacja?
              </h3>
              <p className="text-sm text-slate-600">
                Dodatkowy urlop przy pobycie w szpitalu, ustawa „Za życiem” oraz spokojne wsparcie.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#007834] shrink-0" />
        </Link>
      </section>

      {/* Duży, czytelny pasek pomocy telefonicznej dla osób wolących rozmowę */}
      <section className="bg-white border-2 border-[#007834] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-[#007834] text-white flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Wolisz porozmawiać przez telefon?
            </h2>
            <p className="text-sm text-slate-600">
              Konsultanci ZUS pomagają od poniedziałku do piątku w godzinach 7:00–18:00.
            </p>
          </div>
        </div>

        <a
          href="tel:225601600"
          className="inline-flex items-center gap-2 bg-[#007834] hover:bg-[#00622a] text-white font-extrabold text-base px-6 py-3.5 rounded-lg transition-colors shrink-0 shadow-2xs"
        >
          <Phone className="w-5 h-5" />
          <span>Zadzwoń: 22 560 16 00</span>
        </a>
      </section>
    </div>
  );
}
