/**
 * Gera public/sitemap.xml a partir das rotas estáticas + gemas publicadas.
 * Uso: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOMAIN = 'https://carnaibaesmeraldas.com.br'

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/estoque', changefreq: 'daily', priority: '0.8' },
]

function loadGemSlugs() {
  try {
    const seedPath = resolve(ROOT, 'firestore/gems.seed.json')
    const seed = JSON.parse(readFileSync(seedPath, 'utf8'))
    return Object.keys(seed).filter((slug) => seed[slug] && seed[slug].publicado !== false)
  } catch {
    return []
  }
}

const lastmod = new Date().toISOString().slice(0, 10)

function urlEntry(loc, { changefreq = 'monthly', priority = '0.7' } = {}) {
  return [
    '  <url>',
    `    <loc>${DOMAIN}${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

const gemEntries = loadGemSlugs()
  .map((slug) => urlEntry(`/esmeralda/${slug}`, { changefreq: 'monthly', priority: '0.7' }))
  .join('\n')

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  staticRoutes.map((r) => urlEntry(r.path, r)).join('\n'),
  gemEntries,
  '</urlset>',
  '',
].join('\n')

const outPath = resolve(ROOT, 'public/sitemap.xml')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, sitemap)

console.log('✓ public/sitemap.xml gerado com', staticRoutes.length + loadGemSlugs().length, 'URLs')
