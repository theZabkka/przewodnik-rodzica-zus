"use client";

import React, { useState } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { ContractType, ParentRole } from "@hacknation/shared";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  simpleText?: string;
  legalText?: string;
  legalReferences?: string[];
  recommendationTips?: string[];
  timestamp: string;
}

interface UserContext {
  role: ParentRole;
  contract: ContractType;
  stage: "pregnancy" | "after_birth" | "parental" | "return_work";
  salaryGross: number;
}

const STARTER_PROMPTS = [
  "Kiedy najbardziej opłaca się złożyć wniosek w 21 dni na 81,5%?",
  "Jak ojciec dziecka może wykorzystać 9 nieprzenoszalnych tygodni?",
  "Czy pracując na 1/2 etatu stracę zasiłek rodzicielski?",
  "Urodziłam dziecko w 27. tygodniu – ile dodatkowego urlopu mi przysługuje?",
  "Prowadzę działalność (JDG) i mam zadłużenie w ZUS. Czy dostanę zasiłek?",
  "Ile wynosi zasiłek chorobowy w ciąży z kodem B i jak długo mogę na nim być?",
  "Czy ojciec może wziąć urlop ojcowski, gdy mama nie pracuje i nie ma ubezpieczenia?",
  "Jakie prawa przysługują rodzicom po poronieniu lub martwym urodzeniu?",
];

interface KnowledgeBaseItem {
  keywords: string[];
  simple: string;
  legal: string;
  refs: string[];
  tips: string[];
}

