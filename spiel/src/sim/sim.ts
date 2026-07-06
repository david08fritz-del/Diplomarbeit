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
