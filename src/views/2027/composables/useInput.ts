import { onBeforeUnmount, onMounted } from 'vue'

export type InputState = {
  /** -1 ~ 1，已正規化的移動方向 */
  x: number
  z: number
  /** 是否奔跑 */
  running: boolean
  /** 讀取後自動清除，避免一次按鍵被消費多次 */
  consumeJump: () => boolean
  setStick: (x: number, z: number) => void
  requestJump: () => void
}

const KEY_MAP: Record<string, [number, number]> = {
  KeyW: [0, -1],
  ArrowUp: [0, -1],
  KeyS: [0, 1],
  ArrowDown: [0, 1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
}

/** 搖桿推超過這個比例就視為奔跑，觸控端不用另外做一顆按鈕 */
const STICK_RUN_THRESHOLD = 0.85

/** 空白鍵有「按下聚焦元件」的既定行為，聚焦在按鈕或連結上時不要搶 */
const isFormControlFocused = () => {
  const active = document.activeElement
  if (!active) return false
  return ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)
}

/**
 * 鍵盤與虛擬搖桿的統一輸入。
 *
 * 刻意不用 reactive：這個值每幀都會被 render loop 讀取，
 * 走 Vue 的響應式系統只是白白增加開銷。
 */
export function useInput(): InputState {
  const pressed = new Set<string>()
  const stick = { x: 0, z: 0 }
  let shiftHeld = false
  let jumpQueued = false

  const state: InputState = {
    x: 0,
    z: 0,
    running: false,
    consumeJump: () => {
      if (!jumpQueued) return false
      jumpQueued = false
      return true
    },
    setStick: (x, z) => {
      stick.x = x
      stick.z = z
      recompute()
    },
    requestJump: () => {
      jumpQueued = true
    },
  }

  const recompute = () => {
    let x = stick.x
    let z = stick.z

    for (const code of pressed) {
      const direction = KEY_MAP[code]
      if (direction) {
        x += direction[0]
        z += direction[1]
      }
    }

    const length = Math.hypot(x, z)
    if (length > 1) {
      x /= length
      z /= length
    }
    state.x = x
    state.z = z

    // 鍵盤靠 Shift，觸控靠把搖桿推到底
    state.running = shiftHeld || Math.hypot(stick.x, stick.z) >= STICK_RUN_THRESHOLD
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      shiftHeld = true
      recompute()
      return
    }

    if (event.code === 'Space') {
      if (isFormControlFocused()) return
      // 不 preventDefault 的話整頁會被空白鍵捲動
      event.preventDefault()
      jumpQueued = true
      return
    }

    if (!(event.code in KEY_MAP)) return
    // 方向鍵預設會捲動頁面
    event.preventDefault()
    pressed.add(event.code)
    recompute()
  }

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      shiftHeld = false
      recompute()
      return
    }
    if (!pressed.delete(event.code)) return
    recompute()
  }

  // 切到別的分頁再回來時按鍵狀態會卡住，這裡整批清掉
  const onBlur = () => {
    pressed.clear()
    shiftHeld = false
    jumpQueued = false
    recompute()
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
  })

  return state
}
