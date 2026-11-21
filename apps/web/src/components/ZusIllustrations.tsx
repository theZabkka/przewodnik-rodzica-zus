import React from "react";

interface IllustrationProps {
  className?: string;
}

/**
 * Prosta, płaska ilustracja wektorowa: rodzina z wózkiem i tarczą ZUS (Hero na stronie głównej)
 */
export const FamilyHeroIllustration: React.FC<IllustrationProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 320 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Miękkie tło geometryczne w kolorach ZUS */}
    <rect x="16" y="20" width="288" height="180" rx="8" fill="#ffffff" stroke="#dce1e5" strokeWidth="1.5" />
    <circle cx="248" cy="74" r="38" fill="#eef6f1" />
    <circle cx="82" cy="146" r="28" fill="#f0f4f8" />

    {/* Linia horyzontu / ścieżki spacerowej */}
    <line x1="36" y1="172" x2="284" y2="172" stroke="#dce1e5" strokeWidth="2" strokeLinecap="round" />

    {/* Stylizowane drzewko w parku */}
    <rect x="261" y="142" width="5" height="30" rx="2" fill="#8b959e" />
    <circle cx="263.5" cy="128" r="18" fill="#c2e4cc" />
    <circle cx="255" cy="134" r="11" fill="#007834" fillOpacity="0.22" />

    {/* Sylwetka rodzica 1 (Mama) */}
    <circle cx="96" cy="78" r="13" fill="#00416E" />
    <path
      d="M78 134C78 110 84 96 96 96C108 96 114 110 114 134V172H78V134Z"
      fill="#00416E"
    />
    {/* Ramię trzymające rączkę wózka */}
    <path
      d="M110 108L142 122"
      stroke="#00416E"
      strokeWidth="7"
      strokeLinecap="round"
    />

    {/* Sylwetka rodzica 2 (Tata) */}
    <circle cx="64" cy="70" r="13" fill="#007834" />
    <path
      d="M47 128C47 104 52 89 64 89C76 89 81 104 81 128V172H47V128Z"
      fill="#007834"
    />

    {/* Wózek dziecięcy */}
    <path
      d="M138 122H150L158 148H210C214 148 218 144 218 140V124H152"
      stroke="#222222"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#ffffff"
    />
    {/* Budka wózka */}
    <path
      d="M184 124C184 104 198 92 216 92C217 106 218 116 218 124H184Z"
      fill="#007834"
    />
    {/* Koła wózka */}
    <circle cx="166" cy="161" r="10" fill="#ffffff" stroke="#222222" strokeWidth="3" />
    <circle cx="166" cy="161" r="3" fill="#007834" />
    <circle cx="206" cy="161" r="10" fill="#ffffff" stroke="#222222" strokeWidth="3" />
    <circle cx="206" cy="161" r="3" fill="#007834" />

    {/* Mała zielona tarcza bezpieczeństwa ZUS (symbol opieki) */}
    <g transform="translate(226, 44)">
      <path
        d="M22 2L40 9V22C40 34 32 42 22 46C12 42 4 34 4 22V9L22 2Z"
        fill="#007834"
      />
      <path
        d="M15 24L20 29L30 18"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Delikatne serduszko nad wózkiem */}
    <path
      d="M170 76C170 72 166 69 162 72C158 69 154 72 154 76C154 81 162 86 162 86C162 86 170 81 170 76Z"
      fill="#f39200"
    />
  </svg>
);

/**
 * Prosta ilustracja wektorowa: kalkulator + kalendarz 21 dni (dla strony /kalkulator)
 */
