<script setup lang="ts">
import { ref } from 'vue'

/** 觸控端的跳躍鍵。桌機用空白鍵，不會顯示這顆 */
const emit = defineEmits<{ jump: [] }>()

const pressing = ref(false)

const onPointerDown = (event: PointerEvent) => {
  event.preventDefault()
  pressing.value = true
  emit('jump')
}

const release = () => {
  pressing.value = false
}
</script>

<template>
  <button
    type="button"
    class="jump"
    :class="{ pressing }"
    aria-label="跳躍"
    @pointerdown="onPointerDown"
    @pointerup="release"
    @pointerleave="release"
    @pointercancel="release"
  >
    ↑
  </button>
</template>

<style scoped>
.jump {
  position: fixed;
  right: max(1.75rem, env(safe-area-inset-right));
  bottom: max(2.25rem, env(safe-area-inset-bottom));
  z-index: 30;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  background: rgb(196 64 46 / 0.82);
  color: #fdf8ef;
  border: 1px solid rgb(255 255 255 / 0.45);
  font-size: 1.5rem;
  line-height: 1;
  box-shadow: 0 6px 18px rgb(94 74 52 / 0.24);
  /* 不讓瀏覽器把按壓解讀成捲動或縮放 */
  touch-action: none;
  user-select: none;
  transition: transform 0.12s ease;
}

.jump.pressing {
  transform: scale(0.92);
}

@media (prefers-reduced-motion: reduce) {
  .jump {
    transition: none;
  }
}
</style>
