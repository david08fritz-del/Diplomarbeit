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
