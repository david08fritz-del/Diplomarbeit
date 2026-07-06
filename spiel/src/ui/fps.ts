export function erzeugeFpsAnzeige(buehne: HTMLElement): { frame(jetztMs: number): void } {
  const anzeige = document.createElement('div')
  anzeige.id = 'fps'
  buehne.appendChild(anzeige)

  let frames = 0
  let summeMs = 0
  let letzterFrameMs: number | null = null
  let letzteAusgabeMs = 0

  return {
    frame(jetztMs: number) {
      if (letzterFrameMs !== null) {
        frames += 1
        summeMs += jetztMs - letzterFrameMs
      }
      letzterFrameMs = jetztMs
      if (frames > 0 && jetztMs - letzteAusgabeMs >= 250) {
        const mittelMs = summeMs / frames
        anzeige.textContent = `${Math.round(1000 / mittelMs)} fps · ${mittelMs.toFixed(1)} ms`
        frames = 0
        summeMs = 0
        letzteAusgabeMs = jetztMs
      }
    },
  }
}
