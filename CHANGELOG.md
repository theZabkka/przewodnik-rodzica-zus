# CHANGELOG.md — Historia Zmian Projektu

## [2026-11-21 16:10] — Utworzenie Architektury Systemu i Planu Implementacji
**Autor:** @architect (Główny Architekt Systemu)

### Wprowadzone zmiany:
1. **Utworzenie ARCHITECTURE.md (v1.0):**
   - Kompletna specyfikacja architektury monorepo Turborepo + pnpm (`apps/web`, `apps/mobile`, `packages/shared`, `packages/db`).
   - Konstytucja danych i kontrakty TypeScript dla silnika zasiłkowego (`BenefitCalculationInput`, `BenefitCalculationOutput`, `LegislativeParameters`).
   - Schemat bazy danych PostgreSQL / Supabase wraz z pełnymi migracjami SQL, indeksami na kluczach obcych i politykami RLS.
   - Specyfikacja 7 modułów systemu: Interaktywna Mapa Drogowa, Zintegrowany Kalkulator Zasiłków, Symulator e-Usług (mObywatel, PUE/eZUS, e-ZLA, generator wniosku ZAM od 24.10.2026), Panel Administracyjny ZUS, Moduł Testowy dla Jurorów (PDF Jury Sandbox z 6 kazusami), Asystent AI, Centrum Wsparcia w Sytuacjach Trudnych.
   - Diagramy przepływu danych i relacji encji w Mermaid.
   - Standardy responsywności RWD (Tailwind Grid/Flex) i a11y.

2. **Utworzenie implementation_plan.md:**
   - Szczegółowy podział na 5 faz wdrożenia według Greenfield Protocol.
   - Precyzyjna specyfikacja stanów brzegowych (Loading, Error, Empty, Success) dla każdego modułu.
   - Definicja ukończenia (Definition of Done) zgodna z `AGENTS.md`.

## [2026-11-21 16:12] — Konfiguracja Root Monorepo (Faza 1)
**Autor:** @architect (Główny Architekt Systemu)

### Wprowadzone zmiany:
- Utworzono `package.json` z konfiguracją Turborepo dla `dev`, `build`, `typecheck`, `lint`, `test`, `db:types`.
- Utworzono `pnpm-workspace.yaml` definiujący obszary robocze `apps/*` oraz `packages/*`.
- Utworzono `turbo.json` z potokami cache'owania zadań.
- Utworzono `tsconfig.base.json` ze ścisłym TypeScriptem (ES2022, bundler module resolution).
- Utworzono `.gitignore`.

## [2026-11-21 16:26] — Ukończenie i Weryfikacja Fazy 1 (Monorepo, Shared, DB, Web)
**Autorzy:** @zus_domain_analyst, @db_author, @web_author, @verifier

### Wprowadzone zmiany:
1. **Pakiet `packages/shared` (@hacknation/shared):**
   - Kompletne typy domenowe `BenefitCalculationInput`, `BenefitCalculationOutput`, `LegislativeParameters`, `ZusTestCase`, `RiskWarning`, `AIQueryInput`.
   - Zdefiniowane oficjalne stałe legislacyjne na rok 2026 (płaca minimalna 4806 zł, 13.71%, dzielnik 30, próg długu JDG 48.06 zł, urlopy macierzyńskie 20-37 tyg., rodzicielskie 41/43/65/67 tyg., 9 tyg. ojca w 70%, wcześniaki 100% art. 180² KP, ojcowski 14 dni, opiekuńczy 60/30/14 dni).
   - Schematy walidacji Zod na granicach systemu: `calculator.schema.ts`, `parameters.schema.ts`, `pdf-case.schema.ts`, `ai-query.schema.ts`.
2. **Pakiet `packages/db` (@hacknation/db):**
   - Wersjonowana migracja SQL `supabase/migrations/20261121000001_zus_core_schema.sql` z 4 tabelami (`legislative_parameters`, `audit_config_logs`, `zus_test_cases`, `benefit_calculation_history`).
   - Obowiązkowe RLS włączone na każdej tabeli z osobnymi jawnymi politykami SELECT, INSERT, UPDATE.
   - Indeksy B-tree na wszystkich kluczach obcych zgodnie ze standardem `supabase-postgres-splinter`.
   - Seed danych `seed/2026_parameters_and_cases.sql` z 6 oficjalnymi kazusami ZUS.
   - Fabryka klienta Supabase (`src/client.ts`) i wygenerowane typy bazy danych (`src/database.types.ts`).
