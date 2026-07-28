<script setup lang="ts">
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useLenis } from '@/composables/useLenis'
import HeroSection from './sections/HeroSection.vue'
import AboutSection from './sections/AboutSection.vue'
import WorksSection from './sections/WorksSection.vue'
import ContactSection from './sections/ContactSection.vue'

// 初始化平滑滾動
const { lenis } = useLenis()

// 滾動進度追蹤（接 Lenis 的 scroll 事件，避免比實際捲動位置慢一幀而抖動）
const { scrollProgress } = useScrollProgress(lenis)
</script>

<template>
  <div class="portfolio text-white">
    <!-- Hero Section (0-25%) -->
    <HeroSection :scrollProgress="scrollProgress" />

    <!-- About Section (25-50%) -->
    <AboutSection :scrollProgress="scrollProgress" />

    <!-- Works Section (50-80%) -->
    <WorksSection :scrollProgress="scrollProgress" />

    <!-- Contact Section (80-100%) -->
    <ContactSection :scrollProgress="scrollProgress" />
  </div>
</template>

<style scoped>
.portfolio {
  background-color: var(--color-bg-dark);
  min-height: 100vh;
  position: relative;
  /* 用 clip 而不是 hidden：overflow-x: hidden 會讓 overflow-y 從 visible 變成 auto，
     等於多開一個捲動容器跟 Lenis 打架 */
  overflow-x: clip;
}
</style>
