import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Index.vue'),
    },
    {
      // not found
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/Index.vue'),
    },
  ],
})

export default router
