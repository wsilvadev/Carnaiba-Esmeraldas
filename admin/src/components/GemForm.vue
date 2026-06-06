<template>
  <form class="gem-form" @submit.prevent="handleSubmit">
    <section class="card section">
      <h3>Dados da pedra</h3>
      <div class="grid-2">
        <div class="field">
          <label for="nome">Nome (PT) *</label>
          <input id="nome" v-model="form.traducoes.pt.nome" required />
        </div>
        <div class="field">
          <label for="slug">Slug (URL)</label>
          <input id="slug" v-model="form.slug" required :readonly="isEdit" />
        </div>
        <div class="field">
          <label for="categoria">Categoria</label>
          <select id="categoria" v-model="form.categoria">
            <option value="bruta">Bruta</option>
            <option value="lapidada">Lapidada</option>
          </select>
        </div>
        <div class="field">
          <label for="peso">Quilates (ct) *</label>
          <input id="peso" v-model.number="form.peso" type="number" step="0.01" min="0" required />
          <p v-if="form.peso > 0" class="hint">
            ≈ {{ (form.peso * 0.2).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) }} g de massa (1 ct = 0,2 g)
          </p>
        </div>
        <div class="field">
          <label for="preco">Preço (BRL)</label>
          <input id="preco" v-model.number="form.precoBRL" type="number" min="0" placeholder="Opcional" />
        </div>
        <div class="field">
          <label for="ordem">Ordem</label>
          <input id="ordem" v-model.number="form.ordem" type="number" min="1" required />
        </div>
        <div class="field">
          <label for="dimensoes">Dimensões</label>
          <input id="dimensoes" v-model="form.dimensoes" placeholder="14 × 10 × 8 mm" />
        </div>
        <div class="field">
          <label for="formato">Formato</label>
          <input id="formato" v-model="form.formato" placeholder="bruta, oval, redondo…" />
        </div>
      </div>

      <label class="checkbox">
        <input v-model="form.disponivel" type="checkbox" />
        Disponível para venda
      </label>
    </section>

    <section class="card section">
      <h3>Descrição (português)</h3>
      <p class="hint">
        Nome, tipo, cor, claridade e descrição em português são traduzidos automaticamente para os idiomas opcionais.
      </p>
      <div class="grid-2">
        <div class="field">
          <label>Tipo</label>
          <input v-model="form.traducoes.pt.tipo" placeholder="Bruta, Lapidada…" />
        </div>
        <div class="field">
          <label>Cor</label>
          <input v-model="form.traducoes.pt.cor" placeholder="Verde Intenso" />
        </div>
        <div class="field">
          <label>Claridade</label>
          <input v-model="form.traducoes.pt.claridade" placeholder="Alta" />
        </div>
      </div>
      <div class="field">
        <label>Descrição completa</label>
        <textarea v-model="form.traducoes.pt.desc" rows="4" />
      </div>
    </section>

    <section class="card section">
      <div class="section-head">
        <h3>Traduções (opcional)</h3>
        <div class="section-head-actions">
          <span v-if="translating" class="translate-status">Traduzindo…</span>
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="translating"
            @click="syncTranslations(true)"
          >
            Retraduzir tudo
          </button>
          <button type="button" class="btn btn-secondary" @click="showTranslations = !showTranslations">
            {{ showTranslations ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
      </div>

      <p v-if="translationMessage" class="hint">{{ translationMessage }}</p>

      <div v-if="showTranslations" class="translations">
        <div v-for="locale in optionalLocales" :key="locale" class="translation-block">
          <h4>{{ localeLabels[locale] }}</h4>
          <div class="grid-2">
            <div class="field">
              <label>Nome</label>
              <input v-model="form.traducoes[locale].nome" />
            </div>
            <div class="field">
              <label>Tipo</label>
              <input v-model="form.traducoes[locale].tipo" />
            </div>
            <div class="field">
              <label>Cor</label>
              <input v-model="form.traducoes[locale].cor" />
            </div>
            <div class="field">
              <label>Claridade</label>
              <input v-model="form.traducoes[locale].claridade" />
            </div>
          </div>
          <div class="field">
            <label>Descrição</label>
            <textarea v-model="form.traducoes[locale].desc" rows="3" />
          </div>
        </div>
      </div>
    </section>

    <section class="card section">
      <div class="section-head">
        <h3>Fotos</h3>
        <button type="button" class="btn btn-secondary" @click="addImage">+ Adicionar foto</button>
      </div>

      <p v-if="!images.length" class="hint">Adicione ao menos uma foto principal (enviada ao Cloudinary).</p>

      <div class="images-grid">
        <div v-for="(img, index) in images" :key="img.key" class="image-item card">
          <div class="preview" :style="previewStyle(img)" />

          <div class="field">
            <label>Identificador</label>
            <input v-model="img.id" placeholder="main, side, light…" />
          </div>

          <div class="field">
            <label>Arquivo</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" @change="onFileChange(index, $event)" />
          </div>

          <button type="button" class="btn btn-danger" @click="removeImage(index)">Remover</button>
        </div>
      </div>
    </section>

    <section class="card section">
      <div class="section-head">
        <h3>Vídeos (YouTube)</h3>
        <button type="button" class="btn btn-secondary" @click="addVideo">+ Adicionar vídeo</button>
      </div>

      <p class="hint">Cole o link do YouTube (vídeo não listado). Ex.: https://youtu.be/abc123</p>

      <div v-for="(video, index) in form.videos" :key="index" class="video-row">
        <div class="field">
          <label>Link ou ID do YouTube</label>
          <input v-model="video.url" placeholder="https://youtu.be/…" @input="syncVideoId(index)" />
        </div>
        <div class="field">
          <label>Título</label>
          <input v-model="video.title" placeholder="Pedra na luz natural" />
        </div>
        <button type="button" class="btn btn-danger" @click="removeVideo(index)">Remover</button>
      </div>
    </section>

    <div v-if="message" :class="['alert', messageType === 'error' ? 'alert-error' : 'alert-success']">
      {{ message }}
    </div>

    <div class="form-actions">
      <RouterLink to="/" class="btn btn-secondary">Cancelar</RouterLink>
      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Salvando…' : (isEdit ? 'Salvar alterações' : 'Publicar pedra') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { extractYoutubeId } from '../utils/youtube'
import { buildSlug, DEFAULT_GRADIENT } from '../services/gemsAdmin'
import { translatePtFields } from '../services/translate'

const props = defineProps({
  initialGem: { type: Object, default: null },
  defaultOrdem: { type: Number, default: 1 },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const isEdit = computed(() => Boolean(props.initialGem))
const showTranslations = ref(false)
const message = ref('')
const messageType = ref('success')
const translating = ref(false)
const translationMessage = ref('')
const lastAutoTranslation = ref({})
const skipAutoTranslate = ref(false)

const localeLabels = {
  en: 'Inglês',
  es: 'Espanhol',
  fr: 'Francês',
  de: 'Alemão',
  hi: 'Hindi',
}

const optionalLocales = ['en', 'es', 'fr', 'de', 'hi']
const translatableFields = ['nome', 'tipo', 'cor', 'claridade', 'desc']

function debounce(fn, delay) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function snapshotPtFields() {
  return translatableFields.reduce((acc, field) => {
    acc[field] = form.traducoes.pt[field] || ''
    return acc
  }, {})
}

function hasPtContent() {
  return translatableFields.some((field) => form.traducoes.pt[field]?.trim())
}

async function syncTranslations(force = false) {
  if (skipAutoTranslate.value || !hasPtContent()) return

  translating.value = true
  translationMessage.value = ''

  try {
    const translated = await translatePtFields(snapshotPtFields(), optionalLocales)

    for (const locale of optionalLocales) {
      for (const field of translatableFields) {
        const nextValue = translated[locale]?.[field] || ''
        const currentValue = form.traducoes[locale][field] || ''
        const previousAuto = lastAutoTranslation.value[locale]?.[field] || ''
        const canOverwrite = force || !currentValue.trim() || currentValue === previousAuto

        if (!canOverwrite) continue

        form.traducoes[locale][field] = nextValue
        if (!lastAutoTranslation.value[locale]) lastAutoTranslation.value[locale] = {}
        lastAutoTranslation.value[locale][field] = nextValue
      }
    }

    showTranslations.value = true
    translationMessage.value = force
      ? 'Traduções atualizadas em todos os idiomas.'
      : 'Traduções geradas automaticamente a partir do português.'
  } catch (err) {
    translationMessage.value = err.message || 'Erro ao traduzir automaticamente.'
  } finally {
    translating.value = false
  }
}

const scheduleAutoTranslate = debounce(() => {
  syncTranslations(false)
}, 1400)

function emptyTraducao() {
  return { nome: '', tipo: '', cor: '', claridade: '', desc: '' }
}

function emptyTraducoes() {
  return {
    pt: emptyTraducao(),
    en: emptyTraducao(),
    es: emptyTraducao(),
    fr: emptyTraducao(),
    de: emptyTraducao(),
    hi: emptyTraducao(),
  }
}

const form = reactive({
  slug: '',
  ordem: props.defaultOrdem,
  categoria: 'bruta',
  peso: 0,
  precoBRL: null,
  disponivel: true,
  dimensoes: '',
  formato: 'bruta',
  tratamento: 'nenhum',
  certificacao: 'cooperativa',
  gradiente: DEFAULT_GRADIENT,
  traducoes: emptyTraducoes(),
  videos: [],
})

const images = ref([])
let imageKey = 0

function addImage(existing = null) {
  images.value.push({
    key: ++imageKey,
    id: existing?.id || (images.value.length === 0 ? 'main' : `img-${images.value.length + 1}`),
    file: null,
    url: existing?.url || '',
    publicId: existing?.publicId || '',
    storagePath: existing?.storagePath || '',
    gradiente: existing?.gradiente || DEFAULT_GRADIENT,
    previewUrl: existing?.previewUrl || '',
  })
}

function removeImage(index) {
  const [removed] = images.value.splice(index, 1)
  if (removed?.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(removed.previewUrl)
  }
}

function onFileChange(index, event) {
  const file = event.target.files?.[0]
  if (!file) return

  const img = images.value[index]
  if (img.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(img.previewUrl)
  }

  img.file = file
  img.previewUrl = URL.createObjectURL(file)
}

function previewStyle(img) {
  if (img.previewUrl) {
    return {
      backgroundImage: `url(${img.previewUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { background: img.gradiente || DEFAULT_GRADIENT }
}

function addVideo() {
  form.videos.push({ url: '', youtubeId: '', title: '' })
}

function removeVideo(index) {
  form.videos.splice(index, 1)
}

function syncVideoId(index) {
  const video = form.videos[index]
  video.youtubeId = extractYoutubeId(video.url)
}

watch(
  () => props.initialGem,
  (gem) => {
    if (!gem) return

    skipAutoTranslate.value = true
    lastAutoTranslation.value = {}

    Object.assign(form, {
      slug: gem.slug,
      ordem: gem.ordem || gem.id || 1,
      categoria: gem.categoria || 'bruta',
      peso: gem.peso || 0,
      precoBRL: gem.precoBRL ?? null,
      disponivel: gem.disponivel !== false,
      dimensoes: gem.dimensoes || '',
      formato: gem.formato || 'bruta',
      tratamento: gem.tratamento || 'nenhum',
      certificacao: gem.certificacao || 'cooperativa',
      gradiente: gem.gradiente || DEFAULT_GRADIENT,
      traducoes: { ...emptyTraducoes(), ...gem.traducoes },
      videos: (gem.videos || []).map((v) => ({
        url: v.youtubeId ? `https://youtu.be/${v.youtubeId}` : '',
        youtubeId: v.youtubeId || '',
        title: v.title || '',
      })),
    })

    images.value = []
    for (const img of gem.imagens || []) {
      addImage({ ...img, previewUrl: img.previewUrl || '' })
    }

    queueMicrotask(() => {
      skipAutoTranslate.value = false
    })
  },
  { immediate: true },
)

