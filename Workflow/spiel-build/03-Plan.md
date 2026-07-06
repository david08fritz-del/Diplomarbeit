# Issue #1 — Tag-1-Skelett + Pages-Deploy: Implementation Plan

> **Executor-Hinweis (AgEn Phase 3):** Diesen Plan führt der von David gewählte Implementer (Claude `/implement` oder Codex `$implement`) **1:1 und inline** aus — keine Implementations-Subagents (AgEn-Regel „Subagents nur für Research"). Ablauf-Skill: `superpowers:executing-plans`. Checkboxen (`- [ ]`) tracken den Fortschritt. Jeder Task endet mit eigenem Commit. Gearbeitet wird auf Branch `feature/issue-1` (Workflow Step 14); PR + Merge triggert David (Step 19).

**Goal:** Spielbares Tag-1-Skelett des Lane-Runners „Verteidige dein Leben" (3 Spuren, Auto-Lauf, Swipe/Tasten, Münzen, eine Katastrophen-Wand, Look mit Licht/Schatten/Palette/Kulisse) — automatisch deployed unter `https://david08fritz-del.github.io/Diplomarbeit/spiel/`, als Beweis-Grundlage für Davids Go/No-Go am Tag-1-Gate.

**Architecture:** Vite-Projekt in `spiel/` mit strikter Naht: `sim` + `loop` sind reine TS-Module ohne Three.js-Import (Vitest-testbar, 2D-Fallback-Andockpunkt); `presentation` liest `sim`-Zustand und hält nie eigenen Spielzustand; `input` liefert Intents an `sim`; `ui` ist DOM-Overlay. Ein rAF-Loop mit Fixed-Timestep 1/60 + Akkumulator + Max-Delta-Klemme. Deploy per GitHub Action: Build landet als `spiel/`-Unterordner im Pages-Artefakt, Root bekommt einen Redirect-Platzhalter.

**Tech Stack:** TypeScript ~6.0 · Vite ^8.1 · Three.js ^0.185.1 (r185) · Vitest ^4.1 · @playwright/test (UI-Beleg, lokal + Live via `BASE_URL`) · GitHub Pages via Actions (checkout@v7, setup-node@v6, upload-pages-artifact@v5, deploy-pages@v5) · Node 24 (CI), lokal ≥ 22.12.

## Global Constraints

- **URL-Vertrag (PRD, fix):** Spiel unter `…/Diplomarbeit/spiel/` → Vite `base: '/Diplomarbeit/spiel/'`; Root `/Diplomarbeit/` nur Platzhalter/Redirect.
- **Naht (PRD, fix):** unter `spiel/src/sim/` und in `spiel/src/loop.ts` ist **kein `three`-Import** erlaubt. Verifikation in Task 10.
- **Regel 1 (DESIGN.md, absolut):** die Wand ist unausweichbar und unüberspringbar — im `sim`-Test verankert (Task 3).
- **Kein Backend, keine externen Requests zur Laufzeit:** keine CDN-Fonts (nur `system-ui`), Three.js gebündelt, keine Analytics.
- **Fixed-Timestep:** `FIXED_DT = 1/60`, `MAX_FRAME_DELTA = 0.25 s` (Klemme gegen Simulationssprung nach Tab-Wechsel).
- **Render-Budget:** Pixel-Ratio-Cap ≤ 2 **und** Canvas-Pixel-Deckel `RENDER_BUDGET_PIXEL = 2_800_000` (nie unter Faktor 1).
- **Sprache:** UI-Texte Deutsch, wortkarg. Identifier: Domänenbegriffe aus `DOMAIN.md` auf Deutsch ohne Umlaute (`muenzen`, `spur`, `wand`, `buehne`); Modul-/Ordnernamen wie in der PRD englisch (`sim`, `presentation`, `ui`, `input`).
- **Versionen (recherchiert 05.07.2026):** `three@^0.185.1`, `vite@^8.1.3`, `vitest@^4.1.9`, `typescript@~6.0.3`, `@types/three@latest`; CI `node-version: 24`.
- **Branch `feature/issue-1`** (Workflow Step 14, hart): alle Task-Commits landen dort; PR + Merge triggert David (Step 19). Live-Deploy nur auf `main` — die CI (Test + Build) läuft aber ab Task 4 bei jedem Push auf `feature/**`.
- **Browser-Baseline = WebGL2:** three r185 hat keinen WebGL1-Pfad mehr (Capabilities-Util kennt nur `isWebGL2Available()`); der „Ohne WebGL"-AC wird als WebGL2-Check implementiert und so dokumentiert.
- **Kein `--passWithNoTests`, kein Test-Skip:** CI läuft `npm test` erst, nachdem echte Tests existieren (Task-Reihenfolge stellt das sicher).

## Context-Manifest

- WAS/WARUM/Grill-Summary/Architecture: siehe `01-PRD.md` (komplett lesen)
- Issue: #1 — `gh issue view 1` (Tag-1-Skelett + Pages-Deploy, Typ HITL, Gate durch David)
- PRD-Critic-Outcomes (was wurde angepasst): siehe `02-PRD-critic.md` (Zusammenfassung auch in `01-PRD.md`, Further Notes)
- Design-Regeln (die 7 harten): `spiel/DESIGN.md` · Sprache/Begriffe: `DOMAIN.md`
- Codebase-Targets: **Greenfield** — `spiel/` enthält nur `DESIGN.md`. Neu: alles unter `spiel/` inkl. `playwright.config.ts` + `tests/tag1.spec.ts` (Files siehe Tasks), `.github/workflows/deploy.yml`, `deploy/root-index.html`. Modifiziert: `.gitignore`, `tech.md`, `CONTEXT.md` (2 Zeilen Map-Pflege).
- Bestehende Tests betroffen: keine (erstes Feature im Repo; diese Tests setzen den Standard)
- Research-Fakten (Subagent, 05.07.2026, Primärquellen npm/GitHub/three-Tarball): three 0.185.1 = r185 (`three/addons/capabilities/WebGL.js`, Default-Export, nur noch `isWebGL2Available()`); Vite 8.1.3 (Node ^20.19 ‖ ≥22.12); Vitest 4.1.9 (Vite-8-Peer ok, `environment: 'node'` Default, `dist/` nicht mehr auto-excluded); TS 6.0.3; Node 24 = Active LTS; Actions: checkout@v7, setup-node@v6, upload-pages-artifact@v5, deploy-pages@v5; `configure-pages enablement:true` braucht PAT → **David aktiviert Pages einmalig manuell** (Task 4); Actions-Artefakt wird 1:1 ohne Jekyll serviert (kein `.nojekyll` nötig).

## Implementation-WHY

- **Deploy-Pipeline als Task 4 (früh, aber nach den ersten sim-Tests):** Tracer-Bullet — die CI (Test + Build) läuft ab Task 4 bei jedem Push auf `feature/**`; der Live-Deploy triggert nur auf `main` und wird nach Davids Merge verifiziert (Task 12, Workflow Step 19). Nicht Task 2, weil die CI ab dem ersten Lauf `npm test` ehrlich ausführen soll (ohne `--passWithNoTests`-Hintertür braucht sie existierende Tests). Handy-Check vor dem Merge: `npm run dev` läuft mit `--host` im LAN.
- **UI-Beleg als `@playwright/test`-Spec statt Browser-Prosa:** implementer-agnostisch (Claude UND Codex können `npm run verify:ui` ausführen), maschinenprüfbare Assertions (HUD zählt, Bühne zentriert) statt Sichtprüfung; dieselbe Spec läuft per `BASE_URL` auch gegen die Live-URL (Task 12). Kein automatisierter Ohne-WebGL-Test: Headless-Flag-Verhalten ist browserabhängig flaky, der Fallback ist 6 Zeilen und per Review prüfbar.
- **„Ohne WebGL" = WebGL2-Check:** three r185 hat keinen WebGL1-Pfad mehr; die PRD-Browser-Baseline (~2 Jahre) kann durchgängig WebGL2. Constraint + `tech.md` sagen das explizit, damit AC, Code und Doku dieselbe Sprache sprechen.
- **Gate-Belege als Issue-Kommentar:** Handy-/iPad-Screenshots haben keinen automatischen Weg in Repo-Pfade; Davids Urteil + Screenshots landen als Kommentar auf Issue #1 (GitHub-App). Der Plan verlangt keine lokalen Pflicht-Dateien vom Gerät.
- **Render-Budget-Mechanismus (PRD delegiert an Phase 2):** DPR-Cap 2 **plus** Pixel-Deckel 2,8 MP als reine Funktion `berechnePixelRatio`. WHY: der Cap allein macht große iPads zu teuer (834×1194 CSS × 2² ≈ 4 MP); der Deckel drückt genau dort auf ~1,68× (≈ 2,8 MP), Handys bleiben bei 2×. Adaptive Render-Scale wäre Regelungs-Logik ohne Tag-1-Nutzen. Konstante ist nach dem FPS-Beleg tunebar.
- **Deterministisches Formel-Layout statt Level-Daten/RNG:** Münz-Reihen und Wand-Positionen als pure Funktionen des Index. WHY: Skelett braucht keinen Zufall → Tests trivial deterministisch; der seedbare RNG kommt erst mit dem Event-Würfeln (Issue #4). `presentation` liest dasselbe Layout aus `sim` — eine Quelle der Wahrheit.
- **Wand im Skelett = `wandDurchbruch`-Ereignis ohne Deckungslogik:** Deckung/Katastrophen-Auflösung ist Issue #4. Regel 1 wird trotzdem JETZT im sim-Test verankert (Kollision feuert auch mitten im Sprung und auf jeder Spur) — die Regel darf nie von späterem Code abhängen.
- **Kein `storage/`-Modul in diesem Issue:** Bestenliste ist Issue #5; die Naht ist die Modulgrenze, kein toter Platzhalter-Code (Karpathy: nichts Spekulatives). Gleiches gilt für `phase: 'lauf'` als Ein-Wert-Union — markiert die Stelle, an der Issue #3/#4 die Spielphasen anbauen, ohne jetzt State-Maschinerie zu erfinden.
- **FPS-Anzeige auch im Prod-Build hinter `?fps`:** Das Issue verlangt den Mess-Beleg „auf Davids Handy und iPad" — die testen die **deployte** URL, nicht den Dev-Server. `import.meta.env.DEV || ?fps` erfüllt beides wortgetreu.
- **Ereignisse als Rückgabe von `tick`** (`{ zustand, ereignisse }`): `presentation` braucht transiente Signale (Wand-Durchbruch-Feedback), ohne dass `sim` je Renderer-Wissen bekommt — exakt die PRD-Schnittstelle „Aktionen rein → neuer Zustand raus".

## Abnahme-Mapping (Issue-ACs → Tasks)

| Issue-AC | Task(s) |
|---|---|
| 3 Spuren, Auto-Lauf, Swipe links/rechts/hoch, Münzen, eine Wand | 2, 3, 6, 8, 10 |
| Desktop Pfeiltasten + Leertaste, zentrierte Hochformat-Bühne | 6, 7, 10 |
| Mindest-Look: Spuren/Wand lesbar, Figur bewegt, Licht+Schatten+Palette, Kulissen-Streifen | 8 |
| FPS-Anzeige, kein Scroll beim Swipe, kein Simulationssprung, Hochformat-Screenshot | 5, 6, 9, 10, 13 |
| Ohne WebGL(2) wortkarge Meldung | 9, 10 |
| Jeder Push auf `main` spielbar unter `…/Diplomarbeit/spiel/` | 4, 12 |
| GATE: Davids Urteil premium ja/nein | 13 (HITL) |

---

# 1:1 Steps

## Task 1: Projekt-Gerüst `spiel/`

**Files:**
- Create: `spiel/package.json`, `spiel/tsconfig.json`, `spiel/vite.config.ts`, `spiel/index.html`, `spiel/src/stil.css`, `spiel/src/main.ts` (Platzhalter, wird in Task 10 ersetzt)
- Modify: `.gitignore`

**Interfaces:**
- Produces: lauffähiges Vite-Projekt; `#buehne`-Element + CSS-Klassen (`#hud`, `.muenzen-punkt`, `.muenzen-zahl`, `#fps`, `.webgl-hinweis`), auf die Task 8/9 bauen.

- [ ] **Step 1: Branch anlegen + Node-Version prüfen**

Run: `git checkout -b feature/issue-1` (Workflow Step 14 — alle Task-Commits landen auf diesem Branch).
Run: `node -v` — erwartet ≥ 22.12 (Vite-8-Minimum). Falls älter: STOP, David Bescheid geben (Node-Update ist sein Call).

- [ ] **Step 2: Files anlegen**

`spiel/package.json`:
```json
{
  "name": "verteidige-dein-leben",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

`spiel/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

`spiel/vite.config.ts`:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Diplomarbeit/spiel/',
  test: {
    dir: 'src',
  },
})
```
(`test.dir: 'src'`, weil Vitest 4 `dist/` nicht mehr automatisch ausschließt.)

`spiel/index.html`:
```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Verteidige dein Leben</title>
  </head>
  <body>
    <div id="buehne"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`spiel/src/stil.css`:
