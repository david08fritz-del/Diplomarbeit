import { describe, expect, it } from 'vitest'
import { FIXED_DT, MAX_FRAME_DELTA, schritteFuerFrame } from './loop'

describe('schritteFuerFrame', () => {
  it('ein 60-Hz-Frame ergibt genau einen Schritt', () => {
    const { schritte, rest } = schritteFuerFrame(0, 1 / 60)
    expect(schritte).toBe(1)
    expect(rest).toBeCloseTo(0, 9)
  })

  it('120-Hz-Frames driften nicht (kein Tempo-Drift)', () => {
    let akkumulator = 0
    let gesamt = 0
    for (let i = 0; i < 120; i++) {
      const ergebnis = schritteFuerFrame(akkumulator, 1 / 120)
      akkumulator = ergebnis.rest
      gesamt += ergebnis.schritte
    }
    expect(gesamt).toBe(60)
  })

  it('klemmt den Frame-Delta nach Tab-Wechsel (kein Simulationssprung)', () => {
    const { schritte } = schritteFuerFrame(0, 3.0)
    expect(schritte).toBeLessThanOrEqual(Math.round(MAX_FRAME_DELTA / FIXED_DT))
  })
})
