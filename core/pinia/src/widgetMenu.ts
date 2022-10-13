import { defineStore } from 'pinia'
import { ref } from 'vue'
import { config } from './config'

export const useWidgetMenuStore = () => {
  if (!config.piniaInstance) {
    console.error('[@poto/pinia]: create pinia first and pass instance to plugin')
    return
  }

  return defineStore('widgetMenu', () => {
    const id = ref('')
    const left = ref(0)
    const top = ref(0)

    return {
      id,
      left,
      top,
    }
  })(config.piniaInstance)
}

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useWidgetMenuStore, import.meta.hot))
