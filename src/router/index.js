import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GemDetailView from '../views/GemDetailView.vue'
import StockView from '../views/StockView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/estoque', name: 'stock', component: StockView },
    { path: '/esmeralda/:slug', name: 'gem', component: GemDetailView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
