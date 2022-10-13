import path from 'path'
import { defineConfig } from 'vite'

// import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  build: {
    cssCodeSplit: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@poto/pinia',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@poto/utils',
        '@vueuse/core',
        'pinia',
        'vue',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@poto/utils': '@poto/utils',
          '@vueuse/core': '@vueuse/core',
          'pinia': 'pinia',
          'vue': 'Vue',
        },
      },
    },
  },
})
