import { widgetPlugins } from './src/poto-auto-imports'
document.getElementById('app')!.innerHTML = `${JSON.stringify(widgetPlugins)}test`
