<template>
  <div
    v-show="visible"
    class="window"
    :style="{ top: position.y + 'px', left: position.x + 'px', zIndex: zIndex }"
    @mousedown="bringToFront"
  >
    <div class="title-bar" @mousedown.prevent="startDrag">
      <div class="window-controls">
        <button v-if="!noClose" class="btn" @click="emit('closeWindow', name)">×</button>
        <button
          v-if="!noSizeToggle"
          class="btn size-toggle"
          :class="{ 'rotate-180': !isLarge }"
          @click.stop="toggleSize"
          @mousedown.stop
        >
          <svg width="85%" viewBox="0 0 30 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 15.5L15 2L29 15.5" stroke="black" stroke-width="2" />
          </svg>
        </button>
      </div>
      <span class="title-text">{{ title }}</span>
    </div>
    <div class="window-container">
      <div class="window-content" v-show="isLarge">
        <slot />
      </div>
      <div v-if="slots.extra" class="extra-content p-2">
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

type T_Props = {
  title: string;
  name: string;
  position?: {
    x: number,
    y: number
  };
  noClose?: boolean;
  noSizeToggle?: boolean;
  visible?: boolean;
}
const slots = useSlots();

const windowZIndexMax = inject('windowZIndexMax') as Ref<number>;

const props = defineProps<T_Props>();
const emit = defineEmits<{
  (e: 'closeWindow', name: string): void
  (e: 'outside', name: string): void
}>();

watch(() => props.visible, (v) => {
  if (v) {
    isLarge.value = true
  }
})

const position = ref()
const isLarge = ref(true)

if (!props.position) {
  position.value = { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 }
} else {
  position.value = props.position
}

const resetPosition = () => {
  position.value = { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 }
}

const startDrag = (e: MouseEvent) => {
  const startX = e.clientX
  const startY = e.clientY
  const startLeft = position.value?.x
  const startTop = position.value?.y

  const onMouseMove = (e: MouseEvent) => {
    if (!position.value) {
      position.value = {
        x: 0,
        y: 0
      }
    }
    position.value.x = startLeft + e.clientX - startX
    position.value.y = startTop + e.clientY - startY
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    if (isWindowOutside()) {
      emit('outside', props.name)
    }
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const toggleSize = () => {
  isLarge.value = !isLarge.value
}

const zIndex = ref(0);
const bringToFront = () => {
  if (zIndex.value < windowZIndexMax.value) {
    zIndex.value = ++windowZIndexMax.value
  }
  isLarge.value = true
}

watch(() => props.visible, (v) => {
  if (v) {
    bringToFront()
  }
})

const isWindowOutside = () => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const windowX = position.value?.x
  const windowY = position.value?.y

  return windowX < 0 || windowX > windowWidth || windowY < 0 || windowY > windowHeight
}

defineExpose({
  bringToFront,
  resetPosition
})
</script>

<style scoped>
.window {
  position: absolute;
  background-color: #f0f0f0;
  border: 2px solid #333;
  min-width: 280px;
  box-shadow: 4px 4px 0 #888;
  z-index: 100;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.window-container {
  flex: 1;
  overflow-y: auto;
}

.title-bar {
  background: linear-gradient(to bottom, #dcdcdc, #aaa);
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #888;
  cursor: move;
}

.title-text {
  font-size: 16px;
  font-weight: bold;
}

.window-controls {
  display: flex;
  gap: 4px;
}

.btn {
  width: 16px;
  height: 16px;
  font-size: 10px;
  border: 1px solid black;
  cursor: pointer;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

}

.window-content {
  padding: 8px;
  font-size: 10px;
  line-height: 1.5;
  background-color: #fff;
}

.extra-content {
  border-top: 1px solid #888;
}

@media (max-width: 768px) {
  .window {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 50% !important;
    bottom: auto !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;

    height: auto !important;
    max-height: 67vh;
  }

  .size-toggle {
    display: none;
  }
}
</style>
