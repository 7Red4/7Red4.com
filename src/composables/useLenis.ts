import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import Lenis from 'lenis'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useLenis() {
  // 原本用 let 綁定，賦值發生在 onMounted 之後，
  // 呼叫端 return 拿到的永遠是 null
  const lenis = shallowRef<Lenis | null>(null)
  let rafId: number | null = null

  onMounted(() => {
    // reduced-motion 下不接管滾動，交還瀏覽器原生行為
    if (prefersReducedMotion()) return

    lenis.value = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    const raf = (time: number) => {
      lenis.value?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  })

  onBeforeUnmount(() => {
    // 原本沒有保存 id 也沒有 cancel，destroy 之後迴圈仍在跑，換頁就多累積一條
    if (rafId !== null) cancelAnimationFrame(rafId)
    rafId = null
    lenis.value?.destroy()
    lenis.value = null
  })

  return { lenis }
}
