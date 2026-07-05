# PRD: spiel-build — „Verteidige dein Leben"

Feature: `spiel-build` · Repo: `david08fritz-del/Diplomarbeit` · Datum: 05.07.2026 · Stand: nach Codex-Kritik überarbeitet (05.07.2026)
Design-Grundlage: `spiel/DESIGN.md` (kanonisch, dort stehen die 7 harten Regeln) · Sprache: `DOMAIN.md`

## Was & Warum

> fangen wir an mit dem Spiel.

Das Design steht seit 05.07.2026 komplett in `spiel/DESIGN.md` — jetzt wird gebaut: der ~5-minütige Low-Poly-Lane-Runner „Verteidige dein Leben", vollständig durch alle 5 Bau-Stufen (Skelett → Stationen/Ökonomie → Events/Bilanz → Bestenliste → Politur). Das Spiel ist die Attraktion der Diplomarbeit; es macht „versichert ≠ abgesichert" fühlbar, die Webseite (späterer Durchgang) erklärt.

## Grill-Q&A-Zusammenfassung

- **Scope: das ganze Spiel in dieser PRD**, Issues entlang der 5 Bau-Stufen aus DESIGN.md; Issue #1 ist das Tag-1-Skelett mit explizitem Go/No-Go (Fallback: 2D-Side-Scroller). Ein zweiter Grill-Durchgang nach dem Gate wäre Overhead ohne Erkenntnisgewinn — der Fallback tauscht nur die Darstellungsschicht, die Spielsysteme bleiben identisch.
- **Stack: Vite + vanilla TypeScript + Three.js (vanilla), Look aus Box-Primitives mit flat shading.** Kein Game-Framework, keine State-Library. Begründung: kleinster Weg zum Crossy-Road-Look (der freeCodeCamp-Crossy-Road-Klon in Three.js dient als Optik-/Struktur-Blaupause), ~170 kB Renderer, kein Asset-Pipeline-Risiko am Tag 1. Animierter CC0-GLB-Charakter (Quaternius) nur als optionales Politur-Upgrade.
- **Spiellogik strikt von Darstellung getrennt** (reine TS-Module ohne Three.js-Import): macht die Simulation mit Vitest testbar (TDD-Pflicht in Phase 3) und ist zugleich die Naht, an der der 2D-Fallback andocken würde.
- **Kein Backend in v1.** Bestenliste in localStorage; das Lauf-Ergebnis wird als festes JSON-Format definiert und lokal gespeichert. Die geteilte Bestenliste + zentrale Datensammlung (empirischer Pflichtteil) wird ein eigener späterer Durchgang gemeinsam mit der Webseite — erst dann spielen Mitschüler wirklich. Härtestes Projekt-Constraint ist „in Tagen baubar"; ein Backend jetzt wäre Scope-Kriechen.
- **Repo wurde öffentlich gestellt** (Davids Entscheidung, 05.07.2026), weil GitHub Pages auf privaten Repos einen Bezahl-Plan bräuchte. **Hosting: GitHub Pages mit Auto-Deploy per Action**, Spiel unter `…/Diplomarbeit/spiel/`, Root bleibt für die Webseite frei. Nutzen: Look-Check am echten Handy, Team/Betreuer/MAK können jeden Stand antesten.
- **Mobile first, Hochformat — wichtiger als PC.** David wörtlich: „mobile ist das wichtigste weil die meisten werden darauf spielen. Ipad auch." PC sekundär: Pfeiltasten + Leertaste. Der Tag-1-Look-Check passiert am Handy. Die drei bekannten Mobile-Fallen (Browser-Scroll beim Swipen, Pixel-Ratio-Überlast, Tempo-Drift auf 120-Hz-Displays) werden ab Tag 1 abgeräumt.
- **Gameplay: Spurwechsel + Sprung** (Variante B). Niedrigen Alltagskram überspringt man (Swipe hoch / Leertaste), breitem weicht man seitlich aus. Katastrophen-Wände bleiben unausweichbar **und unüberspringbar** — Regel 1 aus DESIGN.md gilt absolut, Skill hilft nur gegen Alltagskram.
- **Content ist ein eigenes Issue:** die 4–5 Stationen, der 8–10-Event-Pool, ~4 Meilensteine, stilisierte Euro-Beträge und Karten-Texte als separate Content-Datei, getrennt vom Spielcode; jede fachliche Angabe mit Quellen-Notiz (ASVG/AUVA/Mitversicherung), damit der MAK-Gegencheck ein einzelnes lesbares Artefakt hat. Die Events wurden bewusst nicht im Grill einzeln festgelegt — Struktur fix, Füllung beim Bauen (so sieht es DESIGN.md vor).
- **Look: Subway-Surfers-Vibe im Low-Poly-Stil.** Subway Surfers liefert Energie-Level, Kamera-Inszenierung, satte Farben und die belebte Seitenkulisse; der Poly-Grad bleibt Crossy-Road-Klasse (kantig, flat shading) — Mobile-AAA-Glätte wäre mit Tage-Budget nur billig imitiert. **Die Seitenkulisse erzählt die Lebensphase** (Elternhaus/Schule → Ausbildung → eigene Gegend; 3–4 Varianten aus einem wiederverwendbaren Prop-Set) und macht „Score = wie weit du's bringst" sichtbar.
- **Rand-Defaults:** Kein Save/Resume — ein Lauf ist atomar (Tab im Hintergrund pausiert nur). Desktop zeigt eine zentrierte Hochformat-Bühne, kein eigenes Breitbild-Layout. Ohne WebGL: wortkarge Meldung statt schwarzem Bild. Browser-Baseline: aktuelle Safari/Chrome/Firefox (~2 Jahre).
- **Titel korrekt: „Verteidige dein Leben"** (mit „i" — in älteren Notizen stand ein Tippfehler).

