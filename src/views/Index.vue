<template>
  <div class="desktop">
    <div class="bg_noise absolute inset-0" />

    <main class="desktop-area">
      <div v-if="isMainWindowOutside" class="absolute z-[99999] flex justify-center items-center w-full h-full">
        <button class="main-btn" @click="resetMainWindowPosition">
          {{ $t('bring_window_back') }}
        </button>
      </div>

      <WindowBox ref="ref_about" title="👨‍💻 About Me" name="about" :visible="isWindowVisible('about')"
        @closeWindow="closeWindow" @outside="(name) => closeWindow(name, true)" class="w-[80vw] max-w-[640px]">
        <div class="flex flex-col gap-2 p-8">
          <div class="flex items-center gap-2">
            <img src="@/assets/me.jpg" alt="me" class="w-[120px] h-[120px] rounded-full">
            <div class="w-16" />

            <div class="flex flex-col gap-2 text-base">
              <div>
                <span class="text-2xl font-bold">{{ $t('name.main') }}</span>
                <div class="w-2 inline-block" />
                <span class="text-xl text-red-400">
                  <span class="whitespace-nowrap">{{ $t('name.sub') }}</span>
                  <span class="text-sm whitespace-nowrap">({{ $t('name.sub_alias') }})</span>
                </span>
              </div>
              <div>
                <p>💻 {{ $t('job') }}</p>
              </div>
            </div>
          </div>

          <div class="h-6" />
          <div class="flex flex-col gap-2 text-base">
            <p>{{ $t('about.description') }}</p>
            <p>{{ $t('about.what_i_do') }}</p>
            <ul class="list-disc list-inside">
              <li>
                {{ $t('about.description_list.0') }}
              </li>
              <li>
                {{ $t('about.description_list.1') }}
              </li>
              <li>
                {{ $t('about.description_list.2') }}
              </li>
              <li>
                {{ $t('about.description_list.3') }}
              </li>
            </ul>
          </div>
          <div class="h-3"></div>
          <div class="text-base">
            {{ $t('about.contact') }}
            <a href="mailto:7red4.work@gmail.com"
              class="text-blue-500 underline">7red4.work@gmail.com</a>
          </div>
          <div class="h-3"></div>
          <h3 class="text-lg font-bold">Languages</h3>
          <ul class="list-disc list-inside text-base">
            <li>
              {{ $t('languages.mandarin') }}
            </li>
            <li>
              {{ $t('languages.english') }}
            </li>
            <li>
              {{ $t('languages.japanese') }}
            </li>
          </ul>
          <div class="h-3"></div>
          <h3 class="text-lg font-bold">Other Interests</h3>
          <ul class="list-disc list-inside text-base">
            <li>
              {{ $t('other_interests.games') }}
            </li>
            <li>
              {{ $t('other_interests.anime') }}
            </li>
            <li>
              {{ $t('other_interests.music') }}
            </li>
            <li>
              {{ $t('other_interests.traveling') }}
            </li>
          </ul>
        </div>
      </WindowBox>

      <WindowBox ref="ref_works" title="👨‍💻 Works" name="works" :visible="isWindowVisible('works')"
        @closeWindow="closeWindow" @outside="(name) => closeWindow(name, true)" class="w-[80vw] max-w-[780px]">
        <div class="flex flex-col gap-2 p-8 text-base">
          <div class="flex justify-between gap-4">
            <div class="flex-1">
              <p class="text-xl font-bold">Tools</p>
              <div class="h-2"></div>
              <div class="flex flex-wrap gap-2">
                <div v-for="tool in tools" :key="tool.name" class="box">
                  {{ tool.name }}
                </div>
              </div>
            </div>
            <div class="flex-1">
              <p class="text-xl font-bold">Main Skills</p>
              <div class="h-2"></div>
              <div class="flex flex-wrap gap-2">
                <div v-for="skill in skills" :key="skill.name" class="box">
                  {{ skill.name }}
                </div>
              </div>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ {{ $t('works.CSS_JS_ANIMATION.title') }}</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://daxidaxi-online.tw/wish" target="_blank">
                <img
                  src="https://img.cake.me/cdn-cgi/image/fit=scale-down,format=auto,w=1920/https://images.cakeresume.com/4axp80/7red4/f3cb80c2-6830-4094-a4a8-f81612a5ad8a.png"
                  alt="">
              </a>
              <div class="h-3"></div>

              <p class="text-lg font-bold">
                {{ $t('works.CSS_JS_ANIMATION.works.0.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.CSS_JS_ANIMATION.works.0.description') }}
              </p>
            </div>
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://tsaiyitech.com/" target="_blank">
                <img
                  src="https://img.cake.me/cdn-cgi/image/fit=scale-down,format=auto,w=1920/https://images.cakeresume.com/4axp80/7red4/3e5f22d6-2158-4c00-9f0d-20d47f3d33e9.png"
                  alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.CSS_JS_ANIMATION.works.1.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.CSS_JS_ANIMATION.works.1.description') }}
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ {{ $t('works.SITE_REFACTOR.title') }}</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="http://giloo.ist/" target="_blank">
                <img
                  src="https://img.cake.me/cdn-cgi/image/fit=scale-down,format=auto,w=1920/https://images.cakeresume.com/4axp80/7red4/5191c047-f8a6-42fb-bde2-c6c086adc475.png"
                  alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.SITE_REFACTOR.works.0.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.SITE_REFACTOR.works.0.description') }} <span class="text-blue-500 underline">Vuetify</span><br> Built by <span class="text-green-400 underline">Nuxt</span>.
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ {{ $t('works.WEB_AR.title') }}</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/VPS_testing/" target="_blank">
                <img src="@/assets/AR Filter.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.WEB_AR.works.0.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.WEB_AR.works.0.description') }}
                <ul class="list-disc list-inside text-sm">
                  <li>
                    <a href="https://github.com/jeeliz/jeelizFaceFilter" class="text-blue-500 underline">
                      jeelizFaceFilter
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/hammerjs/hammer.js" class="text-blue-500 underline">
                      hammer.js
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/google-coral/project-bodypix" class="text-blue-500 underline">
                      project-bodypix
                    </a>
                  </li>
                </ul>
              </p>
            </div>
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/ar-location-demo/" target="_blank">
                <img src="@/assets/AR Location.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.WEB_AR.works.1.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.WEB_AR.works.1.description') }}
                <ul class="list-disc list-inside text-sm">
                  <li>
                    <a href="https://github.com/AR-js-org/locar.js" class="text-blue-500 underline">LocAR.js</a>
                  </li>
                </ul>
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ {{ $t('works.MINI_WEB_GAMES.title') }}</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/PChome_shopping_festival-reupload-/" target="_blank">
                <img src="@/assets/PC Home V1111P pinball.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.MINI_WEB_GAMES.works.0.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.MINI_WEB_GAMES.works.0.description') }}
                <ul class="list-disc list-inside text-sm">
                  <li>
                    <a href="https://brm.io/matter-js/" class="text-[#F55F5F] underline">matter.js</a>
                  </li>
                </ul>
              </p>
            </div>

            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/PChome_shopping_festival-reupload-/" target="_blank">
                <img src="@/assets/PC Home V1111P rhythm game.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.MINI_WEB_GAMES.works.1.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.MINI_WEB_GAMES.works.1.description') }}
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ {{ $t('works.OTHERS.title') }}</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/ytDownloader/" target="_blank">
                <img src="@/assets/yt-downloader.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                {{ $t('works.OTHERS.works.0.name') }}
              </p>
              <div class="h-2"></div>
              <p class="text-sm whitespace-pre-line">
                {{ $t('works.OTHERS.works.0.description') }}
                <ul class="list-disc list-inside text-sm">
                  <li>
                    <a href="https://github.com/fent/node-ytdl-core" class="text-blue-500 underline">ytdl-core</a>
                  </li>
                  <li>
                    <a href="https://github.com/ytdl-org/youtube-dl" class="text-blue-500 underline">youtube-dl</a>
                  </li>
                  <li>
                    media operation with <a href="https://ffmpeg.org/" class="text-blue-500 underline">ffmpeg</a>
                  </li>
                  <li>
                    <a href="https://github.com/electron/electron" class="text-blue-500 underline">Electron</a> as platform
                  </li>
                  <li>
                    Vue + Vuetify
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </WindowBox>

      <WindowBox ref="ref_contact" title="📬 Contact" name="contact" :visible="isWindowVisible('contact')"
        @closeWindow="closeWindow" @outside="(name) => closeWindow(name, true)" class="w-[80vw] max-w-[640px]">
        <div class="flex flex-col items-center gap-2 p-8">
          <img src="@/assets/panic_tomato.png" alt="panik_tomato" class="w-16 h-16">
          <div class="h-8"></div>
          <div class="flex flex-col gap-2 text-base items-center">
            {{ $t('contact.description') }}
            <div class="flex items-center gap-2">
              <a href="mailto:7red4.work@gmail.com" class="text-blue-500 underline">7red4.work@gmail.com</a>
              <svg_copy class="w-4 h-4 cursor-pointer" @click="copyEmail" />
            </div>
            <div class="h-5"></div>
            <div>{{ $t('contact.description2') }}</div>
            <div class="flex items-center gap-2">
              <div class="text-[#5765F2] cursor-pointer" @click="copyDiscordID">.7red4</div>
              <svg_copy class="w-4 h-4 cursor-pointer" @click="copyDiscordID" />
            </div>
          </div>
        </div>
      </WindowBox>

      <WindowBox ref="ref_7Red4" title="7Red4" no-close class="w-[80vw] max-w-[720px]" name="7Red4" visible
        @outside="handleMainWindowOutside">
        <div class="relative">
          <img src="@/assets/kyoto_nearby.jpg" alt="" class="w-full">
          <div class="noise_mask absolute inset-0 mix-blend-multiply before:opacity-100 before:mix-blend-overlay" />
          <img src="@/assets/my_signature.png" alt=""
            class="absolute -bottom-5 left-1/2 -translate-x-1/2 w-1/2 pointer-events-none">
        </div>
        <template #extra>
          <div class="flex justify-around">
            <button class="main-btn" @click="openWindowVisible('about')">
              <svg_about />
              About
            </button>
            <button class="main-btn" @click="openWindowVisible('works')">
              <svg_works />
              Works
            </button>
            <button class="main-btn" @click="openWindowVisible('contact')">
              <img src="@/assets/contact.png" alt="contact" class="w-9 h-9">
              Contact
            </button>
          </div>
        </template>
      </WindowBox>

      <transition name="toast-notification">
        <div v-if="isToastVisible" class="toast-notification">
          <div class="toast-content">
            <div class="toast-text">
              {{ toastText }}
            </div>
          </div>
        </div>
      </transition>
    </main>

    
  </div>
