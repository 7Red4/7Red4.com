<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SynthwaveBackground from '@/components/three/SynthwaveBackground.vue'

const { t } = useI18n()

interface Props {
  scrollProgress: number
}

const props = defineProps<Props>()
</script>

<template>
  <section class="hero-section relative h-screen w-full overflow-hidden">
    <!-- Synthwave 背景 -->
    <div class="absolute inset-0 z-0">
      <SynthwaveBackground :scrollProgress="props.scrollProgress" />
    </div>

    <!-- UI 覆蓋層 -->
    <div class="relative z-10 flex h-full flex-col items-center justify-center perspective-container">
      <h1 class="text-6xl md:text-8xl font-bold text-neon-cyan mb-4 select-none" :style="{
        opacity: 1 - props.scrollProgress * 4,
        transform: `translateY(${200 + props.scrollProgress * -1300}px) scaleY(4) rotateX(${25 + props.scrollProgress * 150}deg)`,
        letterSpacing: '6px'
      }">
        7Red4
      </h1>
    </div>
  </section>
</template>

<style scoped>
.perspective-container {
  perspective: 1000px;
  perspective-origin: center center;
}

.text-neon-cyan {
  color: #00FFFF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(0, 255, 255, 0.6),
    0 0 30px rgba(0, 255, 255, 0.4);
  transform-style: preserve-3d;
}

.text-neon-magenta {
  color: #FF00FF;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8),
    0 0 20px rgba(255, 0, 255, 0.6);
}
</style>
