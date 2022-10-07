import { resolve } from 'path'
import { promises as fs } from 'fs'
import type { Plugin } from 'vite'
import { camelCase } from 'scule'

const createPlugin = (): Plugin => {
  return {
    name: 'vite-plugin-block-type',
    config: async () => {
      const packagePath = resolve(process.cwd(), 'package.json')
      const info = await fs.readFile(packagePath, 'utf-8')
      const packageInfo = JSON.parse(info)
      if (!packageInfo.name)
        throw new Error('[@poto/gen-block-type]: package.json have no name filed')
      const blockType = camelCase(packageInfo.name.replaceAll('@', ''))
      const key = '__BLOCK_TYPE__'

      return { define: { [key]: JSON.stringify(blockType) } }
    },
  }
}

export default createPlugin
