/**
 * 語言中立的個人資料。
 * 需要翻譯的文字仍放在 src/locales/*.json，這裡只放不隨語言變動的內容。
 */

export type Tag = { label: string; href?: string }

/** 對應舊版 Index.vue 的 Main Skills */
export const SKILLS: Tag[] = [
  { label: 'TypeScript', href: 'https://www.typescriptlang.org/' },
  { label: 'Vue.js', href: 'https://vuejs.org/' },
  { label: 'Vuetify', href: 'https://vuetifyjs.com/' },
  { label: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
  { label: 'Three.js', href: 'https://threejs.org/' },
]

/** 對應舊版 Index.vue 的 Tools */
export const TOOLS: Tag[] = [
  { label: 'VS code' },
  { label: 'Figma' },
  { label: 'Claude code' },
  { label: 'Browsers of course 😬' },
]

/** 對應 locales 的 languages.<key>，順序即顯示順序 */
export const LANGUAGE_KEYS = ['mandarin', 'english', 'japanese'] as const

/** 對應 locales 的 other_interests.<key> */
export const INTEREST_KEYS = ['games', 'anime', 'music', 'traveling'] as const

export const CONTACT_EMAIL = '7red4.work@gmail.com'
export const DISCORD_ID = '.7red4'
export const GITHUB_URL = 'https://github.com/7Red4'
