<script setup lang="ts">
import { BlockPlugins } from '~/poto-auto-imports'
import type { BlockItem, CustomBlock } from '~/types'
import { BlockBasics } from '~/utils'

const { t } = useI18n()
const designer = useDesignerStore()
const customBlocks = useCustomBlocksStore()
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
</script>

<template>
  <div>
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
                    <div font-bold>
                      {{ element.options.name }}
                    </div>
                    <div flex>
                      <el-popover placement="top" :show-arrow="false" :width="375" :hide-after="100" popper-class="p-0!">
                        <template #reference>
                          <div class="i-clarity-plugin-line cursor-pointer hover:text-blue" @click="addItem(element)" />
                        </template>
                        <template #default>
                          <div w-750px scale-50 origin-left>
                            <div :style="{ width: `${element.options.size.width}%` }">
                              <component :is="BlockPlugins[element.blockType].blockView" :item="element" :real-content="false" />
                            </div>
                          </div>
                        </template>
                      </el-popover>
                    </div>
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
                      <el-popover placement="top" :show-arrow="false" :width="375" :hide-after="100" popper-class="p-0!">
                        <template #reference>
                          <div class="i-iconoir-view-structure-up cursor-pointer hover:text-blue ml-2" @click="addItem(element.item)" />
                        </template>
                        <template #default>
                          <div w-750px scale-50 origin-left>
                            <div :style="{ width: `${element.item.options.size.width}%` }">
                              <component :is="BlockBasics[element.item.blockType].blockView" :item="element.item" :real-content="false" />
                            </div>
                          </div>
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
</template>

<style scoped>

</style>
