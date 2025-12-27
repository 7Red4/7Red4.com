import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollProgress() {
  const scrollProgress = ref(0)
  const scrollY = ref(0)

  const updateScroll = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY

    scrollY.value = scrollTop
    scrollProgress.value = scrollTop / (documentHeight - windowHeight)
  }

  onMounted(() => {
    window.addEventListener('scroll', updateScroll)
    updateScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll)
  })

  return {
    scrollProgress,
    scrollY,
  }
}
