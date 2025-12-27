<script setup lang="ts">
import { onMounted } from 'vue'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useLenis } from '@/composables/useLenis'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import WorksSection from '@/components/sections/WorksSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

// 初始化平滑滾動
useLenis()

// 滾動進度追蹤
const { scrollProgress, scrollY } = useScrollProgress()

onMounted(() => {
  // 添加全局樣式
  document.body.style.backgroundColor = '#0a0a0f'
})
</script>

<template>
  <div class="new-portfolio bg-bg-dark text-white">
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
.bg-bg-dark {
  background-color: #0a0a0f;
}

/* 全局滾動容器 */
.new-portfolio {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
</style>
