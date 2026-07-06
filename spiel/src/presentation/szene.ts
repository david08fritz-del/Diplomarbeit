import * as THREE from 'three'
import { PALETTE } from './palette'

export function erzeugeSzene() {
  const szene = new THREE.Scene()
  szene.background = new THREE.Color(PALETTE.himmel)
  szene.fog = new THREE.Fog(PALETTE.himmel, 45, 95)

  const kamera = new THREE.PerspectiveCamera(58, 9 / 16, 0.1, 130)

  szene.add(new THREE.AmbientLight(0xffffff, 0.55))
  const sonne = new THREE.DirectionalLight(0xfff3d6, 1.7)
  sonne.castShadow = true
  sonne.shadow.mapSize.set(1024, 1024)
  sonne.shadow.camera.left = -14
  sonne.shadow.camera.right = 14
  sonne.shadow.camera.top = 30
  sonne.shadow.camera.bottom = -12
  sonne.shadow.camera.near = 1
  sonne.shadow.camera.far = 60
  szene.add(sonne, sonne.target)

  function folge(figurX: number, figurZ: number) {
    kamera.position.set(figurX * 0.4, 4.6, figurZ - 7)
    kamera.lookAt(figurX * 0.4, 1.0, figurZ + 6)
    sonne.position.set(8, 14, figurZ - 6)
    sonne.target.position.set(0, 0, figurZ + 8)
  }

  return { szene, kamera, folge }
}
