import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomBlock } from '@poto/types'
import { config } from './config'

export const useCustomBlocksStore = () => {
  if (!config.piniaInstance)
    console.error('[@poto/pinia]: create pinia first and pass instance to plugin')

  return defineStore('customBlocks', () => {
    const components = ref<CustomBlock[]>([])

    const createByTemplate = (arr: CustomBlock[]) => {
      if (Array.isArray(arr))
        components.value = arr
      else
        components.value = []
    }

    const createByJsonString = (str: string) => {
      try {
        const json = JSON.parse(str)
        createByTemplate(json)
      }
      catch (e) {
        components.value = []
      }
    }

    const addComponent = (component: CustomBlock) => {
      components.value.push({ ...component })
    }

    const updateComponent = (component: CustomBlock) => {
      const findIndex = components.value.findIndex((c) => {
        return c.id === component.id
      })
      components.value.splice(findIndex, 1, component)
    }

    const removeComponent = (item: CustomBlock) => {
      components.value = components.value.filter(component => component.id !== item.id)
    }

    return {
      components,
      createByTemplate,
      createByJsonString,
      addComponent,
      updateComponent,
      removeComponent,
    }
  })(config.piniaInstance)
}

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useCustomBlocksStore, import.meta.hot))
