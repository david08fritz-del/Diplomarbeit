## Context-Manifest
- Foundation: `03-Plan.md` (Sections "Context-Manifest" + "Implementation-WHY", danach vollstaendige `1:1 Steps`).
- Plus PRD: `01-PRD.md` komplett; zusaetzlich `02-PRD-critic.md`, `spiel/DESIGN.md`, `DOMAIN.md`, `projekt.md`, `tech.md`, AE-`Workflow.md` und AE-`rules.md`.
- Issue-Kontext: `gh issue view 1` geladen; Issue #1 ist offen, `ready-for-agent`, HITL-Gate, URL-Vertrag `.../Diplomarbeit/spiel/`.
- Eigene Research: Codebase ist Greenfield (`spiel/` enthaelt nur `DESIGN.md`), keine App-Manifeste, kein Spielcode, keine Tests. Subagent-Delegation nicht genutzt, weil das aktuelle Multi-Agent-Tool Subagents nur bei expliziter Subagent-Freigabe erlaubt; Research daher lokal gemacht und hier dokumentiert.
- Externe Fakten geprueft: `npm view` bestaetigt `vite@8.1.3`, `vitest@4.1.9`, `typescript@6.0.3`, `three@0.185.1`, `@types/three@0.185.0`; GitHub API bestaetigt Actions-Tags `checkout@v7`, `setup-node@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`.
- Bias-Hinweis: Beim vorherigen `$prime` wurde `03-Plan.md` bereits teilweise bis in Task 2 gelesen. Die strikte Bias-Prevention ist dadurch nicht perfekt; die eigene Sicht unten ist trotzdem vor dem vollstaendigen Lesen der `1:1 Steps` rekonstruiert.

## Eigene Sicht (vor Lesen der 1:1 Steps)
- Ich haette ebenfalls ein Greenfield-`spiel/`-Vite-Projekt gebaut: `package.json`, Vite/TS/Vitest-Konfig, reine `sim`-Module, `loop.ts`, `input`, `presentation`, `ui`, `main.ts`, Pages-Workflow, `deploy/root-index.html`, `tech.md` und `CONTEXT.md`.
- Die testbaren Kerne muessen vor dem Rendering stehen: `sim` fuer Spur/Sprung/Muenzen/Wand, `loop` fuer Fixed-Timestep/Max-Delta, `input` fuer Swipe-Klassifikation, `presentation/buehne` fuer Hochformat und Pixelbudget. Rendering selbst via Build + Browser-/Screenshot-Beleg.
- Fuer Phase 3 haette ich den Plan auf einem `feature/issue-1`-Branch gehalten und den Live-Deploy entweder per `workflow_dispatch --ref feature/issue-1` als Preview oder erst nach PR-Merge auf `main` verifiziert. Direkt auf `main` zu arbeiten widerspricht dem AgEn-Hauptworkflow.

## Kritik-Punkte

### 1. Plan hebelt den AgEn-Branch/PR-Workflow aus
- **Punkt:** Direkt auf `main` ist kein gueltiger Phase-3-Plan.
- **Problem:** `03-Plan.md` legt als Global Constraint fest: "Arbeiten direkt auf `main`" (Zeile 21). Task 4 und Task 11 verlangen `git push` direkt in den Ablauf (Zeilen 678-679, 1503-1504). Der AE-Workflow schreibt fuer Phase 3 aber `Branch feature/issue-NN` vor (`../../Workflow.md`, Zeile 24), und `../../rules.md` sagt: "Workflow muss immer befolgt werden" (Zeile 11).
- **Begruendung:** Das ist keine Architekturfrage aus der PRD, sondern ein konkreter Execution-Mapping-Fehler. Der Plan wuerde Code ohne PR/Review direkt auf `main` bringen und damit Step 14/19 des Hauptworkflows umgehen. Der URL-Deploy-Beweis rechtfertigt das nicht automatisch: Issue #1 verlangt, dass jeder Push auf `main` deploybar ist, nicht dass die Implementierung ohne Branch/PR passieren muss.
- **Vorschlag:** Global Constraint ersetzen durch: "Phase 3 arbeitet auf `feature/issue-1`." Deploy-Workflow darf `push` auf `main` behalten und zusaetzlich `workflow_dispatch` nutzen. Fuer HITL-Preview entweder `gh workflow run deploy.yml --ref feature/issue-1` + `gh run watch --exit-status` konkretisieren, oder erst nach PR-Merge den finalen `main`-Deploy als Task verifizieren. Falls David ausnahmsweise direkt `main` will, muss das als expliziter Workflow-Override von David in den Plan, nicht als Plan-Annahme.

