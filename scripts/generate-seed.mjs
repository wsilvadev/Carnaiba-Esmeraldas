/**
 * Gera firestore/gems.seed.json a partir dos dados locais + traduções i18n.
 * Uso: node scripts/generate-seed.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { fallbackGems } from '../src/data/gems.js'
import pt from '../src/i18n/locales/pt.js'
import en from '../src/i18n/locales/en.js'
import es from '../src/i18n/locales/es.js'
import fr from '../src/i18n/locales/fr.js'
import de from '../src/i18n/locales/de.js'
import hi from '../src/i18n/locales/hi.js'

const localeModules = { pt, en, es, fr, de, hi }

function gemKey(id) {
  return String(id).padStart(2, '0')
}

function buildTraducoes(id) {
  const key = gemKey(id)
  const traducoes = {}

  for (const [locale, messages] of Object.entries(localeModules)) {
    const g = messages.gems?.[key]
    if (!g) continue
    traducoes[locale] = {
      nome: g.name,
      tipo: g.tipo,
      cor: g.cor,
      claridade: g.claridade,
      desc: g.desc,
    }
  }

  return traducoes
}

const output = {}

for (const gem of fallbackGems) {
  const { id, slug, ...rest } = gem

  output[slug] = {
    id,
    slug,
    ordem: id,
    ...rest,
    traducoes: buildTraducoes(id),
    imagens: (gem.imagens || []).map((img) => ({
      id: img.id,
      gradiente: img.gradiente,
      publicId: `carnaiba/gems/${slug}/${img.id}`,
    })),
    videos: gem.videos || [],
  }
}

const outPath = new URL('../firestore/gems.seed.json', import.meta.url)
mkdirSync(new URL('../firestore/', import.meta.url), { recursive: true })
writeFileSync(outPath, JSON.stringify(output, null, 2))

console.log('✓ firestore/gems.seed.json gerado com', Object.keys(output).length, 'documentos')
