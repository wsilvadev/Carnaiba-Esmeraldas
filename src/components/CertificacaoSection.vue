<template>
  <section id="certificacao" class="cert">
    <div class="container">
      <div class="cert-grid">
        <div class="cert-content">
          <p class="section-label">Transparência Total</p>
          <h2 class="section-title">Origem<br/><em>Certificada</em></h2>
          <div class="divider"></div>
          <p class="cert-text">
            Trabalhamos filiados à cooperativa de garimpeiros da Serra da Carnaíba, com toda documentação exigida pela Agência Nacional de Mineração (ANM). Cada pedra vendida acompanha seu documento de origem.
          </p>
          <div class="docs">
            <div class="doc-item" v-for="d in docs" :key="d.titulo">
              <div class="doc-check">✓</div>
              <div>
                <h4 class="doc-titulo">{{ d.titulo }}</h4>
                <p class="doc-desc">{{ d.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="cert-cards">
          <div class="cert-card" v-for="c in certCards" :key="c.titulo">
            <div class="cert-card-icon">{{ c.icon }}</div>
            <h3 class="cert-card-titulo">{{ c.titulo }}</h3>
            <p class="cert-card-desc">{{ c.desc }}</p>
          </div>
          <div class="cert-disclaimer">
            <p>Toda compra acompanha nota fiscal e documento de origem da cooperativa. Solicitamos filiação e regularidade antes de qualquer venda.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const docs = [
  { titulo: 'Filiação à Cooperativa', desc: 'Associados à cooperativa regional com registro ativo na ANM' },
  { titulo: 'Documento de Origem por Pedra', desc: 'Emitido pela cooperativa para cada gema comercializada' },
  { titulo: 'Nota Fiscal em Toda Venda', desc: 'CNPJ regularizado, NF-e emitida para pessoa física ou jurídica' },
  { titulo: 'Extração em Área Licenciada', desc: 'Área de lavra com autorização vigente da Agência Nacional de Mineração' },
]
const certCards = [
  { icon: '⬡', titulo: 'ANM', desc: 'Agência Nacional de Mineração — órgão regulador federal' },
  { icon: '⬡', titulo: 'Cooperativa', desc: 'Filiação ativa com direito a emissão de documentos de origem' },
  { icon: '⬡', titulo: 'NF-e', desc: 'Nota fiscal eletrônica em 100% das transações comerciais' },
]
</script>

<style scoped>
.cert {
  padding: 8rem 0;
  background: linear-gradient(160deg, #080f0a 0%, #0d2b1a 100%);
}
.cert-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: start;
}
.section-title {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  color: var(--cream);
  font-weight: 300;
  line-height: 1.15;
}
.section-title em { font-style: italic; color: var(--gold); }
.cert-text {
  font-size: 0.82rem;
  line-height: 2.2;
  color: rgba(245,240,232,0.6);
  margin-bottom: 2rem;
}
.docs { display: flex; flex-direction: column; gap: 1.2rem; }
.doc-item { display: flex; align-items: flex-start; gap: 1rem; }
.doc-check {
  width: 20px; height: 20px;
  border: 1px solid var(--green-gem);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; color: var(--green-light);
  flex-shrink: 0; margin-top: 2px;
}
.doc-titulo {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: 0.2rem;
}
.doc-desc { font-size: 0.75rem; color: rgba(245,240,232,0.45); line-height: 1.6; }
.cert-cards { display: flex; flex-direction: column; gap: 1rem; }
.cert-card {
  background: rgba(13,43,26,0.4);
  border: 1px solid rgba(45,122,79,0.15);
  padding: 1.5rem;
  transition: border-color 0.3s;
}
.cert-card:hover { border-color: rgba(201,168,76,0.3); }
.cert-card-icon { font-size: 1.5rem; color: var(--gold); margin-bottom: 0.8rem; }
.cert-card-titulo {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cream);
  margin-bottom: 0.5rem;
}
.cert-card-desc { font-size: 0.75rem; color: rgba(245,240,232,0.5); line-height: 1.7; }
.cert-disclaimer {
  background: rgba(201,168,76,0.05);
  border: 1px solid rgba(201,168,76,0.15);
  border-left: 2px solid var(--gold);
  padding: 1rem 1.25rem;
}
.cert-disclaimer p { font-size: 0.73rem; color: rgba(245,240,232,0.5); line-height: 1.8; }
@media (max-width: 900px) {
  .cert-grid { grid-template-columns: 1fr; gap: 3rem; }
}
</style>
