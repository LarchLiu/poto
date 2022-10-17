import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { BlockInfo, BlockItem, FindedItem } from '@poto/types'
import { UUID, cloneItem, deepClone } from '@poto/utils'
import { designerOptions } from './constants'
import { config } from './config'

export const useDesignerStore = () => {
  if (!config.piniaInstance)
    console.error('[@poto/pinia]: create pinia first and pass instance to plugin')

  return defineStore('designer', () => {
    const id = ref(UUID())
    const list = ref<BlockItem[]>([])
    const options = ref(deepClone(designerOptions))
    // const actions = useActionsStore()
    const currentItem = ref<BlockItem | undefined>(undefined)
    const { height: windowHeight } = useWindowSize()
    const contentPanelHeight = computed(() => windowHeight.value - 48 - 16)
    const blockPlugins = shallowRef<BlockInfo | undefined>(undefined)

    const createByJsonString = (str: string) => {
      try {
        const json = JSON.parse(str)
        if (typeof json === 'object') {
          id.value = json.id
          list.value = json.list
          options.value = json.options
          currentItem.value = undefined
        }
      }
      catch (e) {

      }
    }

    const findItemById = (src: BlockItem[], id?: string): FindedItem => {
      if (id) {
        for (let i = 0; i < src.length; i++) {
          if (src[i].id === id) {
            return { parentList: src, index: i, item: src[i] }
          }
          else if (src[i].options.list) {
            const { parentList, index, item } = findItemById(src[i].options.list!, id)
            if (parentList)
              return { parentList, index, item }
          }
        }
      }

      return { parentList: undefined, index: -1 }
    }

    const getCurrentItem = (): BlockItem | undefined => {
      return currentItem.value
    }

    const setSelectedItem = (item: BlockItem) => {
      currentItem.value = item
      const scrollTo = document.getElementById(`${item.category}-${item.id}`)
      if (scrollTo) {
        const eleHeight = scrollTo.offsetHeight
        scrollTo.scrollIntoView({
          behavior: 'smooth',
          block: eleHeight > contentPanelHeight.value ? 'start' : 'center',
          inline: 'nearest',
        })
      }
      else {
      // after element created
        setTimeout(() => {
          const scrollTo = document.getElementById(`${item.category}-${item.id}`)
          if (scrollTo) {
            const eleHeight = scrollTo.offsetHeight
            scrollTo.scrollIntoView({
              behavior: 'smooth',
              block: eleHeight > contentPanelHeight.value ? 'start' : 'center',
              inline: 'nearest',
            })
          }
        }, 100)
      }
    }

    const selectItem = (item: BlockItem, disabled = false) => {
      if (currentItem.value) {
        if (currentItem.value.id !== item.id) {
          setSelectedItem(item)
        }
        else {
          if (disabled)
            currentItem.value = undefined
        }
      }
      else {
        setSelectedItem(item)
      }
    }

    const resetSelectedItem = () => {
      currentItem.value = undefined
    }

    const addItem = (src: BlockItem) => {
      const item = cloneItem(src)
      if (!currentItem.value) {
        list.value.push(item)
        selectItem(item)
      }
      else {
        if (currentItem.value.options.list) {
          currentItem.value.options.list.push(item)
          selectItem(item)
        }
        else {
          const { parentList, index } = findItemById(list.value, currentItem.value.id)
          if (parentList) {
            parentList.splice(index + 1, 0, item)
            selectItem(item)
          }
        }
      }
    }

    const removeItem = (item: BlockItem) => {
      const { parentList, index } = findItemById(list.value, item.id)
      if (parentList)
        parentList.splice(index, 1)
    }

    const copyItem = (item: BlockItem) => {
      const { parentList, index } = findItemById(list.value, item.id)
      if (parentList) {
        const _item = { ...item, id: UUID() }
        parentList.splice(index + 1, 0, _item)
      }
    }

    const isSelected = (item: BlockItem) => {
      return !!currentItem.value && currentItem.value.id === item.id
    }

    const isWidget = (item: BlockItem) => {
      return item.category === 'widget'
    }

    const resetStore = () => {
      id.value = UUID()
      list.value = []
      options.value = deepClone(designerOptions)
      currentItem.value = undefined
    }

    const getBlockPlugins = () => {
      return blockPlugins.value
    }

    const setBlockPlugins = (plugins: BlockInfo) => {
      blockPlugins.value = plugins
    }

    return {
      id,
      // actions,
      list,
      options,
      currentItem,
      getCurrentItem,
      createByJsonString,
      isWidget,
      isSelected,
      addItem,
      copyItem,
      removeItem,
      findItemById,
      resetSelectedItem,
      selectItem,
      resetStore,
      getBlockPlugins,
      setBlockPlugins,
    }
  })(config.piniaInstance)
}

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useDesignerStore, import.meta.hot))
