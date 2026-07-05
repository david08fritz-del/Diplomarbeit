# DESIGN — „Verteidige dein Leben"

Kompaktes Spiel-Design, im Grill-Gespräch am 05.07.2026 erarbeitet. Das sind die
Regeln fürs Bauen. Vision/Scope → `../projekt.md`, Tech-Entscheidungen → `../tech.md`.

## Das Spiel in einem Satz

Ein ~5-minütiger Low-Poly-Lane-Runner (Kamera von hinten), in dem du dein eigenes
Leben vom echten Jetzt bis „auf eigenen Beinen" nach vorn läufst — Münzen sind dein
Einkommen, Absicherungs-Entscheidungen an Lebens-Stationen bestimmen, ob dich die
unausweichlichen Schicksalsschläge zurückwerfen oder stoppen. Score: wie weit du's
bringst.

## Harte Design-Regeln (nie brechen)

1. **Nie „Ausweichen lernen" lehren.** Katastrophen sind unausweichliche Wände über
   alle Spuren — nur Vorsorge hilft. Skill gibt Geld, nie Sicherheit.
2. **Game-Over nur aus Deckungslücken/Finanzen, nie aus Reflexen.** Treffer beim
   Laufen kosten Münzen, nie das Spiel.
3. **Ereignisse würfeln blind gegenüber Käufen.** Profilgetrieben (Sportler → eher
   Sportverletzung), aber nie gezielt auf Lücken — Spieler durchschauen „rigged".
   Nicht alles Ungedeckte schlägt ein; der Rest kommt als Kontrafakt in die Bilanz.
4. **Konsequenzen in der Währung eines 20-Jährigen.** Urlaub weg, zurück zu Mama,
   Konto leer — nie HP, nie Fachjargon.
5. **Kein Erklärtext im Spiel.** Spiel macht fühlen, Webseite macht verstehen.
6. **Alles in Euro.** Kein Happiness-/Gummi-Score.
7. **Fachlich korrekt** (ASVG/AUVA, Mitversicherung etc.); konkrete Zahlen stilisiert
   und klar illustrativ.

## Ablauf

1. **Onboarding — 3 Taps, keine Formulare:** Was machst du? (Schule/Lehre/Studium/
   Job) · Wohnst du daheim? · Auto/Moped/Risiko-Sport? → Lauf startet in deinem Jetzt.
2. **Laufen:** 3 Spuren, Subway-Surfers-Schwierigkeit (etwas Skill, niemand stirbt an
   den Fingern). Münzen = Einkommen einsammeln, Alltagskram ausweichbar (Treffer =
   Münzverlust, spürbar, nie tödlich).
3. **Station (Zeit friert, 1 Screen):** Lebensmoment („Du ziehst aus", „Eltern-
   Mitversicherung endet"). Deckung als Icon-Leiste (✓✓✗✗), 3 Karten: *nichts tun*
   (gratis) · *Basis* · *Premium* — Icon + eine Zeile + Preis. Keine offensichtlich
   dumme Option.
4. **Katastrophe (Wand über alle Spuren, unausweichlich):** gedeckt = durchbrechen
   (fettes Feedback), ungedeckt = kostet echt Geld/Meilensteine — bis hin zu pleite
   → Lauf endet: „Versichert. Aber nicht abgesichert."
5. **Ende:** natürliches Ziel ~„auf eigenen Beinen mit 30" erreicht oder vorher
   gestoppt. Bilanz + Kontrafakten + Bestenliste (anonymer Spitzname).

## Systeme

- **Zwei getrennte Kreisläufe:** Skill → Münzen. Absicherung → Existenz. Sie mischen
  sich nie: der beste Läufer mit falscher Deckung wird genauso zerlegt.
- **Münzen skalieren mit der Lebensphase:** Schüler-Rinnsal → Lehrling → nach
  Lehrabschluss mehr → fixer Job voll.
- **Meilensteine sind Tore, keine Punkte:** ohne Führerschein/Auto kein besserer Job,
  ohne eigene Bude kein Stadt-Umzug. Leben-Kaufen bringt dich mechanisch vorwärts.
- **Beide Fehler-Modi real:** Der Zocker rast, bis der ungedeckte Einschlag den Lauf
  beendet. Der Über-Versicherer ist safe, aber Prämien fressen das Vorwärts-Geld —
  er tuckert auf der Stelle. Sweet Spot: richtige Deckung fürs eigene Profil.
- **Gesetzliche Grundmauer sichtbar von Anfang an** (e-card, AUVA, Eltern-Schirm) —
  und sie hält beim Freizeitunfall nicht (AUVA deckt Arbeit/Schule, nicht das
  Samstag-Match). Kern-Moment des Spiels. Eltern-Mitversicherung läuft unbemerkt aus.
- **Vier Bereiche:** Unfall · Haftpflicht+Haushalt · Rechtsschutz · Kranken
  (gesetzlich vs. privat).

## Personalisierung = Parameter, nicht Content

EIN Spiel, keine Verzweigungs-Hölle. Die 3 Onboarding-Antworten drehen nur Zahlen:
Startpunkt auf der Achse „mitversichert/abhängig → auf eigenen Beinen", Einkommen,
Start-Deckung, Event-Gewichte.

## Score & Empirik

- **Score = wie weit bist du gekommen** (Lebensfortschritt), Meilensteine/Vermögen
  als Feinunterscheidung. Bestenliste liest sich als Lebenslauf: „bis 31, eigene
  Wohnung, Auto" vs. „pleite mit 23".
- **Empirischer Datensatz:** Stations-Entscheidungen werden anonym geloggt —
  „nichts tun" ist das implizite „gefühlt gedeckt"-Datum (gefühlt vs. tatsächlich).
  Kein Login, keine personenbezogenen Daten.

## Look

Crossy-Road-Klasse: stilisiertes Low-Poly, satte Farben, gutes Licht, feste Kamera.
CoC/LoL-Bildsprache bei UI und Feedback (juicy, premium, maximal lesbar). Deutsch,
wortkarg.

## Umfang (hart)

~4–5 Stationen · ~8–10 Events im Pool (4–5 feuern pro Lauf) · ~4 Meilensteine ·
3-Tap-Onboarding · ~5 Min Spielzeit, einmal durch (kein Replay-Grind).
**Bau-Budget: ein paar konzentrierte Tage.**

## Bau-Reihenfolge / De-Risking

1. **Tag-1-Skelett:** 3 Spuren, Figur, Münzen, eine Wand — Look-Check. Sieht's nicht
   premium aus → Fallback 2D-Side-Scroller (Entscheidung nach einem Tag, nicht zwei
   Wochen).
2. Stationen + Ökonomie → 3. Events + Bilanz → 4. Bestenliste → 5. Politur (Juice,
   Sound, Übergänge).

## Offen (beim Bauen entscheiden)

- Konkrete Event-Liste + stilisierte Zahlen (selbst aus Recht/Quellen erden,
  leichter MAK-Gegencheck).
- End-Screen-Layout im Detail.
- Tech-Stack (→ `../tech.md`, beim ersten Bauschritt).
