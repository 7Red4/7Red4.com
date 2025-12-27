import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/NewIndex.vue'),
    },
    {
      // Old portfolio (for reference)
      path: '/old',
      component: () => import('@/views/Index.vue'),
    },
    {
      // not found
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NewIndex.vue'),
    },
  ],
})

export default router