```css
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  background: #10141f;
  overscroll-behavior: none;
}

body {
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
}

#buehne {
  position: relative;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

#buehne canvas {
  display: block;
}

#hud {
  position: absolute;
  top: max(10px, env(safe-area-inset-top));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}

.muenzen-punkt {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffc300;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.25);
}

#fps {
  position: absolute;
  left: 8px;
  bottom: max(8px, env(safe-area-inset-bottom));
  color: #fff;
  font: 12px/1.4 ui-monospace, monospace;
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

.webgl-hinweis {
  color: #e8e8e8;
  font-size: 18px;
  text-align: center;
  padding: 32px;
  max-width: 28ch;
}
```

`spiel/src/main.ts` (Platzhalter bis Task 10):
```ts
import './stil.css'
```

- [ ] **Step 3: `.gitignore` (Repo-Root) ergänzen**

Anhängen:
```
# Spiel-Build
spiel/node_modules/
spiel/dist/
```

- [ ] **Step 4: Dependencies installieren**

Run (in `spiel/`):
```bash
npm install three
npm install -D typescript vite vitest @types/three
```
Erwartet: `three@^0.185.1`, `vite@^8.1.3`, `vitest@^4.1.9`, `typescript@~6.0.3` im lockfile. Annahme sichtbar gemacht: falls `@types/three` noch bei 0.184.x steht, ist das ok (API-Fläche der genutzten Klassen ist stabil) — im Commit-Text notieren.

- [ ] **Step 5: Build verifizieren**

