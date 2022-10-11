import type { App } from 'vue'
import * as components from '~/components'
import type { PluginOptions } from '~/store'
import { store } from '~/store'
import BasicSetting from '~/components/Settings/BasicSetting.vue'

export { TextConfig, TitleConfig, MarkdownConfig, GroupConfig, Columns2Config, Columns3Config, ListConfig, BlockComponents } from '~/constants'
export { BasicSetting }

export const plugin = {
  install(app: App, options: PluginOptions) {
    store.piniaInstance = options.piniaInstance
    store.pixabayApiKey = options.pixabayApiKey
    for (const prop in components) {
      // @ts-expect-error: I want to index import using string
      const component = components[prop]
      app.component(component.name, component.view)
    }
  },
}
