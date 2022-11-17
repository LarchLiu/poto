import type { Pinia } from 'pinia'
import { potoPinia } from '@poto/pinia'
import type { App } from 'vue'
import settingsView from './components/settings.vue'
import blockView from './components/widget.vue'
import { config } from './constants'

interface PluginOptions {
  piniaInstance: Pinia
}

export const plugin = {
  install(app: App, options: PluginOptions) {
    if (!app.config.globalProperties.$pinia)
      app.use(potoPinia, { piniaInstance: options.piniaInstance })
  },
}

export const blockInfo = {
  blockView,
  settingsView,
  config,
}

