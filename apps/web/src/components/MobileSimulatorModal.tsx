"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Compass,
  Calculator,
  Calendar,
  FileText,
  Clock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface MobileSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSimulatorModal: React.FC<MobileSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [mobileTab, setMobileTab] = useState<"home" | "calc" | "timeline" | "mobywatel">("home");
  const [quickSalary, setQuickSalary] = useState<number>(7500);

  if (!isOpen) return null;

  const netBase = Math.round(quickSalary * (1 - 0.1371));
  const monthly815 = Math.round(netBase * 0.815);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        {/* Przycisk zamknięcia na zewnątrz telefonu */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-12 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          aria-label="Zamknij symulator"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Etykieta dla jurorów */}
        <div className="mb-3 text-center">
          <span className="inline-flex items-center gap-2 bg-[#00823C] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Aplikacja mobilna &bull; Podgląd dla rodziców i jurorów</span>
          </span>
        </div>

        {/* Obudowa iPhone / Smartfon */}
        <div className="w-[360px] h-[720px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-3"></div>
            <div className="w-2 h-2 rounded-full bg-[#00823C]/60"></div>
          </div>

          {/* Ekran smartfona */}
          <div className="w-full h-full bg-[#F8FAFC] rounded-[40px] flex flex-col overflow-hidden text-slate-900">
            {/* Pasek statusu telefonu */}
            <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-600 bg-white border-b border-slate-100">
              <span>9:41</span>
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Nagłówek w aplikacji */}
            <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#00823C] text-white font-black text-xs flex items-center justify-center">
                  ZUS
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-none">Przewodnik Rodzica</h3>
                  <span className="text-[10px] text-slate-500">Mój asystent</span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            {/* Treść ekranu wg aktywnego taba */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mobileTab === "home" && (
                <div className="space-y-3">
                  {/* Alert 21 dni */}
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Kluczowy termin 21 dni</span>
                      </span>
                      <span className="text-[10px] bg-rose-200/60 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                        Pilne
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Wniosek o stawkę 81,5%
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Złóż wniosek ZAM w 21 dni od narodzin dziecka, aby mieć równy zasiłek przez cały rok.
                    </p>
                  </div>

                  {/* Karta szybkich pytań */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Trzy kroki dla Ciebie:
                    </span>

                    <button
                      type="button"
                      onClick={() => setMobileTab("timeline")}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-[#00823C]" />
                        <span className="text-xs font-bold text-slate-800">1. Co mi przysługuje?</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileTab("calc")}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calculator className="w-4 h-4 text-[#00823C]" />
                        <span className="text-xs font-bold text-slate-800">2. Ile pieniędzy dostanę?</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileTab("timeline")}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#00823C]" />
                        <span className="text-xs font-bold text-slate-800">3. Jakie mam terminy?</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                  {/* Karta 9 tygodni dla taty */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-950 block">9 tygodni tylko dla taty</span>
                      <p className="text-[11px] text-emerald-800">
                        Niezbywalne prawo w stawce 70%. Nie przepada i nie pomniejsza urlopu mamy!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {mobileTab === "calc" && (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Szybki kalkulator zasiłku</h4>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Pensja brutto:</span>
                        <strong className="text-[#00823C]">{quickSalary.toLocaleString("pl-PL")} zł</strong>
                      </div>
                      <input
                        type="range"
                        min="4806"
                        max="15000"
                        step="100"
                        value={quickSalary}
                        onChange={(e) => setQuickSalary(Number(e.target.value))}
                        className="w-full accent-[#00823C]"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Miesięcznie (81,5%):</span>
                        <span className="text-base font-extrabold text-[#00823C]">{monthly815} zł</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <span>Rocznie łącznie:</span>
                        <strong className="text-slate-800">{monthly815 * 12} zł</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mobileTab === "timeline" && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900">Terminy i etapy:</div>
                  {[
                    { title: "Zwolnienie w ciąży (kod B)", sub: "100% płatne do 270 dni", tag: "Ciąża" },
                    { title: "Wniosek ZAM na 81,5%", sub: "W 21 dni po porodzie", tag: "Pilne" },
                    { title: "Urlop macierzyński", sub: "20 tygodni od narodzin", tag: "Mama" },
                    { title: "9 tygodni dla taty", sub: "70% podstawy wymiaru", tag: "Tata" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-400">{item.tag}</span>
                        <span className="text-emerald-700 font-bold">&bull; Zgodność 2026</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <p className="text-[11px] text-slate-500">{item.sub}</p>
                    </div>
                  ))}
                </div>
              )}

              {mobileTab === "mobywatel" && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-4 rounded-2xl shadow-sm space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>mObywatel 2.0</span>
                      <span>Rzeczpospolita Polska</span>
                    </div>
                    <div className="pt-2">
                      <div className="text-xs font-bold">Katarzyna Kowalska</div>
                      <div className="text-[10px] opacity-80">PESEL: 94051208912</div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">eZUS / PUE:</span>
                    <div className="font-bold text-slate-900">Ubezpieczenie chorobowe aktywne</div>
                    <p className="text-[11px] text-emerald-600 font-semibold">Stan składek: 0,00 zł długu</p>
                  </div>
                </div>
              )}
            </div>

            {/* Dolny pasek nawigacji telefonu */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around">
              <button
                type="button"
                onClick={() => setMobileTab("home")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "home" ? "text-[#00823C]" : "text-slate-400"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Pulpit</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab("calc")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "calc" ? "text-[#00823C]" : "text-slate-400"
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Kalkulator</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab("timeline")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "timeline" ? "text-[#00823C]" : "text-slate-400"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Terminarz</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab("mobywatel")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "mobywatel" ? "text-[#00823C]" : "text-slate-400"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>mObywatel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
