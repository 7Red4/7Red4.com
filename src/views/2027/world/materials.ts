import * as THREE from 'three'
import { applyCurvature } from './curvedWorld'

/** 固定種子的偽亂數，讓場景每次重新載入都長一樣，方便調整外觀 */
export const createRandom = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

const canvasTexture = (size: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  paint(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

/** 木紋：底色加上幾道深淺不一的年輪線，再撒一點細噪點 */
export const createWoodGrainTexture = (base: number, seed: number) => {
  const random = createRandom(seed)
  const color = new THREE.Color(base)

  return canvasTexture(256, (ctx) => {
    ctx.fillStyle = `#${color.getHexString()}`
    ctx.fillRect(0, 0, 256, 256)

    // 年輪
    const lines = 9 + Math.floor(random() * 5)
    for (let i = 0; i < lines; i++) {
      const y = random() * 256
      const width = 1 + random() * 3.2
      const darkness = 0.06 + random() * 0.12
      ctx.strokeStyle = `rgba(60, 40, 24, ${darkness})`
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(0, y)
      // 用兩段貝茲讓紋路有自然的起伏
      ctx.bezierCurveTo(64, y + (random() - 0.5) * 22, 176, y + (random() - 0.5) * 22, 256, y)
      ctx.stroke()
    }

    // 細噪點
    ctx.globalAlpha = 0.05
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = random() > 0.5 ? '#3c2818' : '#fff6e4'
      ctx.fillRect(random() * 256, random() * 256, 1.4, 1.4)
    }
    ctx.globalAlpha = 1
  })
}

/** 角色與物件底下的軟陰影，比開 shadow map 便宜太多 */
export const createBlobShadowTexture = () =>
  canvasTexture(128, (ctx) => {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(90, 72, 52, 0.42)')
    gradient.addColorStop(0.55, 'rgba(90, 72, 52, 0.16)')
    gradient.addColorStop(1, 'rgba(90, 72, 52, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
  })

export type BlockFinish = 'wood' | 'painted'

/**
 * 積木材質。
 * wood 帶木紋、稍微粗糙；painted 是全漆無紋、表面略滑，
 * 兩者的對比就是這個畫風的重點。
 */
export const createBlockMaterial = (
  color: number,
  finish: BlockFinish,
  seed = 1
): THREE.MeshStandardMaterial => {
  const material = new THREE.MeshStandardMaterial({
    color: finish === 'wood' ? 0xffffff : color,
    map: finish === 'wood' ? createWoodGrainTexture(color, seed) : null,
    roughness: finish === 'wood' ? 0.86 : 0.62,
    metalness: 0,
    flatShading: false,
  })
  return applyCurvature(material)
}
