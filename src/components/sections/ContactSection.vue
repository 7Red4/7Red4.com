<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import WireframePhone from '@/components/three/WireframePhone.vue'

const { t } = useI18n()

interface Props {
  scrollProgress: number
}

const props = defineProps<Props>()

const email = '7red4.work@gmail.com'
const discord = '.7red4'

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // TODO: 添加複製成功提示
}

// 計算這個 section 的局部進度 (80% - 100%)
const sectionProgress = computed(() => {
  const start = 0.8
  const end = 1.0
  return Math.max(0, Math.min(1, (props.scrollProgress - start) / (end - start)))
})
</script>

<template>
  <section class="contact-section relative min-h-screen w-full py-20">
    <!-- 3D 電話聽筒背景 -->
    <div class="absolute inset-0 z-0 opacity-20">
      <WireframePhone :scrollProgress="props.scrollProgress" />
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h2 class="text-4xl md:text-6xl font-bold text-neon-cyan mb-16">
          {{ t('contact.title') }}
        </h2>

        <!-- 終端機風格的聯絡資訊 -->
        <div class="terminal-container bg-black/80 border-2 border-neon-green p-8 rounded-lg max-w-2xl w-full">
          <div class="terminal-header mb-6">
            <span class="text-neon-green font-mono">root@7red4:~$</span>
          </div>

          <div class="space-y-4 font-mono">
            <!-- Email -->
            <div class="flex items-center justify-between">
              <span class="text-neon-green">> email:</span>
              <button @click="copyToClipboard(email)" class="text-gray-300 hover:text-neon-cyan transition-colors">
                {{ email }}
              </button>
            </div>

            <!-- Discord -->
            <div class="flex items-center justify-between">
              <span class="text-neon-green">> discord:</span>
              <button @click="copyToClipboard(discord)" class="text-gray-300 hover:text-neon-cyan transition-colors">
                {{ discord }}
              </button>
            </div>

            <!-- GitHub -->
            <div class="flex items-center justify-between">
              <span class="text-neon-green">> github:</span>
              <a href="https://github.com/7Red4" target="_blank"
                class="text-gray-300 hover:text-neon-cyan transition-colors">
                github.com/7Red4
              </a>
            </div>
          </div>

          <div class="terminal-cursor mt-6">
            <span class="text-neon-green font-mono animate-pulse">▊</span>
          </div>
        </div>

        <!-- 3D 終端機模型會在這裡 -->
        <div class="mt-12">
          <canvas ref="terminalCanvasRef" class="w-full h-64"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-neon-cyan {
  color: #00FFFF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.text-neon-green {
  color: #39FF14;
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
}

.border-neon-green {
  border-color: #39FF14;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.6);
}

.terminal-container {
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
}
</style>
