import draggable from 'vuedraggable'
import { plugin } from '@poto/block-basic'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import './styles/main.css'
import '@poto/block-basic/dist/style.css'
import 'uno.css'

const app = createApp(App)
app.config.unwrapInjectedRef = true

const pinia = createPinia()
app.use(pinia)
app.use(plugin, { piniaInstance: pinia, pixabayApiKey: import.meta.env.VITE_PIXABAY_API_KEY })
app.component('Draggable', draggable)

app.mount('#app')
