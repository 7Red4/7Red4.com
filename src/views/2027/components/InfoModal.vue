<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import FrostedPanel from './FrostedPanel.vue'

defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
  }
}

onMounted(() => {
  // 開啟時把焦點移進來，鍵盤使用者才不會還停在後面的世界上
  closeButton.value?.focus()
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <FrostedPanel ref="panel" class="panel" :radius="20" role="dialog" aria-modal="true">
      <header class="head">
        <h2>{{ title }}</h2>
        <button ref="closeButton" type="button" class="close" aria-label="關閉" @click="emit('close')">
          ✕
        </button>
      </header>
      <div class="body">
        <slot />
      </div>
    </FrostedPanel>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgb(240 233 220 / 0.35);
}

.panel {
  width: min(46rem, 100%);
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  color: #4b3c2a;
}

.head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem clamp(1.25rem, 4vw, 2rem) 0.75rem;
}

h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #c4402e;
}

.close {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid rgb(140 116 88 / 0.35);
  background: transparent;
  color: rgb(107 86 60 / 0.9);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.close:hover {
  border-color: #c4402e;
  color: #c4402e;
}

.body {
  overflow-y: auto;
  padding: 0 clamp(1.25rem, 4vw, 2rem) clamp(1.25rem, 4vw, 2rem);
  overscroll-behavior: contain;
}
</style>
