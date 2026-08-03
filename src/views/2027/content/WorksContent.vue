<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WORK_CATEGORIES } from '@/data/works'

/** 列表版與 /work 共用 */
const { t } = useI18n()
</script>

<template>
  <div class="works">
    <div v-for="category in WORK_CATEGORIES" :key="category.key" class="category">
      <h3>{{ t(`works.${category.key}.title`) }}</h3>

      <article
        v-for="entry in category.entries"
        :key="`${category.key}-${entry.index}`"
        class="work"
      >
        <a :href="entry.demo ?? entry.repo" target="_blank" rel="noopener noreferrer">
          <img :src="entry.image" alt="" loading="lazy" decoding="async" />
        </a>
        <div class="body">
          <h4>{{ t(`works.${category.key}.works.${entry.index}.name`) }}</h4>
          <p class="desc">{{ t(`works.${category.key}.works.${entry.index}.description`) }}</p>
          <ul v-if="entry.tech?.length" class="tech">
            <li v-for="tech in entry.tech" :key="tech.label">
              <a v-if="tech.href" :href="tech.href" target="_blank" rel="noopener noreferrer">
                {{ tech.label }}
              </a>
              <span v-else>{{ tech.label }}</span>
            </li>
          </ul>
          <p class="links">
            <a v-if="entry.demo" :href="entry.demo" target="_blank" rel="noopener noreferrer">
              demo →
            </a>
            <a v-if="entry.repo" :href="entry.repo" target="_blank" rel="noopener noreferrer">
              repo →
            </a>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.category {
  margin-top: 2rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
}

h4 {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.work {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 0;
  border-top: 1px solid rgb(140 116 88 / 0.18);
  flex-wrap: wrap;
}

.work img {
  width: 12rem;
  border-radius: 10px;
  display: block;
}

.body {
  flex: 1;
  min-width: 14rem;
}

.desc {
  white-space: pre-line;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: rgb(75 60 42 / 0.85);
}

.tech {
  list-style: disc;
  padding-left: 1.25rem;
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  color: rgb(107 86 60 / 0.8);
}

.links {
  display: flex;
  gap: 1rem;
  margin-top: 0.6rem;
  font-size: 0.875rem;
}

.links a,
.tech a {
  color: #c4402e;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
