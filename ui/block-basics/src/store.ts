import type { Pinia } from 'pinia'

export interface PluginOptions {
  piniaInstance: Pinia | undefined
  pixabayApiKey: string
}

export const store: PluginOptions = {
  piniaInstance: undefined,
  pixabayApiKey: '',
}
