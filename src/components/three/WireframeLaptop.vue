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
let laptopGroup: THREE.Group | null = null
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
  camera.position.set(3, 2, 6)
  camera.lookAt(0, 0, 0)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Create laptop group
  laptopGroup = new THREE.Group()

  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff, // 霓虹青色
    transparent: true,
    opacity: 0.8,
  })

  // 筆電底座（鍵盤部分）
  const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2)
  const baseEdges = new THREE.EdgesGeometry(baseGeometry)
  const baseWireframe = new THREE.LineSegments(baseEdges, wireframeMaterial)
  laptopGroup.add(baseWireframe)

  // 筆電螢幕
  const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1)
  screenGeometry.translate(0, 1.1, -0.95)
  screenGeometry.rotateX(-Math.PI * 0.15) // 螢幕稍微向後傾斜
  const screenEdges = new THREE.EdgesGeometry(screenGeometry)
  const screenWireframe = new THREE.LineSegments(screenEdges, wireframeMaterial)
  laptopGroup.add(screenWireframe)

  // 螢幕內的「顯示區域」（稍微小一點的框）
  const displayGeometry = new THREE.PlaneGeometry(2.6, 1.6)
  displayGeometry.translate(0, 1.1, -0.9)
  displayGeometry.rotateX(-Math.PI * 0.15)
  const displayEdges = new THREE.EdgesGeometry(displayGeometry)
  const displayWireframe = new THREE.LineSegments(
    displayEdges,
    new THREE.LineBasicMaterial({
      color: 0xff00ff, // 霓虹洋紅
      transparent: true,
      opacity: 0.6,
    })
  )
  laptopGroup.add(displayWireframe)

  // 鍵盤按鍵（簡化版，幾個小方塊代表）
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const keyGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.3)
      keyGeometry.translate(-1.2 + i * 0.6, 0.15, -0.6 + j * 0.5)
      const keyEdges = new THREE.EdgesGeometry(keyGeometry)
      const keyWireframe = new THREE.LineSegments(
        keyEdges,
        new THREE.LineBasicMaterial({
          color: 0x9d00ff, // 霓虹紫
          transparent: true,
          opacity: 0.5,
        })
      )
      laptopGroup.add(keyWireframe)
    }
  }

  // 觸控板
  const touchpadGeometry = new THREE.PlaneGeometry(1, 0.6)
  touchpadGeometry.rotateX(-Math.PI / 2)
  touchpadGeometry.translate(0, 0.11, 0.5)
  const touchpadEdges = new THREE.EdgesGeometry(touchpadGeometry)
  const touchpadWireframe = new THREE.LineSegments(
    touchpadEdges,
    new THREE.LineBasicMaterial({
      color: 0x39ff14, // 霓虹綠
      transparent: true,
      opacity: 0.6,
    })
  )
  laptopGroup.add(touchpadWireframe)

  // 調整整體位置和角度
  laptopGroup.rotation.x = -0.2
  laptopGroup.rotation.y = -0.3

  scene.add(laptopGroup)

  // 光暈
  const glowLight = new THREE.PointLight(0x00ffff, 1, 10)
  glowLight.position.set(0, 2, 2)
  scene.add(glowLight)

  // Animate
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (laptopGroup) {
      // 緩慢旋轉
      laptopGroup.rotation.y += 0.003
      laptopGroup.rotation.x = -0.2 + Math.sin(Date.now() * 0.0003) * 0.05

      // 根據滾動進度
      const sectionProgress = Math.max(0, Math.min(1, (props.scrollProgress - 0.5) / 0.3))
      laptopGroup.rotation.y += sectionProgress * 0.002
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
