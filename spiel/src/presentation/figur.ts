import * as THREE from 'three'
import { SPUR_ABSTAND } from '../sim/konstanten'
import type { SimZustand } from '../sim/zustand'
import { PALETTE } from './palette'

function material(farbe: number) {
  return new THREE.MeshLambertMaterial({ color: farbe, flatShading: true })
}

export function erzeugeFigur() {
  const gruppe = new THREE.Group()

  const koerper = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.95, 0.5), material(PALETTE.figurKoerper))
  koerper.position.y = 0.98
  const kopf = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), material(PALETTE.figurKopf))
  kopf.position.y = 1.78

  const beinGeometrie = new THREE.BoxGeometry(0.26, 0.5, 0.3)
  beinGeometrie.translate(0, -0.25, 0) // Drehpunkt an der Huefte
  const beinLinks = new THREE.Mesh(beinGeometrie, material(PALETTE.figurHose))
  beinLinks.position.set(-0.2, 0.5, 0)
  const beinRechts = new THREE.Mesh(beinGeometrie, material(PALETTE.figurHose))
  beinRechts.position.set(0.2, 0.5, 0)

  for (const teil of [koerper, kopf, beinLinks, beinRechts]) {
    teil.castShadow = true
    gruppe.add(teil)
  }

  function animiere(figurX: number, zustand: SimZustand, zeitS: number) {
    const amBoden = zustand.hoehe === 0
    const wippen = amBoden ? Math.abs(Math.sin(zeitS * 14)) * 0.06 : 0
    gruppe.position.set(figurX, zustand.hoehe + wippen, zustand.z)
    const zielX = (zustand.spur - 1) * SPUR_ABSTAND
    gruppe.rotation.z = THREE.MathUtils.clamp((figurX - zielX) * 0.12, -0.25, 0.25)

    const schwung = Math.sin(zeitS * 14)
    beinLinks.rotation.x = amBoden ? schwung * 0.9 : 0.5
    beinRechts.rotation.x = amBoden ? -schwung * 0.9 : -0.3
  }

  return { gruppe, animiere }
}
