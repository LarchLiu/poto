import type { Pinia } from 'pinia'

export interface PluginOptions {
  piniaInstance: Pinia | undefined
  pixabayApiKey: string
}

export const config: PluginOptions = {
  piniaInstance: undefined,
  pixabayApiKey: '',
}
