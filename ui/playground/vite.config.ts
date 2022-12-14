import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import PotoAutoImport from '@poto/auto-import/vite'
import VueI18n from '@intlify/vite-plugin-vue-i18n'

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
      exclude: [/node_modules/, /\.git/, /^(?!.*\/ui\/playground\/)/],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
    }),

    Unocss(),

    Inspect(),

    PotoAutoImport({
      imports: ['@poto/block-plugins-template', '@poto/soccer-formations'],
    }),

    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
  ],
})
