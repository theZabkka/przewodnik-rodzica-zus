"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, HeartHandshake } from "lucide-react";
import { useParentProfile } from "@/context/ParentProfileContext";

export default function HomePage() {
  const { openGlossary } = useParentProfile();

  const situations = [
    {
      href: "/przewodnik",
      title: "Planuję dziecko",
      image: "/images/card-planning.jpg",
      alt: "Para planująca założenie rodziny",
    },
    {
      href: "/kalkulator",
      title: "Oczekuję dziecka",
      image: "/images/card-expecting.jpg",
      alt: "Przyszła mama oczekująca dziecka",
    },
    {
      href: "/e-uslugi",
      title: "Dziecko już się urodziło",
      image: "/images/card-born.jpg",
      alt: "Dłoń noworodka trzymająca palec rodzica",
    },
    {
      href: "/trudne-sytuacje",
      title: "Przyjmuję dziecko pod opiekę",
      image: "/images/card-care.jpg",
      alt: "Opiekun z dzieckiem idący w stronę domu",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-10 w-full">
      {/* Hero Banner — czysty tytuł, jeden przycisk CTA i ilustracja */}
      <section className="bg-[#DCE8D3] rounded-2xl px-6 sm:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10371E] tracking-tight leading-[1.12]">
              Zasiłkowy Przewodnik Rodzica
            </h1>

            <div>
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

      {/* 4 kafle wyboru sytuacji — bez zbędnego podtytułu */}
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
              <div className="p-4 text-center flex-1 flex items-center justify-center">
                <span className="text-base font-extrabold text-[#10371E] group-hover:text-[#007834] transition-colors">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Wyraźny, spokojny baner dla trudnych zdarzeń (strata, wcześniak, choroba) */}
      <section className="bg-[#FBF0EC] border border-[#E5C8BD] rounded-2xl px-6 sm:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
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
      </section>

      {/* Dyskretny link do słownika trudnych pojęć */}
      <div className="text-center pb-2">
        <button
          type="button"
          onClick={() => openGlossary()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#10371E] hover:text-[#007834] underline underline-offset-4 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Trudne słowa — wyjaśniamy prosto</span>
        </button>
      </div>
    </div>
  );
}
