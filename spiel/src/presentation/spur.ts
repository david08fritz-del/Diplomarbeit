import { SPUR_ABSTAND } from '../sim/konstanten'
import type { Spur } from '../sim/zustand'

// Kamera schaut in +z (rechtshaendig, y hoch) → Bildschirm-links ist +x.
// Spur 0 = links aus Spielersicht, deshalb gespiegelt zu (spur - 1).
export function spurZuX(spur: Spur): number {
  return (1 - spur) * SPUR_ABSTAND
}
