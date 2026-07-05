## Context-Manifest
- Foundation: `01-PRD.md` (Sections "Was & Warum", "Grill-Q&A-Zusammenfassung", "Fuer weiteren Kontext").
- Bias-Hinweis: Beim vorigen `$prime` wurde `01-PRD.md` bereits komplett gelesen, inklusive Architecture Decisions. Die strikte Bias-Prevention des Skills ist dadurch nicht perfekt moeglich; die eigene Sicht unten ist deshalb als rekonstruiertes Gegenmodell markiert, nicht als sauber unbeeinflusster Vorab-Gedanke.
- Eigene Research:
  - Codebase lokal: Es gibt noch keine App-Manifeste und keinen Spiel-Code; `tech.md` ist leer. Kanonischer Projektkontext sind aktuell `spiel/DESIGN.md`, `DOMAIN.md`, `projekt.md` und diese PRD.
  - Subagents nicht verwendet: In dieser Umgebung ist Delegation nur bei expliziter Subagent-Freigabe erlaubt. Die Web- und Codebase-Research wurde deshalb lokal gemacht.
  - Context7 nicht verfuegbar: `ctx7` ist lokal nicht installiert; aktuelle Library-/Web-Plattform-Details wurden aus Primaerquellen geprueft: Vite Deploy-Doku, Three.js Manual, MDN (`requestAnimationFrame`, `touch-action`, `localStorage`) und EUR-Lex DSGVO Art. 4.
  - Wichtigste Research-Ergebnisse: Vite-GitHub-Pages braucht einen explizit passenden `base` zur finalen URL; Three.js warnt vor blindem High-DPI-Rendering bzw. `setPixelRatio`; `requestAnimationFrame` folgt Display-Hz und pausiert meist in versteckten Tabs; `localStorage` bleibt lokal pro Origin, ist aber keine belastbare zentrale Datenquelle.

## Eigene Sicht (rekonstruiert trotz Vorab-Lesen der Architecture Decisions)
- Ich wuerde Vite + vanilla TypeScript + Three.js ebenfalls als plausiblen Stack waehlen, aber nur mit harter Trennung zwischen testbarer Simulation und Darstellung. Kein Game-Framework ist hier vertretbar, weil der Scope klein und der Tag-1-Look-Check entscheidend ist.
- Ich haette die PRD staerker auf vier nicht-verhandelbare Contracts zugespitzt: finale URL-/Deploy-Topologie, mobile Performance-Budget, Datenschutz-/Empirik-Grenze und Quellenqualitaet fuer Versicherungslogik.
- Ich haette die Go/No-Go-Gates messbarer gemacht: David bleibt finaler Look-Approver, aber "premium" darf nicht der einzige harte Gate-Mechanismus sein.

## Kritik-Punkte

### 1. Deployment-Pfad ist als Produktvertrag zu weich
- **Punkt:** `/Diplomarbeit/spiel/` ist entschieden, aber nicht als belastbarer Deploy-Vertrag ausformuliert.
- **Problem:** Die PRD sagt: Projekt-Wurzel `spiel/`, GitHub Pages, Spiel unter `/Diplomarbeit/spiel/`, Root reserviert fuer die Webseite. Gleichzeitig verlangt sie: "Jeder Stand auf `main` ist automatisch unter der GitHub-Pages-URL spielbar."
- **Begruendung:** Bei Vite muss `base` zur tatsaechlichen ausgelieferten URL passen. Die offizielle Vite-Doku unterscheidet explizit zwischen Root-Deploy (`'/'`) und Repo-Subpath (`'/<REPO>/'`); ein weiterer Nested Path wie `/Diplomarbeit/spiel/` braucht eine bewusst gebaute Artifact-/Routing-Entscheidung. Wenn das offen bleibt, kann Phase 2 ein Setup planen, das fuer das Spiel funktioniert, aber beim spaeteren `webseite/`-Teil die URL-Struktur oder Asset-Pfade bricht.
- **Vorschlag:** PRD ergaenzen um eine klare URL-Entscheidung:
  - Option A: Spiel v1 liegt bis zur Webseite unter `/Diplomarbeit/`; spaeter wird umgezogen.
  - Option B: Spiel liegt ab Tag 1 unter `/Diplomarbeit/spiel/`; der Deploy-Prozess liefert das Spiel bewusst unter diesem Subpfad aus und die spaetere Webseite bekommt Root.
  - Dazu eine Acceptance Criterion: GitHub-Pages-URL fuer Spiel und spaetere Root-Webseite sind als Pfade fixiert und in einem Preview-Build verifiziert.

