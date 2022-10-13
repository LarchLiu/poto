import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import Unocss from 'unocss/vite'

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
        {
          'element-plus/es': [
            // named imports
            'ElMessage',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [ElementPlusResolver()],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    // Unocss(),
  ],

  build: {
    cssCodeSplit: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'poto-block-basic',
      // the proper extensions will be added
      fileName: 'poto-block-basic',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@poto/pinia',
        '@poto/utils',
        '@vueuse/core',
        'element-plus',
        'katex',
        'mermaid',
        'pinia',
        'vue',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
          'pinia': 'pinia',
          '@poto/pinia': '@poto/pinia',
          '@poto/utils': '@poto/utils',
          '@vueuse/core': '@vueuse/core',
          'element-plus': 'element-plus',
          'katex': 'katex',
          'mermaid': 'mermaid',
        },
      },
    },
  },
})
