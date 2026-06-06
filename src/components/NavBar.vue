<template>
  <nav :class="['navbar', { scrolled: isScrolled, 'menu-open': menuOpen }]" ref="navbarRef">
    <div class="nav-inner">
      <RouterLink to="/" class="nav-logo" data-ga-event="nav_click" data-ga-label="home" @click="menuOpen = false">
        <span class="logo-main brand-logo-main">Carnaíba</span>
        <span class="logo-sub brand-logo-sub">Esmeraldas</span>
      </RouterLink>
      <ul class="nav-links">
        <li><RouterLink to="/estoque" data-ga-event="nav_click" data-ga-label="stock">{{ t('nav.stock') }}</RouterLink></li>
        <li><RouterLink to="/#catalogo" data-ga-event="nav_click" data-ga-label="catalog">{{ t('nav.catalog') }}</RouterLink></li>
        <li><RouterLink to="/#origem" data-ga-event="nav_click" data-ga-label="origin">{{ t('nav.origin') }}</RouterLink></li>
        <li><RouterLink to="/#certificacao" data-ga-event="nav_click" data-ga-label="certification">{{ t('nav.certification') }}</RouterLink></li>
        <li><RouterLink to="/#galeria" data-ga-event="nav_click" data-ga-label="gallery">{{ t('nav.gallery') }}</RouterLink></li>
        <li><RouterLink to="/#contato" class="nav-cta" data-ga-event="nav_click" data-ga-label="contact">{{ t('nav.contact') }}</RouterLink></li>
        <li><LocaleSwitcher /></li>
      </ul>
      <div class="nav-right-mobile">
        <LocaleSwitcher />
        <button
          class="hamburger"
          :class="{ open: menuOpen }"
          data-ga-event="menu_toggle"
          data-ga-label="mobile_menu"
          @click="menuOpen = !menuOpen"
          :aria-label="t('nav.menu')"
          :aria-expanded="menuOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="menuOpen"
        class="mobile-menu-backdrop"
        aria-hidden="true"
        @click="menuOpen = false"
      />

      <div
        :class="['mobile-menu', { open: menuOpen }]"
        :aria-hidden="!menuOpen"
        :style="menuStyle"
      >
        <RouterLink to="/estoque" @click="menuOpen = false">{{ t('nav.stock') }}</RouterLink>
        <RouterLink to="/#catalogo" @click="menuOpen = false">{{ t('nav.catalog') }}</RouterLink>
        <RouterLink to="/#origem" @click="menuOpen = false">{{ t('nav.origin') }}</RouterLink>
        <RouterLink to="/#certificacao" @click="menuOpen = false">{{ t('nav.certification') }}</RouterLink>
        <RouterLink to="/#galeria" @click="menuOpen = false">{{ t('nav.gallery') }}</RouterLink>
        <RouterLink to="/#contato" class="mobile-menu-cta" @click="menuOpen = false">{{ t('nav.contact') }}</RouterLink>
      </div>
    </Teleport>
  </nav>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from './LocaleSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)
const navbarRef = ref(null)
const navHeight = ref(0)

const menuStyle = computed(() => ({
  top: `${navHeight.value}px`,
  height: navHeight.value
    ? `calc(100dvh - ${navHeight.value}px)`
    : 'calc(100dvh - 4.25rem)',
}))

const onScroll = () => { isScrolled.value = window.scrollY > 60 }

function updateNavHeight() {
  navHeight.value = navbarRef.value?.offsetHeight ?? 0
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) updateNavHeight()
})

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', updateNavHeight)
  updateNavHeight()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateNavHeight)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  padding: 1.5rem 2rem;
  transition: background 0.3s ease, border-color 0.3s ease, padding 0.3s ease;
}

.navbar.scrolled,
.navbar.menu-open {
  background: rgba(10, 26, 16, 0.98);
  border-bottom: 1px solid rgba(201, 168, 76, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.navbar.scrolled {
  padding: 1rem 2rem;
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 202;
}

.nav-logo {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  text-decoration: none;
}

.logo-main {
  font-size: 1.5rem;
  color: #fdfcfa;
}

.logo-sub {
  font-size: 0.55rem;
  color: #c9a84c;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245, 240, 232, 0.8);
  transition: color 0.2s;
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #c9a84c;
}

.nav-cta {
  padding: 0.6rem 1.4rem !important;
  border: 1px solid rgba(201, 168, 76, 0.5) !important;
  color: #c9a84c !important;
  transition: all 0.3s !important;
}

.nav-cta:hover {
  background: #c9a84c !important;
  color: #0a1a10 !important;
}

.nav-right-mobile {
  display: none;
  align-items: center;
  gap: 0.75rem;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: rgba(10, 26, 16, 0.85);
  border: 1px solid rgba(201, 168, 76, 0.25);
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 18px;
  height: 1.5px;
  margin: 0 auto;
  background: #fdfcfa;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

.mobile-menu-backdrop {
  display: none;
}

.mobile-menu {
  display: none;
}

@media (max-width: 900px) {
  .navbar {
    padding: 0.85rem 1rem;
    padding-top: calc(0.85rem + env(safe-area-inset-top, 0px));
    background: rgba(10, 26, 16, 0.96);
    border-bottom: 1px solid rgba(201, 168, 76, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .nav-links {
    display: none;
  }

  .nav-right-mobile {
    display: flex;
  }

  .hamburger {
    display: flex;
  }

  .logo-main {
    font-size: 1.25rem;
  }

  .mobile-menu-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(5, 14, 9, 0.72);
    z-index: 280;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 290;
    padding: 1rem 1.25rem calc(2rem + env(safe-area-inset-bottom, 0px));
    background: #0a1a10;
    border-top: 1px solid rgba(201, 168, 76, 0.15);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    transform: translateY(-12px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
  }

  .mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .mobile-menu a {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #f5f0e8;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(201, 168, 76, 0.12);
    text-decoration: none;
  }

  .mobile-menu a:active,
  .mobile-menu a.router-link-active {
    color: #c9a84c;
  }

  .mobile-menu-cta {
    margin-top: 1rem;
    text-align: center;
    border: 1px solid rgba(201, 168, 76, 0.45) !important;
    color: #c9a84c !important;
    padding: 1rem !important;
    border-radius: 6px;
  }
}
</style>