### 2. Mobile-Performance wird mit `setPixelRatio(..., 2)` zu optimistisch abgesichert
- **Punkt:** Der Pixel-Ratio-Guard ist nicht falsch, aber als alleinige Architekturentscheidung zu schwach.
- **Problem:** Die PRD schreibt `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` als Pflicht-Guard und nimmt damit an, Pixel-Ratio-Ueberlast sei ab Tag 1 sauber abgeraeumt.
- **Begruendung:** Das Three.js Manual warnt, dass HD-DPI auf Smartphones die Pixelarbeit massiv vervielfachen kann, und nennt `renderer.setPixelRatio(window.devicePixelRatio)` "strongly NOT RECOMMENDED"; empfohlen wird eher bewusstes Sizing bzw. ein Cap fuer die interne Zeichenflaeche. Ein fixer DPR-Cap auf 2 kann auf grossen iPads oder modernen Phones immer noch zu teuer sein. MDN bestaetigt zusaetzlich, dass `requestAnimationFrame` auf 75/120/144-Hz-Displays laufen kann und meist in Background-Tabs pausiert; Fixed-Timestep loest Simulationsdrift, aber nicht automatisch GPU-Budget, Resume-Spikes oder sichtbare Ruckler.
- **Vorschlag:** PRD auf Produkt-/Architekturebene ergaenzen:
  - Ziel: internes Render-Budget ueber maximale Pixelzahl oder adaptive Render-Scale, nicht nur DPR <= 2.
  - Tag-1-Gate verlangt sichtbare Messung am Handy/iPad: FPS bzw. Frame-Time, Canvas-Pixelzahl/Render-Scale und "kein Simulationssprung nach Tab-Wechsel".
  - `renderer.setPixelRatio(..., 2)` nicht als Dogma festschreiben; Phase 2 darf die bessere Three.js-Responsive-Strategie waehlen, solange das mobile Performance-Budget belegt wird.

### 3. Datenschutz- und Empirik-Grenze ist sprachlich zu absolut
- **Punkt:** "Keine personenbezogenen Daten" ist fuer v1 nur dann wahr, wenn sauber gesagt wird: nichts verlaesst das Geraet.
- **Problem:** Die PRD kombiniert "kein Backend", localStorage, frei gewaehlten Spitznamen, Lauf-Ergebnis mit Profil/Entscheidungen und spaeteren empirischen Datensatz. Out of Scope sagt "personenbezogene Daten" ausgeschlossen.
- **Begruendung:** EUR-Lex/DSGVO Art. 4 definiert personenbezogene Daten weit: Identifizierbarkeit kann direkt oder indirekt entstehen, unter anderem ueber Namen oder Online-Identifier. Ein frei gewaehlter Spitzname kann ein echter Name sein. `localStorage` speichert Daten pro Origin ueber Sessions hinweg, ist aber lokal, blockierbar und keine zentrale Datenquelle. Damit ist v1 datenschutzarm, aber nicht automatisch "anonym" im strengen Sinn, und die spaetere zentrale Datensammlung ist ein eigener Compliance-Bruchpunkt.
- **Vorschlag:** PRD nachschaerfen:
  - V1-Formulierung: "Keine Laufdaten werden uebertragen; Speicherung nur lokal im Browser."
  - Spitzname: UI-Hinweis "kein echter Name", Laengenlimit und Anzeige-/Speicher-Sanitizing.
  - Empirik: v1-localStorage-Daten zaehlen nicht als zentraler empirischer Datensatz. Wenn vor Backend echte Testpersonen-Daten gebraucht werden, braucht es ein explizites Export-/Einwilligungs- oder Erhebungs-Konzept; sonst erst im spaeteren Backend/Webseite-Durchgang.

