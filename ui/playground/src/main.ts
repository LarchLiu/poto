import draggable from 'vuedraggable'
import { potoBlockBasics } from '@poto/block-basics'
import { plugin as potoBlockPluginTemplate } from '@poto/block-plugins-template'
import { plugin as soccerFormations } from '@poto/soccer-formations'
import { createI18n } from 'vue-i18n'
import { potoPinia } from '@poto/pinia'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import './styles/main.css'
import '@poto/block-basics/dist/style.css'
import 'uno.css'

const app = createApp(App)
app.config.unwrapInjectedRef = true

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
})

app.use(i18n)

const pinia = createPinia()
app.use(pinia)
app.use(potoPinia, { piniaInstance: pinia })
app.use(potoBlockPluginTemplate, { piniaInstance: pinia })
app.use(soccerFormations, { piniaInstance: pinia })
app.use(potoBlockBasics, { piniaInstance: pinia, pixabayApiKey: import.meta.env.VITE_PIXABAY_API_KEY })
app.component('Draggable', draggable)

app.mount('#app')
