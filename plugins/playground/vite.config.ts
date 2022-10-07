import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from '@poto/auto-import/vite'
import GenBlockType from '@poto/gen-block-type'

export default defineConfig({
  plugins: [
    Inspect(),
    AutoImport({
      imports: ['block-plugins-template'],
      dirs: ['src/block-plugins/*'],
      fileFilter(file: string) {
        const arr = file.split('.')
        return arr[0].endsWith('index')
      },
    }),
    GenBlockType(),
  ],
})
