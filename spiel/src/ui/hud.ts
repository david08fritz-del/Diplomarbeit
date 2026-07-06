export function erzeugeHud(buehne: HTMLElement): { setzeMuenzen(n: number): void } {
  const hud = document.createElement('div')
  hud.id = 'hud'
  hud.innerHTML = '<span class="muenzen-punkt"></span><span class="muenzen-zahl">0</span>'
  buehne.appendChild(hud)
  const zahl = hud.querySelector('.muenzen-zahl') as HTMLSpanElement

  let angezeigt = 0
  return {
    setzeMuenzen(n: number) {
      if (n === angezeigt) return
      angezeigt = n
      zahl.textContent = String(n)
    },
  }
}
