"use client";

import React, { useState, useMemo } from "react";
import {
 X,
 BookOpen,
 Search,
 ChevronDown,
 Sparkles,
 HelpCircle,
 Lightbulb,
 Scale,
 CheckCircle2,
} from "lucide-react";
import { ZUS_GLOSSARY_TERMS } from "@hacknation/shared";
import { useParentProfile } from "@/context/ParentProfileContext";

export function TrudneSlowaModal() {
 const { isGlossaryOpen, closeGlossary, activeGlossaryTermId } = useParentProfile();
 const [searchQuery, setSearchQuery] = useState("");
 const [activeCategory, setActiveCategory] = useState<string>("all");
 const [expandedId, setExpandedId] = useState<string | null>(activeGlossaryTermId || "podstawa-wymiaru");

 React.useEffect(() => {
 if (activeGlossaryTermId) {
 setExpandedId(activeGlossaryTermId);
    }
  }, [activeGlossaryTermId]);

 const filteredTerms = useMemo(() => {
 return ZUS_GLOSSARY_TERMS.filter((item) => {
 const matchesCategory =
 activeCategory === "all" || item.category === activeCategory;
 const q = searchQuery.toLowerCase().trim();
 const matchesSearch =
        !q ||
 item.term.toLowerCase().includes(q) ||
 item.plainTitle.toLowerCase().includes(q) ||
 item.shortExplanation.toLowerCase().includes(q) ||
 item.tags.some((t) => t.toLowerCase().includes(q));
 return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

 if (!isGlossaryOpen) return null;

 return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded max-w-3xl w-full shadow-2xl border border-[#dce1e5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Górny pasek modala */}
        <div className="bg-[#00416E] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Prostej Polszczyzny ZUS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>Słowniczek Trudnych Słów ZUS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
 Urzędowe pojęcia przetłumaczone na prosty, ludzki język. Sprawdź, co dokładnie oznacza każde wyrażenie!
            </p>
          </div>

          <button
 type="button"
 onClick={closeGlossary}
 className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors shrink-0"
 aria-label="Zamknij słowniczek"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wyszukiwarka i filtry kategorii */}
        <div className="p-4 sm:p-6 bg-[#f4f6f7] border-b border-[#dce1e5] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
 type="text"
 placeholder="Szukaj pojęcia (np. 81,5%, L4 w ciąży, podstawa, 9 tygodni taty)..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007834] "
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
 type="button"
 onClick={() => setActiveCategory("all")}
 className={`px-3 py-1.5 rounded font-bold transition-all ${
 activeCategory === "all"
                  ? "bg-[#007834] text-white "
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-[#dce1e5]"
              }`}
            >
 Wszystkie ({ZUS_GLOSSARY_TERMS.length})
            </button>
            <button
 type="button"
 onClick={() => setActiveCategory("finanse")}
 className={`px-3 py-1.5 rounded font-bold transition-all ${
 activeCategory === "finanse"
                  ? "bg-[#007834] text-white "
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-[#dce1e5]"
              }`}
            >
              💰 Pieniądze & Zasiłki
            </button>
            <button
 type="button"
 onClick={() => setActiveCategory("urlopy")}
 className={`px-3 py-1.5 rounded font-bold transition-all ${
 activeCategory === "urlopy"
                  ? "bg-[#007834] text-white "
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-[#dce1e5]"
              }`}
            >
              🗓️ Urlopy & Tygodnie
            </button>
            <button
 type="button"
 onClick={() => setActiveCategory("formalnosci")}
 className={`px-3 py-1.5 rounded font-bold transition-all ${
 activeCategory === "formalnosci"
                  ? "bg-[#007834] text-white "
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-[#dce1e5]"
              }`}
            >
              📑 Wnioski & Druki
            </button>
            <button
 type="button"
 onClick={() => setActiveCategory("szczegolne")}
 className={`px-3 py-1.5 rounded font-bold transition-all ${
 activeCategory === "szczegolne"
                  ? "bg-[#007834] text-white "
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-[#dce1e5]"
              }`}
            >
              ⚠️ Sytuacje szczególne
            </button>
          </div>
        </div>

        {/* Lista rozwinięć (Akordeon) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Nie znaleziono takiego hasła</p>
              <p className="text-xs text-slate-500">
 Spróbuj wpisać inne słowo kluczowe lub zapytać naszego Asystenta AI.
              </p>
            </div>
          ) : (
 filteredTerms.map((item) => {
 const isExpanded = expandedId === item.id;
 return (
                <div
 key={item.id}
 className={`rounded border transition-all pt-3 ${
 isExpanded
                      ? "bg-emerald-50/40 border-[#007834]/40 "
                      : "bg-white border-[#dce1e5] hover:border-slate-300"
                  }`}
                >
                  <button
 type="button"
 onClick={() => setExpandedId(isExpanded ? null : item.id)}
 className="w-full px-4 pb-3 flex items-start justify-between gap-3 text-left focus:outline-none"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.term}
                        </span>
                        {item.legalCitation && (
                          <span className="text-[10px] text-slate-400 font-serif">
                            ({item.legalCitation})
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.plainTitle}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.shortExplanation}
                      </p>
                    </div>

                    <div
 className={`p-1.5 rounded text-slate-500 transition-transform ${
 isExpanded ? "rotate-180 text-[#007834] bg-emerald-100" : "bg-slate-100"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Rozwinięcie ze szczegółowym przykładem */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-[#dce1e5]/60 mt-1 animate-in fade-in">
                      <div className="p-3 bg-white rounded border border-emerald-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Szczegóły i przykład z życia:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {item.detailedExplanation}
                        </p>
                      </div>

                      {item.legalCitation && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Scale className="w-3.5 h-3.5 text-slate-400" />
                          <span>Podstawa prawna: {item.legalCitation}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold mr-1">Słowa powiązane:</span>
                        {item.tags.map((tag) => (
                          <span
 key={tag}
 className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Dolna belka modala */}
        <div className="p-4 bg-[#f4f6f7] border-t border-[#dce1e5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#007834]" />
            <span>Zgodne z Ustawą Zasiłkową i Kodeksem Pracy 2026</span>
          </div>
          <button
 type="button"
 onClick={closeGlossary}
 className="px-5 py-2 bg-[#007834] hover:bg-[#00622a] text-white font-bold rounded transition-colors "
          >
 Rozumiem, zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
