import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref } from 'vue'
import * as THREE from 'three'
import {
  buildWorld,
  WORLD_RADIUS,
  type Collider,
  type InteractAction,
  type Interactable,
  type Surface,
} from '../world/scenery'
import { createCharacter } from '../world/character'
import * as palette from '../world/palette'
import type { InputState } from './useInput'

const MOVE_SPEED = 9
const RUN_MULTIPLIER = 1.75
const TURN_SPEED = 12
const MAX_PIXEL_RATIO = 2
const PLAYER_RADIUS = 0.55

// 起跳速度 7.5、重力 22 → 跳高約 1.3、滯空約 0.7 秒，手感偏俐落
const JUMP_VELOCITY = 7.5
const GRAVITY = 22

/**
 * 固定的上帝視角：相機不旋轉，只跟著角色，角色永遠在畫面正中央。
 * 角度刻意不要太垂直，否則整個畫面都是地面、看不到地平線，
 * 曲率也就白做了。注視點往前推一點，讓前方的視野多於後方。
 */
const CAMERA_OFFSET = new THREE.Vector3(0, 12.5, 20)
const CAMERA_TARGET = new THREE.Vector3(0, 1.4, -6)

const disposeMaterial = (material: THREE.Material) => {
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && (value as THREE.Texture).isTexture) {
      ;(value as THREE.Texture).dispose()
    }
  }
  material.dispose()
}

const disposeScene = (scene: THREE.Scene) => {
  scene.traverse((object) => {
    const { geometry, material } = object as Partial<THREE.Mesh>
    geometry?.dispose()
    if (Array.isArray(material)) material.forEach(disposeMaterial)
    else if (material) disposeMaterial(material)
  })
  scene.clear()
}

export type NearbyInteractable = { id: string; action: InteractAction }

