import type { App } from 'vue'
import type { PluginOptions } from './config'
import { config } from './config'

export * from './actions'
export * from './customBlocks'
export * from './designer'
export * from './widgetMenu'
export const potoPinia = {
  install(app: App, options: PluginOptions) {
    config.piniaInstance = app.config.globalProperties.$pinia || options.piniaInstance

    if (!config.piniaInstance)
      console.error('[@poto/pinia]: create pinia first and pass instance to plugin')
  },
}
