# Materiały Finałowe HackNation 2026 — Przewodnik Rodzica ZUS

Dokument zawiera gotową strukturę prezentacji (**maksymalnie 10 slajdów** — twardy limit regulaminowy ZUS), scenariusz **3-minutowego filmu demonstracyjnego** oraz instrukcję szybkiego wdrożenia **Live Demo** (Vercel / Netlify).

---

## CZĘŚĆ 1: PITCH DECK (10 SLAJDÓW)

### Slajd 1 — Tytuł i Wizja
- **Tytuł:** Zasiłkowy Przewodnik Przyszłego Rodzica
- **Podtytuł:** Koniec z błędnymi wnioskami i niepewnością finansową — jeden inteligentny przewodnik ZUS 2026
- **Elementy wizualne:** Oficjalny logotyp ZUS, zrzut ekranu strony głównej i kartki A4 wniosku ZAM, nazwa zespołu, link do Live Demo.

### Slajd 2 — Diagnoza Problemu (Dlaczego ZUS i rodzice tracą czas i pieniądze?)
- **Asymetria informacji:** ZUS dowiaduje się o dziecku dopiero po porodzie, gdy wpływa wniosek — często błędny lub spóźniony.
- **Złożoność prawa 2026 (Work-Life Balance + art. 180² KP):**
  - Pułapka **21 dni** od porodu na wariant uśredniony `81,5%` vs `100%/70%`.
  - **9 nieprzenoszalnych tygodni ojca** zawsze w stawce `70%` (częsty błąd w kalkulacjach).
  - Nowe zasady dla wcześniaków i dzieci hospitalizowanych (do 8 lub 15 tygodni w `100%`).
  - **Pułapka długu JDG (> 48,06 zł):** 1% płacy minimalnej blokuje wypłatę zasiłku (art. 2a ustawy).

### Slajd 3 — Nasze Rozwiązanie & Architektura
- **Jedna platforma w oficjalnym standardzie `zus.pl` (WCAG AAA):**
  - `apps/web` (Next.js 15 + React 19 + Tailwind CSS) — pełny portal WWW + wbudowany symulator smartfona.
  - `apps/mobile` (Expo 52 + React Native) — aplikacja mobilna rodzica (Pulpit, Kalkulator, Terminarz, mObywatel).
  - `packages/shared` — certyfikowany, niezależny silnik matematyczny ZUS 2026 (Pure TypeScript + Zod).
  - `packages/db` — Supabase PostgreSQL z Row Level Security + automatyczny fallback Local-First (100% niezawodności na demo).

### Slajd 4 — Certyfikowany Silnik Matematyczny TDD (100% zgodności z prawem 2026)
- **54 testy jednostkowe Vitest (100% PASS)** pokrywające wszystkie przypadki brzegowe:
  - Odliczenie składek `13,71%`, ustawowy dzielnik `30`, minimalna podstawa UoP (`4 147,10 zł netto`), limit JDG 250% (`20 321,30 zł netto`).
  - Precyzyjne rozdzielenie `81,5%` matki oraz `70%` dla 9 tygodni drugiego rodzica.
  - Nowy art. 180² KP (`ceil(dni / 7)`), łączenie rodzicielskiego z pracą na 1/2 etatu (art. 182¹ᶠ KP), ustawa „Za życiem” (`65/67 tyg.` + `4 000 zł`).

### Slajd 5 — Kreator Kalkulatora Krok po Kroku & Planer M1–M12
- Interaktywny **8-krokowy formularz** (pytanie po pytaniu) z podsumowaniem na żywo i możliwością przełączenia na widok pełny.
- Natychmiastowe porównanie wariantów **81,5% vs 100%/70%**, kaskada wypłat M1–M12 i eksport raportu.
- **Przeniesienie danych 1 kliknięciem do wniosku ZAM** — rodzic nie przepisuje danych dwa razy.

### Slajd 6 — Kreator Wniosku ZUS ZAM + Gotowa Kartka A4 do Druku
- **6-krokowy kreator** nowego, skonsolidowanego druku **ZUS ZAM** (zastępującego ZUR/ZAO od 24.10.2026).
- **Walidacja formalna na żywo:** sumy kontrolne PESEL (11 cyfr), NIP (10 cyfr), NRB (26 cyfr), automatyczny licznik żelaznego terminu **21 dni** oraz detektor długu JDG z natychmiastową spłatą Paybynet.
- **Podgląd urzędowej kartki A4 pod formularzem:** kratki PESEL/NIP, tabela KSI ZUS, dynamiczny wykaz załączników, kod QR weryfikacji, podpis Profilem Zaufanym (UPO + SHA-256) oraz czysty wydruk A4 / PDF (`@media print`).

