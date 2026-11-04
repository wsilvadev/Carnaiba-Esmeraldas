/**
 * Gera public/sitemap.xml a partir das rotas estáticas + gemas publicadas.
 * Inclui todas as versões de idioma e anotações hreflang.
 * Uso: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LOCALES, localizePath } from '../src/router/locales.js'
import { fetchGemSlugs } from '../src/services/firestoreRest.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOMAIN = 'https://carnaibaesmeraldas.com.br'

const HREFLANG_MAP = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  hi: 'hi',
}

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/estoque', changefreq: 'daily', priority: '0.8' },
  { path: '/politica-de-cookies', changefreq: 'yearly', priority: '0.3' },
]

function loadEnvFile() {
  try {
    const content = readFileSync(resolve(ROOT, '.env'), 'utf8')
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      let value = match[2].trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[match[1]]) process.env[match[1]] = value
    }
  } catch {
    // .env é opcional; no CI as variáveis vêm do ambiente.
  }
}

function loadSeedSlugs() {
  try {
    const seedPath = resolve(ROOT, 'firestore/gems.seed.json')
    const seed = JSON.parse(readFileSync(seedPath, 'utf8'))
    return Object.keys(seed).filter((slug) => seed[slug] && seed[slug].publicado !== false)
  } catch {
    return []
  }
}

loadEnvFile()

let gemSlugs = []
try {
  gemSlugs = await fetchGemSlugs({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'carnaiba-esmeraldas',
    apiKey: process.env.VITE_FIREBASE_API_KEY || '',
    timeout: 10000,
  })
} catch (err) {
  console.warn('[sitemap] Firestore indisponível, usando seed local.', err.message)
}

if (!gemSlugs.length) gemSlugs = loadSeedSlugs()

const lastmod = new Date().toISOString().slice(0, 10)

function canonicalPath(path) {
  const p = String(path || '/')
  if (p === '/') return '/'
  const first = p.split('/')[1]
  if (SUPPORTED_LOCALES.includes(first) && first !== 'pt' && p === `/${first}/`) return p
  return p.endsWith('/') ? p.replace(/\/+$/, '') : p
}

function absolute(path) {
  return DOMAIN + canonicalPath(path)
}

function alternateLinks(basePath) {
  return [
    ...SUPPORTED_LOCALES.map((locale) => {
      const href = absolute(localizePath(basePath, locale))
      return `    <xhtml:link rel="alternate" hreflang="${HREFLANG_MAP[locale]}" href="${href}"/>`
    }),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(localizePath(basePath, 'pt'))}"/>`,
  ].join('\n')
}

function urlEntry(basePath, locale, { changefreq = 'monthly', priority = '0.7' } = {}) {
  return [
    '  <url>',
    `    <loc>${absolute(localizePath(basePath, locale))}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    alternateLinks(basePath),
    '  </url>',
  ].join('\n')
}

function entriesFor(basePath, options) {
  return SUPPORTED_LOCALES.map((locale) => urlEntry(basePath, locale, options))
}

const gemPaths = gemSlugs.map((slug) => `/esmeralda/${slug}`)

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...staticRoutes.flatMap((route) => entriesFor(route.path, route)),
  ...gemPaths.flatMap((path) => entriesFor(path, { changefreq: 'monthly', priority: '0.7' })),
  '</urlset>',
  '',
].join('\n')

const outPath = resolve(ROOT, 'public/sitemap.xml')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, sitemap)

console.log(
  '✓ public/sitemap.xml gerado com',
  (staticRoutes.length + gemPaths.length) * SUPPORTED_LOCALES.length,
  'URLs',
)
