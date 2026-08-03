<script setup lang="ts">
import FrostedPanel from './FrostedPanel.vue'
// TODO: 暫時借用 2025 版的照片預覽版面。
// 那張是 5712x4284 / 3.7MB 的原始手機照，正式用之前一定要縮到 1600px 以內。
import placeholderPhoto from '@/assets/kyoto_nearby.jpg'

withDefaults(defineProps<{ photo?: string }>(), { photo: placeholderPhoto })

const emit = defineEmits<{ start: []; reader: [] }>()
</script>

<template>
  <div class="gate">
    <FrostedPanel class="panel" :radius="20">
      <div class="inner">
        <div class="photo">
          <img v-if="photo" :src="photo" alt="" />
          <div v-else class="photo-placeholder">
            <span>照片區塊</span>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="start" @click="emit('start')">開始探索</button>
          <!-- 逃生門：只想快速看完內容的人不必先走一圈 -->
          <button type="button" class="secondary" @click="emit('reader')">直接看列表</button>
        </div>
      </div>
    </FrostedPanel>
  </div>
</template>

<style scoped>
.gate {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 面板之外也壓一層薄霧，視線才會集中在中間 */
  background: rgb(240 233 220 / 0.35);
}

.panel {
  width: 80vw;
  height: 80vh;
}

.inner {
  width: 100%;
  height: 100%;
  padding: clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 4vh, 2.75rem);
}

.photo {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.photo img {
  /* 照片以 4:3 橫幅為準 */
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.photo-placeholder {
  width: min(100%, 30rem);
  aspect-ratio: 4 / 3;
  max-height: 100%;
  border: 2px dashed rgb(140 116 88 / 0.4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(122 100 74 / 0.7);
  font-size: 0.875rem;
  letter-spacing: 0.1em;
}

.actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.start {
  padding: 0.85rem 2.75rem;
  border-radius: 999px;
  border: none;
  background: #c4402e;
  color: #fdf8ef;
  font-size: 1rem;
  letter-spacing: 0.12em;
  box-shadow: 0 8px 20px rgb(196 64 46 / 0.32);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.start:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgb(196 64 46 / 0.4);
}

.start:focus-visible {
  outline: 3px solid rgb(196 64 46 / 0.45);
  outline-offset: 3px;
}

.secondary {
  padding: 0.35rem 1rem;
  border: none;
  background: transparent;
  color: rgb(107 86 60 / 0.85);
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.secondary:hover {
  color: #c4402e;
}

.secondary:focus-visible {
  outline: 2px solid rgb(196 64 46 / 0.45);
  outline-offset: 3px;
  border-radius: 6px;
}

@media (prefers-reduced-motion: reduce) {
  .start {
    transition: none;
  }
}
</style>
