<script setup lang="ts">
import { ref } from 'vue'
import { useLanguage, LANGUAGE_LABEL } from '@/composables/useLanguage'
import { useClickOutside } from '@/composables/useClickOutside'

const { currentLanguage, languages, changeLanguage } = useLanguage()

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
  <!-- 沉浸式版面，chrome 壓到最低限度：只留語系切換 -->
  <div class="chrome">
    <button
      ref="menuButton"
      type="button"
      class="pill"
      aria-haspopup="listbox"
      :aria-expanded="isMenuVisible"
      @click="isMenuVisible = !isMenuVisible"
    >
      {{ LANGUAGE_LABEL[currentLanguage] }}
    </button>

    <div v-if="isMenuVisible" ref="menuContainer" class="menu" role="listbox">
      <button
        v-for="language in languages"
        :key="language.value"
        type="button"
        role="option"
        :aria-selected="currentLanguage === language.value"
        class="item"
        :class="{ selected: currentLanguage === language.value }"
        @click="select(language.value)"
      >
        {{ language.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chrome {
  position: fixed;
  top: max(1rem, env(safe-area-inset-top));
  right: max(1rem, env(safe-area-inset-right));
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.pill,
.menu {
  background: rgb(253 250 244 / 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 0.55);
  color: #6b563c;
  box-shadow: 0 6px 18px rgb(94 74 52 / 0.14);
}

.pill {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
}

.menu {
  border-radius: 12px;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  min-width: 8rem;
}

.item {
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  text-align: left;
  font-size: 0.8125rem;
  color: #6b563c;
  background: transparent;
  border: none;
}

.item:hover {
  background: rgb(196 64 46 / 0.1);
}

.item.selected {
  color: #c4402e;
  font-weight: 600;
}
</style>
