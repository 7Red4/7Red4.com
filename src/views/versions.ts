/**
 * 作品集的年份版本。
 *
 * 每一版都是當年設計的快照，做完就凍結，不再回頭改。
 * 新增一版只要建 `src/views/<年份>/Index.vue` 再往下面登記一筆即可，
 * 路由與首頁的解析都會自動跟上。
 */
export const PORTFOLIO_VERSIONS: Record<number, () => Promise<unknown>> = {
  2025: () => import('@/views/2025/Index.vue'),
  2026: () => import('@/views/2026/Index.vue'),
}

/** 由小到大 */
export const AVAILABLE_YEARS = Object.keys(PORTFOLIO_VERSIONS)
  .map(Number)
  .sort((a, b) => a - b)

export const LATEST_YEAR = AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]

/**
 * 決定根路徑要顯示哪一版：當年度的版本若已存在就用它，
 * 否則往回退到「不超過當年度」的最新一版。
 *
 * 例如 2027 年時若 2027 版還沒做完，就會落回 2026 版。
 */
export const resolvePortfolioYear = (
  now: number = new Date().getFullYear()
): number => {
  const released = AVAILABLE_YEARS.filter((year) => year <= now)
  // 全部都比今年新（理論上不該發生）時退回最舊的一版，避免回傳 undefined
  return released.length > 0 ? released[released.length - 1] : AVAILABLE_YEARS[0]
}

export const hasPortfolioYear = (year: number) => year in PORTFOLIO_VERSIONS
