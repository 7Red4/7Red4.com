<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import WireframeLaptop from '@/components/three/WireframeLaptop.vue'
import { WORK_CATEGORIES } from '@/data/works'

const { t } = useI18n()

defineProps<{ scrollProgress: number }>()
</script>

<template>
  <section class="works-section relative min-h-screen w-full py-20">
    <!-- 3D 筆電背景
         這一段內容很長（約 2500px），若讓畫布跟著撐滿整段，
         畫面比例會變成極窄的直式、鏡頭水平視野被壓縮到看不出模型。
         改成 sticky 的視窗高度，比例維持正常且捲動全程都看得到。 -->
    <div class="absolute inset-0 z-0 opacity-15 pointer-events-none">
      <div class="sticky top-0 h-screen w-full">
        <WireframeLaptop :scrollProgress="scrollProgress" />
      </div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <h2 class="text-4xl md:text-6xl font-bold text-neon-cyan glow-cyan mb-16 text-center">
        {{ t('works.title') }}
      </h2>

      <div v-for="category in WORK_CATEGORIES" :key="category.key" class="mb-20">
        <h3 class="text-2xl font-bold text-neon-magenta glow-magenta mb-8">
          ☆ {{ t(`works.${category.key}.title`) }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article
            v-for="entry in category.entries"
            :key="`${category.key}-${entry.index}`"
            class="work-card border border-neon-magenta p-6 rounded-lg transition-all"
          >
            <a
              :href="entry.demo ?? entry.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="block mb-4 overflow-hidden rounded"
            >
              <img
                :src="entry.image"
                alt=""
                loading="lazy"
                decoding="async"
                class="w-full transition-transform duration-300 hover:scale-105"
              />
            </a>

            <h4 class="text-xl font-bold text-neon-cyan mb-2">
              {{ t(`works.${category.key}.works.${entry.index}.name`) }}
            </h4>

            <p class="text-sm text-gray-300 whitespace-pre-line">
              {{ t(`works.${category.key}.works.${entry.index}.description`) }}
            </p>

            <ul v-if="entry.tech?.length" class="list-disc list-inside text-sm text-gray-400 mt-3">
              <li v-for="tech in entry.tech" :key="tech.label">
                <a
                  v-if="tech.href"
                  :href="tech.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-neon-cyan hover:underline"
                >
                  {{ tech.label }}
                </a>
                <span v-else>{{ tech.label }}</span>
              </li>
            </ul>

            <div class="flex gap-4 mt-4 text-sm font-mono">
              <a
                v-if="entry.demo"
                :href="entry.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="text-neon-green hover:underline"
              >
                demo →
              </a>
              <a
                v-if="entry.repo"
                :href="entry.repo"
                target="_blank"
                rel="noopener noreferrer"
                class="text-neon-green hover:underline"
              >
                repo →
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work-card:hover {
  box-shadow: 0 0 20px rgb(255 0 255 / 0.6);
}
</style>
