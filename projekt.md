# projekt.md — Diplomarbeit „Versichert und trotzdem nicht abgesichert"

Die durable Produkt-Vision. Was das Projekt ist/nicht ist, Kernfunktionen, Scope,
Roadmap, Constraints, No-Gos. Nicht Technik (→ `tech.md`), nicht Begriffe
(→ `DOMAIN.md`), nicht Verhalten (→ AGENTS.md, AE-Ebene).

## Was es ist

Der **praktische Teil** der HAK-Diplomarbeit (BHAK Bludenz) zum Thema
**Versorgungslücken zwischen gesetzlicher Sozialversicherung und privater Vorsorge**.

Konkret: eine **hochwertige, visuell starke Webseite** als geführte Story (Scroll von
oben nach unten) rund um ein **eigenständiges Browser-Lernspiel „Verteidige dein
Leben"**. Die Webseite ist die Bühne (erklärt, zeigt Videos, präsentiert die
Umfrage-Ergebnisse); das Spiel ist die Attraktion, auf die alles zuläuft.

Zielgruppe: junge Leute **18–25 in Österreich**.

## Kernbotschaft

1. **Versichert ≠ abgesichert** — man glaubt sich gedeckt, wo man es nicht ist.
2. **Die richtige Absicherung, nicht die meiste** — gute Absicherung hängt an der
   Lebenssituation, nicht an der Menge.

## Was es NICHT ist

- Kein Vergleichsportal, keine Preisberechnung, keine Prämien-Engine.
- Keine individuelle **Beratung** — Wording bewusst: *Analyse + Vorschläge*.
- Kein Tool, das erkennt, welche Versicherungen jemand privat hat.
- Kein AAA-Spiel-Klon (kein Fortnite/GTA/Valorant/FIFA/Brawl). Stilisiertes
  Low-Poly-3D im Browser (Crossy-Road-Klasse), dafür in Top-Qualität.
- Kein Dauerbetrieb-Produkt — steht online für Abgabe/Präsentation und etwas danach,
  nicht jahrelang.
- Kein kommerzielles Arthanc-Produkt — gehört dem Team im Rahmen der Diplomarbeit.

## Kernfunktionen

- **Das Spiel „Verteidige dein Leben"** — eigenständige Seite, Vollbild. Begrenztes
  Budget → echte österreichische Risiko-Wellen → kluges Verteilen überlebt, falsche
  Verteilung führt zum Game-Over „Versichert. Aber nicht abgesichert." Spieler-
  Entscheidungen sind zugleich der empirische Datensatz (gefühlt vs. tatsächlich).
- **Bestenliste** — anonymer, frei gewählter Spitzname.
- **Geführte Webseite (7 Stationen):** Hook → Einstieg zum Spiel → [Spiel extern] →
  Rückkehr / Aha-Moment (Score + Bestenliste + Erklärung der 4 Bereiche) → Videos +
  Quiz → Umfrage-Ergebnisse → Projekt/Team/Partner.
- **Videos** — eigene Erklär-Inhalte.
- **Quiz** — Selbsttest.
- **Umfrage-Ergebnisse** — „gefühlt vs. tatsächlich", teils aus aggregierten
  Spielentscheidungen (empirischer Pflichtteil der Diplomarbeit).

## Scope

- **Vier Versicherungsbereiche:** Unfall · private Haftpflicht + Haushalt · private
  Rechtsschutz · Kranken (gesetzlich vs. privat).
- **Rechtsraum:** Österreich. Gesetzliche Deckung deterministisch aus dem Recht
  (ASVG/AUVA etc.).
- **Sprache:** Deutsch.

## Roadmap (grob — qualitätsgetrieben, kein fixer Termin)

1. **Spiel** spielbar & fachlich korrekt (Kern).
2. **Webseite** drumherum (die 7 Stationen).
3. **Umfrage-Auswertung, Videos, Quiz, Feinschliff.**

Genug Zeit vorhanden, kein Deadline-Druck → Qualität vor Tempo.

## Constraints

- **Anonym:** kein Login, keine personenbezogenen Daten. Für die Bestenliste nur ein
  frei erfundener Spitzname. Gespeichert werden nur nicht-personenbezogene Spiel-/
  Umfragedaten. Kein Tracking. DSGVO bleibt damit trivial.
- **Fachliche Genauigkeit:** Deckungslogik und Lücken müssen **korrekt** sein — wir
  erden sie **selbst** aus Recht/Quellen. Konkrete Zahlen (Budget, Prämien, Beträge)
  sind **stilisiert und klar als illustrativ** gekennzeichnet — kein Angebot, keine
  Preisberechnung.
- **Wording:** durchgehend *Analyse + Vorschläge*, nie „Beratung" (Haftung).
- **Partner MAK Versicherungsmakler** — hilft **freiwillig**, daher **so wenig
  Aufwand wie möglich** für sie: höchstens ein *leichter Gegen-Check* der Regeln,
  keine laufende Einbindung. Die Facharbeit machen wir selbst.
- **Davids persönliche Krankheits-Geschichte:** nur **komplett anonym** verwendbar.
- **Betrieb schlank:** einfaches, günstiges Hosting, keine Langzeit-Datenhaltung.

## No-Gos

- Kein Erkennen privater Policen. Kein Preisrechner. Keine individuelle Beratung.
- Keine AAA-Spielmechaniken/Klone; nichts, was uns technisch blamiert.
- Keine echten personenbezogenen Daten.
- Nichts Halbgares, das die Glaubwürdigkeit (oder Arthancs Namen) beschädigt.

## Rahmen

- **Team:** Samuele Masetti · Emilian Siegl · Marko Zivkovic · David Fritz.
- **Betreuer:** Mag. Guntram Schlatter. **Schule:** BHAK Bludenz.
- **Partner:** MAK Versicherungsmakler (freiwillig).
