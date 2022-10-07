import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import draggable from 'vuedraggable'
import '@unocss/reset/tailwind.css'
import App from './App.vue'
import type { UserModule } from './types'
import generatedRoutes from '~pages'

import './styles/main.css'
import 'uno.css'

const app = createApp(App)
app.config.unwrapInjectedRef = true

// setup up pages with layouts
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })
app.use(router)

app.component('Draggable', draggable)
// install all modules under `modules/`
Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true })).map(i => i.install?.({ app, router, routes }))
app.mount('#app')
