import type { BlockItem, BlockPluginSettings } from '@poto/types'
import en from '~/locales/en.json'
import zhCN from '~/locales/zh-CN.json'

export interface Settings {
  imagesEl?: HTMLElement
}
// @unocss-include
export const config: BlockItem = {
  author: '[alex](github.com/larchliu)',
  category: 'widget',
  icon: 'i-mdi-soccer-field',
  blockType: __BLOCK_TYPE__,
  options: {
    // basic options
    name: 'Capture Image From Video',
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
        colors: ['#ffffff'],
        opacity: 1,
        degree: 45,
        gradient: true,
        url: '',
      },
    },
    // component options
    captures: {

    } as Settings,

  } as BlockPluginSettings,
}

export const i18nMessages = {
  'en': en,
  'zh-CN': zhCN,
}