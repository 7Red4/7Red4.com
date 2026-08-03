import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { applyCurvature } from './curvedWorld'
import { createBlockMaterial, createRandom } from './materials'
import { createBuildingMaterials, createGarage, createHouse, createMailbox } from './buildings'
import * as palette from './palette'

export type InteractAction = 'about' | 'contact' | 'works'

export type Interactable = {
  id: string
  x: number
  z: number
  /** 走進這個半徑內就會出現互動提示 */
  radius: number
  action: InteractAction
}

/** 圓形擋物件（樹、積木、郵箱）與軸對齊方框（建築） */
export type Collider =
  | { kind: 'circle'; x: number; z: number; radius: number }
  | { kind: 'box'; x: number; z: number; halfX: number; halfZ: number }

/** 站上去要抬高的平面 */
export type Surface = { x: number; z: number; radius: number; y: number }

export const WORLD_RADIUS = 62

/**
 * 貼地面片要墊高的量。
 * 曲率 k=0.0042、最大的一片半徑約 7，內部相對地面下沉 k·7² ≈ 0.2，
 * 這裡取略大於該值，邊緣浮起的程度在這個鏡頭角度下看不出來。
 */
const PATCH_LIFT = 0.26

/** 兩個主題場地，散景不要蓋到上面 */
const AREAS = [
  { id: 'about' as const, x: -20, z: -16 },
  { id: 'works' as const, x: 22, z: -14 },
]
const AREA_CLEARANCE = 11

/** 幾種標準尺寸，共用 geometry 減少物件數 */
const BLOCK_SIZES: [number, number, number][] = [
  [1, 1, 1],
  [2, 1, 1],
  [1, 2, 1],
  [2, 0.6, 2],
  [1.5, 1.5, 1.5],
  [3, 0.7, 1.2],
]

/** RoundedBoxGeometry 的圓角不能超過最短邊的一半，超過會產生翻面的破幾何 */
const roundedBox = (w: number, h: number, d: number, radius = 0.12) =>
  new RoundedBoxGeometry(w, h, d, 4, Math.min(radius, Math.min(w, h, d) / 2 - 0.001))

/**
 * 貼在地面上的圓角面。草地與場地都是薄薄一片，
 * 用有厚度的盒子做的話圓角半徑會被厚度限制住，只能是銳角。
 *
 * 注意：ShapeGeometry 只在輪廓上產生頂點，內部完全沒有頂點。
 * 曲率是逐頂點計算的，所以這種大片平面的內部是一條直線，
 * 會沉到密網格地面之下約 k·(半徑)²。呼叫端必須墊高超過那個量，見 PATCH_LIFT。
 */
const roundedPatch = (width: number, depth: number, radius: number) => {
  const shape = new THREE.Shape()
  const w = width / 2
  const d = depth / 2
  const r = Math.min(radius, w, d)

  shape.moveTo(-w + r, -d)
  shape.lineTo(w - r, -d)
  shape.quadraticCurveTo(w, -d, w, -d + r)
  shape.lineTo(w, d - r)
  shape.quadraticCurveTo(w, d, w - r, d)
  shape.lineTo(-w + r, d)
  shape.quadraticCurveTo(-w, d, -w, d - r)
  shape.lineTo(-w, -d + r)
  shape.quadraticCurveTo(-w, -d, -w + r, -d)

  const geometry = new THREE.ShapeGeometry(shape, 8)
  geometry.rotateX(-Math.PI / 2)
  return geometry
}

export type BuiltWorld = {
  group: THREE.Group
  interactables: Interactable[]
  colliders: Collider[]
  surfaces: Surface[]
}

