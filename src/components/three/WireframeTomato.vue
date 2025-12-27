<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

interface Props {
  scrollProgress: number
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let tomatoGroup: THREE.Group | null = null
let animationId: number | null = null

onMounted(() => {
  if (!canvasRef.value) return

  // Scene setup
  scene = new THREE.Scene()
  scene.background = null // 透明背景

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    50,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 8)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Create tomato group
  tomatoGroup = new THREE.Group()

  // 番茄主體（低多邊形球體）
  const bodyGeometry = new THREE.SphereGeometry(1.5, 6, 5)

  // 線框材質
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0xff0066, // 霓虹粉紅偏紅
    transparent: true,
    opacity: 0.8,
  })

  // 創建線框
  const bodyEdges = new THREE.EdgesGeometry(bodyGeometry)
  const bodyWireframe = new THREE.LineSegments(bodyEdges, wireframeMaterial)
  tomatoGroup.add(bodyWireframe)

  // 番茄頂部葉子（簡單的錐形）
  const stemGeometry = new THREE.ConeGeometry(0.6, 0.5, 5)
  stemGeometry.translate(0, 1.7, 0)
  const stemEdges = new THREE.EdgesGeometry(stemGeometry)
  const stemWireframe = new THREE.LineSegments(
    stemEdges,
    new THREE.LineBasicMaterial({
      color: 0x39ff14, // 霓虹綠
      transparent: true,
      opacity: 0.8,
    })
  )
  tomatoGroup.add(stemWireframe)

  // 添加幾片葉子
  for (let i = 0; i < 4; i++) {
    const leafGeometry = new THREE.ConeGeometry(0.3, 1, 3)
    leafGeometry.rotateZ(Math.PI / 2)
    const angle = (Math.PI * 2 * i) / 4
    leafGeometry.translate(
      Math.cos(angle) * 0.5,
      1.8,
      Math.sin(angle) * 0.5
    )
    const leafEdges = new THREE.EdgesGeometry(leafGeometry)
    const leafWireframe = new THREE.LineSegments(
      leafEdges,
      new THREE.LineBasicMaterial({
        color: 0x39ff14,
        transparent: true,
        opacity: 0.6,
      })
    )
    tomatoGroup.add(leafWireframe)
  }

  scene.add(tomatoGroup)

  // 添加光暈效果
  const glowLight = new THREE.PointLight(0xff0066, 1, 10)
  glowLight.position.set(0, 0, 3)
  scene.add(glowLight)

  // Animate
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (tomatoGroup) {
      // 緩慢旋轉
      tomatoGroup.rotation.y += 0.005
      tomatoGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1

      // 根據滾動進度調整位置和旋轉速度
      const sectionProgress = Math.max(0, Math.min(1, (props.scrollProgress - 0.25) / 0.25))
      tomatoGroup.rotation.y += sectionProgress * 0.002
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()

  // Handle resize
  const handleResize = () => {
    if (!camera || !renderer || !canvasRef.value) return
    const width = canvasRef.value.clientWidth
    const height = canvasRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  window.addEventListener('resize', handleResize)
})

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
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>
