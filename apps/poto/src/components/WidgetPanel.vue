<script setup lang="ts">
import type { BlockItem, CustomBlock } from '~/types'
import { BlockBasics, cloneItem } from '~/utils'

const designer = useDesignerStore()
const customBlocks = useCustomBlocksStore()
const list: BlockItem[] = Object.keys(BlockBasics).map((type) => {
  return BlockBasics[type].config
})

const cloneCustomComponent = (component: CustomBlock) => {
  return cloneItem(component.item)
}
const addItem = (item: BlockItem) => {
  designer.addItem(item)
}
</script>

<template>
  <div>
    <draggable
      :list="list" item-key="key" :group="{ name: 'standard', pull: 'clone', put: false }"
      :clone="cloneItem" ghost-class="ghost" :sort="false"
    >
      <template #item="{ element }: { element: BlockItem }">
        <div class="container-widget-item" :title="element.options.name" @dblclick="addItem(element)">
          <div class="icon-btn cursor-grab" :class="element.icon" text-2xl mb-2 />
          <!-- {{ element.options.name }} -->
        </div>
      </template>
    </draggable>
    <el-popover v-if="customBlocks.components.length > 0" placement="right" :show-arrow="false" :width="300" :hide-after="100" popper-class="p-0!">
      <template #reference>
        <div title="Custom Components" class="icon-btn i-iconoir-view-structure-up" text-2xl mb-2 />
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
                        <div class="i-iconoir-view-structure-up cursor-pointer hover:text-blue" @click="addItem(element.item)" />
                      </template>
                      <template #default>
                        <div w-750px scale-50 origin-left>
                          <div :style="{ width: `${element.item.options.size.width}%` }">
                            <layout-wrapper :item="element.item">
                              <component :is="BlockBasics[element.item.blockType].blockView" :item="element.item" :real-content="false" />
                            </layout-wrapper>
                          </div>
                        </div>
                      </template>
                    </el-popover>
                    <div class="i-carbon-trash-can cursor-pointer hover:text-red" @click="customBlocks.removeComponent(element)" />
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
</template>

<style scoped>

</style>