const KNOWLEDGE_BASE: KnowledgeBaseItem[] = [
  {
    keywords: ["81", "81,5", "81.5", "21 dni", "długi wniosek", "uśrednion", "opłaca"],
    simple:
      "Wniosek o zasiłek w stawce 81,5% (tzw. długi wniosek ZAM składany w 21 dni po porodzie) opłaca się w 90% przypadków, gdy mama planuje pozostać z dzieckiem przez cały rok (urlop macierzyński + urlop rodzicielski). Zapewnia to równą, przewidywalną pensję przez 12 miesięcy. Jeśli jednak planujesz wrócić do pracy od razu po macierzyńskim (po 20 tygodniach), lepiej wybrać wariant standardowy (100% za macierzyński), by otrzymać wyższe środki na początku. Nawet jeśli weźmiesz 81,5%, a nie wykorzystasz rodzicielskiego, ZUS wypłaci Ci wyrównanie do 100%!",
    legal:
      "Zgodnie z art. 30a ust. 1 ustawy z dnia 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa, złożenie przez ubezpieczoną matkę wniosku o zasiłek macierzyński za okres urlopu macierzyńskiego i rodzicielskiego w pełnym wymiarze w terminie do 21 dni po porodzie skutkuje ustaleniem miesięcznego zasiłku w wysokości 81,5% podstawy wymiaru. Zgodnie z art. 31 ust. 4, w razie niewykorzystania urlopu rodzicielskiego przysługuje jednorazowe wyrównanie do 100% podstawy wymiaru.",
    refs: ["Art. 30a ustawy zasiłkowej", "Art. 31 ust. 4 ustawy zasiłkowej", "Art. 182¹a Kodeksu pracy"],
    tips: [
      "Złóż wniosek ZAM nie później niż w 21. dniu od narodzin dziecka.",
      "Pamiętaj: 9 tygodni dla ojca ZAWSZE wynosi 70%, nawet przy wariancie 81,5% mamy.",
    ],
  },
  {
    keywords: ["ojciec", "tata", "9 tygodni", "nieprzenoszaln", "ojca", "drugi rodzic"],
    simple:
      "Tata dziecka ma zagwarantowane własne, wyłączne 9 tygodni urlopu rodzicielskiego. Jeśli tata z nich nie skorzysta, te 9 tygodni bezpowrotnie przepada – mama NIE MOŻE ich przejąć! Zasiłek dla taty za ten okres wynosi zawsze 70% jego podstawy wynagrodzenia. Co ważne: tata może wziąć ten urlop równocześnie z mamą (wtedy oboje są w domu) lub po powrocie mamy do pracy, aż do końca roku kalendarzowego, w którym dziecko kończy 6 lat.",
    legal:
      "Na mocy dyrektywy unijnej 2019/1158 (Work-Life Balance) wdrożonej do art. 182¹a § 4 Kodeksu pracy, każdemu z pracowników-rodziców przysługuje wyłączne prawo do 9 tygodni urlopu rodzicielskiego z ogólnego wymiaru (41 lub 43 tygodni). Prawa tego nie można przenieść na drugiego rodzica. Zgodnie z art. 31 ust. 3 pkt 2 ustawy zasiłkowej wysokość zasiłku za tę część wynosi 70% podstawy wymiaru.",
    refs: ["Art. 182¹a § 4 Kodeksu pracy", "Art. 31 ust. 3 pkt 2 ustawy zasiłkowej", "Dyrektywa UE 2019/1158"],
    tips: [
      "Tata nie musi brać 9 tygodni od razu – urlop można podzielić na maksymalnie 5 części.",
      "Czas na wykorzystanie: do końca roku, w którym dziecko kończy 6. rok życia.",
    ],
  },
  {
    keywords: ["pół etatu", "1/2", "etat", "łączyć", "praca", "pracować", "wydłużen"],
    simple:
      "Możesz pracować na maksymalnie 1/2 etatu u swojego dotychczasowego pracodawcy w trakcie urlopu rodzicielskiego i NIE TRACISZ ani grosza z zasiłku! Wypłacany zasiłek zostaje zmniejszony proporcjonalnie do wymiaru etatu (np. o połowę), ale za to Twój urlop ulega odpowiedniemu wydłużeniu (nawet do 82 tygodni przy jednym dziecku). W efekcie co miesiąc masz pół pensji + pół zasiłku, a całkowita suma zasiłku wypłacona przez ZUS w całym wydłużonym okresie wynosi dokładnie 100%!",
    legal:
      "Zgodnie z art. 182¹f § 1 i 2 Kodeksu pracy pracownik może łączyć korzystanie z urlopu rodzicielskiego z wykonywaniem pracy u macierzystego pracodawcy w wymiarze do 1/2 pełnego etatu. W takim przypadku urlop ulega proporcjonalnemu wydłużeniu. Zasiłek macierzyński pomniejsza się proporcjonalnie do wymiaru czasu pracy (art. 31 ust. 4a ustawy zasiłkowej), co w całym cyklu gwarantuje zachowanie pełnej nominalnej puli świadczenia.",
    refs: ["Art. 182¹f Kodeksu pracy", "Art. 31 ust. 4a ustawy zasiłkowej"],
    tips: [
      "Pracodawca ma obowiązek uwzględnić wniosek o łączenie urlopu z pracą, chyba że nie jest to możliwe ze względu na organizację pracy.",
      "Wniosek składasz na minimum 21 dni przed planowanym rozpoczęciem pracy.",
    ],
  },
  {
    keywords: ["wcześniak", "szpital", "hospitalizac", "180", "przedwcześnie", "waga", "gram"],
    simple:
      "Od 2026 roku obowiązuje art. 180² Kodeksu pracy wprowadzający uzupełniający urlop macierzyński dla rodziców wcześniaków płatny w 100%! Jeśli dziecko urodziło się przed 28. tygodniem ciąży lub ważyło do 1000 g, przysługuje Ci nawet do 15 dodatkowych tygodni urlopu. Dla dzieci urodzonych między 28. a 37. tygodniem przysługuje do 8 dodatkowych tygodni. Zasada jest prosta: 1 tydzień urlopu za każdy tydzień pobytu maluszka w szpitalu, a niepełny tydzień zaokrągla się w górę!",
    legal:
      "Zgodnie z art. 180² Kodeksu pracy pracownikowi-rodzicowi przysługuje prawo do uzupełniającego urlopu macierzyńskiego w wymiarze do 15 tygodni (urodzenie <28 tyg. lub masa <=1000g) albo do 8 tygodni (28-37 tyg. lub hospitalizacja po 37 tyg. min. 2 dni). Zgodnie z art. 180² § 3 KP niepełny tydzień hospitalizacji zaokrągla się w górę do pełnego tygodnia urlopu. Zasiłek wynosi 100% podstawy wymiaru.",
    refs: ["Art. 180² Kodeksu pracy 2026", "Rozporządzenie MRPiPS z 27.09.2026 r."],
    tips: [
      "Wniosek o urlop uzupełniający składasz min. 21 dni przed końcem urlopu macierzyńskiego.",
      "Wymagane jest zaświadczenie szpitala o tygodniu ciąży, wadze i liczbie dni hospitalizacji.",
    ],
  },
  {
    keywords: ["jdg", "dług", "zadłużen", "48", "48,06", "działalność", "b2b", "składk"],
    simple:
      "Dla przedsiębiorców (JDG) kluczowa jest zasada art. 2a ustawy zasiłkowej: jeśli na dzień porodu masz zaległości składkowe przekraczające 1% płacy minimalnej (w 2026 r. to zaledwie 48,06 zł!), ZUS wstrzyma wypłatę całego zasiłku! Na szczęście masz 6 miesięcy od dnia porodu na spłatę tego długu. Jeśli uregulujesz zaległość w ciągu 6 miesięcy, ZUS wypłaci Ci wszystkie należne zasiłki wstecz. Jeśli minie 6 miesięcy – prawo do zasiłku bezpowrotnie przepada!",
    legal:
      "Zgodnie z art. 2a ustawy zasiłkowej osobom prowadzącym pozarolniczą działalność świadczenia nie przysługują w razie wystąpienia w dniu powstania prawa zadłużenia z tytułu składek na ubezpieczenia społeczne na kwotę przekraczającą 1% minimalnego wynagrodzenia (48,06 zł w 2026 r.). Jeżeli zadłużenie zostanie spłacone w całości w ciągu 6 miesięcy, świadczenie przysługuje od dnia powstania prawa. Po upływie 6 miesięcy prawo do zasiłku za dany okres przedawnia się.",
    refs: ["Art. 2a ustawy zasiłkowej", "Art. 67 ustawy o systemie ubezpieczeń społecznych"],
    tips: [
      "Przed porodem sprawdź saldo w portalu eZUS/PUE lub opłać składki z naddatkiem.",
      "Dobrowolne ubezpieczenie chorobowe na JDG wymaga 90 dni okresu wyczekiwania na chorobowe, lecz zasiłek macierzyński przysługuje od 1. dnia ubezpieczenia!",
    ],
  },
  {
    keywords: ["l4", "ciąża", "kod b", "270", "zwolnien", "chorobowe w ciąży", "ginekolog"],
    simple:
      "Zwolnienie lekarskie w ciąży (e-ZLA z kodem 'B') jest płatne w 100% podstawy wymiaru. Co najważniejsze: maksymalny okres takiego zwolnienia to aż 270 dni (zwykłe L4 trwa tylko 182 dni). Przez pierwsze 33 dni w roku kalendarzowym pensję chorobową płaci Twój pracodawca, a od 34. dnia wypłatę zasiłku w 100% przejmuje ZUS. Nowe zwolnienie z kodem 'B' rozpoczyna licznik 270 dni na nowo i nie sumuje się z wcześniejszymi chorobami sprzed ciąży!",
    legal:
      "Zgodnie z art. 8 i art. 11 ust. 2 pkt 1 ustawy zasiłkowej, zasiłek chorobowy za okres niezdolności przypadający w trakcie ciąży (kod literowy 'B') wynosi 100% podstawy wymiaru, a okres zasiłkowy wynosi 270 dni. Płatnikiem przez pierwsze 33 dni w roku jest pracodawca (art. 92 KP), od 34. dnia – ZUS. Okresów niezdolności sprzed ciąży nie wlicza się do limitu 270 dni.",
    refs: ["Art. 8 i 11 ustawy zasiłkowej", "Art. 92 Kodeksu pracy"],
    tips: [
      "Lekarz wystawiający e-ZLA wpisuje kod 'B' automatycznie na podstawie karty ciąży.",
      "Umowa na czas określony trwająca powyżej 3. miesiąca ciąży ulega przedłużeniu z mocy prawa do dnia porodu (art. 177 § 3 KP).",
    ],
  },
  {
    keywords: ["ojcowski", "14 dni", "ojcowsk", "urlop ojcowski", "niepracuj"],
    simple:
      "Urlop ojcowski (14 dni kalendarzowych, płatne w 100%) to całkowicie samodzielne prawo taty. Przysługuje ojcu ubezpieczonemu nawet wtedy, gdy mama dziecka nie pracuje, nie ma ubezpieczenia i nie ma prawa do macierzyńskiego! Urlop można wykorzystać w całości (14 dni) lub w 2 częściach po 7 dni, wyłącznie do dnia 1. urodzin dziecka. Po ukończeniu 12 miesięcy przez dziecko niewykorzystany urlop ojcowski bezpowrotnie wygasa.",
    legal:
      "Zgodnie z art. 182³ Kodeksu pracy pracownik-ojciec wychowujący dziecko ma prawo do urlopu ojcowskiego w wymiarze do 2 tygodni (14 dni) do ukończenia przez dziecko 12. miesiąca życia. Jest to uprawnienie niezależne od praw matki. Zasiłek macierzyński za ten okres wynosi 100% podstawy wymiaru (art. 31 ust. 1 ustawy zasiłkowej).",
    refs: ["Art. 182³ Kodeksu pracy", "Art. 31 ust. 1 ustawy zasiłkowej"],
    tips: [
      "Wniosek składa się u pracodawcy min. 7 dni przed planowanym rozpoczęciem urlopu.",
      "Pracodawca ma bezwzględny obowiązek uwzględnić prawidłowo złożony wniosek.",
    ],
  },
  {
    keywords: ["poronien", "martw", "śmierć", "strata", "pochówek", "pogrzebow", "zmarł"],
    simple:
      "Po stracie ciąży (poronieniu lub martwym urodzeniu) mamie przysługuje 8 tygodni (56 dni) urlopu macierzyńskiego z zasiłkiem w wysokości 100% podstawy wymiaru. Nie jest wymagany żaden okres wyczekiwania. Ponadto, w razie zorganizowania pochówku, ZUS wypłaca zasiłek pogrzebowy w kwocie 7 000 zł na podstawie wniosku Z-12. Jeśli szpital nie określił płci dziecka, wystawia zaświadczenie lekarskie, które również daje pełne prawo do urlopu i zasiłku.",
    legal:
      "Zgodnie z art. 180¹ § 1 Kodeksu pracy w razie urodzenia martwego dziecka pracownicy przysługuje urlop macierzyński w wymiarze 8 tygodni po porodzie (nie krócej niż 7 dni od dnia zgonu dziecka). Zasiłek wynosi 100% podstawy wymiaru. Zasiłek pogrzebowy reguluje art. 77–81 ustawy emerytalnej (kwota 7 000 zł w 2026 r.).",
    refs: ["Art. 180¹ § 1 Kodeksu pracy", "Art. 77 ustawy o emeryturach i rentach z FUS"],
    tips: [
      "Dokumentem bazowym jest akt urodzenia z adnotacją o martwym urodzeniu lub zaświadczenie lekarskie.",
      "Wniosek o zasiłek pogrzebowy można złożyć w ciągu 12 miesięcy od dnia pogrzebu.",
    ],
  },
  {
    keywords: ["opiekuńcz", "chory", "dzieck", "opieka", "z-15a", "żłobek", "60 dni"],
    simple:
      "Zasiłek opiekuńczy wynosi 80% podstawy wymiaru i przysługuje od 1. dnia ubezpieczenia (brak okresu wyczekiwania!). Na opiekę nad chorym dzieckiem do 14 lat przysługuje łącznie do 60 dni w roku kalendarzowym (pula wspólna dla mamy i taty). Warunkiem jest brak innego domownika mogącego zapewnić opiekę, ale UWAGA: w przypadku chorego dziecka do lat 2 zasiłek przysługuje ZAWSZE, nawet gdy w domu są inni dorośli!",
    legal:
      "Zgodnie z art. 32–35 ustawy zasiłkowej zasiłek opiekuńczy przysługuje w wysokości 80% podstawy wymiaru przez okres do 60 dni w roku kalendarzowym (opieka nad dzieckiem do lat 14) albo do 14 dni (opieka nad innym chorym członkiem rodziny). Wyłączenie wymogu braku domownika dla dzieci do lat 2 wynika wprost z art. 34 ustawy zasiłkowej.",
    refs: ["Art. 32–35 ustawy zasiłkowej", "Formularz Z-15A ZUS"],
    tips: [
      "Wniosek Z-15A składa się elektronicznie przez eZUS/PUE po wystawieniu e-ZLA przez pediatrę.",
      "Dni opiekuńczego nie wliczają się do okresu zasiłkowego z tytułu własnej choroby (182/270 dni).",
    ],
  },
];

