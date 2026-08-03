<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const emit = defineEmits<{ move: [x: number, z: number] }>()

const BASE_RADIUS = 56
const KNOB_LIMIT = 42

const base = ref<HTMLElement | null>(null)
const knob = ref({ x: 0, y: 0 })
const active = ref(false)

let pointerId: number | null = null
let origin = { x: 0, y: 0 }

const emitFromKnob = () => {
  // 螢幕的 y 往下為正，世界的 z 也是往畫面下方為正，方向剛好一致
  emit('move', knob.value.x / KNOB_LIMIT, knob.value.y / KNOB_LIMIT)
}

const reset = () => {
  knob.value = { x: 0, y: 0 }
  active.value = false
  pointerId = null
  emit('move', 0, 0)
}

const onPointerDown = (event: PointerEvent) => {
  if (pointerId !== null) return
  const rect = base.value?.getBoundingClientRect()
  if (!rect) return

  pointerId = event.pointerId
  active.value = true
  origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  // 在 window 上接後續事件，手指滑出底座範圍也不會斷掉
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  onPointerMove(event)
}

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return
  event.preventDefault()

  let dx = event.clientX - origin.x
  let dy = event.clientY - origin.y
  const distance = Math.hypot(dx, dy)
  if (distance > KNOB_LIMIT) {
    dx = (dx / distance) * KNOB_LIMIT
    dy = (dy / distance) * KNOB_LIMIT
  }
  knob.value = { x: dx, y: dy }
  emitFromKnob()
}

const onPointerUp = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  reset()
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
})
</script>

<template>
  <div
    ref="base"
    class="joystick"
    :class="{ active }"
    :style="{ width: `${BASE_RADIUS * 2}px`, height: `${BASE_RADIUS * 2}px` }"
    role="application"
    aria-label="移動搖桿"
    @pointerdown="onPointerDown"
  >
    <div class="knob" :style="{ transform: `translate(${knob.x}px, ${knob.y}px)` }" />
  </div>
</template>

<style scoped>
.joystick {
  position: fixed;
  left: max(1.5rem, env(safe-area-inset-left));
  bottom: max(2rem, env(safe-area-inset-bottom));
  z-index: 30;
  border-radius: 50%;
  background: rgb(253 250 244 / 0.42);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgb(255 255 255 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  /* 不讓瀏覽器把拖曳解讀成捲動或縮放 */
  touch-action: none;
  user-select: none;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.joystick.active {
  opacity: 1;
}

.knob {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgb(196 64 46 / 0.85);
  box-shadow: 0 4px 12px rgb(94 74 52 / 0.28);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .joystick {
    transition: none;
  }
}
</style>
