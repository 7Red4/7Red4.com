import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createBlockMaterial } from './materials'
import * as palette from './palette'

/** RoundedBoxGeometry 的圓角不能超過最短邊的一半，超過會產生翻面的破幾何 */
const box = (w: number, h: number, d: number, radius = 0.12) =>
  new RoundedBoxGeometry(w, h, d, 4, Math.min(radius, Math.min(w, h, d) / 2 - 0.001))

export type BuildingMaterials = {
  wall: THREE.Material
  roof: THREE.Material
  door: THREE.Material
  window: THREE.Material
  accent: THREE.Material
}

export const createBuildingMaterials = (): BuildingMaterials => ({
  wall: createBlockMaterial(palette.WALL, 'wood', 4001),
  roof: createBlockMaterial(palette.PAINTED_RED, 'painted'),
  door: createBlockMaterial(palette.BROWN_WOOD[0], 'wood', 4002),
  window: createBlockMaterial(palette.WINDOW, 'painted'),
  accent: createBlockMaterial(palette.PAINTED_YELLOW, 'painted'),
})

/** 房子：關於我。正面朝 +Z，也就是玩家從場地中央走過來的方向 */
export const createHouse = (m: BuildingMaterials) => {
  const group = new THREE.Group()
  const WIDTH = 5.4
  const DEPTH = 4.4
  const HEIGHT = 3
  const front = DEPTH / 2

  const body = new THREE.Mesh(box(WIDTH, HEIGHT, DEPTH, 0.22), m.wall)
  body.position.y = HEIGHT / 2
  group.add(body)

  // 人字屋頂用兩片傾斜的板子拼，比用三角柱好控制角度
  const pitch = 0.62
  const slabDepth = 3.1
  for (const side of [1, -1]) {
    const slab = new THREE.Mesh(box(WIDTH + 0.9, 0.3, slabDepth, 0.13), m.roof)
    // 繞 X 轉正角度會讓 +Z 那端往下沉，屋簷才會低於屋脊
    slab.rotation.x = side * pitch
    slab.position.set(
      0,
      HEIGHT + (Math.sin(pitch) * slabDepth) / 2 - 0.05,
      (side * Math.cos(pitch) * slabDepth) / 2
    )
    group.add(slab)
  }

  const door = new THREE.Mesh(box(1.2, 1.9, 0.26, 0.1), m.door)
  door.position.set(0, 0.95, front)
  group.add(door)

  for (const x of [-1.75, 1.75]) {
    const window = new THREE.Mesh(box(1.1, 0.95, 0.22, 0.1), m.window)
    window.position.set(x, 1.85, front)
    group.add(window)
  }

  return { group, halfX: WIDTH / 2, halfZ: DEPTH / 2 }
}

/** 郵箱：聯絡方式。擺在房子前面 */
export const createMailbox = (m: BuildingMaterials) => {
  const group = new THREE.Group()

  const post = new THREE.Mesh(box(0.2, 1.2, 0.2, 0.07), m.door)
  post.position.y = 0.6
  group.add(post)

  const shell = new THREE.Mesh(box(0.8, 0.52, 0.55, 0.22), m.roof)
  shell.position.y = 1.42
  group.add(shell)

  // 側邊那面立起來的小旗子
  const flag = new THREE.Mesh(box(0.09, 0.42, 0.3, 0.04), m.accent)
  flag.position.set(0.45, 1.68, 0)
  group.add(flag)

  return { group, radius: 0.45 }
}

/** 車庫工作坊：作品集 */
export const createGarage = (m: BuildingMaterials) => {
  const group = new THREE.Group()
  const WIDTH = 7.6
  const DEPTH = 5.4
  const HEIGHT = 3.4
  const front = DEPTH / 2

  const body = new THREE.Mesh(box(WIDTH, HEIGHT, DEPTH, 0.24), m.wall)
  body.position.y = HEIGHT / 2
  group.add(body)

  // 平頂加一圈外伸的簷口，工廠感比人字頂強
  const roof = new THREE.Mesh(box(WIDTH + 0.8, 0.46, DEPTH + 0.8, 0.2), m.door)
  roof.position.y = HEIGHT + 0.2
  group.add(roof)

  const shutter = new THREE.Mesh(box(4.8, 2.5, 0.3, 0.12), m.accent)
  shutter.position.set(-0.9, 1.25, front)
  group.add(shutter)

  const sideDoor = new THREE.Mesh(box(1.1, 1.9, 0.26, 0.1), m.door)
  sideDoor.position.set(2.8, 0.95, front)
  group.add(sideDoor)

  const sign = new THREE.Mesh(box(2.6, 0.55, 0.24, 0.14), m.roof)
  sign.position.set(-0.9, 3.05, front)
  group.add(sign)

  return { group, halfX: WIDTH / 2, halfZ: DEPTH / 2 }
}
