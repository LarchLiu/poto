import draggable from 'vuedraggable'
import { potoBlockBasics } from '@poto/block-basics'
import { potoPinia } from '@poto/pinia'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import './styles/main.css'
import '@poto/block-basics/dist/style.css'
import 'uno.css'

const app = createApp(App)
app.config.unwrapInjectedRef = true

const pinia = createPinia()
app.use(pinia)
app.use(potoBlockBasics, { piniaInstance: pinia, pixabayApiKey: import.meta.env.VITE_PIXABAY_API_KEY })
app.use(potoPinia, { piniaInstance: pinia })
app.component('Draggable', draggable)

app.mount('#app')
