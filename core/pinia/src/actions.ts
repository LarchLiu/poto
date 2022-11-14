import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ActionItem } from '@poto/types'
import { config } from './config'

export const useActionsStore = () => {
  if (!config.piniaInstance)
    console.error('[@poto/pinia]: create pinia first and pass instance to plugin')

  return defineStore('actions', () => {
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

    const deleteAction = (item: ActionItem) => {
      let idx = 10
      let tag = false
      for (let i = 0; i < actions.value.length; i++) {
        if (item.id === actions.value[i].id) {
          idx = i
          tag = true
          break
        }
      }
      if (tag)
        actions.value.splice(idx, 1)
    }

    return {
      actions,
      createByJsonString,
      addAction,
      findAction,
      deleteAction,
    }
  })(config.piniaInstance)
}

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useActionsStore, import.meta.hot))
