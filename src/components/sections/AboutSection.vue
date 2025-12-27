<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WireframeTomato from '@/components/three/WireframeTomato.vue'

const { t } = useI18n()

interface Props {
  scrollProgress: number
}

const props = defineProps<Props>()

// 計算這個 section 的局部進度 (25% - 50%)
const sectionProgress = computed(() => {
  const start = 0.25
  const end = 0.5
  return Math.max(0, Math.min(1, (props.scrollProgress - start) / (end - start)))
})
</script>

<template>
  <section class="about-section relative min-h-screen w-full py-20">
    <!-- 3D 番茄背景 -->
    <div class="absolute inset-0 z-0 opacity-20">
      <WireframeTomato :scrollProgress="props.scrollProgress" />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- 左側：文字內容 -->
        <div class="text-content">
          <h2 class="text-4xl md:text-6xl font-bold text-neon-cyan mb-8">
            {{ t('about.title') }}
          </h2>
          <div class="text-lg text-gray-300 space-y-4">
            <p>{{ t('about.description') }}</p>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-neon-magenta mb-4">Skills</h3>
              <div class="flex flex-wrap gap-3">
                <span v-for="skill in t('about.skills')" :key="skill"
                  class="px-4 py-2 border border-neon-cyan text-neon-cyan rounded-md">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：3D 技能軌道 (預留空間) -->
        <div class="threejs-container h-96 relative">
          <canvas ref="skillsCanvasRef" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-neon-cyan {
  color: #00FFFF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.text-neon-magenta {
  color: #FF00FF;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
}

.border-neon-cyan {
  border-color: #00FFFF;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}
</style>
