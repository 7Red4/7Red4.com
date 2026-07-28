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

/** 把多段線一次塞進單一 geometry，避免每顆按鍵各開一個 draw call */
const segments = (points: number[], material: THREE.Material) => {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return new THREE.LineSegments(geometry, material)
}

/** 躺在 XZ 平面上的矩形外框，回傳 8 個端點（4 段線） */
const rectXZ = (cx: number, cz: number, width: number, depth: number, y: number) => {
  const hw = width / 2
  const hd = depth / 2
  return [
    cx - hw, y, cz - hd, cx + hw, y, cz - hd,
    cx + hw, y, cz - hd, cx + hw, y, cz + hd,
    cx + hw, y, cz + hd, cx - hw, y, cz + hd,
    cx - hw, y, cz + hd, cx - hw, y, cz - hd,
  ]
}

const BASE_WIDTH = 3
const BASE_DEPTH = 2
const BASE_HEIGHT = 0.14
const BASE_TOP = BASE_HEIGHT / 2
const HINGE_Z = -BASE_DEPTH / 2

const LID_HEIGHT = 1.9
const LID_THICKNESS = 0.07

// 螢幕上的假程式碼：[縮排, 長度]，刻意做出層次感
const CODE_LINES: [number, number][] = [
  [0, 1.5],
  [0.26, 1.1],
  [0.26, 1.72],
  [0.52, 0.86],
  [0.52, 1.28],
  [0.26, 1.46],
  [0, 0.68],
  [0.26, 1.84],
  [0.52, 0.98],
  [0, 1.16],
]

useThreeScene(canvasRef, {
  fov: 50,
  position: [2.4, 1.8, 4.6],
  lookAt: [0, 0.45, 0],
  // 旋轉時對角線最寬約 3.6，留點餘裕
  frame: { width: 4, height: 2.6 },
  build: ({ scene }) => {
    const laptopGroup = new THREE.Group()

    const cyan = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.85 })
    const magenta = new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.6 })
    // 48 顆按鍵共用一份 material
    const purple = new THREE.LineBasicMaterial({ color: 0x9d00ff, transparent: true, opacity: 0.55 })
    const green = new THREE.LineBasicMaterial({ color: 0x39ff14, transparent: true, opacity: 0.6 })

    // --- 底座 ---
    laptopGroup.add(edges(new THREE.BoxGeometry(BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH), cyan))

    // --- 螢幕：用 Group 當轉軸放在底座後緣 ---
    // 直接對 geometry 先 translate 再 rotate 會繞原點轉，螢幕會被甩進底座裡
    const lid = new THREE.Group()
    lid.position.set(0, BASE_TOP, HINGE_Z)
    lid.rotation.x = -0.26 // 從垂直往後仰約 15°

    // 面板本身：底邊對齊 Group 原點（也就是轉軸）
    const panel = new THREE.BoxGeometry(BASE_WIDTH, LID_HEIGHT, LID_THICKNESS)
    panel.translate(0, LID_HEIGHT / 2, 0)
    lid.add(edges(panel, cyan))

    // 顯示區外框
    const screenY = LID_HEIGHT / 2 + 0.05
    const screenFace = LID_THICKNESS / 2 + 0.01
    const bezel = new THREE.PlaneGeometry(2.62, 1.5)
    bezel.translate(0, screenY, screenFace)
    lid.add(edges(bezel, magenta))

    // 螢幕上的程式碼行
    const codePoints: number[] = []
    const codeTop = screenY + 0.56
    CODE_LINES.forEach(([indent, length], i) => {
      const y = codeTop - i * 0.125
      const x = -1.16 + indent
      codePoints.push(x, y, screenFace, Math.min(x + length, 1.16), y, screenFace)
    })
    lid.add(segments(codePoints, green))

    // 閃爍游標，接在最後一行後面
    const [lastIndent, lastLength] = CODE_LINES[CODE_LINES.length - 1]
    const cursorX = Math.min(-1.16 + lastIndent + lastLength + 0.06, 1.14)
    const cursorY = codeTop - (CODE_LINES.length - 1) * 0.125
    const cursor = segments(
      [cursorX, cursorY - 0.035, screenFace, cursorX, cursorY + 0.055, screenFace],
      green
    )
    lid.add(cursor)

    laptopGroup.add(lid)

    // --- 鍵盤：12 x 4，全部併進同一個 geometry ---
    const keyPoints: number[] = []
    const keyPitchX = 0.21
    const keyPitchZ = 0.23
    const keyW = 0.17
    const keyD = 0.185
    const keyY = BASE_TOP + 0.001
    const rowZ = -0.62

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 12; col++) {
        const x = -1.155 + col * keyPitchX
        keyPoints.push(...rectXZ(x, rowZ + row * keyPitchZ, keyW, keyD, keyY))
      }
    }
    // 最後一排：兩側修飾鍵 + 中間空白鍵
    const bottomZ = rowZ + 3 * keyPitchZ
    for (const col of [0, 1, 10, 11]) {
      const x = -1.155 + col * keyPitchX
      keyPoints.push(...rectXZ(x, bottomZ, keyW, keyD, keyY))
    }
    keyPoints.push(...rectXZ(0, bottomZ, keyPitchX * 7.2, keyD, keyY))
    laptopGroup.add(segments(keyPoints, purple))

    // --- 觸控板 ---
    laptopGroup.add(segments(rectXZ(0, 0.58, 0.95, 0.6, keyY), green))

    scene.add(laptopGroup)

    const glowLight = new THREE.PointLight(0x00ffff, 1, 10)
    glowLight.position.set(0, 2, 2)
    scene.add(glowLight)

    let cursorOn = true

    return (elapsed) => {
      const sectionProgress = Math.max(0, Math.min(1, (props.scrollProgress - 0.5) / 0.3))
      // 不做整圈旋轉：轉到正側面時筆電只剩一條線，背面也認不出來
      const swing = Math.sin(elapsed * (0.24 + sectionProgress * 0.12))
      laptopGroup.rotation.y = -0.42 + swing * 0.55
      laptopGroup.rotation.x = -0.16 + Math.sin(elapsed * 0.3) * 0.05

      // 游標每 0.5 秒閃一次
      const shouldShow = Math.floor(elapsed * 2) % 2 === 0
      if (shouldShow !== cursorOn) {
        cursorOn = shouldShow
        cursor.visible = shouldShow
      }
    }
  },
})
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>
