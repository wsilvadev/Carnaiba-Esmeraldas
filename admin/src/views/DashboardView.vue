<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <h2>Pedras cadastradas</h2>
        <p class="subtitle">{{ gems.length }} no Firestore</p>
      </div>
      <RouterLink to="/nova" class="btn btn-primary">+ Nova pedra</RouterLink>
    </div>

    <div v-if="loading" class="card">Carregando…</div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <div v-else-if="!gems.length" class="card empty">
      <p>Nenhuma pedra no Firestore ainda.</p>
      <RouterLink to="/nova" class="btn btn-primary">Cadastrar primeira pedra</RouterLink>
    </div>

    <div v-else class="gems-list">
      <article v-for="gem in gems" :key="gem.slug" class="card gem-row">
        <div class="thumb" :style="thumbStyle(gem)" />

        <div class="gem-info">
          <div class="gem-title">
            <h3>{{ gem.traducoes?.pt?.nome || gem.slug }}</h3>
            <span :class="['badge', gem.disponivel ? 'available' : 'sold']">
              {{ gem.disponivel ? 'Disponível' : 'Vendida' }}
            </span>
          </div>
          <p class="meta">
            {{ gem.slug }} · {{ gem.categoria }} · {{ gem.peso }}ct
            <template v-if="gem.precoBRL"> · R$ {{ formatBRL(gem.precoBRL) }}</template>
          </p>
          <p v-if="gem.videos?.length" class="meta">{{ gem.videos.length }} vídeo(s)</p>
        </div>

        <div class="gem-actions">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="toggling === gem.slug || deleting === gem.slug"
            @click="toggleStatus(gem)"
          >
            {{ gem.disponivel ? 'Marcar vendida' : 'Marcar disponível' }}
          </button>
          <RouterLink :to="`/editar/${gem.slug}`" class="btn btn-primary">Editar</RouterLink>
          <button
            type="button"
            class="btn btn-danger"
            :disabled="deleting === gem.slug"
            @click="confirmDelete(gem)"
          >
            {{ deleting === gem.slug ? 'Excluindo…' : 'Excluir' }}
          </button>
        </div>
      </article>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { fetchAllGems, resolveImageUrl, toggleDisponivel, deleteGem } from '../services/gemsAdmin'

const gems = ref([])
const loading = ref(true)
const error = ref('')
const toggling = ref('')
const deleting = ref('')
const thumbUrls = ref({})

onMounted(loadGems)

async function loadGems() {
  loading.value = true
  error.value = ''

  try {
    gems.value = await fetchAllGems()
    await loadThumbs()
  } catch (err) {
    error.value = err.message || 'Erro ao carregar pedras.'
  } finally {
    loading.value = false
  }
}

async function loadThumbs() {
  const urls = {}

  await Promise.all(gems.value.map(async (gem) => {
    const first = gem.imagens?.[0]
    if (!first) return
    urls[gem.slug] = await resolveImageUrl(first)
  }))

  thumbUrls.value = urls
}

function thumbStyle(gem) {
  const url = thumbUrls.value[gem.slug]
  if (url) {
    return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return { background: gem.gradiente || 'linear-gradient(135deg, #1a4a2e, #2d7a4f)' }
}

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR')
}

async function toggleStatus(gem) {
  toggling.value = gem.slug
  try {
    await toggleDisponivel(gem.slug, !gem.disponivel)
    gem.disponivel = !gem.disponivel
  } catch (err) {
    error.value = err.message || 'Erro ao atualizar status.'
  } finally {
    toggling.value = ''
  }
}

async function confirmDelete(gem) {
  const name = gem.traducoes?.pt?.nome || gem.slug
  const confirmed = window.confirm(
    `Excluir "${name}" permanentemente?\n\nA pedra será removida do catálogo. Esta ação não pode ser desfeita.`,
  )
  if (!confirmed) return

  deleting.value = gem.slug
  error.value = ''

  try {
    await deleteGem(gem.slug)
    gems.value = gems.value.filter((g) => g.slug !== gem.slug)
    const { [gem.slug]: _, ...rest } = thumbUrls.value
    thumbUrls.value = rest
  } catch (err) {
    error.value = err.message || 'Erro ao excluir pedra.'
  } finally {
    deleting.value = ''
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
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

.empty {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.gems-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gem-row {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 1rem;
  align-items: center;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.gem-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.gem-info h3 {
  margin: 0;
  font-size: 1rem;
}

.meta {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge.available {
  background: rgba(61, 155, 106, 0.2);
  color: #8fd4a8;
}

.badge.sold {
  background: rgba(196, 92, 92, 0.2);
  color: #f0b0b0;
}

.gem-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .gem-row {
    grid-template-columns: 72px 1fr;
  }

  .gem-actions {
    grid-column: 1 / -1;
  }
}
</style>
