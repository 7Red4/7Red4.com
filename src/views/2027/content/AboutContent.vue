<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import avatar from '@/assets/me.jpg'
import { SKILLS, TOOLS, LANGUAGE_KEYS, INTEREST_KEYS } from '@/data/profile'

/** 列表版與房子的 modal 共用同一份內容 */
const { t, tm, rt } = useI18n()

const highlights = computed(() =>
  (tm('about.description_list') as unknown[]).map((item) => rt(item as string))
)
</script>

<template>
  <div class="about">
    <header class="head">
      <img :src="avatar" :alt="t('name.main')" width="80" height="80" class="avatar" />
      <div>
        <p class="name">{{ t('name.main') }}</p>
        <p class="sub">{{ t('name.sub') }}（{{ t('name.sub_alias') }}）· {{ t('job') }}</p>
      </div>
    </header>

    <p class="lead">{{ t('about.description') }}</p>

    <h3>{{ t('about.what_i_do') }}</h3>
    <ul class="bullets">
      <li v-for="item in highlights" :key="item">{{ item }}</li>
    </ul>

    <div class="columns">
      <div>
        <h3>Main Skills</h3>
        <ul class="tags">
          <li v-for="skill in SKILLS" :key="skill.label">
            <a v-if="skill.href" :href="skill.href" target="_blank" rel="noopener noreferrer">
              {{ skill.label }}
            </a>
            <span v-else>{{ skill.label }}</span>
          </li>
        </ul>
      </div>
      <div>
        <h3>Tools</h3>
        <ul class="tags">
          <li v-for="tool in TOOLS" :key="tool.label"><span>{{ tool.label }}</span></li>
        </ul>
      </div>
      <div>
        <h3>Languages</h3>
        <ul class="bullets">
          <li v-for="key in LANGUAGE_KEYS" :key="key">{{ t(`languages.${key}`) }}</li>
        </ul>
      </div>
      <div>
        <h3>Other Interests</h3>
        <ul class="tags">
          <li v-for="key in INTEREST_KEYS" :key="key">
            <span>{{ t(`other_interests.${key}`) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.avatar {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgb(196 64 46 / 0.5);
}

.name {
  font-size: 1.375rem;
  font-weight: 700;
}

.sub {
  font-size: 0.9375rem;
  color: rgb(107 86 60 / 0.85);
}

.lead {
  line-height: 1.8;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.6rem;
}

.bullets {
  list-style: disc;
  padding-left: 1.25rem;
  line-height: 1.9;
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: 0 2rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags li a,
.tags li span {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgb(140 116 88 / 0.35);
  font-size: 0.8125rem;
}

.tags li a:hover {
  border-color: #c4402e;
  color: #c4402e;
}
</style>
