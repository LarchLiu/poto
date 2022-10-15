<script setup lang="ts">
const { height: windowHeight } = useWindowSize()
// const designer = useDesigner()
const designer = useDesignerStore()
const actionsStore = useActionsStore()
const customBlocks = useCustomBlocksStore()
const widgetMenu = useWidgetMenuStore()
// const jsonList = useLocalStorage('jsonList', '')
const jsonActions = useLocalStorage('jsonActions', '')
const jsonComponents = useLocalStorage('jsonCustomBlocks', '')
const jsonDesigner = useLocalStorage('jsonDesigner', '')
const page = ref<HTMLElement | null>(null)
// provide('designer', designer)
const containerHeight = computed(() => `${windowHeight.value - 48 - 4}px`) // windowHeight - top header - main header - margin * 2
const contentPanelHeight = computed(() => `${windowHeight.value - 48}px`)
const showLayout = ref(true)

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
  // jsonList.value = JSON.stringify(designer.list.value)
  jsonActions.value = JSON.stringify(actionsStore.actions)
  jsonComponents.value = JSON.stringify(customBlocks.components)

  jsonDesigner.value = JSON.stringify({
    id: designer.id,
    list: designer.list,
    options: designer.options,
  })
}

const reloadList = () => {
  // designer.list = (JSON.parse(jsonDesigner.value)).list // jsonList.value ? JSON.parse(jsonList.value) : []
  // designer.actions.value = jsonActions.value ? JSON.parse(jsonActions.value) : []
  // designer.options = (JSON.parse(jsonDesigner.value)).options // { ...JSON.parse(jsonOptions.value) }
  designer.createByJsonString(jsonDesigner.value)
  // designer.resetSelectedItem()
}

const resetList = () => {
  // designer.list.value = []
  // designer.actions.value = []
  // designer.options.value = designerOptions
  designer.resetStore()
}

const apiTest = async () => {
  // const { data } = await useFetch('https://dummyjson.com/products?limit=5')
  // console.log(typeof data.value)
  ElMessage('test')
  // Api.request(
  //   {
  //     method: 'GET',
  //     url: 'https://dummyjson.com/products',
  //   },
  //   (data) => {
  //     const rawData = data.data
  //     console.log(rawData)
  //   },
  // )
}
onMounted(() => {
  actionsStore.createByJsonString(jsonActions.value)
  customBlocks.createByJsonString(jsonComponents.value)
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
            save
          </el-button>
          <el-button @click="handleScreenShot">
            截图
          </el-button>
          <el-button @click="reloadList">
            reload
          </el-button>
          <el-button @click="resetList">
            reset
          </el-button>
          <el-button @click="apiTest">
            API
          </el-button>
        </div>
        <div>
          退出
        </div>
      </el-header>
      <el-container>
        <el-aside class="sticky w-50px" z-9999>
          <div border-r-2>
            <div :style="{ height: contentPanelHeight }" flex items-center justify-center>
              <widget-panel />
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
