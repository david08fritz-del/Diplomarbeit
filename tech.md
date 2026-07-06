# Tech-Stack

Dieses File wird von **Claude code + Codex** gepflegt, nicht von David. Jede neue Tech-Entscheidung (Library, Framework, Tool, Pattern) gehört hier rein — mit Begründung und Cross-Ref zu `DOMAIN.md`.

## Cross-Reference mit DOMAIN.md

Jeder Tech-Eintrag referenziert den passenden Begriff in `DOMAIN.md` (Ubiquitous Language). Vice versa: jeder Begriff in DOMAIN.md der eine konkrete Tech-Wahl impliziert verweist auf den Tech-Eintrag hier.

Format pro Tech-Eintrag:

```md
### <Tech-Bereich, z.B. Auth>

- **Wahl:** <Library/Framework/Tool>
- **Warum:** <Begründung — Tradeoffs gegen Alternativen>
- **DOMAIN.md-Ref:** <Begriff in DOMAIN.md, z.B. "Auth-Provider">
- **Constraints:** <was darf NICHT verändert werden ohne neue PRD>
```

## Aktuelle Einträge

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
