import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/about2',
      name: 'about2',
      component: () => import('../views/AboutView2.vue')
    },
    {
      path: '/about3',
      name: 'about3',
      component: () => import('../views/AboutView3.vue')
    },
    {
      path: '/about4',
      name: 'about4',
      component: () => import('../views/AboutView4.vue')
    }
  ]
})

export default router
