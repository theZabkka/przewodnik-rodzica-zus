import { GlossaryTerm } from '../types';

/**
 * Oficjalny Słownik Trudnych Słów ZUS (Standard Prostej Polszczyzny)
 * Tłumaczy urzędowy język ZUS na zrozumiały język rodzica.
 */
export const ZUS_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'podstawa-wymiaru',
    term: 'Podstawa wymiaru zasiłku',
    plainTitle: 'Twoja średnia pensja, od której ZUS liczy przelew',
    shortExplanation:
      'To kwota Twoich średnich zarobków z ostatnich 12 miesięcy, pomniejszona o 13,71% składek społecznych. To od tej kwoty ZUS wylicza Twoje 81,5%, 100% lub 70%.',
    detailedExplanation:
      'Gdy zarabiasz 7 000 zł brutto na umowie o pracę, ZUS odejmuje 13,71% (składki emerytalne, rentowe i chorobowe płacone przez Ciebie). Zostaje 6 040,30 zł netto podstawy. Jeśli wybrałeś stawkę 81,5%, Twój miesięczny zasiłek wyniesie ok. 4 922,84 zł.',
    legalCitation: 'Art. 36 i 3 ust. 3 ustawy zasiłkowej',
    category: 'finanse',
    tags: ['pensja', 'brutto', 'netto', '13.71%', 'zarobki'],
  },
  {
    id: 'wariant-jednolity-815',
    term: 'Wariant jednolity (stawka 81,5%)',
    plainTitle: 'Równa pensja przez cały rok opieki nad maluchem',
    shortExplanation:
      'Wybierasz jedną, stałą stawkę 81,5% za cały okres urlopu macierzyńskiego i rodzicielskiego (razem 52 tygodnie). Warunek: musisz złożyć wniosek ZAM w ciągu 21 dni od porodu.',
    detailedExplanation:
      'Dzięki temu w każdym miesiącu dostajesz dokładnie taki sam przelew z ZUS (lub od pracodawcy). Unikasz sytuacji, gdzie przez pierwsze pół roku masz 100%, a potem nagle wypłata spada do 70%. Wyjątek: 9 tygodni zarezerwowanych dla taty jest zawsze płatne 70%.',
    legalCitation: 'Art. 30a ustawy zasiłkowej',
    category: 'finanse',
    tags: ['81.5%', '21 dni', 'wniosek', 'średnia'],
  },
  {
    id: 'wariant-standardowy-100-70',
    term: 'Wariant standardowy (100% i 70%)',
    plainTitle: 'Więcej pieniędzy na początku, mniej w drugiej połowie roku',
    shortExplanation:
      'Przez pierwsze 20 tygodni (urlop macierzyński) otrzymujesz 100% podstawy zasiłku, a przez kolejne 32 tygodnie (rodzicielski) stawka spada do 70%.',
    detailedExplanation:
      'Ten wariant włącza się automatycznie, jeśli spóźnisz się ze złożeniem wniosku o stawkę 81,5% (po 21. dniu) lub gdy od razu wiesz, że po macierzyńskim chcesz szybko wrócić do pracy i nie wykorzystasz rodzicielskiego.',
    legalCitation: 'Art. 31 ustawy zasiłkowej',
    category: 'finanse',
    tags: ['100%', '70%', 'standard', 'macierzyński'],
  },
  {
    id: 'termin-zawity-21-dni',
    term: 'Termin 21 dni po porodzie',
    plainTitle: 'Żelazny termin na złożenie wniosku o równą stawkę 81,5%',
    shortExplanation:
      'Masz dokładnie 21 dni kalendarzowych od dnia narodzin dziecka na złożenie wniosku o zasiłek macierzyński i rodzicielski w pełnym wymiarze.',
    detailedExplanation:
      'Jeśli poród nastąpił 10 maja, 21 dni upływa 31 maja. Złożenie wniosku choćby 1 dzień później (np. 1 czerwca) bezpowrotnie odbiera prawo do stawki 81,5% – ZUS z mocy prawa wypłaci wtedy wariant 100% / 70%.',
    legalCitation: 'Art. 30a ust. 1 ustawy zasiłkowej',
    category: 'formalnosci',
    tags: ['21 dni', 'termin', 'spóźnienie', 'ZAM'],
  },
  {
    id: 'rezerwa-taty-9-tygodni',
    term: 'Niezbywalna część rodzicielskiego dla ojca (9 tygodni)',
    plainTitle: '9 dodatkowych tygodni płatnego wolnego wyłącznie dla taty',
    shortExplanation:
      'Zgodnie z unijną dyrektywą Work-Life Balance każdy z rodziców ma wyłączne prawo do 9 tygodni urlopu rodzicielskiego (płatnego 70%). Jeśli tata z nich nie skorzysta – te tygodnie przepadają.',
    detailedExplanation:
      'Mama nie może przepisać tych 9 tygodni na siebie. Łączna pula urlopu rodzicielskiego dla jednego dziecka to 41 tygodni: maksymalnie 32 tygodnie dla mamy i 9 tygodni wyłącznie dla taty (lub odwrotnie). Tata może wykorzystać te 9 tygodni jednocześnie z mamą lub po jej powrocie do pracy!',
    legalCitation: 'Art. 182¹ᵃ § 4 i § 5 Kodeksu pracy',
    category: 'urlopy',
    tags: ['tata', 'ojciec', '9 tygodni', 'WLB', 'dyrektywa'],
  },
  {
    id: 'urlop-ojcowski',
    term: 'Urlop ojcowski (14 dni)',
    plainTitle: '2 tygodnie 100% płatnego urlopu tylko dla taty (niezależne od rodzicielskiego)',
    shortExplanation:
      'Tata ma prawo do 14 dni kalendarzowych urlopu płatnego w 100%, z którego może skorzystać do ukończenia przez dziecko 12. miesiąca życia.',
    detailedExplanation:
      'Urlop ojcowski to zupełnie inne świadczenie niż 9 tygodni urlopu rodzicielskiego! Można go podzielić na maksymalnie 2 części (po min. 7 dni). Przysługuje nawet wtedy, gdy mama dziecka nie pracuje lub jest na zasiłku macierzyńskim.',
    legalCitation: 'Art. 182³ Kodeksu pracy',
    category: 'urlopy',
    tags: ['ojcowski', '14 dni', '100%', 'tata'],
  },
  {
    id: 'ezla-kod-b',
    term: 'Zwolnienie e-ZLA z kodem „B”',
    plainTitle: 'Zwolnienie lekarskie w ciąży płatne 100% przez 270 dni',
    shortExplanation:
      'Lekarz wpisuje na elektronicznym zwolnieniu literę „B”, co oznacza niezdolność do pracy przypadającą w okresie ciąży.',
    detailedExplanation:
      'Dzięki kodowi „B” za każdy dzień zwolnienia otrzymujesz 100% podstawy (zamiast standardowych 80%). Co ważne, limit dni chorobowego w ciąży wynosi aż 270 dni (zamiast zwykłych 182 dni). Pierwsze 33 dni w roku kalendarzowym płaci pracodawca, od 34. dnia – ZUS.',
    legalCitation: 'Art. 11 ust. 2 pkt 1 i art. 8 ustawy zasiłkowej',
    category: 'finanse',
    tags: ['ciąża', 'L4', '100%', '270 dni', 'kod B'],
  },
  {
    id: 'art-180-2-wczesniaki',
    term: 'Uzupełniający urlop macierzyński (art. 180² KP)',
    plainTitle: 'Dodatkowy płatny urlop dla rodziców wcześniaków i hospitalizowanych noworodków',
    shortExplanation:
      'Nowość w Kodeksie pracy: rodzice dzieci urodzonych przedwcześnie lub hospitalizowanych po porodzie otrzymują do 8 lub do 15 dodatkowych tygodni urlopu płatnego 100%.',
    detailedExplanation:
      'Urlop przysługuje w wymiarze tygodnia za każdy tydzień pobytu dziecka w szpitalu (zaokrąglając w górę). Dzieci urodzone przed 28. tc lub <1000g – do 15 tygodni; urodzone między 28. a 37. tc – do 8 tygodni.',
    legalCitation: 'Art. 180² Kodeksu pracy (Nowelizacja 2026)',
    category: 'szczegolne',
    tags: ['wcześniak', 'szpital', 'noworodek', '180 KP', '15 tygodni'],
  },
  {
    id: 'praca-pol-etatu',
    term: 'Łączenie urlopu rodzicielskiego z pracą (art. 182¹ᶠ KP)',
    plainTitle: 'Praca na pół etatu i jednoczesne pobieranie zasiłku + dłuższy urlop',
    shortExplanation:
      'Możesz pracować u swojego pracodawcy na maksymalnie 1/2 etatu podczas urlopu rodzicielskiego. Dostajesz pensję z pracy + proporcjonalny zasiłek, a urlop ulega wydłużeniu!',
    detailedExplanation:
      'Przykładowo: pracujesz na 1/2 etatu przez 16 tygodni rodzicielskiego. Urlop rodzicielski wydłuża się o 8 tygodni (16 * 0.5 = 8 tyg. pełnego płatnego wolnego po zakończeniu pracy). Żadne pieniądze z zasiłku nie przepadają!',
    legalCitation: 'Art. 182¹ᶠ Kodeksu pracy',
    category: 'urlopy',
    tags: ['pół etatu', 'praca', 'wydłużenie', 'dorabianie'],
  },
  {
    id: 'art-2a-dlug-jdg',
    term: 'Blokada wypłaty z powodu długu (art. 2a)',
    plainTitle: 'Nawet 50 zł zaległości w składkach JDG blokuje wypłatę zasiłku',
    shortExplanation:
      'Jeśli prowadzisz firmę (JDG) i masz zadłużenie w ZUS przekraczające 1% płacy minimalnej (48,06 zł w 2026 r.), ZUS z mocy prawa wstrzymuje wypłatę zasiłku macierzyńskiego.',
    detailedExplanation:
      'Na szczęście prawo daje 6 miesięcy na uregulowanie zaległości. Jeśli spłacisz dług wraz z odsetkami w ciągu 6 miesięcy od dnia porodu, ZUS wypłaci Ci wszystkie zaległe zasiłki z mocą wsteczną!',
    legalCitation: 'Art. 2a ustawy zasiłkowej',
    category: 'szczegolne',
    tags: ['JDG', 'dług', 'zadłużenie', 'firma', '48 zł'],
  },
  {
    id: 'okres-wyczekiwania',
    term: 'Okres wyczekiwania na zasiłek chorobowy',
    plainTitle: 'Czas ubezpieczenia potrzebny, by iść na płatne chorobowe',
    shortExplanation:
      'To minimalny czas opłacania składek: 30 dni nieprzerwanego ubezpieczenia przy umowie o pracę lub 90 dni przy działalności gospodarczej i zleceniu.',
    detailedExplanation:
      'Ważne: Okres wyczekiwania dotyczy WYŁĄCZNIE zasiłku chorobowego! Do zasiłku macierzyńskiego okres wyczekiwania w ogóle NIE obowiązuje – jeśli urodzisz dziecko choćby drugiego dnia nowej pracy, masz pełne prawo do zasiłku macierzyńskiego.',
    legalCitation: 'Art. 4 ustawy zasiłkowej',
    category: 'finanse',
    tags: ['wyczekiwanie', '30 dni', '90 dni', 'chorobowe'],
  },
  {
    id: 'wniosek-zam',
    term: 'Druk ZUS ZAM',
    plainTitle: 'Główny urzędowy wniosek o wypłatę zasiłku macierzyńskiego',
    shortExplanation:
      'Elektroniczny lub papierowy formularz składany do ZUS (lub przekazywany przez pracodawcę), w którym wskazujesz dane dziecka, numer konta bankowego i wybrany wariant (81,5% lub 100/70%).',
    detailedExplanation:
      'W naszym portalu możesz wygenerować gotowy wniosek ZAM z kodem kreskowym w formacie A4 do wydruku lub skopiować dane bezpośrednio do formularza na portalu PUE/eZUS.',
    legalCitation: 'Rozporządzenie MRPiPS w sprawie wniosków zasiłkowych',
    category: 'formalnosci',
    tags: ['ZAM', 'formularz', 'wniosek', 'eZUS', 'PUE'],
  },
  {
    id: 'druk-z3-z3a',
    term: 'Zaświadczenie płatnika składek (ZUS Z-3 / Z-3a)',
    plainTitle: 'Druk wystawiany przez pracodawcę z Twoimi zarobkami z 12 miesięcy',
    shortExplanation:
      'Dokument, który Twój szef musi wysłać do ZUS, aby potwierdzić Twoje zarobki i składki. Z-3 wypełnia pracodawca dla pracownika na etacie, a Z-3a zleceniodawca dla zleceniobiorcy.',
    detailedExplanation:
      'Bez druku Z-3 Zakład Ubezpieczeń Społecznych nie ma informacji o składnikach Twojej pensji (np. premiach kwartalnych czy nadgodzinach) i nie może wypłacić zasiłku. Pracodawca ma obowiązek wysłać go niezwłocznie po otrzymaniu Twojego wniosku ZAM.',
    legalCitation: 'Art. 61 ust. 1 ustawy zasiłkowej',
    category: 'formalnosci',
    tags: ['Z-3', 'Z-3a', 'pracodawca', 'zaświadczenie', 'premie'],
  },
  {
    id: 'ustawa-za-zyciem',
    term: 'Program „Za życiem” (wydłużony rodzicielski do 65 tyg.)',
    plainTitle: 'Wydłużony urlop rodzicielski dla rodziców ciężko chorych dzieci',
    shortExplanation:
      'Jeśli dziecko posiada zaświadczenie o ciężkim i nieodwracalnym upośledzeniu albo nieuleczalnej chorobie zagrażającej życiu, urlop rodzicielski zostaje wydłużony z 41 do aż 65 tygodni.',
    detailedExplanation:
      'W przypadku ciąży mnogiej wymiar rośnie do 67 tygodni. Rodzicom przysługuje także jednorazowe świadczenie 4 000 zł z ustawy „Za życiem” oraz wsparcie hospicjów perinatalnych i asystenta rodziny.',
    legalCitation: 'Art. 182¹ᵃ § 2 Kodeksu pracy w zw. z ustawą „Za życiem”',
    category: 'szczegolne',
    tags: ['Za życiem', '65 tygodni', 'niepełnosprawność', 'wada letalna'],
  },
];
