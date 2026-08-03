<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import IntroGate from './IntroGate.vue'
import VirtualJoystick from './VirtualJoystick.vue'
import JumpButton from './JumpButton.vue'
import InfoModal from './InfoModal.vue'
import AboutContent from '../content/AboutContent.vue'
import ContactContent from '../content/ContactContent.vue'
import { useInput } from '../composables/useInput'
import { useWorldScene } from '../composables/useWorldScene'
import type { InteractAction } from '../world/scenery'

const { t } = useI18n()
const router = useRouter()

const emit = defineEmits<{ reader: [] }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

/** 開場擋板關掉之前不接受操作 */
const started = ref(false)

/** 開著 modal 的時候要停掉移動，不然關掉會發現自己被搖桿帶跑了 */
const openModal = ref<Exclude<InteractAction, 'works'> | null>(null)
const canMove = computed(() => started.value && openModal.value === null)

const input = useInput()
const { nearby } = useWorldScene(canvasRef, input, canMove)

// 觸控裝置才給搖桿，桌機用 WASD / 方向鍵
const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const ACTION_TITLE = {
  about: 'about.title',
  contact: 'contact.title',
  works: 'works.title',
} as const

const promptLabel = computed(() =>
  nearby.value ? t(ACTION_TITLE[nearby.value.action]) : ''
)

const interact = () => {
  const action = nearby.value?.action
  if (!action) return
  if (action === 'works') {
    router.push('/work')
    return
  }
  openModal.value = action
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.code !== 'KeyE' || !canMove.value) return
  event.preventDefault()
  interact()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))

// 走開的話把面板收起來，避免站在別處還開著上一個地點的內容
watch(nearby, (value) => {
  if (!value) openModal.value = null
})
</script>

<template>
  <div class="stage">
    <canvas ref="canvasRef" class="canvas" />

    <Transition name="hint">
      <button
        v-if="started && nearby && !openModal"
        type="button"
        class="hint"
        @click="interact"
      >
        {{ promptLabel }}
        <span class="key">{{ isTouch ? '點擊查看' : '按 E 查看' }}</span>
      </button>
    </Transition>

    <template v-if="canMove && isTouch">
      <VirtualJoystick @move="input.setStick" />
      <JumpButton @jump="input.requestJump" />
    </template>

    <InfoModal
      v-if="openModal === 'about'"
      :title="t('about.title')"
      @close="openModal = null"
    >
      <AboutContent />
    </InfoModal>

    <InfoModal
      v-if="openModal === 'contact'"
      :title="t('contact.title')"
      @close="openModal = null"
    >
      <ContactContent />
    </InfoModal>

    <IntroGate v-if="!started" @start="started = true" @reader="emit('reader')" />
  </div>
</template>

<style scoped>
.stage {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #dfe3e0;
}

.canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.hint {
  position: fixed;
  left: 50%;
  bottom: max(2.5rem, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  background: rgb(253 250 244 / 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 0.55);
  color: #6b563c;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgb(94 74 52 / 0.14);
}

.hint:hover {
  color: #c4402e;
  border-color: rgb(196 64 46 / 0.4);
}

.key {
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  background: rgb(196 64 46 / 0.12);
  color: #c4402e;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}

.hint-enter-active,
.hint-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

@media (prefers-reduced-motion: reduce) {
  .hint-enter-active,
  .hint-leave-active {
    transition: none;
  }
}
</style>
