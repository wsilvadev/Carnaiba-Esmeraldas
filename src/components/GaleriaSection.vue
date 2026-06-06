<template>
  <section id="galeria" class="galeria">
    <div class="container">
      <div class="section-header">
        <p class="section-label">Vídeos e Fotos</p>
        <h2 class="section-title">Galeria de Gemas</h2>
        <div class="divider center"></div>
        <p class="section-desc">
          Adicione seus vídeos do YouTube e fotos reais das pedras aqui. Cada link do YouTube é incorporado diretamente — sem custo de hospedagem.
        </p>
      </div>

      <div class="galeria-grid">
        <div class="video-card featured">
          <div class="video-placeholder">
            <div class="play-icon">▶</div>
            <p class="video-label">Vídeo de Extração</p>
            <p class="video-hint">Cole aqui o link do seu vídeo do YouTube</p>
            <code class="video-code">&lt;iframe src="youtube.com/embed/SEU_VIDEO_ID"&gt;</code>
          </div>
          <div class="video-info">
            <span class="video-tag">Extração</span>
            <h3>A Pedra Saindo do Chão</h3>
            <p>Serra da Carnaíba · Bahia · 2024</p>
          </div>
        </div>

        <div class="foto-grid">
          <div class="foto-card" v-for="i in 4" :key="i">
            <div class="foto-placeholder" :style="{ background: fotoColors[i-1] }">
              <span class="foto-icon">◈</span>
              <span class="foto-num">Foto {{ i }}</span>
            </div>
          </div>
        </div>

        <div class="video-card">
          <div class="video-placeholder small">
            <div class="play-icon small">▶</div>
            <p class="video-label">Vídeo da Gema na Luz</p>
          </div>
          <div class="video-info">
            <span class="video-tag">Qualidade</span>
            <h3>Reflexo e Transparência</h3>
            <p>Pedra sob luz natural e artificial</p>
          </div>
        </div>

        <div class="video-card">
          <div class="video-placeholder small">
            <div class="play-icon small">▶</div>
            <p class="video-label">Comparativo de Tamanho</p>
          </div>
          <div class="video-info">
            <span class="video-tag">Referência</span>
            <h3>Escala Real das Pedras</h3>
            <p>Medidas e peso em quilates</p>
          </div>
        </div>
      </div>

      <div class="galeria-nota">
        <p>🎯 <strong>Como adicionar seus vídeos:</strong> Suba o vídeo no YouTube → Copie o ID do vídeo → Cole no lugar de <code>SEU_VIDEO_ID</code> no componente GaleriaSection.vue</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const fotoColors = [
  'linear-gradient(135deg, #1a4a2e, #2d7a4f)',
  'linear-gradient(135deg, #0d2b1a, #1a5a35)',
  'linear-gradient(135deg, #2d7a4f, #4db87a)',
  'linear-gradient(135deg, #0a1a10, #1a4a2e)',
]
</script>

<style scoped>
.galeria {
  padding: 8rem 0;
  background: #080f0a;
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
  font-size: 0.78rem;
  line-height: 2;
  color: rgba(245,240,232,0.45);
}
.galeria-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto;
  gap: 2px;
  margin-bottom: 2rem;
}
.video-card { background: rgba(13,43,26,0.4); border: 1px solid rgba(45,122,79,0.1); }
.video-card.featured { grid-row: span 1; }
.video-placeholder {
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d2b1a, #1a4a2e);
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
  padding: 1rem;
  text-align: center;
}
.video-placeholder.small { aspect-ratio: 16/7; }
.video-placeholder:hover { background: linear-gradient(135deg, #1a4a2e, #2d7a4f); }
.play-icon {
  font-size: 2.5rem;
  color: rgba(201,168,76,0.6);
  transition: all 0.3s;
}
.play-icon.small { font-size: 1.5rem; }
.video-placeholder:hover .play-icon { color: var(--gold); transform: scale(1.1); }
.video-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(245,240,232,0.7);
}
.video-hint {
  font-size: 0.65rem;
  color: rgba(245,240,232,0.35);
  max-width: 200px;
}
.video-code {
  font-size: 0.6rem;
  color: rgba(77,184,122,0.5);
  background: rgba(0,0,0,0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 2px;
  display: block;
  margin-top: 0.5rem;
}
.video-info {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.video-tag {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}
.video-info h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--cream);
}
.video-info p {
  font-size: 0.7rem;
  color: rgba(245,240,232,0.4);
}
.foto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.foto-card { aspect-ratio: 1; overflow: hidden; }
.foto-placeholder {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.4s ease;
}
.foto-card:hover .foto-placeholder { transform: scale(1.05); }
.foto-icon {
  font-size: 2rem;
  color: rgba(255,255,255,0.15);
}
.foto-num {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
}
.galeria-nota {
  background: rgba(45,122,79,0.08);
  border: 1px solid rgba(45,122,79,0.15);
  border-left: 3px solid var(--green-gem);
  padding: 1.2rem 1.5rem;
  border-radius: 2px;
}
.galeria-nota p {
  font-size: 0.78rem;
  line-height: 1.8;
  color: rgba(245,240,232,0.6);
}
.galeria-nota strong { color: var(--green-light); font-weight: 400; }
.galeria-nota code {
  background: rgba(0,0,0,0.3);
  color: var(--green-light);
  padding: 0.1rem 0.4rem;
  font-size: 0.72rem;
}
@media (max-width: 768px) {
  .galeria-grid { grid-template-columns: 1fr; }
  .foto-grid { grid-template-columns: 1fr 1fr; }
}
</style>
