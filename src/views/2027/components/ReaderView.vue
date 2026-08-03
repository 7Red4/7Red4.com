<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AboutContent from '../content/AboutContent.vue'
import WorksContent from '../content/WorksContent.vue'
import ContactContent from '../content/ContactContent.vue'

/**
 * 純文件版。
 *
 * 給只想快速看完內容的人、鍵盤與螢幕閱讀器使用者、開了 reduced-motion 的人，
 * 以及跑不動 WebGL 的裝置。同時也是爬蟲唯一讀得到的內容——
 * 純 canvas 的作品集在搜尋引擎眼裡是一片空白。
 */
const { t } = useI18n()

defineEmits<{ explore: [] }>()
</script>

<template>
  <div class="reader">
    <div class="container">
      <div class="top">
        <button type="button" class="explore" @click="$emit('explore')">開始探索 →</button>
      </div>

      <section class="block">
        <h2>{{ t('about.title') }}</h2>
        <AboutContent />
      </section>

      <section class="block">
        <h2>{{ t('works.title') }}</h2>
        <WorksContent />
      </section>

      <section class="block">
        <h2>{{ t('contact.title') }}</h2>
        <ContactContent />
      </section>
    </div>
  </div>
</template>

<style scoped>
.reader {
  min-height: 100vh;
  background: #f4ecdd;
  color: #4b3c2a;
}

.container {
  max-width: 46rem;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 4rem) 1.25rem 6rem;
}

.top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.explore {
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  border: 1px solid rgb(196 64 46 / 0.45);
  background: transparent;
  color: #c4402e;
  font-size: 0.875rem;
}

.explore:hover {
  background: rgb(196 64 46 / 0.08);
}

.block {
  margin-top: 3rem;
}

.block + .block {
  padding-top: 2rem;
  border-top: 1px solid rgb(140 116 88 / 0.25);
}

h2 {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #c4402e;
}
</style>
