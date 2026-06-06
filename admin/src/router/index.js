import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/nova',
    name: 'gem-new',
    component: () => import('../views/GemEditorView.vue'),
  },
  {
    path: '/editar/:slug',
    name: 'gem-edit',
    component: () => import('../views/GemEditorView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const { initAuth, isAuthenticated } = useAuth()
  await initAuth()

  if (to.meta.public) {
    if (isAuthenticated.value && to.name === 'login') return { name: 'dashboard' }
    return true
  }

  if (!isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
