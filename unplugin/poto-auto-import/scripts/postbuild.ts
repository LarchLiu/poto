import { basename, resolve } from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import chalk from 'chalk'

async function run() {
  // fix cjs exports
  const files = await fg('*.cjs', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(fileURLToPath(import.meta.url), '../../dist'),
  })
  for (const file of files) {
    // eslint-disable-next-line no-console
    console.log(chalk.cyan.inverse(' POST '), `Fix ${basename(file)}`)
    let code = await fs.readFile(file, 'utf8')
    code = code.replace('exports.default =', 'module.exports =')
    code += 'exports.default = module.exports;'
    await fs.writeFile(file, code)
  }
}

run()

