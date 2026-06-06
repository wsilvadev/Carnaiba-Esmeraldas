<template>
  <section id="contato" class="contato">
    <div class="contato-inner">
      <div class="contato-bg"></div>
      <div class="container" style="position:relative;z-index:2">
        <div class="contato-content">
          <p class="section-label">Fale Conosco</p>
          <h2 class="contato-title">Pronto para<br/><em>Encontrar sua Pedra?</em></h2>
          <div class="divider center"></div>
          <p class="contato-desc">
            Atendemos pelo WhatsApp com fotos reais, vídeos e fichas técnicas completas de cada pedra disponível. Respondemos em poucas horas.
          </p>
          <a :href="whatsappLink" target="_blank" class="wpp-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Conversar no WhatsApp
          </a>
          <div class="contato-info">
            <div class="info-item">
              <span class="info-label">Horário de Atendimento</span>
              <span class="info-value">Seg – Sáb · 8h às 18h</span>
            </div>
            <div class="info-divider"></div>
            <div class="info-item">
              <span class="info-label">Localização</span>
              <span class="info-value">Serra da Carnaíba · Bahia</span>
            </div>
            <div class="info-divider"></div>
            <div class="info-item">
              <span class="info-label">Envio</span>
              <span class="info-value">Sedex com Seguro · Todo Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const whatsappLink = 'https://wa.me/55?text=Olá!%20Vim%20pelo%20site%20Carnaíba%20Esmeraldas%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20pedras%20disponíveis.'
</script>

<style scoped>
.contato { position: relative; padding: 10rem 0; overflow: hidden; }
.contato-inner { position: relative; }
.contato-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(45,122,79,0.2) 0%, transparent 60%),
    linear-gradient(160deg, #0a1a10, #0d2b1a);
}
.contato-content { text-align: center; max-width: 680px; margin: 0 auto; }
.contato-title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  color: var(--cream);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 0;
}
.contato-title em { font-style: italic; color: var(--gold); }
.contato-desc {
  font-size: 0.82rem;
  line-height: 2;
  color: rgba(245,240,232,0.55);
  margin-bottom: 2.5rem;
}
.wpp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 2.5rem;
  background: #25D366;
  color: #fff;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  margin-bottom: 3rem;
}
.wpp-btn:hover { background: #128C7E; transform: translateY(-2px); }
.contato-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.info-item { display: flex; flex-direction: column; gap: 0.3rem; align-items: center; }
.info-label {
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.3);
}
.info-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  color: rgba(245,240,232,0.7);
}
.info-divider { width: 1px; height: 40px; background: rgba(201,168,76,0.15); }
@media (max-width: 600px) { .info-divider { display: none; } }
</style>
