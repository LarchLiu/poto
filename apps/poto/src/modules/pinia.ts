import { createPinia } from 'pinia'
import { plugin } from '@poto/block-basic'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
  app.use(plugin, { piniaInstance: pinia, pixabayApiKey: import.meta.env.VITE_PIXABAY_API_KEY })
}
