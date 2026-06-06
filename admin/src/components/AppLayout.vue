<template>
  <div class="layout">
    <header class="header">
      <div class="container header-inner">
        <div>
          <p class="eyebrow">Carnaíba Esmeraldas</p>
          <h1>Painel Admin</h1>
        </div>
        <div class="header-actions">
          <span v-if="user" class="user-email">{{ user.email }}</span>
          <RouterLink v-if="showNav" to="/" class="btn btn-secondary">Pedras</RouterLink>
          <RouterLink v-if="showNav" to="/nova" class="btn btn-primary">Nova pedra</RouterLink>
          <button v-if="user" type="button" class="btn btn-secondary" @click="handleLogout">
            Sair
          </button>
        </div>
      </div>
    </header>

    <main class="main container">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

defineProps({
  showNav: { type: Boolean, default: true },
})

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.header h1 {
  margin: 0.15rem 0 0;
  font-size: 1.35rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.user-email {
  font-size: 0.85rem;
  color: var(--muted);
  margin-right: 0.5rem;
}

.main {
  padding-bottom: 3rem;
}
</style>
