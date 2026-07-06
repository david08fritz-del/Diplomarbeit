import { describe, expect, it } from 'vitest'
import { LAUF_TEMPO, MUENZE_WERT, SPRUNG_V0 } from './konstanten'
import { erzeugeStartZustand, type SimZustand } from './zustand'
import { tick, wendeIntentAn, type SimEreignis } from './sim'

describe('wendeIntentAn', () => {
  it('wechselt die Spur nach links und klemmt am Rand', () => {
    let zustand = erzeugeStartZustand()
    expect(zustand.spur).toBe(1)
    zustand = wendeIntentAn(zustand, 'links')
    expect(zustand.spur).toBe(0)
    zustand = wendeIntentAn(zustand, 'links')
    expect(zustand.spur).toBe(0)
  })

  it('wechselt die Spur nach rechts und klemmt am Rand', () => {
    let zustand = wendeIntentAn(erzeugeStartZustand(), 'rechts')
    expect(zustand.spur).toBe(2)
    zustand = wendeIntentAn(zustand, 'rechts')
    expect(zustand.spur).toBe(2)
  })

  it('springt nur vom Boden aus, kein Doppelsprung', () => {
    const gesprungen = wendeIntentAn(erzeugeStartZustand(), 'sprung')
    expect(gesprungen.vSprung).toBe(SPRUNG_V0)
    const nochmal = wendeIntentAn(gesprungen, 'sprung')
    expect(nochmal).toEqual(gesprungen)
  })
})

function laufe(zustand: SimZustand, bisZ: number) {
  const ereignisse: SimEreignis[] = []
  while (zustand.z < bisZ) {
    const ergebnis = tick(zustand, 1 / 60)
    zustand = ergebnis.zustand
    ereignisse.push(...ergebnis.ereignisse)
  }
  return { zustand, ereignisse }
}

describe('tick', () => {
  it('laeuft mit LAUF_TEMPO vorwaerts', () => {
    const { zustand } = tick(erzeugeStartZustand(), 1 / 60)
    expect(zustand.z).toBeCloseTo(LAUF_TEMPO / 60)
  })

  it('steigt beim Sprung ueber 1 und landet wieder bei 0', () => {
    let zustand = wendeIntentAn(erzeugeStartZustand(), 'sprung')
    let maxHoehe = 0
    for (let i = 0; i < 120; i++) {
      zustand = tick(zustand, 1 / 60).zustand
      maxHoehe = Math.max(maxHoehe, zustand.hoehe)
    }
    expect(maxHoehe).toBeGreaterThan(1)
    expect(zustand.hoehe).toBe(0)
    expect(zustand.vSprung).toBe(0)
  })

  it('sammelt Muenzen nur auf der eigenen Spur, jede genau einmal', () => {
    // Reihe 1 liegt auf Spur 0 bei z 6–8.4
    const links = wendeIntentAn(erzeugeStartZustand(), 'links')
    expect(laufe(links, 10).zustand.muenzen).toBe(3 * MUENZE_WERT)
    // ohne Spurwechsel (Spur 1): dort liegt nichts
    expect(laufe(erzeugeStartZustand(), 10).zustand.muenzen).toBe(0)
  })

  it('Wand-Durchbruch feuert auch mitten im Sprung und nach Spurwechsel (Regel 1)', () => {
    let { zustand } = laufe(wendeIntentAn(erzeugeStartZustand(), 'links'), 48)
    zustand = wendeIntentAn(zustand, 'sprung')
    let hoeheBeimDurchbruch = -1
    while (zustand.z < 52) {
      const ergebnis = tick(zustand, 1 / 60)
      zustand = ergebnis.zustand
      if (ergebnis.ereignisse.some((e) => e.art === 'wandDurchbruch')) {
        hoeheBeimDurchbruch = zustand.hoehe
      }
    }
    expect(hoeheBeimDurchbruch).toBeGreaterThan(1) // war in der Luft — Wand zaehlt trotzdem
    expect(zustand.naechsteWand).toBe(2)
  })
})
