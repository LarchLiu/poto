import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import GenBlockType from '@poto/gen-block-type'

export default defineConfig({
  plugins: [
    Vue(),
    GenBlockType(),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'poto-block-plugin-template',
      // the proper extensions will be added
      fileName: 'poto-block-plugin-template',
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
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
          'pinia': 'pinia',
          '@poto/pinia': '@poto/pinia',
          '@poto/utils': '@poto/utils',
          '@poto/block-basics': '@poto/block-basics',
          '@vueuse/core': '@vueuse/core',
        },
      },
    },
  },
})
