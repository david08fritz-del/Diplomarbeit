# Diplomarbeit — Verteidige dein Leben

Ubiquitous Language für das Projekt „Versorgungslücken zwischen gesetzlicher Sozialversicherung und privater Vorsorge": das Browser-Spiel „Verteidige dein Leben" und die spätere Story-Webseite drumherum. Entsteht und wächst über die Grill-Durchgänge.

## Language

### Spielwelt

**Lauf**:
Ein einzelner ~5-minütiger Spieldurchgang vom echten Jetzt des Spielers bis „auf eigenen Beinen" (oder bis pleite).
_Avoid_: Runde, Session, Playthrough

**Profil**:
Die 3 Onboarding-Antworten (Tätigkeit · wohnt daheim? · Auto/Moped/Risiko-Sport?); dreht nur Parameter (Startpunkt, Einkommen, Start-Deckung, Event-Gewichte), nie Content.
_Avoid_: Charakterklasse, Persona, Archetyp

**Alltagskram**:
Ausweichbare Hindernisse beim Laufen (seitlich oder per Sprung); Treffer kosten Münzen, nie das Spiel.
_Avoid_: Gegner, Obstacles

**Münzen**:
Einkommen, beim Laufen eingesammelt; skaliert mit der Lebensphase (Schüler-Rinnsal → fixer Job voll).
_Avoid_: Punkte, Coins

**Station**:
Zeit-eingefrorener Entscheidungs-Screen an einem Lebensmoment („Du ziehst aus") mit Deckungs-Icon-Leiste und genau drei Karten.
_Avoid_: Level, Checkpoint, Shop

**Karte**:
Eine der drei Optionen an einer Station: *nichts tun* (gratis) · *Basis* · *Premium* — je Icon + eine Zeile + Preis; keine offensichtlich dumme Option.
_Avoid_: Angebot, Produkt, Police

**Event**:
Ein Eintrag im Schicksalsschlag-Pool (~8–10 Stück, 4–5 feuern pro Lauf), profilgewichtet gewürfelt — blind gegenüber Käufen, nie gezielt auf Lücken.
_Avoid_: Zufallsereignis, Encounter

**Katastrophe**:
Das Feuern eines Events im Lauf: eine unausweichliche, unüberspringbare Wand über alle Spuren; nur Deckung entscheidet die Folge.
_Avoid_: Unfall, Schadensfall

**Deckung**:
Der tatsächliche Absicherungs-Zustand je Bereich (Unfall · Haftpflicht+Haushalt · Rechtsschutz · Kranken), sichtbar als Icon-Leiste (✓✓✗✗).
_Avoid_: Versicherung, Schutz

**Grundmauer**:
Die gesetzliche Basis-Absicherung, die jeder von Anfang an hat (e-card, AUVA, Eltern-Mitversicherung) — und die beim Freizeitunfall nicht hält.
_Avoid_: Basisschutz

**Meilenstein**:
Gekauftes Lebens-Upgrade (Führerschein, eigene Bude, …), das als Tor mechanisch vorwärts bringt — kein Punktewert.
_Avoid_: Achievement, Upgrade

**Seitenkulisse**:
Die belebte Welt links und rechts der Spuren (Subway-Surfers-Vibe, Low-Poly-Stil); erzählt die aktuelle Lebensphase (Elternhaus/Schule → Ausbildung → eigene Gegend) und macht Fortschritt sichtbar.
_Avoid_: Background, Deko

**Kontrafakt**:
Bilanz-Einblendung am Ende: was ein ungedecktes, aber nicht eingetretenes Risiko gekostet *hätte*.
_Avoid_: What-if

**Bilanz**:
Der End-Screen: Lebensfortschritt, Euro-Verlauf, Kontrafakten, Einstieg zur Bestenliste.
_Avoid_: Score-Screen, Game-Over-Screen

**Lauf-Ergebnis**:
Das feste JSON-Objekt am Lauf-Ende (Spitzname, Profil, Stations-Entscheidungen, Events + gedeckt/ungedeckt, Endstand, erreichter Fortschritt) — in v1 nur lokal gespeichert; definierte Naht für die spätere geteilte Bestenliste und den empirischen Datensatz.
_Avoid_: Score-Payload, Savegame

**Bestenliste**:
Rangliste der Lauf-Ergebnisse nach Lebensfortschritt, liest sich als Lebenslauf („bis 31, eigene Wohnung" vs. „pleite mit 23"); v1 lokal (localStorage), anonymer Spitzname.
_Avoid_: Highscore-Liste, Leaderboard

### Bau

**Tag-1-Gate**:
Look-Check nach dem Skelett (3 Spuren, Figur, Münzen, eine Wand) auf dem Handy: premium → 3D weiter; sonst → Fallback 2D-Side-Scroller.
_Avoid_: MVP-Review

## Relationships

- Ein **Lauf** enthält ~4–5 **Stationen** und 4–5 **Katastrophen** aus dem **Event**-Pool
- Eine **Station** bietet genau drei **Karten**; die Wahl verändert die **Deckung**
- Eine **Katastrophe** prüft die **Deckung**: gedeckt → durchbrechen; ungedeckt → kostet Euro/**Meilensteine**, bis pleite
- Das **Profil** gewichtet **Events**, nie gezielt auf Deckungslücken
- **Meilensteine** sind Tore für Lebensfortschritt; Score = wie weit gekommen
- Skill → **Münzen**; **Deckung** → Existenz — die zwei Kreisläufe mischen sich nie
- Am Ende jedes **Laufs** entsteht ein **Lauf-Ergebnis**; die **Bilanz** zeigt es inkl. **Kontrafakten**; die **Bestenliste** ordnet es ein

## Example dialogue

> **Dev:** „Wenn der Spieler an der **Station** *nichts tun* wählt und das passende **Event** später gar nicht feuert — passiert dann nichts?"
> **Domain expert:** „Mechanisch nichts, aber es landet als **Kontrafakt** in der **Bilanz**: ‚Hätte X gekostet.' Und die Wahl steht im **Lauf-Ergebnis** — das ist unser ‚gefühlt gedeckt'-Datum."
> **Dev:** „Und wenn er top läuft, aber die **Deckung** falsch ist?"
> **Domain expert:** „Dann zerlegt ihn die **Katastrophe** trotzdem — **Münzen** kaufen Fortschritt, nie Sicherheit."

## Flagged ambiguities

- **„versichert" vs. „gedeckt"**: Kernbotschaft des Projekts — versichert ≠ abgesichert. Im Code und Content nie pauschal „versichert" prüfen, sondern immer **Deckung** je Bereich. Die **Grundmauer** existiert immer, deckt aber z.B. Freizeitunfälle nicht.
- **„Event" vs. „Katastrophe"**: Event = Eintrag im Pool (Datenobjekt); Katastrophe = sein Auftreten als Wand im Lauf. Nicht synonym verwenden.
