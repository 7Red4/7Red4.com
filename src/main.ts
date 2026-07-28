import { createApp } from 'vue';
import './style/main.css';
import App from './App.vue';
import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.json'
import enUS from './locales/en-US.json'
import ja from './locales/ja.json'
import { createGtm } from '@gtm-support/vue-gtm';
import router from './routes';

const i18n = createI18n({
  // App.vue 與各 section 用的是 useI18n() 的 Composition API 寫法，
  // 沒有 legacy: false 的話 useI18n() 在 legacy 模式下不可用
  legacy: false,
  // 舊版 Index.vue 的模板大量使用 $t
  globalInjection: true,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'zh-TW': zhTW as Record<string, any>,
    'en-US': enUS as Record<string, any>,
    'ja': ja as Record<string, any>,
  },
})

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(createGtm({
  id: 'GTM-KVL4L4FG',
  enabled: true,
  // 原本寫死 true，debug 訊息會一路帶進 production
  debug: import.meta.env.DEV,
  vueRouter: router,
}));

app.mount('#app');
