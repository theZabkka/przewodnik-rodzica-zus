# Przewodnik Rodzica — Ekosystem ZUS (HackNation 2026)

> Oficjalny system wsparcia przyszłych i obecnych rodziców w planowaniu urlopów i świadczeń z ubezpieczeń społecznych. Zwycięska koncepcja i w pełni działający MVP na wyzwanie Ministerstwa Cyfryzacji i Zakładu Ubezpieczeń Społecznych.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![React Native / Expo](https://img.shields.io/badge/Expo-52-darkgreen.svg)](https://expo.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-54%20Tests%20Passing-brightgreen.svg)](https://vitest.dev/)
[![WCAG AAA](https://img.shields.io/badge/Accessibility-WCAG%20AAA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🌟 O projekcie

W polskim systemie prawnym rodzicielstwa zaszły fundamentalne zmiany (dyrektywa unijna *Work-Life Balance*, 9 nieprzenoszalnych tygodni rodzicielskiego dla ojca, uśredniony wariant 81,5% vs 100%/70%, łączenie z 1/2 etatu z proporcjonalnym wydłużeniem, uzupełniający urlop dla wcześniaków art. 180² KP).

**Przewodnik Rodzica** eliminuje asymetrię informacji i stres rodziców:
- Prowadzi rodzica za rękę przez **4 etapy życia** (ciąża, narodziny, urlopy, powrót do pracy) w prostym, empatycznym języku,
- Posiada **certyfikowany silnik matematyczny** pokrywający 100% formuł ZUS,
- Symuluje środowisko **eZUS / PUE, mObywatela** oraz nowy skonsolidowany **wniosek ZAM** z Urzędowym Poświadczeniem Odbioru (UPO),
- Zapewnia **Strefę Jurora (Jury Sandbox)** z 6 oficjalnymi kazusami ZUS i analizą plików PDF,
- Zawiera dedykowaną aplikację mobilną **Expo (React Native)**.

---

## 🚀 Szybki start (Quick Start)

### 1. Klonowanie i instalacja
```bash
git clone <adres-repozytorium>
cd PrzewodnikRodzica-ZUS
pnpm install
```

### 2. Uruchomienie aplikacji webowej (Next.js 15)
```bash
pnpm dev
```
Otwórz przeglądarkę na: **[http://localhost:3000](http://localhost:3000)**.

### 3. Uruchomienie aplikacji mobilnej (Expo Go)
```bash
pnpm mobile:start
```
*(lub `pnpm mobile:tunnel` dla połączenia przez internet)*.

### 4. Uruchomienie testów jednostkowych (54 testy)
```bash
pnpm test
```

---

## 📂 Struktura Monorepo

- **`apps/web`**: Główna aplikacja webowa w architekturze Next.js 15 App Router i Tailwind CSS z autentycznym brandingiem ZUS i symulatorem mobilnym.
- **`apps/mobile`**: Aplikacja mobilna w Expo 52 i Expo Router 4 (Pulpit, Kalkulator, Terminarz, mObywatel).
- **`packages/shared`**: Niezależny, czysty silnik matematyczny w TypeScript, schematy Zod i stałe prawne 2026.
- **`packages/db`**: Migracje SQL bazy danych Supabase z włączonym Row Level Security (RLS) i indeksami kluczy obcych.
- **`docs/`**: Oryginalne materiały źródłowe wyzwania ZUS, kompendium prawne i zrzuty ekranu.

---

## 📖 Pełna dokumentacja

- 📘 [ONBOARDING.md](./ONBOARDING.md) — instrukcja dla nowych deweloperów krok po kroku
- 🏛️ [ARCHITECTURE.md](./ARCHITECTURE.md) — pełna specyfikacja architektury systemu
- ⚖️ [ZUS_DOMAIN_RULES.md](./ZUS_DOMAIN_RULES.md) — reguły matematyczne i artykuły Kodeksu Pracy
- 📋 [ZUS_CHALLENGE_SPEC.md](./ZUS_CHALLENGE_SPEC.md) — specyfikacja konkursowa i kryteria oceny

---

## 🔌 Interfejs REST API

Aplikacja udostępnia warstwę REST API (Next.js App Router) opartą na wspólnym, deterministycznym silniku `@hacknation/shared`:

- `GET /api/calculate` — dokumentacja i przykładowy payload JSON dla kalkulatora świadczeń
- `POST /api/calculate` — deterministyczne obliczenie wymiaru urlopów, stawek procentowych (100% / 81,5% / 70%), kwot zasiłku i ostrzeżeń prawnych (2026)
- `GET /api/parameters` — aktualne parametry legislacyjne 2026 (płaca minimalna 4806 zł, próg zadłużenia 1%, stawki procentowe, wymiary urlopów)

---

## 🤖 Zakres wykorzystania sztucznej inteligencji (AI)

Zgodnie z wymogiem formalnym konkursu HackNation 2026 wyraźnie rozdzielamy warstwę deterministyczną od wsparcia AI:

- **100% deterministyczny silnik prawny (bez AI):** Kalkulator zasiłków (`/kalkulator` oraz `POST /api/calculate`), walidacja PESEL/NIP/NRB i kreator wniosku ZAM oraz wniosku o urlop do pracodawcy (`/e-uslugi`), Panel Administracyjny (`/admin`) i weryfikacja spraw w Strefie Jurora (`/jury-sandbox`). Wszystkie obliczenia są powtarzalne i pokryte testami jednostkowymi Vitest.
- **Funkcjonalności wspierane przez AI:** Asystent Rodzica (`/asystent-ai` — dopasowanie wyjaśnień do kontekstu rodzica i tłumaczenie przepisów na prosty język) oraz proces twórczy (generowanie spójnych ilustracji edukacyjnych, projektowanie interfejsu i prototypowanie wideo demo w HyperFrames).