### 4. Fachliche Quellenqualitaet ist noch kein Gate
- **Punkt:** Quellen-Notiz pro Content-Eintrag reicht fuer Versicherungslogik nicht.
- **Problem:** Die PRD fordert eine Content-Datei mit Quellen-Notiz und leichten MAK-Gegencheck. Sie definiert aber nicht, welche Quellenqualitaet fuer Deckungslogik genuegt und wann Content fachlich "shipbar" ist.
- **Begruendung:** Die Kernbotschaft lebt oder stirbt an fachlicher Korrektheit: AUVA/ASVG/Mitversicherung, gesetzlich vs. privat, Unfall/Freizeit/Schule/Arbeit. Eine beliebige Quellen-Notiz kann Blog, Maklertext oder veraltete Info sein. Das ist fuer eine Diplomarbeit und fuer MAK-Reputationsschutz zu weich.
- **Vorschlag:** Acceptance Criteria ergaenzen:
  - Jede fachliche Regel hat Quelle, Abrufdatum, Quellenart und Status (`self-checked`, `needs-MAK-check`, `MAK-checked`).
  - Primaer-/offizielle Quellen bevorzugt: RIS/ASVG, Sozialversicherung/AUVA/OeGK/oesterreich.gv.at; Makler-/Blogquellen hoechstens als Erklaerhilfe, nicht als Rechtsbasis.
  - Kein Event/keine Station mit fachlichem Status `needs-source` darf in die finale Praesentationsversion.

### 5. Tag-1-Gate haengt zu stark am Wort "premium"
- **Punkt:** David als finaler Look-Judge ist richtig; als alleiniges Gate ist es zu subjektiv.
- **Problem:** Acceptance Criteria sagt: fluessig am Handy/iPad, "kein sichtbares Ruckeln", David beurteilt Look als "premium" bzw. Crossy-Road-Klasse. Das entscheidet ueber 3D vs. 2D-Fallback.
- **Begruendung:** Das ist eine harte Architekturweiche. Wenn das Gate zu vage bleibt, kann Phase 3 in zwei schlechte Richtungen laufen: zu frueh 3D weiterbauen, obwohl Mobile/Look nicht traegt; oder zu lange am Skelett polieren, weil "premium" nicht operationalisiert ist. `DOMAIN.md` definiert Tag-1-Gate nur als Look-Check, aber nicht die Mindestmerkmale des Looks.
- **Vorschlag:** Gate konkretisieren:
  - Mindest-Look: feste Rueckkamera, klar lesbare 3 Spuren, Figur mit Bewegung, Muenzen/Wand raeumlich lesbar, mindestens einfache Seitenkulisse, Licht/Schatten/Palette nicht prototypisch.
  - Mindest-Mobile: Swipe ohne Scroll/Back-Gesture, sichtbare Performance-Messung, kein Layout-Overlap, Hochformat-Screenshot als Beleg.
  - Fallback-Regel: Bei No-Go wird nur die Darstellungsschicht getauscht; Simulationsmodell, Content, DOM-UI, Storage und Teststrategie bleiben erhalten.

## Offene Fragen
- Soll das Spiel im ersten Deploy wirklich unter `/Diplomarbeit/spiel/` liegen, oder ist `/Diplomarbeit/` bis zur spaeteren Webseite akzeptabel?
- Duerfen v1-Spielergebnisse vor dem Backend-Durchgang in irgendeiner Form als empirische Daten fuer die Diplomarbeit verwendet werden, oder sind sie strikt Demo-/Local-Only?
- Was zaehlt als "MAK-Gegencheck done": einmalige Rueckmeldung auf die Content-Datei, oder Freigabe pro fachlicher Regel/Station/Event?

## Pflicht-Dimensionen-Check
- Security: ✓ Kein Backend, keine Runtime-Requests, keine Analytics; Nickname-Handling braucht trotzdem Sanitizing/Laengenlimit.
- Compliance: ✗ Datenschutzsprache ist zu absolut; "frei gewaehlter Spitzname" kann personenbezogen sein, und spaetere zentrale Empirik ist noch nicht geregelt.
- Backward Compatibility: ✗ URL-/Deploy-Topologie ist fuer spaetere `webseite/` noch nicht belastbar entschieden.
- Datenintegritaet: ✗ localStorage ist fuer v1-Bestenliste okay, aber keine zentrale, verlustsichere oder aggregierbare Empirie-Datenquelle.
- Observability: ✗ Kein klares lokales Performance-/Gate-Instrument trotz 60-fps- und Mobile-First-Anspruch.
- Rollback / Migration: ✗ 2D-Fallback ist als Richtung benannt, aber Gate-Kriterien und Pfad-/Storage-Konsequenzen sind nicht sauber fixiert.
- Test-Strategie: ✓/✗ `sim`-TDD ist stark; es fehlen PRD-Gates fuer URL-Deploy, mobile Performance, Quellenqualitaet und localStorage-Fehlerfaelle.