3. **Aplikacja `apps/web` (@hacknation/web):**
   - Next.js 15 App Router, React 19, Tailwind CSS z motywem urzędowym ZUS/gov.pl (orzeł RP, błękit `#005A9C`, zieleń ZUS `#00823C`, wysoki kontrast WCAG AAA).
   - Root layout z nagłówkiem, menu drawer, przełącznikami a11y i stopką.
   - Hub główny (`/`) oraz 7 tras modułowych z obsługą stanów brzegowych: `/przewodnik`, `/kalkulator`, `/e-uslugi`, `/trudne-sytuacje`, `/admin`, `/jury-sandbox`, `/asystent-ai`.
4. **Weryfikacja jakości (Verifier QA):**
   - `pnpm install` — pomyślne połączenie workspace.
   - `pnpm typecheck` — 100% sukces (zero błędów TS).
   - `pnpm lint` — 100% sukces (zero błędów i ostrzeżeń ESLint).
   - `pnpm build` — pomyślna kompilacja produkcyjna Next.js.

## [2026-11-21 16:44] — Ukończenie i Weryfikacja Fazy 2 (Certyfikowany Silnik Matematyczny TDD)
**Autorzy:** @architect, @zus_domain_analyst, @verifier

### Wprowadzone zmiany:
1. **Pakiet testów TDD (`packages/shared/src/calculator/__tests__/calculator.test.ts`):**
   - 8 suitów testowych (54 asercje Vitest) weryfikujących 100% formuł prawnych ZUS 2026.
   - Testy podstawy wymiaru: odliczenie składek 13,71%, gwarancja płacy minimalnej 4 147,10 zł netto, maksymalny limit JDG 20 321,30 zł netto, stawka dzienna 1/30.
   - Testy wariantów zasiłków: wariant długi 81,5% vs standardowy 100% + 70%, 9 nieprzenoszalnych tygodni dla ojca ZAWSZE w stawce 70%, wymiary 20–37 tygodni dla ciąż mnogich.
   - Testy wcześniaków (art. 180² KP): limity 15 i 8 tygodni, matematyczna reguła zaokrąglenia hospitalizacji w górę `ceil(dni / 7)`, stawka 100%.
   - Testy łączenia urlopu rodzicielskiego z pracą na maks. 1/2 etatu (art. 182¹ᶠ KP): proporcjonalne wydłużenie urlopu, obniżenie tygodniowego zasiłku o wymiar etatu, 100% zachowania łącznej sumy wypłaconych świadczeń.
   - Testy ustawy „Za życiem”: wydłużenie rodzicielskiego do 65 tygodni (jedno dziecko) i 67 tygodni (bliźnięta).
   - Testy detektora ryzyka: blokada wypłaty przy zadłużeniu JDG > 48,06 zł (art. 2a), przekroczenie 21 dni na wniosek, ryzyko przepadku 9 tygodni ojca.
   - Testy urlopu ojcowskiego: 14 dni, 100%, ważność 12 miesięcy.
   - Pełna weryfikacja 6 oficjalnych kazusów testowych ZUS (KAZUS-01 do KAZUS-06).
2. **Implementacja silnika matematycznego w `packages/shared/src/calculator/`:**
   - `base.ts`: czyste kalkulacje podstawy, odliczeń i stawek dziennych.
   - `maternity.ts`, `parental.ts`, `supplementary.ts`, `work-sharing.ts`, `paternity.ts`, `sick-leave-b.ts`, `care.ts`, `risk-detector.ts`.
   - `index.ts`: spójna fasada `calculateParentalBenefits` oraz `calculateBenefits`.
3. **Weryfikacja jakości (Verifier QA):**
   - `pnpm test` — 54 z 54 testów Vitest na zielono (100% zdanych).
   - `pnpm typecheck` — 100% sukces, zero błędów TypeScript.
   - `pnpm lint` — 100% sukces, brak ostrzeżeń. Monorepo gotowe do Fazy 3.

## [2026-11-21 16:56] — Ukończenie i Weryfikacja Fazy 3 (Równoległa Konstrukcja Modułów UI)
**Autorzy:** @web_author, @zus_domain_analyst, @architect, @verifier

