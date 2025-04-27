<template>
  <div class="layout">
    <header class="menu-bar z-[9999]">
      <div class="flex items-center gap-2">

        <div class="relative">
          <button @mouseenter="isTomatoFilled = true" @mouseleave="isTomatoFilled = false" @click="toggleMenu"
            class="menu-btn flex items-center justify-center">
            <img :src="isTomatoFilled ? img_tomato_filled : img_tomato" alt="tomato" class="w-6 h-6 cursor-pointer">
          </button>
        </div>

        <span class="text-sm font-bold">7Red4 Portfolio</span>
      </div>
      <div class="right-menu text-xs">
        {{ time }}
        <div class="divider" /> {{ date }}
      </div>

      <div v-if="isMenuVisible" class="menu-container absolute top-full left-0 bg-[#fdffd9] shadow-lg border-2 border-black">
        <ul>
          <li class="relative whitespace-nowrap cursor-pointer px-2 py-1" @mouseover="isLanguageMenuVisible = true"
            @mouseleave="isLanguageMenuVisible = false">
            🌐 Languages ▶
            <div v-if="isLanguageMenuVisible" class="absolute top-0 left-full bg-[#fdffd9] shadow-lg px-2 py-1 border-2 border-black">
              <ul>
                <li v-for="(language, index) in languages" :key="language.value" class="flex items-center gap-2" :class="{ 'border-b-2 border-black': index !== languages.length - 1 }">
                  <div :class="{ 'opacity-100': currentLanguage === language.value, 'opacity-0': currentLanguage !== language.value }">✓</div>
                  <a href="#" @click="changeLanguage(language.value)">{{ language.name }}</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </header>

    <router-view />

    <footer class="absolute bottom-0 left-0 w-full h-10 flex justify-center items-center">
      <p class="text-xs flex items-center gap-2">
        © 2025 7Red4 <a href="https://github.com/7Red4" target="_blank" class="inline-block">
          <svg_github class="w-6 h-6" />
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import img_tomato from '@/assets/tomato.png'
import img_tomato_filled from '@/assets/tomato_filled.png'

import svg_github from '@/assets/github.svg'

import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

const i18n = useI18n();

const isTomatoFilled = ref(false);

const time = ref(dayjs().format('HH:mm:ss'));
const date = ref(dayjs().format('YYYY/MM/DD'));

setInterval(() => {
  time.value = dayjs().format('HH:mm:ss');
  date.value = dayjs().format('YYYY/MM/DD');
}, 1000);


const languages = [
  {
    name: 'English',
    value: 'en-US',
  },
  {
    name: '日本語',
    value: 'ja',
  },
  {
    name: '繁體中文',
    value: 'zh-TW',
  },
]

const currentLanguage = ref(i18n.locale);

const changeLanguage = (language: string) => {
  currentLanguage.value = language;
  i18n.setLocaleMessage(language, i18n.getLocaleMessage(language));
  isLanguageMenuVisible.value = false;
  isMenuVisible.value = false;
}

const isMenuVisible = ref(false);

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
}

const isLanguageMenuVisible = ref(false);
</script>

<style scoped>
.menu-bar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #666;
  background-color: #fdffd9;
  position: relative;
}

.right-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.divider {
  width: 1px;
  align-self: stretch;
  background-color: #666;
}
</style>