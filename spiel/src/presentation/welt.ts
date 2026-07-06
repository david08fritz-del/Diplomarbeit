import * as THREE from 'three'
import { SPUR_ABSTAND, WAND_INTERVALL } from '../sim/konstanten'
import { muenzenImBereich } from '../sim/muenzen'
import type { SimZustand } from '../sim/zustand'
import { PALETTE } from './palette'

const SEGMENT_LAENGE = 30
const SEGMENTE = 6
const MUENZEN_POOL = 36
const DURCHBRUCH_DAUER = 0.5

function material(farbe: number) {
  return new THREE.MeshLambertMaterial({ color: farbe, flatShading: true })
}

function baueKulisse(segment: THREE.Group, segmentIndex: number) {
  for (let slot = 0; slot < 6; slot++) {
    for (const seite of [-1, 1]) {
      const zLokal = -SEGMENT_LAENGE / 2 + 2.5 + slot * 5
      const x = seite * (5.2 + (((segmentIndex * 6 + slot) * 7) % 3) * 0.5)
      const art = (segmentIndex * 6 + slot + (seite === 1 ? 1 : 0)) % 3
      const gruppe = new THREE.Group()
      if (art === 0) {
        const wandFarbe = PALETTE.hausWaende[(segmentIndex + slot) % PALETTE.hausWaende.length]
        const haus = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), material(wandFarbe))
        haus.position.y = 1.1
        const dach = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 2.8), material(PALETTE.hausDach))
        dach.position.y = 2.5
        gruppe.add(haus, dach)
      } else if (art === 1) {
        const stamm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.3, 0.35), material(PALETTE.baumStamm))
        stamm.position.y = 0.65
        const krone = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 1.5), material(PALETTE.baumKrone))
        krone.position.y = 2.1
        gruppe.add(stamm, krone)
      } else {
        const busch = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.1), material(PALETTE.busch))
        busch.position.y = 0.4
        gruppe.add(busch)
      }
      gruppe.position.set(x, 0, zLokal)
      gruppe.traverse((kind) => {
        if (kind instanceof THREE.Mesh) kind.castShadow = true
      })
      segment.add(gruppe)
    }
  }
}

export function erzeugeWelt(szene: THREE.Scene) {
  const segmente: THREE.Group[] = []
  for (let i = 0; i < SEGMENTE; i++) {
    const segment = new THREE.Group()

    const spurband = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.5, SEGMENT_LAENGE), material(PALETTE.spur))
    spurband.position.y = -0.25
    spurband.receiveShadow = true
    segment.add(spurband)

    for (const x of [-1, 1]) {
      const linie = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, SEGMENT_LAENGE), material(PALETTE.spurRand))
      linie.position.set(x * (SPUR_ABSTAND / 2), 0.02, 0)
      segment.add(linie)
    }

    for (const seite of [-1, 1]) {
      const wiese = new THREE.Mesh(new THREE.BoxGeometry(14, 0.44, SEGMENT_LAENGE), material(PALETTE.boden))
      wiese.position.set(seite * 10.4, -0.28, 0)
      wiese.receiveShadow = true
      segment.add(wiese)
    }

    baueKulisse(segment, i)
    segment.position.z = i * SEGMENT_LAENGE
    szene.add(segment)
    segmente.push(segment)
  }

  const muenzGeometrie = new THREE.BoxGeometry(0.55, 0.55, 0.14)
  const muenzMaterial = material(PALETTE.muenze)
  const muenzenPool: THREE.Mesh[] = []
  for (let i = 0; i < MUENZEN_POOL; i++) {
    const muenze = new THREE.Mesh(muenzGeometrie, muenzMaterial)
    muenze.castShadow = true
    muenze.visible = false
    szene.add(muenze)
    muenzenPool.push(muenze)
  }

  const wand = new THREE.Mesh(new THREE.BoxGeometry(6.8, 3, 0.7), material(PALETTE.wand))
  wand.castShadow = true
  szene.add(wand)

  let durchbruchAngefordert = false
  let durchbruchZeit = -1
  let durchbruchZ = 0

  function aktualisiere(zustand: SimZustand, zeitS: number) {
    for (const segment of segmente) {
      while (segment.position.z + SEGMENT_LAENGE / 2 < zustand.z - 10) {
        segment.position.z += SEGMENTE * SEGMENT_LAENGE
      }
    }

    const sichtbar = muenzenImBereich(zustand.z - 6, zustand.z + 55).filter(
      (m) => !zustand.eingesammelt.has(m.id),
    )
    for (let i = 0; i < muenzenPool.length; i++) {
      const mesh = muenzenPool[i]
      const muenze = sichtbar[i]
      mesh.visible = Boolean(muenze)
      if (muenze) {
        mesh.position.set((muenze.spur - 1) * SPUR_ABSTAND, 0.75, muenze.z)
        mesh.rotation.y = zeitS * 3
      }
    }

    if (durchbruchAngefordert) {
      durchbruchAngefordert = false
      durchbruchZeit = zeitS
      durchbruchZ = (zustand.naechsteWand - 1) * WAND_INTERVALL
    }
    const durchbruchAktiv = durchbruchZeit >= 0 && zeitS - durchbruchZeit < DURCHBRUCH_DAUER
    if (durchbruchAktiv) {
      const t = (zeitS - durchbruchZeit) / DURCHBRUCH_DAUER
      wand.position.set(0, 1.5 - 1.5 * t, durchbruchZ)
      wand.scale.set(1 + t * 0.4, Math.max(0.01, 1 - t), 1)
    } else {
      wand.scale.set(1, 1, 1)
      wand.position.set(0, 1.5, zustand.naechsteWand * WAND_INTERVALL)
    }
  }

  function wandDurchbrochen() {
    durchbruchAngefordert = true
  }

  return { aktualisiere, wandDurchbrochen }
}
