import type { CustomBlock } from '~/types'

export const useCustomBlocksStore = defineStore('customBlocks', () => {
  const components = ref<CustomBlock[]>([])

  const createByJsonString = (str: string) => {
    try {
      const json = JSON.parse(str)
      if (Array.isArray(json))
        components.value = json
      else
        components.value = []
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
    createByJsonString,
    addComponent,
    updateComponent,
    removeComponent,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCustomBlocksStore, import.meta.hot))
