<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

interface Props {
  scrollProgress: number
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let gridMesh: THREE.GridHelper | null = null
let animationId: number | null = null

onMounted(() => {
  if (!canvasRef.value) return

  // Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0f)
  scene.fog = new THREE.Fog(0x0a0a0f, 10, 50)

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 5, 10)
  camera.lookAt(0, 0, 0)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Create grid
  const gridSize = 50
  const gridDivisions = 50
  gridMesh = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0x00ffff)
  gridMesh.material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
  })
  gridMesh.rotation.x = 0
  scene.add(gridMesh)

  // Add some ambient light
  const ambientLight = new THREE.AmbientLight(0x00ffff, 0.2)
  scene.add(ambientLight)

  // Animate
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // 根據滾動進度移動網格
    if (gridMesh) {
      gridMesh.position.z = props.scrollProgress * 20
    }

    renderer.render(scene, camera)
  }
  animate()

  // Handle resize
  const handleResize = () => {
    if (!camera || !renderer) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  window.addEventListener('resize', handleResize)
})

// Cleanup
onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>
</template>
