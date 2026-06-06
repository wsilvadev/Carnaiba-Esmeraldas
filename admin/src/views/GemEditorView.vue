<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <h2>{{ isEdit ? 'Editar pedra' : 'Nova pedra' }}</h2>
        <p v-if="isEdit" class="subtitle">{{ slug }}</p>
      </div>
      <button
        v-if="isEdit && !loadError"
        type="button"
        class="btn btn-danger"
        :disabled="deleting || saving"
        @click="handleDelete"
      >
        {{ deleting ? 'Excluindo…' : 'Excluir publicação' }}
      </button>
    </div>

    <div v-if="loading" class="card">Carregando…</div>
    <template v-else>
    <div v-if="loadError" class="alert alert-error">{{ loadError }}</div>
    <div v-if="saveError" class="alert alert-error">{{ saveError }}</div>

    <GemForm
      v-if="!loadError"
      :initial-gem="gem"
      :default-ordem="defaultOrdem"
      :saving="saving"
      @submit="handleSave"
    />
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import GemForm from '../components/GemForm.vue'
import {
  fetchGem,
  getNextOrdem,
  resolveImageUrl,
  saveGem,
  deleteGem,
} from '../services/gemsAdmin'

const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug)
const isEdit = computed(() => Boolean(slug.value))

const gem = ref(null)
const defaultOrdem = ref(1)
const loading = ref(true)
const loadError = ref('')
const saveError = ref('')
const saving = ref(false)
const deleting = ref(false)

onMounted(async () => {
  try {
    if (isEdit.value) {
      const data = await fetchGem(slug.value)
      if (!data) {
        loadError.value = 'Pedra não encontrada.'
        return
      }

      const imagens = await Promise.all((data.imagens || []).map(async (img) => ({
        ...img,
        previewUrl: await resolveImageUrl(img),
      })))

      gem.value = { ...data, imagens }
    } else {
      defaultOrdem.value = await getNextOrdem()
    }
  } catch (err) {
    loadError.value = err.message || 'Erro ao carregar dados.'
  } finally {
    loading.value = false
  }
})

async function handleSave({ slug: docSlug, data, images }) {
  saving.value = true
  saveError.value = ''

  try {
    await saveGem(docSlug, data, images)
    router.push({ name: 'dashboard' })
  } catch (err) {
    saveError.value = err.message || 'Erro ao salvar. Verifique login e permissões.'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  const name = gem.value?.traducoes?.pt?.nome || slug.value
  const confirmed = window.confirm(
    `Excluir "${name}" permanentemente?\n\nA pedra será removida do catálogo. Esta ação não pode ser desfeita.`,
  )
  if (!confirmed) return

  deleting.value = true
  saveError.value = ''

  try {
    await deleteGem(slug.value)
    router.push({ name: 'dashboard' })
  } catch (err) {
    saveError.value = err.message || 'Erro ao excluir. Verifique login e permissões.'
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}
</style>
