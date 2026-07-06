import { describe, expect, it } from 'vitest'
import { SPRUNG_V0 } from './konstanten'
import { erzeugeStartZustand } from './zustand'
import { wendeIntentAn } from './sim'

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