export function useWorldScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  input: InputState,
  enabled: Ref<boolean>
) {
  /** 站在哪個可互動物件旁邊（沒有就是 null） */
  const nearby = ref<NearbyInteractable | null>(null)
  const scene = shallowRef<THREE.Scene | null>(null)

  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let worldRoot: THREE.Group | null = null
  let character: ReturnType<typeof createCharacter> | null = null

  let interactables: Interactable[] = []
  let colliders: Collider[] = []
  let surfaces: Surface[] = []

  let animationId: number | null = null
  let resizeObserver: ResizeObserver | null = null
  let lastTime = 0
  let elapsed = 0
  let facing = 0

  /** 相對地面的離地高度與垂直速度 */
  let jumpOffset = 0
  let verticalVelocity = 0
  let groundY = 0

  // 角色固定在原點，實際移動的是世界；這裡記錄「角色在世界裡的邏輯座標」。
  // x 是世界的 x，y 是世界的 z
  const position = new THREE.Vector2(0, 0)

  const applySize = () => {
    const canvas = canvasRef.value
    if (!canvas || !camera || !renderer) return
    const width = Math.max(1, canvas.clientWidth)
    const height = Math.max(1, canvas.clientHeight)
    const aspect = width / height
    camera.aspect = aspect

    // 直式畫面的水平視野窄很多，鏡頭沿原方向往後退一點才看得到足夠的範圍
    const narrowness = Math.min(1, Math.max(0, (1.6 - aspect) / 1.1))
    camera.position.copy(CAMERA_OFFSET).multiplyScalar(1 + narrowness * 0.42)
    camera.lookAt(CAMERA_TARGET)
    camera.updateProjectionMatrix()

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
    renderer.setSize(width, height, false)
  }

  /** 位移之後把角色推出所有重疊的擋物件 */
  const resolveCollisions = () => {
    for (const collider of colliders) {
      const dx = position.x - collider.x
      const dz = position.y - collider.z

      if (collider.kind === 'circle') {
        const minDistance = collider.radius + PLAYER_RADIUS
        const distanceSq = dx * dx + dz * dz
        if (distanceSq >= minDistance * minDistance) continue
        // 剛好完全重合時給一個預設方向，免得除以零
        const distance = Math.sqrt(distanceSq) || 0.0001
        position.x = collider.x + (dx / distance) * minDistance
        position.y = collider.z + (dz / distance) * minDistance
        continue
      }

      const overlapX = collider.halfX + PLAYER_RADIUS - Math.abs(dx)
      const overlapZ = collider.halfZ + PLAYER_RADIUS - Math.abs(dz)
      if (overlapX <= 0 || overlapZ <= 0) continue

      // 沿穿透較淺的那一軸推出去，這樣沿著牆走才會滑順而不是被彈開
      if (overlapX < overlapZ) {
        position.x = collider.x + Math.sign(dx || 1) * (collider.halfX + PLAYER_RADIUS)
      } else {
        position.y = collider.z + Math.sign(dz || 1) * (collider.halfZ + PLAYER_RADIUS)
      }
    }
  }

  const updateNearby = () => {
    let closest: Interactable | null = null
    let closestDistanceSq = Infinity

    for (const item of interactables) {
      const dx = position.x - item.x
      const dz = position.y - item.z
      const distanceSq = dx * dx + dz * dz
      if (distanceSq > item.radius * item.radius) continue
      if (distanceSq < closestDistanceSq) {
        closest = item
        closestDistanceSq = distanceSq
      }
    }

    if (closest?.id !== nearby.value?.id) {
      nearby.value = closest ? { id: closest.id, action: closest.action } : null
    }
  }

  const surfaceHeight = () => {
    for (const surface of surfaces) {
      const dx = position.x - surface.x
      const dz = position.y - surface.z
      if (dx * dx + dz * dz <= surface.radius * surface.radius) return surface.y
    }
    return 0
  }

  const tick = (now: number) => {
    animationId = requestAnimationFrame(tick)
    if (!renderer || !camera || !scene.value || !worldRoot || !character) return

    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0
    lastTime = now

    const active = enabled.value
    const moving = active && (input.x !== 0 || input.z !== 0)
    const running = moving && input.running

    if (moving) {
      const speed = MOVE_SPEED * (running ? RUN_MULTIPLIER : 1)
      position.x += input.x * speed * delta
      position.y += input.z * speed * delta

      // 世界是圓的，走到邊緣就停住（曲率已經把更遠的地方壓到地平線下）
      const distance = position.length()
      if (distance > WORLD_RADIUS) position.multiplyScalar(WORLD_RADIUS / distance)

      resolveCollisions()

      // 移動的是世界，不是角色
      worldRoot.position.set(-position.x, 0, -position.y)

      // 朝向用最短路徑補間，不然左右轉會整圈繞
      const target = Math.atan2(input.x, input.z)
      let difference = target - facing
      difference = ((difference + Math.PI) % (Math.PI * 2)) - Math.PI
      if (difference < -Math.PI) difference += Math.PI * 2
      facing += difference * Math.min(1, TURN_SPEED * delta)
      character.group.rotation.y = facing

      updateNearby()
    }

    // 站上場地時把角色抬到平面高度，否則小腿會埋進去。
    // 放在移動判斷之外，停下來時才補得完
    const targetY = surfaceHeight()
    groundY += (targetY - groundY) * Math.min(1, 12 * delta)
    character.group.position.y = groundY

    // 跳躍。只有站在地上時才受理，沒有二段跳
    if (active && jumpOffset === 0 && input.consumeJump()) {
      verticalVelocity = JUMP_VELOCITY
    }
    if (verticalVelocity !== 0 || jumpOffset > 0) {
      verticalVelocity -= GRAVITY * delta
      jumpOffset += verticalVelocity * delta
      if (jumpOffset <= 0) {
        jumpOffset = 0
        verticalVelocity = 0
      }
    }

    elapsed += delta
    character.update({ elapsed, moving, running, jump: jumpOffset })
    renderer.render(scene.value, camera)
  }

  const start = () => {
    if (animationId === null) {
      lastTime = 0
      animationId = requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    if (animationId === null) return
    cancelAnimationFrame(animationId)
    animationId = null
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') start()
    else stop()
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const nextScene = new THREE.Scene()
    nextScene.background = new THREE.Color(palette.SKY_BOTTOM)
    // 範圍收緊一點，讓地面在幾何上的地平線之前就先融進天空，
    // 否則地平線會出現一道硬邊
    nextScene.fog = new THREE.Fog(palette.FOG, 42, 88)
    scene.value = nextScene

    // near 不能貪小：貼地的草地與場地只比地面高一點點，
    // near=0.1 配 far=400 的深度精度在遠處分不出這個差距，會整片 z-fighting
    camera = new THREE.PerspectiveCamera(38, 1, 1, 300)

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setClearColor(palette.SKY_BOTTOM)
    applySize()

    const built = buildWorld()
    worldRoot = built.group
    interactables = built.interactables
    colliders = built.colliders
    surfaces = built.surfaces
    nextScene.add(worldRoot)

    character = createCharacter()
    nextScene.add(character.group)

    // 低彩度的畫風靠柔和的環境光撐起來，不用陰影貼圖
    nextScene.add(new THREE.HemisphereLight(0xfff6e6, 0xbfae94, 2.1))
    const sun = new THREE.DirectionalLight(0xfff1dc, 1.6)
    sun.position.set(12, 20, 8)
    nextScene.add(sun)

    resizeObserver = new ResizeObserver(applySize)
    resizeObserver.observe(canvas)
    document.addEventListener('visibilitychange', onVisibilityChange)

    updateNearby()
    start()
  })

  onBeforeUnmount(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    resizeObserver?.disconnect()
    resizeObserver = null

    if (scene.value) disposeScene(scene.value)
    renderer?.dispose()
    renderer?.forceContextLoss()

    scene.value = null
    camera = null
    renderer = null
    worldRoot = null
    character = null
    interactables = []
    colliders = []
    surfaces = []
    jumpOffset = 0
    verticalVelocity = 0
    groundY = 0
  })

  return { nearby }
}
