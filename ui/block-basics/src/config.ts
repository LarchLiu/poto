import type { Pinia } from 'pinia'

export interface PluginOptions {
  piniaInstance: Pinia | undefined
  pixabayApiKey: string
  googleFontsApiKey: string
}

export const config: PluginOptions = {
  piniaInstance: undefined,
  pixabayApiKey: '',
  googleFontsApiKey: '',
}
