<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import WireframeTomato from '@/components/three/WireframeTomato.vue'
import avatar from '@/assets/me.jpg'
import {
  SKILLS,
  TOOLS,
  LANGUAGE_KEYS,
  INTEREST_KEYS,
  CONTACT_EMAIL,
} from '@/data/profile'

const { t, tm, rt } = useI18n()

defineProps<{ scrollProgress: number }>()

// description_list 是陣列，t() 對陣列路徑只會回傳 key 字串，
// 要用 tm() 取原始訊息再用 rt() 解析
const highlights = computed(() =>
  (tm('about.description_list') as unknown[]).map((item) => rt(item as string))
)
</script>

<template>
  <section class="about-section relative min-h-screen w-full py-20">
    <!-- 3D 番茄背景 -->
    <div class="absolute inset-0 z-0 opacity-20">
      <WireframeTomato :scrollProgress="scrollProgress" />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <h2 class="text-4xl md:text-6xl font-bold text-neon-cyan glow-cyan mb-16">
        {{ t('about.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <!-- 左：個人資料 -->
        <div class="space-y-8">
          <div class="flex items-center gap-6">
            <img
              :src="avatar"
              :alt="t('name.main')"
              width="120"
              height="120"
              loading="lazy"
              decoding="async"
              class="w-24 h-24 rounded-full border-2 border-neon-magenta object-cover"
            />
            <div>
              <p class="text-2xl md:text-3xl font-bold text-neon-cyan glow-cyan">
                {{ t('name.main') }}
              </p>
              <p class="text-neon-magenta glow-magenta">
                <span class="whitespace-nowrap">{{ t('name.sub') }}</span>
                <span class="text-sm whitespace-nowrap">（{{ t('name.sub_alias') }}）</span>
              </p>
              <p class="text-gray-300 mt-1">💻 {{ t('job') }}</p>
            </div>
          </div>

          <p class="text-lg text-gray-300">{{ t('about.description') }}</p>

          <div>
            <h3 class="text-xl font-bold text-neon-magenta glow-magenta mb-3">
              {{ t('about.what_i_do') }}
            </h3>
            <ul class="space-y-2 text-gray-300">
              <li v-for="item in highlights" :key="item" class="flex gap-2">
                <span class="text-neon-green" aria-hidden="true">▸</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <p class="text-gray-300">
            {{ t('about.contact') }}
            <a
              :href="`mailto:${CONTACT_EMAIL}`"
              class="text-neon-cyan underline underline-offset-4 hover:glow-cyan transition-all"
            >
              {{ CONTACT_EMAIL }}
            </a>
          </p>
        </div>

        <!-- 右：技能與興趣 -->
        <div class="space-y-10">
          <div>
            <h3 class="text-xl font-bold text-neon-magenta glow-magenta mb-4">Main Skills</h3>
            <ul class="flex flex-wrap gap-3">
              <li v-for="skill in SKILLS" :key="skill.label">
                <a
                  v-if="skill.href"
                  :href="skill.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="tag"
                >
                  {{ skill.label }}
                </a>
                <span v-else class="tag">{{ skill.label }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-neon-magenta glow-magenta mb-4">Tools</h3>
            <ul class="flex flex-wrap gap-3">
              <li v-for="tool in TOOLS" :key="tool.label">
                <span class="tag">{{ tool.label }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-neon-magenta glow-magenta mb-4">Languages</h3>
            <ul class="space-y-2 text-gray-300">
              <li v-for="key in LANGUAGE_KEYS" :key="key" class="flex gap-2">
                <span class="text-neon-green" aria-hidden="true">▸</span>
                <span>{{ t(`languages.${key}`) }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-neon-magenta glow-magenta mb-4">Other Interests</h3>
            <ul class="flex flex-wrap gap-3 text-gray-300">
              <li v-for="key in INTEREST_KEYS" :key="key" class="tag">
                {{ t(`other_interests.${key}`) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-neon-cyan);
  border-radius: 0.25rem;
  color: var(--color-neon-cyan);
  font-size: 0.875rem;
  white-space: nowrap;
  transition: all 0.2s ease;
}

a.tag:hover {
  background-color: var(--color-neon-cyan);
  color: var(--color-bg-dark);
  box-shadow: 0 0 15px rgb(0 255 255 / 0.6);
}
</style>
