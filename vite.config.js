import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fallbackGems } from './src/data/gems.js'
import { SUPPORTED_LOCALES, localizePath } from './src/router/locales.js'
import { fetchGemSlugs } from './src/services/firestoreRest.js'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const fallbackSlugs = fallbackGems.map((gem) => gem.slug)

  let gemSlugs = fallbackSlugs
  try {
    const remoteSlugs = await fetchGemSlugs({
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      apiKey: env.VITE_FIREBASE_API_KEY,
      timeout: 8000,
    })
    if (remoteSlugs.length) gemSlugs = remoteSlugs
  } catch (err) {
    console.warn('[seo] Não foi possível carregar gemas do Firestore, usando dados locais.', err.message)
  }

  return {
    plugins: [vue()],
    ssgOptions: {
      dirStyle: 'nested',
      concurrency: 1,
      includedRoutes() {
        const paths = []
        for (const locale of SUPPORTED_LOCALES) {
          paths.push(localizePath('/', locale))
          paths.push(localizePath('/estoque', locale))
          for (const slug of gemSlugs) {
            paths.push(localizePath(`/esmeralda/${slug}`, locale))
          }
        }
        return paths
      },
    },
  }
})
