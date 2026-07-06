# Code-Critic: Tag-1-Skelett + Pages-Deploy (Issue #1, Branch feature/issue-1) - Codex

## Context-Manifest

- WAS/WARUM/Architecture: `01-PRD.md`
- PRD-Critic-Outcomes: `02-PRD-critic.md`
- Plan + Plan-Critic: `03-Plan.md`, `04-Plan-critic.md`
- Issue: #1 - `gh issue view 1` ("Tag-1-Skelett + Pages-Deploy")
- Diff: `feature/issue-1` vs. `main`, 13 Commits, 38 Files; Greenfield-`spiel/` plus Pages-Workflow, Root-Redirect, Docs und Beleg-Screenshots.
- Review-Request: `Workflow/spiel-build/review-request.md` lag lokal vor (untracked) und wurde als Implementer-Kontext gelesen.
- Bias-Hinweis: Unmittelbar vor diesem `$code-critique` wurden im `$prime` bereits einige Implementierungsfiles gelesen. Die strikte Bias-Prevention ist deshalb nicht perfekt; die eigene Sicht unten wurde nach erneutem Spec-/Plan-Lesen und vor dem gezielten Diff-Review rekonstruiert.
- Eigene Research:
  - Lokal: `npm test` -> 6 Files / 22 Tests gruen; `npm run build` -> gruen, erwartete Vite-Chunk-Warnung wegen gebuendeltem Three.js.
  - Lokal: `rg -n "three" spiel/src/sim spiel/src/loop.ts` -> keine Treffer; die Naht `sim`/`loop` bleibt rendererfrei.
  - Lokal: Screenshots `task10-hochformat.png` und `task10-desktop.png` visuell geprueft: nonblank, Spuren/Figur/Muenzen/Wand/Kulisse/Schatten sichtbar.
  - Explorer-Research: bestaetigt 13 Commits, CI nur `npm ci` + `npm test` + `npm run build`, `verify:ui` nicht im Workflow; keine Runtime-Requests, Secrets, Storage oder Backend im App-Code.

## Eigene Sicht (vor Lesen von Claudes Code)

- Ich haette das Issue ebenfalls als schmalen Tracer Bullet gebaut: Vite/TS in `spiel/`, reines `sim`, reiner Fixed-Timestep-`loop`, `input` als Intent-Quelle, Three.js nur in `presentation`, DOM-HUD/FPS, Pages-Artefakt unter `/Diplomarbeit/spiel/`.
- Die zentrale Qualitaetslinie waere fuer mich: Rendering-Belege muessen den Look-Check wirklich absichern. Ein sichtbares Canvas-Element reicht nicht; mindestens ein nonblack/nonblank-Pixel-Check oder bewusst dokumentierte manuelle Sichtpruefung gehoert in den Gate-Pfad.
- Fuer Mobile-first haette ich mindestens einen Browser-Smoke ueber den Pointer-/Swipe-Pfad ergaenzt, weil Tastatur + reine Swipe-Klassifikation nicht beweisen, dass die mobile Event-Verdrahtung im Browser funktioniert.

## Spec-Konformitaet

Spec weitgehend umgesetzt, kein Scope-Creep im Produktverhalten.

- Beleg: PRD verlangt fuer Issue #1 "3 Spuren, Figur laeuft automatisch, Spurwechsel per Swipe, Muenzen einsammelbar, eine Wand quer ueber alle Spuren" (`01-PRD.md:80`) plus Mindest-Look (`01-PRD.md:81`). Der Code liefert `sim` fuer Spur/Sprung/Muenzen/Wand, `main.ts` verdrahtet Loop/Input/Presentation/UI, und die committed Screenshots zeigen Spuren/Figur/Muenzen/Wand/Kulisse.
- Beleg: URL-Vertrag laut PRD `base: '/Diplomarbeit/spiel/'` und Pages-Artefakt mit `spiel/`-Unterordner (`01-PRD.md:44`) ist umgesetzt in `spiel/vite.config.ts:5` und `.github/workflows/deploy.yml:34-44`.
- Beleg: Rendererfreie Naht laut Plan (`03-Plan.md:14`) ist eingehalten; `sim` und `loop.ts` haben keine Three-Imports.
- Beleg: Tasks 12/13 (Live-Verifikation nach Merge, David-HITL-Gate) sind laut Plan erst nach Davids Merge dran (`03-Plan.md:1628-1674`), daher kein Branch-Spec-Fehler.

