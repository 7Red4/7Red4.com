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
let gridMesh: THREE.Mesh | null = null
let sunMesh: THREE.Mesh | null = null
let mountainLeft: THREE.Mesh | null = null
let mountainRight: THREE.Mesh | null = null
let stars: THREE.Points | null = null
let animationId: number | null = null

onMounted(() => {
  if (!canvasRef.value) return

  // Scene setup
  scene = new THREE.Scene()

  // 創建漸層背景 (深藍到黑)
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, '#000000')
  gradient.addColorStop(0.3, '#0a0a1f')
  gradient.addColorStop(0.6, '#1a1a3f')
  gradient.addColorStop(1, '#2a2a5f')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 2, 256)

  const bgTexture = new THREE.CanvasTexture(canvas)
  scene.background = bgTexture

  // Camera setup - 更低的視角
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 3, 8)
  camera.lookAt(0, 1, -10)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: false,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 創建星空
  createStars()

  // 創建網格地面
  createGrid()

  // 創建地平線黑色平面
  createHorizonPlane()

  // 創建太陽
  createSun()

  // 創建山脈
  createMountains()

  // 添加燈光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  const sunLight = new THREE.PointLight(0xffaa00, 2, 100)
  sunLight.position.set(0, 8, -100)
  scene.add(sunLight)

  // 創建地平線青色霧氣/光暈效果 (橢圓形徑向漸層)
  const horizonGlowCanvas = document.createElement('canvas')
  horizonGlowCanvas.width = 1024
  horizonGlowCanvas.height = 512
  const horizonCtx = horizonGlowCanvas.getContext('2d')!

  // 使用縮放創建橢圓形徑向漸層
  horizonCtx.save()
  horizonCtx.scale(2, 1) // 橫向拉伸2倍,形成橢圓

  const horizonGradient = horizonCtx.createRadialGradient(256, 256, 0, 256, 256, 256)
  horizonGradient.addColorStop(0, 'rgba(0, 191, 255, 0.9)')    // 中心亮青色
  horizonGradient.addColorStop(0.3, 'rgba(0, 150, 255, 0.6)') // 中段
  horizonGradient.addColorStop(0.6, 'rgba(0, 100, 200, 0.3)') // 外圍
  horizonGradient.addColorStop(1, 'rgba(0, 50, 150, 0)')      // 邊緣透明

  horizonCtx.fillStyle = horizonGradient
  horizonCtx.fillRect(0, 0, 512, 512)
  horizonCtx.restore()

  const horizonTexture = new THREE.CanvasTexture(horizonGlowCanvas)
  const horizonGlowGeometry = new THREE.PlaneGeometry(150, 75)
  const horizonGlowMaterial = new THREE.MeshBasicMaterial({
    map: horizonTexture,
    transparent: true,
    blending: THREE.AdditiveBlending, // 加法混合產生發光效果
    depthWrite: false,
  })

  const horizonGlow = new THREE.Mesh(horizonGlowGeometry, horizonGlowMaterial)
  horizonGlow.position.set(0, 2, -50) // 在地平線位置,遠一點
  horizonGlow.rotation.x = -Math.PI / 2 // 旋轉成水平
  scene.add(horizonGlow)

  // Animate
  let time = 0
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    time += 0.01

    // 網格移動動畫
    if (gridMesh) {
      const scrollOffset = props.scrollProgress * 10
      gridMesh.position.z = (time * 2) % 10 + scrollOffset
    }

    // 山脈輕微擺動
    if (mountainLeft) {
      mountainLeft.rotation.y = Math.sin(time * 0.2) * 0.05
    }
    if (mountainRight) {
      mountainRight.rotation.y = Math.sin(time * 0.2 + Math.PI) * 0.05
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
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

// 創建星空
function createStars() {
  if (!scene) return

  const starsGeometry = new THREE.BufferGeometry()
  const starPositions = []
  const starColors = []

  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 200
    const y = Math.random() * 50 + 10
    const z = (Math.random() - 0.5) * 200
    starPositions.push(x, y, z)

    // 隨機顏色 (白色、藍色、淡青色)
    const colorChoice = Math.random()
    if (colorChoice < 0.7) {
      starColors.push(1, 1, 1) // 白色
    } else if (colorChoice < 0.85) {
      starColors.push(0.5, 0.8, 1) // 藍色
    } else {
      starColors.push(1, 0.5, 0.8) // 粉色
    }
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
  starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3))

  const starsMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  })

  stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)
}

// 創建透視網格
function createGrid() {
  if (!scene) return

  const gridSize = 100
  const divisions = 40
  const geometry = new THREE.PlaneGeometry(gridSize, gridSize, divisions, divisions)

  // 創建霓虹網格材質
  const material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  })

  gridMesh = new THREE.Mesh(geometry, material)
  gridMesh.rotation.x = -Math.PI / 2
  gridMesh.position.y = -2
  gridMesh.position.z = -10

  scene.add(gridMesh)

  // 添加發光效果
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  })
  const glowMesh = new THREE.Mesh(geometry, glowMaterial)
  glowMesh.rotation.x = -Math.PI / 2
  glowMesh.position.y = -1.98
  glowMesh.position.z = -10
  glowMesh.scale.set(1.02, 1.02, 1.02)
  scene.add(glowMesh)
}

// 創建地平線黑色平面
function createHorizonPlane() {
  if (!scene) return

  const planeGeometry = new THREE.PlaneGeometry(300, 300)
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
  })

  const horizonPlane = new THREE.Mesh(planeGeometry, planeMaterial)
  horizonPlane.rotation.x = -Math.PI / 2
  horizonPlane.position.y = -2.05 // 跟網格幾乎同高度
  horizonPlane.position.z = 90 // 切齊地平線

  scene.add(horizonPlane)
}

