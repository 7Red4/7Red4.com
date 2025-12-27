<template>
  <div class="layout">
    <header class="menu-bar z-[9999]">
      <div class="flex items-center gap-2">
        <div class="relative">
          <button @mouseenter="isTomatoFilled = true" @mouseleave="isTomatoFilled = false" @click="toggleMenu"
            class="menu-btn flex items-center justify-center">
            <img :src="isTomatoFilled ? img_tomato_filled : img_tomato" alt="tomato" class="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <span class="text-sm font-bold">7Red4 Portfolio</span>
      </div>
      <div class="right-menu text-xs sm:text-base">
        <div class="relative text-right self-stretch hidden sm:block">
          {{ languageMap[currentLanguage] }}
        </div>
        <div class="divider hidden sm:block" />
        {{ time }}
        {{ date }}
        {{ day }}
      </div>

      <div v-if="isMenuVisible" class="menu-container absolute top-full left-0 shadow-lg border-2 border-black">
        <ul>
          <li class="menu_list_item relative whitespace-nowrap cursor-pointer px-2 py-1"
            @mouseover="isLanguageMenuVisible = true" @mouseleave="isLanguageMenuVisible = false">
            🌐 Languages ▶
            <div v-if="isLanguageMenuVisible" class="absolute top-0 left-full shadow-lg border-2 border-black">
              <ul>
                <li v-for="(language, index) in languages" :key="language.value"
                  class="menu_list_item flex items-center gap-2 px-2 py-1" :class="{
                    'border-b-2 border-black': index !== languages.length - 1
                  }">
                  <div :class="{
                    'opacity-100': currentLanguage === language.value,
                    'opacity-0': currentLanguage !== language.value
                  }">
                    ✓
                  </div>
                  <button class="flex items-center gap-2 px-2 py-1" @click="changeLanguage(language.value)">
                    {{ language.name }}
                  </button>
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
        © 2025 7Red4
        <a href="https://github.com/7Red4" target="_blank" class="inline-block">
          <svg_github class="w-6 h-6" />
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import img_tomato from '@/assets/tomato.png';
import img_tomato_filled from '@/assets/tomato_filled.png';

import svg_github from '@/assets/github.svg';

import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-tw';

const i18n = useI18n();

const isTomatoFilled = ref(false);

const languages = [
  {
    name: 'English',
    value: 'en-US'
  },
  {
    name: '日本語',
    value: 'ja'
  },
  {
    name: '繁體中文',
    value: 'zh-TW'
  }
];

const languageMap: Record<string, string> = {
  'en-US': 'English',
  ja: '日本語',
  'zh-TW': '繁體中文'
};

const getCurrentLanguage = () => {
  const storageLanguage = localStorage.getItem('lang');
  const browserLanguage = navigator.language;

  return storageLanguage || browserLanguage;
};

const currentLanguage = ref(getCurrentLanguage());

const changeLanguage = (language: string = currentLanguage.value) => {
  currentLanguage.value = language;
  i18n.locale.value = language;
  isLanguageMenuVisible.value = false;
  isMenuVisible.value = false;
  localStorage.setItem('lang', language);
  document.documentElement.lang = language;
};

const isMenuVisible = ref(false);

const handleClickOutside = (event: MouseEvent) => {
  const menuContainer = document.querySelector('.menu-container');
  const menuBtn = document.querySelector('.menu-btn');

  if (
    menuContainer &&
    menuBtn &&
    !menuContainer.contains(event.target as Node) &&
    !menuBtn.contains(event.target as Node)
  ) {
    isMenuVisible.value = false;
  }
};

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
  if (isMenuVisible.value) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
};

onMounted(() => {
  changeLanguage();
});

// Clean up event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const isLanguageMenuVisible = ref(false);

const time = ref(dayjs().format('HH:mm'));
const date = ref(dayjs().format('MM/DD'));
const day = ref(dayjs().locale(currentLanguage.value).format('ddd'));
setInterval(() => {
  time.value = dayjs().format('HH:mm');
  date.value = dayjs().format('MM/DD');
  day.value = dayjs().locale(currentLanguage.value).format('ddd');
}, 1000);
</script>

<style scoped lang="scss">
.menu-bar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #ff00ff;
  background: linear-gradient(180deg, rgba(10, 10, 31, 0.95) 0%, rgba(20, 20, 40, 0.9) 100%);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  color: #00ffff;
  font-weight: 500;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  mix-blend-mode: difference;
}

.menu-bar span {
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.right-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
}

.divider {
  width: 2px;
  align-self: stretch;
  background: linear-gradient(180deg, #ff00ff 0%, #00ffff 100%);
  box-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

.menu_list_item {
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(30, 10, 40, 0.95) 100%);
  color: #00ffff;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.menu_list_item:hover {
  background: linear-gradient(135deg, #ff00ff 0%, #8800ff 100%);
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.6);
  transform: translateX(4px);
}

.menu-container {
  background: rgba(10, 10, 31, 0.98);
  border: 2px solid #ff00ff !important;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
}

.menu-container ul ul {
  background: rgba(10, 10, 31, 0.98);
  border: 2px solid #00ffff !important;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.menu_list_item button {
  transition: all 0.2s ease;
}

.menu_list_item button:hover {
  transform: scale(1.05);
}
</style>
