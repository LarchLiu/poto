import { blockPlugins } from './src/poto-auto-imports'

document.getElementById('app')!.innerHTML = `blockPlugins: <br>${JSON.stringify(blockPlugins)}<br><br>BlockType: ${__BLOCK_TYPE__}<br><br>`