### Slajd 7 — Empatyczne Centrum Wsparcia w Sytuacjach Trudnych
- Dedykowany moduł dla rodziców w kryzysie: wcześniaki (art. 180² KP), ustawa „Za życiem”, poronienie i strata dziecka, zasiłek pogrzebowy (`7 000 zł`), telefony pomocowe.
- **Doradca Prawny ZUS AI (`/asystent-ai`):** przełącznik **„Język prosty (Humanizer)”** vs **„Ścisła wykładnia prawna”** — 100% deterministyczny RAG offline.

### Slajd 8 — Strefa Jurora (`/jury-sandbox`) — Natychmiastowa Weryfikacja
- **6 oficjalnych kazusów ZUS** wbudowanych w aplikację — jedno kliknięcie przelicza sprawę silnikiem i porównuje wynik z orzeczeniem wzorcowym ZUS.
- Interaktywny **Dropzone PDF** do szybkiego testowania spraw przez Komisję Konkursową.

### Slajd 9 — Panel Konfiguracji Legislacyjnej ZUS (`/admin`)
- Urzędnik ZUS może w 10 sekund zaktualizować płacę minimalną, próg długu lub stawki bez angażowania zespołu IT.
- **Live Impact Simulator** natychmiast pokazuje wpływ zmiany prawa na budżet przykładowego rodzica, a każda zmiana trafia do rejestru audytowego (`audit_config_logs`).

### Slajd 10 — Korzyści dla ZUS i Podsumowanie
- **Dla ZUS:** spadek liczby błędnych wniosków i postępowań wyjaśniających (walidacja PESEL/NIP/21 dni/dług JDG przed złożeniem), gotowość na konsolidację druku ZAM.
- **Dla Rodziców:** spokój, pełna przewidywalność budżetu domowego i gotowy wniosek A4/eZUS w 2 minuty.
- **Linki:** Repozytorium GitHub + działające Live Demo + Kod QR do aplikacji.

---

## CZĘŚĆ 2: SCENARIUSZ FILMU DEMO (3 MINUTY)

- **0:00 – 0:25 | Strona główna (`/`)**
  - Pokaz oficjalnego interfejsu w stylu `zus.pl`, paska dostępności WCAG AAA (kontrast, powiększanie czcionki) i 3 prostych ścieżek dla rodzica.
- **0:25 – 1:10 | Kalkulator krok po kroku (`/kalkulator`)**
  - Szybkie przejście kroków (UoP, zarobki, wybór wcześniaka — art. 180² KP, wariant 81,5% vs 100/70%).
  - Pokaz porównania wypłat, 9 tygodni ojca w 70% i kliknięcie **„Wypełnij wniosek ZAM tymi danymi”**.
- **1:10 – 1:55 | Wniosek ZAM + Kartka A4 (`/e-uslugi`)**
  - Pokaz banera „Dane przeniesione z kalkulatora”, walidacji PESEL/NIP/NRB i licznika 21 dni.
  - Przewinięcie w dół do **realistycznej kartki A4** z kratkami PESEL/NIP, dynamiczną listą załączników i kodem QR.
  - Kliknięcie **Podpisz Profilem Zaufanym** → pojawia się pieczęć elektroniczna UPO na kartce A4 → kliknięcie **Drukuj / Zapisz jako PDF (A4)**.
  - Krótki rzut oka na zakładkę **eZUS/PUE** — spłata długu JDG 250 zł odblokowująca zasiłek.
- **1:55 – 2:25 | Strefa Jurora (`/jury-sandbox`)**
  - Kliknięcie **Kazusu 2 (wcześniak)** i **Kazusu 4 (dług JDG / łączenie z pracą)** — natychmiastowa zgodność 100% z wzorcem ZUS.
- **2:25 – 2:45 | Panel Administratora (`/admin`)**
  - Zmiana płacy minimalnej i pokaz **Live Impact Simulator** przeliczającego wpływ na zasiłek na żywo.
- **2:45 – 3:00 | Symulator Mobilny & Zakończenie**
  - Kliknięcie ikony telefonu w nagłówku (`MobileSimulatorModal`) — pokaz wersji mobilnej Expo i podsumowanie.

---

## CZĘŚĆ 3: INSTRUKCJA WDROŻENIA LIVE DEMO (VERCEL)

1. Zaloguj się na [vercel.com](https://vercel.com) i wybierz **Add New Project → Import Git Repository** (`theZabkka/przewodnik-rodzica-zus`).
2. W ustawieniach projektu ustaw:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `apps/web`
   - **Install Command:** `pnpm install`
   - **Build Command:** `cd ../.. && pnpm --filter @hacknation/web build`
3. Dodaj zmienne środowiskowe (Environment Variables) z pliku `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Kliknij **Deploy** — w ok. 60 sekund otrzymasz publiczny adres `https://przewodnik-rodzica-zus.vercel.app`.
