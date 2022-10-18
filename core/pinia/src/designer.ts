import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { BlockInfo, BlockItem, DesignerSettings, DesignerTheme, FindedItem, TextSettings } from '@poto/types'
import { UUID, cloneItem, deepClone } from '@poto/utils'
import { isArray } from 'lodash'
import { designerOptions, designerTheme } from './constants'
import { config } from './config'

export const useDesignerStore = () => {
  if (!config.piniaInstance)
    console.error('[@poto/pinia]: create pinia first and pass instance to plugin')

  return defineStore('designer', () => {
    const id = ref(UUID())
    const list = ref<BlockItem[]>([])
    const options = ref<DesignerSettings>(deepClone(designerOptions))
    const theme = ref<DesignerTheme>(deepClone(designerTheme))
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
          theme.value = json.theme
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

    const instanceOfBlockItem = (object: any): object is BlockItem => {
      return 'blockType' in object
    }

    const replaceTheme = (cur: DesignerTheme, src: BlockItem | BlockItem[] | DesignerSettings, old?: DesignerTheme) => {
      if (!cur)
        return
      const replace = (item: BlockItem | DesignerSettings) => {
        if (instanceOfBlockItem(item)) {
          if (item.isCustom)
            return

          if (item.options.backgroundColor.type === 'single' && ((old && item.options.backgroundColor.options.colors[0] === old.backgroundColor) || !old))
            item.options.backgroundColor.options.colors[0] = cur.backgroundColor

          if (item.options.border.color.type === 'single' && ((old && item.options.border.color.options.colors[0] === old.primaryColor) || !old))
            item.options.border.color.options.colors[0] = cur.primaryColor

          const options = item.options as TextSettings
          if (!!options.font && options.font.color.type === 'single' && ((old && options.font.color.options.colors[0] === old.fontColor) || !old))
            options.font.color.options.colors[0] = cur.fontColor

          if (item.options.list)
            replaceTheme(cur, item.options.list, old)
        }
        else {
          if (item.backgroundColor.type === 'single' && ((old && item.backgroundColor.options.colors[0] === old.backgroundColor) || !old))
            item.backgroundColor.options.colors[0] = cur.backgroundColor

          if (item.border.color.type === 'single' && ((old && item.border.color.options.colors[0] === old.primaryColor) || !old))
            item.border.color.options.colors[0] = cur.primaryColor
        }
      }

      if (isArray(src)) {
        for (let i = 0, len = src.length; i < len; i++) {
          const item = src[i]
          replace(item)
        }
      }
      else {
        replace(src)
      }
    }

    const addItem = (src: BlockItem) => {
      const item = cloneItem(src)
      replaceTheme(theme.value, item)
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

    const resetTheme = () => {
      theme.value = deepClone(designerTheme)
    }

    const setTheme = (curTheme: DesignerTheme) => {
      const oldTheme = { ...theme.value }
      theme.value = curTheme
      replaceTheme(curTheme, list.value, oldTheme)
      replaceTheme(curTheme, options.value, oldTheme)
    }

    return {
      id,
      list,
      options,
      theme,
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
      resetTheme,
      setTheme,
    }
  })(config.piniaInstance)
}

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useDesignerStore, import.meta.hot))
