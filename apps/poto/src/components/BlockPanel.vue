<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { BlockPlugins } from '~/poto-auto-imports'
import type { BlockItem, CustomBlock, PotoTemplate } from '~/types'
import { BlockBasics } from '~/utils'

interface PTemplate {
  name?: string
  potoTempalte: PotoTemplate | undefined
}

defineProps({
  height: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['export'])
const { t } = useI18n()
const designer = useDesignerStore()
const customBlocks = useCustomBlocksStore()
const actionsStore = useActionsStore()
const potoActions = useLocalStorage('potoActions', '')
const potoCustomBlocks = useLocalStorage('potoCustomBlocks', '')
const potoDesigner = useLocalStorage('potoDesigner', '')
const md = new MarkdownIt()
const templateList = ref<PTemplate[]>([])
const blockInfo = { ...BlockBasics, ...BlockPlugins }
const basicsList: BlockItem[] = Object.keys(BlockBasics).map((type) => {
  return BlockBasics[type].config
})
const pluginsList: BlockItem[] = Object.keys(BlockPlugins).map((type) => {
  return BlockPlugins[type].config
})

const cloneCustomComponent = (component: CustomBlock) => {
  return designer.cloneItemWithTheme(component.item)
}
const addItem = (item: BlockItem) => {
  designer.addItem(item)
}

const tempList = ref()
const dragStart = () => {
  designer.ignoreListHis = true
  tempList.value = JSON.stringify(designer.list)
}
const dragEnd = async () => {
  await nextTick(() => {
    if (designer.ignoreListHis)
      designer.ignoreListHis = false
    if (tempList.value !== JSON.stringify(designer.list))
      designer.addHistory()
  })
}

const handleScreenShot = (type: string) => {
  emit('export', type)
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
  ElNotification.success({
    message: t('common.saveToStorage'),
    position: 'bottom-left',
  })
}

const reloadList = () => {
  designer.createByJsonString(potoDesigner.value)
}

const loadTemplate = (t: PotoTemplate | undefined) => {
  if (t) {
    designer.createByTemplate(t.potoDesigner)
    customBlocks.createByTemplate(t.potoCustomBlocks)
  }
}

const recordTemplateStart = () => {
  if (designer.getRecordStatus() === 'stop')
    designer.recordStart()
  else
    designer.recordStop()
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

const loadLocalTemplate = async (path: string) => {
  const { data } = await useFetch(path).get().json()
  return data.value as PotoTemplate
}

const canUndo = () => {
  return designer.canUndo() && designer.getReplayStatus() === 'stop'
}

const canRedo = () => {
  return designer.canRedo() && designer.getReplayStatus() === 'stop'
}

const undo = () => {
  if (canUndo())
    designer.undo()
}

const redo = () => {
  if (canRedo())
    designer.redo()
}

const saveJsonFile = (data: string) => {
  const blob = new Blob([data], { type: 'text/plain' })
  const a = document.createElement('a')
  a.download = 'template.json'
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  a.click()
}

const saveTemplate = () => {
  designer.replayReset()
  const template: PotoTemplate = {
    potoActions: [],
    potoCustomBlocks: customBlocks.components,
    potoDesigner: {
      id: designer.id,
      actions: designer.actions || [],
      list: designer.list || [],
      options: designer.options,
      theme: designer.theme,
    },
  }
  saveJsonFile(JSON.stringify(template))
}

onMounted(async () => {
  templateList.value.push({
    potoTempalte: (await loadLocalTemplate(`${import.meta.env.BASE_URL}template/basic-use.json`)),
  })
  templateList.value.push({
    potoTempalte: (await loadLocalTemplate(`${import.meta.env.BASE_URL}template/action-list.json`)),
  })
  templateList.value.push({
    potoTempalte: (await loadLocalTemplate(`${import.meta.env.BASE_URL}template/world-cup.json`)),
  })
  templateList.value.push({
    potoTempalte: (await loadLocalTemplate(`${import.meta.env.BASE_URL}template/onthisday.json`)),
  })
})
</script>

<template>
  <div class="flex flex-col justify-between" :style="{ height }">
    <div class="flex flex-col items-center justify-center">
      <el-popover placement="right" :show-arrow="false" :width="300" :hide-after="100" popper-class="p-0!">
        <template #reference>
          <div :title="t('common.template')" class="icon-btn i-iconoir-layout-left text-2xl my-2" />
        </template>

        <template #default>
          <el-scrollbar max-height="50vh">
            <div class="flex items-center ml-4 mt-2">
              <div i-material-symbols-play-circle-outline class="cursor-pointer text-2xl" :title="t('common.recordTemplate')" @click="recordTemplateStart" />
              <el-divider direction="vertical" />
              <label for="json_upload" class="cursor-pointer" :title="t('common.uploadTemplate')">
                <div i-material-symbols-upload class="text-2xl" />
              </label>
              <input id="json_upload" class="w-0px h-0px" type="file" accept=".json" @change="loadTemplateFromFile">
            </div>
            <div v-for="temp, i in templateList" :key="`${temp.name}-${i}`">
              <TemplateItem
                v-if="temp.potoTempalte"
                :title="temp.potoTempalte.potoDesigner.name ? temp.potoTempalte.potoDesigner.name : temp.name ? temp.name : `Template ${i + 1}`"
                :block-info="blockInfo" :template="temp.potoTempalte"
                :load-fun="loadTemplate"
              />
            </div>
          </el-scrollbar>
        </template>
      </el-popover>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <div
          :title="t('common.undo')"
          class="i-carbon-undo text-2xl mb-2"
          :class="canUndo() ? 'icon-btn opacity-100' : 'opacity-40 cursor-not-allowed'"
          @click="undo()"
        />
        <div
          :title="t('common.redo')"
          class="i-carbon-redo text-2xl mb-2"
          :class="canRedo() ? 'icon-btn opacity-100' : 'opacity-40 cursor-not-allowed'"
          @click="redo()"
        />
        <div :title="t('common.reset')" class="icon-btn i-carbon-reset text-2xl" @click="designer.resetStore()" />
        <el-divider class="my-2" />
      </div>

      <draggable
        :list="basicsList" item-key="key" :group="{ name: 'standard', pull: 'clone', put: false }"
        :clone="designer.cloneItemWithTheme" ghost-class="ghost" :sort="false"
        @start="dragStart"
        @end="dragEnd"
      >
        <template #item="{ element }: { element: BlockItem }">
          <div class="container-widget-item" :title="t(`blockPanel.${element.blockType}`)" @dblclick="addItem(element)">
            <div class="icon-btn cursor-grab" :class="element.icon" text-2xl mb-2 />
          <!-- {{ element.options.name }} -->
          </div>
        </template>
      </draggable>

      <div v-if="pluginsList.length > 0">
        <el-popover placement="right" :show-arrow="false" :width="300" :hide-after="100" popper-class="p-0!">
          <template #reference>
            <div :title="t('blockPanel.plugins')" class="icon-btn i-clarity-plugin-line" text-2xl mb-2 />
          </template>
          <template #default>
            <el-scrollbar max-height="50vh">
              <draggable
                :list="pluginsList" item-key="id" :group="{ name: 'standard', pull: 'clone', put: false }"
                :clone="designer.cloneItemWithTheme" ghost-class="ghost" :sort="false"
              >
                <template #item="{ element }: { element: BlockItem }">
                  <div class="border rounded p-2 cursor-grab shadow-sm hover:shadow-md m-3" @dblclick="addItem(element)">
                    <div flex justify-between>
                      <div class="flex items-center">
                        <div v-if="element.icon" :class="element.icon" text-2xl mr-2 />
                        <div font-bold>
                          {{ element.options.name }}
                        </div>
                      </div>

                      <div flex>
                        <el-popover placement="top" :show-arrow="false" :width="377" :hide-after="100" popper-class="p-0!">
                          <template #reference>
                            <div class="i-clarity-plugin-line cursor-pointer hover:text-blue" @click="addItem(element)" />
                          </template>
                          <template #default>
                            <el-scrollbar max-height="50vh">
                              <div
                                class="w-750px max-h-200px scale-50 origin-top-left"
                                :style="{ fontSize: `${designer.theme.elFontSize}px` }"
                              >
                                <div :style="{ width: `${element.options.size.width}%` }">
                                  <component :is="BlockPlugins[element.blockType].blockView" :item="element" is-preview />
                                </div>
                              </div>
                            </el-scrollbar>
                          </template>
                        </el-popover>
                      </div>
                    </div>
                    <div v-if="element.author" flex justify-end mt-1>
                      <div text-gray mr-1 text-sm>
                        Created by
                      </div>
                      <div underline v-html="md.render(element.author)" />
                    </div>
                  </div>
                </template>
              </draggable>
            </el-scrollbar>
          </template>
        </el-popover>
      </div>
      <div v-if="customBlocks.components.length > 0">
        <el-popover placement="right" :show-arrow="false" :width="300" :hide-after="100" popper-class="p-0!">
          <template #reference>
            <div :title="t('blockPanel.customBlocks')" class="icon-btn i-iconoir-view-structure-up" text-2xl mb-2 />
          </template>
          <template #default>
            <el-scrollbar max-height="50vh">
              <draggable
                :list="customBlocks.components" item-key="id" :group="{ name: 'standard', pull: 'clone', put: false }"
                :clone="cloneCustomComponent" ghost-class="ghost" :sort="false"
              >
                <template #item="{ element }: { element: CustomBlock }">
                  <div class="border rounded p-2 cursor-grab shadow-sm hover:shadow-md m-3" @dblclick="addItem(element.item)">
                    <div flex justify-between>
                      <div font-bold>
                        {{ element.name }}
                      </div>

                      <div flex>
                        <el-popover placement="top" :show-arrow="false" :width="377" :hide-after="100" popper-class="p-0!">
                          <template #reference>
                            <div class="i-iconoir-view-structure-up cursor-pointer hover:text-blue ml-2" @click="addItem(element.item)" />
                          </template>
                          <template #default>
                            <el-scrollbar max-height="50vh">
                              <div
                                class="w-750px max-h-200px scale-50 origin-top-left"
                                :style="{ fontSize: `${designer.theme.elFontSize}px` }"
                              >
                                <div :style="{ width: `${element.item.options.size.width}%` }">
                                  <component :is="BlockBasics[element.item.blockType].blockView" :item="element.item" is-preview />
                                </div>
                              </div>
                            </el-scrollbar>
                          </template>
                        </el-popover>
                        <div class="i-carbon-trash-can cursor-pointer hover:text-red ml-1" @click="customBlocks.removeComponent(element)" />
                      </div>
                    </div>
                    <div v-if="element.description">
                      <div text-gray>
                        {{ element.description }}
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </el-scrollbar>
          </template>
        </el-popover>
      </div>
    </div>
    <div flex flex-col items-center justify-center>
      <el-popover placement="right" :show-arrow="false" :hide-after="100" popper-class="p-0!">
        <template #reference>
          <div :title="t('common.exportAs')" class="icon-btn i-iconoir-screenshot text-2xl mb-2" />
        </template>
        <template #default>
          <el-scrollbar max-height="50vh">
            <div class="ml-4 my-2">
              <div class="cursor-pointer mb-2" @click="handleScreenShot('png')">
                {{ t('common.png') }}
              </div>

              <div class="cursor-pointer mb-2" @click="handleScreenShot('svg')">
                {{ t('common.svg') }}
              </div>

              <div class="cursor-pointer" @click="handleScreenShot('jpg')">
                {{ t('common.jpg') }}
              </div>
            </div>
          </el-scrollbar>
        </template>
      </el-popover>
      <el-popover placement="right" :show-arrow="false" :hide-after="100" popper-class="p-0!">
        <template #reference>
          <div :title="t('common.saveAs')" class="icon-btn i-carbon-save text-2xl mb-2" />
        </template>
        <template #default>
          <el-scrollbar max-height="50vh">
            <div class="ml-4 my-2">
              <div class="cursor-pointer mb-2" @click="saveList">
                {{ t('common.localStorage') }}
              </div>
              <div class="cursor-pointer mb-2" @click="saveTemplate">
                {{ t('common.jsonFile') }}
              </div>
            </div>
          </el-scrollbar>
        </template>
      </el-popover>

      <div :title="t('common.reload')" class="icon-btn i-ant-design-delivered-procedure-outlined text-2xl mb-2" @click="reloadList" />
    </div>
  </div>
</template>

<style scoped>

</style>
