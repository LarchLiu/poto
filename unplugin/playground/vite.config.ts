import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '@poto/auto-import/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      imports: ['widget-plugins-template'],
      dirs: ['src/widget-plugins/*'],
      fileFilter(file: string) {
        return file.includes('index')
      },
    }),
  ],
})
