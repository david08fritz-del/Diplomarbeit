import {
  GRAVITATION,
  LAUF_TEMPO,
  MUENZE_FANGRADIUS,
  MUENZE_WERT,
  SPRUNG_V0,
  WAND_INTERVALL,
} from './konstanten'
import { muenzenImBereich } from './muenzen'
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
