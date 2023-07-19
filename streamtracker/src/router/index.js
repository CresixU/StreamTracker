import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/streams',
      name: 'streams',
      component: () => import('@/views/StreamsView.vue')
    },
    {
      path: '/stream/:id',
      name: 'stream',
      component: () => import('@/views/StreamView.vue')
    },
    {
      path: '/channel/:userId',
      name: 'channel',
      component: () => import('@/views/ChannelView.vue')
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('@/views/FavouritesView.vue')
    },
    {
      path: '/partners',
      name: 'partners',
      component: () => import('@/views/PartnersView.vue')
    }
  ]
})

export default router
