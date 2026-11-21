"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Home,
  Compass,
  Calculator,
  FileText,
  Bot,
  HeartHandshake,
  RotateCw,
} from "lucide-react";

interface MobileSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MobileRoute =
  | "/"
  | "/przewodnik"
  | "/kalkulator"
  | "/e-uslugi"
  | "/asystent-ai"
  | "/trudne-sytuacje";

export const MobileSimulatorModal: React.FC<MobileSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeRoute, setActiveRoute] = useState<MobileRoute>("/");
  const [frameKey, setFrameKey] = useState<number>(0);

  if (!isOpen) return null;

  const navigateTo = (route: MobileRoute) => {
    setActiveRoute(route);
    setFrameKey((prev) => prev + 1);
  };

  const bottomTabs: { route: MobileRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { route: "/", label: "Start", icon: Home },
    { route: "/przewodnik", label: "Przewodnik", icon: Compass },
    { route: "/kalkulator", label: "Kalkulator", icon: Calculator },
    { route: "/e-uslugi", label: "Wniosek", icon: FileText },
    { route: "/asystent-ai", label: "Pomoc AI", icon: Bot },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        {/* Przycisk zamknięcia na zewnątrz telefonu */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-11 right-0 sm:-right-12 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          aria-label="Zamknij podgląd mobilny"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Etykieta nad smartfonem */}
        <div className="mb-2.5 text-center flex items-center gap-2">
          <span className="inline-flex items-center gap-2 bg-[#007834] text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Aplikacja mobilna ZUS &bull; Pełna funkcjonalność obywatelska</span>
          </span>
        </div>

        {/* Obudowa smartfona (390px x 780px max-h-[86vh]) */}
        <div className="w-[375px] sm:w-[390px] h-[84vh] max-h-[780px] min-h-[600px] bg-slate-950 rounded-[46px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-slate-900 mr-3"></div>
            <div className="w-2 h-2 rounded-full bg-[#007834]/70"></div>
          </div>

          {/* Ekran smartfona */}
          <div className="w-full h-full bg-[#f8f9fa] rounded-[38px] flex flex-col overflow-hidden text-slate-900">
            {/* Pasek statusu telefonu */}
            <div className="pt-3 px-6 pb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-600 bg-white border-b border-slate-100 shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Pasek szybkiego dostępu w telefonie */}
            <div className="bg-[#007834] text-white px-3.5 py-2 flex items-center justify-between text-[11px] shrink-0">
              <div className="flex items-center gap-2 font-bold">
                <span className="bg-white text-[#007834] px-1.5 py-0.5 rounded font-black text-[10px]">
                  ZUS
                </span>
                <span>Przewodnik Rodzica</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => navigateTo("/trudne-sytuacje")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    activeRoute === "/trudne-sytuacje"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-[#00622a] hover:bg-[#005223] text-emerald-50"
                  }`}
                  title="Wsparcie w trudnych sytuacjach"
                >
                  <HeartHandshake className="w-3 h-3" />
                  <span>Trudne</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFrameKey((prev) => prev + 1)}
                  className="p-1 rounded bg-[#00622a] hover:bg-[#005223] text-emerald-100 transition-colors"
                  title="Odśwież ekran telefonu"
                  aria-label="Odśwież ekran telefonu"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Żywa, pełna aplikacja webowa w widoku mobilnym (bez panelu pracownika) */}
            <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden">
              <iframe
                key={`${activeRoute}-${frameKey}`}
                src={activeRoute}
                title="Podgląd mobilny aplikacji Przewodnik Rodzica ZUS"
                className="w-full h-full border-0 bg-[#f8f9fa]"
              />
            </div>

            {/* Dolny pasek natywnej nawigacji smartfona */}
            <div className="bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shrink-0">
              {bottomTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeRoute === tab.route;
                return (
                  <button
                    key={tab.route}
                    type="button"
                    onClick={() => navigateTo(tab.route)}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      isActive
                        ? "text-[#007834] bg-[#f0f8f3]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