</template>

<script setup lang="ts">
import { templateRef, useClipboard } from '@vueuse/core'


import svg_about from '@/assets/about.svg'
import svg_works from '@/assets/works.svg'
import svg_copy from '@/assets/copy.svg'
import WindowBox from '@/components/WindowBox.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const ref_7Red4 = templateRef<InstanceType<typeof WindowBox>>('ref_7Red4');
const ref_about = templateRef<InstanceType<typeof WindowBox>>('ref_about');
const ref_works = templateRef<InstanceType<typeof WindowBox>>('ref_works');
const ref_contact = templateRef<InstanceType<typeof WindowBox>>('ref_contact');

const windowRefMap = new Map();
windowRefMap.set('7Red4', ref_7Red4);
windowRefMap.set('about', ref_about);
windowRefMap.set('works', ref_works);
windowRefMap.set('contact', ref_contact);

const windowZIndexMax = ref(1);
provide('windowZIndexMax', windowZIndexMax);

const windowVisibleMap = ref(new Map<string, boolean>());
const isWindowVisible = (name: string) => {
  return windowVisibleMap.value.get(name) ?? false;
}

const openWindowVisible = (name: string) => {
  windowVisibleMap.value.set(name, true);
  windowRefMap.get(name)?.value?.bringToFront?.();
}

