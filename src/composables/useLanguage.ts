import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const SUPPORTED_LANGUAGES = ['en-US', 'ja', 'zh-TW'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGES: { name: string; value: SupportedLanguage }[] = [
  { name: 'English', value: 'en-US' },
  { name: '日本語', value: 'ja' },
  { name: '繁體中文', value: 'zh-TW' },
]

export const LANGUAGE_LABEL: Record<SupportedLanguage, string> = {
  'en-US': 'English',
  ja: '日本語',
  'zh-TW': '繁體中文',
}

/** dayjs 的 locale 代碼與 i18n 不完全一致 */
export const DAYJS_LOCALE: Record<SupportedLanguage, string> = {
  'en-US': 'en',
  ja: 'ja',
  'zh-TW': 'zh-tw',
}

/**
 * navigator.language 可能回傳 'zh-Hant-TW'、'en-GB'、'ja-JP' 這類值，
 * 直接拿去查表會是 undefined，選單就變空白。
 */
export const normalizeLanguage = (value: string | null | undefined): SupportedLanguage => {
  if (!value) return 'en-US'
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(value)) {
    return value as SupportedLanguage
  }
  const lower = value.toLowerCase()
  if (lower.startsWith('zh')) return 'zh-TW'
  if (lower.startsWith('ja')) return 'ja'
  return 'en-US'
}

// 語系是全站共享的狀態，放在模組層級讓各年份的 chrome 都指向同一份
const currentLanguage = ref<SupportedLanguage>(
  normalizeLanguage(
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('lang') ?? navigator.language)
      : null
  )
)

let applied = false

export function useLanguage() {
  const i18n = useI18n()

  const changeLanguage = (language: string = currentLanguage.value) => {
    const next = normalizeLanguage(language)
    currentLanguage.value = next
    i18n.locale.value = next
    localStorage.setItem('lang', next)
    document.documentElement.lang = next
  }

  // 第一個呼叫端負責把偵測到的語系實際套上去
  if (!applied) {
    applied = true
    changeLanguage()
  }

  return { currentLanguage, languages: LANGUAGES, changeLanguage }
}
