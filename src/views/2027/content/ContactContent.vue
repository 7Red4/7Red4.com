<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'
import { CONTACT_EMAIL, DISCORD_ID, GITHUB_URL } from '@/data/profile'

/** 列表版與郵箱的 modal 共用 */
const { t } = useI18n()

// legacy: true 讓非 HTTPS 環境退回 execCommand
const { copy, isSupported } = useClipboard({ legacy: true })

const copied = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

const copyValue = async (value: string, key: 'email' | 'discord') => {
  try {
    await copy(value)
    copied.value = t(`copied.${key}`)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (copied.value = ''), 2400)
  } catch {
    // 使用者拒絕權限或環境不支援時靜默失敗
  }
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="contact">
    <p class="lead">{{ t('contact.description') }}</p>

    <dl class="rows">
      <dt>Email</dt>
      <dd>
        <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
        <button
          v-if="isSupported"
          type="button"
          class="copy"
          :aria-label="`Copy ${CONTACT_EMAIL}`"
          @click="copyValue(CONTACT_EMAIL, 'email')"
        >
          複製
        </button>
      </dd>

      <dt>Discord</dt>
      <dd>
        <span>{{ DISCORD_ID }}</span>
        <button
          v-if="isSupported"
          type="button"
          class="copy"
          :aria-label="`Copy ${DISCORD_ID}`"
          @click="copyValue(DISCORD_ID, 'discord')"
        >
          複製
        </button>
      </dd>

      <dt>GitHub</dt>
      <dd>
        <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer">
          {{ GITHUB_URL.replace('https://', '') }}
        </a>
      </dd>
    </dl>

    <p class="copied" role="status" aria-live="polite">{{ copied }}</p>
  </div>
</template>

<style scoped>
.lead {
  line-height: 1.8;
}

.rows {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1.5rem;
  margin-top: 1.25rem;
  align-items: center;
}

dt {
  font-weight: 600;
}

dd {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

a {
  color: #c4402e;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.copy {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgb(140 116 88 / 0.35);
  background: transparent;
  font-size: 0.75rem;
  color: rgb(107 86 60 / 0.9);
}

.copy:hover {
  border-color: #c4402e;
  color: #c4402e;
}

.copied {
  min-height: 1.25rem;
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: #c4402e;
}
</style>