Keine fehlende Produktfunktion, die ich vor Merge als Spec-Blocker werten wuerde. Die offenen Punkte unten sind Test-/Gate-Qualitaet, nicht dass das Skelett sichtbar falsch gebaut wurde.

## Struktur & Vereinfachung

Keine strukturellen Blocker. Die Codebase ist fuer einen Greenfield-Tracer sauber geschnitten.

- Positiv: Die spaetere 2D-Fallback-Naht ist real, nicht nur behauptet. `sim`/`loop` sind klein und rendererfrei; `presentation` liest `SimZustand`, haelt aber keinen Gameplay-Zustand. Die transiente Wandanimation in `welt.ts` ist Presentation-State und gehoert dort hin.
- Positiv: Die Plan-Abweichung zur Bildschirmrichtung wurde nicht als Ad-hoc-Fix in drei Dateien verteilt, sondern in `presentation/spur.ts` als eine Quelle der Wahrheit geloest und getestet.
- Kein >1k-Zeilen-App-File, keine `any`-Lecks, keine Thin-Wrapper-Schicht, keine neue General-Purpose-Abstraktion ohne Nutzen. `package-lock.json` ist gross, aber kein Architektur-Signal.
- Leichter Smell, nicht blockerwuerdig: `as Spur`, `as Set<string>` und `querySelector(...) as HTMLSpanElement` sind hier lokal begrenzt. Wenn `sim` in Folge-Issues komplexer wird, sollte der mutable Clone sauber typisiert werden statt Readonly per Cast aufzubrechen; aktuell ist der Cast aber kein echter Wartungsbruch.

## Correctness & sonstiges

### 1. UI-Verifikation ist noch kein echter Render-Gate

- **Problem:** Der wichtigste Beleg fuer dieses Issue ist der Look. PRD fordert "Mindest-Look als Urteils-Grundlage" (`01-PRD.md:81`) und "Mess-Beleg statt Gefuehl" (`01-PRD.md:82`). Der Plan verkauft `@playwright/test` als "maschinenpruefbare Assertions" (`03-Plan.md:38`). Die aktuelle Spec prueft aber nur, dass `#buehne canvas` sichtbar ist, dass `#fps` Text enthaelt und dass das HUD nach `ArrowLeft` hochzaehlt (`spiel/tests/tag1.spec.ts:9-15`). Ein schwarzer oder visuell kaputter WebGL-Frame kann diese Assertions bestehen.
- **Konkreter Beleg:** Claude dokumentiert im Review-Request selbst, dass der erste `verify:ui`-Lauf einen schwarzen Hochformat-Screenshot erzeugt hat, waehrend die Assertions nie fehlgeschlagen sind. Genau das ist der Fehlerfall, den ein Tag-1-Look-Gate nicht blind passieren lassen darf.
- **Remedy:** Vor Merge entweder `verify:ui` ehrlich als Smoke-Test deklarieren und die manuelle Screenshot-Sichtpruefung als Gate festhalten, oder besser einen kleinen maschinellen Render-Check ergaenzen: Screenshot/Canvas-Pixel auf nonblank + Farbvarianz pruefen (z.B. nicht nur Hintergrundfarbe, erkennbare Lane-/Muenzen-/Wand-Farben). Damit wird der bisher manuelle "nicht schwarzes Bild"-Check zu einem echten Gate.

### 2. Mobile-Swipe ist nicht end-to-end belegt

- **Problem:** Mobile ist laut PRD wichtiger als PC (`01-PRD.md:19`), und der AC sagt explizit "Spurwechsel per Swipe" (`01-PRD.md:80`) sowie "Swipe steuert ohne Browser-Scroll/Zurueck-Geste" (`01-PRD.md:98`). Die Browser-Spec sammelt Muenzen aber per `page.keyboard.press('ArrowLeft')` (`spiel/tests/tag1.spec.ts:13`). Die Unit-Tests pruefen nur `klassifiziereSwipe`, nicht dass Pointer-Events auf `#buehne` im Browser tatsaechlich durch `setPointerCapture`/`pointerup`/CSS `touch-action: none` bis zum `sim`-Intent laufen.
- **Tradeoff:** David prueft Swipe im HITL-Gate nach Merge (`03-Plan.md:1668-1674`), deshalb ist das kein Produkt-Blocker im Code. Als Engineering-Gate bleibt aber ein Risiko: der kritischste Mobile-Pfad ist vor Merge nicht automatisiert.
- **Remedy:** Einen Playwright-Test mit Touch-/Pointer-Event auf `#buehne` ergaenzen: Swipe links muss vor Reihe 1 Muenzen sammeln, Swipe hoch muss mindestens einen sichtbaren Sprungzustand oder eine daraus ableitbare Szene veraendern. Wenn Browser-Back-Gesture nicht stabil automatisierbar ist, zumindest Pointer-Verdrahtung + `touch-action`-CSS maschinell pruefen.