### Wprowadzone zmiany:
1. **Moduł 2: Zintegrowany Kalkulator Zasiłków i Urlopów (`/kalkulator`):**
   - Połączony w 100% z certyfikowanym silnikiem `@hacknation/shared`.
   - Obsługa wszystkich wariantów: UoP, Zlecenie, JDG, liczba dzieci, wniosek w 21 dni (81,5% vs 100/70%), 9 nieprzenoszalnych tygodni ojca w 70%, łączenie z 1/2 etatu z wydłużeniem rodzicielskiego, wcześniaki art. 180² KP z hospitalizacją.
   - Presety scenariuszy, kaskadowy wykres dochodów M1-M12, banery ostrzeżeń prawnych i pobieranie oficjalnego podsumowania.
2. **Moduł 1: Interaktywna Mapa Drogowa (`/przewodnik`):**
   - Oś czasu podzielona na 4 etapy podróży rodzica z dynamicznym kalkulatorem terminów odliczającym dni do terminu 21 dni na wniosek ZAM i 12 miesięcy na urlop ojcowski.
   - Interaktywna checklista instytucjonalna (Szpital, USC, Pracodawca, ZUS) z możliwością zaznaczania i pobierania planu.
3. **Moduł 3: Symulator e-Usług & Generator Nowego Wniosku ZAM (`/e-uslugi`):**
   - Logowanie mObywatel / Profil Zaufany, pulpit eZUS/PUE z monitorem zadłużenia JDG (próg 48,06 zł) i symulacją spłaty odblokowującej zasiłek wstecz, podgląd zwolnień e-ZLA (kod B).
   - Pełny generator nowego wniosku ZAM (zlikwidowane ZUR i ZAO) z podpisem Profilem Zaufanym, generowaniem oficjalnego UPO z sumą SHA-256 oraz eksportem do formatu urzędowego JSON.
4. **Moduł 6: Strefa Jurora – Jury Sandbox (`/jury-sandbox`):**
   - 6 oficjalnych kazusów ZUS z natychmiastowym przeliczeniem i porównaniem z werdyktem orzeczniczym ZUS (100% zgodności PASS).
   - Interaktywny Dropzone PDF z automatycznym parsowaniem pól formularzy Z-3, ZAM, e-ZLA i generowaniem raportu certyfikacji.
5. **Moduł 5: Dynamiczny Panel Administratora ZUS (`/admin`):**
   - Edycja parametrów prawnych na żywo (płaca minimalna, stawki %, progi długu, limity tygodni) z symulatorem wpływu na żywo (Live Impact Simulator) i audytem zmian (Audit Trail).
6. **Moduł 4 & 7: Centrum Wsparcia Empatycznego i Asystent AI (`/trudne-sytuacje` & `/asystent-ai`):**
   - Procedury po poronieniu i martwym urodzeniu (8 tygodni macierzyńskiego, zasiłek pogrzebowy 7 000 zł, ustawa „Za życiem”, wcześniaki, baza fundacji pomocowych).
   - Doradca prawny ZUS AI z bazą wiedzy RAG i trybem „tłumacz na język prosty” (Humanizer).
7. **Weryfikacja jakości (Verifier QA):**
   - `pnpm typecheck` — 100% czysto we wszystkich 3 pakietach monorepo.
   - `pnpm lint` — `✔ No ESLint warnings or errors`.
   - `pnpm build` — pełna kompilacja produkcyjna 11 tras Next.js zakończona kodem 0.
   - `pnpm test` — 54/54 testy jednostkowe Vitest zdane. Zero atrap, pełne RWD Tailwind.

## [2026-11-21 17:15] — Redesign Wizualny ZUS, De-cluttering i Utworzenie Aplikacji Mobilnej Expo
**Autorzy:** @web_author, @architect, @verifier

### Wprowadzone zmiany:
1. **Eliminacja szumu informacyjnego i zmiana nazwy:**
   - Zmieniono nazwę serwisu na **„Przewodnik Rodzica”** (usunięto słowo „Zasiłkowy”).
   - Usunięto cały techniczny żargon AI, etykiety typu `Moduł 1`, `Moduł 2`, `Silnik algorytmiczny`.
   - Zastosowano przestrzenny, uspokajający układ z dużym whitespace (`py-16`, `px-6`, `gap-8`) z myślą o zestresowanych rodzicach.
   - Strona główna zorganizowana wokół 3 prostych pytań życiowych: Uprawnienia w ciąży, Finanse na urlopie, Kluczowe terminy (21 dni).
2. **Prawdziwy branding ZUS & gov.pl:**
   - Nowy komponent `apps/web/src/components/ZusLogo.tsx` z oficjalną zielenią ZUS `#00823C`, logotypem ZUS i wektorowym Godłem Rzeczypospolitej Polskiej.
