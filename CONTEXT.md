# CONTEXT — Diplomarbeit

Karte dieses Projekts: was hier liegt, wie ein Agent schnell den richtigen Kontext
findet. Verhalten steht **nicht** hier — das kommt von der AE-`AGENTS.md` (eine Ebene
höher).

## Was hier gebaut wird

Der praktische Teil der HAK-Diplomarbeit **„Versichert und trotzdem nicht
abgesichert"** (Versorgungslücken gesetzlich vs. privat, Zielgruppe 18–25 in
Österreich): eine premium **Story-Webseite** rund um ein eigenständiges
**Browser-Lernspiel „Verteidige dein Leben"**. Vollständige Vision → `projekt.md`.

## Folder-Structure

```
Projects/Diplomarbeit/
│
├── CONTEXT.md      ← Map + Routing (du bist hier)
├── projekt.md      ← Produkt-Vision (durable Fallback)
├── tech.md         ← Tech-Stack (von Agents gepflegt)
├── DOMAIN.md       ← Ubiquitous Language (entsteht beim ersten /grill-with-docs)
│
├── spiel/          ← Browser-Spiel „Verteidige dein Leben" (eigenständig, Vollbild); Design steht in spiel/DESIGN.md
├── webseite/       ← Story-Webseite (Bühne, 7 Stationen) — entsteht beim Bauen
├── deploy/         ← Pages-Root-Platzhalter (bis die Webseite kommt)
│
├── Workflow/       ← aktueller Durchgang (01–09 Artefakte, ephemer)
├── archive/        ← 09-Summaries vergangener Durchgänge
└── Diskussion/     ← Claude↔Codex-Kritik-Protokolle
```

## Routing

> Nicht automatisch alles laden — zieh ein Doc nur, wenn der Trigger zutrifft.

| Kontext | Wann ziehen (z.B.) | Pfad |
|---|---|---|
| Produkt-Vision — was es ist/nicht ist, Scope, No-Gos | Orientierung, Scope-Frage, „gehört das rein?" | `projekt.md` |
| Tech-Stack — Entscheidungen, Libraries, Patterns | wenn du Tech wählst/anfässt | `tech.md` |
| Begriffe — Ubiquitous Language | wenn ein Fachbegriff unklar ist | `DOMAIN.md` (ab erstem Feature) |
| Das Spiel — Design (Regeln fürs Bauen) | am Spiel arbeiten, Design-Frage | `spiel/DESIGN.md` |
| Das Spiel — Code | am Spiel arbeiten | `spiel/` |
| Die Webseite — Code | an der Webseite arbeiten | `webseite/` |
| Workflow, Regeln, Learnings, Verhalten | beim Bauen, immer | AE-Ebene: `../../Workflow.md`, `../../rules.md`, `../../learnings.md`, `../../AGENTS.md` |

## Prinzipien

- **Verhalten kommt von oben.** Wie wir hier arbeiten, steht in der AE-`AGENTS.md`
  (`../../AGENTS.md`), nicht hier. Keine Projekt-`AGENTS.md`.
- **Ein Projekt, zwei Teile.** `spiel/` und `webseite/` hängen zusammen (geteilte
  Bestenliste, gemeinsamer Auftritt) — zusammen versioniert.
- **Keine Duplikate.** Jede Info lebt an EINEM Ort; andere Files verweisen nur.
```
