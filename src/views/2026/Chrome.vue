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
  <header class="menu-bar z-[9999]">
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
          class="menu-container absolute top-full right-0 shadow-lg border-2"
        >
          <ul role="listbox">
            <li
              v-for="(language, index) in languages"
              :key="language.value"
              role="option"
              :aria-selected="currentLanguage === language.value"
              class="menu_list_item flex items-center gap-2 px-2 py-1 cursor-pointer"
              :class="{ 'border-b-2': index !== languages.length - 1 }"
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

.site-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
