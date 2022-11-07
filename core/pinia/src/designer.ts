import { defineStore } from 'pinia'
import { computed, nextTick, ref, shallowRef } from 'vue'
import { useManualRefHistory, useWindowSize } from '@vueuse/core'
import type { BlockInfo, BlockItem, DesignerActionItem, DesignerSettings, DesignerTemplate, DesignerTheme, FindedItem, TextSettings } from '@poto/types'
import { UUID, cloneItem, deepClone } from '@poto/utils'
import { isArray } from 'lodash'
import { designerOptions, designerTheme } from './constants'
import { config } from './config'

type HistoryType = 'list' | 'options' | 'theme' | 'currentItemId'
type RecordStatus = 'recording' | 'stop' | 'pause'
type ReplayStatus = 'replaying' | 'stop' | 'pause'

export const useDesignerStore = () => {
  if (!config.piniaInstance)
    console.error('[@poto/pinia]: create pinia first and pass instance to plugin')

  return defineStore('designer', () => {
    const id = ref(UUID())
    const actions = ref<DesignerActionItem[]>([])
    const list = ref<BlockItem[]>([])
    const options = ref<DesignerSettings>(deepClone(designerOptions))
    const theme = ref<DesignerTheme>(deepClone(designerTheme))
    const currentItem = ref<BlockItem | undefined>(undefined)
    const currentItemId = ref<string | undefined>(undefined)
    const histories = ref <HistoryType[]>([])
    const ignoreListHis = ref(false)
    const ignoreOptionsHis = ref(false)
    const isRecord = ref(false)
    const isReplay = ref(false)
    const recordStatus = ref<RecordStatus>('stop')
    const replayStatus = ref<ReplayStatus>('stop')
    const listRecords = ref('')
    const optionsRecords = ref('')
    const themeRecords = ref('')
    const currentItemIdRecords = ref('')
    const replayTimer = ref()
    const replayDuration = ref(1000)
    const canReplayUndo = ref(false)
    const canReplayRedo = ref(false)
    let firstTimeUndo = true
    let firstTimeRedo = true

    const listHis = useManualRefHistory(list, { clone: true })
    const optionsHis = useManualRefHistory(options, { clone: true })
    const themeHis = useManualRefHistory(theme, { clone: true })
    const currentItemIdHis = useManualRefHistory(currentItemId)
    const historiesHis = useManualRefHistory(histories, { clone: true })

    const headerHeight = ref(40)
    const { height: windowHeight } = useWindowSize()
    const contentPanelHeight = computed(() => windowHeight.value - headerHeight.value - options.value.padding[0] - options.value.padding[3])
    const blockPlugins = shallowRef<BlockInfo | undefined>(undefined)

    const addHistory = async () => {
      if ((isReplay.value) || (isRecord.value && recordStatus.value === 'pause'))
        return

      const hisList: HistoryType[] = ['list', 'options', 'theme', 'currentItemId']
      for (let i = 0; i < hisList.length; i++) {
        switch (hisList[i]) {
          case 'list':
            ignoreListHis.value = true
            listHis.commit()
            break
          case 'options':
            ignoreOptionsHis.value = true
            optionsHis.commit()
            break
          case 'theme':
            themeHis.commit()
            break
          case 'currentItemId':
            currentItemIdHis.commit()
            break
          default:
            break
        }
      }
      if (hisList.length) {
        histories.value = hisList
        historiesHis.commit()
      }
      await nextTick(() => {
        if (ignoreListHis.value)
          ignoreListHis.value = false
        if (ignoreOptionsHis.value)
          ignoreOptionsHis.value = false
      })
    }

    const resetStore = () => {
      id.value = UUID()
      actions.value = []
      list.value = []
      options.value = deepClone(designerOptions)
      theme.value = deepClone(designerTheme)
      currentItem.value = undefined
      currentItemId.value = undefined
      listRecords.value = ''
      optionsRecords.value = ''
      themeRecords.value = ''
      currentItemIdRecords.value = ''

      listHis.clear()
      optionsHis.clear()
      themeHis.clear()
      currentItemIdHis.clear()
      // addHistory()
    }

    const resetRecords = () => {
      listRecords.value = ''
      optionsRecords.value = ''
      themeRecords.value = ''
      currentItemIdRecords.value = ''
    }

    const createByTemplate = (obj: DesignerTemplate) => {
      id.value = obj.id
      actions.value = obj.actions || []
      list.value = obj.list || []
      options.value = obj.options
      theme.value = obj.theme
      currentItem.value = undefined
      currentItemId.value = undefined

      listRecords.value = obj.listRecords || ''
      optionsRecords.value = obj.optionsRecords || ''
      themeRecords.value = obj.themeRecords || ''
      currentItemIdRecords.value = obj.currentItemIdRecords || ''

      // addHistory()
    }

    const createByJsonString = (str: string) => {
      try {
        const json = JSON.parse(str)
        if (typeof json === 'object') {
          resetStore()
          createByTemplate(json)
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
      currentItemId.value = item.id
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
          if (disabled) {
            currentItem.value = undefined
            currentItemId.value = undefined
          }
        }
      }
      else {
        setSelectedItem(item)
      }
    }

    const resetSelectedItem = () => {
      currentItem.value = undefined
      currentItemId.value = undefined
    }

    const isBlockItem = (object: any): object is BlockItem => {
      return 'blockType' in object
    }

    const replaceTheme = (cur: DesignerTheme, src: BlockItem | BlockItem[] | DesignerSettings, old?: DesignerTheme) => {
      if (!cur)
        return
      const replace = (item: BlockItem | DesignerSettings) => {
        if (isBlockItem(item)) {
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
      addHistory()
    }

    const removeItem = (item: BlockItem) => {
      const { parentList, index } = findItemById(list.value, item.id)
      if (parentList) {
        if (currentItem.value && item.id === currentItem.value.id) {
          currentItem.value = undefined
          currentItemId.value = undefined
        }

        parentList.splice(index, 1)
        addHistory()
      }
    }

    const copyItem = (item: BlockItem) => {
      const { parentList, index } = findItemById(list.value, item.id)
      if (parentList) {
        const _item = { ...item, id: UUID() }
        parentList.splice(index + 1, 0, _item)
        addHistory()
      }
    }

    const isSelected = (item: BlockItem) => {
      return !!currentItem.value && currentItem.value.id === item.id
    }

    const isWidget = (item: BlockItem) => {
      return item.category === 'widget'
    }

    const getBlockPlugins = () => {
      return blockPlugins.value
    }

    const setBlockPlugins = (plugins: BlockInfo) => {
      blockPlugins.value = plugins
    }

    const resetTheme = () => {
      theme.value = deepClone(designerTheme)
      addHistory()
    }

    const setTheme = (curTheme: DesignerTheme) => {
      const oldTheme = { ...theme.value }
      theme.value = curTheme
      replaceTheme(curTheme, list.value, oldTheme)
      replaceTheme(curTheme, options.value, oldTheme)
      addHistory()
    }

    const undo = async () => {
      if (firstTimeUndo)
        firstTimeUndo = false
      else
        historiesHis.undo()

      if (!firstTimeRedo)
        firstTimeRedo = true

      for (let i = 0, len = histories.value.length; i < len; i++) {
        const t = histories.value[i]
        switch (t) {
          case 'list':
            ignoreListHis.value = true
            listHis.undo()
            break

          case 'options':
            ignoreOptionsHis.value = true
            optionsHis.undo()
            break

          case 'theme':
            themeHis.undo()
            break

          case 'currentItemId':
            await nextTick(() => {
              currentItemIdHis.undo()
              currentItem.value = findItemById(list.value, currentItemId.value).item
            })
            break

          default:
            break
        }
      }
      await nextTick(() => {
        if (ignoreListHis.value)
          ignoreListHis.value = false
        if (ignoreOptionsHis.value)
          ignoreOptionsHis.value = false
      })
    }

    const redo = async () => {
      if (firstTimeRedo) {
        firstTimeRedo = false
        if (histories.value.length === 0)
          historiesHis.redo()
      }
      else { historiesHis.redo() }

      if (!firstTimeUndo)
        firstTimeUndo = true

      for (let i = 0, len = histories.value.length; i < len; i++) {
        const t = histories.value[i]
        switch (t) {
          case 'list':
            ignoreListHis.value = true
            listHis.redo()
            break

          case 'options':
            ignoreOptionsHis.value = true
            optionsHis.redo()
            break

          case 'theme':
            themeHis.redo()
            break

          case 'currentItemId':
            await nextTick(() => {
              currentItemIdHis.redo()
              currentItem.value = findItemById(list.value, currentItemId.value).item
            })
            break

          default:
            break
        }
      }

      await nextTick(() => {
        if (ignoreListHis.value)
          ignoreListHis.value = false
        if (ignoreOptionsHis.value)
          ignoreOptionsHis.value = false
      })
    }

    const addAction = (item: DesignerActionItem) => {
      actions.value.push(item)
    }

    const findAction = (id: string) => {
      return actions.value.find(item => item.id === id)
    }

    const cloneItemWithTheme = (src: BlockItem) => {
      const item = cloneItem(src)
      replaceTheme(theme.value, item)
      return item
    }

    const recordStart = () => {
      resetStore()
      isRecord.value = true
      recordStatus.value = 'recording'
    }

    const recordPause = () => {
      if (isRecord.value && recordStatus.value === 'recording')
        recordStatus.value = 'pause'
    }

    const recordResume = () => {
      if (isRecord.value && recordStatus.value === 'pause')
        recordStatus.value = 'recording'
    }

    const recordStop = () => {
      isRecord.value = false
      recordStatus.value = 'stop'
      listRecords.value = JSON.stringify(listHis.history.value.reverse())
      optionsRecords.value = JSON.stringify(optionsHis.history.value.reverse())
      themeRecords.value = JSON.stringify(themeHis.history.value.reverse())
      currentItemIdRecords.value = JSON.stringify(currentItemIdHis.history.value.reverse())
      // nextTick(() => {
      //   resetStore()
      // })
    }

    const getRecordStatus = () => {
      return recordStatus.value
    }

    const getReplayStatus = () => {
      return replayStatus.value
    }

    const replayStop = () => {
      isReplay.value = false
      replayStatus.value = 'stop'
      clearInterval(replayTimer.value)
      replayTimer.value = undefined
    }

    const replayUndo = async () => {
      canReplayUndo.value = true
      const hisList: HistoryType[] = ['list', 'options', 'theme', 'currentItemId']
      for (let i = 0, len = hisList.length; i < len; i++) {
        const t = hisList[i]
        switch (t) {
          case 'list':
            ignoreListHis.value = true
            if (listHis.canUndo.value) {
              listHis.undo()
              canReplayUndo.value = listHis.canUndo.value
              canReplayRedo.value = listHis.canRedo.value

              if (!canReplayUndo.value)
                replayStop()
            }
            else {
              canReplayUndo.value = false
              canReplayRedo.value = listHis.canRedo.value
              replayStop()
            }
            break

          case 'options':
            ignoreOptionsHis.value = true
            if (optionsHis.canUndo.value)
              optionsHis.undo()
            break

          case 'theme':
            if (themeHis.canUndo.value)
              themeHis.undo()
            break

          case 'currentItemId':
            if (currentItemIdHis.canUndo.value) {
              await nextTick(() => {
                currentItemIdHis.undo()
                currentItem.value = findItemById(list.value, currentItemId.value).item
              })
            }
            break

          default:
            break
        }
      }
      await nextTick(() => {
        if (ignoreListHis.value)
          ignoreListHis.value = false
        if (ignoreOptionsHis.value)
          ignoreOptionsHis.value = false
      })
    }

    const replayRedo = async () => {
      canReplayRedo.value = true
      const hisList: HistoryType[] = ['list', 'options', 'theme', 'currentItemId']
      for (let i = 0, len = hisList.length; i < len; i++) {
        const t = hisList[i]
        switch (t) {
          case 'list':
            ignoreListHis.value = true
            if (listHis.canRedo.value) {
              listHis.redo()
              canReplayRedo.value = listHis.canRedo.value
              canReplayUndo.value = listHis.canUndo.value
            }
            else {
              canReplayRedo.value = false
              canReplayUndo.value = listHis.canUndo.value
            }
            break

          case 'options':
            ignoreOptionsHis.value = true
            if (optionsHis.canRedo.value)
              optionsHis.redo()
            break

          case 'theme':
            if (themeHis.canRedo.value)
              themeHis.redo()
            break

          case 'currentItemId':
            if (currentItemIdHis.canRedo.value) {
              await nextTick(() => {
                currentItemIdHis.redo()
                currentItem.value = findItemById(list.value, currentItemId.value).item
              })
            }
            break

          default:
            break
        }
      }
      await nextTick(() => {
        if (ignoreListHis.value)
          ignoreListHis.value = false
        if (ignoreOptionsHis.value)
          ignoreOptionsHis.value = false
      })
    }

    const recordReplay = async () => {
      if (!isReplay.value) {
        isReplay.value = true
        canReplayUndo.value = true
        canReplayRedo.value = false
        replayStatus.value = 'replaying'
        if (listRecords.value) {
          listHis.undoStack.value = JSON.parse(listRecords.value)
          listHis.redoStack.value = []
          if (listHis.undoStack.value.length > 0)
            listHis.last.value = listHis.undoStack.value.shift()!
          else
            return
        }
        else { return }

        if (optionsRecords.value) {
          optionsHis.undoStack.value = JSON.parse(optionsRecords.value)
          optionsHis.redoStack.value = []
          if (optionsHis.undoStack.value.length > 0)
            optionsHis.last.value = optionsHis.undoStack.value.shift()!
          else
            return
        }
        else { return }

        if (themeRecords.value) {
          themeHis.undoStack.value = JSON.parse(themeRecords.value)
          themeHis.redoStack.value = []
          if (themeHis.undoStack.value.length > 0)
            themeHis.last.value = themeHis.undoStack.value.shift()!
          else
            return
        }
        else { return }

        if (currentItemIdRecords.value) {
          currentItemIdHis.undoStack.value = JSON.parse(currentItemIdRecords.value)
          currentItemIdHis.redoStack.value = []
          if (currentItemIdHis.undoStack.value.length > 0)
            currentItemIdHis.last.value = currentItemIdHis.undoStack.value.shift()!
          else
            return
        }
        else { return }

        replayUndo()
      }

      if (canReplayUndo.value) {
        if (replayTimer.value)
          clearInterval(replayTimer.value)

        replayTimer.value = setInterval(async () => {
          if (canReplayUndo.value)
            replayUndo()
          else
            replayStop()
        }, replayDuration.value)
      }
    }

    const replayPause = () => {
      replayStatus.value = 'pause'
      if (replayTimer.value)
        clearInterval(replayTimer.value)
    }

    const replayResume = () => {
      replayStatus.value = 'replaying'
      replayTimer.value = setInterval(async () => {
        if (canReplayUndo.value)
          replayUndo()
        else
          replayStop()
      }, replayDuration.value)
    }

    const replaySpeed = (duration: number) => {
      replayDuration.value = duration
      if (replayTimer.value)
        clearInterval(replayTimer.value)

      replayTimer.value = setInterval(async () => {
        if (canReplayUndo.value)
          replayUndo()
        else
          replayStop()
      }, replayDuration.value)
    }

    const replayReset = () => {
      while (canReplayUndo.value)
        replayUndo()
    }

    return {
      id,
      actions,
      list,
      options,
      theme,
      ignoreListHis,
      ignoreOptionsHis,
      currentItem,
      getCurrentItem,
      createByTemplate,
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
      undo,
      redo,
      addHistory,
      addAction,
      findAction,
      cloneItemWithTheme,
      listRecords,
      optionsRecords,
      themeRecords,
      currentItemIdRecords,
      recordStart,
      recordPause,
      recordResume,
      recordStop,
      recordReplay,
      getRecordStatus,
      getReplayStatus,
      resetRecords,
      replayUndo,
      replayRedo,
      replayPause,
      replayStop,
      replayResume,
      replaySpeed,
      replayReset,
      replayDuration,
      canReplayUndo,
      canReplayRedo,
      headerHeight,
    }
  })(config.piniaInstance)
}

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useDesignerStore, import.meta.hot))
