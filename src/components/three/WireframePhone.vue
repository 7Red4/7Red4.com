<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '@/composables/useThreeScene'

const props = defineProps<{ scrollProgress: number }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

/** 建線框並釋放來源幾何體 */
const edges = (source: THREE.BufferGeometry, material: THREE.Material) => {
  const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(source), material)
  source.dispose()
  return mesh
}

/** 躺在 XZ 平面上的圓圈，用來當聽筒上的收音孔紋路 */
const ringOnXZ = (radius: number, y: number, material: THREE.Material, segments = 24) => {
  const points: THREE.Vector3[] = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius))
  }
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material)
}

useThreeScene(canvasRef, {
  fov: 50,
  // 話筒加上捲線的總高約 3.8，鏡頭要退夠遠才不會上下被裁掉
  position: [1.1, 0.15, 5.5],
  lookAt: [0, -0.45, 0],
  frame: { width: 1.4, height: 4 },
  build: ({ scene }) => {
    const phoneGroup = new THREE.Group()

    const green = new THREE.LineBasicMaterial({
      color: 0x39ff14, // 霓虹綠（復古終端機顏色）
      transparent: true,
      opacity: 0.85,
    })
    const cyan = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 })
    const magenta = new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.55 })

    // --- 手柄：直立，沿一條微彎的曲線生成連續的管 ---
    // 開口朝 +Z，所以手柄往 -Z 微彎（背對觀眾拱起）
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.84, -0.04),
      new THREE.Vector3(0, -0.44, -0.19),
      new THREE.Vector3(0, 0, -0.25),
      new THREE.Vector3(0, 0.44, -0.19),
      new THREE.Vector3(0, 0.84, -0.04),
    ])
    // radialSegments 取 6，低面數才有稜線可以被 EdgesGeometry 抓出來
    phoneGroup.add(edges(new THREE.TubeGeometry(handleCurve, 18, 0.15, 6, false), green))

    // --- 兩端聽筒：開口都朝 +Z，上下各自向內傾一點 ---
    const CUP_HEIGHT = 0.34

    const createEarpiece = (side: 1 | -1) => {
      const cup = new THREE.Group()

      // 上窄下寬但收斂，錐度太大會變成喇叭
      cup.add(edges(new THREE.CylinderGeometry(0.27, 0.4, CUP_HEIGHT, 10), green))

      // 開口面的收音孔：三圈同心圓 + 圓心
      const faceY = -CUP_HEIGHT / 2
      for (const radius of [0.12, 0.23, 0.33]) {
        cup.add(ringOnXZ(radius, faceY, magenta))
      }
      cup.add(ringOnXZ(0.035, faceY, magenta, 8))

      cup.position.set(0, side * 0.92, 0)
      // -π/2 讓開口從朝 -Y 轉成朝 +Z，再各自往中間傾
      cup.rotation.x = -Math.PI / 2 + side * 0.18
      return cup
    }

    phoneGroup.add(createEarpiece(1)) // 上：聽筒
    phoneGroup.add(createEarpiece(-1)) // 下：話筒

    // --- 捲線：從下方話筒底緣引出後往下垂 ---
    const cordPoints: THREE.Vector3[] = [
      new THREE.Vector3(0.04, -1.24, 0.02),
      new THREE.Vector3(0.12, -1.42, 0.04),
    ]

    const coilTurns = 6
    const coilSteps = 170
    const coilCenterX = 0.2
    for (let i = 0; i <= coilSteps; i++) {
      const t = i / coilSteps
      // 相位偏移 π，讓螺旋起點落在靠近引出段的那一側，接得比較順
      const angle = Math.PI + t * Math.PI * 2 * coilTurns
      const radius = 0.17 * (1 - t * 0.2)
      cordPoints.push(
        new THREE.Vector3(
          coilCenterX + Math.cos(angle) * radius,
          -1.55 - t * 0.9,
          0.04 + Math.sin(angle) * radius
        )
      )
    }
    phoneGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cordPoints), cyan))

    scene.add(phoneGroup)

    const glowLight = new THREE.PointLight(0x39ff14, 1, 10)
    glowLight.position.set(0, 1, 2)
    scene.add(glowLight)

    return (elapsed) => {
      const sectionProgress = Math.max(0, Math.min(1, (props.scrollProgress - 0.8) / 0.2))
      // 不做整圈旋轉：轉到正側面時話筒的輪廓會糊成一團線，
      // 改成在可辨識的四分之三視角附近來回擺盪
      const swing = Math.sin(elapsed * (0.28 + sectionProgress * 0.14))
      phoneGroup.rotation.y = -0.45 + swing * 0.4
      phoneGroup.rotation.z = Math.cos(elapsed * 0.5) * 0.05
      phoneGroup.position.y = Math.sin(elapsed * 0.8) * 0.12
    }
  },
})
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>