Run (in `spiel/`): `npm run build`
Erwartet: `tsc` still, Vite `✓ built` — `spiel/dist/index.html` existiert. (`npm test` erst ab Task 2 — jetzt gäbe es „No test files found".)

- [ ] **Step 6: Commit**

```bash
git add .gitignore spiel/package.json spiel/package-lock.json spiel/tsconfig.json spiel/vite.config.ts spiel/index.html spiel/src/stil.css spiel/src/main.ts
git commit -m "feat(spiel): Vite+TS+Three-Geruest mit Basis-CSS und URL-Vertrag als base"
```

## Task 2: `sim` — Zustand + Intents (TDD)

**Files:**
- Create: `spiel/src/sim/konstanten.ts`, `spiel/src/sim/zustand.ts`, `spiel/src/sim/sim.ts`
- Test: `spiel/src/sim/sim.test.ts`

**Interfaces:**
- Produces (für Tasks 3, 6, 8, 10):
  - `type Spur = 0 | 1 | 2`, `type SpielPhase = 'lauf'`, `type SimZustand = { phase, spur, z, hoehe, vSprung, muenzen, eingesammelt: ReadonlySet<string>, naechsteWand }`
  - `erzeugeStartZustand(): SimZustand`
  - `type Intent = 'links' | 'rechts' | 'sprung'`
  - `wendeIntentAn(zustand: SimZustand, intent: Intent): SimZustand`
  - Konstanten: `SPUR_ABSTAND = 2`, `LAUF_TEMPO = 8`, `SPRUNG_V0 = 7.2`, `GRAVITATION = 22`, `MUENZE_WERT = 10`, `MUENZE_FANGRADIUS = 0.8`, `WAND_INTERVALL = 50`, `REIHEN_ABSTAND = 6`, `MUENZEN_JE_REIHE = 3`, `MUENZEN_ZWISCHENRAUM = 1.2`

- [ ] **Step 1: Failing Tests schreiben**

`spiel/src/sim/sim.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { SPRUNG_V0 } from './konstanten'
import { erzeugeStartZustand } from './zustand'
import { wendeIntentAn } from './sim'

describe('wendeIntentAn', () => {
  it('wechselt die Spur nach links und klemmt am Rand', () => {
    let zustand = erzeugeStartZustand()
    expect(zustand.spur).toBe(1)
    zustand = wendeIntentAn(zustand, 'links')
    expect(zustand.spur).toBe(0)
    zustand = wendeIntentAn(zustand, 'links')
    expect(zustand.spur).toBe(0)
  })

  it('wechselt die Spur nach rechts und klemmt am Rand', () => {
    let zustand = wendeIntentAn(erzeugeStartZustand(), 'rechts')
    expect(zustand.spur).toBe(2)
    zustand = wendeIntentAn(zustand, 'rechts')
    expect(zustand.spur).toBe(2)
  })

  it('springt nur vom Boden aus, kein Doppelsprung', () => {
    const gesprungen = wendeIntentAn(erzeugeStartZustand(), 'sprung')
    expect(gesprungen.vSprung).toBe(SPRUNG_V0)
    const nochmal = wendeIntentAn(gesprungen, 'sprung')
    expect(nochmal).toEqual(gesprungen)
  })
})
```

- [ ] **Step 2: Fehlschlag verifizieren**

Run (in `spiel/`): `npm test`
Erwartet: FAIL — `Cannot find module './konstanten'` (o.ä. für `./zustand`/`./sim`).

- [ ] **Step 3: Implementieren**

`spiel/src/sim/konstanten.ts`:
```ts
export const SPUR_ABSTAND = 2
export const LAUF_TEMPO = 8
export const SPRUNG_V0 = 7.2
export const GRAVITATION = 22
export const MUENZE_WERT = 10
export const MUENZE_FANGRADIUS = 0.8
export const WAND_INTERVALL = 50
export const REIHEN_ABSTAND = 6
export const MUENZEN_JE_REIHE = 3
export const MUENZEN_ZWISCHENRAUM = 1.2
```

`spiel/src/sim/zustand.ts`:
```ts
export type Spur = 0 | 1 | 2

// Folge-Issues erweitern: 'onboarding' | 'station' | 'katastrophe' | 'bilanz'
export type SpielPhase = 'lauf'

export type SimZustand = {
  phase: SpielPhase
  spur: Spur
  z: number
  hoehe: number
  vSprung: number
  muenzen: number
  eingesammelt: ReadonlySet<string>
  naechsteWand: number
}

export function erzeugeStartZustand(): SimZustand {
  return {
    phase: 'lauf',
    spur: 1,
    z: 0,
    hoehe: 0,
    vSprung: 0,
    muenzen: 0,
    eingesammelt: new Set(),
    naechsteWand: 1,
  }
}
```

`spiel/src/sim/sim.ts`:
```ts
import { SPRUNG_V0 } from './konstanten'
import type { SimZustand, Spur } from './zustand'

export type Intent = 'links' | 'rechts' | 'sprung'

export function wendeIntentAn(zustand: SimZustand, intent: Intent): SimZustand {
  if (intent === 'sprung') {
    if (zustand.hoehe > 0 || zustand.vSprung !== 0) return zustand
    return { ...zustand, vSprung: SPRUNG_V0 }
  }
  const richtung = intent === 'links' ? -1 : 1
  const spur = Math.min(2, Math.max(0, zustand.spur + richtung)) as Spur
  if (spur === zustand.spur) return zustand
  return { ...zustand, spur }
}
```

- [ ] **Step 4: Tests grün verifizieren**

Run: `npm test` — Erwartet: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add spiel/src/sim
git commit -m "feat(spiel): sim-Zustand und Intents (Spurwechsel geklemmt, Sprung nur vom Boden) per TDD"
```

## Task 3: `sim` — tick: Laufen, Münzen, Wand (TDD)

**Files:**
- Create: `spiel/src/sim/muenzen.ts`
- Modify: `spiel/src/sim/sim.ts` (tick + Ereignisse ergänzen)
- Test: `spiel/src/sim/muenzen.test.ts`, `spiel/src/sim/sim.test.ts` (erweitern)

**Interfaces:**
- Produces (für Tasks 8, 10):
  - `type Muenze = { id: string; spur: Spur; z: number }`
  - `muenzenInReihe(reihe: number): Muenze[]` · `muenzenImBereich(zMin: number, zMax: number): Muenze[]`
  - `type SimEreignis = { art: 'muenze'; id: string } | { art: 'wandDurchbruch'; z: number }`
  - `tick(zustand: SimZustand, dt: number): { zustand: SimZustand; ereignisse: SimEreignis[] }`
- Layout-Festlegung: Reihe `i` (ab 1) liegt bei `z = i*6` auf Spur `[1,0,2,1,2,0][i % 6]`, 3 Münzen im 1,2-Abstand; Münzen näher als 2,5 an einer Wand (`z % 50`) entfallen. Wände bei `z = 50, 100, …`.

- [ ] **Step 1: Failing Tests schreiben**

`spiel/src/sim/muenzen.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { muenzenImBereich, muenzenInReihe } from './muenzen'

describe('muenzenInReihe', () => {
  it('legt Reihen im 6er-Abstand auf wechselnde Spuren', () => {
    expect(muenzenInReihe(1)[0]).toEqual({ id: '1-0', spur: 0, z: 6 })
    expect(muenzenInReihe(1)).toHaveLength(3)
    expect(muenzenInReihe(2).map((m) => m.spur)).toEqual([2, 2, 2])
  })

  it('laesst nahe der Wand keine Muenzen entstehen', () => {
    expect(muenzenInReihe(8)).toEqual([]) // z 48–50.4 kollidiert mit Wand bei 50
  })
})

describe('muenzenImBereich', () => {
  it('liefert genau die Muenzen im Fenster', () => {
    const ids = muenzenImBereich(5.5, 7.5).map((m) => m.id)
    expect(ids).toEqual(['1-0', '1-1'])
  })
})
```

In `spiel/src/sim/sim.test.ts` ergänzen (Imports erweitern um `LAUF_TEMPO`, `MUENZE_WERT`, `tick`, `SimZustand`, `SimEreignis`):
```ts
function laufe(zustand: SimZustand, bisZ: number) {
  const ereignisse: SimEreignis[] = []
  while (zustand.z < bisZ) {
    const ergebnis = tick(zustand, 1 / 60)
    zustand = ergebnis.zustand
    ereignisse.push(...ergebnis.ereignisse)
  }
  return { zustand, ereignisse }
}

describe('tick', () => {
  it('laeuft mit LAUF_TEMPO vorwaerts', () => {
    const { zustand } = tick(erzeugeStartZustand(), 1 / 60)
    expect(zustand.z).toBeCloseTo(LAUF_TEMPO / 60)
  })

  it('steigt beim Sprung ueber 1 und landet wieder bei 0', () => {
    let zustand = wendeIntentAn(erzeugeStartZustand(), 'sprung')
    let maxHoehe = 0
    for (let i = 0; i < 120; i++) {
      zustand = tick(zustand, 1 / 60).zustand
      maxHoehe = Math.max(maxHoehe, zustand.hoehe)
    }
    expect(maxHoehe).toBeGreaterThan(1)
    expect(zustand.hoehe).toBe(0)
    expect(zustand.vSprung).toBe(0)
  })

  it('sammelt Muenzen nur auf der eigenen Spur, jede genau einmal', () => {
    // Reihe 1 liegt auf Spur 0 bei z 6–8.4
    const links = wendeIntentAn(erzeugeStartZustand(), 'links')
    expect(laufe(links, 10).zustand.muenzen).toBe(3 * MUENZE_WERT)
    // ohne Spurwechsel (Spur 1): dort liegt nichts
    expect(laufe(erzeugeStartZustand(), 10).zustand.muenzen).toBe(0)
  })

  it('Wand-Durchbruch feuert auch mitten im Sprung und nach Spurwechsel (Regel 1)', () => {
    let { zustand } = laufe(wendeIntentAn(erzeugeStartZustand(), 'links'), 48)
    zustand = wendeIntentAn(zustand, 'sprung')
    let hoeheBeimDurchbruch = -1
    while (zustand.z < 52) {
      const ergebnis = tick(zustand, 1 / 60)
      zustand = ergebnis.zustand
      if (ergebnis.ereignisse.some((e) => e.art === 'wandDurchbruch')) {
        hoeheBeimDurchbruch = zustand.hoehe
      }
    }
    expect(hoeheBeimDurchbruch).toBeGreaterThan(1) // war in der Luft — Wand zaehlt trotzdem
    expect(zustand.naechsteWand).toBe(2)
  })
})
```

- [ ] **Step 2: Fehlschlag verifizieren**

Run: `npm test`
Erwartet: FAIL — `muenzen.ts` fehlt, `tick` nicht exportiert.

- [ ] **Step 3: Implementieren**

`spiel/src/sim/muenzen.ts`:
```ts
import {
  MUENZEN_JE_REIHE,
  MUENZEN_ZWISCHENRAUM,
  REIHEN_ABSTAND,
  WAND_INTERVALL,
} from './konstanten'
import type { Spur } from './zustand'

export type Muenze = { id: string; spur: Spur; z: number }

const REIHEN_SPUREN: Spur[] = [1, 0, 2, 1, 2, 0]
const WAND_FREIRAUM = 2.5

export function muenzenInReihe(reihe: number): Muenze[] {
  const spur = REIHEN_SPUREN[reihe % REIHEN_SPUREN.length]
  const ergebnis: Muenze[] = []
  for (let k = 0; k < MUENZEN_JE_REIHE; k++) {
    const z = reihe * REIHEN_ABSTAND + k * MUENZEN_ZWISCHENRAUM
    const abstandImIntervall = z % WAND_INTERVALL
    if (abstandImIntervall > WAND_INTERVALL - WAND_FREIRAUM || abstandImIntervall < WAND_FREIRAUM) continue
    ergebnis.push({ id: `${reihe}-${k}`, spur, z })
  }
  return ergebnis
}

export function muenzenImBereich(zMin: number, zMax: number): Muenze[] {
  const reihenLaenge = (MUENZEN_JE_REIHE - 1) * MUENZEN_ZWISCHENRAUM
  const erste = Math.max(1, Math.floor((zMin - reihenLaenge) / REIHEN_ABSTAND))
  const letzte = Math.max(0, Math.floor(zMax / REIHEN_ABSTAND))
  const ergebnis: Muenze[] = []
  for (let reihe = erste; reihe <= letzte; reihe++) {
    for (const muenze of muenzenInReihe(reihe)) {
      if (muenze.z >= zMin && muenze.z <= zMax) ergebnis.push(muenze)
    }
  }
  return ergebnis
}
```

In `spiel/src/sim/sim.ts` ergänzen (Imports erweitern um `GRAVITATION`, `LAUF_TEMPO`, `MUENZE_FANGRADIUS`, `MUENZE_WERT`, `WAND_INTERVALL` und `muenzenImBereich`):
```ts
export type SimEreignis =
  | { art: 'muenze'; id: string }
  | { art: 'wandDurchbruch'; z: number }

export function tick(
  zustand: SimZustand,
  dt: number,
): { zustand: SimZustand; ereignisse: SimEreignis[] } {
  const ereignisse: SimEreignis[] = []
  const z = zustand.z + LAUF_TEMPO * dt

  let hoehe = zustand.hoehe
  let vSprung = zustand.vSprung
  if (hoehe > 0 || vSprung > 0) {
    hoehe += vSprung * dt
    vSprung -= GRAVITATION * dt
    if (hoehe <= 0) {
      hoehe = 0
      vSprung = 0
    }
  }

  let muenzen = zustand.muenzen
  let eingesammelt = zustand.eingesammelt
  for (const muenze of muenzenImBereich(z - MUENZE_FANGRADIUS, z + MUENZE_FANGRADIUS)) {
    if (muenze.spur !== zustand.spur || eingesammelt.has(muenze.id)) continue
    if (eingesammelt === zustand.eingesammelt) eingesammelt = new Set(eingesammelt)
    ;(eingesammelt as Set<string>).add(muenze.id)
    muenzen += MUENZE_WERT
    ereignisse.push({ art: 'muenze', id: muenze.id })
  }

  let naechsteWand = zustand.naechsteWand
  if (z >= naechsteWand * WAND_INTERVALL) {
    ereignisse.push({ art: 'wandDurchbruch', z: naechsteWand * WAND_INTERVALL })
    naechsteWand += 1
  }

  return {
    zustand: { ...zustand, z, hoehe, vSprung, muenzen, eingesammelt, naechsteWand },
    ereignisse,
  }
}
```

- [ ] **Step 4: Tests grün verifizieren**

Run: `npm test` — Erwartet: alle Tests passed (sim + muenzen).

- [ ] **Step 5: Commit**

```bash
git add spiel/src/sim
git commit -m "feat(spiel): sim-tick mit Muenz-Einsammeln und Wand-Durchbruch, Regel 1 im Test verankert"
```

## Task 4: Deploy-Pipeline (GitHub Pages, URL-Vertrag)

**Files:**
- Create: `.github/workflows/deploy.yml`, `deploy/root-index.html`

**Interfaces:**
- Produces: CI (`npm test` + `npm run build`) bei jedem Push auf `main` + `feature/**` und bei jedem PR; Deploy-Job nur auf `main` → nach Davids Merge ist `https://david08fritz-del.github.io/Diplomarbeit/spiel/` automatisch aktuell (Verifikation: Task 12).

- [ ] **Step 1 (HITL, David, einmalig): Pages aktivieren**

GitHub → Repo `Diplomarbeit` → Settings → Pages → „Build and deployment" → Source: **GitHub Actions**. (Automatisch ginge nur mit PAT — bewusst nicht; Recherche-Fakt.) Ohne diesen Schritt schlägt der Deploy-Job fehl — dann hier zurück.

- [ ] **Step 2: Root-Platzhalter anlegen**

`deploy/root-index.html` (wird später durch die Webseite ersetzt):
```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=./spiel/" />
    <title>Diplomarbeit — Verteidige dein Leben</title>
  </head>
  <body>
    <p><a href="./spiel/">Zum Spiel „Verteidige dein Leben"</a></p>
  </body>
</html>
```

- [ ] **Step 3: Workflow anlegen**

`.github/workflows/deploy.yml`:
```yaml
name: deploy

on:
  push:
    branches: [main, 'feature/**']
  pull_request:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: spiel
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: spiel/package-lock.json
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Pages-Artefakt zusammenstellen (Spiel als Unterordner, Root-Platzhalter)
        if: github.ref == 'refs/heads/main'
        working-directory: ${{ github.workspace }}
        run: |
          mkdir -p _site/spiel
          cp -r spiel/dist/. _site/spiel/
          cp deploy/root-index.html _site/index.html
      - uses: actions/upload-pages-artifact@v5
        if: github.ref == 'refs/heads/main'
        with:
          path: _site

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 4: Commit + Branch-Push + CI beobachten**

```bash
git add .github/workflows/deploy.yml deploy/root-index.html
git commit -m "feat(deploy): Pages-Workflow mit Test-Gate, Spiel als spiel/-Unterordner, Root-Redirect"
git push -u origin feature/issue-1
gh run watch --exit-status
```
Erwartet: `build`-Job grün (`npm test` + `npm run build`); Artefakt-/`deploy`-Steps werden übersprungen (`if: main`). Die Live-Verifikation des URL-Vertrags passiert nach Davids Merge in Task 12.

## Task 5: Fixed-Timestep-Loop (TDD)

**Files:**
- Create: `spiel/src/loop.ts`
- Test: `spiel/src/loop.test.ts`

**Interfaces:**
- Produces (für Task 10): `FIXED_DT = 1/60`, `MAX_FRAME_DELTA = 0.25`, `schritteFuerFrame(akkumulator: number, frameDelta: number): { schritte: number; rest: number }`, `starteLoop(hooks: { simSchritt: () => void; zeichne: (jetztMs: number) => void }): () => void`
- Kein `three`-Import (Naht-Regel gilt auch hier).

- [ ] **Step 1: Failing Tests schreiben**

`spiel/src/loop.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { FIXED_DT, MAX_FRAME_DELTA, schritteFuerFrame } from './loop'

describe('schritteFuerFrame', () => {
  it('ein 60-Hz-Frame ergibt genau einen Schritt', () => {
    const { schritte, rest } = schritteFuerFrame(0, 1 / 60)
    expect(schritte).toBe(1)
    expect(rest).toBeCloseTo(0, 9)
  })

  it('120-Hz-Frames driften nicht (kein Tempo-Drift)', () => {
    let akkumulator = 0
    let gesamt = 0
    for (let i = 0; i < 120; i++) {
      const ergebnis = schritteFuerFrame(akkumulator, 1 / 120)
      akkumulator = ergebnis.rest
      gesamt += ergebnis.schritte
    }
    expect(gesamt).toBe(60)
  })

  it('klemmt den Frame-Delta nach Tab-Wechsel (kein Simulationssprung)', () => {
    const { schritte } = schritteFuerFrame(0, 3.0)
    expect(schritte).toBeLessThanOrEqual(Math.round(MAX_FRAME_DELTA / FIXED_DT))
  })
})
```

- [ ] **Step 2: Fehlschlag verifizieren**

Run: `npm test` — Erwartet: FAIL — `Cannot find module './loop'`.

- [ ] **Step 3: Implementieren**

`spiel/src/loop.ts`:
```ts
export const FIXED_DT = 1 / 60
export const MAX_FRAME_DELTA = 0.25

export function schritteFuerFrame(
  akkumulator: number,
  frameDelta: number,
): { schritte: number; rest: number } {
  let rest = akkumulator + Math.min(frameDelta, MAX_FRAME_DELTA)
  let schritte = 0
  while (rest >= FIXED_DT) {
    rest -= FIXED_DT
    schritte += 1
  }
  return { schritte, rest }
}

export function starteLoop(hooks: {
  simSchritt: () => void
  zeichne: (jetztMs: number) => void
}): () => void {
  let akkumulator = 0
  let letzteZeitMs: number | null = null
  let handle = 0

  function frame(jetztMs: number) {
    if (letzteZeitMs !== null) {
      const ergebnis = schritteFuerFrame(akkumulator, (jetztMs - letzteZeitMs) / 1000)
      akkumulator = ergebnis.rest
      for (let i = 0; i < ergebnis.schritte; i++) hooks.simSchritt()
    }
    letzteZeitMs = jetztMs
    hooks.zeichne(jetztMs)
    handle = requestAnimationFrame(frame)
  }

  handle = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(handle)
}
```

- [ ] **Step 4: Tests grün verifizieren**

Run: `npm test` — Erwartet: alle passed.

- [ ] **Step 5: Commit**

```bash
git add spiel/src/loop.ts spiel/src/loop.test.ts
git commit -m "feat(spiel): rAF-Loop mit Fixed-Timestep, Akkumulator und Max-Delta-Klemme per TDD"
```

## Task 6: Eingabe — Swipe + Tastatur (TDD für die Klassifikation)

**Files:**
- Create: `spiel/src/input/eingabe.ts`
- Test: `spiel/src/input/eingabe.test.ts`

**Interfaces:**
- Consumes: `Intent` aus `../sim/sim`
- Produces (für Task 10): `SWIPE_MIN_DISTANZ = 24`, `klassifiziereSwipe(dx: number, dy: number, minDistanz?: number): Intent | null`, `verbindeEingabe(ziel: HTMLElement, anIntent: (intent: Intent) => void): void`

- [ ] **Step 1: Failing Tests schreiben**

`spiel/src/input/eingabe.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { klassifiziereSwipe } from './eingabe'

describe('klassifiziereSwipe', () => {
  it('erkennt horizontale Swipes ab Mindest-Distanz', () => {
    expect(klassifiziereSwipe(-40, 5)).toBe('links')
    expect(klassifiziereSwipe(40, -10)).toBe('rechts')
    expect(klassifiziereSwipe(10, 5)).toBeNull()
  })

  it('Swipe nach oben ist Sprung, nach unten ist nichts', () => {
    expect(klassifiziereSwipe(5, -60)).toBe('sprung')
    expect(klassifiziereSwipe(5, 60)).toBeNull()
  })

  it('dominante Achse entscheidet', () => {
    expect(klassifiziereSwipe(-50, -30)).toBe('links')
    expect(klassifiziereSwipe(20, -50)).toBe('sprung')
  })
})
```

- [ ] **Step 2: Fehlschlag verifizieren**

Run: `npm test` — Erwartet: FAIL — `Cannot find module './eingabe'`.

- [ ] **Step 3: Implementieren**

`spiel/src/input/eingabe.ts`:
```ts
import type { Intent } from '../sim/sim'

export const SWIPE_MIN_DISTANZ = 24

export function klassifiziereSwipe(
  dx: number,
  dy: number,
  minDistanz = SWIPE_MIN_DISTANZ,
): Intent | null {
  if (Math.abs(dx) < minDistanz && Math.abs(dy) < minDistanz) return null
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'links' : 'rechts'
  return dy < 0 ? 'sprung' : null
}

export function verbindeEingabe(ziel: HTMLElement, anIntent: (intent: Intent) => void): void {
  let start: { x: number; y: number; pointerId: number } | null = null

  ziel.addEventListener('pointerdown', (e) => {
    start = { x: e.clientX, y: e.clientY, pointerId: e.pointerId }
    ziel.setPointerCapture(e.pointerId)
  })

  ziel.addEventListener('pointerup', (e) => {
    if (!start || e.pointerId !== start.pointerId) return
    const intent = klassifiziereSwipe(e.clientX - start.x, e.clientY - start.y)
    start = null
    if (intent) anIntent(intent)
  })

  ziel.addEventListener('pointercancel', () => {
    start = null
  })

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    const intent: Intent | null =
      e.key === 'ArrowLeft'
        ? 'links'
        : e.key === 'ArrowRight'
          ? 'rechts'
          : e.key === ' ' || e.key === 'ArrowUp'
            ? 'sprung'
            : null
    if (intent) {
      e.preventDefault()
      anIntent(intent)
    }
  })
}
```

- [ ] **Step 4: Tests grün verifizieren**

Run: `npm test` — Erwartet: alle passed.

- [ ] **Step 5: Commit**

```bash
git add spiel/src/input
git commit -m "feat(spiel): Pointer-Swipe und Tastatur als Intent-Quelle, Klassifikation per TDD"
```

## Task 7: Bühne + Render-Budget (TDD für die Berechnung)

**Files:**
- Create: `spiel/src/presentation/buehne.ts`
- Test: `spiel/src/presentation/buehne.test.ts`

**Interfaces:**
- Produces (für Task 8): `berechneBuehne(fensterBreite: number, fensterHoehe: number): { breite: number; hoehe: number }`, `RENDER_BUDGET_PIXEL = 2_800_000`, `berechnePixelRatio(geraetePixelRatio: number, breite: number, hoehe: number): number`
- Regeln: Hochformat-Fenster → Bühne = ganzes Fenster; Quer/Desktop → zentrierte 9:16-Bühne in voller Höhe. Pixel-Ratio = `max(1, min(dpr, 2, sqrt(Budget/(b*h))))`.

- [ ] **Step 1: Failing Tests schreiben**

`spiel/src/presentation/buehne.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { berechneBuehne, berechnePixelRatio, RENDER_BUDGET_PIXEL } from './buehne'

describe('berechneBuehne', () => {
  it('Hochformat-Fenster fuellt die Buehne komplett', () => {
    expect(berechneBuehne(390, 844)).toEqual({ breite: 390, hoehe: 844 })
  })

  it('Querformat bekommt eine zentrierte 9:16-Buehne', () => {
    expect(berechneBuehne(1920, 1080)).toEqual({ breite: 608, hoehe: 1080 })
  })
})

describe('berechnePixelRatio', () => {
  it('Handy klemmt beim DPR-Cap 2', () => {
    expect(berechnePixelRatio(3, 390, 844)).toBe(2)
  })

  it('iPad bleibt unterm Render-Budget', () => {
    const pr = berechnePixelRatio(2, 834, 1194)
    expect(pr).toBeLessThan(2)
    expect(834 * pr * (1194 * pr)).toBeLessThanOrEqual(RENDER_BUDGET_PIXEL * 1.001)
  })

  it('faellt nie unter 1 und nie ueber den Geraete-DPR', () => {
    expect(berechnePixelRatio(2, 2000, 3000)).toBe(1)
    expect(berechnePixelRatio(1, 390, 844)).toBe(1)
  })
})
```

- [ ] **Step 2: Fehlschlag verifizieren**

Run: `npm test` — Erwartet: FAIL — `Cannot find module './buehne'`.

- [ ] **Step 3: Implementieren**

`spiel/src/presentation/buehne.ts`:
```ts
export const RENDER_BUDGET_PIXEL = 2_800_000

export function berechneBuehne(
  fensterBreite: number,
  fensterHoehe: number,
): { breite: number; hoehe: number } {
  if (fensterBreite < fensterHoehe) return { breite: fensterBreite, hoehe: fensterHoehe }
  return { breite: Math.round((fensterHoehe * 9) / 16), hoehe: fensterHoehe }
}

export function berechnePixelRatio(
  geraetePixelRatio: number,
  breite: number,
  hoehe: number,
): number {
  const budget = Math.sqrt(RENDER_BUDGET_PIXEL / (breite * hoehe))
  return Math.max(1, Math.min(geraetePixelRatio, 2, budget))
}
```

- [ ] **Step 4: Tests grün verifizieren**

Run: `npm test` — Erwartet: alle passed.

- [ ] **Step 5: Commit**

```bash
git add spiel/src/presentation
git commit -m "feat(spiel): Hochformat-Buehne und Render-Budget (DPR-Cap 2 + 2.8-MP-Deckel) per TDD"
```

## Task 8: Szene, Figur, Welt, Kulisse (Three.js)

**Files:**
- Create: `spiel/src/presentation/palette.ts`, `spiel/src/presentation/szene.ts`, `spiel/src/presentation/figur.ts`, `spiel/src/presentation/welt.ts`, `spiel/src/presentation/praesentation.ts`

**Interfaces:**
- Consumes: `SimZustand`, `SimEreignis`, `SPUR_ABSTAND`, `WAND_INTERVALL`, `muenzenImBereich` aus `sim` (nur lesend — `sim` importiert NIE aus `presentation`); `berechneBuehne`/`berechnePixelRatio` aus Task 7.
- Produces (für Task 10): `erzeugePraesentation(buehnenElement: HTMLElement): Praesentation` mit `zeichne(zustand: SimZustand, zeitS: number): void`, `verarbeiteEreignisse(ereignisse: SimEreignis[]): void`, `passeGroesseAn(): void`
- Keine Unit-Tests (Rendering laut PRD-Testing-Decisions); Verifikation visuell in Step 6.

- [ ] **Step 1: Palette anlegen**

`spiel/src/presentation/palette.ts`:
```ts
export const PALETTE = {
  himmel: 0x8ecae6,
  boden: 0x80c95f,
  spur: 0xe9dcc3,
  spurRand: 0xcdb98e,
  figurKoerper: 0xff6b35,
  figurKopf: 0xffd9a0,
  figurHose: 0x30588c,
  muenze: 0xffc300,
  wand: 0xd64550,
  hausWaende: [0xf4a261, 0xe07a5f, 0x94d2bd],
  hausDach: 0x8a5a44,
  baumStamm: 0x8a5a44,
  baumKrone: 0x52b788,
  busch: 0x74c69d,
} as const
```

- [ ] **Step 2: Szene + Kamera + Licht**

`spiel/src/presentation/szene.ts`:
```ts
import * as THREE from 'three'
import { PALETTE } from './palette'

export function erzeugeSzene() {
  const szene = new THREE.Scene()
  szene.background = new THREE.Color(PALETTE.himmel)
  szene.fog = new THREE.Fog(PALETTE.himmel, 45, 95)

  const kamera = new THREE.PerspectiveCamera(58, 9 / 16, 0.1, 130)

  szene.add(new THREE.AmbientLight(0xffffff, 0.55))
  const sonne = new THREE.DirectionalLight(0xfff3d6, 1.7)
  sonne.castShadow = true
  sonne.shadow.mapSize.set(1024, 1024)
  sonne.shadow.camera.left = -14
  sonne.shadow.camera.right = 14
  sonne.shadow.camera.top = 30
  sonne.shadow.camera.bottom = -12
  sonne.shadow.camera.near = 1
  sonne.shadow.camera.far = 60
  szene.add(sonne, sonne.target)

  function folge(figurX: number, figurZ: number) {
    kamera.position.set(figurX * 0.4, 4.6, figurZ - 7)
    kamera.lookAt(figurX * 0.4, 1.0, figurZ + 6)
    sonne.position.set(8, 14, figurZ - 6)
    sonne.target.position.set(0, 0, figurZ + 8)
  }

  return { szene, kamera, folge }
}
```

- [ ] **Step 3: Figur (Box-Männchen mit Lauf-Animation)**

`spiel/src/presentation/figur.ts`:
```ts
import * as THREE from 'three'
import { SPUR_ABSTAND } from '../sim/konstanten'
import type { SimZustand } from '../sim/zustand'
import { PALETTE } from './palette'

function material(farbe: number) {
  return new THREE.MeshLambertMaterial({ color: farbe, flatShading: true })
}

export function erzeugeFigur() {
  const gruppe = new THREE.Group()

  const koerper = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.95, 0.5), material(PALETTE.figurKoerper))
  koerper.position.y = 0.98
  const kopf = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), material(PALETTE.figurKopf))
  kopf.position.y = 1.78

  const beinGeometrie = new THREE.BoxGeometry(0.26, 0.5, 0.3)
  beinGeometrie.translate(0, -0.25, 0) // Drehpunkt an der Huefte
  const beinLinks = new THREE.Mesh(beinGeometrie, material(PALETTE.figurHose))
  beinLinks.position.set(-0.2, 0.5, 0)
  const beinRechts = new THREE.Mesh(beinGeometrie, material(PALETTE.figurHose))
  beinRechts.position.set(0.2, 0.5, 0)

  for (const teil of [koerper, kopf, beinLinks, beinRechts]) {
    teil.castShadow = true
    gruppe.add(teil)
  }

  function animiere(figurX: number, zustand: SimZustand, zeitS: number) {
    const amBoden = zustand.hoehe === 0
    const wippen = amBoden ? Math.abs(Math.sin(zeitS * 14)) * 0.06 : 0
    gruppe.position.set(figurX, zustand.hoehe + wippen, zustand.z)

    const zielX = (zustand.spur - 1) * SPUR_ABSTAND
    gruppe.rotation.z = THREE.MathUtils.clamp((figurX - zielX) * 0.12, -0.25, 0.25)

    const schwung = Math.sin(zeitS * 14)
    beinLinks.rotation.x = amBoden ? schwung * 0.9 : 0.5
    beinRechts.rotation.x = amBoden ? -schwung * 0.9 : -0.3
  }

  return { gruppe, animiere }
}
```

- [ ] **Step 4: Welt (Spurband, Wiese, Kulisse, Münzen-Pool, Wand)**

`spiel/src/presentation/welt.ts`:
```ts
import * as THREE from 'three'
import { SPUR_ABSTAND, WAND_INTERVALL } from '../sim/konstanten'
import { muenzenImBereich } from '../sim/muenzen'
import type { SimZustand } from '../sim/zustand'
import { PALETTE } from './palette'

const SEGMENT_LAENGE = 30
const SEGMENTE = 6
const MUENZEN_POOL = 36
const DURCHBRUCH_DAUER = 0.5

function material(farbe: number) {
  return new THREE.MeshLambertMaterial({ color: farbe, flatShading: true })
}

function baueKulisse(segment: THREE.Group, segmentIndex: number) {
  for (let slot = 0; slot < 6; slot++) {
    for (const seite of [-1, 1]) {
      const zLokal = -SEGMENT_LAENGE / 2 + 2.5 + slot * 5
      const x = seite * (5.2 + (((segmentIndex * 6 + slot) * 7) % 3) * 0.5)
      const art = (segmentIndex * 6 + slot + (seite === 1 ? 1 : 0)) % 3
      const gruppe = new THREE.Group()
      if (art === 0) {
        const wandFarbe = PALETTE.hausWaende[(segmentIndex + slot) % PALETTE.hausWaende.length]
        const haus = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), material(wandFarbe))
        haus.position.y = 1.1
        const dach = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 2.8), material(PALETTE.hausDach))
        dach.position.y = 2.5
        gruppe.add(haus, dach)
      } else if (art === 1) {
        const stamm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.3, 0.35), material(PALETTE.baumStamm))
        stamm.position.y = 0.65
        const krone = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 1.5), material(PALETTE.baumKrone))
        krone.position.y = 2.1
        gruppe.add(stamm, krone)
      } else {
        const busch = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.1), material(PALETTE.busch))
        busch.position.y = 0.4
        gruppe.add(busch)
      }
      gruppe.position.set(x, 0, zLokal)
      gruppe.traverse((kind) => {
        if (kind instanceof THREE.Mesh) kind.castShadow = true
      })
      segment.add(gruppe)
    }
  }
}

export function erzeugeWelt(szene: THREE.Scene) {
  const segmente: THREE.Group[] = []
  for (let i = 0; i < SEGMENTE; i++) {
    const segment = new THREE.Group()

    const spurband = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.5, SEGMENT_LAENGE), material(PALETTE.spur))
    spurband.position.y = -0.25
    spurband.receiveShadow = true
    segment.add(spurband)

    for (const x of [-1, 1]) {
      const linie = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, SEGMENT_LAENGE), material(PALETTE.spurRand))
      linie.position.set(x * (SPUR_ABSTAND / 2), 0.02, 0)
      segment.add(linie)
    }

    for (const seite of [-1, 1]) {
      const wiese = new THREE.Mesh(new THREE.BoxGeometry(14, 0.44, SEGMENT_LAENGE), material(PALETTE.boden))
      wiese.position.set(seite * 10.4, -0.28, 0)
      wiese.receiveShadow = true
      segment.add(wiese)
    }

    baueKulisse(segment, i)
    segment.position.z = i * SEGMENT_LAENGE
    szene.add(segment)
    segmente.push(segment)
  }

  const muenzGeometrie = new THREE.BoxGeometry(0.55, 0.55, 0.14)
  const muenzMaterial = material(PALETTE.muenze)
  const muenzenPool: THREE.Mesh[] = []
  for (let i = 0; i < MUENZEN_POOL; i++) {
    const muenze = new THREE.Mesh(muenzGeometrie, muenzMaterial)
    muenze.castShadow = true
    muenze.visible = false
    szene.add(muenze)
    muenzenPool.push(muenze)
  }

  const wand = new THREE.Mesh(new THREE.BoxGeometry(6.8, 3, 0.7), material(PALETTE.wand))
  wand.castShadow = true
  szene.add(wand)

  let durchbruchAngefordert = false
  let durchbruchZeit = -1
  let durchbruchZ = 0

  function aktualisiere(zustand: SimZustand, zeitS: number) {
    for (const segment of segmente) {
      while (segment.position.z + SEGMENT_LAENGE / 2 < zustand.z - 10) {
        segment.position.z += SEGMENTE * SEGMENT_LAENGE
      }
    }

    const sichtbar = muenzenImBereich(zustand.z - 6, zustand.z + 55).filter(
      (m) => !zustand.eingesammelt.has(m.id),
    )
    for (let i = 0; i < muenzenPool.length; i++) {
      const mesh = muenzenPool[i]
      const muenze = sichtbar[i]
      mesh.visible = Boolean(muenze)
      if (muenze) {
        mesh.position.set((muenze.spur - 1) * SPUR_ABSTAND, 0.75, muenze.z)
        mesh.rotation.y = zeitS * 3
      }
    }

    if (durchbruchAngefordert) {
      durchbruchAngefordert = false
      durchbruchZeit = zeitS
      durchbruchZ = (zustand.naechsteWand - 1) * WAND_INTERVALL
    }
    const durchbruchAktiv = durchbruchZeit >= 0 && zeitS - durchbruchZeit < DURCHBRUCH_DAUER
    if (durchbruchAktiv) {
      const t = (zeitS - durchbruchZeit) / DURCHBRUCH_DAUER
      wand.position.set(0, 1.5 - 1.5 * t, durchbruchZ)
      wand.scale.set(1 + t * 0.4, Math.max(0.01, 1 - t), 1)
    } else {
      wand.scale.set(1, 1, 1)
      wand.position.set(0, 1.5, zustand.naechsteWand * WAND_INTERVALL)
    }
  }

  function wandDurchbrochen() {
    durchbruchAngefordert = true
  }

  return { aktualisiere, wandDurchbrochen }
}
```

- [ ] **Step 5: Präsentation (Renderer + Verdrahtung)**

`spiel/src/presentation/praesentation.ts`:
```ts
import * as THREE from 'three'
import { SPUR_ABSTAND } from '../sim/konstanten'
import type { SimEreignis } from '../sim/sim'
import type { SimZustand } from '../sim/zustand'
import { berechneBuehne, berechnePixelRatio } from './buehne'
import { erzeugeFigur } from './figur'
import { erzeugeSzene } from './szene'
import { erzeugeWelt } from './welt'

export type Praesentation = {
  zeichne(zustand: SimZustand, zeitS: number): void
  verarbeiteEreignisse(ereignisse: SimEreignis[]): void
  passeGroesseAn(): void
}

export function erzeugePraesentation(buehnenElement: HTMLElement): Praesentation {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  buehnenElement.appendChild(renderer.domElement)

  const { szene, kamera, folge } = erzeugeSzene()
  const figur = erzeugeFigur()
  szene.add(figur.gruppe)
  const welt = erzeugeWelt(szene)

  let figurX = 0
  let letzteZeitS: number | null = null

  function passeGroesseAn() {
    const { breite, hoehe } = berechneBuehne(window.innerWidth, window.innerHeight)
    buehnenElement.style.width = `${breite}px`
    buehnenElement.style.height = `${hoehe}px`
    renderer.setPixelRatio(berechnePixelRatio(window.devicePixelRatio, breite, hoehe))
    renderer.setSize(breite, hoehe)
    kamera.aspect = breite / hoehe
    kamera.updateProjectionMatrix()
  }
  passeGroesseAn()

  return {
    passeGroesseAn,
    verarbeiteEreignisse(ereignisse) {
      for (const ereignis of ereignisse) {
        if (ereignis.art === 'wandDurchbruch') welt.wandDurchbrochen()
      }
    },
    zeichne(zustand, zeitS) {
      const dt = letzteZeitS === null ? 0 : Math.min(0.1, Math.max(0, zeitS - letzteZeitS))
      letzteZeitS = zeitS

      const zielX = (zustand.spur - 1) * SPUR_ABSTAND
      figurX += (zielX - figurX) * Math.min(1, 12 * dt)

      figur.animiere(figurX, zustand, zeitS)
      welt.aktualisiere(zustand, zeitS)
      folge(figurX, zustand.z)
      renderer.render(szene, kamera)
    },
  }
}
```

- [ ] **Step 6: Typecheck + bestehende Tests grün**

Run: `npm run build` — Erwartet: grün (visuelle Verifikation folgt in Task 10, wenn `main.ts` verdrahtet ist).
Run: `npm test` — Erwartet: alle passed (nichts gebrochen).

- [ ] **Step 7: Commit**

```bash
git add spiel/src/presentation
git commit -m "feat(spiel): Three-Szene mit Figur, Welt-Segmenten, Kulisse, Muenzen-Pool und Wand"
```

## Task 9: UI — HUD, FPS-Anzeige, WebGL-Hinweis

**Files:**
- Create: `spiel/src/ui/hud.ts`, `spiel/src/ui/fps.ts`, `spiel/src/ui/webgl-hinweis.ts`

**Interfaces:**
- Produces (für Task 10): `erzeugeHud(buehne: HTMLElement): { setzeMuenzen(n: number): void }`, `erzeugeFpsAnzeige(buehne: HTMLElement): { frame(jetztMs: number): void }`, `zeigeWebglHinweis(buehne: HTMLElement): void`
- Keine Unit-Tests (DOM-Overlay laut PRD-Testing-Decisions).

- [ ] **Step 1: Implementieren**

`spiel/src/ui/hud.ts`:
```ts
export function erzeugeHud(buehne: HTMLElement): { setzeMuenzen(n: number): void } {
  const hud = document.createElement('div')
  hud.id = 'hud'
  hud.innerHTML = '<span class="muenzen-punkt"></span><span class="muenzen-zahl">0</span>'
  buehne.appendChild(hud)
  const zahl = hud.querySelector('.muenzen-zahl') as HTMLSpanElement

  let angezeigt = 0
  return {
    setzeMuenzen(n: number) {
      if (n === angezeigt) return
      angezeigt = n
      zahl.textContent = String(n)
    },
  }
}
```

`spiel/src/ui/fps.ts`:
```ts
export function erzeugeFpsAnzeige(buehne: HTMLElement): { frame(jetztMs: number): void } {
  const anzeige = document.createElement('div')
  anzeige.id = 'fps'
  buehne.appendChild(anzeige)

  let frames = 0
  let summeMs = 0
  let letzterFrameMs: number | null = null
  let letzteAusgabeMs = 0

  return {
    frame(jetztMs: number) {
      if (letzterFrameMs !== null) {
        frames += 1
        summeMs += jetztMs - letzterFrameMs
      }
      letzterFrameMs = jetztMs
      if (frames > 0 && jetztMs - letzteAusgabeMs >= 250) {
        const mittelMs = summeMs / frames
        anzeige.textContent = `${Math.round(1000 / mittelMs)} fps · ${mittelMs.toFixed(1)} ms`
        frames = 0
        summeMs = 0
        letzteAusgabeMs = jetztMs
      }
    },
  }
}
```

`spiel/src/ui/webgl-hinweis.ts`:
```ts
export function zeigeWebglHinweis(buehne: HTMLElement): void {
  const hinweis = document.createElement('div')
  hinweis.className = 'webgl-hinweis'
  hinweis.textContent = 'Dein Browser kann dieses Spiel nicht darstellen. Nimm einen aktuellen Browser.'
  buehne.appendChild(hinweis)
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run build` — Erwartet: grün.

- [ ] **Step 3: Commit**

```bash
git add spiel/src/ui
git commit -m "feat(spiel): DOM-HUD, FPS-Anzeige und wortkarger WebGL-Hinweis"
```

## Task 10: Integration `main.ts` + UI-Verifikation (Playwright)

**Files:**
- Modify: `spiel/src/main.ts` (Platzhalter aus Task 1 komplett ersetzen), `spiel/package.json` (Script `verify:ui`), `.gitignore` (Playwright-Artefakte)
- Create: `spiel/playwright.config.ts`, `spiel/tests/tag1.spec.ts`

**Interfaces:**
- Consumes: alles aus Tasks 2–9 (exakte Signaturen siehe dort).
- Produces: `npm run verify:ui` = maschinenprüfbarer UI-Beleg (lokal gegen `vite preview`, in Task 12 per `BASE_URL` gegen die Live-URL).

- [ ] **Step 1: `main.ts` schreiben**

`spiel/src/main.ts` (kompletter Inhalt):
```ts
import WebGL from 'three/addons/capabilities/WebGL.js'
import './stil.css'
import { verbindeEingabe } from './input/eingabe'
import { FIXED_DT, starteLoop } from './loop'
import { erzeugePraesentation } from './presentation/praesentation'
import { tick, wendeIntentAn } from './sim/sim'
import { erzeugeStartZustand } from './sim/zustand'
import { erzeugeFpsAnzeige } from './ui/fps'
import { erzeugeHud } from './ui/hud'
import { zeigeWebglHinweis } from './ui/webgl-hinweis'

const buehne = document.getElementById('buehne')
if (!(buehne instanceof HTMLElement)) throw new Error('#buehne fehlt')

if (!WebGL.isWebGL2Available()) {
  zeigeWebglHinweis(buehne)
} else {
  starteSpiel(buehne)
}

function starteSpiel(buehne: HTMLElement) {
  let zustand = erzeugeStartZustand()

  const praesentation = erzeugePraesentation(buehne)
  const hud = erzeugeHud(buehne)
  const fpsAktiv = import.meta.env.DEV || new URLSearchParams(location.search).has('fps')
  const fps = fpsAktiv ? erzeugeFpsAnzeige(buehne) : null

  verbindeEingabe(buehne, (intent) => {
    zustand = wendeIntentAn(zustand, intent)
  })
  window.addEventListener('resize', () => praesentation.passeGroesseAn())

  starteLoop({
    simSchritt() {
      const ergebnis = tick(zustand, FIXED_DT)
      zustand = ergebnis.zustand
      praesentation.verarbeiteEreignisse(ergebnis.ereignisse)
    },
    zeichne(jetztMs) {
      praesentation.zeichne(zustand, jetztMs / 1000)
      hud.setzeMuenzen(zustand.muenzen)
      fps?.frame(jetztMs)
    },
  })
}
```

- [ ] **Step 2: Naht-Regel verifizieren (sim/loop ohne Three)**

Run: `grep -rn "three" spiel/src/sim spiel/src/loop.ts || echo NAHT_SAUBER`
Erwartet: `NAHT_SAUBER` (kein Treffer).

- [ ] **Step 3: Build + alle Tests**

Run: `npm run build && npm test` — Erwartet: beides grün.

- [ ] **Step 4: Playwright aufsetzen**

Run (in `spiel/`):
```bash
npm install -D @playwright/test
npx playwright install chromium
```

In `spiel/package.json` unter `scripts` ergänzen:
```json
"verify:ui": "npm run build && playwright test"
```

`.gitignore` (Repo-Root) anhängen:
```
spiel/test-results/
spiel/playwright-report/
```

`spiel/playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test'

const liveBaseUrl = process.env.BASE_URL

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: liveBaseUrl ?? 'http://localhost:4173',
  },
  webServer: liveBaseUrl
    ? undefined
    : {
        command: 'npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173/Diplomarbeit/spiel/',
        reuseExistingServer: true,
      },
})
```
(`BASE_URL` gesetzt → Tests laufen ohne lokalen Server gegen die Live-URL; sonst startet Playwright `vite preview` auf dem gebauten `dist/`.)

- [ ] **Step 5: Spec schreiben**

`spiel/tests/tag1.spec.ts`:
```ts
import { expect, test } from '@playwright/test'

const BELEGE = '../Workflow/spiel-build/belege'
const PRAEFIX = process.env.BASE_URL ? 'task12-live' : 'task10'

test.describe('Hochformat (Handy 390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Canvas rendert, FPS-Anzeige per ?fps, HUD zaehlt Muenzen', async ({ page }) => {
    await page.goto('/Diplomarbeit/spiel/?fps')
    await expect(page.locator('#buehne canvas')).toBeVisible()
    await expect(page.locator('#fps')).toContainText('fps')
    await page.keyboard.press('ArrowLeft') // Spur 0 — dort liegt Reihe 1 (z=6)
    await expect(page.locator('.muenzen-zahl')).not.toHaveText('0', { timeout: 8000 })
    await page.screenshot({ path: `${BELEGE}/${PRAEFIX}-hochformat.png` })
  })
})

test.describe('Desktop (1280x800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('zentrierte Hochformat-Buehne', async ({ page }) => {
    await page.goto('/Diplomarbeit/spiel/')
    const kasten = await page.locator('#buehne').boundingBox()
    expect(kasten).not.toBeNull()
    expect(kasten!.width).toBeLessThan(500) // 800 * 9/16 = 450
    expect(Math.abs(kasten!.x + kasten!.width / 2 - 640)).toBeLessThan(2) // zentriert
    await page.screenshot({ path: `${BELEGE}/${PRAEFIX}-desktop.png` })
  })
})
```
(Der Münz-Timeout 8 s deckt den spätesten Fall ab: nächste Spur-0-Reihe bei z=30 → ~3,75 s Laufzeit. Die Spec beweist damit Loop + Eingabe + sim + HUD in einem Durchstich.)

- [ ] **Step 6: UI-Verifikation laufen lassen**

Run (in `spiel/`): `npm run verify:ui`
Erwartet: 2 passed; `Workflow/spiel-build/belege/task10-hochformat.png` + `task10-desktop.png` existieren. Sichtprüfung der Screenshots: 3 Spuren lesbar, Figur, Münzen, Kulisse, Schatten, kein Prototyp-Grau.

- [ ] **Step 7: Commit**

```bash
git add .gitignore spiel/src/main.ts spiel/package.json spiel/package-lock.json spiel/playwright.config.ts spiel/tests Workflow/spiel-build/belege
git commit -m "feat(spiel): Skelett verdrahtet + Playwright-UI-Beleg (verify:ui)"
```

## Task 11: `tech.md` + Map-Pflege + Branch-Push

**Files:**
- Modify: `tech.md` (Einträge füllen), `CONTEXT.md` (Zeile für `deploy/` in der Folder-Structure)

- [ ] **Step 1: `tech.md` füllen**

Unter „Aktuelle Einträge" (Platzhalterzeile `(noch leer — …)` ersetzen):
```md
### Rendering (Spiel)

- **Wahl:** Three.js ^0.185 (vanilla, **WebGL2** — r185 hat keinen WebGL1-Pfad mehr; der „Ohne WebGL"-Fallback prüft `isWebGL2Available()`), Box-Primitives + `MeshLambertMaterial` mit `flatShading`
- **Warum:** kleinster Weg zum Crossy-Road-Look ohne Asset-Pipeline; PRD-Entscheidung `spiel-build`
- **DOMAIN.md-Ref:** Seitenkulisse, Katastrophe (Wand)
- **Constraints:** `sim` + `loop` bleiben frei von Three-Imports (2D-Fallback-Naht) — Änderung nur per neuer PRD

### Build & Tests (Spiel)

- **Wahl:** Vite ^8 + vanilla TypeScript ~6, Vitest ^4 (`test.dir: 'src'`), @playwright/test für den UI-Beleg (`npm run verify:ui`, per `BASE_URL` auch gegen die Live-URL)
- **Warum:** Zero-Config-Bundling, `sim` ohne Browser testbar (TDD-Pflicht), UI-Verifikation maschinenprüfbar statt Sichtprüfung
- **DOMAIN.md-Ref:** Lauf (Simulation)
- **Constraints:** Vite `base: '/Diplomarbeit/spiel/'` = URL-Vertrag, nicht anfassen

### Game-Loop

- **Wahl:** ein rAF-Loop, Fixed-Timestep 1/60 + Akkumulator, Max-Delta-Klemme 0,25 s
- **Warum:** deterministische Simulation, kein Tempo-Drift auf 120-Hz-Displays, kein Sprung nach Tab-Wechsel
- **DOMAIN.md-Ref:** Lauf
- **Constraints:** Render-Budget: DPR-Cap 2 + Canvas-Deckel 2,8 MP (`berechnePixelRatio`), nach FPS-Beleg tunebar

### Deployment

- **Wahl:** GitHub Pages via Actions (checkout@v7, setup-node@v6 Node 24, upload-pages-artifact@v5, deploy-pages@v5), Test-Gate vor Build
- **Warum:** Auto-Deploy je `main`-Push = Look-Check am echten Handy ohne Vorführ-Termin
- **DOMAIN.md-Ref:** Tag-1-Gate
- **Constraints:** Spiel als `spiel/`-Unterordner im Artefakt, Root = Platzhalter der späteren Webseite (`deploy/root-index.html`)
```

- [ ] **Step 2: `CONTEXT.md`-Map ergänzen**

In der Folder-Structure nach der `webseite/`-Zeile einfügen:
```
├── deploy/         ← Pages-Root-Platzhalter (bis die Webseite kommt)
```

- [ ] **Step 3: Commit + Branch-Push**

```bash
git add tech.md CONTEXT.md
git commit -m "docs: tech.md-Eintraege aus PRD-Architektur, deploy/ in der Projekt-Map"
git push
```
Erwartet: CI (`build`-Job) grün auf dem Branch.

- [ ] **Step 4: Übergabe an den Workflow (kein Plan-Step)**

Damit ist die Implementation fertig. Weiter laut `Workflow.md`: Steps 15–18 (Verification-Skill, Code-Review durch den anderen Agenten, Kritik einarbeiten), dann **David** Step 19: `gh pr create` → Review → Merge. Vor dem Merge kann David den Stand am Handy im LAN testen: `npm run dev` (läuft mit `--host`) → `http://<Mac-IP>:5173/Diplomarbeit/spiel/?fps`. Nach dem Merge: Task 12.

## Task 12: Live-Verifikation nach Davids Merge (URL-Vertrag)

Voraussetzung: David hat den PR gemerged (Workflow Step 19) — der Push auf `main` triggert den Deploy.

- [ ] **Step 1: Deploy abwarten**

Run: `gh run watch --exit-status` (bzw. `gh run list --workflow deploy.yml -L 1` bis grün).
Erwartet: `build` + `deploy` grün. Schlägt `deploy` mit Pages-Fehler fehl → Task 4 Step 1 (Pages-Aktivierung) prüfen.

- [ ] **Step 2: URL-Vertrag prüfen**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://david08fritz-del.github.io/Diplomarbeit/spiel/
curl -s https://david08fritz-del.github.io/Diplomarbeit/spiel/ | grep -c 'Verteidige dein Leben'
ASSET=$(curl -s https://david08fritz-del.github.io/Diplomarbeit/spiel/ | grep -o 'assets/[^"]*\.js' | head -1)
test -n "$ASSET" || { echo "FEHLER: kein Asset im HTML gefunden"; false; }
curl -s -o /dev/null -w "%{http_code}\n" "https://david08fritz-del.github.io/Diplomarbeit/spiel/$ASSET"
curl -s -o /dev/null -w "%{http_code}\n" https://david08fritz-del.github.io/Diplomarbeit/
```
Erwartet: `200`, `1` (Titel), `200` (Asset lädt — kein 404, beweist `base`), `200` (Root-Platzhalter).

- [ ] **Step 3: Live-UI-Beleg**

Run (in `spiel/`): `BASE_URL=https://david08fritz-del.github.io npx playwright test`
Erwartet: 2 passed gegen die Live-URL (Config überspringt den lokalen Server); Screenshots `Workflow/spiel-build/belege/task12-live-hochformat.png` + `task12-live-desktop.png` entstehen.

- [ ] **Step 4: Belege committen**

```bash
git checkout main && git pull
git add Workflow/spiel-build/belege
git commit -m "docs: Live-Belege nach Merge (Task 12)"
git push
```
(Workflow-Artefakt, kein Code — analog zu den 01–04-Files direkt auf `main`.)

## Task 13: Tag-1-Gate (HITL — David)

Kein Code. Die Beweis-Grundlage liegt live; Davids Urteil kommt als **Kommentar auf Issue #1** — Handy-/iPad-Screenshots haben keinen automatischen Weg ins Repo, der Issue-Kommentar (GitHub-App) ist der Beleg-Ort.

- [ ] **Step 1 (David, Handy + iPad, Hochformat):** `https://david08fritz-del.github.io/Diplomarbeit/spiel/?fps` öffnen und spielen:
  - Spurwechsel per Swipe links/rechts, Sprung per Swipe hoch — ohne Browser-Scroll/Zurück-Geste
  - Münzen einsammeln, HUD zählt; Wand kommt bei ~50 m und ist weder ausweichbar noch überspringbar
  - FPS-Anzeige: Ziel 60 fps, kein sichtbares Ruckeln — auf beiden Geräten
  - Tab-Wechsel-Test: 10 s in eine andere App, zurück — Figur ist NICHT vorgesprungen
- [ ] **Step 2 (David, Desktop):** Pfeiltasten + Leertaste funktionieren, Bühne ist zentriert hochformatig.
- [ ] **Step 3 (David):** Kommentar auf Issue #1 mit Urteil **„premium: ja/nein"**, Geräten, FPS-Eindruck und angehängten Hochformat-Screenshots (Handy + iPad). Bei No-Go: nur Darstellungsschicht tauschen (2D-Side-Scroller) — `sim`, `loop`, `ui`, `input`, Teststrategie bleiben; Folge-Issues anpassen (neuer Phase-2-Durchlauf für den Tausch).

---

## Selbst-Review (durchgeführt beim Planschreiben)

- **Issue-Abdeckung:** alle ACs im Abnahme-Mapping einem Task zugeordnet; „Assets laden, kein 404" in Task 12 explizit; „wortkarge WebGL-Meldung" Task 9/10; Gate Task 13.
- **Platzhalter-Scan:** keine TODO/TBD; jeder Code-Step enthält vollständigen Code; einzige offene Annahme (Version von `@types/three`) ist explizit benannt inkl. Umgang.
- **Typ-Konsistenz geprüft:** `Praesentation.zeichne(zustand, zeitS)` ↔ Aufruf `praesentation.zeichne(zustand, jetztMs / 1000)`; `fps.frame(jetztMs)`; `tick → { zustand, ereignisse }`; `Intent`-Import in `eingabe.ts` aus `../sim/sim`; `muenzenImBereich`-Nutzung in `welt.ts` und `sim.ts` identisch signiert.

## Codex-Kritik eingearbeitet (05.07.2026, aus `04-Plan-critic.md`)

Alle 5 Punkte bewertet, alle übernommen (Punkt 3 mit einem begründeten Teil-Pushback):

1. **Branch/PR-Workflow** — übernommen, war ein Planungsfehler: `Workflow.md` Step 14/19 verifiziert. Plan arbeitet jetzt auf `feature/issue-1`; CI läuft auf `feature/**`-Pushes und PRs, Live-Deploy + Live-Verifikation erst nach Davids Merge (Task 12). Codex' offene Frage 1 erledigt sich damit — kein Override, Standard-Workflow gilt.
2. **Playwright nicht 1:1** — übernommen: `@playwright/test` als Dev-Dependency, `playwright.config.ts` + `tests/tag1.spec.ts` + `npm run verify:ui` mit maschinenprüfbaren Assertions (Task 10); implementer-agnostisch, auch Codex kann es ausführen. Belege-Ordner wird von Playwright automatisch angelegt und in Task 10 committet.
3. **WebGL vs. WebGL2** — Wording übernommen (Global Constraint, Implementation-WHY, `tech.md` sagen jetzt explizit WebGL2, da r185 keinen WebGL1-Pfad mehr hat). **Teil-Pushback:** der Hinweis-Text selbst bleibt unverändert — er nennt bewusst keine Technologie und ist auch bei fehlendem WebGL2 faktisch korrekt („kann dieses Spiel nicht darstellen"); ein „WebGL2"-Nennen im UI-Text würde die Wortkarg-Regel (kein Fachjargon) verletzen.
4. **Gate-Belege-Pfade** — übernommen: Davids Urteil + Screenshots als Kommentar auf Issue #1 (Task 13), keine lokalen Pflicht-Pfade vom Gerät; Codex' offene Frage 2 damit entschieden. Task 10/12 committen nur Implementer-erzeugte Belege.
5. **Task-11-Asset-Check** — übernommen: identisches `ASSET`-Muster wie Task 4 plus Leer-Check; lebt jetzt in Task 12 Step 2.
