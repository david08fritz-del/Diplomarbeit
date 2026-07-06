# Review-Request an Codex — Issue #1: Tag-1-Skelett + Pages-Deploy

**Von:** Claude (Implementer, `/implement`) · **Datum:** 06.07.2026 · **Branch:** `feature/issue-1` (gepusht)
**Erwartetes Artefakt:** `05-code-critic.md` (via `$code-critique`)

## Was gebaut wurde

Alle 11 Implementations-Tasks aus `03-Plan.md` 1:1 umgesetzt (Tasks 12/13 folgen nach Merge).
Spielbares Tag-1-Skelett: 3 Spuren, Auto-Lauf, Swipe/Pfeiltasten/Leertaste, Münzen, eine
Katastrophen-Wand (Regel 1 im sim-Test verankert), Licht/Schatten/Palette/Kulisse,
Fixed-Timestep-Loop, Render-Budget, HUD/FPS/WebGL2-Hinweis, Pages-Deploy-Workflow
(Test-Gate auf `feature/**` + PR, Deploy nur `main`).

## Review-Scope

```
git diff main..feature/issue-1
```

13 Commits. Struktur: `spiel/src/sim/` + `spiel/src/loop.ts` (reine TS, TDD),
`spiel/src/input/`, `spiel/src/presentation/`, `spiel/src/ui/`, `spiel/src/main.ts`,
`spiel/playwright.config.ts` + `spiel/tests/tag1.spec.ts`, `.github/workflows/deploy.yml`,
`deploy/root-index.html`, `tech.md`, `CONTEXT.md`, `.gitignore`.

## Eine bewusste Plan-Abweichung (von David freigegeben)

**Commit `4f74258`:** Der Plan-Code mappte Spur→x als `(spur - 1) * SPUR_ABSTAND`.
Kamera schaut in +z (rechtshändig, y hoch) → Bildschirm-links ist +x; damit erschien
Spur 0 („links") rechts im Bild — Steuerung wirkte invertiert (Sichtprüfung Task 10,
Screenshot-Beleg). Fix: `spurZuX(spur) = (1 - spur) * SPUR_ABSTAND` als einzige
Quelle der Wahrheit in `presentation/spur.ts` (mit Test), genutzt von
`praesentation.ts`, `figur.ts`, `welt.ts`. `sim` unangetastet (Naht-Regel).

## Verification-Belege (frisch, 06.07.2026 ~16:04)

- **Naht:** `grep -rn "three" src/sim src/loop.ts` → `NAHT_SAUBER`
- **Tests:** Vitest `6 passed (6)` Files, `22 passed (22)` Tests
- **Types:** `tsc --noEmit` still (Teil von `npm run build`), Build `✓ built`
- **UI-Beleg:** `npm run verify:ui` → `2 passed` (Hochformat 390×844 + Desktop 1280×800),
  Screenshots in `Workflow/spiel-build/belege/task10-*.png` (Sichtprüfung ok:
  3 Spuren, Figur, Münzen, Wand, Kulisse, Schatten, kein Prototyp-Grau)
- **Lint:** kein Linter im Projekt konfiguriert (Plan sieht keinen vor)
- **CI:** `build`-Job grün auf `feature/issue-1` (letzter Run: success)

## Bekannte Punkte / Kontext für die Review

- **Headless-WebGL-Flake:** Beim allerersten `verify:ui`-Lauf war der
  Hochformat-Screenshot schwarz (Canvas-Compositing-Timing in headless Chromium);
  ab dem zweiten Lauf stabil reproduzierbar sauber. Assertions selbst waren nie flaky.
- **`@types/three` 0.185.0** zu three 0.185.1 — laut Plan-Annahme ok.
- **Chunk-Size-Warnung** beim Build (three gebündelt, ~530 kB / 134 kB gzip) — erwartet,
  kein Code-Splitting am Tag 1.
- Referenzen: `03-Plan.md` (1:1 Steps), `01-PRD.md` (Architektur), `spiel/DESIGN.md`
  (Regel 1), Issue #1 (ACs).
