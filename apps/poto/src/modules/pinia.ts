import { createPinia } from 'pinia'
import { potoBlockBasics } from '@poto/block-basics'
import { potoPinia } from '@poto/pinia'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
  app.use(potoBlockBasics, {
    piniaInstance: pinia,
    pixabayApiKey: import.meta.env.VITE_PIXABAY_API_KEY,
    googleFontsApiKey: import.meta.env.VITE_GOOGLE_FONTS_API_KEY,
  })
  app.use(potoPinia, { piniaInstance: pinia })
}
