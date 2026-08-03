import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh-tw'
import { DAYJS_LOCALE, type SupportedLanguage } from './useLanguage'

/** menu bar 上的時間顯示。星期會跟著語系走。 */
export function useClock(language: Ref<SupportedLanguage>) {
  const time = ref('')
  const date = ref('')
  const day = ref('')
  const year = ref(dayjs().year())

  const update = () => {
    const now = dayjs()
    time.value = now.format('HH:mm')
    date.value = now.format('MM/DD')
    day.value = now.locale(DAYJS_LOCALE[language.value]).format('ddd')
    year.value = now.year()
  }

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    update()
    timer = setInterval(update, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  watch(language, update)

  return { time, date, day, year }
}
