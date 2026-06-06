import { ref, computed } from 'vue'
import { fetchGemsFromFirestore, getFallbackGems } from '../services/gemsService'

const gems = ref(getFallbackGems())
const loading = ref(false)
const loaded = ref(false)
const error = ref(null)
const source = ref('local')

let loadPromise = null

export async function loadGems() {
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    loading.value = true
    error.value = null

    try {
      const remote = await fetchGemsFromFirestore()
      if (remote?.length) {
        gems.value = remote
        source.value = 'firestore'
      }
    } catch (err) {
      error.value = err
      console.warn('[gems] Firestore indisponível, usando dados locais.', err)
    } finally {
      loading.value = false
      loaded.value = true
    }
  })()

  return loadPromise
}

export function useGems() {
  const allGems = computed(() => gems.value)

  const availableGems = computed(() =>
    gems.value.filter(g => g.disponivel)
  )

  const soldGems = computed(() =>
    gems.value.filter(g => !g.disponivel)
  )

  function getGemBySlug(slug) {
    return gems.value.find(g => g.slug === slug)
  }

  return {
    gems: allGems,
    availableGems,
    soldGems,
    loading: computed(() => loading.value),
    loaded: computed(() => loaded.value),
    error: computed(() => error.value),
    source: computed(() => source.value),
    getGemBySlug,
    loadGems,
  }
}
