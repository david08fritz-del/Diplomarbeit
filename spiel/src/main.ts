import WebGL from 'three/addons/capabilities/WebGL.js'
import './stil.css'
import { verbindeEingabe } from './input/eingabe'
import { FIXED_DT, starteLoop } from './loop'
import { erzeugePraesentation } from './presentation/praesentation'
import { tick, wendeIntentAn } from './sim/sim'
import { erzeugeStartZustand } from './sim/zustand'
import { erzeugeFpsAnzeige } from './ui/fps'
import { erzeugeHud } from './ui/hud'
import { zeigeWebglHinweis } from './ui/webgl-hinweis'

const buehne = document.getElementById('buehne')
if (!(buehne instanceof HTMLElement)) throw new Error('#buehne fehlt')

if (!WebGL.isWebGL2Available()) {
  zeigeWebglHinweis(buehne)
} else {
  starteSpiel(buehne)
}

function starteSpiel(buehne: HTMLElement) {
  let zustand = erzeugeStartZustand()

  const praesentation = erzeugePraesentation(buehne)
  const hud = erzeugeHud(buehne)
  const fpsAktiv = import.meta.env.DEV || new URLSearchParams(location.search).has('fps')
  const fps = fpsAktiv ? erzeugeFpsAnzeige(buehne) : null

  verbindeEingabe(buehne, (intent) => {
    zustand = wendeIntentAn(zustand, intent)
  })
  window.addEventListener('resize', () => praesentation.passeGroesseAn())

  starteLoop({
    simSchritt() {
      const ergebnis = tick(zustand, FIXED_DT)
      zustand = ergebnis.zustand
      praesentation.verarbeiteEreignisse(ergebnis.ereignisse)
    },
    zeichne(jetztMs) {
      praesentation.zeichne(zustand, jetztMs / 1000)
      hud.setzeMuenzen(zustand.muenzen)
      fps?.frame(jetztMs)
    },
  })
}
