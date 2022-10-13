import type { BlockItem, TextSettings } from '@poto/types'
import type { Pinia } from 'pinia'
import { potoPinia } from '@poto/pinia'
import type { App } from 'vue'
import blockView from './components/widget.vue'
import settingsView from './components/settings.vue'

interface PluginOptions {
  piniaInstance: Pinia
}

// @unocss-include
const settings: BlockItem = {
  author: '[alex](github.com/larchliu)',
  category: 'widget',
  icon: 'i-fluent-text-case-title-16-regular',
  blockType: __BLOCK_TYPE__,
  options: {
    // basic options
    name: 'MyBlockPlugin',
    padding: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    border: {
      has: false,
      width: [1, 1, 1, 1],
      style: 'solid',
      radius: [0, 0, 0, 0],
      color: {
        type: 'single',
        options: {
          colors: ['#000000'],
          opacity: 1,
          degree: 45,
          gradient: true,
          url: '',
        },
      },
    },
    size: { width: 100, height: 100 },
    backgroundColor: {
      type: 'single',
      options: {
        colors: ['#00000000'],
        opacity: 1,
        degree: 45,
        gradient: true,
        url: '',
      },
    },
    // component options
    text: 'Text',
    font: {
      size: '1em',
      color: {
        type: 'single',
        options: {
          colors: ['#000000'],
          opacity: 1,
          degree: 45,
          gradient: true,
        },
      },
      weight: 400,
      style: 'normal',
      decoration: 'none',
    },
    align: 'left',
  } as TextSettings,
}

export const potoBlockPluginTemplate = {
  install(app: App, options: PluginOptions) {
    if (!app.config.globalProperties.$pinia)
      app.use(potoPinia, { piniaInstance: options.piniaInstance })
  },
}

export default {
  blockView,
  settingsView,
  config: settings,
}
