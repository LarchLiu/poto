import type { App } from 'vue'
import { potoPinia } from '@poto/pinia'
import * as components from './components'
import type { PluginOptions } from './config'
import { config } from './config'
import BasicSettingsView from './components/Settings/BasicSetting.vue'

export { TextConfig, TitleConfig, MarkdownConfig, GroupConfig, Columns2Config, Columns3Config, ListConfig, BlockBasics } from './constants'
export { BasicSettingsView }

export const potoBlockBasics = {
  install(app: App, options: PluginOptions) {
    config.pixabayApiKey = options.pixabayApiKey
    config.googleFontsApiKey = options.googleFontsApiKey

    if (!app.config.globalProperties.$pinia) {
      if (!options.piniaInstance)
        console.error('[@poto/block-basics]: create pinia first and pass instance to plugin')
      else
        app.use(potoPinia, { piniaInstance: options.piniaInstance })
    }

    for (const prop in components) {
      // @ts-expect-error: I want to index import using string
      const component = components[prop]
      app.component(component.name, component.view)
    }
  },
}
