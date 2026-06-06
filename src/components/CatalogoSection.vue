<template>
  <section id="catalogo" class="catalogo">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Disponíveis Agora</p>
        <h2 class="section-title">Catálogo de Gemas</h2>
        <div class="divider center"></div>
        <p class="section-desc">Cada pedra fotografada em condições controladas, com ficha técnica completa. Consulte disponibilidade e preço pelo WhatsApp.</p>
      </div>

      <div class="filters">
        <button
          v-for="f in filtros"
          :key="f.value"
          :class="['filter-btn', { active: filtroAtivo === f.value }]"
          @click="filtroAtivo = f.value"
        >{{ f.label }}</button>
      </div>

      <div class="gems-grid">
        <div
          v-for="gem in gemsFiltered"
          :key="gem.id"
          class="gem-card"
          @mouseenter="hoveredGem = gem.id"
          @mouseleave="hoveredGem = null"
        >
          <div class="gem-image-wrap">
            <div class="gem-placeholder" :style="{ background: gem.gradiente }">
              <div class="gem-icon">◆</div>
              <span class="gem-status" :class="gem.disponivel ? 'disponivel' : 'vendida'">
                {{ gem.disponivel ? 'Disponível' : 'Vendida' }}
              </span>
            </div>
            <div :class="['gem-overlay', { visible: hoveredGem === gem.id }]">
              <a :href="whatsappGem(gem)" target="_blank" class="btn-primary" style="font-size:0.6rem; padding: 0.7rem 1.5rem;">
                Consultar via WhatsApp
              </a>
            </div>
          </div>
          <div class="gem-info">
            <div class="gem-header">
              <h3 class="gem-name">{{ gem.nome }}</h3>
              <span class="gem-tipo">{{ gem.tipo }}</span>
            </div>
            <div class="gem-specs">
              <div class="spec"><span class="spec-label">Peso</span><span class="spec-value">{{ gem.peso }} ct</span></div>
              <div class="spec"><span class="spec-label">Cor</span><span class="spec-value">{{ gem.cor }}</span></div>
              <div class="spec"><span class="spec-label">Claridade</span><span class="spec-value">{{ gem.claridade }}</span></div>
              <div class="spec"><span class="spec-label">Origem</span><span class="spec-value">{{ gem.origem }}</span></div>
            </div>
            <div class="gem-footer">
              <span class="gem-price">{{ gem.disponivel ? gem.preco : '— Vendida —' }}</span>
              <a v-if="gem.disponivel" :href="whatsappGem(gem)" target="_blank" class="gem-cta">
                Consultar →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="catalogo-cta">
        <p>Temos pedras que não estão listadas aqui. Fale conosco para ver o estoque completo.</p>
        <a :href="whatsappBase" target="_blank" class="btn-outline">Ver Estoque Completo</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const filtroAtivo = ref('todos')
const hoveredGem = ref(null)
const whatsappBase = 'https://wa.me/55?text=Olá!%20Quero%20ver%20o%20estoque%20completo%20de%20esmeraldas.'

const filtros = [
  { value: 'todos', label: 'Todas' },
  { value: 'bruta', label: 'Brutas' },
  { value: 'lapidada', label: 'Lapidadas' },
  { value: 'disponivel', label: 'Disponíveis' },
]

