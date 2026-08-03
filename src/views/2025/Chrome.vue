<script setup lang="ts">
import { ref } from 'vue'
import img_tomato_filled from '@/assets/tomato_filled.png'
import svg_github from '@/assets/github.svg'
import { useLanguage, LANGUAGE_LABEL } from '@/composables/useLanguage'
import { useClock } from '@/composables/useClock'
import { useClickOutside } from '@/composables/useClickOutside'

const { currentLanguage, languages, changeLanguage } = useLanguage()
const { time, date, day, year } = useClock(currentLanguage)

const isMenuVisible = ref(false)
const menuButton = ref<HTMLElement | null>(null)
const menuContainer = ref<HTMLElement | null>(null)

useClickOutside(isMenuVisible, [menuButton, menuContainer], () => {
  isMenuVisible.value = false
})

const select = (value: string) => {
  changeLanguage(value)
  isMenuVisible.value = false
}
</script>

<template>
  <header class="menu-bar">
    <div class="flex items-center gap-2">
      <img :src="img_tomato_filled" alt="tomato" class="w-6 h-6" />
      <span class="text-sm font-bold">7Red4 Portfolio</span>
    </div>

    <div class="right-menu text-xs sm:text-base">
      <div class="relative text-right self-stretch hidden sm:block">
        <button
          ref="menuButton"
          type="button"
          aria-haspopup="listbox"
          :aria-expanded="isMenuVisible"
          @click="isMenuVisible = !isMenuVisible"
        >
          {{ LANGUAGE_LABEL[currentLanguage] }}
        </button>
        <div
          v-if="isMenuVisible"
          ref="menuContainer"
          class="menu-container absolute top-full right-0 shadow-lg border"
        >
          <ul role="listbox">
            <li
              v-for="(language, index) in languages"
              :key="language.value"
              role="option"
              :aria-selected="currentLanguage === language.value"
              class="menu_list_item flex items-center gap-2 px-2 py-1 cursor-pointer"
              :class="{ 'border-b': index !== languages.length - 1 }"
              @click="select(language.value)"
            >
              <div :class="currentLanguage === language.value ? 'opacity-100' : 'opacity-0'">✓</div>
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

  <footer class="site-footer">
    <p class="text-xs flex items-center gap-2">
      © {{ year }} 7Red4
      <a
        href="https://github.com/7Red4"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block"
      >
        <svg_github class="w-6 h-6" />
      </a>
    </p>
  </footer>
</template>

<style scoped lang="scss">
/* 2025 版的桌面 UI 是米黃底細灰線，chrome 沿用同一套 */
.menu-bar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #666;
  background-color: #fdffd9;
  color: #232323;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
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

.menu-container {
  background-color: #fdffd9;
  border-color: #666;
}

.menu_list_item {
  background-color: #fdffd9;
  color: #232323;
  border-color: #666;
  white-space: nowrap;
}

.menu_list_item:hover {
  background-color: #232323;
  color: #fff;
}

.site-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #232323;
}
</style>
