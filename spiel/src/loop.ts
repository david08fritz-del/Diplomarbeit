export const FIXED_DT = 1 / 60
export const MAX_FRAME_DELTA = 0.25

export function schritteFuerFrame(
  akkumulator: number,
  frameDelta: number,
): { schritte: number; rest: number } {
  let rest = akkumulator + Math.min(frameDelta, MAX_FRAME_DELTA)
  let schritte = 0
  while (rest >= FIXED_DT) {
    rest -= FIXED_DT
    schritte += 1
  }
  return { schritte, rest }
}

export function starteLoop(hooks: {
  simSchritt: () => void
  zeichne: (jetztMs: number) => void
}): () => void {
  let akkumulator = 0
  let letzteZeitMs: number | null = null
  let handle = 0

  function frame(jetztMs: number) {
    if (letzteZeitMs !== null) {
      const ergebnis = schritteFuerFrame(akkumulator, (jetztMs - letzteZeitMs) / 1000)
      akkumulator = ergebnis.rest
      for (let i = 0; i < ergebnis.schritte; i++) hooks.simSchritt()
    }
    letzteZeitMs = jetztMs
    hooks.zeichne(jetztMs)
    handle = requestAnimationFrame(frame)
  }

  handle = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(handle)
}