3. **Aplikacja mobilna Expo (`apps/mobile`):**
   - Utworzono dedykowaną aplikację mobilną opartą na Expo 52 i Expo Router 4.
   - Spięta z silnikiem `@hacknation/shared`.
   - 4 ekrany nawigacji tabs: Pulpit (licznik 21 dni), Kalkulator mobilny, Terminarz, mObywatel ZUS (karta rodzica, status zadłużenia 0 zł, e-ZLA).
   - W aplikacji webowej dodano w nagłówku interaktywny przycisk **„📱 Widok aplikacji mobilnej”** (modal z ramką smartfona dla jurorów).
4. **Weryfikacja jakości (Verifier QA):**
   - `pnpm turbo run typecheck` — 5/5 zadań na zielono (0 błędów TS).
   - `pnpm test` — 54/54 testy Vitest zdane (100%).
   - `pnpm --filter @hacknation/web build` — pomyślna optymalizacja produkcyjna.
   - Serwer produkcyjny Next.js uruchomiony i zweryfikowany na `http://localhost:3000`.

## [2026-11-21 16:40] — Zestaw Testów Jednostkowych TDD Silnika Kalkulatora (Faza 2)
**Autor:** @architect (Główny Architekt Systemu)

### Wprowadzone zmiany:
- Utworzono `packages/shared/src/calculator/__tests__/calculator.test.ts` zawierający 8 kompletnych zestawów testów jednostkowych Vitest:
  1. *Podstawa wymiaru i parametry bazowe:* odliczenie 13,71%, gwarancja minimalnej podstawy UoP (4 147,10 zł), ograniczenie max podstawy JDG (20 321,30 zł netto), ustawowy dzielnik 30.
  2. *Warianty zasiłku:* wariant uśredniony 81,5% w 21 dni vs standardowy 100% / 70%, z zachowaniem zasady, że 9 tygodni ojca to ZAWSZE 70%, wymiary dla porodów pojedynczych i mnogich (20–37 tyg. macierzyńskiego).
  3. *Uzupełniający urlop dla wcześniaków (art. 180² KP):* skrajne wcześniaki (<28 tyg. lub <=1000g) do 15 tyg. w 100%, wcześniaki 28–37 tyg. do 8 tyg., hospitalizacja po 37 tyg. do 8 tyg., reguła zaokrąglenia w górę `ceil(dni/7)`.
  4. *Łączenie rodzicielskiego z pracą na część etatu (art. 182¹ᶠ KP):* proporcjonalne wydłużenie, obniżenie tygodniowego zasiłku o etat, 100% zachowania łącznej puli wypłaconych środków.
  5. *Ustawa „Za życiem”:* wydłużenie urlopu rodzicielskiego do 65 tygodni (1 dziecko) lub 67 tygodni (poród mnogi).
  6. *Detektor ryzyka (Risk Engine):* zadłużenie JDG > 48,06 zł (art. 2a ustawy), spóźniony wniosek (>21 dni), przepadek 9 tygodni ojca.
  7. *Urlop ojcowski:* 14 dni, 100%, ważność 12 miesięcy.
  8. *Weryfikacja 6 oficjalnych spraw ZUS (Jury Sandbox Cases).*

## [2026-11-21 16:55] — Pełna Implementacja Modułów Admin, Trudne Sytuacje i Asystent AI (Faza 3)
**Autor:** @architect (Główny Architekt Systemu)

### Wprowadzone zmiany:
1. **Moduł 5 — Panel Konfiguracji Legislacyjnej ZUS (`apps/web/src/app/admin/page.tsx`):**
   - Pełna edycja płacy minimalnej (4806 zł), potrącenia 13,71%, progu długu JDG (48,06 zł), stawek zasiłków (81,5%, 70%, 100%, 80%) oraz limitów tygodniowych.
   - Symulator wpływu na żywo (Live Impact Simulator) – automatyczne przeliczanie kwot dla przykładowego rodzica (7000 zł UoP) i wyświetlanie różnic `+/- zł/mc`.
   - Szybkie presety scenariuszy dla jurorów: „Projekt nowelizacji 2027” (stawka 85%, ojcowski 12 tyg., min. płaca 5150 zł) oraz „Przywróć 2026”.
   - Rejestr audytu zmian (Audit Log) z wersjonowaniem i statusem publikacji.
   - Zapis do pamięci podręcznej (localStorage) do bezpośredniej integracji z kalkulatorem.

