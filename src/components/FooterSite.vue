<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-main brand-logo-main">Carnaíba</span>
            <span class="logo-sub brand-logo-sub">Esmeraldas</span>
          </div>
          <p class="footer-tagline">{{ t('footer.tagline') }}</p>
        </div>
        <div class="footer-links">
          <h4>{{ t('footer.navigation') }}</h4>
          <ul>
            <li><RouterLink to="/#catalogo">{{ t('nav.catalog') }}</RouterLink></li>
            <li><RouterLink to="/#origem">{{ t('footer.ourOrigin') }}</RouterLink></li>
            <li><RouterLink to="/#certificacao">{{ t('nav.certification') }}</RouterLink></li>
            <li><RouterLink to="/#galeria">{{ t('nav.gallery') }}</RouterLink></li>
            <li><RouterLink to="/#contato">{{ t('nav.contact') }}</RouterLink></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>{{ t('footer.info') }}</h4>
          <ul>
            <li><RouterLink to="/#certificacao">{{ t('footer.anmDocs') }}</RouterLink></li>
            <li><RouterLink to="/#certificacao">{{ t('footer.invoice') }}</RouterLink></li>
            <li><RouterLink to="/#contato">{{ t('footer.shipping') }}</RouterLink></li>
            <li><a :href="whatsapp" target="_blank">WhatsApp</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>{{ t('footer.service') }}</h4>
          <a :href="whatsapp" target="_blank" class="footer-wpp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ t('footer.whatsapp') }}
          </a>
          <p class="footer-hours">{{ t('footer.hours') }}</p>
          <p class="footer-loc">{{ t('footer.location') }}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
        <p>{{ t('footer.legal') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useWhatsapp } from '../composables/useWhatsapp'

const { t } = useI18n()
const { site: whatsapp } = useWhatsapp()
</script>

<style scoped>
.footer {
  background: #040a06;
  padding: 5rem 0 2rem;
  border-top: 1px solid rgba(45,122,79,0.15);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 4rem;
}
.footer-logo { display: flex; flex-direction: column; line-height: 1.1; margin-bottom: 1.2rem; }
.logo-main {
  font-size: 1.4rem;
  color: #fdfcfa;
}
.logo-sub {
  font-size: 0.5rem;
  color: #c9a84c;
}
.footer-tagline {
  font-size: 0.75rem;
  line-height: 2;
  color: rgba(245,240,232,0.4);
}
.footer-links h4, .footer-contact h4 {
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.2rem;
}
.footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
.footer-links a {
  font-size: 0.75rem;
  color: rgba(245,240,232,0.45);
  transition: color 0.2s;
  letter-spacing: 0.05em;
  text-decoration: none;
}
.footer-links a:hover { color: var(--cream); }
.footer-wpp {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: rgba(37,211,102,0.1);
  border: 1px solid rgba(37,211,102,0.2);
  color: #4db87a;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  transition: all 0.3s;
  text-decoration: none;
}
.footer-wpp:hover {
  background: rgba(37,211,102,0.2);
  border-color: rgba(37,211,102,0.4);
}
.footer-hours, .footer-loc {
  font-size: 0.72rem;
  color: rgba(245,240,232,0.35);
  margin-bottom: 0.3rem;
}
.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.footer-bottom p {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(245,240,232,0.2);
}
@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
