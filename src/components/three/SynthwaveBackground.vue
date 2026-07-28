<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '@/composables/useThreeScene'

const props = defineProps<{ scrollProgress: number }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const canvasTexture = (
  width: number,
  height: number,
  paint: (ctx: CanvasRenderingContext2D) => void
) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  paint(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  // 當作顏色貼圖就要標成 sRGB，否則整體會偏暗偏灰
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** 中心亮、邊緣透明的圓形光暈，配加法混合用 */
const glowTexture = (inner: string, outer: string) =>
  canvasTexture(256, 256, (ctx) => {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, inner)
    gradient.addColorStop(0.45, outer)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
  })

const HORIZON_Y = -2

/**
 * 橫跨地平線的連續山脈。
 *
 * 原本是左右各一塊獨立山體放在 x=±18、z=-20，畫面一窄（手機）就整個跑出視野；
 * 而且高度用 Math.max(0, y) 截平，大片平坦地板也被 wireframe 畫出來變成雜訊。
 * 改成沿地平線鋪滿、中央留凹口讓太陽露出來，任何畫面比例都看得到山。
 */
const createRidgeGeometry = (options: {
  halfWidth: number
  columns: number
  rows: number
  zNear: number
  depth: number
  amplitude: number
  dipStart: number
  dipEnd: number
  phase: number
}) => {
  const { halfWidth, columns, rows, zNear, depth, amplitude, dipStart, dipEnd, phase } = options
  const vertices: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= columns; i++) {
    const x = -halfWidth + (i / columns) * halfWidth * 2
    // 中央壓低，太陽才不會被擋住
    const dip = Math.min(1, Math.max(0, (Math.abs(x) - dipStart) / (dipEnd - dipStart)))

    // 峰的密度要夠：窄畫面只截得到中間一小段，太疏的話看到的是峰還是谷全看運氣
    let ridge = Math.sin(x * 0.19 + phase) * 3.4
    ridge += Math.sin(x * 0.47 + phase * 1.7) * 2.1
    ridge += Math.sin(x * 0.93 + phase * 0.6) * 1.05
    ridge = Math.max(0, ridge)

    for (let j = 0; j <= rows; j++) {
      const z = zNear - (j / rows) * depth
      // 前後兩緣收到 0，山脊落在中間，才不會變成一道往後的斜坡
      const profile = Math.sin((j / rows) * Math.PI)
      const detail = 1 + Math.sin(z * 0.24 + x * 0.06) * 0.16
      vertices.push(x, ridge * dip * profile * detail * amplitude, z)
    }
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const a = i * (rows + 1) + j
      const b = a + rows + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

useThreeScene(canvasRef, {
  fov: 60,
  position: [0, 3, 8],
  lookAt: [0, 1, -10],
  alpha: false,
  size: 'window',
  build: ({ scene, camera }) => {
    // 漸層背景（深藍到黑）
    scene.background = canvasTexture(2, 256, (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 256)
      gradient.addColorStop(0, '#000000')
      gradient.addColorStop(0.3, '#0a0a1f')
      gradient.addColorStop(0.6, '#1a1a3f')
      gradient.addColorStop(1, '#2a2a5f')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 2, 256)
    })

    // --- 星空 ---
    const starPositions: number[] = []
    const starColors: number[] = []
    for (let i = 0; i < 1000; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 200,
        Math.random() * 50 + 10,
        (Math.random() - 0.5) * 200
      )
      const choice = Math.random()
      if (choice < 0.7) starColors.push(1, 1, 1)
      else if (choice < 0.85) starColors.push(0.5, 0.8, 1)
      else starColors.push(1, 0.5, 0.8)
    }
    const starsGeometry = new THREE.BufferGeometry()
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3))
    scene.add(
      new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({
          size: 0.1,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
        })
      )
    )

    // --- 太陽 ---
    const SUN_RADIUS = 13
    const SUN_Y = 8
    const SUN_Z = -100

    // 外圈大範圍暈染
    const outerGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(SUN_RADIUS * 7.2, SUN_RADIUS * 7.2),
      new THREE.MeshBasicMaterial({
        map: glowTexture('rgba(255,80,150,0.30)', 'rgba(190,40,140,0.12)'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    outerGlow.position.set(0, SUN_Y, SUN_Z - 2)
    scene.add(outerGlow)

    // 內圈緊貼太陽的高光
    const innerGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(SUN_RADIUS * 3.4, SUN_RADIUS * 3.4),
      new THREE.MeshBasicMaterial({
        map: glowTexture('rgba(255,190,90,0.75)', 'rgba(255,110,40,0.35)'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    innerGlow.position.set(0, SUN_Y, SUN_Z - 1)
    scene.add(innerGlow)

    // 本體：整顆畫在一張貼圖上。
    // 原本用 ShapeGeometry + 徑向漸層，但 ShapeGeometry 的 UV 是頂點原始座標
    // （範圍 -13~13）而非 0~1，貼圖被 clamp 到邊緣色，漸層等於沒作用；
    // 條紋也是疊在上面的實心色塊，而不是真正的縫隙。
    const sun = new THREE.Mesh(
      new THREE.PlaneGeometry(SUN_RADIUS * 2, SUN_RADIUS * 2),
      new THREE.MeshBasicMaterial({
        map: canvasTexture(512, 512, (ctx) => {
          const gradient = ctx.createLinearGradient(0, 12, 0, 500)
          gradient.addColorStop(0, '#fff8c9')
          gradient.addColorStop(0.18, '#ffe14d')
          gradient.addColorStop(0.42, '#ffab1f')
          gradient.addColorStop(0.62, '#ff6b3d')
          gradient.addColorStop(0.82, '#ff2e7e')
          gradient.addColorStop(1, '#b81a63')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(256, 256, 250, 0, Math.PI * 2)
          ctx.fill()

          // 下半部挖出橫向縫隙，越往下縫越寬、亮帶越細
          ctx.globalCompositeOperation = 'destination-out'
          let y = 268
          let gap = 3
          let band = 34
          while (y < 512) {
            ctx.fillRect(0, y, 512, gap)
            y += gap + band
            gap *= 1.42
            band *= 0.86
          }
          ctx.globalCompositeOperation = 'source-over'
        }),
        transparent: true,
        depthWrite: false,
      })
    )
    sun.position.set(0, SUN_Y, SUN_Z)
    scene.add(sun)

    // --- 山脈：遠近兩層，各自用實心剪影擋住背後的星空與太陽 ---
    const ridgeGroup = new THREE.Group()
    scene.add(ridgeGroup)

    const addRidge = (options: {
      geometry: THREE.BufferGeometry
      color: number
      opacity: number
    }) => {
      const { geometry, color, opacity } = options

      // 基準面壓到地平線以下，凹口那段零高度的平坦網格才會被地平面遮掉，
      // 不然會在地平線上留下一條橫向的網格帶
      const baseY = HORIZON_Y - 0.7

      // 實心層讓山有遮蔽關係，否則線框會透出後面的星星
      const silhouette = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0x05030f, side: THREE.DoubleSide })
      )
      silhouette.position.set(0, baseY, -0.35)
      ridgeGroup.add(silhouette)

      const wire = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity,
        })
      )
      wire.position.set(0, baseY, 0)
      ridgeGroup.add(wire)
    }

    addRidge({
      geometry: createRidgeGeometry({
        halfWidth: 140,
        columns: 110,
        rows: 5,
        zNear: -78,
        depth: 26,
        amplitude: 3.15,
        // 斜率要夠陡：畫面一窄（手機）只看得到 x 約 ±20 的範圍，
        // 凹口拉太寬的話邊緣就只剩矮丘
        dipStart: 8,
        dipEnd: 19,
        phase: 2.4,
      }),
      color: 0x8f4cff,
      opacity: 0.55,
    })

    addRidge({
      geometry: createRidgeGeometry({
        halfWidth: 140,
        columns: 110,
        rows: 5,
        zNear: -58,
        depth: 22,
        amplitude: 2.33,
        dipStart: 9.5,
        dipEnd: 18,
        phase: 0.7,
      }),
      color: 0x3aa6ff,
      opacity: 0.65,
    })

    // --- 地平線黑色平面：蓋掉地平線以下的一切 ---
    const horizonPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
    )
    horizonPlane.rotation.x = -Math.PI / 2
    horizonPlane.position.set(0, HORIZON_Y - 0.05, 90)
    scene.add(horizonPlane)

    // --- 透視網格 + 發光層（兩層共用同一份 geometry）---
    const gridGeometry = new THREE.PlaneGeometry(100, 100, 40, 40)
    const gridMesh = new THREE.Mesh(
      gridGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })
    )
    gridMesh.rotation.x = -Math.PI / 2
    gridMesh.position.set(0, HORIZON_Y, -10)
    scene.add(gridMesh)

    const glowMesh = new THREE.Mesh(
      gridGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      })
    )
    glowMesh.rotation.x = -Math.PI / 2
    glowMesh.position.set(0, HORIZON_Y + 0.02, -10)
    glowMesh.scale.set(1.02, 1.02, 1.02)
    scene.add(glowMesh)

    // --- 地平線青色光暈 ---
    // 原本是水平平面（150 寬 x 75 深）擺在 z=-50，等於在 z 軸上橫跨 -87.5 ~ -12.5，
    // 有一大段落在山脈（z -58 ~ -104）前面，深度測試判定它比較近就畫在山前了。
    // 改成豎立的平面放到山脈後方，遮蔽關係才正確。
    const horizonGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(260, 22),
      new THREE.MeshBasicMaterial({
        // 垂直漸層而非橢圓：橢圓貼在豎立平面上會變成中間亮兩側淡的一團霧，
        // 這裡要的是橫貫地平線、水平方向均勻的光帶
        map: canvasTexture(4, 256, (ctx) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 256)
          gradient.addColorStop(0, 'rgba(0, 60, 160, 0)')
          gradient.addColorStop(0.32, 'rgba(0, 120, 220, 0.22)')
          gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.85)')
          gradient.addColorStop(0.68, 'rgba(0, 120, 220, 0.22)')
          gradient.addColorStop(1, 'rgba(0, 60, 160, 0)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, 4, 256)
        }),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    // 中心對齊地平線，下半會被地平面切掉，只留上緣那道亮邊
    horizonGlow.position.set(0, HORIZON_Y, -96)
    scene.add(horizonGlow)

    return (elapsed) => {
      // 對齊原本 60fps 下 time += 0.01 的速度，但改為 frame-rate independent
      const time = elapsed * 0.6
      gridMesh.position.z = ((time * 2) % 10) + props.scrollProgress * 10

      // 畫面越窄，山脈水平壓縮越多，讓有限的視野裡塞得進完整的山峰。
      // 壓縮上限刻意保守，否則凹口跟著縮小、山會爬上太陽的下緣
      const wideness = Math.min(1, Math.max(0, (camera.aspect - 0.45) / 1.05))
      ridgeGroup.scale.x = 0.7 + wideness * 0.3
      // 太陽的光暈輕微呼吸
      const pulse = 1 + Math.sin(elapsed * 0.5) * 0.04
      innerGlow.scale.setScalar(pulse)
      outerGlow.scale.setScalar(1 + Math.sin(elapsed * 0.33 + 1) * 0.05)
    }
  },
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
