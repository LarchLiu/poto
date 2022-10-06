import { widgetPlugins } from './src/poto-auto-imports'
import { WidgetType } from './widget-type'

document.getElementById('app')!.innerHTML = `widgetPlugins: <br>${JSON.stringify(widgetPlugins)}<br><br>WidgetType: ${WidgetType}<br><br>`
