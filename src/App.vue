<template>
  <div class="layout">
    <header class="menu-bar z-[9999]">
      <div class="flex items-center gap-2">
        <div class="relative">
          <img :src="img_tomato_filled" alt="tomato" class="w-6 h-6" />
        </div>

        <span class="text-sm font-bold">7Red4 Portfolio</span>
      </div>
      <div class="right-menu text-xs sm:text-base">
        <div class="relative text-right self-stretch hidden sm:block">
          <button ref="menuButton" type="button" aria-haspopup="listbox" :aria-expanded="isMenuVisible"
            @click="toggleMenu">
            {{ languageMap[currentLanguage] }}
          </button>
          <div v-if="isMenuVisible" ref="menuContainer"
            class="menu-container absolute top-full right-0 shadow-lg border-2">
            <ul role="listbox">
              <li v-for="(language, index) in languages" :key="language.value" role="option"
                :aria-selected="currentLanguage === language.value"
                class="menu_list_item flex items-center gap-2 px-2 py-1 cursor-pointer" :class="{
                  'border-b-2': index !== languages.length - 1
                }" @click="changeLanguage(language.value)">
                <div :class="{
                  'opacity-100': currentLanguage === language.value,
                  'opacity-0': currentLanguage !== language.value
                }">
                  ✓
                </div>
                <span>{{ language.name }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="divider hidden sm:block" />
        {{ time }}
        {{ date }}
        {{ day }}
      </div>
    </header>

    <router-view />

    <footer class="absolute bottom-0 left-0 w-full h-10 flex justify-center items-center">
      <p class="text-xs flex items-center gap-2">
        © {{ currentYear }} 7Red4
        <a href="https://github.com/7Red4" target="_blank" rel="noopener noreferrer" class="inline-block">
          <svg_github class="w-6 h-6" />
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import img_tomato_filled from '@/assets/tomato_filled.png';

import svg_github from '@/assets/github.svg';

import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh-tw';

const i18n = useI18n();

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

const SUPPORTED_LANGUAGES = ['en-US', 'ja', 'zh-TW'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * navigator.language 可能回傳 'zh-Hant-TW'、'en-GB'、'ja-JP' 這類值，
 * 直接拿去查 languageMap 會是 undefined，選單就變空白。
 */
const normalizeLanguage = (value: string | null | undefined): SupportedLanguage => {
  if (!value) return 'en-US';
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(value)) {
    return value as SupportedLanguage;
  }
  const lower = value.toLowerCase();
  if (lower.startsWith('zh')) return 'zh-TW';
  if (lower.startsWith('ja')) return 'ja';
  return 'en-US';
};

const getCurrentLanguage = () =>
  normalizeLanguage(localStorage.getItem('lang') ?? navigator.language);

const currentLanguage = ref<SupportedLanguage>(getCurrentLanguage());

// dayjs 的 locale 代碼與 i18n 不完全一致
const DAYJS_LOCALE: Record<SupportedLanguage, string> = {
  'en-US': 'en',
  ja: 'ja',
  'zh-TW': 'zh-tw'
};

const changeLanguage = (language: string = currentLanguage.value) => {
  const next = normalizeLanguage(language);
  currentLanguage.value = next;
  i18n.locale.value = next;
  isMenuVisible.value = false;
  localStorage.setItem('lang', next);
  document.documentElement.lang = next;
  updateClock();
};

const isMenuVisible = ref(false);
const menuButton = ref<HTMLElement | null>(null);
const menuContainer = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (
    menuContainer.value &&
    menuButton.value &&
    !menuContainer.value.contains(event.target as Node) &&
    !menuButton.value.contains(event.target as Node)
  ) {
    isMenuVisible.value = false;
    document.removeEventListener('click', handleClickOutside);
  }
};

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;

  if (isMenuVisible.value) {
    // 使用 nextTick 確保 DOM 更新後再添加事件監聽
    nextTick(() => {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    });
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
};

const time = ref('');
const date = ref('');
const day = ref('');
const currentYear = computed(() => dayjs().year());

const updateClock = () => {
  const now = dayjs();
  time.value = now.format('HH:mm');
  date.value = now.format('MM/DD');
  day.value = now.locale(DAYJS_LOCALE[currentLanguage.value]).format('ddd');
};

let clockTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  changeLanguage();
  // 原本這個 interval 建在 setup 的頂層且從未清除
  clockTimer = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (clockTimer) clearInterval(clockTimer);
});
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
  white-space: nowrap;
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
