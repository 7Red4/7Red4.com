import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

export function useThreeScene(canvasRef: Ref<HTMLCanvasElement | null>) {
  const scene = new THREE.Scene()
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const animationFrameId = ref<number | null>(null)

  const initScene = () => {
    if (!canvasRef.value) return

    // Camera setup
    camera.value = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.value.position.z = 5

    // Renderer setup
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      alpha: true,
      antialias: true,
    })
    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Scene background
    scene.background = new THREE.Color(0x0a0a0f)
    scene.fog = new THREE.Fog(0x0a0a0f, 10, 50)
  }

  const animate = (callback?: () => void) => {
    const tick = () => {
      if (callback) callback()

      if (renderer.value && camera.value) {
        renderer.value.render(scene, camera.value)
      }

      animationFrameId.value = requestAnimationFrame(tick)
    }
    tick()
  }

  const handleResize = () => {
    if (!camera.value || !renderer.value) return

    camera.value.aspect = window.innerWidth / window.innerHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(window.innerWidth, window.innerHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  onMounted(() => {
    initScene()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
    }
    renderer.value?.dispose()
  })

  return {
    scene,
    camera,
    renderer,
    animate,
  }
}
