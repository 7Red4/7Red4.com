import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import * as THREE from 'three'

export type SceneContext = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
}

/** 每幀呼叫，elapsed 為自場景建立以來的秒數 */
export type FrameHandler = (elapsed: number) => void

export interface UseThreeSceneOptions {
  fov?: number
  near?: number
  far?: number
  position?: [number, number, number]
  lookAt?: [number, number, number]
  alpha?: boolean
  /** 全螢幕背景用 'window'，跟隨容器大小的用 'canvas' */
  size?: 'window' | 'canvas'
  /**
   * 模型的大致尺寸。畫布很窄（手機直式）時水平視野會被壓縮，
   * 給了這個值就會自動把鏡頭往後退到框得住，而不是把模型裁掉。
   */
  frame?: { width?: number; height?: number }
  /** 建立場景內容，回傳的函式會在每幀被呼叫 */
  build: (ctx: SceneContext) => FrameHandler | void
}

const MAX_PIXEL_RATIO = 2

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** material 本身與它掛著的所有貼圖都要 dispose，否則留在 GPU */
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

  if ((scene.background as THREE.Texture)?.isTexture) {
    ;(scene.background as THREE.Texture).dispose()
  }
  scene.clear()
}

/**
 * 建立並管理一個 Three.js 場景。
 *
 * 收掉四個 3D 元件原本各自漏掉的事：resize listener 沒移除、geometry/material
 * 沒釋放，以及四個場景會同時以 60fps 無條件運轉（就算捲出畫面也照跑）。
 */
export function useThreeScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: UseThreeSceneOptions
) {
  const {
    fov = 50,
    near = 0.1,
    far = 1000,
    position = [0, 0, 5],
    lookAt,
    alpha = true,
    size = 'canvas',
    frame,
    build,
  } = options

  // 鏡頭沿著原本的視線方向前後移動，方向與注視點固定
  const target = new THREE.Vector3(...(lookAt ?? [0, 0, 0]))
  const baseOffset = new THREE.Vector3(...position).sub(target)
  const baseDistance = baseOffset.length()
  const viewDirection = baseOffset.clone().normalize()

  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let onFrame: FrameHandler | void
  let animationId: number | null = null
  let startTime = 0

  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let inViewport = true
  let pageVisible = true

  const getSize = () => {
    if (size === 'window') {
      return { width: window.innerWidth, height: window.innerHeight }
    }
    const canvas = canvasRef.value
    return {
      width: Math.max(1, canvas?.clientWidth ?? 1),
      height: Math.max(1, canvas?.clientHeight ?? 1),
    }
  }

  const applySize = () => {
    if (!camera || !renderer) return
    const { width, height } = getSize()
    const aspect = width / height
    camera.aspect = aspect

    if (frame) {
      const halfViewport = Math.tan(((fov * Math.PI) / 180) / 2)
      let distance = baseDistance
      if (frame.height) {
        distance = Math.max(distance, frame.height / (2 * halfViewport))
      }
      if (frame.width) {
        distance = Math.max(distance, frame.width / (2 * halfViewport * aspect))
      }
      camera.position.copy(target).addScaledVector(viewDirection, distance)
      camera.lookAt(target)
    }

    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
    // canvas 模式的尺寸由 CSS 決定，three 不要覆寫 inline style
    renderer.setSize(width, height, size !== 'canvas')
  }

  const renderFrame = () => {
    if (!renderer || !scene || !camera) return
    onFrame?.((performance.now() - startTime) / 1000)
    renderer.render(scene, camera)
  }

  const tick = () => {
    animationId = requestAnimationFrame(tick)
    renderFrame()
  }

  const startLoop = () => {
    if (animationId === null) animationId = requestAnimationFrame(tick)
  }

  const stopLoop = () => {
    if (animationId === null) return
    cancelAnimationFrame(animationId)
    animationId = null
  }

  /** 只在畫布可見且分頁在前景時才燒 GPU */
  const syncLoop = () => {
    if (prefersReducedMotion()) return
    if (inViewport && pageVisible) startLoop()
    else stopLoop()
  }

  const handleVisibilityChange = () => {
    pageVisible = document.visibilityState === 'visible'
    syncLoop()
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    scene = new THREE.Scene()
    scene.background = null

    const { width, height } = getSize()
    camera = new THREE.PerspectiveCamera(fov, width / height, near, far)
    camera.position.set(...position)
    if (lookAt) camera.lookAt(...lookAt)

    renderer = new THREE.WebGLRenderer({ canvas, alpha, antialias: true })
    applySize()

    startTime = performance.now()
    onFrame = build({ scene, camera, renderer })

    if (size === 'window') {
      window.addEventListener('resize', applySize)
    } else {
      resizeObserver = new ResizeObserver(applySize)
      resizeObserver.observe(canvas)
    }

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting
        syncLoop()
      },
      { rootMargin: '10%' }
    )
    intersectionObserver.observe(canvas)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // reduced-motion 下仍畫一張靜態影格，畫面才不會是空的
    if (prefersReducedMotion()) renderFrame()
    else startLoop()
  })

  onBeforeUnmount(() => {
    stopLoop()

    window.removeEventListener('resize', applySize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    resizeObserver = null
    intersectionObserver = null

    if (scene) disposeScene(scene)
    renderer?.dispose()
    renderer?.forceContextLoss()

    scene = null
    camera = null
    renderer = null
    onFrame = undefined
  })

  return { renderFrame }
}