### 3. `verify:ui` laeuft nicht im CI-/Deploy-Gate

- **Problem:** `.github/workflows/deploy.yml` fuehrt `npm ci`, `npm test`, `npm run build` aus (`.github/workflows/deploy.yml:31-33`), aber nicht `npm run verify:ui`. Damit kann ein spaeterer Rendering-/Integration-Bruch auf `main` deployen, obwohl Issue/PRD den spielbaren Pages-Stand als Vertrag setzen (`01-PRD.md:108`).
- **Bewertung:** Fuer diesen Branch wurde `verify:ui` lokal ausgefuehrt und die Screenshots sind committed. Fuer Enterprise-Niveau sollte die Pipeline aber mindestens den Browser-Smoke ausfuehren oder bewusst dokumentieren, warum der Look-Beleg ein manueller PR-Schritt bleibt.
- **Remedy:** `verify:ui` in einen separaten CI-Job aufnehmen (mit Playwright-Browser-Setup und Screenshot-Artefakten) oder den Deploy-Workflow klar in "build gate" und "manual visual gate" trennen. Mit Befund 1 zusammen ergibt erst das einen belastbaren UI-Gate.

## Security & Enterprise-Check

- **Security (Vulns/Auth/Secrets): OK.** Kein Auth, keine Secrets, keine Runtime-Netzwerkcalls, keine Analytics. `hud.innerHTML` nutzt einen konstanten String ohne Nutzereingabe.
- **Compliance: OK fuer Issue #1.** Kein Storage, kein Spitzname, keine personenbezogenen Daten in diesem Slice. Die v1-local-only/Empirik-Grenze aus der PRD wird nicht verletzt.
- **Backward Compatibility: OK.** Greenfield-Feature; URL-Vertrag ist explizit. WebGL2-Fallback ist dokumentiert.
- **Datenintegritaet: OK.** Keine Persistenz in diesem Issue. `sim`-State bleibt deterministisch.
- **Observability: TEILWEISE.** FPS/Frame-Time-Anzeige vorhanden (`?fps` auch im Prod-Build). UI-Gate beobachtet Rendering aber noch nicht robust genug; siehe Correctness 1/3.
- **Rollback/Migration: OK.** Keine Migrationen. Branch/PR-Workflow eingehalten; Live-Deploy nur `main`.
- **Test-Strategie: FEHLT TEILWEISE.** Unit-Tests sind stark und passend. Browser-Teststrategie deckt DOM/HUD/Desktop-Zentrierung ab, aber nicht nonblank Rendering, nicht mobile Swipe end-to-end und nicht CI.
- **Least Privilege: TEILWEISE.** Workflow setzt `pages: write` und `id-token: write` global (`.github/workflows/deploy.yml:9-12`), obwohl Feature-/PR-Builds nur lesen/testen/builden. Besser: Permissions job-spezifisch setzen oder Deploy in einen eigenen Job mit Pages/OIDC-Rechten schieben. Kein akuter Exploit im aktuellen Diff, aber einfach zu haerten.

## Offene Fragen

- Soll `verify:ui` ab diesem Issue ein harter CI-Gate werden, oder bleibt der visuelle Look-Check bewusst ein lokaler/PR-HITL-Schritt?
- Soll die Review-Request-Datei `Workflow/spiel-build/review-request.md` noch versioniert werden, oder bleibt sie nur lokaler Uebergabekontext?

## Wichtigster Befund

Vor Merge sollte der UI-Beleg so geschaerft werden, dass ein schwarzer/kaputter WebGL-Frame nicht mehr mit gruener `verify:ui` durchrutscht; sonst ist ausgerechnet das Tag-1-Look-Gate technisch zu schwach.

- Codex, 2026-07-06
