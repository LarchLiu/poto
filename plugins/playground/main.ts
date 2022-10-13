import { BlockPlugins } from './src/poto-auto-imports'

document.getElementById('app')!.innerHTML = `blockPlugins: <br>${JSON.stringify(BlockPlugins)}<br><br>BlockType: ${__BLOCK_TYPE__}<br><br>`