export const buildWorld = (): BuiltWorld => {
  const group = new THREE.Group()
  const random = createRandom(20270301)
  const colliders: Collider[] = []
  const interactables: Interactable[] = []
  const surfaces: Surface[] = []

  const tooCloseToArea = (x: number, z: number, extra = 0) =>
    AREAS.some((area) => Math.hypot(x - area.x, z - area.z) < AREA_CLEARANCE + extra)

  // --- 地面 ---
  // 曲率是逐頂點算的，頂點之間走直線。分段太疏的話那段直線會偏離真正的拋物線，
  // 誤差大到會從草地或積木底下戳出來，所以這裡切得比直覺需要的更密
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(260, 260, 220, 220),
    applyCurvature(
      new THREE.MeshStandardMaterial({
        color: palette.GROUND,
        roughness: 0.95,
        metalness: 0,
      })
    )
  )
  ground.rotation.x = -Math.PI / 2
  group.add(ground)

  // --- 材質池：重複使用才不會每塊積木各開一份 ---
  const lightWoodMaterials = palette.LIGHT_WOOD.map((color, i) =>
    createBlockMaterial(color, 'wood', 1000 + i * 37)
  )
  const brownWoodMaterials = palette.BROWN_WOOD.map((color, i) =>
    createBlockMaterial(color, 'wood', 2000 + i * 53)
  )
  const paintedMaterials = [
    createBlockMaterial(palette.PAINTED_RED, 'painted'),
    createBlockMaterial(palette.PAINTED_YELLOW, 'painted'),
  ]
  const grassMaterials = palette.GRASS.map((color) =>
    applyCurvature(new THREE.MeshStandardMaterial({ color, roughness: 0.95 }))
  )
  const trunkMaterial = createBlockMaterial(palette.TRUNK, 'wood', 3001)
  const foliageMaterials = palette.FOLIAGE.map((color) =>
    applyCurvature(new THREE.MeshStandardMaterial({ color, roughness: 0.9 }))
  )
  const buildingMaterials = createBuildingMaterials()

  const blockGeometries = BLOCK_SIZES.map(([w, h, d]) => roundedBox(w, h, d))

  /**
   * 大部分是淺木色，偶爾才出現全漆的經典積木紅與大黃色，
   * 以及少數幾塊咖啡色木紋。比例刻意壓低，強調色才有份量。
   */
  const pickBlockMaterial = () => {
    const roll = random()
    if (roll < 0.08) return paintedMaterials[random() < 0.55 ? 0 : 1]
    if (roll < 0.2) return brownWoodMaterials[Math.floor(random() * brownWoodMaterials.length)]
    return lightWoodMaterials[Math.floor(random() * lightWoodMaterials.length)]
  }

  // --- 草地 ---
  const grassGeometries = [
    roundedPatch(9, 7, 1.6),
    roundedPatch(6, 6, 1.3),
    roundedPatch(12, 5, 1.8),
  ]
  for (let i = 0; i < 26; i++) {
    const angle = random() * Math.PI * 2
    const distance = 6 + random() * (WORLD_RADIUS - 12)
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    const patch = new THREE.Mesh(
      grassGeometries[Math.floor(random() * grassGeometries.length)],
      grassMaterials[Math.floor(random() * grassMaterials.length)]
    )
    patch.position.set(x, PATCH_LIFT, z)
    patch.rotation.y = random() * Math.PI * 2
    group.add(patch)
  }

  // --- 散落的積木 ---
  for (let i = 0; i < 64; i++) {
    const angle = random() * Math.PI * 2
    const distance = 7 + random() * (WORLD_RADIUS - 10)
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    if (tooCloseToArea(x, z)) continue

    const index = Math.floor(random() * blockGeometries.length)
    const geometry = blockGeometries[index]
    const [w, h, d] = BLOCK_SIZES[index]
    const block = new THREE.Mesh(geometry, pickBlockMaterial())
    block.position.set(x, h / 2, z)
    block.rotation.y = random() * Math.PI * 2
    group.add(block)

    // 積木會隨機轉向，用外接圓當碰撞形狀最省事也不會卡角
    colliders.push({ kind: 'circle', x, z, radius: Math.hypot(w, d) / 2 })
  }

  // --- 樹 ---
  const trunkGeometry = roundedBox(0.46, 1.7, 0.46, 0.14)
  const foliageGeometry = roundedBox(2.1, 1.5, 2.1, 0.45)
  for (let i = 0; i < 18; i++) {
    const angle = random() * Math.PI * 2
    const distance = 10 + random() * (WORLD_RADIUS - 14)
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    if (tooCloseToArea(x, z)) continue

    const tree = new THREE.Group()

    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.y = 0.85
    tree.add(trunk)

    const foliageMaterial = foliageMaterials[Math.floor(random() * foliageMaterials.length)]
    const lower = new THREE.Mesh(foliageGeometry, foliageMaterial)
    lower.position.y = 2.2
    tree.add(lower)

    const upper = new THREE.Mesh(foliageGeometry, foliageMaterial)
    upper.position.y = 3.1
    upper.scale.setScalar(0.68)
    upper.rotation.y = Math.PI * 0.25
    tree.add(upper)

    tree.position.set(x, 0, z)
    tree.rotation.y = random() * Math.PI * 2
    tree.scale.setScalar(0.85 + random() * 0.4)
    group.add(tree)

    // 只擋樹幹，不擋樹冠，否則走在樹下會被推開很奇怪
    colliders.push({ kind: 'circle', x, z, radius: 0.42 })
  }

  // --- 主題場地 ---
  const areaPatch = roundedPatch(16, 16, 2.6)
  const surfaceY = PATCH_LIFT + 0.03

  for (const area of AREAS) {
    const platform = new THREE.Mesh(areaPatch, lightWoodMaterials[2])
    platform.position.set(area.x, surfaceY, area.z)
    group.add(platform)
    surfaces.push({ x: area.x, z: area.z, radius: 8, y: surfaceY })
  }

  // 關於我：房子 + 門前的郵箱
  const aboutArea = AREAS[0]
  const house = createHouse(buildingMaterials)
  house.group.position.set(aboutArea.x, surfaceY, aboutArea.z - 2.4)
  group.add(house.group)
  colliders.push({
    kind: 'box',
    x: aboutArea.x,
    z: aboutArea.z - 2.4,
    halfX: house.halfX,
    halfZ: house.halfZ,
  })
  interactables.push({
    id: 'house',
    x: aboutArea.x,
    z: aboutArea.z - 2.4 + house.halfZ,
    radius: 3.4,
    action: 'about',
  })

  const mailbox = createMailbox(buildingMaterials)
  const mailboxX = aboutArea.x + 2.6
  const mailboxZ = aboutArea.z + 2.6
  mailbox.group.position.set(mailboxX, surfaceY, mailboxZ)
  group.add(mailbox.group)
  colliders.push({ kind: 'circle', x: mailboxX, z: mailboxZ, radius: mailbox.radius })
  interactables.push({
    id: 'mailbox',
    x: mailboxX,
    z: mailboxZ,
    radius: 2.2,
    action: 'contact',
  })

  // 作品集：車庫工作坊
  const worksArea = AREAS[1]
  const garage = createGarage(buildingMaterials)
  garage.group.position.set(worksArea.x, surfaceY, worksArea.z - 2)
  group.add(garage.group)
  colliders.push({
    kind: 'box',
    x: worksArea.x,
    z: worksArea.z - 2,
    halfX: garage.halfX,
    halfZ: garage.halfZ,
  })
  interactables.push({
    id: 'garage',
    x: worksArea.x,
    z: worksArea.z - 2 + garage.halfZ,
    radius: 4,
    action: 'works',
  })

  return { group, interactables, colliders, surfaces }
}
