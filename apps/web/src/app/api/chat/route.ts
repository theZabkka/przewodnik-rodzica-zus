import { NextRequest, NextResponse } from "next/server";

interface ChatRequestBody {
  message: string;
  simpleMode?: boolean;
  context?: {
    role?: "mother" | "father";
    contract?: "employment" | "mandate" | "b2b";
    stage?: string;
  };
}

const ZUS_SYSTEM_PROMPT = `Jesteś Asystentem Rodzica ZUS (stan prawny: 1 kwietnia 2026 r., Polska).
Odpowiadaj wyłącznie zgodnie z polską ustawą zasiłkową (Dz.U. z 2026 r. poz. 854) i Kodeksem pracy (Dz.U. z 2026 r. poz. 1245):
- L4 w ciąży (kod B): 100% podstawy, max 270 dni. Okres wyczekiwania: 30 dni (UoP — obowiązkowe), 90 dni (umowa zlecenie lub JDG — dobrowolne ubezpieczenie chorobowe). Na zleceniu i JDG NIE MA 33 dni wynagrodzenia chorobowego od pracodawcy — zasiłek wypłaca ZUS/płatnik od 1. dnia po spełnieniu 90 dni wyczekiwania. Przed upływem 90 dni zasiłek chorobowy NIE przysługuje (chyba że zachodzą wyjątki z art. 4 ust. 3 ustawy zasiłkowej, np. 10-letni staż obowiązkowego ubezpieczenia).
- Zasiłek macierzyński: przysługuje od 1. dnia ubezpieczenia BEZ okresu wyczekiwania. 20 tyg. (1 dziecko) + 41 tyg. rodzicielskiego (w tym 9 tyg. nieprzenoszalnych dla drugiego rodzica w stawce 70%). Wniosek w ciągu 21 dni po porodzie = 81,5% za cały okres; później 100% + 70%.
- Adopcja (przysposobienie) i rodzina zastępcza niezawodowa (art. 183 KP): urlop na warunkach urlopu macierzyńskiego (20–37 tyg., gwarantowane min. 9 tyg.) do ukończenia przez dziecko 14 lat (adopcja) lub 7 lat / 10 lat przy odroczeniu szkoły (rodzina zastępcza niezawodowa) + pełny urlop rodzicielski (41/43 tyg., lub 65/67 tyg. z zaświadczeniem „Za życiem”). Urlop ojcowski (14 dni): w ciągu 12 mies. od uprawomocnienia przysposobienia, do 14 r.ż. dziecka.
- Wcześniaki / hospitalizacja (art. 180² KP): uzupełniający urlop macierzyński do 15 tyg. (<28 tyg. lub <1000 g) lub do 8 tyg. (28–37 tyg. lub hospitalizacja po 37 tyg.), 100% podstawy.
- Poronienie / martwe urodzenie: 8 tygodni zasiłku macierzyńskiego (min. 7 dni od zgonu).
- Utrata pracy w ciąży (upadłość, likwidacja, śmierć pracodawcy lub bezprawne zwolnienie potwierdzone wyrokiem sądu): zasiłek w wysokości zasiłku macierzyńskiego (100% do dnia porodu, art. 30 ust. 3).
- Zadłużenie JDG > 1% płacy minimalnej (48,06 zł w 2026 r.): wstrzymuje wypłatę zasiłku do czasu spłaty (art. 2a ustawy zasiłkowej).
Odpowiadaj zwięźle, konkretnie, po polsku, z podaniem podstawy prawnej.`;

