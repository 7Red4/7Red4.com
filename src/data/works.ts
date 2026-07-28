import arFilter from '@/assets/AR Filter.png'
import arLocation from '@/assets/AR Location.png'
import pinball from '@/assets/PC Home V1111P pinball.png'
import rhythmGame from '@/assets/PC Home V1111P rhythm game.png'
import ytDownloader from '@/assets/yt-downloader.png'

export type WorkTech = { label: string; href?: string }

export type WorkEntry = {
  /** 對應 locales 的 works.<category>.works[<index>] */
  index: number
  image: string
  /** 線上 demo */
  demo?: string
  /** 原始碼 */
  repo?: string
  tech?: WorkTech[]
}

export type WorkCategory = {
  /** 對應 locales 的 works.<key> */
  key: string
  entries: WorkEntry[]
}

/**
 * 圖片、連結、技術棧都不需要翻譯，所以放這裡而不是塞進三份 locale JSON。
 * 文字（name / description）仍由 i18n 以 works.<key>.works.<index>.* 取得。
 */
export const WORK_CATEGORIES: WorkCategory[] = [
  {
    key: 'CSS_JS_ANIMATION',
    entries: [
      {
        index: 0,
        image:
          'https://images.cakeresume.com/4axp80/7red4/f3cb80c2-6830-4094-a4a8-f81612a5ad8a.png',
        demo: 'https://daxidaxi-online.tw/wish',
      },
      {
        index: 1,
        image:
          'https://images.cakeresume.com/4axp80/7red4/3e5f22d6-2158-4c00-9f0d-20d47f3d33e9.png',
        demo: 'https://tsaiyitech.com/',
      },
    ],
  },
  {
    key: 'SITE_REFACTOR',
    entries: [
      {
        index: 0,
        image:
          'https://images.cakeresume.com/4axp80/7red4/5191c047-f8a6-42fb-bde2-c6c086adc475.png',
        demo: 'https://giloo.ist/',
        tech: [
          { label: 'Vuetify', href: 'https://vuetifyjs.com/' },
          { label: 'Nuxt', href: 'https://nuxt.com/' },
        ],
      },
    ],
  },
  {
    key: 'WEB_AR',
    entries: [
      {
        index: 0,
        image: arFilter,
        demo: 'https://7red4.github.io/VPS_testing/',
        repo: 'https://github.com/7Red4/VPS_testing/',
        tech: [
          { label: 'jeelizFaceFilter', href: 'https://github.com/jeeliz/jeelizFaceFilter' },
          { label: 'hammer.js', href: 'https://github.com/hammerjs/hammer.js' },
          { label: 'project-bodypix', href: 'https://github.com/google-coral/project-bodypix' },
        ],
      },
      {
        index: 1,
        image: arLocation,
        demo: 'https://7red4.github.io/ar-location-demo/',
        repo: 'https://github.com/7Red4/ar-location-demo/',
        tech: [{ label: 'LocAR.js', href: 'https://github.com/AR-js-org/locar.js' }],
      },
    ],
  },
  {
    key: 'MINI_WEB_GAMES',
    entries: [
      {
        index: 0,
        image: pinball,
        repo: 'https://github.com/7Red4/PChome_shopping_festival-reupload-/',
        tech: [{ label: 'matter.js', href: 'https://brm.io/matter-js/' }],
      },
      {
        index: 1,
        image: rhythmGame,
        repo: 'https://github.com/7Red4/PChome_shopping_festival-reupload-/',
      },
    ],
  },
  {
    key: 'OTHERS',
    entries: [
      {
        index: 0,
        image: ytDownloader,
        repo: 'https://github.com/7Red4/ytDownloader/',
        tech: [
          { label: 'ytdl-core', href: 'https://github.com/fent/node-ytdl-core' },
          { label: 'youtube-dl', href: 'https://github.com/ytdl-org/youtube-dl' },
          { label: 'ffmpeg', href: 'https://ffmpeg.org/' },
          { label: 'Electron', href: 'https://github.com/electron/electron' },
          { label: 'Vue + Vuetify' },
        ],
      },
    ],
  },
]
