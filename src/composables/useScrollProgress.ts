import { onBeforeUnmount, onMounted, ref, type ShallowRef } from 'vue'
import type Lenis from 'lenis'

/**
 * 捲動進度。
 *
 * 有 Lenis 時直接接它的 scroll 事件：Lenis 在自己的 rAF 內設定完捲動位置後才派發，
 * 拿到的值對當幀是最新的。改用原生 scroll 事件 + rAF 節流量測會慢一到兩幀，
 * 捲動中就會看到畫面抖動（位置先停住再補跳）。
 */
export function useScrollProgress(lenis?: ShallowRef<Lenis | null>) {
  const scrollProgress = ref(0)
  const scrollY = ref(0)

  const measureNative = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    scrollY.value = window.scrollY
    // 內容不滿一頁時 scrollable 為 0，直接相除會得到 NaN/Infinity，
    // 並汙染所有以此驅動的 transform
    scrollProgress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
  }

  let detach: (() => void) | null = null

  onMounted(() => {
    const instance = lenis?.value

    if (instance) {
      const onLenisScroll = () => {
        scrollY.value = instance.scroll
        const progress = instance.progress
        scrollProgress.value = Number.isFinite(progress)
          ? Math.min(1, Math.max(0, progress))
          : 0
      }
      instance.on('scroll', onLenisScroll)
      onLenisScroll()
      detach = () => instance.off('scroll', onLenisScroll)
      return
    }

    // reduced-motion 下 Lenis 不啟用，退回原生捲動
    window.addEventListener('scroll', measureNative, { passive: true })
    window.addEventListener('resize', measureNative, { passive: true })
    measureNative()
    detach = () => {
      window.removeEventListener('scroll', measureNative)
      window.removeEventListener('resize', measureNative)
    }
  })

  onBeforeUnmount(() => {
    detach?.()
    detach = null
  })

  return { scrollProgress, scrollY }
}
