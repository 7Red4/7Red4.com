<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'
import WireframePhone from '@/components/three/WireframePhone.vue'
import CopyIcon from '@/assets/copy.svg'
import panicTomato from '@/assets/panic_tomato.png'
import { CONTACT_EMAIL, DISCORD_ID, GITHUB_URL } from '@/data/profile'

const { t } = useI18n()

defineProps<{ scrollProgress: number }>()

// legacy: true 讓非 HTTPS 環境退回 execCommand，
// 否則 navigator.clipboard 在那些情境根本不存在
const { copy, isSupported } = useClipboard({ legacy: true })

const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (text: string) => {
  toastText.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastText.value = ''
  }, 3000)
}

const copyValue = async (value: string, messageKey: 'email' | 'discord') => {
  try {
    await copy(value)
    showToast(t(`copied.${messageKey}`))
  } catch {
    // 使用者拒絕權限或環境不支援時靜默失敗，不要讓 rejection 冒出去
  }
}

const githubLabel = GITHUB_URL.replace('https://', '')

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <section class="contact-section relative min-h-screen w-full py-20">
    <!-- 3D 電話聽筒背景：寬螢幕移到右半邊，避免被中間的聯絡資訊卡片擋住 -->
    <div class="absolute inset-y-0 right-0 left-0 md:left-1/2 z-0 opacity-20">
      <WireframePhone :scrollProgress="scrollProgress" />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col items-center justify-center gap-8">
        <img
          :src="panicTomato"
          alt=""
          width="64"
          height="64"
          loading="lazy"
          decoding="async"
          class="w-16 h-16"
        />

        <h2 class="text-4xl md:text-6xl font-bold text-neon-cyan glow-cyan">
          {{ t('contact.title') }}
        </h2>

        <p class="text-gray-300 text-center max-w-xl">
          {{ t('contact.description') }}
        </p>

        <!-- 終端機風格的聯絡資訊 -->
        <div
          class="terminal-container bg-black/80 border-2 border-neon-green p-6 sm:p-8 rounded-lg max-w-2xl w-full"
        >
          <div class="mb-6">
            <span class="text-neon-green glow-green font-mono">root@7red4:~$</span>
          </div>

          <dl class="space-y-4 font-mono">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <dt class="text-neon-green">&gt; email:</dt>
              <dd class="flex items-center gap-2">
                <a
                  :href="`mailto:${CONTACT_EMAIL}`"
                  class="text-gray-300 hover:text-neon-cyan transition-colors break-all"
                >
                  {{ CONTACT_EMAIL }}
                </a>
                <button
                  v-if="isSupported"
                  type="button"
                  class="copy-btn"
                  :aria-label="`Copy ${CONTACT_EMAIL}`"
                  @click="copyValue(CONTACT_EMAIL, 'email')"
                >
                  <CopyIcon class="w-4 h-4" aria-hidden="true" />
                </button>
              </dd>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2">
              <dt class="text-neon-green">&gt; discord:</dt>
              <dd class="flex items-center gap-2">
                <span class="text-gray-300">{{ DISCORD_ID }}</span>
                <button
                  v-if="isSupported"
                  type="button"
                  class="copy-btn"
                  :aria-label="`Copy ${DISCORD_ID}`"
                  @click="copyValue(DISCORD_ID, 'discord')"
                >
                  <CopyIcon class="w-4 h-4" aria-hidden="true" />
                </button>
              </dd>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2">
              <dt class="text-neon-green">&gt; github:</dt>
              <dd>
                <a
                  :href="GITHUB_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-300 hover:text-neon-cyan transition-colors"
                >
                  {{ githubLabel }}
                </a>
              </dd>
            </div>
          </dl>

          <div class="mt-6" aria-hidden="true">
            <span class="text-neon-green glow-green font-mono motion-safe:animate-pulse">▊</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 複製結果提示 -->
    <Transition name="toast">
      <div v-if="toastText" class="toast" role="status" aria-live="polite">
        {{ toastText }}
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.terminal-container {
  box-shadow: 0 0 20px rgb(57 255 20 / 0.4);
}

.copy-btn {
  display: inline-flex;
  color: var(--color-neon-green);
  transition: all 0.2s ease;
}

.copy-btn:hover {
  color: var(--color-neon-cyan);
  transform: scale(1.15);
}

.toast {
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-neon-green);
  border-radius: 0.375rem;
  background-color: rgb(0 0 0 / 0.9);
  color: var(--color-neon-green);
  font-size: 0.875rem;
  white-space: nowrap;
  box-shadow: 0 0 20px rgb(57 255 20 / 0.5);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