const closeWindow = (name: string, resetPosition = false) => {
  windowVisibleMap.value.set(name, false);
  if (resetPosition) {
    windowRefMap.get(name)?.value?.resetPosition?.();
  }
}

const isMainWindowOutside = ref(false);

const handleMainWindowOutside = () => {
  isMainWindowOutside.value = true;
}

const resetMainWindowPosition = () => {
  ref_7Red4.value?.resetPosition();
  isMainWindowOutside.value = false;
}

const tools = ref([
  {
    name: 'Cursor'
  },
  {
    name: 'Figma'
  },
  {
    name: 'ChatGPT'
  },
  {
    name: 'Browsers of course 😬'
  }
])

const skills = ref([
  {
    name: 'TypeScript'
  },
  {
    name: 'Vue.js'
  },
  {
    name: 'Vuetify'
  },
  {
    name: 'Tailwind CSS'
  },
  {
    name: 'Three.js'
  }
])



const toastDuration = 3000;
const toastTimeout = ref<any>(null);

const isToastVisible = ref(false);
const toastText = ref('');

const { copy } = useClipboard();

const copyEmail = () => {
  copy('7red4.work@gmail.com');
  showToast(t('copied.email'));
}

const copyDiscordID = () => {
  copy('.7red4');
  showToast(t('copied.discord'));
}

const showToast = (text: string) => {
  toastText.value = text;
  isToastVisible.value = true;
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value);
  }
  toastTimeout.value = setTimeout(() => {
    isToastVisible.value = false;
  }, toastDuration);
}
</script>

<style scoped>
.bg_noise {
  background-image: url('@/assets/noise.jpg');
  background-size: 100% 100%;
  background-repeat: repeat;
  opacity: 0.1;
  animation: noise 0.5s steps(2) infinite;
  pointer-events: none;
}

.desktop {
  background-color: #fdffd9;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.section_divider {
  width: 100%;
  height: 1px;
  background-color: #666;
  margin: 1rem 0;
}

.desktop-area {
  flex: 1;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.box {
  border: 1px solid black;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-btn {
  border: 1px solid black;
  padding: 0.5rem 1rem;
  background-color: #F0F0F0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 102px;
}

.main-btn:hover {
  background-color: #e8e8e8;
}

.noise_mask {
  background-size: 300% 300%;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjEiLz48L3N2Zz4=');
  animation: noise 0.5s steps(2) infinite;
}

@keyframes noise {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 120% 120%;
  }
}

.toast-notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-notification-enter-active,
.toast-notification-leave-active {
  transition: opacity 0.5s ease;
}

.toast-notification-enter-from,
.toast-notification-leave-to {
  opacity: 0;
}

.toast-content {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
}

.toast-text {
  font-size: 16px;
  font-weight: bold;
}
</style>
