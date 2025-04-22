<template>
  <div class="desktop">
    <div class="bg_noise absolute inset-0" />
    <header class="menu-bar z-[9999]">
      <div class="flex items-center gap-2">

        <img @mouseenter="isTomatoFilled = true" @mouseleave="isTomatoFilled = false"
          :src="isTomatoFilled ? img_tomato_filled : img_tomato" alt="tomato" class="w-6 h-6 cursor-pointer">

        <span class="text-sm font-bold">7Red4 Portfolio</span>
      </div>
      <div class="right-menu text-xs">
        {{ time }}
        <div class="divider" /> {{ date }}
      </div>
    </header>

    <main class="desktop-area">
      <div v-if="isMainWindowOutside" class="absolute z-[99999] flex justify-center items-center w-full h-full">
        <button class="main-btn" @click="resetMainWindowPosition">
          Bring my window back😱
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
                <span class="text-2xl font-bold">Ryan Lee</span>
                <div class="w-2 inline-block" />
                <span class="text-xl text-red-400">
                  李閎仕 <span class="text-sm">(紅柿)</span>
                </span>
              </div>
              <div>
                <p>Web Developer</p>
              </div>
            </div>
          </div>

          <div class="h-6" />
          <div class="flex flex-col gap-2 text-base">
            <p>Hi! I'm Ryan, a web developer from Taiwan.</p>
            <p>What I do:</p>
            <ul class="list-disc list-inside">
              <li>
                Web with fancy effects
              </li>
              <li>
                Some Web AR 3D projects
              </li>
              <li>
                Simple Web Games
              </li>
              <li>
                Most kind of web apps
              </li>
            </ul>
          </div>
          <div class="h-3"></div>
          <div class="text-base">
            Feel free to contact me if you have something want to work on with me.
            Sent me an email <a href="mailto:7red4.work@gmail.com"
              class="text-blue-500 underline">7red4.work@gmail.com</a>
          </div>
          <div class="h-3"></div>
          <h3 class="text-lg font-bold">Languages</h3>
          <ul class="list-disc list-inside text-base">
            <li>
              Mandarin/中文 (Native)
            </li>
            <li>
              English (Fluent I guess 😝)
            </li>
            <li>
              Japanese/日本語 (Basic to intermediate)
            </li>
          </ul>
          <div class="h-3"></div>
          <h3 class="text-lg font-bold">Other Interests</h3>
          <ul class="list-disc list-inside text-base">
            <li>
              🎮 Games
            </li>
            <li>
              🎞️ Anime
            </li>
            <li>
              🎵 Music & Instruments
            </li>
            <li>
              ✈️ Traveling (mostly in Japan)
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

          <h1 class="text-2xl font-bold">☆ CSS + JS Animation</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://daxidaxi-online.tw/wish" target="_blank">
                <img
                  src="https://img.cake.me/cdn-cgi/image/fit=scale-down,format=auto,w=1920/https://images.cakeresume.com/4axp80/7red4/f3cb80c2-6830-4094-a4a8-f81612a5ad8a.png"
                  alt="">
              </a>
              <div class="h-3"></div>

              <p class="text-lg font-bold">
                Daxi Online
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                All Animation is done by CSS and Vanilla JS
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
                Tsai Yi Tech. official website
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                Build the whole website. <br>
                CSS Animation. <br>
                Pre-render with for SEO.
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ Site Refactor</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="http://giloo.ist/" target="_blank">
                <img
                  src="https://img.cake.me/cdn-cgi/image/fit=scale-down,format=auto,w=1920/https://images.cakeresume.com/4axp80/7red4/5191c047-f8a6-42fb-bde2-c6c086adc475.png"
                  alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                Giloo.ist
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                Refactor the whole website. For theme system and component management. And import
                <span class="text-blue-400">Vuetify</span>. <br>
                Built by <span class="text-green-500">Nuxt</span>.
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ Web AR</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/VPS_testing/" target="_blank">
                <img src="@/assets/AR Filter.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                AR face filter
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                A web-based AR application that can track faces and detect human bodies for automatic background removal. Additionally, it allows users to generate photos or GIFs and edit them by adding stickers. <br>
                included libraries:
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
                AR location demo
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                This is a simple demo project that allows you to explore the location of a point on the map by using web AR. Get all stamps from marks and get a reward.
                Core library using <a href="https://github.com/AR-js-org/locar.js" class="text-blue-500 underline">LocAR.js</a>.
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ Mini Web Games</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/PChome_shopping_festival-reupload-/" target="_blank">
                <img src="@/assets/PC Home V1111P pinball.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                PC Home V1111P pinball
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                An event page for PC Home V1111P pinball game.
                using <a href="https://brm.io/matter-js/" class="text-[#F55F5F] underline">matter.js</a>
              </p>
            </div>

            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/PChome_shopping_festival-reupload-/" target="_blank">
                <img src="@/assets/PC Home V1111P rhythm game.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                PC Home V1111P rhythm game
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                A rhythm game for PC Home V1111P. <br>
                created by only DOM, JS and CSS.
              </p>
            </div>
          </div>

          <div class="section_divider"></div>

          <h1 class="text-2xl font-bold">☆ Others</h1>
          <div class="flex flex-wrap -mx-2">
            <div class="w-full sm:w-1/2 p-2">
              <a class="box" href="https://github.com/7Red4/ytDownloader/" target="_blank">
                <img src="@/assets/yt-downloader.png" alt="">
              </a>
              <div class="h-3"></div>
              <p class="text-lg font-bold">
                YT Downloader Desktop App
              </p>
              <div class="h-2"></div>
              <p class="text-sm">
                A desktop app that allows you to download videos from YouTube.
                using:
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
            Contact me via email:
            <div class="flex items-center gap-2">
              <a href="mailto:7red4.work@gmail.com" class="text-blue-500 underline">7red4.work@gmail.com</a>
              <svg_copy class="w-4 h-4 cursor-pointer" @click="copyEmail" />
            </div>
            <div class="h-5"></div>
            <div>or maybe you want to DM me by Discord:</div>
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

    <footer class="absolute bottom-0 left-0 w-full h-10 flex justify-center items-center">
      <p class="text-xs flex items-center gap-2">
        © 2025 7Red4 <a href="https://github.com/7Red4" target="_blank" class="inline-block">
          <svg_github class="w-6 h-6" />
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

