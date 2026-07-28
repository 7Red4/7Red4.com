<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '@/composables/useThreeScene'

const props = defineProps<{ scrollProgress: number }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

/** 建線框並釋放來源幾何體（EdgesGeometry 建構時已複製資料） */
const edges = (source: THREE.BufferGeometry, material: THREE.Material) => {
  const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(source), material)
  source.dispose()
  return mesh
}

/**
 * 一片蒂葉的輪廓，躺在 XZ 平面、朝 +X 伸出。
 *
 * 原本用 ConeGeometry(_, _, 3)：那是三角錐，六個錐的底面全擠在中心，
 * EdgesGeometry 又會把每個錐的所有稜線畫出來，頂端就糊成一坨。
 * 改成扁平的封閉輪廓，沒有內部稜線。
 */
const sepalOutline = () =>
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.34, 0, 0.21),
    new THREE.Vector3(1.1, 0, 0),
    new THREE.Vector3(0.34, 0, -0.21),
  ])

const BODY_RADIUS = 1.5
// 番茄是扁的，正球會讀成一顆普通的低多邊形球
const BODY_SQUASH = 0.76
const SHOULDER_Y = BODY_RADIUS * BODY_SQUASH

const SEPAL_COUNT = 6

useThreeScene(canvasRef, {
  fov: 50,
  position: [0, 0, 8],
  frame: { width: 3.4, height: 3.4 },
  build: ({ scene }) => {
    const tomatoGroup = new THREE.Group()

    const bodyMaterial = new THREE.LineBasicMaterial({
      color: 0xff0066, // 霓虹粉紅偏紅
      transparent: true,
      opacity: 0.8,
    })
    // 蒂葉共用一份 material
    const leafMaterial = new THREE.LineBasicMaterial({
      color: 0x39ff14, // 霓虹綠
      transparent: true,
      opacity: 0.8,
    })

    // --- 果實本體：低多邊形球壓扁 ---
    const body = new THREE.SphereGeometry(BODY_RADIUS, 8, 6)
    body.scale(1, BODY_SQUASH, 1)
    tomatoGroup.add(edges(body, bodyMaterial))

    // --- 蒂葉：六片放射狀展開並沿肩線下垂 ---
    for (let i = 0; i < SEPAL_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / SEPAL_COUNT
      const sepal = sepalOutline()

      // 變換順序很重要：先讓葉尖下垂，再繞 Y 轉到各自的方位，最後移到果實肩線。
      // 原本的寫法把定向寫成迴圈外的固定值，六片會全部朝同一邊
      sepal.rotateZ(-0.34)
      sepal.rotateY(angle)
      sepal.translate(0, SHOULDER_Y, 0)

      tomatoGroup.add(new THREE.LineLoop(sepal, leafMaterial))
    }

    // --- 果梗 ---
    const stem = new THREE.CylinderGeometry(0.08, 0.13, 0.5, 5)
    stem.translate(0, SHOULDER_Y + 0.2, 0)
    tomatoGroup.add(edges(stem, leafMaterial))

    scene.add(tomatoGroup)

    const glowLight = new THREE.PointLight(0xff0066, 1, 10)
    glowLight.position.set(0, 0, 3)
    scene.add(glowLight)

    return (elapsed) => {
      // 進到 About 區間時轉速加快。
      // 這顆接近軸對稱，整圈旋轉不會有辨識問題，維持持續自轉
      const sectionProgress = Math.max(0, Math.min(1, (props.scrollProgress - 0.25) / 0.25))
      tomatoGroup.rotation.y = elapsed * (0.3 + sectionProgress * 0.12)
      tomatoGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.1
    }
  },
})
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>
