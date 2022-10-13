import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import PotoAutoImport from '@poto/auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    Vue(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'pinia',
        {
          '@poto/pinia': [
            // named imports
            'useActionsStore',
            'useCustomBlocksStore',
            'useDesignerStore',
            'useWidgetMenuStore',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
      resolvers: [ElementPlusResolver()],
      exclude: [/node_modules/, /\.git/, /core\/pinia/, /ui\/block-plugin-template/],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [ElementPlusResolver()],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    Unocss(),

    Inspect(),

    PotoAutoImport({
      imports: ['@poto/block-plugins-template'],
    }),
  ],
})
