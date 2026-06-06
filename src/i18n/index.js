import { createI18n } from 'vue-i18n'
import pt from './locales/pt.js'
import en from './locales/en.js'
import es from './locales/es.js'
import fr from './locales/fr.js'
import de from './locales/de.js'
import hi from './locales/hi.js'

const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'en',
  messages: { pt, en, es, fr, de, hi },
})

export default i18n
