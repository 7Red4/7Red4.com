<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Chrome from './Chrome.vue'
import WorksContent from './content/WorksContent.vue'

/**
 * 作品集。
 *
 * 目前先是一頁完整的內容，之後會換成另一個曲面世界：
 * 作品散在上面，走過去點擊開毛玻璃 modal。
 */
const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <Chrome />

  <div class="work-page">
    <div class="container">
      <button type="button" class="back" @click="router.push('/')">← 回到小星球</button>
      <h1>{{ t('works.title') }}</h1>
      <WorksContent />
    </div>
  </div>
</template>

<style scoped>
.work-page {
  min-height: 100vh;
  background: #f4ecdd;
  color: #4b3c2a;
}

.container {
  max-width: 46rem;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 4rem) 1.25rem 6rem;
}

.back {
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgb(196 64 46 / 0.45);
  background: transparent;
  color: #c4402e;
  font-size: 0.875rem;
}

.back:hover {
  background: rgb(196 64 46 / 0.08);
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #c4402e;
  margin: 1.5rem 0 0.5rem;
}
</style>
