<script setup lang="ts">
import type { PotoTemplate } from '~/types'
import { BlockPlugins } from '~/poto-auto-imports'

const { height: windowHeight } = useWindowSize()
const designer = useDesignerStore()
const actionsStore = useActionsStore()
const customBlocks = useCustomBlocksStore()
const widgetMenu = useWidgetMenuStore()
const potoActions = useLocalStorage('potoActions', '')
const potoCustomBlocks = useLocalStorage('potoCustomBlocks', '')
const potoDesigner = useLocalStorage('potoDesigner', '')
const page = ref<HTMLElement | null>(null)
const containerHeight = computed(() => `${windowHeight.value - 48 - 4}px`) // windowHeight - top header - main header - margin * 2
const contentPanelHeight = computed(() => `${windowHeight.value - 48}px`)
const showLayout = ref(true)
const potoTemplate = ref<PotoTemplate>()
const { t, locale } = useI18n()

const toggleLocales = (command: string) => {
  locale.value = command
}

const loadJsonFile = (name: string) => {
  const xhr = new XMLHttpRequest()
  const okStatus = document.location.protocol === 'file:' ? 0 : 200
  xhr.open('GET', name, false)
  xhr.overrideMimeType('application/json;charset=utf-8')// 默认为utf-8
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : ''
}

const saveJsonFile = (data: string) => {
  const blob = new Blob([data], { type: 'text/plain' })
  const a = document.createElement('a')
  a.download = 'template.json'
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  a.click()
}

const handleScreenShot = () => {
  toPng(page.value!.querySelector('.preview') as HTMLElement) // , { width: 750 })
    .then((dataUrl) => {
      const a = document.createElement('a')
      a.setAttribute('download', 'screenshot')
      a.href = dataUrl
      a.click()
    })
    .catch((error) => {
      console.error('oops, something went wrong!', error)
    })
}

const saveList = () => {
  potoActions.value = JSON.stringify(actionsStore.actions)
  potoCustomBlocks.value = JSON.stringify(customBlocks.components)

  potoDesigner.value = JSON.stringify({
    id: designer.id,
    actions: designer.actions || [],
    list: designer.list || [],
    options: designer.options,
    theme: designer.theme,
  })
}

const reloadList = () => {
  designer.createByJsonString(potoDesigner.value)
}

const resetList = () => {
  designer.resetStore()
}

const loadTemplate = async () => {
  if (potoTemplate.value) {
    designer.createByTemplate(potoTemplate.value.potoDesigner)
    customBlocks.createByTemplate(potoTemplate.value.potoCustomBlocks)
  }
}

const loadTemplateFromFile = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length <= 0)
    return false

  const fr = new FileReader()

  fr.onload = (e) => {
    if (e.target && e.target.result) {
      const result = JSON.parse(e.target.result as string)
      designer.createByTemplate(result.potoDesigner)
      customBlocks.createByTemplate(result.potoCustomBlocks)
    }
  }
  fr.readAsText(files!.item(0)!)
}

const record = () => {
  if (designer.getRecordStatus() === 'stop')
    designer.recordStart()
  else
    designer.recordStop()
}

const saveTemplate = () => {
  const template: PotoTemplate = {
    potoActions: [],
    potoCustomBlocks: customBlocks.components,
    potoDesigner: {
      id: designer.id,
      actions: designer.actions || [],
      list: designer.list || [],
      options: designer.options,
      theme: designer.theme,
      listRecords: designer.listRecords,
      optionsRecords: designer.optionsRecords,
      themeRecords: designer.themeRecords,
      currentItemIdRecords: designer.currentItemIdRecords,
    },
  }
  saveJsonFile(JSON.stringify(template))
}

onMounted(() => {
  actionsStore.createByJsonString(potoActions.value)
  customBlocks.createByJsonString(potoCustomBlocks.value)
  designer.setBlockPlugins(BlockPlugins)
  potoTemplate.value = JSON.parse(loadJsonFile(`${import.meta.env.BASE_URL}template.json`))
})
</script>

