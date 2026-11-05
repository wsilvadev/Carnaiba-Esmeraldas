<template>
  <div id="app-root">
    <NavBar />
    <main>
      <RouterView />
    </main>
    <FooterSite />
    <ContactFloat />
    <CookieConsent />
    <div v-if="!localeReady" class="locale-loading" aria-hidden="true" />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooterSite from './components/FooterSite.vue'
import ContactFloat from './components/ContactFloat.vue'
import CookieConsent from './components/CookieConsent.vue'
import { useLocale } from './composables/useLocale'

const { localeReady } = useLocale()
</script>

<style>

.locale-loading {
  position: fixed;
  inset: 0;
  background: var(--dark);
  z-index: 9999;
  pointer-events: none;
  animation: fadeOut 0.3s ease 0.5s forwards;
}
@keyframes fadeOut {
  to { opacity: 0; visibility: hidden; }
}

</style>
