<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Chrome from './Chrome.vue'
import WorldStage from './components/WorldStage.vue'
import ReaderView from './components/ReaderView.vue'

const route = useRoute()
const router = useRouter()

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 列表模式走網址查詢參數，可以分享也能被上一頁關掉。
 * 沒有明確指定時，開了 reduced-motion 的人預設進列表——
 * 那個設定要的就是「不要有大量動態」，直接丟一個 3D 走動世界不合適。
 */
const showReader = computed(() => {
  const view = route.query.view
  if (view === 'list') return true
  if (view === 'world') return false
  return prefersReducedMotion
})

const openReader = () => router.replace({ query: { ...route.query, view: 'list' } })
const openWorld = () => router.replace({ query: { ...route.query, view: 'world' } })
</script>

<template>
  <Chrome />

  <!-- 列表模式完全不掛載 3D，跑不動 WebGL 的裝置不用付這個成本 -->
  <ReaderView v-if="showReader" @explore="openWorld" />
  <WorldStage v-else @reader="openReader" />
</template>
