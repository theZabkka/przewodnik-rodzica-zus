$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$outDir = "C:\Users\patry\.gemini\antigravity\scratch\przewodnik-rodzica-zus\video-demo\assets\voice"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$lines = @(
  @{ id = "w1"; text = "Czego nauczyliśmy się, tworząc Zasiłkowy Przewodnik Rodzica? Po pierwsze: rodzic nie szuka nazwy świadczenia, tylko odpowiedzi na swoją sytuację życiową. Po drugie: najwięcej problemów bierze się z terminów i formalności, takich jak dwadzieścia jeden dni na wniosek ZAM czy dziewięć tygodni taty. Po trzecie: wcześniejsza informacja oszczędza czas rodzicom i ZUS. Po czwarte: ten sam zasiłek wygląda inaczej dla etatu, zlecenia i działalności." },
  @{ id = "w2"; text = "Po piąte: przepisy się zmieniają, dlatego stawki i limity są w panelu administracyjnym, bez edycji kodu. Po szóste: za zasiłkami stoją ludzie w trudnych chwilach, dlatego przy stracie dziecka czy wcześniaku kluczowy jest spokojny język. Po siódme: dostępność, czyli lektor, duży tekst, wysoki kontrast i telefon, to nie dodatek, lecz podstawa." },
  @{ id = "w3"; text = "Zasiłkowy Przewodnik Przyszłego Rodzica. HackNation dwa tysiące dwadzieścia sześć." }
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
  $dur = ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $wavPath
  Write-Output ("{0}.wav: {1:N2}s" -f $item.id, [double]$dur)
}
