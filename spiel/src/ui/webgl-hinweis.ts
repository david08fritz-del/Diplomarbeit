export function zeigeWebglHinweis(buehne: HTMLElement): void {
  const hinweis = document.createElement('div')
  hinweis.className = 'webgl-hinweis'
  hinweis.textContent = 'Dein Browser kann dieses Spiel nicht darstellen. Nimm einen aktuellen Browser.'
  buehne.appendChild(hinweis)
}
