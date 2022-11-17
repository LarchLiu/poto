import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import GenBlockType from '@poto/gen-block-type'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    GenBlockType(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'vue-i18n',
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
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'soccerFormations',
      // the proper extensions will be added
      fileName: 'soccer-formations',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'vue',
        'pinia',
        '@poto/pinia',
        '@poto/utils',
        '@poto/block-basics',
        '@vueuse/core',
        'vue-i18n',
        'element-plus',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
          '@poto/pinia': '@poto/pinia',
          '@poto/utils': '@poto/utils',
          '@poto/block-basics': '@poto/block-basics',
          '@vueuse/core': '@vueuse/core',
          'element-plus': 'element-plus',
          'vue-i18n': 'vue-i18n',
        },
      },
    },
  },
})