### 2. Playwright-Verifikation ist nicht 1:1 ausfuehrbar
- **Punkt:** Browser-Belege sind prose, keine ausfuehrbaren Schritte.
- **Problem:** Task 10 Step 4 sagt nur: `npm run dev` im Hintergrund, "Dann mit Playwright-Browser" Viewport setzen, klicken/warten, Screenshots ablegen (Zeilen 1479-1485). Task 11 wiederholt "einmal Playwright gegen die Live-URL" (Zeile 1514). Es gibt aber kein Playwright-Dependency, kein Script, keine Browser-Tool-Anweisung, keine Server-Session-Handhabung und keine maschinenpruefbaren Assertions ausser manueller Sichtpruefung.
- **Begruendung:** Der Plan-Standard ist 1:1 ausfuehrbar. Hier muesste der Implementer wieder selbst entscheiden, ob er `@playwright/test` installiert, ein ad-hoc Script schreibt, das Browser-Plugin verwendet, wie Screenshots erzeugt werden, wann der Dev-Server beendet wird und woran "Spiel laeuft" technisch erkannt wird. Bei einem UI-Feature ist genau diese Verifikation Teil des Deliverables, nicht optionaler Nachtrag.
- **Vorschlag:** Einen konkreten Verifikationspfad einbauen:
  - Entweder `@playwright/test` als Dev-Dependency + `spiel/tests/tag1.spec.ts`/`npm run verify:ui` mit Viewports `390x844` und Desktop, Screenshot-Pfaden und Assertions (`canvas` vorhanden, nicht leer, HUD aktualisiert nach `ArrowLeft`, `#fps` bei `?fps` sichtbar).
  - Oder explizit den Browser-/Playwright-Toolflow des Implementers als 1:1 Steps beschreiben, inklusive Dev-Server-Start, URL, Screenshot-Dateien, Mindestchecks und Server-Shutdown.
  - `Workflow/spiel-build/belege/` vor dem ersten Screenshot anlegen und in Task 10 committen oder bewusst erst in Task 11 sammeln.

### 3. WebGL-AC wird auf WebGL2 gemappt, ohne die Produkt-Sprache anzupassen
- **Punkt:** Fallback-Bedingung und Doku-Sprache sind inkonsistent.
- **Problem:** PRD/Issue verlangen "Ohne WebGL: wortkarge Meldung" (`01-PRD.md`, Zeilen 23 und 99). Task 10 implementiert aber `if (!WebGL.isWebGL2Available())` (Zeile 1436), und Task 11 dokumentiert spaeter "Three.js ... WebGL" in `tech.md` (Zeile 1522).
- **Begruendung:** Wenn Three r185 faktisch WebGL2 voraussetzt, ist die Implementation wahrscheinlich technisch korrekt. Dann muss der Plan aber auch klar sagen: Runtime-Baseline ist WebGL2-faehiger Browser, und die Fallback-Meldung bedeutet "kein WebGL2". Sonst prueft der Implementer eine strengere Faehigkeit als die AC beschreibt, waehrend die Tech-Doku weiter "WebGL" sagt. Das ist ein Mapping-Bruch zwischen Acceptance Criterion, Code und Dokumentation.
- **Vorschlag:** Plan und `tech.md`-Eintrag angleichen: entweder AC/Tech-Wording auf "WebGL2-faehiger aktueller Browser" aktualisieren, oder explizit begruenden, dass Three r185 `WebGLRenderer` nur mit WebGL2 sinnvoll startet und deshalb `isWebGL2Available()` die konkrete Implementierung des "Ohne WebGL"-Fallbacks ist. Die wortkarge Meldung sollte ebenfalls nicht behaupten, der Browser koenne "dieses Spiel" nicht darstellen, wenn nur WebGL2 fehlt.

