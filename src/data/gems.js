export const fallbackGems = [
  {
    id: 1,
    slug: 'carnaiba-01',
    categoria: 'bruta',
    peso: 8.4,
    precoBRL: 28500,
    disponivel: true,
    gradiente: 'linear-gradient(135deg, #1a4a2e, #2d7a4f)',
    dimensoes: '14 × 10 × 8 mm',
    formato: 'bruta',
    tratamento: 'nenhum',
    certificacao: 'cooperativa',
    videos: [],
    imagens: [
      { id: 'main', gradiente: 'linear-gradient(135deg, #1a4a2e, #2d7a4f)' },
      { id: 'side', gradiente: 'linear-gradient(135deg, #0d3320, #1a6640)' },
      { id: 'light', gradiente: 'linear-gradient(135deg, #2d7a4f, #4db87a)' },
    ],
  },
  {
    id: 2,
    slug: 'carnaiba-02',
    categoria: 'lapidada',
    peso: 3.2,
    precoBRL: 42000,
    disponivel: true,
    gradiente: 'linear-gradient(135deg, #0d3320, #1a6640)',
    dimensoes: '9 × 7 × 5 mm',
    formato: 'oval',
    tratamento: 'nenhum',
    certificacao: 'cooperativa',
    videos: [],
    imagens: [
      { id: 'main', gradiente: 'linear-gradient(135deg, #0d3320, #1a6640)' },
      { id: 'top', gradiente: 'linear-gradient(135deg, #1a4a2e, #3a8a5f)' },
    ],
  },
  {
    id: 3,
    slug: 'carnaiba-03',
    categoria: 'bruta',
    peso: 22.1,
    precoBRL: null,
    disponivel: true,
    gradiente: 'linear-gradient(135deg, #0d2b1a, #1a4a2e)',
    dimensoes: '22 × 16 × 12 mm',
    formato: 'bruta',
    tratamento: 'nenhum',
    certificacao: 'cooperativa',
    videos: [],
    imagens: [
      { id: 'main', gradiente: 'linear-gradient(135deg, #0d2b1a, #1a4a2e)' },
      { id: 'macro', gradiente: 'linear-gradient(135deg, #0a1a10, #1a4a2e)' },
    ],
  },
  {
    id: 4,
    slug: 'carnaiba-04',
    categoria: 'lapidada',
    peso: 1.8,
    precoBRL: 18500,
    disponivel: false,
    gradiente: 'linear-gradient(135deg, #2d7a4f, #4db87a)',
    dimensoes: '7 × 5 × 4 mm',
    formato: 'redondo',
    tratamento: 'nenhum',
    certificacao: 'cooperativa',
    videos: [],
    imagens: [
      { id: 'main', gradiente: 'linear-gradient(135deg, #2d7a4f, #4db87a)' },
    ],
  },
  {
    id: 5,
    slug: 'carnaiba-05',
    categoria: 'bruta',
    peso: 44.0,
    precoBRL: null,
    disponivel: true,
    gradiente: 'linear-gradient(135deg, #0a1a10, #1a4a2e)',
    dimensoes: '32 × 24 × 18 mm',
    formato: 'bruta',
    tratamento: 'nenhum',
    certificacao: 'cooperativa',
    videos: [],
    imagens: [
      { id: 'main', gradiente: 'linear-gradient(135deg, #0a1a10, #1a4a2e)' },
      { id: 'scale', gradiente: 'linear-gradient(135deg, #0d2b1a, #2d7a4f)' },
    ],
  },
  {
    id: 6,
    slug: 'carnaiba-06',
    categoria: 'lapidada',
    peso: 5.6,
    precoBRL: 58000,
    disponivel: true,
    gradiente: 'linear-gradient(135deg, #1a4a2e, #3a8a5f)',
    dimensoes: '11 × 9 × 6 mm',
    formato: 'esmeralda',
    tratamento: 'nenhum',
    certificacao: 'cooperativa',
    videos: [],
    imagens: [
      { id: 'main', gradiente: 'linear-gradient(135deg, #1a4a2e, #3a8a5f)' },
      { id: 'light', gradiente: 'linear-gradient(135deg, #2d7a4f, #5dc98a)' },
      { id: 'side', gradiente: 'linear-gradient(135deg, #0d3320, #1a6640)' },
    ],
  },
]

/** @deprecated Use useGems() */
export const gems = fallbackGems

export function getGemBySlug(slug) {
  return fallbackGems.find(g => g.slug === slug)
}

export function getAvailableGems() {
  return fallbackGems.filter(g => g.disponivel)
}
