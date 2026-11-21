# ONBOARDING.md — Przewodnik Wdrożeniowy dla Zespołu Deweloperskiego
**Projekt:** Przewodnik Rodzica (ZUS / HackNation 2026)  
**Status projektu:** Gotowy MVP z certyfikowanym silnikiem TDD, aplikacją webową i mobilną  
**Data wydania paczki:** 21 listopada 2026 r.

Witaj w zespole projektu **„Przewodnik Rodzica”**! Ten dokument to kompletna instrukcja, która przeprowadzi Cię przez uruchomienie całego środowiska, architekturę kodu oraz standardy inżynieryjne w mniej niż 5 minut.

---

## 1. O PROJEKCIE: CO BUDUJEMY I DLACZEGO?

### Problem Obywatela i ZUS
W polskim prawie rodzicielskim zaszły rewolucyjne zmiany (unijna dyrektywa *Work-Life Balance*, 9 nieprzenoszalnych tygodni dla ojca, uśredniony wariant 81,5% vs 100%/70%, łączenie z 1/2 etatu z proporcjonalnym wydłużeniem, nowe przepisy dla wcześniaków art. 180² KP z 2026 roku).

Rodzice gubią się w przepisach, składają wnioski po terminie (krytyczny termin **21 dni** po porodzie), a przedsiębiorcy (JDG) tracą świadczenia przez drobne zadłużenia składkowe przekraczające **48,06 zł** (1% płacy minimalnej). Generuje to tysiące postępowań odmownych, odwołań sądowych i gigantyczny stres.

### Nasze Rozwiązanie
**„Przewodnik Rodzica”** to oficjalny, zintegrowany ekosystem cyfrowy (Web + Mobile Expo + Supabase + Certyfikowany Silnik Matematyczny):
1. **Prowadzi rodzica krok po kroku** przez 4 etapy życia (ciąża, narodziny, urlopy, powrót do pracy) bez urzędowego żargonu i szumu informacyjnego.
2. **Kalkuluje świadczenia co do grosza** z uwzględnieniem 100% zawiłości prawnych (porównanie wariantów, praca na 1/2 etatu, wcześniaki).
3. **Symuluje e-usługi publiczne:** mObywatel, konto eZUS/PUE, kontrolę długu JDG z natychmiastową spłatą, rejestr e-ZLA (kod B) oraz generator nowego skonsolidowanego wniosku **ZAM** (zlikwidowane ZUR i ZAO) z Urzędowym Poświadczeniem Odbioru (UPO).
4. **Zapewnia dedykowaną strefę dla Jurorów (Jury Sandbox):** natychmiastowe przeliczenie 6 oficjalnych spraw testowych ZUS oraz Dropzone z analizą formularzy PDF.
5. **Daje ZUS panel administracyjny:** dynamiczna zmiana parametrów legislacyjnych w czasie rzeczywistym bez dotykania kodu.

---

## 2. WYMAGANIA SYSTEMOWE

Przed rozpoczęciem upewnij się, że masz zainstalowane:
- **Node.js:** w wersji `>= 20.x` (zalecana v22 LTS) — sprawdź: `node -v`
- **pnpm:** w wersji `>= 9.x` (zalecana v10/v12) — sprawdź: `pnpm -v`
  * Jeśli nie masz pnpm: zainstaluj globalnie poleceniem: `npm install -g pnpm`
- **Git:** zainstalowany i dostępny w PATH
- *(Opcjonalnie dla aplikacji mobilnej):* aplikacja **Expo Go** na Twoim smartfonie (iOS App Store lub Google Play).

---

## 3. SZYBKI START W 3 KROKACH (QUICK START)

### Krok 1: Instalacja zależności
W głównym katalogu repozytorium wykonaj:
```bash
pnpm install
```
*Wszystkie pakiety monorepo (`apps/web`, `apps/mobile`, `packages/shared`, `packages/db`) zostaną automatycznie połączone symlinkami.*

