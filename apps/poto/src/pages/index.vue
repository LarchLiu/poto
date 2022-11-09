<script setup lang="ts">
import { BlockPlugins } from '~/poto-auto-imports'
import { HeaderHeight } from '~/utils'

const { height: windowHeight } = useWindowSize()
const designer = useDesignerStore()
const actionsStore = useActionsStore()
const customBlocks = useCustomBlocksStore()
const widgetMenu = useWidgetMenuStore()
const potoActions = useLocalStorage('potoActions', '')
const potoCustomBlocks = useLocalStorage('potoCustomBlocks', '')
const page = ref<HTMLElement | null>(null)
const designerHeight = computed(() => `${windowHeight.value - HeaderHeight - 4}px`) // windowHeight - header - margin * 2
const contentPanelHeight = computed(() => `${windowHeight.value - HeaderHeight}px`)
const showLayout = ref(true)

const handleScreenShot = (type: string) => {
  if (type === 'png') {
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
  else if (type === 'svg') {
    toSvg(page.value!.querySelector('.preview') as HTMLElement) // , { width: 750 })
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
  else if (type === 'jpg') {
    toJpeg(page.value!.querySelector('.preview') as HTMLElement) // , { width: 750 })
      .then((dataUrl) => {
        const a = document.createElement('a')
        a.setAttribute('download', 'screenshot')
        a.href = dataUrl
        a.click()
      })
      .catch((error) => {
        ElMessage.error('oops, something went wrong!')
        console.error('oops, something went wrong!', error)
      })
  }
}

onMounted(() => {
  actionsStore.createByJsonString(potoActions.value)
  customBlocks.createByJsonString(potoCustomBlocks.value)
  designer.setBlockPlugins(BlockPlugins)
  designer.headerHeight = HeaderHeight
})
</script>

<template>
  <div id="page" ref="page" relative>
    <el-container class="bg-white h-full overflow-y-hidden">
      <el-header
        class="min-w-800px border-b-2 border-#EBEEF5 flex items-center justify-between"
        :style="{ height: `${HeaderHeight}px` }"
      >
        <header-panel />
      </el-header>
      <el-container>
        <el-aside class="sticky w-50px">
          <div class="border-r-2">
            <block-panel :height="contentPanelHeight" @export="handleScreenShot" />
          </div>
        </el-aside>

        <el-aside
          class="flex overflow-y-hidden"
          :class="showLayout ? 'w-780px' : 'w-30px'"
          :style="{ minHeight: contentPanelHeight }"
        >
          <el-scrollbar v-if="showLayout" class="w-750px bg-white" :style="{ height: contentPanelHeight }">
            <layout-panel />
          </el-scrollbar>

          <div :style="{ height: contentPanelHeight }" class="flex items-center justify-center bg-light-700 w-30px">
            <div
              class="bg-white w-24px h-50px border rounded-lg cursor-pointer flex items-center justify-center"
              @click="showLayout = !showLayout"
            >
              <div :class="showLayout ? 'i-carbon-page-first' : 'i-carbon-page-last'" class="text-14px color-gray-500" />
            </div>
          </div>
        </el-aside>

        <el-container class="shrink-0 min-w-680px bg-light-700">
          <el-main class="p-0">
            <el-scrollbar class="bg-white w-750px mx-auto scale-100" :style="{ height: designerHeight }">
              <designer-panel />
            </el-scrollbar>
          </el-main>
        </el-container>

        <el-aside class="w-324px border-l-2">
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
