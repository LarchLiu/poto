import type { Pinia } from 'pinia'

export interface PluginOptions {
  piniaInstance?: Pinia
}

export const config: PluginOptions = {
  piniaInstance: undefined,
}
