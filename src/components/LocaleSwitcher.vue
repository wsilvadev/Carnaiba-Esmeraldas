<template>
  <div class="locale-switcher">
    <select
      :value="locale"
      class="locale-select"
      :aria-label="t('locale.change')"
      @change="onLocaleChange"
    >
      <option v-for="loc in availableLocales" :key="loc.code" :value="loc.code">
        {{ loc.flag }} {{ loc.label }}
      </option>
    </select>
    <span class="currency-badge" :title="currencyTitle">{{ currencyCode }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const { locale, t, currency, countryLabel, availableLocales, setLocale } = useLocale()

const currencyCode = computed(() => currency.value)

const currencyTitle = computed(() => {
  if (locale.value === 'pt' && currencyCode.value === 'BRL') {
    return t('price.inBRL')
  }
  if (countryLabel.value && currencyCode.value !== 'BRL') {
    return t('price.forCountry', { country: countryLabel.value })
  }
  return currencyCode.value
})

async function onLocaleChange(e) {
  await setLocale(e.target.value)
}
</script>

<style scoped>
.locale-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.locale-select {
  background: rgba(10,26,16,0.6);
  border: 1px solid rgba(201,168,76,0.25);
  color: rgba(245,240,232,0.8);
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  outline: none;
}
.locale-select option {
  background: #0a1a10;
  color: #fdfcfa;
}
.currency-badge {
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 0.25rem 0.5rem;
  background: rgba(10, 26, 16, 0.9);
}

@media (max-width: 900px) {
  .locale-select {
    background: #0a1a10;
    min-width: 7.5rem;
  }

  .currency-badge {
    background: #0a1a10;
  }
}
</style>