<template>
  <div id="page" ref="page" relative>
    <el-container class="bg-white h-full overflow-y-hidden">
      <el-header class="h-48px leading-48px min-w-800px border-b-2 border-#EBEEF5" flex items-center justify-between>
        <div>
          <span class="text-20px mx-6px font-bold text-#242424">Poto</span>
        </div>
        <div flex items-center>
          <el-button @click="saveList">
            {{ t('common.save') }}
          </el-button>
          <el-button @click="handleScreenShot">
            {{ t('common.download') }}
          </el-button>
          <el-button @click="reloadList">
            {{ t('common.reload') }}
          </el-button>
          <el-button @click="resetList">
            {{ t('common.reset') }}
          </el-button>
          <el-button @click="loadTemplate">
            {{ t('common.template') }}
          </el-button>
          <el-button @click="designer.undo()">
            {{ t('common.undo') }}
          </el-button>
          <el-button @click="designer.redo()">
            {{ t('common.redo') }}
          </el-button>
          <el-button @click="record()">
            {{ designer.getRecordStatus() === 'stop' ? 'record' : 'stop' }}
          </el-button>
          <div i-material-symbols-download class="cursor-pointer text-2xl ml-1" :title="t('common.saveTemplate')" @click="saveTemplate()" />
          <label for="json_upload" class="cursor-pointer ml-1" :title="t('common.loadTemplate')">
            <div i-material-symbols-upload-sharp class="text-2xl" />
          </label>
          <input id="json_upload" class="w-0px h-0px" type="file" accept=".json" @change="loadTemplateFromFile">
          <div
            v-if="designer.listRecords"
            i-material-symbols-play-circle-outline
            class="cursor-pointer text-2xl ml-1"
            :title="t('common.replayTemplate')"
            @click="designer.recordReplay()"
          />
        </div>
        <div flex items-center>
          <el-dropdown @command="toggleLocales">
            <button type="button" :title="t('common.languages')">
              <div i-ion-language-outline class="text-xl" />
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="en">
                  English
                </el-dropdown-item>
                <el-dropdown-item command="zh-CN">
                  中文
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside class="sticky w-50px">
          <div border-r-2>
            <div :style="{ height: contentPanelHeight }" flex items-center justify-center>
              <block-panel />
            </div>
          </div>
        </el-aside>

        <el-aside class="overflow-y-hidden" :class="showLayout ? 'w-780px' : 'w-30px'" flex :style="{ minHeight: contentPanelHeight }">
          <el-scrollbar v-if="showLayout" w-750px bg-white :style="{ height: contentPanelHeight }">
            <layout-panel />
          </el-scrollbar>

          <div :style="{ height: contentPanelHeight }" flex items-center justify-center bg-light-700 w-30px>
            <div bg-white w-24px h-50px border rounded-lg cursor-pointer flex items-center justify-center @click="showLayout = !showLayout">
              <div :class="showLayout ? 'i-carbon-page-first' : 'i-carbon-page-last'" text-14px color-gray-500 />
            </div>
          </div>
        </el-aside>

        <el-container class="shrink-0 min-w-680px bg-light-700">
          <el-main class="p-0">
            <el-scrollbar bg-white w-750px mx-auto scale-100 :style="{ height: containerHeight }">
              <designer-panel />
            </el-scrollbar>
          </el-main>
        </el-container>

        <el-aside border-l-2>
          <setting-panel />
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped lang="scss">
  :deep(aside) {
    margin: 0;
    padding: 0;
    background: inherit;
  }
  :deep(.el-scrollbar), :deep(.el-scrollbar__wrap), :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
  :deep(.ghost) {
    opacity: 0.5;
  }
  :deep(.menu-position) {
    position: absolute;
    left: v-bind('`${widgetMenu.left}px`');
    top: v-bind('`${widgetMenu.top}px`');
  }
</style>
