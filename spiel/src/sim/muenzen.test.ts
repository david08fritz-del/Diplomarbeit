import { describe, expect, it } from 'vitest'
import { muenzenImBereich, muenzenInReihe } from './muenzen'

describe('muenzenInReihe', () => {
  it('legt Reihen im 6er-Abstand auf wechselnde Spuren', () => {
    expect(muenzenInReihe(1)[0]).toEqual({ id: '1-0', spur: 0, z: 6 })
    expect(muenzenInReihe(1)).toHaveLength(3)
    expect(muenzenInReihe(2).map((m) => m.spur)).toEqual([2, 2, 2])
  })

  it('laesst nahe der Wand keine Muenzen entstehen', () => {
    expect(muenzenInReihe(8)).toEqual([]) // z 48–50.4 kollidiert mit Wand bei 50
  })
})

describe('muenzenImBereich', () => {
  it('liefert genau die Muenzen im Fenster', () => {
    const ids = muenzenImBereich(5.5, 7.5).map((m) => m.id)
    expect(ids).toEqual(['1-0', '1-1'])
  })
})