export default function AsystentAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Dzień dobry! Jestem inteligentnym doradcą prawno-zasiłkowym ZUS. Znam szczegółowo przepisy Kodeksu pracy 2026, ustawy zasiłkowej, ustawy 'Za życiem' oraz dyrektywy Work-Life Balance. Możesz zapytać mnie o dowolne uprawnienie, warianty kwotowe lub procedury urzędowe.",
      simpleText:
        "Dzień dobry! Jestem inteligentnym doradcą prawno-zasiłkowym ZUS. Chętnie wyjaśnię Ci po ludzku zasady zasiłków macierzyńskich, 81,5% vs 100/70%, 9 tygodni dla taty, łączenie rodzicielskiego z 1/2 etatu czy urlop dla wcześniaków. W czym mogę pomóc?",
      legalText:
        "Dzień dobry. Jako certyfikowany doradca legislacyjny ZUS służę pomocą w wykładni ustawy z dnia 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa oraz Działu VIII Kodeksu pracy. Proszę zadać pytanie prawne.",
      legalReferences: ["Ustawa zasiłkowa 2026", "Kodeks pracy Dział VIII"],
      recommendationTips: [
        "Skorzystaj z sugerowanych pytań poniżej lub wpisz własną sytuację.",
        "Przełączaj tryb odpowiedzi między 'Język prosty (Humanizer)' a 'Ścisła wykładnia prawna'.",
      ],
      timestamp: "Teraz",
    },
  ]);

  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Kontekst personalizacji rodzica
  const [showContextDrawer, setShowContextDrawer] = useState<boolean>(false);
  const [userContext, setUserContext] = useState<UserContext>({
    role: "mother",
    contract: "employment",
    stage: "pregnancy",
    salaryGross: 6500,
  });

  const handleCopyMessage = (id: string, text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome",
        sender: "ai",
        text: isSimpleMode
          ? "Czat zresetowany. W czym mogę pomóc? Zadaj dowolne pytanie o zasiłki i urlopy ZUS."
          : "Czat zresetowany. Gotowy do analizy przepisów prawa zabezpieczenia społecznego.",
        simpleText: "Czat zresetowany. W czym mogę pomóc? Zadaj dowolne pytanie o zasiłki i urlopy ZUS.",
        legalText: "Czat zresetowany. Gotowy do analizy przepisów prawa zabezpieczenia społecznego.",
        timestamp: "Teraz",
      },
    ]);
  };

  const findBestAnswer = (query: string): KnowledgeBaseItem | null => {
    const qLower = query.toLowerCase();

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((kw) => qLower.includes(kw))) {
        return item;
      }
    }
    return null;
  };

  const sendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: "Teraz",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const matched = findBestAnswer(textToSend);

      let simpleResponse = "";
      let legalResponse = "";
      let refs: string[] = [];
      let tips: string[] = [];

      if (matched) {
        simpleResponse = matched.simple;
        legalResponse = matched.legal;
        refs = matched.refs;
        tips = matched.tips;
      } else {
        simpleResponse = `Zgodnie ze stanem prawnym 2026, dla Twojej formy umowy (${
          userContext.contract === "employment"
            ? "umowa o pracę"
            : userContext.contract === "b2b"
            ? "działalność JDG"
            : "zlecenie"
        }) oraz wynagrodzenia ${userContext.salaryGross} zł, przysługuje Ci ochrona zasiłkowa. Pamiętaj o kluczowym terminie 21 dni po porodzie na złożenie wniosku ZAM (stawka 81,5%), 9 nieprzenoszalnych tygodniach dla ojca oraz prawie do łączenia rodzicielskiego z pracą na 1/2 etatu z wydłużeniem urlopu.`;
        legalResponse =
          "Kwestie prawa do zasiłku macierzyńskiego, urlopu rodzicielskiego i ojcowskiego reguluje art. 176–189¹ Kodeksu pracy oraz ustawa z 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa (Dz.U. z 2026 r. poz. 854). Wypłata następuje w terminie 30 dni od wyjaśnienia ostatniej okoliczności.";
        refs = ["Ustawa zasiłkowa 2026", "Kodeks pracy Dział VIII"];
        tips = [
          "Sprawdź kalkulator na naszej stronie, by zobaczyć dokładny harmonogram wypłat miesiąc po miesiącu.",
          "W portalu eZUS/PUE możesz złożyć wniosek ZAM z Urzędowym Poświadczeniem Odbioru (UPO).",
        ];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: isSimpleMode ? simpleResponse : legalResponse,
        simpleText: simpleResponse,
        legalText: legalResponse,
        legalReferences: refs,
        recommendationTips: tips,
        timestamp: "Teraz",
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 w-full flex-1">
      {/* Nagłówek Modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#005A9C] font-semibold text-xs tracking-wider uppercase mb-1">
            <Bot className="w-4 h-4" />
            <span>Moduł 6 &bull; Inteligentny doradca prawny ZUS AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Asystent praw rodzicielskich i zasiłków
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Zadawaj pytania o Kodeks pracy, terminy urzędowe i optymalizację świadczeń. Asystent analizuje przepisy w trybie prostego języka lub z pełną wykładnią prawną.
          </p>
        </div>

        {/* Kontrolki: Tryb Humanizer oraz Przycisk Kontekstu */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowContextDrawer(!showContextDrawer)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showContextDrawer
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dostosuj do mojej sytuacji</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSimpleMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSimpleMode
                  ? "bg-[#005A9C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Język prosty (Humanizer)
            </button>
            <button
              type="button"
              onClick={() => setIsSimpleMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isSimpleMode
                  ? "bg-[#005A9C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Wykładnia prawna
            </button>
          </div>
        </div>
      </div>

      {/* Szuflada Kontekstu Rodzica (Personalizacja odpowiedzi) */}
      {showContextDrawer && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Rola rodzica:</label>
            <select
              value={userContext.role}
              onChange={(e) => setUserContext({ ...userContext, role: e.target.value as ParentRole })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
            >
              <option value="mother">Matka dziecka</option>
              <option value="father">Ojciec dziecka</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Forma zatrudnienia:</label>
            <select
              value={userContext.contract}
              onChange={(e) => setUserContext({ ...userContext, contract: e.target.value as ContractType })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
            >
              <option value="employment">Umowa o pracę (UoP)</option>
              <option value="mandate">Umowa zlecenie</option>
              <option value="b2b">Działalność gospodarcza (JDG)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Etap życiowy:</label>
            <select
              value={userContext.stage}
              onChange={(e) =>
                setUserContext({
                  ...userContext,
                  stage: e.target.value as "pregnancy" | "after_birth" | "parental" | "return_work",
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
            >
              <option value="pregnancy">W trakcie ciąży</option>
              <option value="after_birth">Tuż po porodzie (w oknie 21 dni)</option>
              <option value="parental">Urlop rodzicielski</option>
              <option value="return_work">Planowanie powrotu do pracy</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Wynagrodzenie brutto (PLN):</label>
            <input
              type="number"
              value={userContext.salaryGross}
              onChange={(e) => setUserContext({ ...userContext, salaryGross: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
            />
          </div>
        </div>
      )}

      {/* Sugerowane Pytania Początkowe (Chips) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Częste pytania rodziców (kliknij, aby zapytać):
        </span>
        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#005A9C] rounded-xl text-xs font-medium text-slate-700 hover:text-[#005A9C] transition-all text-left shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Okno Rozmowy (Czat) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[460px] max-h-[640px] overflow-hidden">
        {/* Pasek Górny Czatu */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#005A9C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Doradca ZUS AI &bull; Baza Wiedzy 2026
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Tryb aktywny: {isSimpleMode ? "Język prosty (po ludzku)" : "Ścisła wykładnia prawna"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetChat}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200 transition-colors"
              title="Wyczyść historię rozmowy"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nowa rozmowa</span>
            </button>
          </div>
        </div>

        {/* Wiadomości */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === "ai";
            const displayText =
              isAi && msg.simpleText && msg.legalText
                ? isSimpleMode
                  ? msg.simpleText
                  : msg.legalText
                : msg.text;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? "bg-[#005A9C] text-white"
                      : "bg-slate-800 text-white"
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3 relative group ${
                    isAi
                      ? "bg-slate-50 text-slate-800 border border-slate-200"
                      : "bg-[#005A9C] text-white"
                  }`}
                >
                  <p>{displayText}</p>

                  {/* Wskazówki rekomendacyjne */}
                  {isAi && msg.recommendationTips && msg.recommendationTips.length > 0 && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-900">
                      <span className="font-bold flex items-center gap-1.5 text-[#005A9C]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Kluczowe wskazówki dla Ciebie:</span>
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                        {msg.recommendationTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Artykuły prawne */}
                  {isAi && msg.legalReferences && msg.legalReferences.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                      <span className="font-semibold block text-slate-700">Podstawa prawna:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.legalReferences.map((ref, i) => (
                          <span
                            key={i}
                            className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-[10px] text-slate-800"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kopiowanie odpowiedzi */}
                  {isAi && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, displayText)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Skopiowano</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopiuj odpowiedź</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
              <Bot className="w-4 h-4 text-[#005A9C]" />
              <span>Asystent ZUS analizuje przepisy i przygotowuje odpowiedź...</span>
            </div>
          )}
        </div>

        {/* Pole Wprowadzania Wiadomości */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Zadaj pytanie dotyczące urlopów, zasiłków lub terminów ZUS..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(inputText);
              }
            }}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005A9C]"
          />
          <button
            type="button"
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 bg-[#005A9C] hover:bg-[#00477d] text-white rounded-xl transition-colors disabled:opacity-40"
            aria-label="Wyślij wiadomość"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zastrzeżenie Prawne */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-slate-500 text-center">
        Informacje dostarczane przez asystenta AI mają charakter edukacyjny i pomocniczy. Oficjalne decyzje ustalające prawo do świadczeń wydaje Zakład Ubezpieczeń Społecznych na podstawie dokumentów wnioskodawcy.
      </div>
    </div>
  );
}
