import { blockPlugins } from './src/poto-auto-imports'
import { BlockType } from './blockType'

document.getElementById('app')!.innerHTML = `blockPlugins: <br>${JSON.stringify(blockPlugins)}<br><br>BlockType: ${BlockType}<br><br>`