const gems = [
  {
    id: 1, nome: 'Carnaíba Nº 01', tipo: 'Bruta', peso: '8.4', cor: 'Verde Intenso',
    claridade: 'Alta', origem: 'Serra da Carnaíba', disponivel: true,
    preco: 'Sob Consulta', gradiente: 'linear-gradient(135deg, #1a4a2e, #2d7a4f)',
    categoria: 'bruta'
  },
  {
    id: 2, nome: 'Carnaíba Nº 02', tipo: 'Lapidada', peso: '3.2', cor: 'Verde Médio',
    claridade: 'Muito Alta', origem: 'Serra da Carnaíba', disponivel: true,
    preco: 'Sob Consulta', gradiente: 'linear-gradient(135deg, #0d3320, #1a6640)',
    categoria: 'lapidada'
  },
  {
    id: 3, nome: 'Carnaíba Nº 03', tipo: 'Bruta', peso: '22.1', cor: 'Verde Profundo',
    claridade: 'Média', origem: 'Serra da Carnaíba', disponivel: true,
    preco: 'Sob Consulta', gradiente: 'linear-gradient(135deg, #0d2b1a, #1a4a2e)',
    categoria: 'bruta'
  },
  {
    id: 4, nome: 'Carnaíba Nº 04', tipo: 'Lapidada', peso: '1.8', cor: 'Verde Claro',
    claridade: 'Excepcional', origem: 'Serra da Carnaíba', disponivel: false,
    preco: '— Vendida —', gradiente: 'linear-gradient(135deg, #2d7a4f, #4db87a)',
    categoria: 'lapidada'
  },
  {
    id: 5, nome: 'Carnaíba Nº 05', tipo: 'Bruta', peso: '44.0', cor: 'Verde Intenso',
    claridade: 'Alta', origem: 'Serra da Carnaíba', disponivel: true,
    preco: 'Sob Consulta', gradiente: 'linear-gradient(135deg, #0a1a10, #1a4a2e)',
    categoria: 'bruta'
  },
  {
    id: 6, nome: 'Carnaíba Nº 06', tipo: 'Lapidada', peso: '5.6', cor: 'Verde Intenso',
    claridade: 'Alta', origem: 'Serra da Carnaíba', disponivel: true,
    preco: 'Sob Consulta', gradiente: 'linear-gradient(135deg, #1a4a2e, #3a8a5f)',
    categoria: 'lapidada'
  },
]

const gemsFiltered = computed(() => {
  if (filtroAtivo.value === 'todos') return gems
  if (filtroAtivo.value === 'disponivel') return gems.filter(g => g.disponivel)
  return gems.filter(g => g.categoria === filtroAtivo.value)
})

const whatsappGem = (gem) =>
  `https://wa.me/55?text=Olá!%20Tenho%20interesse%20na%20${encodeURIComponent(gem.nome)}%20(${gem.peso}ct%20-%20${gem.tipo}).%20Pode%20me%20enviar%20mais%20fotos%20e%20o%20valor?`
</script>

<style scoped>
.catalogo {
  padding: 8rem 0;
  background: var(--dark);
}
.section-header { text-align: center; margin-bottom: 3rem; }
.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--cream);
  font-weight: 300;
}
.section-desc {
  max-width: 560px;
  margin: 0 auto;
  font-size: 0.8rem;
  line-height: 2;
  color: rgba(245,240,232,0.55);
}
.filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 0.5rem 1.5rem;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid rgba(201,168,76,0.2);
  color: rgba(245,240,232,0.5);
  cursor: pointer;
  transition: all 0.3s;
}
.filter-btn.active, .filter-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}
.gems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2px;
}
.gem-card {
  background: rgba(13,43,26,0.3);
  border: 1px solid rgba(45,122,79,0.1);
  transition: border-color 0.3s;
}
.gem-card:hover { border-color: rgba(201,168,76,0.3); }
.gem-image-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.gem-placeholder {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.5s ease;
}
.gem-card:hover .gem-placeholder { transform: scale(1.03); }
.gem-icon {
  font-size: 4rem;
  color: rgba(255,255,255,0.15);
  text-shadow: 0 0 40px rgba(168,230,193,0.3);
}
.gem-status {
  position: absolute;
  top: 1rem; right: 1rem;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
}
.disponivel {
  background: rgba(77,184,122,0.2);
  color: #4db87a;
  border: 1px solid rgba(77,184,122,0.3);
}
.vendida {
  background: rgba(201,168,76,0.1);
  color: rgba(201,168,76,0.6);
  border: 1px solid rgba(201,168,76,0.2);
}
.gem-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10,26,16,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.gem-overlay.visible { opacity: 1; }
.gem-info { padding: 1.5rem; }
.gem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.gem-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 300;
  color: var(--cream);
}
.gem-tipo {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 0.2rem 0.6rem;
}
.gem-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.spec-label {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.35);
}
.spec-value {
  font-size: 0.78rem;
  color: rgba(245,240,232,0.8);
}
.gem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(201,168,76,0.1);
}
.gem-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: var(--gold);
}
.gem-cta {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.5);
  transition: color 0.2s;
}
.gem-cta:hover { color: var(--gold); }
.catalogo-cta {
  text-align: center;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(201,168,76,0.1);
}
.catalogo-cta p {
  font-size: 0.8rem;
  color: rgba(245,240,232,0.5);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}
</style>
