<template>
  <section id="origem" class="origem">
    <div class="origem-grid">
      <div class="origem-visual">
        <div class="visual-block">
          <div class="gem-large">◆</div>
          <div class="origin-badge">
            <span class="badge-num">100%</span>
            <span class="badge-text">Origem<br/>Verificada</span>
          </div>
        </div>
        <div class="coords">
          <span>11°7'S 41°22'W</span>
          <span>Serra da Carnaíba · Bahia</span>
        </div>
      </div>
      <div class="origem-content">
        <p class="section-label">A Nossa História</p>
        <h2 class="section-title">Do Subsolo<br/><em>para Você</em></h2>
        <div class="divider"></div>
        <p class="origem-text">
          A Serra da Carnaíba é reconhecida mundialmente como uma das mais importantes fontes de esmeraldas do planeta. Nossas pedras são extraídas diretamente desta região, com toda a rastreabilidade e documentação exigida pela ANM.
        </p>
        <p class="origem-text">
          Ao comprar conosco, você elimina todos os intermediários — do garimpo direto para as suas mãos. Isso significa origem garantida, preço justo e a certeza de estar adquirindo uma gema genuinamente brasileira.
        </p>
        <div class="pilares">
          <div class="pilar" v-for="p in pilares" :key="p.titulo">
            <span class="pilar-icon">{{ p.icon }}</span>
            <div>
              <h4 class="pilar-titulo">{{ p.titulo }}</h4>
              <p class="pilar-desc">{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const pilares = [
  { icon: '⬡', titulo: 'Extração Cooperada', desc: 'Filiados à cooperativa da região, com documentação ANM regularizada.' },
  { icon: '⬡', titulo: 'Rastreabilidade Total', desc: 'Cada pedra tem documento de origem emitido pela cooperativa.' },
  { icon: '⬡', titulo: 'Preço de Fonte', desc: 'Sem atravessadores. O valor que você paga chega ao garimpeiro.' },
]
</script>

<style scoped>
.origem {
  background: linear-gradient(160deg, #0d2b1a 0%, #0a1a10 100%);
  padding: 8rem 2rem;
}
.origem-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 6rem;
  align-items: center;
}
.origem-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.visual-block {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 400px;
  background: rgba(45,122,79,0.08);
  border: 1px solid rgba(45,122,79,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-block::before {
  content: '';
  position: absolute;
  inset: -20px;
  border: 1px solid rgba(201,168,76,0.1);
  pointer-events: none;
}
.gem-large {
  font-size: 10rem;
  color: rgba(45,122,79,0.4);
  text-shadow: 0 0 80px rgba(77,184,122,0.3), inset 0 0 30px rgba(168,230,193,0.1);
  animation: gemFloat 4s ease-in-out infinite;
}
@keyframes gemFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}
.origin-badge {
  position: absolute;
  bottom: -1.5rem;
  right: -1.5rem;
  background: var(--gold);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.badge-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #0a1a10;
  line-height: 1;
}
.badge-text {
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(10,26,16,0.7);
  text-align: center;
  line-height: 1.5;
}
.coords {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.coords span {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: rgba(245,240,232,0.3);
  text-transform: uppercase;
}
.section-title {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  color: var(--cream);
  font-weight: 300;
  line-height: 1.15;
}
.section-title em { font-style: italic; color: var(--gold); }
.origem-text {
  font-size: 0.82rem;
  line-height: 2.2;
  color: rgba(245,240,232,0.6);
  margin-bottom: 1.2rem;
}
.pilares {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(201,168,76,0.1);
}
.pilar {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.pilar-icon {
  font-size: 1.2rem;
  color: var(--gold);
  margin-top: 2px;
  flex-shrink: 0;
}
.pilar-titulo {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: 0.3rem;
}
.pilar-desc {
  font-size: 0.78rem;
  line-height: 1.8;
  color: rgba(245,240,232,0.5);
}
@media (max-width: 900px) {
  .origem-grid { grid-template-columns: 1fr; gap: 3rem; }
  .origem-visual { display: none; }
}
</style>
