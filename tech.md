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

(noch leer — wird gefüllt beim ersten Feature über die PRD-Architektur-Decisions)
