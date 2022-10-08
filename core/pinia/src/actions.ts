import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ActionItem } from '@poto/types'

export const useActionsStore = defineStore('actions', () => {
  const actions = ref<ActionItem[]>([])

  const createByJsonString = (str: string) => {
    try {
      const json = JSON.parse(str)
      if (Array.isArray(json))
        actions.value = json
      else
        actions.value = []
    }
    catch (e) {
      actions.value = []
    }
  }

  const addAction = (item: ActionItem) => {
    actions.value.push(item)
  }

  const findAction = (id: string) => {
    return actions.value.find(item => item.id === id)
  }

  return {
    actions,
    createByJsonString,
    addAction,
    findAction,
  }
})

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useActionsStore, import.meta.hot))
