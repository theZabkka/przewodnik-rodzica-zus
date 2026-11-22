"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Clock,
  Users,
  Baby,
  Calculator,
  FileText,
  Bot,
  Mail,
  Video,
  ExternalLink,
} from "lucide-react";
import { useParentProfile } from "@/context/ParentProfileContext";

export default function HomePage() {
  const { openGlossary } = useParentProfile();

  const situations = [
    {
      href: "/przewodnik",
      title: "Planuję dziecko",
      subtitle: "Zasady ubezpieczenia i zwolnień",
      image: "/images/card-planning.jpg",
      alt: "Para planująca założenie rodziny",
    },
    {
      href: "/kalkulator",
      title: "Oczekuję dziecka",
      subtitle: "Wyliczenie wysokości zasiłku",
      image: "/images/card-expecting.jpg",
      alt: "Przyszła mama oczekująca dziecka",
    },
    {
      href: "/e-uslugi",
      title: "Dziecko już się urodziło",
      subtitle: "Wniosek ZAM i termin 21 dni",
      image: "/images/card-born.jpg",
      alt: "Dłoń noworodka trzymająca palec rodzica",
    },
    {
      href: "/trudne-sytuacje",
      title: "Przyjmuję dziecko pod opiekę",
      subtitle: "Adopcja i rodzina zastępcza",
      image: "/images/card-care.jpg",
      alt: "Opiekun z dzieckiem idący w stronę domu",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-12 w-full">
      {/* 1. Hero Banner — konkretny tytuł, jeden przycisk CTA i przyjazna ilustracja */}
      <section className="bg-[#DCE8D3] rounded-2xl px-6 sm:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10371E] tracking-tight leading-[1.12]">
              Zasiłkowy Przewodnik Rodzica
            </h1>

            <div className="pt-1">
              <Link
                href="/kalkulator"
                className="inline-flex items-center gap-2.5 bg-[#10371E] hover:bg-[#007834] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-colors focus:outline-none"
              >
                <span>Oblicz wysokość zasiłku</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <Image
              src="/images/family-hero.png"
              alt="Rodzice na spacerze z wózkiem dziecięcym"
              width={640}
              height={480}
              priority
              className="w-full max-w-[340px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* 2. Cztery kafle wyboru sytuacji */}
      <section className="space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10371E] tracking-tight">
          Jaka jest Twoja sytuacja?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {situations.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white border-[1.5px] border-[#C6D6C3] hover:border-[#10371E] rounded-2xl overflow-hidden flex flex-col transition-colors group"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#EFF3EA]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={480}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center flex-1 flex flex-col items-center justify-center gap-1">
                <span className="text-base font-extrabold text-[#10371E] group-hover:text-[#007834] transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-[#425B4A]">{item.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Wyraźny, spokojny baner dla trudnych zdarzeń + dyskretny link do słownika */}
      <section className="space-y-4">
        <div className="bg-[#FBF0EC] border border-[#E5C8BD] rounded-2xl px-6 sm:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-11 h-11 rounded-full bg-[#F2DCD4] text-[#8C3B2B] flex items-center justify-center shrink-0 mt-0.5">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#5E281C]">
                Potrzebujesz wsparcia?
              </h2>
              <p className="text-sm text-[#6E3D31] leading-relaxed">
                Strata dziecka, wcześniak w szpitalu albo ciężka diagnoza — tutaj znajdziesz spokojną listę świadczeń i pomocy, bez szukania po ustawach.
              </p>
            </div>
          </div>

          <Link
            href="/trudne-sytuacje"
            className="inline-flex items-center gap-2 bg-[#A64833] hover:bg-[#8C3B2B] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shrink-0"
          >
            <span>Znajdź pomoc</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => openGlossary()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#10371E] hover:text-[#007834] underline underline-offset-4 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Trudne słowa — wyjaśniamy prosto</span>
          </button>
        </div>
      </section>

      {/* 4. Trzy najważniejsze zasady 2026 — krótko, konkretnie, bez ściany tekstu */}
      <section className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#10371E] tracking-tight">
          Trzy zasady, które warto znać od razu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#10371E]">
              <Clock className="w-4 h-4 text-[#007834]" />
              <span>21 dni od porodu na wniosek</span>
            </div>
            <p className="text-sm text-[#425B4A] leading-relaxed">
              Złożenie wniosku ZAM w ciągu 21 dni daje równą wypłatę <strong>81,5%</strong> przez cały rok. Późniejszy wniosek to 100% na macierzyńskim i 70% na rodzicielskim.
            </p>
          </div>

          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#10371E]">
              <Users className="w-4 h-4 text-[#007834]" />
              <span>9 tygodni wyłącznie dla taty</span>
            </div>
            <p className="text-sm text-[#425B4A] leading-relaxed">
              Drugi rodzic ma własne 9 tygodni urlopu rodzicielskiego płatne zawsze <strong>70%</strong>. Ta część nie zabiera urlopu mamy, a dodatkowo przysługuje 14 dni urlopu ojcowskiego (100%).
            </p>
          </div>

          <div className="bg-white border border-[#C6D6C3] rounded-2xl p-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#10371E]">
              <Baby className="w-4 h-4 text-[#007834]" />
              <span>Wcześniaki i praca na pół etatu</span>
            </div>
            <p className="text-sm text-[#425B4A] leading-relaxed">
              Przy pobycie noworodka w szpitalu przysługuje do <strong>15 dodatkowych tygodni</strong> płatnych 100%. Urlop rodzicielski można też łączyć z pracą na maksymalnie 1/2 etatu.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Co możesz załatwić w serwisie — 3 konkretne narzędzia */}
      <section className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#10371E] tracking-tight">
          Załatw sprawę krok po kroku
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/kalkulator"
            className="bg-white border border-[#C6D6C3] hover:border-[#10371E] rounded-2xl p-6 flex flex-col justify-between gap-5 transition-colors group"
          >
            <div className="space-y-2">
              <Calculator className="w-5 h-5 text-[#007834]" />
              <h3 className="text-base font-extrabold text-[#10371E]">
                Kalkulator zasiłku
              </h3>
              <p className="text-sm text-[#425B4A] leading-relaxed">
                Porównaj wariant 81,5% ze stawką 100/70% dla umowy o pracę, zlecenia lub działalności (JDG).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#007834] group-hover:underline">
              <span>Policz kwotę</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/e-uslugi"
            className="bg-white border border-[#C6D6C3] hover:border-[#10371E] rounded-2xl p-6 flex flex-col justify-between gap-5 transition-colors group"
          >
            <div className="space-y-2">
              <FileText className="w-5 h-5 text-[#007834]" />
              <h3 className="text-base font-extrabold text-[#10371E]">
                Wniosek ZAM, eZUS & USC
              </h3>
              <p className="text-sm text-[#425B4A] leading-relaxed">
                Wypełnij wniosek ZAM, pobierz elektroniczny odpis aktu urodzenia z USC i zweryfikuj stan składek w PUE/eZUS.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#007834] group-hover:underline">
              <span>Wypełnij wniosek & USC</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/asystent-ai"
            className="bg-white border border-[#C6D6C3] hover:border-[#10371E] rounded-2xl p-6 flex flex-col justify-between gap-5 transition-colors group"
          >
            <div className="space-y-2">
              <Bot className="w-5 h-5 text-[#007834]" />
              <h3 className="text-base font-extrabold text-[#10371E]">
                Zapytaj o swoją sytuację
              </h3>
              <p className="text-sm text-[#425B4A] leading-relaxed">
                Masz nietypową umowę, dług w JDG albo pytanie o zwolnienie L4 w ciąży? Opisz sprawę własnymi słowami.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#007834] group-hover:underline">
              <span>Zadaj pytanie</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* 6. Kompaktowy pasek bezpośredniego kontaktu i poradnika PDF */}
      <section className="bg-[#EFF3EA] border border-[#C6D6C3] rounded-2xl px-6 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-extrabold text-[#10371E]">
            Oficjalne kanały ZUS dla rodziców
          </h3>
          <p className="text-xs sm:text-sm text-[#425B4A]">
            Bezpośredni kontakt z doradcami oraz oficjalny poradnik ZUS (stan prawny: kwiecień 2026).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="mailto:mama@zus.pl"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#DCE8D3] text-[#10371E] border border-[#B9CCB6] rounded-xl text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#007834]" />
            <span>mama@zus.pl</span>
          </a>

          <a
            href="https://www.zus.pl/e-wizyta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#DCE8D3] text-[#10371E] border border-[#B9CCB6] rounded-xl text-xs font-bold transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-[#007834]" />
            <span>e-wizyta online</span>
          </a>

          <a
            href="https://www.zus.pl/documents/10182/167567/1184_26+Poradnik+dla+rodzic%C3%B3w.pdf/9378de60-151e-9b9f-ba65-abdf41d9f5b4?t=1777453101936"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#10371E] hover:bg-[#007834] text-white rounded-xl text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Poradnik ZUS 2026 (PDF)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
