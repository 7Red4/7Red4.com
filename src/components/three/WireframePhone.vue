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
let phoneGroup: THREE.Group | null = null
let animationId: number | null = null

onMounted(() => {
  if (!canvasRef.value) return

  // Scene setup
  scene = new THREE.Scene()
  scene.background = null

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    50,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(2, 1, 5)
  camera.lookAt(0, 0, 0)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Create phone handset group
  phoneGroup = new THREE.Group()

  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x39ff14, // 霓虹綠（復古終端機顏色）
    transparent: true,
    opacity: 0.8,
  })

  // 聽筒主體 - 使用彎曲的圓柱體來模擬
  // 左側聽筒（耳機部分）
  const earGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 6)
  earGeometry.rotateZ(Math.PI / 2)
  earGeometry.translate(-1.2, 0.3, 0)
  const earEdges = new THREE.EdgesGeometry(earGeometry)
  const earWireframe = new THREE.LineSegments(earEdges, wireframeMaterial)
  phoneGroup.add(earWireframe)

  // 右側聽筒（話筒部分）
  const micGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 6)
  micGeometry.rotateZ(Math.PI / 2)
  micGeometry.translate(1.2, -0.3, 0)
  const micEdges = new THREE.EdgesGeometry(micGeometry)
  const micWireframe = new THREE.LineSegments(micEdges, wireframeMaterial)
  phoneGroup.add(micWireframe)

  // 中間連接的手柄（彎曲效果用多個小圓柱體模擬）
  const handleSegments = 8
  for (let i = 0; i < handleSegments; i++) {
    const t = i / (handleSegments - 1)
    const angle = t * Math.PI * 0.6 - Math.PI * 0.3

    const segmentGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 5)
    segmentGeometry.rotateZ(Math.PI / 2 + angle * 0.5)

    const x = -1.2 + t * 2.4
    const y = 0.3 - Math.sin(t * Math.PI) * 0.8

    segmentGeometry.translate(x, y, 0)
    const segmentEdges = new THREE.EdgesGeometry(segmentGeometry)
    const segmentWireframe = new THREE.LineSegments(
      segmentEdges,
      new THREE.LineBasicMaterial({
        color: 0x00ffff, // 霓虹青色
        transparent: true,
        opacity: 0.7,
      })
    )
    phoneGroup.add(segmentWireframe)
  }

  // 在聽筒上添加一些細節（網格孔）
  const createGrille = (x: number, y: number) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const holeGeometry = new THREE.CircleGeometry(0.05, 4)
        holeGeometry.translate(x + (i - 1) * 0.12, y + (j - 1) * 0.12, 0.31)
        const holeEdges = new THREE.EdgesGeometry(holeGeometry)
        const holeWireframe = new THREE.LineSegments(
          holeEdges,
          new THREE.LineBasicMaterial({
            color: 0xff00ff, // 霓虹洋紅
            transparent: true,
            opacity: 0.5,
          })
        )
        phoneGroup.add(holeWireframe)
      }
    }
  }

  createGrille(-1.2, 0.3) // 左側耳機網格
  createGrille(1.2, -0.3) // 右側話筒網格

  // 調整整體角度
  phoneGroup.rotation.x = -0.3
  phoneGroup.rotation.y = 0.5

  scene.add(phoneGroup)

  // 光暈
  const glowLight = new THREE.PointLight(0x39ff14, 1, 10)
  glowLight.position.set(0, 1, 2)
  scene.add(glowLight)

  // Animate
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (phoneGroup) {
      // 緩慢旋轉和浮動
      phoneGroup.rotation.y += 0.004
      phoneGroup.position.y = Math.sin(Date.now() * 0.0008) * 0.2
      phoneGroup.rotation.x = -0.3 + Math.cos(Date.now() * 0.0005) * 0.1

      // 根據滾動進度
      const sectionProgress = Math.max(0, Math.min(1, (props.scrollProgress - 0.8) / 0.2))
      phoneGroup.rotation.y += sectionProgress * 0.003
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