export const CalculatorIllustration: React.FC<IllustrationProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 180 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="10" width="164" height="100" rx="6" fill="#f4f6f7" stroke="#dce1e5" strokeWidth="1.5" />

    {/* Kalkulator */}
    <rect x="24" y="22" width="58" height="76" rx="4" fill="#ffffff" stroke="#00416E" strokeWidth="2" />
    <rect x="31" y="30" width="44" height="14" rx="2" fill="#eef6f1" stroke="#c2e4cc" strokeWidth="1" />
    <text x="53" y="40" textAnchor="middle" fill="#007834" fontSize="9" fontWeight="700" fontFamily="monospace">
      81,5%
    </text>
    {/* Klawisze */}
    <rect x="31" y="51" width="11" height="9" rx="1.5" fill="#dce1e5" />
    <rect x="47" y="51" width="11" height="9" rx="1.5" fill="#dce1e5" />
    <rect x="63" y="51" width="11" height="9" rx="1.5" fill="#dce1e5" />
    <rect x="31" y="65" width="11" height="9" rx="1.5" fill="#dce1e5" />
    <rect x="47" y="65" width="11" height="9" rx="1.5" fill="#dce1e5" />
    <rect x="63" y="65" width="11" height="23" rx="1.5" fill="#007834" />
    <rect x="31" y="79" width="27" height="9" rx="1.5" fill="#dce1e5" />

    {/* Kartka kalendarza 21 dni */}
    <rect x="98" y="26" width="58" height="62" rx="4" fill="#ffffff" stroke="#dce1e5" strokeWidth="2" />
    <rect x="98" y="26" width="58" height="16" rx="3" fill="#007834" />
    <text x="127" y="37" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" fontFamily="sans-serif">
      TERMIN
    </text>
    <text x="127" y="64" textAnchor="middle" fill="#00416E" fontSize="20" fontWeight="800" fontFamily="sans-serif">
      21
    </text>
    <text x="127" y="78" textAnchor="middle" fill="#59636e" fontSize="8" fontWeight="600" fontFamily="sans-serif">
      DNI OD PORODU
    </text>
  </svg>
);

/**
 * Prosta ilustracja wektorowa: formularz ZAM A4 z pieczęcią UPO (dla strony /e-uslugi)
 */
export const DocumentZamIllustration: React.FC<IllustrationProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 180 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="10" width="164" height="100" rx="6" fill="#f4f6f7" stroke="#dce1e5" strokeWidth="1.5" />

    {/* Kartka A4 */}
    <rect x="44" y="18" width="76" height="86" rx="3" fill="#ffffff" stroke="#00416E" strokeWidth="2" />
    <rect x="52" y="26" width="26" height="6" rx="1" fill="#007834" />
    <rect x="84" y="26" width="28" height="6" rx="1" fill="#dce1e5" />

    {/* Wiersze formularza */}
    <rect x="52" y="40" width="60" height="4" rx="1" fill="#dce1e5" />
    <rect x="52" y="49" width="48" height="4" rx="1" fill="#dce1e5" />
    <rect x="52" y="58" width="54" height="4" rx="1" fill="#dce1e5" />
    <rect x="52" y="70" width="60" height="10" rx="1.5" fill="#eef6f1" stroke="#c2e4cc" strokeWidth="1" />
    <rect x="52" y="88" width="26" height="3" rx="1" fill="#94a3b8" />

    {/* Zielona pieczęć zatwierdzenia */}
    <circle cx="122" cy="78" r="19" fill="#007834" />
    <path
      d="M114 78L120 84L131 72"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Prosta, spokojna ilustracja wektorowa: wsparcie w trudnych sytuacjach (dla strony /trudne-sytuacje)
 */
export const SupportHeartIllustration: React.FC<IllustrationProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 180 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="10" width="164" height="100" rx="6" fill="#f4f6f7" stroke="#dce1e5" strokeWidth="1.5" />
    <circle cx="90" cy="60" r="34" fill="#eef6f1" />
    {/* Symbol ochronnego parasola / opieki */}
    <path
      d="M58 58C58 40 72 28 90 28C108 28 122 40 122 58H58Z"
      fill="#007834"
    />
    <path
      d="M90 58V84C90 88 87 91 83 91C79 91 77 89 77 86"
      stroke="#00416E"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Małe ciepłe serce pod parasolem */}
    <path
      d="M108 72C108 68.5 104.5 66 101 69C97.5 66 94 68.5 94 72C94 76.5 101 81 101 81C101 81 108 76.5 108 72Z"
      fill="#f39200"
    />
  </svg>
);
