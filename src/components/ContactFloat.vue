<template>
  <div class="contact-float" :class="{ open: menuOpen }">
    <!-- Desktop: botões sempre visíveis -->
    <div class="contact-float-desktop">
      <a
        :href="emailUrl"
        class="float-btn float-btn--email"
        :aria-label="t('contact.email')"
        data-ga-context="float_email"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/>
        </svg>
      </a>
      <a
        v-if="whatsappAvailable"
        :href="whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        class="float-btn float-btn--wpp"
        aria-label="WhatsApp"
        data-ga-context="float_button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>

    <!-- Mobile: botão + expandível -->
    <div class="contact-float-mobile">
      <div
        v-if="menuOpen"
        class="contact-float-backdrop"
        aria-hidden="true"
        @click="menuOpen = false"
      />
      <div class="contact-float-menu" :class="{ open: menuOpen }">
        <a
          :href="emailUrl"
          class="float-action float-action--email"
          :aria-label="t('contact.email')"
          data-ga-context="float_email"
          @click="menuOpen = false"
        >
          <span class="float-action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/>
            </svg>
          </span>
          <span class="float-action-label">{{ t('contact.email') }}</span>
        </a>
        <a
          v-if="whatsappAvailable"
          :href="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="float-action float-action--wpp"
          aria-label="WhatsApp"
          data-ga-context="float_button"
          @click="menuOpen = false"
        >
          <span class="float-action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </span>
          <span class="float-action-label">{{ t('footer.whatsapp') }}</span>
        </a>
      </div>
      <button
        type="button"
        class="float-toggle"
        :class="{ open: menuOpen }"
        :aria-label="menuOpen ? t('contact.closeActions') : t('contact.openActions')"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <span class="float-toggle-icon" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWhatsapp } from '../composables/useWhatsapp'
import { useContact } from '../composables/useContact'

const { t } = useI18n()
const { site: whatsapp } = useWhatsapp()
const { whatsappAvailable, emailUrl } = useContact()
const menuOpen = ref(false)

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.contact-float {
  position: fixed;
  bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
  right: calc(2rem + env(safe-area-inset-right, 0px));
  z-index: 999;
}

.contact-float-desktop {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-float-mobile {
  display: none;
}

.float-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.float-btn:hover {
  transform: scale(1.08);
}

.float-btn--email {
  background: var(--gold);
  color: var(--dark);
  box-shadow: 0 4px 20px rgba(201, 168, 76, 0.35);
}

.float-btn--email:hover {
  background: var(--gold-light);
}

.float-btn--wpp {
  background: #25d366;
  color: #fff;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
}

.float-btn--wpp:hover {
  background: #128c7e;
}

@media (max-width: 900px) {
  .contact-float-desktop {
    display: none;
  }

  .contact-float-mobile {
    display: block;
    position: relative;
  }

  .contact-float-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(5, 14, 9, 0.45);
    z-index: -1;
  }

  .contact-float-menu {
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.75rem);
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    min-width: 12.5rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px) scale(0.96);
    transform-origin: bottom right;
    transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease;
    pointer-events: none;
  }

  .contact-float-menu.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  .float-action {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-radius: 999px;
    text-decoration: none;
    background: rgba(10, 26, 16, 0.96);
    border: 1px solid rgba(201, 168, 76, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .float-action:active {
    transform: scale(0.98);
  }

  .float-action--email {
    color: var(--gold);
  }

  .float-action--wpp {
    color: #4db87a;
    border-color: rgba(77, 184, 122, 0.25);
  }

  .float-action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .float-action--email .float-action-icon {
    background: rgba(201, 168, 76, 0.15);
  }

  .float-action--wpp .float-action-icon {
    background: rgba(37, 211, 102, 0.12);
  }

  .float-action-label {
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    padding-right: 0.25rem;
  }

  .float-toggle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid rgba(201, 168, 76, 0.35);
    background: var(--gold);
    color: var(--dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.35);
    transition: transform 0.25s ease, background 0.25s ease;
  }

  .float-toggle.open {
    background: #0a1a10;
    color: var(--cream);
    border-color: rgba(201, 168, 76, 0.25);
  }

  .float-toggle-icon,
  .float-toggle-icon::before {
    display: block;
    width: 18px;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
    transition: transform 0.25s ease;
  }

  .float-toggle-icon {
    position: relative;
  }

  .float-toggle-icon::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    transform: rotate(90deg);
  }

  .float-toggle.open .float-toggle-icon {
    transform: rotate(45deg);
  }

  .float-toggle.open .float-toggle-icon::before {
    transform: rotate(-45deg);
  }
}
</style>