// 創建太陽
function createSun() {
  if (!scene) return

  const sunGroup = new THREE.Group()

  // 主太陽圓球
  // 創建弓形
  const sunMeshRadius = 13
  const arcShape = new THREE.Shape()

  // 畫弓形: 上半部的圓弧加上底部直線(縮小高度)
  const arcAngle = Math.PI * 0.8 // 圓弧角度 (Math.PI = 半圓, 越小弓形越矮)
  const startAngle = Math.PI / 2 - arcAngle / 2 // 從中心線對稱開始
  const endAngle = Math.PI / 2 + arcAngle / 2   // 到中心線對稱結束

  arcShape.absarc(0, 0, sunMeshRadius, startAngle, endAngle, false)
  arcShape.lineTo(sunMeshRadius * Math.cos(startAngle), sunMeshRadius * Math.sin(startAngle)) // 畫底部直線回到起點

  const sunGeometry = new THREE.ShapeGeometry(arcShape, 64)

  // 創建太陽漸層材質
  const sunCanvas = document.createElement('canvas')
  sunCanvas.width = 256
  sunCanvas.height = 256
  const sunCtx = sunCanvas.getContext('2d')!
  const sunGradient = sunCtx.createRadialGradient(128, 128, 0, 128, 128, 128)
  sunGradient.addColorStop(0, '#ffff00')
  sunGradient.addColorStop(0.5, '#ffaa00')
  sunGradient.addColorStop(1, '#ff6600')
  sunCtx.fillStyle = sunGradient
  sunCtx.fillRect(0, 0, 256, 256)

  const sunTexture = new THREE.CanvasTexture(sunCanvas)
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    transparent: true,
  })

  sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
  sunMesh.position.set(0, 8, -100)
  sunGroup.add(sunMesh)

  // 太陽橫條紋 (漸變密度 - 上稀下密)
  const sunRadius = 12
  const sunCenterY = 8
  const sunZ = -99.9

  // 創建漸變密度的條紋
  let currentY = sunCenterY + sunRadius * 0.3 // 從圓形中上部開始(保留頂部完整)
  let stripeIndex = 0
  // 顏色漸變: 從橙色(太陽底部顏色)到深紅粉色
  const colors = [0xff6600, 0xff5500, 0xff4400, 0xff3300, 0xff2200, 0xff1100, 0xff0066, 0xcc0066, 0x990066]

  while (currentY > sunCenterY - sunRadius) {
    // 計算當前高度相對於圓心的位置 (0 = 頂部開始的位置, 1 = 底部)
    const relativePos = (sunCenterY + sunRadius * 0.3 - currentY) / (sunRadius * 1.3)

    // 計算當前高度的圓的半徑 (保持在圓形內)
    const distanceFromCenter = Math.abs(currentY - sunCenterY)
    const stripeWidth = Math.sqrt(sunRadius * sunRadius - distanceFromCenter * distanceFromCenter) * 2

    if (stripeWidth > 0.5) {
      // 條紋高度: 從粗到細 (上面粗,下面細)
      const stripeHeight = 0.6 - relativePos * 0.5 // 從 0.6 漸變到 0.1

      const stripeGeometry = new THREE.PlaneGeometry(stripeWidth + 2, stripeHeight)
      const colorIndex = Math.min(Math.floor(relativePos * colors.length), colors.length - 1)
      const stripeMaterial = new THREE.MeshBasicMaterial({
        color: colors[colorIndex],
        transparent: true,
        opacity: 0.9,
      })
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
      stripe.position.set(0, currentY, sunZ)
      sunGroup.add(stripe)
    }

    // 漸變間距: 上面密集(間距小), 下面稀疏(間距大)
    const spacing = 1.1 + relativePos * 0.65 // 從 0.15 漸變到 0.8
    currentY -= spacing
    stripeIndex++
  }

  scene.add(sunGroup)
}

// 創建山脈
function createMountains() {
  if (!scene) return

  // 左側山脈
  const leftMountainGeometry = createMountainGeometry()
  const leftMountainMaterial = new THREE.MeshBasicMaterial({
    color: 0x8800ff,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  })
  mountainLeft = new THREE.Mesh(leftMountainGeometry, leftMountainMaterial)
  mountainLeft.position.set(-18, -2, -20)
  mountainLeft.rotation.y = 0.3
  mountainLeft.scale.set(2, 2, 2)
  scene.add(mountainLeft)

  // 右側山脈
  const rightMountainGeometry = createMountainGeometry()
  const rightMountainMaterial = new THREE.MeshBasicMaterial({
    color: 0x0088ff,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  })
  mountainRight = new THREE.Mesh(rightMountainGeometry, rightMountainMaterial)
  mountainRight.position.set(20, -2, -20)
  mountainRight.rotation.y = -0.3
  mountainRight.scale.set(2.4, 1.8, 2.4)
  scene.add(mountainRight)
}

// 創建山脈幾何體
function createMountainGeometry() {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const indices = []

  const size = 10
  const segments = 15

  // 創建不規則的山峰網格
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = (i / segments - 0.5) * size
      const z = (j / segments - 0.5) * size

      // 使用多個正弦波創建山峰形狀
      let y = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 5
      y += Math.sin(i * 0.8 + j * 0.3) * 3
      y = Math.max(0, y) // 只保留正值

      vertices.push(x, y, z)
    }
  }

  // 創建三角形索引
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j
      const b = a + segments + 1
      const c = a + 1
      const d = b + 1

      indices.push(a, b, c)
      indices.push(b, d, c)
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

// Cleanup
onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
