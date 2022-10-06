import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from '@poto/auto-import/vite'
import GenWidgetType from '@poto/gen-widget-type/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    AutoImport({
      imports: ['widget-plugins-template'],
      dirs: ['src/widget-plugins/*'],
      fileFilter(file: string) {
        const arr = file.split('.')
        return arr[0].endsWith('index')
      },
    }),
    GenWidgetType(),
  ],
})