import img_tomato from '@/assets/tomato.png'
import img_tomato_filled from '@/assets/tomato_filled.png'
import svg_about from '@/assets/about.svg'
import svg_works from '@/assets/works.svg'
import svg_copy from '@/assets/copy.svg'
import svg_github from '@/assets/github.svg'
import WindowBox from './components/WindowBox.vue'
import dayjs from 'dayjs'

const isTomatoFilled = ref(false);


const ref_7Red4 = ref<InstanceType<typeof WindowBox>>();
const ref_about = ref<InstanceType<typeof WindowBox>>();
const ref_works = ref<InstanceType<typeof WindowBox>>();
const ref_contact = ref<InstanceType<typeof WindowBox>>();

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


const time = ref(dayjs().format('HH:mm:ss'));
const date = ref(dayjs().format('YYYY/MM/DD'));

setInterval(() => {
  time.value = dayjs().format('HH:mm:ss');
  date.value = dayjs().format('YYYY/MM/DD');
}, 1000);

const toastDuration = 3000;
const toastTimeout = ref<any>(null);

const isToastVisible = ref(false);
const toastText = ref('');

const { copy } = useClipboard();

const copyEmail = () => {
  copy('7red4.work@gmail.com');
  showToast('Email copied to clipboard');
}

const copyDiscordID = () => {
  copy('.7red4');
  showToast('Discord ID copied to clipboard');
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
@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

.desktop {
  font-family: 'DotGothic16', sans-serif;
  background-color: #fdffd9;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  letter-spacing: 0.08em;
}

.bg_noise {
  background-image: url('@/assets/noise.jpg');
  background-size: 100% 100%;
  background-repeat: repeat;
  opacity: 0.1;
  animation: noise 0.5s steps(2) infinite;
}

.menu-bar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #666;
  background-color: #fdffd9;
}

.right-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.divider {
  width: 1px;
  align-self: stretch;
  background-color: #666;
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
