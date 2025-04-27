import { createApp } from 'vue';
import './style/main.scss';
import App from './App.vue';
import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.json'
import enUS from './locales/en-US.json'
import ja from './locales/ja.json'
import { createGtm } from '@gtm-support/vue-gtm';
import router from './routes';

const i18n = createI18n({
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
  debug: true,
  vueRouter: router,
}));

app.mount('#app');
