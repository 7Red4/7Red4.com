import { onBeforeUnmount, watch, type Ref } from 'vue'

/**
 * 開啟時監聽 document 的點擊，點在指定元素之外就呼叫 onOutside。
 * 監聽器只在開啟期間存在，關閉與卸載時都會移除。
 */
export function useClickOutside(
  active: Ref<boolean>,
  elements: Ref<HTMLElement | null>[],
  onOutside: () => void
) {
  const handle = (event: MouseEvent) => {
    const target = event.target as Node
    const inside = elements.some((element) => element.value?.contains(target))
    if (!inside) onOutside()
  }

  const detach = () => document.removeEventListener('click', handle)

  watch(active, (isActive) => {
    if (isActive) {
      // 延到下一個事件循環再掛，否則觸發開啟的那一次點擊會立刻把它關掉
      setTimeout(() => document.addEventListener('click', handle), 0)
    } else {
      detach()
    }
  })

  onBeforeUnmount(detach)
}
