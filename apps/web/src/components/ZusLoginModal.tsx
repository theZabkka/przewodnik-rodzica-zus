"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
} from "lucide-react";
import { ZusLogo } from "./ZusLogo";

export interface LoggedInCitizen {
  name: string;
  pesel: string;
  method: "mobywatel" | "profil_zaufany" | "pue_login";
}

interface ZusLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: LoggedInCitizen) => void;
}

type LoginStep = "select" | "mobywatel_qr" | "profil_zaufany" | "pue_login" | "verifying";

function MobywatelQrSvg() {
  const size = 21;
  const cells: boolean[][] = [];
  const seed = "LOGIN-GOV-PL-MOBYWATEL-ZUS-2026";
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c)) {
        const lr = r >= size - 7 ? r - (size - 7) : r;
        const lc = c >= size - 7 ? c - (size - 7) : c;
        const on =
          lr === 0 ||
          lr === 6 ||
          lc === 0 ||
          lc === 6 ||
          (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
        row.push(on);
      } else {
        const bit = ((hash >>> ((r * 11 + c * 7) % 24)) ^ (r * 19 + c * 29)) & 1;
        row.push(bit === 1);
      }
    }
    cells.push(row);
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-40 h-40 border-2 border-[#10371E] bg-white p-2 rounded-xl"
      aria-label="Kod QR do zeskanowania w aplikacji mObywatel"
    >
      {cells.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#10371E" /> : null
        )
      )}
    </svg>
  );
}

