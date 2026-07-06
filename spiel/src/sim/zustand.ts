export type Spur = 0 | 1 | 2

// Folge-Issues erweitern: 'onboarding' | 'station' | 'katastrophe' | 'bilanz'
export type SpielPhase = 'lauf'

export type SimZustand = {
  phase: SpielPhase
  spur: Spur
  z: number
  hoehe: number
  vSprung: number
  muenzen: number
  eingesammelt: ReadonlySet<string>
  naechsteWand: number
}

export function erzeugeStartZustand(): SimZustand {
  return {
    phase: 'lauf',
    spur: 1,
    z: 0,
    hoehe: 0,
    vSprung: 0,
    muenzen: 0,
    eingesammelt: new Set(),
    naechsteWand: 1,
  }
}
