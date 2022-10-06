import { createUnplugin } from 'unplugin'
import type { Options } from '../types'
import { createContext } from './ctx'

export default createUnplugin<Options | undefined>((options) => {
  let ctx = createContext(options)
  return {
    name: 'poto-gen-widget-type',
    enforce: 'post',
    async buildStart() {
      await ctx.writeConfigFilesThrottled()
    },
    vite: {
      async configResolved(config) {
        if (ctx.root !== config.root) {
          ctx = createContext(options, config.root)
          await ctx.writeConfigFilesThrottled()
        }
      },
    },
  }
})
