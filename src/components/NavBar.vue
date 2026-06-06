<template>
  <nav :class="['navbar', { scrolled: isScrolled }]">
    <div class="nav-inner">
      <div class="nav-logo">
        <span class="logo-main">Carnaíba</span>
        <span class="logo-sub">Esmeraldas</span>
      </div>
      <ul class="nav-links">
        <li><a href="#catalogo">Catálogo</a></li>
        <li><a href="#origem">Origem</a></li>
        <li><a href="#certificacao">Certificação</a></li>
        <li><a href="#galeria">Galeria</a></li>
        <li><a href="#contato" class="nav-cta">Fale Conosco</a></li>
      </ul>
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div :class="['mobile-menu', { open: menuOpen }]">
      <a href="#catalogo" @click="menuOpen=false">Catálogo</a>
      <a href="#origem" @click="menuOpen=false">Origem</a>
      <a href="#certificacao" @click="menuOpen=false">Certificação</a>
      <a href="#galeria" @click="menuOpen=false">Galeria</a>
      <a href="#contato" @click="menuOpen=false">Fale Conosco</a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const isScrolled = ref(false)
const menuOpen = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 60 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1.5rem 2rem;
  transition: all 0.4s ease;
}
.navbar.scrolled {
  background: rgba(10, 26, 16, 0.97);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(201,168,76,0.15);
  backdrop-filter: blur(10px);
}
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.logo-main {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #fdfcfa;
  letter-spacing: 0.08em;
}
.logo-sub {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.55rem;
  font-weight: 300;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #c9a84c;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  list-style: none;
}
.nav-links a {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.8);
  transition: color 0.2s;
}
.nav-links a:hover { color: #c9a84c; }
.nav-cta {
  padding: 0.6rem 1.4rem !important;
  border: 1px solid rgba(201,168,76,0.5) !important;
  color: #c9a84c !important;
  transition: all 0.3s !important;
}
.nav-cta:hover {
  background: #c9a84c !important;
  color: #0a1a10 !important;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 1px;
  background: #fdfcfa;
}
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.mobile-menu.open { max-height: 300px; }
.mobile-menu a {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.8);
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(201,168,76,0.1);
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
}
</style>