export const ZusLoginModal: React.FC<ZusLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<LoginStep>("select");
  const [qrSecondsLeft, setQrSecondsLeft] = useState<number>(120);
  const [pueId, setPueId] = useState<string>("92041203456");
  const [puePassword, setPuePassword] = useState<string>("••••••••••••");
  const [pzLogin, setPzLogin] = useState<string>("anna.kowalska");
  const [pzSmsCode, setPzSmsCode] = useState<string>("482915");

  useEffect(() => {
    if (!isOpen) {
      setStep("select");
      setQrSecondsLeft(120);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== "mobywatel_qr") return;
    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => (prev > 1 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen) return null;

  const completeLogin = (method: LoggedInCitizen["method"]) => {
    setStep("verifying");
    setTimeout(() => {
      onLoginSuccess({
        name: "Anna Kowalska",
        pesel: "92041203456",
        method,
      });
      onClose();
    }, 700);
  };

  const formattedQrTime = `${Math.floor(qrSecondsLeft / 60)}:${String(qrSecondsLeft % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FAF8F2] border border-[#B9CCB6] rounded-2xl overflow-hidden shadow-2xl">
        {/* Górny pasek okna logowania PUE/eZUS */}
        <div className="bg-white border-b border-[#DCE8D3] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ZusLogo size="sm" showText={false} />
            <div>
              <h2 className="text-sm font-extrabold text-[#10371E] leading-tight">
                Logowanie do PUE / eZUS
              </h2>
              <span className="text-[11px] text-[#425B4A]">
                Węzeł Krajowy (login.gov.pl)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#425B4A] hover:text-[#10371E] hover:bg-[#EFF3EA] transition-colors"
            aria-label="Zamknij okno logowania"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Treść kroków logowania */}
        <div className="p-5 sm:p-6">
          {step === "select" && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#425B4A]">
                Wybierz sposób logowania, aby automatycznie pobrać swoje dane do wniosku ZAM i sprawdzić status składek:
              </p>

              <div className="space-y-2.5">
                {/* 1. mObywatel 2.0 (kod QR) */}
                <button
                  type="button"
                  onClick={() => setStep("mobywatel_qr")}
                  className="w-full p-4 bg-white hover:bg-[#EFF3EA] border-[1.5px] border-[#B9CCB6] hover:border-[#10371E] rounded-xl flex items-center justify-between gap-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#C8102E] text-white font-black text-sm flex items-center justify-center shrink-0">
                      mO
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#10371E]">
                        Aplikacja mObywatel
                      </div>
                      <div className="text-xs text-[#425B4A]">
                        Najszybsze logowanie kodem QR w telefonie
                      </div>
                    </div>
                  </div>
                  <Smartphone className="w-4 h-4 text-[#007834] shrink-0" />
                </button>

                {/* 2. Profil Zaufany (login.gov.pl) */}
                <button
                  type="button"
                  onClick={() => setStep("profil_zaufany")}
                  className="w-full p-4 bg-white hover:bg-[#EFF3EA] border-[1.5px] border-[#B9CCB6] hover:border-[#10371E] rounded-xl flex items-center justify-between gap-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#DCE8D3] text-[#10371E] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#10371E]">
                        Profil Zaufany (login.gov.pl)
                      </div>
                      <div className="text-xs text-[#425B4A]">
                        Login lub bankowość elektroniczna + kod SMS
                      </div>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-[#007834] shrink-0" />
                </button>

                {/* 3. Login i hasło PUE/eZUS */}
                <button
                  type="button"
                  onClick={() => setStep("pue_login")}
                  className="w-full p-4 bg-white hover:bg-[#EFF3EA] border-[1.5px] border-[#B9CCB6] hover:border-[#10371E] rounded-xl flex items-center justify-between gap-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#007834] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      eZUS
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#10371E]">
                        Login i hasło PUE / eZUS
                      </div>
                      <div className="text-xs text-[#425B4A]">
                        Klasyczne konto w portalu Zakładu Ubezpieczeń Społecznych
                      </div>
                    </div>
                  </div>
                  <KeyRound className="w-4 h-4 text-[#007834] shrink-0" />
                </button>
              </div>
            </div>
          )}

          {step === "mobywatel_qr" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#425B4A] hover:text-[#10371E]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Inny sposób logowania</span>
              </button>

              <div className="bg-white border border-[#C6D6C3] rounded-xl p-5 flex flex-col items-center text-center space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C8102E]">
                  <span className="px-1.5 py-0.5 rounded bg-[#C8102E] text-white text-[10px]">
                    mO
                  </span>
                  <span>Zeskanuj kod QR w aplikacji mObywatel</span>
                </div>

                <MobywatelQrSvg />

                <div className="inline-flex items-center gap-1.5 text-xs text-[#425B4A] font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#007834]" />
                  <span>Kod ważny jeszcze: {formattedQrTime}</span>
                </div>

                <ol className="text-left text-xs text-[#425B4A] space-y-1 list-decimal list-inside pt-1">
                  <li>Otwórz aplikację <strong>mObywatel 2.0</strong> na telefonie.</li>
                  <li>Wybierz <strong>Kod QR</strong> i zeskanuj powyższy kod.</li>
                  <li>Potwierdź logowanie do serwisu ZUS.</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={() => completeLogin("mobywatel")}
                className="w-full py-3 bg-[#10371E] hover:bg-[#007834] text-white font-bold text-sm rounded-xl transition-colors"
              >
                Potwierdź logowanie w mObywatel (symulacja)
              </button>
            </div>
          )}

          {step === "profil_zaufany" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                completeLogin("profil_zaufany");
              }}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#425B4A] hover:text-[#10371E]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Inny sposób logowania</span>
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#10371E] mb-1">
                    Nazwa użytkownika lub e-mail (Profil Zaufany):
                  </label>
                  <input
                    type="text"
                    value={pzLogin}
                    onChange={(e) => setPzLogin(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#B9CCB6] rounded-lg text-sm font-semibold text-[#10371E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10371E] mb-1">
                    Jednorazowy kod autoryzacyjny SMS:
                  </label>
                  <input
                    type="text"
                    value={pzSmsCode}
                    onChange={(e) => setPzSmsCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#B9CCB6] rounded-lg text-sm font-mono font-bold tracking-widest text-[#10371E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
                  />
                  <span className="text-[11px] text-[#425B4A] mt-1 block">
                    Kod demo wysłany na numer *** *** 567
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#10371E] hover:bg-[#007834] text-white font-bold text-sm rounded-xl transition-colors"
              >
                Zaloguj przez Profil Zaufany
              </button>
            </form>
          )}

          {step === "pue_login" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                completeLogin("pue_login");
              }}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#425B4A] hover:text-[#10371E]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Inny sposób logowania</span>
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#10371E] mb-1">
                    Login PUE / eZUS (lub numer PESEL):
                  </label>
                  <input
                    type="text"
                    value={pueId}
                    onChange={(e) => setPueId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#B9CCB6] rounded-lg text-sm font-mono font-semibold text-[#10371E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10371E] mb-1">
                    Hasło:
                  </label>
                  <input
                    type="password"
                    value={puePassword}
                    onChange={(e) => setPuePassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#B9CCB6] rounded-lg text-sm font-semibold text-[#10371E] focus:outline-none focus:ring-2 focus:ring-[#007834]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#007834] hover:bg-[#10371E] text-white font-bold text-sm rounded-xl transition-colors"
              >
                Zaloguj do konta PUE / eZUS
              </button>
            </form>
          )}

          {step === "verifying" && (
            <div className="py-10 flex flex-col items-center text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#007834]" />
              <div className="text-base font-extrabold text-[#10371E]">
                Weryfikacja tożsamości w Węźle Krajowym...
              </div>
              <p className="text-xs text-[#425B4A]">
                Pobieranie danych ubezpieczonego z rejestru KSI ZUS.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
