import * as THREE from 'three'
import type { SimEreignis } from '../sim/sim'
import type { SimZustand } from '../sim/zustand'
import { berechneBuehne, berechnePixelRatio } from './buehne'
import { erzeugeFigur } from './figur'
import { spurZuX } from './spur'
import { erzeugeSzene } from './szene'
import { erzeugeWelt } from './welt'

export type Praesentation = {
  zeichne(zustand: SimZustand, zeitS: number): void
  verarbeiteEreignisse(ereignisse: SimEreignis[]): void
  passeGroesseAn(): void
}

export function erzeugePraesentation(buehnenElement: HTMLElement): Praesentation {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  buehnenElement.appendChild(renderer.domElement)

  const { szene, kamera, folge } = erzeugeSzene()
  const figur = erzeugeFigur()
  szene.add(figur.gruppe)
  const welt = erzeugeWelt(szene)

  let figurX = 0
  let letzteZeitS: number | null = null

  function passeGroesseAn() {
    const { breite, hoehe } = berechneBuehne(window.innerWidth, window.innerHeight)
    buehnenElement.style.width = `${breite}px`
    buehnenElement.style.height = `${hoehe}px`
    renderer.setPixelRatio(berechnePixelRatio(window.devicePixelRatio, breite, hoehe))
    renderer.setSize(breite, hoehe)
    kamera.aspect = breite / hoehe
    kamera.updateProjectionMatrix()
  }
  passeGroesseAn()

  return {
    passeGroesseAn,
    verarbeiteEreignisse(ereignisse) {
      for (const ereignis of ereignisse) {
        if (ereignis.art === 'wandDurchbruch') welt.wandDurchbrochen()
      }
    },
    zeichne(zustand, zeitS) {
      const dt = letzteZeitS === null ? 0 : Math.min(0.1, Math.max(0, zeitS - letzteZeitS))
      letzteZeitS = zeitS

      const zielX = spurZuX(zustand.spur)
      figurX += (zielX - figurX) * Math.min(1, 12 * dt)

      figur.animiere(figurX, zustand, zeitS)
      welt.aktualisiere(zustand, zeitS)
      folge(figurX, zustand.z)
      renderer.render(szene, kamera)
    },
  }
}
