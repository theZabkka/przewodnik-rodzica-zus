import React from "react";

interface ZusLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const ZusLogo: React.FC<ZusLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
}) => {
  const boxDimensions =
    size === "sm" ? "w-9 h-9 text-base" : size === "lg" ? "w-14 h-14 text-2xl" : "w-11 h-11 text-xl";

  const textSize = size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Charakterystyczny zielony kafelek ZUS */}
      <div
        className={`${boxDimensions} rounded-lg bg-[#00823C] text-white font-black flex items-center justify-center tracking-tighter shadow-sm shrink-0 border border-[#006e33]`}
        style={{ letterSpacing: "-0.05em" }}
      >
        ZUS
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-black text-slate-900 tracking-wider uppercase leading-tight ${textSize}`}
            style={{ letterSpacing: "0.06em" }}
          >
            Zakład Ubezpieczeń
          </span>
          <span
            className={`font-black text-slate-900 tracking-wider uppercase leading-tight ${textSize}`}
            style={{ letterSpacing: "0.06em" }}
          >
            Społecznych
          </span>
        </div>
      )}
    </div>
  );
};

export const PolishEmblem: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Godło Rzeczypospolitej Polskiej"
    >
      <circle cx="50" cy="50" r="48" fill="#DC143C" />
      <path
        d="M50 16L53 27H64L55 34L58 45L50 38L42 45L45 34L36 27H47L50 16Z"
        fill="#FFD700"
      />
      <path
        d="M50 28C43 32 32 38 28 50C24 62 28 72 35 77C40 80 46 76 50 72C54 76 60 80 65 77C72 72 76 62 72 50C68 38 57 32 50 28Z"
        fill="#FFFFFF"
      />
      <path
        d="M34 50C25 44 20 32 24 24C30 22 38 30 42 38M66 50C75 44 80 32 76 24C70 22 62 30 58 38"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="50" cy="22" r="3" fill="#FFD700" />
    </svg>
  );
};
