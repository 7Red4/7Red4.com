import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import {
  AVAILABLE_YEARS,
  PORTFOLIO_VERSIONS,
  hasPortfolioYear,
  resolvePortfolioYear,
} from '@/views/versions'

// /2025、/2026 ⋯⋯ 每一版都有自己的固定網址
const yearRoutes: RouteRecordRaw[] = AVAILABLE_YEARS.map((year) => ({
  path: `/${year}`,
  name: `portfolio-${year}`,
  component: PORTFOLIO_VERSIONS[year],
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 根路徑直接算出當下該顯示哪一版並就地渲染，不做轉址，
      // 網址維持乾淨的 "/"
      path: '/',
      name: 'portfolio-current',
      component: () => PORTFOLIO_VERSIONS[resolvePortfolioYear()](),
    },
    ...yearRoutes,
    {
      // 2027 版的作品集分頁。目前沒有年份前綴，等 2028 版也有自己的作品集時
      // 這裡會需要改成 /2027/work 之類的命名空間
      path: '/work',
      name: 'work',
      component: () => import('@/views/2027/Work.vue'),
    },
    {
      // 尚未存在的年份（例如 2027 版還沒做）退回根路徑，
      // 由上面的解析邏輯挑出最新一版
      path: '/:year(\\d{4})',
      redirect: '/',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

export { hasPortfolioYear }
export default router