## Für weiteren Kontext

- `spiel/DESIGN.md` — die 7 harten Design-Regeln, Stages, Systeme, Scope-Grenzen; kanonische Quelle für jede Gameplay-Frage
- `projekt.md` — Gesamtvision, Kernbotschaft, explizite Nicht-Ziele (kein Vergleichsportal, keine „Beratung", kein AAA-Klon)
- `DOMAIN.md` — Spielsprache (Lauf, Station, Karte, Event vs. Katastrophe, Deckung, Grundmauer, Meilenstein, Kontrafakt, Lauf-Ergebnis, Seitenkulisse) + Kern-Ambiguität „versichert ≠ gedeckt"
- `tech.md` — Stack-Dokumentation; wird nach der Kritik-Runde aus den Architecture Decisions dieser PRD gefüllt
- `CONTEXT.md` — Projekt-Map (ein Projekt, zwei Teile: `spiel/` + spätere `webseite/`)

## Architecture Decisions

**Rendering & Look**
- Three.js (vanilla, aktuelle Release-Version) mit WebGL, perspektivische Kamera fest hinter der Figur, Hochformat-Framing.
- Welt aus Box-Primitives mit `flatShading`, satte Farbpalette, gutes Licht (ein Directional + Ambient) — der Crossy-Road-Trick, keine Asset-Dateien im Kernspiel. Optionales Politur-Upgrade: ein animierter CC0-GLB-Charakter (Quaternius, run/jump), nur falls Zeit bleibt.
- Seitenkulisse als wiederverwendbares Low-Poly-Prop-Set mit 3–4 Lebensphasen-Varianten (Palette + Props pro Phase getauscht, gleiche Bau-Technik). Instancing für wiederkehrende Props, Draw-Calls klein halten.
- Mobile-Render-Budget statt DPR-Dogma: verbindlich ist das Budget — durchgängig flüssiges Bild auf Davids Handy und iPad bei bewusst begrenzter interner Zeichenfläche. Baseline ist ein Pixel-Ratio-Cap (≤ 2); Phase 2 wählt den konkreten Mechanismus (fester Cap, Canvas-Pixel-Deckel oder adaptive Render-Scale). Hintergrund: Three.js rät selbst von ungebremstem `devicePixelRatio` ab, und ein fixer Cap von 2 kann auf großen iPads noch zu teuer sein.

**Projekt & Deployment**
- Vite + vanilla TypeScript, Projekt-Wurzel `spiel/` im Diplomarbeit-Repo (Monorepo mit späterer `webseite/`).
- **URL-Vertrag (fix):** Spiel liegt ab Tag 1 unter `https://david08fritz-del.github.io/Diplomarbeit/spiel/`; Root `/Diplomarbeit/` bleibt für die spätere Webseite reserviert (bis dahin minimaler Platzhalter/Redirect aufs Spiel). Konsequenz: Vite `base: '/Diplomarbeit/spiel/'`, und die Pages-Action legt den Spiel-Build bewusst als `spiel/`-Unterordner ins Pages-Artefakt. Auto-Deploy bei jedem Push auf `main`.
- Kein Backend, keine externen Requests zur Laufzeit, keine Analytics, kein Tracking. Datenschutz-Formulierung präzise: **kein Laufdatum verlässt das Gerät; Speicherung ausschließlich lokal im Browser.** V1-Lauf-Ergebnisse sind strikt Demo-/Local-only und zählen nicht als empirischer Datensatz der Diplomarbeit — der entsteht erst im späteren Backend/Webseiten-Durchgang mit eigenem Erhebungs-Konzept.

**Spielarchitektur**
- Ein `requestAnimationFrame`-Loop mit Fixed-Timestep + Akkumulator (deterministische Simulation, kein Tempo-Drift auf 120-Hz-Displays); Akkumulator mit Max-Delta-Klemme, damit nach Tab-Rückkehr kein Simulationssprung passiert (rAF pausiert in versteckten Tabs).
- Spielphasen (Onboarding → Lauf → Station → Katastrophe → Bilanz) als Union-Type/enum + `switch` — keine State-Library.
- **Deep Module `sim`** (reine TS, kein Three.js-Import): kapselt Ökonomie (Münzen nach Lebensphase, Prämien), Deckungs-Zustand (4 Bereiche), Event-Würfeln (profilgewichtet, blind gegenüber Käufen), Katastrophen-Auflösung (gedeckt/ungedeckt, Pleite-Check), Meilenstein-Tore und Lebensfortschritt. Schnittstelle: Aktionen rein (tick, Münze, Treffer, Karten-Wahl, Event feuert) → neuer Zustand raus. Das ist das Herz des Spiels und der TDD-Schwerpunkt.
- **Modul `content`**: reine Daten-Datei (Stationen, Event-Pool, Meilensteine, Beträge, Karten-Texte). Je fachlicher Angabe: Quelle, Quellenart, Abrufdatum und Status (`self-checked` / `needs-MAK-check` / `MAK-checked`). Für Deckungslogik sind Primär-/offizielle Quellen Pflicht (RIS/ASVG, AUVA, ÖGK, oesterreich.gv.at); Makler-/Blogtexte höchstens als Erklärhilfe, nie als Rechtsbasis. Vom Code getrennt, damit Review/MAK-Check ohne Code-Wühlen geht.
- **Modul `presentation`**: Three.js-Szene (Spuren, Figur, Alltagskram, Wände, Seitenkulisse, Kamera, Juice), liest `sim`-Zustand, hält nie eigenen Spielzustand.
- **Modul `ui`**: DOM-Overlay über dem Canvas für Onboarding (3 Taps), HUD (Münzen, Deckungs-Icon-Leiste), Stations-Screen (3 Karten), Bilanz, Bestenliste — DOM statt In-Canvas-UI, weil in Tagen baubar, maximal lesbar und CoC/LoL-Bildsprache mit CSS schneller premium wird.
- **Modul `input`**: Pointer-Events-Swipe (Mindest-Distanz, dominante Achse: links/rechts = Spur, hoch = Sprung) + Tastatur (Pfeiltasten, Leertaste); `touch-action: none` auf dem Canvas; liefert Intents an `sim`, nie direkte Zustandsänderung.
- **Modul `storage`**: localStorage — Bestenliste + gespeicherte Lauf-Ergebnisse; einziger Persistenz-Punkt. Ist localStorage blockiert oder voll, bleibt das Spiel voll spielbar — nur Bestenliste/Speichern entfallen wortkarg.
- **Spitzname:** frei gewählt, mit UI-Hinweis „kein echter Name", Längenlimit und Sanitizing vor Anzeige/Speicherung — ein Spitzname kann sonst ein personenbezogenes Datum sein (DSGVO Art. 4), und die Regel schützt auch die spätere geteilte Bestenliste.

**Datenform: Lauf-Ergebnis** (die Feldliste ist die Entscheidung; endgültige Benennung in Phase 2):

```ts
type LaufErgebnis = {
  version: 1
  zeitpunkt: string          // ISO — bleibt lokal
  spitzname: string
  profil: { taetigkeit: 'schule' | 'lehre' | 'studium' | 'job'; wohntDaheim: boolean; risiko: boolean }
  stationen: Array<{ stationId: string; karte: 'nichts' | 'basis' | 'premium' }>
  events: Array<{ eventId: string; gedeckt: boolean; schadenEuro: number }>
  ende: 'ziel' | 'pleite'
  fortschritt: number        // Position auf der Lebens-Achse = Score
  vermoegenEuro: number
  meilensteine: string[]
}
```

„nichts tun" an Stationen ist das implizite „gefühlt gedeckt"-Datum — dieses Format ist die fertige Naht für die spätere geteilte Bestenliste und den empirischen Datensatz (eigener Durchgang, dann Entscheidung Supabase-EU vs. Cloudflare Worker).

## Acceptance Criteria

**Tag-1-Gate (Issue #1, Go/No-Go durch David):**
- Skelett läuft am Handy (Hochformat): 3 Spuren, Figur läuft automatisch, Spurwechsel per Swipe, Münzen einsammelbar, eine Wand quer über alle Spuren.
- Mindest-Look als Urteils-Grundlage (damit „premium" überhaupt beurteilbar ist): klar lesbare Spuren und Wand, Figur mit Bewegung, Licht + Schatten + abgestimmte Farbpalette (kein Prototyp-Grau), ein erster Streifen Seitenkulisse.
- Mess-Beleg statt Gefühl: sichtbare FPS-/Frame-Time-Anzeige im Dev-Build auf Davids Handy und iPad (Ziel 60 fps, kein sichtbares Ruckeln), Swipe ohne Browser-Scroll/Zurück-Geste, kein Simulationssprung nach Tab-Wechsel, Hochformat-Screenshot als Beleg.
- Das Urteil „premium: ja/nein" bleibt Davids — die Checkliste ist die Beweis-Grundlage, kein Ersatz.
- Bei No-Go wird nur die Darstellungsschicht getauscht (2D-Side-Scroller): `sim`, `content`, DOM-`ui`, `storage` und Teststrategie bleiben erhalten; Folge-Issues werden angepasst.

**Spielbarkeit (Ende Stufe 3):**
- Kompletter Lauf in ~5 Minuten: 3-Tap-Onboarding → Lauf → 4–5 Stationen → 4–5 Katastrophen aus dem 8–10er-Pool → Bilanz mit Kontrafakten.
- Beide Fehler-Modi real erreichbar: der Zocker (kauft nie) endet an einer ungedeckten Katastrophe; der Über-Versicherer (kauft alles Premium) kommt spürbar langsamer voran.
- Die Grundmauer ist ab Start sichtbar und hält beim Freizeitunfall-Event nicht (Kern-Moment).
- Pleite endet mit „Versichert. Aber nicht abgesichert."

**Design-Regel-Konformität (an jedem Stand prüfbar):**
- Katastrophen sind nie ausweichbar und nie überspringbar; Alltagskram-Treffer kosten Münzen, nie das Spiel; Game-Over entsteht nur aus Finanzen.
- Kein Erklärtext im Spiel; alle Konsequenzen in Euro bzw. Lebens-Währung („Urlaub weg, zurück zu Mama"); Deutsch, wortkarg.
- Event-Würfeln nachweislich blind gegenüber Käufen (im `sim`-Test belegbar).

**Plattform:**
- Handy + iPad, Hochformat: Swipe steuert ohne Browser-Scroll/Zurück-Geste; Desktop: Pfeiltasten + Leertaste, zentrierte Hochformat-Bühne.
- Ohne WebGL: wortkarge Hinweis-Meldung statt schwarzem Bildschirm.

**Content:**
- Content-Datei mit 4–5 Stationen, 8–10 Events, ~4 Meilensteinen, allen Beträgen und Karten-Texten; Zahlen erkennbar stilisiert; keine Station hat eine offensichtlich dumme Karte.
- Jede fachliche Angabe trägt Quelle, Quellenart, Abrufdatum und Status; Deckungslogik ausschließlich auf Primär-/offiziellen Quellen. In die finale Präsentationsversion darf kein Eintrag unter Status `self-checked`.
- MAK-Gegencheck = einmalige Rückmeldung auf die Content-Datei (freiwilliger Partner, Minimal-Aufwand laut `projekt.md`); bestätigte Einträge wechseln auf `MAK-checked`. `MAK-checked` ist bewusst KEIN Ship-Gate.

**Technik:**
- `sim`-Modul vollständig Vitest-getestet (grün), ohne Browser lauffähig.
- Jeder Stand auf `main` ist automatisch unter `…/Diplomarbeit/spiel/` spielbar; der URL-Vertrag (Spiel im Subpfad, Root frei für die Webseite) ist im deployten Build verifiziert (Assets laden, kein 404).
- Lauf-Ergebnis wird am Lauf-Ende im definierten Format erzeugt und in localStorage abgelegt; Bestenliste liest daraus. Keine Netzwerk-Requests zur Laufzeit.
- Bei blockiertem/vollem localStorage bleibt das Spiel voll spielbar; nur Bestenliste/Speichern entfallen wortkarg.

## Problem Statement

Ein 20-Jähriger in Österreich fühlt sich abgesichert — e-card, irgendwas zahlen die Eltern, wird schon passen. Dass die gesetzliche Grundmauer beim Samstag-Fußballmatch nicht greift und die Eltern-Mitversicherung still ausläuft, erfährt er erst, wenn es Geld kostet. Broschüren und Erklärtexte erreichen ihn nicht.

## Solution

Ein 5-Minuten-Browser-Spiel, das sein eigenes Leben als Lane-Runner inszeniert: Er startet in seinem echten Jetzt, verdient laufend Münzen, trifft an Lebens-Stationen Absicherungs-Entscheidungen — und erlebt an unausweichlichen Katastrophen-Wänden, ob seine Deckung hält. Kein Tutorial, keine Belehrung: Die Mechanik selbst beweist, dass Skill Geld bringt, aber nie Sicherheit, und dass die richtige Deckung — nicht die meiste — über sein Vorankommen entscheidet.

## User Stories

1. Als Spieler will ich in 3 Taps ohne Formular starten, damit ich in Sekunden im Spiel bin.
2. Als Spieler will ich, dass der Lauf in meinem echten Jetzt startet (Schule/Lehre/Studium/Job, daheim oder nicht, Risiko oder nicht), damit es sich nach meinem Leben anfühlt und nicht nach einem Fremden.
3. Als Handy-Spieler will ich hochkant per Swipe die Spur wechseln und per Swipe nach oben springen, damit die Steuerung ohne Erklärung funktioniert.
4. Als Desktop-Spieler will ich mit Pfeiltasten die Spur wechseln und mit der Leertaste springen, damit ich auch am PC spielen kann.
5. Als Spieler will ich laufend Münzen einsammeln, die mit meiner Lebensphase wachsen, damit ich Fortschritt im Einkommen spüre.
6. Als Spieler will ich Alltagskram seitlich ausweichen oder überspringen können, wobei Treffer Münzen kosten und nie das Spiel, damit Laufen Skill belohnt, ohne dass Reflexe über meine Existenz entscheiden.
7. Als Spieler will ich an Stationen bei eingefrorener Zeit auf einem einzigen Screen zwischen drei Karten wählen (nichts tun / Basis / Premium — je Icon, eine Zeile, Preis), damit die Entscheidung schnell, verständlich und nie offensichtlich dumm ist.
8. Als Spieler will ich meine Deckung jederzeit als Icon-Leiste sehen, damit ich meinen Zustand ohne Text erfasse.
9. Als Spieler will ich die gesetzliche Grundmauer von Anfang an sichtbar haben — und beim Freizeitunfall erleben, dass sie nicht hält, damit ich „versichert ≠ abgesichert" am eigenen Lauf begreife.
10. Als Spieler will ich, dass mich gedeckte Katastrophen mit fettem Feedback durchbrechen lassen, damit sich richtige Vorsorge wie ein Sieg anfühlt.
11. Als Spieler will ich, dass mich ungedeckte Katastrophen echtes Geld und Meilensteine kosten (Urlaub weg, zurück zu Mama), damit die Konsequenz in meiner Währung ankommt — nie in HP oder Fachjargon.
12. Als Spieler will ich Meilensteine kaufen (Führerschein, eigene Bude, …), die mir als Tore neue Abschnitte öffnen, damit „Leben kaufen" mich mechanisch vorwärtsbringt.
13. Als Spieler will ich an der Seitenkulisse sehen, wo ich im Leben stehe (Elternhaus → Ausbildung → eigene Gegend), damit mein Fortschritt sichtbar ist, nicht nur eine Zahl.
14. Als Spieler will ich bei Pleite ein klares, hartes Ende sehen („Versichert. Aber nicht abgesichert."), damit die Kernbotschaft sitzt.
15. Als Spieler will ich am Ende eine Bilanz mit Euro-Verlauf und Kontrafakten sehen („Hätte dich X gekostet"), damit ich auch verstehe, was mir NICHT passiert ist.
16. Als Spieler will ich mich mit frei gewähltem Spitznamen in die Bestenliste eintragen, damit ich vergleichbar bin, ohne Daten preiszugeben.
17. Als Spieler will ich die Bestenliste als Lebensläufe lesen („bis 31, eigene Wohnung, Auto" vs. „pleite mit 23"), damit der Score eine Geschichte erzählt.
18. Als Spieler will ich das Spiel ohne jedes Tutorial und ohne Erklärtext verstehen, damit es sich wie ein Spiel anfühlt und nicht wie Unterricht.
19. Als iPad-Spieler will ich dasselbe Hochformat-Erlebnis wie am Handy, damit das Gerät keine Rolle spielt.
20. Als Spieler mit altem Browser will ich eine kurze klare Meldung statt eines schwarzen Bildschirms, damit ich weiß, woran es liegt.
21. Als David/Team will ich jeden Stand unter der öffentlichen GitHub-Pages-URL antesten können, damit Look-Checks und Team-Feedback ohne Vorführ-Termin passieren.
22. Als MAK-Partner will ich alle fachlichen Angaben mit Quellen-Notiz in einer einzigen lesbaren Content-Datei gegenchecken können, damit mein Aufwand minimal bleibt.
23. Als Team will ich jede Stations-Entscheidung strukturiert im Lauf-Ergebnis haben, damit der empirische Datensatz (gefühlt vs. tatsächlich gedeckt) später nur noch angeschlossen werden muss.
24. Als Entwickler will ich die komplette Spiellogik ohne Browser in Vitest testen können, damit TDD in Phase 3 real funktioniert und der 2D-Fallback andockbar bleibt.

## Testing Decisions

- Getestet wird externes Verhalten der `sim`-Schnittstelle (Aktionen rein → Zustand raus), nie Implementierungsdetails oder Rendering.
- **Testschwerpunkt `sim`:** Ökonomie (Münz-Skalierung je Lebensphase, Prämien senken Vorwärts-Geld), Deckungs-Auflösung (gedeckt/ungedeckt je Bereich, Grundmauer deckt Arbeit/Schule aber nicht Freizeit), Event-Würfeln (profilgewichtet, nachweislich blind gegenüber Käufen — Kauf ändert Wahrscheinlichkeiten nicht), Pleite-Pfad, Meilenstein-Tore, Kontrafakt-Berechnung, Erzeugung des Lauf-Ergebnisses. Zufall über injizierbaren Seed/RNG deterministisch machen.
- **`content`** bekommt einen Validierungs-Test: jede Station hat genau 3 Karten, jedes Event referenziert einen existierenden Deckungs-Bereich, jede fachliche Angabe hat Quelle, Quellenart, Abrufdatum und gültigen Status.
- **`storage`** klein testen (Schreiben/Lesen/Sortierung der Bestenliste; Verhalten bei blockiertem/vollem localStorage).
- `presentation`, `ui`, `input` werden nicht unit-getestet; Verifikation dort über den Playwright-Beleg der Phase-3-Verification (UI-Pflicht laut Workflow-Regeln).
- Prior Art: keine — erstes Feature im Repo; diese PRD setzt den Standard.

## Out of Scope

- Backend jeder Art: geteilte Bestenliste, zentrale Datensammlung, Server — eigener Durchgang mit der Webseite.
- Die Webseite selbst (Story-Scroll, Videos, Quiz, Umfrage-Ergebnisse).
- 2D-Side-Scroller-Fallback: wird nur bei No-Go am Tag-1-Gate geplant, nicht vorsorglich mitgebaut.
- Save/Resume, Replay-Grind, Meta-Progression, Achievements.
- Login, Accounts, Tracking, Analytics — und generell: kein Datum verlässt in v1 das Gerät.
- Mehrsprachigkeit (nur Deutsch), Accessibility über solide Lesbarkeit hinaus.
- Alles aus den Nicht-Zielen von `projekt.md` (Vergleichsportal, Prämien-Engine, „Beratung", AAA-Optik).

## Further Notes

- Bau-Reihenfolge = Issue-Reihenfolge (aus DESIGN.md): 1. Tag-1-Skelett (Gate) → 2. Stationen + Ökonomie → 3. Events + Bilanz → 4. Bestenliste → 5. Politur (Juice, Sound, Übergänge, optional GLB-Charakter). Content-Issue läuft parallel ab Stufe 2.
- Sound erst in der Politur-Stufe; Quellen CC0 (z.B. Kenney-Audio) — Detail für Phase 2.
- Nach der Kritik-Runde (`02-PRD-critic.md`) werden die Architecture Decisions in `tech.md` übernommen (dessen Format wartet darauf).
- Fachliche Erdung bleibt Davids Verantwortung mit leichtem MAK-Gegencheck („so wenig Aufwand wie möglich" laut `projekt.md`) — die Quellen-Notizen in der Content-Datei sind genau dafür da.
- Codex-Kritik (`02-PRD-critic.md`) eingearbeitet am 05.07.2026: URL-Vertrag fixiert (Subpfad ab Tag 1), Render-Budget statt DPR-Dogma + Max-Delta-Klemme, Datenschutz-Sprache präzisiert (local-only, Spitznamen-Regeln, v1 ≠ Empirik), Quellen-Qualitäts-Gate für Content (Pushback: `MAK-checked` ist kein Ship-Gate, MAK ist freiwillig), Tag-1-Gate operationalisiert (Checkliste + Mess-Beleg, Davids Urteil bleibt final).
