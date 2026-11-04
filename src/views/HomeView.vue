<template>
  <HeroSection />
  <CatalogoSection />
  <OrigemSection />
  <GaleriaSection />
  <CertificacaoSection />
  <ContatoSection />
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '../composables/useSeo'
import HeroSection from '../components/HeroSection.vue'
import CatalogoSection from '../components/CatalogoSection.vue'
import OrigemSection from '../components/OrigemSection.vue'
import GaleriaSection from '../components/GaleriaSection.vue'
import CertificacaoSection from '../components/CertificacaoSection.vue'
import ContatoSection from '../components/ContatoSection.vue'

const { t } = useI18n()

usePageMeta({
  title: computed(() => t('meta.homeTitle')),
  description: computed(() => t('meta.homeDesc')),
})
</script>
