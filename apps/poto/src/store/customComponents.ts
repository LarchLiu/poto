import type { CustomComponent } from '~/types'

export const useCustomComponentsStore = defineStore('components', () => {
  const components = ref<CustomComponent[]>([])

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

  const addComponent = (component: CustomComponent) => {
    components.value.push({ ...component })
  }

  const updateComponent = (component: CustomComponent) => {
    const findIndex = components.value.findIndex((c) => {
      return c.id === component.id
    })
    components.value.splice(findIndex, 1, component)
  }

  const removeComponent = (item: CustomComponent) => {
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
  import.meta.hot.accept(acceptHMRUpdate(useCustomComponentsStore, import.meta.hot))
