$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$outDir = "C:\Users\patry\.gemini\antigravity\scratch\przewodnik-rodzica-zus\video-demo\assets\voice"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$lines = @(
  @{ id = "v1"; start = 0.4;  text = "Anna za cztery miesiące rodzi. Pracuje na etacie, a jej partner Tomek prowadzi własną firmę. Nie wiedzą, ile dostaną zasiłku ani jakie wnioski złożyć." },
  @{ id = "v2"; start = 9.4;  text = "Zasiłkowy Przewodnik Rodzica porządkuje wszystko w jednym miejscu. Anna wybiera swoją sytuację, od ciąży po adopcję lub wsparcie w trudnych chwilach." },
  @{ id = "v3"; start = 19.3; text = "W zintegrowanym kalkulatorze Anna podaje umowę i pensję. Narzędzie obsługuje też adopcję, rodzinę zastępczą, wcześniaki oraz pracę na pół etatu." },
  @{ id = "v4"; start = 27.5; text = "Po chwili widzi konkretny wynik: pięć tysięcy dwieście siedemdziesiąt cztery złote miesięcznie i siedemdziesiąt sześć tysięcy pięćset trzydzieści dwa złote łącznie, wraz z porównaniem stawki osiemdziesiąt jeden i pół procent oraz dziewięciu tygodni dla Tomka." },
  @{ id = "v5"; start = 41.4; text = "Jednym kliknięciem Anna przenosi dane do wniosku ZAM z gotowym wydrukiem A4, a obok generuje wniosek o urlop dla pracodawcy. Tomek sprawdza składki JDG i akt urodzenia." },
  @{ id = "v6"; start = 53.4; text = "W razie wątpliwości, na przykład o zwolnienie w ciąży na zleceniu po dwóch miesiącach, serwerowy doradca jasno wyjaśnia dziewięćdziesiąt dni okresu wyczekiwania i podaje podstawę prawną." },
  @{ id = "v7"; start = 64.4; text = "W Strefie Jurora można wgrać przykładowy plik PDF, na przykład sprawę wcześniaka, i od razu sprawdzić wyliczenie dziesięciu tygodni uzupełniającego urlopu." },
  @{ id = "v8"; start = 74.4; text = "Cały przewodnik i kalkulator działają wygodnie także na telefonie, z responsywnym układem, lektorem i powiększaniem tekstu." },
  @{ id = "v9"; start = 82.4; text = "Zasiłkowy Przewodnik Przyszłego Rodzica. Prosto, empatycznie i zgodnie z prawem dwa tysiące dwadzieścia sześć." }
)

foreach ($item in $lines) {
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice("Microsoft Paulina Desktop")
  $synth.Rate = 1
  $synth.Volume = 100
  $wavPath = Join-Path $outDir "$($item.id).wav"
  $synth.SetOutputToWaveFile($wavPath)
  $synth.Speak($item.text)
  $synth.Dispose()
  Write-Output "Generated $($item.id).wav"
}