### 4. HITL-Gate-Belege vom Handy/iPad haben keinen realen Weg in die angegebenen Repo-Pfade
- **Punkt:** Task 12 verlangt Dateien, die David auf dem Geraet nicht automatisch erzeugen kann.
- **Problem:** Task 12 Step 1 fordert Handy-/iPad-Screenshots als Beleg unter `Workflow/spiel-build/belege/gate-handy.png` und `gate-ipad.png` (Zeile 1573). Es fehlt ein Schritt, wie diese Screenshots aus Davids Geraet in den Arbeitsordner kommen. Task 12 sagt ausserdem "Kein Code", aber Task 11 commitet `Workflow/spiel-build/belege` bereits vorher (Zeile 1559).
- **Begruendung:** Das ist nicht 1:1 ausfuehrbar. Ein Screenshot auf iOS/iPadOS landet nicht im Repo. Ohne Upload-/AirDrop-/Issue-Kommentar-Regel entstehen entweder fehlende Dateien oder unklare Beweisfuehrung. Fuer das HITL-Gate reicht eventuell ein GitHub-Issue-Kommentar mit Screenshots; dann darf der Plan aber nicht lokale Dateipfade als Pflichtbeleg nennen.
- **Vorschlag:** Task 12 konkretisieren:
  - David kommentiert Issue #1 mit Urteil `premium: ja/nein`, Geraeten, FPS-Eindruck und angehaengten Screenshots; der Implementer verlinkt diesen Kommentar in `04/09`-Summary oder im PR.
  - Falls lokale Dateien wirklich gewuenscht sind: expliziter Transfer-Schritt (`AirDrop`/Upload an Chat/Drive, dann in `Workflow/spiel-build/belege/` ablegen) und ein Commit nach Task 12.
  - Task 11 sollte nur die vom Implementer erzeugten lokalen/Live-Playwright-Belege committen, nicht die spaeteren HITL-Dateien implizit vorwegnehmen.

### 5. Live-Asset-Check in Task 11 bricht den 1:1-Standard
- **Punkt:** Der zweite URL-Vertrag-Check ist nur halb spezifiziert.
- **Problem:** Task 11 Step 2 zeigt eine `curl | grep | head`-Zeile fuer das Asset, sagt danach aber nur: "Dann das gefundene Asset laden: Erwartet `200`" (Zeile 1514). Im Gegensatz zu Task 4 Step 5 fehlt der konkrete Befehl, der den gefundenen Asset-Pfad in eine 200-Pruefung umsetzt.
- **Begruendung:** Kleine Luecke, aber genau die Art Luecke, die ein 1:1-Plan vermeiden soll. Der Implementer muss wieder ein Shell-Fragment bauen und kann dabei Pfadquoting, leeres Asset oder falsche Base-URL uebersehen. Der Plan hat die korrekte Version in Task 4 bereits einmal formuliert; Task 11 sollte sie nicht verkuerzen.
- **Vorschlag:** Task 11 Step 2 auf den Task-4-Befehl angleichen: Asset in Variable extrahieren, leerem Asset hart fehlschlagen lassen, dann `curl -s -o /dev/null -w "%{http_code}\n" "https://.../spiel/$ASSET"` ausfuehren. Alternativ ein kleines Node-Script fuer HTML-Fetch + Asset-Fetch, damit die Pruefung cross-shell stabil ist.

## Offene Fragen
- Will David wirklich einen expliziten Workflow-Override fuer direktes Arbeiten auf `main`, oder bleibt der AgEn-Standard `feature/issue-1` + PR verbindlich?
- Sollen Handy/iPad-Gate-Screenshots als lokale Repo-Dateien versioniert werden, oder reicht ein GitHub-Issue-Kommentar mit angehaengten Bildern und Urteil?

## Pflicht-Check
- 1:1 ausfuehrbar (File + Funktion + Action pro Step)? ✗ — Code-Steps sind groesstenteils 1:1, aber Phase-3-Branching, Playwright-Verifikation, HITL-Screenshot-Transfer und Task-11-Asset-Check sind nicht sauber ausfuehrbar.
- Tests im Plan (existierende betroffene + neue)? ✓/✗ — `sim`, `loop`, `input`, `buehne` sind gut TDD-gemappt; UI/Rendering soll laut PRD ueber Browser-Belege laufen, aber diese Belege sind nicht ausreichend als ausfuehrbare Verifikation spezifiziert.
- Imports vollstaendig? ✓ — die geplanten TS-Imports wirken konsistent; externe Versionschecks bestaetigen die Paket-/Action-Versionen. WebGL-Import ist technisch plausibel, aber die WebGL2-Semantik muss dokumentiert werden.
- Edge Cases aus PRD im Plan abgedeckt? ✓/✗ — Fixed-Timestep, DPR-Budget, Swipe, WebGL-Fallback, URL-Base und Naht-Regel sind abgedeckt. Unsauber bleiben Browser-Beweis, echter Device-Gate-Beleg und WebGL-vs-WebGL2-Wording.
- Konventionen des Projekts eingehalten? ✗ — direkte `main`-Arbeit verletzt den harten AgEn-Workflow; sonst passen Sprache, Domänenbegriffe, Greenfield-Struktur und `tech.md`-Pflege weitgehend.
