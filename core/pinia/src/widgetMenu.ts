import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWidgetMenuStore = defineStore('widgetMenu', () => {
  const id = ref('')
  const left = ref(0)
  const top = ref(0)

  return {
    id,
    left,
    top,
  }
})

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useWidgetMenuStore, import.meta.hot))