watch(
  () => translatableFields.map((field) => form.traducoes.pt[field] || '').join('\u0000'),
  () => {
    if (skipAutoTranslate.value) return
    scheduleAutoTranslate()
  },
)

watch(
  () => form.traducoes.pt.nome,
  (nome) => {
    if (!isEdit.value && nome) {
      form.slug = buildSlug(nome, form.ordem)
    }
  },
)

watch(
  () => props.defaultOrdem,
  (ordem) => {
    if (!isEdit.value) form.ordem = ordem
  },
)

function handleSubmit() {
  message.value = ''

  if (!form.traducoes.pt.nome.trim()) {
    message.value = 'Informe o nome em português.'
    messageType.value = 'error'
    return
  }

  if (!images.value.length) {
    message.value = 'Adicione ao menos uma foto.'
    messageType.value = 'error'
    return
  }

  const videos = form.videos
    .map((v) => ({
      youtubeId: extractYoutubeId(v.url || v.youtubeId),
      title: v.title?.trim() || '',
    }))
    .filter((v) => v.youtubeId)

  const traducoes = {}
  for (const [locale, fields] of Object.entries(form.traducoes)) {
    const hasContent = Object.values(fields).some((v) => v?.trim?.())
    if (hasContent) traducoes[locale] = { ...fields }
  }

  emit('submit', {
    slug: form.slug.trim(),
    data: {
      id: form.ordem,
      ordem: form.ordem,
      categoria: form.categoria,
      peso: Number(form.peso),
      precoBRL: form.precoBRL ? Number(form.precoBRL) : null,
      disponivel: form.disponivel,
      dimensoes: form.dimensoes,
      formato: form.formato,
      tratamento: form.tratamento,
      certificacao: form.certificacao,
      gradiente: form.gradiente,
      traducoes,
      videos,
    },
    images: images.value,
  })
}
</script>

<style scoped>
.gem-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section h3 {
  margin: 0 0 1rem;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.section-head-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.translate-status {
  font-size: 0.85rem;
  color: var(--accent);
}

.section-head h3 {
  margin: 0;
}

.hint {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
}

.translations {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.translation-block h4 {
  margin: 0 0 0.75rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.image-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.video-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .video-row {
    grid-template-columns: 1fr;
  }
}
</style>