### Krok 2: Uruchomienie aplikacji webowej (Next.js 15)
```bash
pnpm dev
```
Otwórz przeglądarkę na: **[http://localhost:3000](http://localhost:3000)**.  
*Zobaczysz stronę główną z autentycznym logotypem ZUS, Godłem RP, kalkulatorem i symulatorem mobilnym.*

### Krok 3: Uruchomienie aplikacji mobilnej (Expo Go)
W nowym oknie terminala wykonaj:
```bash
pnpm mobile:start
```
*Jeśli Twój telefon i komputer są w różnych sieciach (np. dane komórkowe LTE), uruchom:*
```bash
pnpm mobile:tunnel
```
Zeskanuj wyświetlony kod QR aparatem (iOS) lub aplikacją Expo Go (Android).

---

## 4. ARCHITEKTURA I STRUKTURA KATALOGÓW

Projekt jest monorepo zarządzanym przez **Turborepo** i **pnpm workspaces**:

```
PrzewodnikRodzica-ZUS/
├── apps/
│   ├── web/                    # Główna aplikacja webowa (Next.js 15, React 19, Tailwind CSS)
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router (11 tras statycznie zoptymalizowanych)
│   │   │   │   ├── page.tsx            # Strona główna (3 pytania życiowe rodzica)
│   │   │   │   ├── kalkulator/         # Zintegrowany kalkulator świadczeń i urlopów
│   │   │   │   ├── przewodnik/         # Interaktywna mapa drogowa i terminarz 21 dni
│   │   │   │   ├── e-uslugi/           # Symulator mObywatel, eZUS/PUE, generator ZAM
│   │   │   │   ├── jury-sandbox/       # Strefa testowa jurorów (6 kazusów ZUS + PDF)
│   │   │   │   ├── admin/              # Panel administratora ZUS (Live Impact Simulator)
│   │   │   │   ├── trudne-sytuacje/    # Centrum wsparcia (poronienie, strata, Za życiem)
│   │   │   │   └── asystent-ai/        # Doradca prawny ZUS AI (RAG + tryb Humanizer)
│   │   │   └── components/     # Współdzielone klocki UI (ZusLogo, Header, MobileSimulator)
│   │   └── .env.local          # Klucze Supabase (wstępnie skonfigurowane)
│   │
│   └── mobile/                 # Natywna aplikacja mobilna (Expo 52, Expo Router 4, React Native)
│       └── src/app/
│           ├── _layout.tsx     # Root stack & motyw zieleni ZUS (#00823C)
│           └── (tabs)/         # 4 główne ekrany: Pulpit, Kalkulator, Terminarz, mObywatel
│
├── packages/
│   ├── shared/                 # SINGLE SOURCE OF TRUTH (Czysty TypeScript, Zero zależności od UI)
│   │   ├── src/
│   │   │   ├── calculator/     # Certyfikowany silnik matematyczny (TDD, 100% reguł ZUS)
│   │   │   ├── constants/      # Oficjalne wskaźniki prawne 2026 i 6 kazusów testowych
│   │   │   ├── types/          # Ścisłe interfejsy TypeScript (I/O, parametry, ryzyka)
│   │   │   └── zod/            # Schematy walidacji Zod na wszystkich granicach wejścia
│   │   └── src/calculator/__tests__/  # 54 testy jednostkowe Vitest (100% zdanych)
│   │
│   └── db/                     # Baza danych Supabase / PostgreSQL
│       ├── supabase/migrations/# Wersjonowane pliki SQL z obowiązkowym RLS i indeksami FK
│       ├── seed/               # Dane startowe (parametry 2026, kazusy ZUS)
│       └── src/                # Fabryka klienta Supabase i wygenerowane typy TS
│
├── docs/                       # Kompletna dokumentacja merytoryczna i materiały ZUS
│   ├── materialy_zus/          # Oryginalne materiały wyzwania: Poradnik ZUS 2026, wyciągi z ustaw, załącznik docx
│   └── screenshots/            # Zrzuty ekranu z audytu wizualnego i testów E2E
│
├── ARCHITECTURE.md             # Kanoniczna specyfikacja architektury systemu
├── ZUS_CHALLENGE_SPEC.md       # Analiza wymagań formalnych, kryteriów oceny i formatu wideo/prezentacji
├── ZUS_DOMAIN_RULES.md         # Ekstrakcja wszystkich formuł matematycznych i artykułów prawnych ZUS
├── package.json                # Skrypty korzenia Turborepo
└── pnpm-workspace.yaml         # Definicja obszarów roboczych
```

---

## 5. KLUCZOWE KOMENDY DEWELOPERSKIE

Wszystkie polecenia uruchamiaj z poziomu głównego katalogu repozytorium:

| Polecenie | Co robi |
|---|---|
| `pnpm dev` | Uruchamia aplikację webową w trybie deweloperskim na `http://localhost:3000` |
| `pnpm build` | Buduje produkcyjne paczki wszystkich aplikacji i pakietów |
| `pnpm test` | Uruchamia pełny pakiet 54 testów jednostkowych Vitest w `packages/shared` |
| `pnpm typecheck` | Sprawdza poprawność typów TypeScript w całym monorepo (strict mode) |
| `pnpm lint` | Uruchamia linter ESLint we wszystkich pakietach |
| `pnpm mobile:start` | Uruchamia serwer Metro dla aplikacji mobilnej Expo Go |
| `pnpm mobile:tunnel` | Uruchamia Expo w tunelu internetowym (dla testów na telefonie poza Wi-Fi) |

---

## 6. NIEZMIENNIKI ARCHITEKTONICZNE (JAK PISAĆ KOD W TYM PROJEKCIE)

W projekcie obowiązują rygorystyczne standardy inżynieryjne:

1. **Zakaz atrap i pustych przycisków:** Każdy przycisk w UI musi wykonywać realną akcję (zmiana stanu, kalkulacja, pobranie pliku, filtracja danych).
2. **Single Source of Truth:** Cała logika matematyczna, stawki procentowe (81,5%, 70%, 100%) i formuły urlopowe znajdują się **wyłącznie** w `packages/shared/src/calculator/`. W aplikacjach `apps/web` i `apps/mobile` jedynie importujemy gotowe funkcje – **nigdy nie duplikujemy obliczeń w komponentach React!**
3. **Walidacja Zod:** Każde wejście danych (formularze, parametry URL, upload PDF) musi być walidowane schematami Zod z `packages/shared/src/zod/`.
4. **Sentence case:** Wszystkie polskie teksty w interfejsie piszemy w stylu sentence case (np. *„Złóż wniosek o zasiłek”*, nigdy *„ZŁÓŻ WNIOSEK O ZASIŁEK”*).
5. **Responsywność i Dostępność:** Stosujemy wyłącznie elastyczne siatki Tailwind (Flex/Grid z `gap`) bez sztywnych marginesów. Kolorystyka spełnia standard kontrastu **WCAG AAA** (biel, tło `#F8FAFC`, zieleń ZUS `#00823C`).

---

## 7. BAZA DANYCH (SUPABASE)

Projekt jest wstępnie spięty z bazą danych Supabase w chmurze (organizacja `theZabkka`). Klucze publiczne są zapisane w `.env.local` oraz `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL=https://uoxsgfxaimkwsasukkdh.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

Jeśli chcesz podpiąć nową instancję Supabase:
1. Zmień wartości w `.env.local`.
2. Zaaplikuj migrację SQL znajdującą się w `packages/db/supabase/migrations/20261121000001_zus_core_schema.sql`.
   * Migracja automatycznie tworzy tabele: `legislative_parameters`, `audit_config_logs`, `zus_test_cases`, `benefit_calculation_history` wraz z włączonym **RLS** i indeksami kluczy obcych.
3. Zaaplikuj plik zasilający (seed): `packages/db/seed/2026_parameters_and_cases.sql`.

---

## 8. ROZWIĄZYWANIE PROBLEMÓW (TROUBLESHOOTING)

### Port 3000 jest zajęty
Jeśli uruchomienie `pnpm dev` zgłasza konflikt portu, uruchom Next.js na alternatywnym porcie:
```bash
pnpm --filter @hacknation/web dev --port 3001
```

### Expo Go nie łączy się z telefonem
Jeśli po zeskanowaniu kodu QR aplikacja nie ładuje się na telefonie (np. sieć firmowa blokuje porty lokalne):
```bash
pnpm mobile:tunnel
```
*Tryb tunelu przekierowuje ruch przez serwery Expo i działa zawsze, nawet na danych komórkowych.*

### Czyszczenie pamięci podręcznej i ponowna kompilacja
Gdyby wystąpiły jakiekolwiek niespójności cache:
```bash
pnpm turbo clean
rm -rf apps/web/.next
pnpm build
```

---

## 9. KONTAKT I MATERIAŁY DODATKOWE
- Pełna specyfikacja architektoniczna: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Kompendium reguł prawnych ZUS: [ZUS_DOMAIN_RULES.md](./ZUS_DOMAIN_RULES.md)
- Wymagania formalne wyzwania: [ZUS_CHALLENGE_SPEC.md](./ZUS_CHALLENGE_SPEC.md)
- Oficjalne dokumenty PDF od ZUS: `docs/materialy_zus/`

Powodzenia w dalszym rozwoju projektu! W razie pytań zapoznaj się z plikiem `ARCHITECTURE.md` lub uruchom testy `pnpm test`.