function buildDeterministicZusReply(
  rawQuery: string,
  simpleMode: boolean,
  context?: ChatRequestBody["context"]
): { text: string; legalBasis: string } {
  const q = rawQuery.toLowerCase();
  const isMandateOrJdg =
    q.includes("zlecen") ||
    q.includes("jdg") ||
    q.includes("działalnoś") ||
    q.includes("dzialalnos") ||
    q.includes("b2b") ||
    context?.contract === "mandate" ||
    context?.contract === "b2b";

  // 1. Adopcja / przysposobienie / rodzina zastępcza (PRIORYTET — nigdy nie mylić z zasiłkiem opiekuńczym!)
  if (
    q.includes("adopcj") ||
    q.includes("przysposob") ||
    q.includes("zastępcz") ||
    q.includes("zastepcz") ||
    q.includes("przyjęci") ||
    q.includes("przyjec")
  ) {
    return {
      text: simpleMode
        ? "Przy adopcji (przysposobieniu) dziecka np. 3-letniego przysługuje Ci pełny **urlop na warunkach urlopu macierzyńskiego (20 tygodni przy 1 dziecku)** płatny 100% oraz **urlop rodzicielski (41 tygodni, w tym 9 tygodni dla drugiego rodzica)**.\n\n• **Limit wieku dziecka:** przy adopcji do **14 lat**, a w rodzinie zastępczej niezawodowej do **7 lat** (lub **10 lat** przy odroczeniu obowiązku szkolnego).\n• **Gwarantowane minimum:** nawet tuż przed granicą wieku masz prawo do co najmniej **9 tygodni** urlopu.\n• **Urlop ojcowski (14 dni):** ojciec może go wykorzystać w ciągu 12 miesięcy od uprawomocnienia się postanowienia o przysposobieniu (do 14. roku życia dziecka)."
        : "Na podstawie art. 183 § 1 i § 4 Kodeksu pracy ubezpieczonemu, który przyjął dziecko na wychowanie i wystąpił do sądu o wszczęcie postępowania w sprawie przysposobienia (do 14. roku życia dziecka) lub przyjął dziecko jako rodzina zastępcza niezawodowa (do 7. roku życia, a przy odroczeniu obowiązku szkolnego do 10. roku życia), przysługuje prawo do urlopu na warunkach urlopu macierzyńskiego (20–37 tygodni, nie krócej niż 9 tygodni) oraz do urlopu rodzicielskiego (41 lub 43 tygodnie; 65/67 tygodni z zaświadczeniem „Za życiem”). Wniosek złożony w ciągu 21 dni od złożenia wniosku o przysposobienie/przyjęcia dziecka daje równą stawkę 81,5%.",
      legalBasis: "Art. 183 § 1–4 Kodeksu pracy; art. 29 ust. 1 pkt 2–3 ustawy zasiłkowej (Dz.U. z 2026 r. poz. 854)",
    };
  }

  // 2. L4 / zwolnienie lekarskie w ciąży (rozróżnienie UoP vs zlecenie/JDG + okres wyczekiwania 30/90 dni!)
  if (
    q.includes("l4") ||
    q.includes("zwolnien") ||
    q.includes("chorobow") ||
    q.includes("e-zla") ||
    q.includes("wyczekiwan") ||
    q.includes("karencj")
  ) {
    if (isMandateOrJdg) {
      return {
        text: simpleMode
          ? "Przy **umowie zlecenia oraz JDG** ubezpieczenie chorobowe jest dobrowolne i obowiązuje **90 dni okresu wyczekiwania**.\n\n• **Po 2 miesiącach (ok. 60 dniach) zasiłek chorobowy jeszcze NIE przysługuje** — ciąża (kod „B”) podnosi stawkę do 100%, ale **nie znosi wymogu 90 dni wyczekiwania**.\n• **Brak 33 dni od pracodawcy:** na zleceniu i JDG nie ma wynagrodzenia chorobowego od pracodawcy. Po upływie 90 dni zasiłek wypłaca ZUS (lub zleceniodawca zgłaszający >20 osób) od 1. dnia choroby.\n• **Wyjątek:** jeśli masz wcześniejszy 10-letni staż obowiązkowego ubezpieczenia chorobowego lub przerwę między ubezpieczeniami krótszą niż 30 dni, okresy te mogą się zsumować.\n• **Uwaga:** zasiłek **macierzyński po porodzie** przysługuje już od 1. dnia ubezpieczenia, bez 90-dniowego wyczekiwania!"
          : "Zgodnie z art. 4 ust. 1 pkt 2 ustawy zasiłkowej osoba podlegająca dobrowolnie ubezpieczeniu chorobowemu (umowa zlecenia, JDG) nabywa prawo do zasiłku chorobowego po upływie **90 dni nieprzerwanego ubezpieczenia chorobowego**. Przepisy o 33 dniach wynagrodzenia chorobowego (art. 92 KP) dotyczą wyłącznie pracowników na umowie o pracę — zleceniobiorca i przedsiębiorca nie otrzymują wynagrodzenia chorobowego od płatnika. Przed upływem 90 dni (np. po 2 miesiącach) zasiłek chorobowy z tytułu ciąży (kod „B”, 100% podstawy, okres zasiłkowy 270 dni) nie przysługuje, chyba że zachodzą wyjątki z art. 4 ust. 2–3 ustawy (m.in. 10-letni staż ubezpieczenia obowiązkowego lub ciągłość ubezpieczenia z przerwą do 30 dni). Dokumenty: Z-3a (zlecenie) lub ZAS-53 (JDG).",
        legalBasis: "Art. 4 ust. 1–3, art. 8 ust. 1 oraz art. 11 ust. 2 pkt 1 ustawy zasiłkowej (Dz.U. z 2026 r. poz. 854)",
      };
    }

    return {
      text: simpleMode
        ? "Na **umowie o pracę** zwolnienie lekarskie w ciąży (e-ZLA z kodem **„B”**) jest płatne w **100% podstawy wymiaru** przez maksymalnie **270 dni**.\n\n• **Okres wyczekiwania:** 30 dni nieprzerwanego obowiązkowego ubezpieczenia chorobowego (ciąża nie znosi tego wymogu).\n• **Kto płaci:** przez pierwsze **33 dni** niezdolności w roku kalendarzowym (14 dni dla osób 50+) pracodawca wypłaca wynagrodzenie chorobowe, a od 34. dnia przysługuje zasiłek chorobowy z FUS."
        : "Pracownica (umowa o pracę) nabywa prawo do świadczeń chorobowych po 30 dniach nieprzerwanego obowiązkowego ubezpieczenia chorobowego (art. 4 ust. 1 pkt 1 ustawy zasiłkowej). Przez pierwsze 33 dni niezdolności do pracy w roku kalendarzowym przysługuje wynagrodzenie chorobowe od pracodawcy (art. 92 KP), a od 34. dnia zasiłek chorobowy (100% podstawy przy kodzie „B”, maksymalny okres zasiłkowy 270 dni). Gdy pracodawca zgłasza do 20 ubezpieczonych, przekazuje do ZUS formularz Z-3.",
      legalBasis: "Art. 4 ust. 1 pkt 1, art. 8, art. 11 ust. 2 pkt 1 ustawy zasiłkowej; art. 92 Kodeksu pracy",
    };
  }

  // 3. Utrata pracy w ciąży / zasiłek w wysokości zasiłku macierzyńskiego
  if (
    q.includes("upadłoś") ||
    q.includes("likwidacj") ||
    q.includes("utrata pracy") ||
    q.includes("zwolnił") ||
    q.includes("wyrok") ||
    q.includes("wysokości zasiłku macierzyńskiego")
  ) {
    return {
      text: simpleMode
        ? "Jeśli w trakcie ciąży straciłaś pracę z powodu **upadłości, likwidacji lub śmierci pracodawcy** (i nie zapewniono Ci innego zatrudnienia) albo umowę rozwiązano z naruszeniem prawa (potwierdzonym wyrokiem sądu), przysługuje Ci **zasiłek w wysokości zasiłku macierzyńskiego (100% podstawy)** wypłacany przez ZUS aż do dnia porodu — a po porodzie pełny zasiłek macierzyński."
        : "Zgodnie z art. 30 ust. 3 ustawy zasiłkowej pracownicy, z którą rozwiązano stosunek pracy w okresie ciąży z powodu ogłoszenia upadłości lub likwidacji pracodawcy i której nie zapewniono innego zatrudnienia, przysługuje do dnia porodu zasiłek w wysokości zasiłku macierzyńskiego (100% podstawy wymiaru). Świadczenie przysługuje również w przypadku rozwiązania umowy z naruszeniem przepisów prawa potwierdzonym prawomocnym wyrokiem sądu.",
      legalBasis: "Art. 30 ust. 3 ustawy zasiłkowej (Dz.U. z 2026 r. poz. 854)",
    };
  }

  // 4. Wcześniak / hospitalizacja / uzupełniający urlop
  if (q.includes("wcześniak") || q.includes("wczesniak") || q.includes("szpital") || q.includes("uzupełniając")) {
    return {
      text: simpleMode
        ? "Dla rodziców wcześniaków oraz dzieci hospitalizowanych po porodzie przysługuje **uzupełniający urlop macierzyński (100% podstawy)**:\n\n• **Do 15 tygodni** — przy urodzeniu przed 28. tygodniem ciąży lub z masą ≤ 1000 g.\n• **Do 8 tygodni** — przy urodzeniu między 28. a 37. tygodniem (masa > 1000 g) lub u dziecka urodzonego o czasie, ale hospitalizowanego min. 2 kolejne dni między 5. a 28. dniem po porodzie.\n\nUrlop jest udzielany jednorazowo bezpośrednio po urlopie macierzyńskim na podstawie zaświadczenia ze szpitala."
        : "Na podstawie art. 180² Kodeksu pracy matce albo ojcu dziecka urodzonego przedwcześnie lub wymagającego hospitalizacji po porodzie przysługuje jednorazowy uzupełniający urlop macierzyński (100% podstawy wymiaru): do 15 tygodni (<28 tyg. lub ≤1000 g) albo do 8 tygodni (28–37 tyg. z masą >1000 g lub poród po 37 tyg. z hospitalizacją), w wymiarze 1 tygodnia za każdy tydzień pobytu dziecka w szpitalu.",
      legalBasis: "Art. 180² Kodeksu pracy (Dz.U. z 2026 r. poz. 1245)",
    };
  }

  // 5. Poronienie / martwe urodzenie
  if (q.includes("poronien") || q.includes("martw") || q.includes("zgon") || q.includes("strat")) {
    return {
      text: simpleMode
        ? "W przypadku urodzenia martwego dziecka lub zgonu dziecka przed upływem 8 tygodni życia przysługuje **8 tygodni zasiłku macierzyńskiego (100% podstawy)**, nie krócej niż 7 dni od dnia zgonu. Szpital wystawia kartę martwego urodzenia, a USC wydaje odpis aktu urodzenia z odpowiednią adnotacją."
        : "Zgodnie z art. 180¹ Kodeksu pracy w razie urodzenia martwego dziecka lub zgonu dziecka przed upływem 8 tygodni życia pracownicy przysługuje urlop macierzyński w wymiarze 8 tygodni po porodzie, nie krócej jednak niż przez okres 7 dni od dnia zgonu dziecka. Przy zgonie po 8 tygodniach — prawo zachowane przez 7 dni od zgonu.",
      legalBasis: "Art. 180¹ Kodeksu pracy; art. 29a ustawy zasiłkowej",
    };
  }

  // 6. Zadłużenie JDG
  if (q.includes("dług") || q.includes("dlug") || q.includes("zadłuż") || q.includes("zaległ")) {
    return {
      text: simpleMode
        ? "Jeśli prowadzisz JDG i masz zaległości w składkach ZUS przekraczające **1% płacy minimalnej (48,06 zł w 2026 r.)**, ZUS wstrzyma wypłatę zasiłku do czasu spłaty długu. Po uregulowaniu zaległości w ciągu 6 miesięcy prawo do zasiłku zostaje przywrócone."
        : "Zgodnie z art. 2a ustawy zasiłkowej zasiłki nie przysługują osobom prowadzącym pozarolniczą działalność w razie występowania w dniu powstania prawa do świadczenia zadłużenia z tytułu składek przekraczającego 1% minimalnego wynagrodzenia (48,06 zł w 2026 r.) — do czasu spłaty całości zadłużenia.",
      legalBasis: "Art. 2a ustawy zasiłkowej (Dz.U. z 2026 r. poz. 854)",
    };
  }

  // 7. Ojciec / 9 tygodni / ojcowski / 81,5% / łączenie z pracą
  if (
    q.includes("ojc") ||
    q.includes("tat") ||
    q.includes("9 tyg") ||
    q.includes("81,5") ||
    q.includes("21 dni") ||
    q.includes("etatu") ||
    q.includes("prac")
  ) {
    return {
      text: simpleMode
        ? "Najważniejsze zasady urlopu rodzicielskiego i uprawnień ojca (2026):\n\n• **21 dni po porodzie:** złożenie wniosku ZAM o pełny okres w tym terminie daje równą stawkę **81,5%** przez cały rok (później: 100% macierzyński + 70% rodzicielski).\n• **9 tygodni wyłącznie dla drugiego rodzica:** nieprzenoszalna część rodzicielskiego płatna zawsze **70%** (przysługuje ojcu nawet wtedy, gdy matka nie była ubezpieczona!).\n• **Urlop ojcowski:** 14 dni (100% podstawy) do 12. miesiąca życia dziecka.\n• **Praca na ½ etatu:** urlop rodzicielski można łączyć z pracą u pracodawcy (max ½ etatu) z proporcjonalnym wydłużeniem okresu."
        : "Na podstawie art. 182¹a, art. 182¹e oraz art. 182³ Kodeksu pracy łączny wymiar urlopu rodzicielskiego wynosi 41 tygodni (1 dziecko) lub 43 tygodnie (poród mnogi), w tym 9 tygodni wyłącznych dla każdego z rodziców (stawka 70%). Złożenie wniosku w terminie 21 dni od porodu skutkuje uśrednioną stawką 81,5% za cały okres (z wyłączeniem nieprzenoszalnych 9 tygodni drugiego rodzica). Urlop rodzicielski można łączyć z pracą w wymiarze do ½ etatu z proporcjonalnym wydłużeniem (art. 182¹f KP).",
      legalBasis: "Art. 182¹a–182¹f, art. 182³ Kodeksu pracy; art. 31 ustawy zasiłkowej",
    };
  }

  // Domyślna, rzeczowa odpowiedź kierująca do kalkulatora i wskazująca dostępne tematy
  return {
    text: simpleMode
      ? "Chętnie pomogę w konkretnej sprawie! Opisz dokładniej swoją sytuację, np.:\n\n• **L4 w ciąży** (podaj rodzaj umowy: UoP, zlecenie czy JDG oraz staż ubezpieczenia),\n• **Adopcja lub rodzina zastępcza** (podaj wiek przyjmowanego dziecka),\n• **Wyliczenie 81,5% vs 100%/70%** i podział 9 tygodni dla ojca,\n• **Wcześniak w szpitalu**, **poronienie**, **utrata pracy w ciąży** lub **zadłużenie JDG**.\n\nDokładne kwoty i tygodnie urlopu policzysz też w zakładce **Kalkulator zasiłku**."
      : "Aby udzielić precyzyjnej odpowiedzi prawnej na podstawie ustawy zasiłkowej (Dz.U. z 2026 r. poz. 854) i Kodeksu pracy, doprecyzuj proszę tytuł ubezpieczenia (umowa o pracę, zlecenie, JDG) oraz zdarzenie (choroba w ciąży, poród, adopcja, rodzina zastępcza, hospitalizacja wcześniaka lub zadłużenie składkowe).",
    legalBasis: "Ustawa zasiłkowa (Dz.U. z 2026 r. poz. 854) · Kodeks pracy (Dz.U. z 2026 r. poz. 1245)",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = (body.message || "").trim();
    const simpleMode = body.simpleMode ?? true;

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Treść pytania nie może być pusta." },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const contextNote = body.context
          ? `Kontekst użytkownika: rola=${body.context.role ?? "niepodano"}, umowa=${body.context.contract ?? "niepodano"}, etap=${body.context.stage ?? "niepodano"}, styl=${simpleMode ? "prosty język" : "wykładnia prawna"}.`
          : "";

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: ZUS_SYSTEM_PROMPT }],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${contextNote}\nPytanie rodzica: ${message}` }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const aiText =
            data?.candidates?.[0]?.content?.parts
              ?.map((p: { text?: string }) => p.text ?? "")
              .join("")
              .trim() || "";
          if (aiText) {
            return NextResponse.json({
              ok: true,
              engine: "gemini-2.5-flash",
              reply: aiText,
              legalBasis:
                "Odpowiedź wygenerowana przez model Gemini AI na bazie stanu prawnego ZUS 2026",
            });
          }
        }
      } catch {
        // Fallback na serwerowy silnik reguł ZUS 2026
      }
    }

    const deterministic = buildDeterministicZusReply(message, simpleMode, body.context);
    return NextResponse.json({
      ok: true,
      engine: "zus-server-rules-2026",
      reply: deterministic.text,
      legalBasis: deterministic.legalBasis,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Błąd przetwarzania zapytania w /api/chat.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
