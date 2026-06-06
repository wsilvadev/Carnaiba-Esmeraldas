<template>
  <AppLayout :show-nav="false">
    <div class="login-wrap">
      <form class="card login-card" @submit.prevent="handleSubmit">
        <h2>Entrar</h2>
        <p class="hint">Acesso restrito a administradores autorizados.</p>

        <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

        <div class="field">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required autocomplete="username" />
        </div>

        <div class="field">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="btn btn-primary full" :disabled="loading">
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { login, authError } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  loading.value = true
  errorMessage.value = ''

  try {
    await login(email.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } catch (err) {
    errorMessage.value = authError.value || err.message || 'Falha no login.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.login-card {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-card h2 {
  margin: 0;
}

.hint {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.full {
  width: 100%;
}
</style>
