<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WireframeLaptop from '@/components/three/WireframeLaptop.vue'

const { t } = useI18n()

interface Props {
  scrollProgress: number
}

const props = defineProps<Props>()

// 計算這個 section 的局部進度 (50% - 80%)
const sectionProgress = computed(() => {
  const start = 0.5
  const end = 0.8
  return Math.max(0, Math.min(1, (props.scrollProgress - start) / (end - start)))
})
</script>

<template>
  <section class="works-section relative min-h-screen w-full py-20">
    <!-- 3D 筆電背景 -->
    <div class="absolute inset-0 z-0 opacity-15">
      <WireframeLaptop :scrollProgress="props.scrollProgress" />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <h2 class="text-4xl md:text-6xl font-bold text-neon-cyan mb-16 text-center">
        {{ t('works.title') }}
      </h2>

      <!-- 作品網格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 作品卡片會在這裡動態生成 -->
        <div v-for="(category, key) in t('works')" :key="key"
          class="work-card border border-neon-magenta p-6 rounded-lg hover:shadow-neon transition-all">
          <h3 class="text-xl font-bold text-neon-magenta mb-4">{{ key }}</h3>
          <!-- 這裡之後會替換成 3D 卡片 -->
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

.border-neon-magenta {
  border-color: #FF00FF;
}

.shadow-neon {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
}
</style>
