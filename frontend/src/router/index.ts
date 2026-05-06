import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'while1cry' },
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('@/pages/WorksPage.vue'),
    meta: { title: '作品集 - while1cry' },
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/pages/GalleryPage.vue'),
    meta: { title: '画廊 - while1cry' },
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: () => import('@/pages/PlaylistPage.vue'),
    meta: { title: '精选歌单 - while1cry' },
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/pages/LinksPage.vue'),
    meta: { title: '社交链接 - while1cry' },
  },
  {
    path: '/secret',
    name: 'secret',
    component: () => import('@/pages/SecretPage.vue'),
    meta: { title: '✦ - while1cry' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'while1cry'
})

export default router