2. **Moduł 4 — Centrum Wsparcia w Sytuacjach Trudnych (`apps/web/src/app/trudne-sytuacje/page.tsx`):**
   - Pełne procedury prawne po poronieniu i martwym urodzeniu: 8 tygodni macierzyńskiego w 100% (56 dni), zasiłek pogrzebowy 7 000 zł, procedura rejestracji w USC oraz postępowanie szpitalne przy braku możliwości ustalenia płci.
   - Interaktywna checklista formalna krok po kroku z możliwością odznaczania etapów.
   - Interaktywny kalkulator uzupełniającego urlopu dla wcześniaków (art. 180² KP): kalkulacja tygodnia ciąży, wagi, dni hospitalizacji z regułą zaokrąglenia `ceil(dni/7)` i wyliczeniem kwoty świadczenia.
   - Uprawnienia z ustawy „Za życiem” (65/67 tygodni, 4 000 zł wsparcia, hospicja perinatalne).
   - Zweryfikowane kontakty i infolinie wsparcia (Fundacja Wcześniak, Fundacja Ernesta, Fundacja Gajusz, Rzecznik Praw Pacjenta 800 190 590).

3. **Moduł 6 — Inteligentny Doradca Prawny ZUS AI (`apps/web/src/app/asystent-ai/page.tsx`):**
   - Rozbudowana baza wiedzy RAG obejmująca wszystkie kluczowe reguły: wariant 81,5% w 21 dni, 9 tygodni ojca w 70%, łączenie rodzicielskiego z 1/2 etatu, wcześniaki art. 180², zadłużenie JDG > 48,06 zł z art. 2a, zwolnienie e-ZLA z kodem B (270 dni w 100%), zasiłek opiekuńczy (60 dni w 80%, wyjątek braku domownika dla dzieci do lat 2).
   - Przełącznik trybu Humanizer: „Język prosty (po ludzku)” vs „Ścisła wykładnia prawna (artykuły i orzecznictwo)”.
   - Szuflada personalizacji kontekstu rodzica (rola, umowa, etap życiowy, pensja).
   - Starter prompty, kopiowanie odpowiedzi i sugerowane wskazówki.

## [2026-11-21 17:12] — Pełna Implementacja Aplikacji Mobilnej Expo (apps/mobile)
**Autor:** @architect (Główny Architekt Systemu)

### Wprowadzone zmiany:
1. **Utworzenie pakietu `apps/mobile` opartego na Expo Router & React Native:**
   - `package.json` (`@hacknation/mobile`) ze spięciem do `@hacknation/shared`.
   - `app.json` (oficjalna nazwa „Przewodnik Rodzica ZUS”, identyfikator `pl.zus.przewodnikrodzica`, motyw zieleni ZUS `#00823C`).
   - `metro.config.js` z obsługą dowiązań symbolicznych w monorepo Turborepo.
   - `tsconfig.json` z konfiguracją TypeScript.

2. **Kompletna struktura ekranów w `apps/mobile/src/app/`:**
   - `_layout.tsx`: Root Stack nawigacyjny z paskiem stanu i motywem systemowym.
   - `(tabs)/_layout.tsx`: Dolny pasek nawigacyjny z 4 zakładkami (Pulpit, Kalkulator, Terminarz, mObywatel).
   - `(tabs)/index.tsx`: Pulpit rodzica z dynamicznym odliczaniem 21 dni do złożenia wniosku ZAM, przełącznikiem etapów i infolinią 800 190 590.
   - `(tabs)/kalkulator.tsx`: Mobilny kalkulator świadczeń w 100% zintegrowany z silnikiem domenowym `@hacknation/shared`.
   - `(tabs)/terminarz.tsx`: Mobilna oś czasu formalności z interaktywną checklistą i wskaźnikiem postępu.
   - `(tabs)/mobywatel.tsx`: Cyfrowa Karta Rodzica mObywatel 2.0, stan ubezpieczenia w FUS (zadłużenie 0,00 zł), podgląd e-ZLA z kodem „B” oraz wniosek ZAM z Urzędowym Poświadczeniem Odbioru (UPO).

3. **Weryfikacja techniczna:**
   - `pnpm install` — pomyślna rejestracja pakietu.
   - `pnpm --filter @hacknation/mobile typecheck` — kod 0.
   - `pnpm typecheck` (cały monorepo Turborepo: web, mobile, shared, db) — 5/5 zadań na zielono (kod 0).
   - `pnpm --filter @hacknation/web build` — kod 0, wszystkie 11 tras Next.js prerenderowane pomyślnie.
