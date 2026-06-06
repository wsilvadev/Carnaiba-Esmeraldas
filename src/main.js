import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { initLocale } from './composables/useLocale'
import { loadGems } from './composables/useGems'
import { createAnalyticsPlugin } from './plugins/analytics'
import './main.css'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(createAnalyticsPlugin(router))

Promise.all([
  initLocale(i18n),
  loadGems(),
]).then(() => {
  app.mount('#app')
})
