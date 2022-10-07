import { cloneDeep } from 'lodash'
import type { FindedItem, Item } from '~/types'
import { UUID, cloneItem } from '~/utils'
import { designerOptions } from '~/utils/constants'

export const useDesignerStore = defineStore('designer', () => {
  const id = ref(UUID())
  const list = ref<Item[]>([])
  const options = ref(cloneDeep(designerOptions))
  // const actions = useActionsStore()
  const currentItem = ref<Item | undefined>(undefined)
  const { height: windowHeight } = useWindowSize()
  const contentPanelHeight = computed(() => windowHeight.value - 48 - 16)

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

  const findItemById = (src: Item[], id?: string): FindedItem => {
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

  const getCurrentItem = (): Item | undefined => {
    return currentItem.value
  }

  const setSelectedItem = (item: Item) => {
    currentItem.value = item
    const scrollTo = document.getElementById(`${item.type}-${item.id}`)
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
        const scrollTo = document.getElementById(`${item.type}-${item.id}`)
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

  const selectItem = (item: Item, disabled = false) => {
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

  const addItem = (src: Item) => {
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

  const removeItem = (item: Item) => {
    const { parentList, index } = findItemById(list.value, item.id)
    if (parentList)
      parentList.splice(index, 1)
  }

  const copyItem = (item: Item) => {
    const { parentList, index } = findItemById(list.value, item.id)
    if (parentList) {
      const _item = { ...item, id: UUID() }
      parentList.splice(index + 1, 0, _item)
    }
  }

  const isSelected = (item: Item) => {
    return !!currentItem.value && currentItem.value.id === item.id
  }

  const isWidget = (item: Item) => {
    return item.type === 'widget'
  }

  const resetStore = () => {
    id.value = UUID()
    list.value = []
    options.value = cloneDeep(designerOptions)
    currentItem.value = undefined
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
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDesignerStore, import.meta.hot))
