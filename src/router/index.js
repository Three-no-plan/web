import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ordinals from '@/views/ordinals.vue'
import wallet from '@/views/wallet.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ordinals',
    name: 'ordinals',
    component: ordinals
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: wallet
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router