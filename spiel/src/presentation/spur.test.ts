import { describe, expect, it } from 'vitest'
import { SPUR_ABSTAND } from '../sim/konstanten'
import { spurZuX } from './spur'

describe('spurZuX', () => {
  it('Spur 0 (links) liegt bei +x — Kamera schaut in +z, Bildschirm-links ist +x', () => {
    expect(spurZuX(0)).toBe(SPUR_ABSTAND)
    expect(spurZuX(1)).toBe(0)
    expect(spurZuX(2)).toBe(-SPUR_ABSTAND)
  })
})
