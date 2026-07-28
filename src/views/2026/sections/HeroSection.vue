<script setup lang="ts">
import { computed } from 'vue'
import SynthwaveBackground from '@/components/three/SynthwaveBackground.vue'

const props = defineProps<{ scrollProgress: number }>()

// 大字隨捲動往上飛出並消失
const titleStyle = computed(() => ({
  opacity: Math.max(0, 1 - props.scrollProgress * 4),
  transform: `translateY(${200 + props.scrollProgress * -1300}px) scaleY(4) rotateX(${
    25 + props.scrollProgress * 150
  }deg)`,
  letterSpacing: '6px',
}))
</script>

<template>
  <section class="hero-section relative h-screen w-full overflow-hidden">
    <!-- Synthwave 背景 -->
    <div class="absolute inset-0 z-0">
      <SynthwaveBackground :scrollProgress="scrollProgress" />
    </div>

    <!-- UI 覆蓋層 -->
    <div
      class="relative z-10 flex h-full flex-col items-center justify-center perspective-container"
    >
      <h1
        class="text-6xl md:text-8xl font-bold text-neon-cyan mb-4 select-none"
        :style="titleStyle"
      >
        7Red4
      </h1>
    </div>

    <!-- 捲動提示 -->
    <div
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-neon-cyan text-sm font-mono transition-opacity duration-300"
      :style="{ opacity: Math.max(0, 1 - scrollProgress * 12) }"
      aria-hidden="true"
    >
      <span class="motion-safe:animate-bounce inline-block">▼ scroll</span>
    </div>
  </section>
</template>

<style scoped>
.perspective-container {
  perspective: 1000px;
  perspective-origin: center center;
}

.hero-section h1 {
  /* 每幀被捲動進度改寫 transform，提前提升成合成層避免重繪抖動 */
  will-change: transform, opacity;
}

.text-neon-cyan {
  text-shadow:
    0 0 10px rgb(0 255 255 / 0.8),
    0 0 20px rgb(0 255 255 / 0.6),
    0 0 30px rgb(0 255 255 / 0.4);
  transform-style: preserve-3d;
}
</style>
