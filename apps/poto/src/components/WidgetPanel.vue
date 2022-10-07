<script setup lang="ts">
import type { CustomComponent, Item } from '~/types'
import { BlockComponents } from '~/utils/constants'
import { cloneItem } from '~/utils'

const designer = useDesignerStore()
const customComponents = useCustomComponentsStore()
const list: Item[] = Object.keys(BlockComponents).map((type) => {
  return BlockComponents[type].config
})

const cloneCustomComponent = (component: CustomComponent) => {
  return cloneItem(component.item)
}
const addItem = (item: Item) => {
  designer.addItem(item)
}
</script>

<template>
  <div>
    <draggable
      :list="list" item-key="key" :group="{ name: 'standard', pull: 'clone', put: false }"
      :clone="cloneItem" ghost-class="ghost" :sort="false"
    >
      <template #item="{ element }: { element: Item }">
        <div class="container-widget-item" :title="element.options.name" @dblclick="addItem(element)">
          <div class="icon-btn cursor-grab" :class="element.icon" text-2xl mb-2 />
          <!-- {{ element.options.name }} -->
        </div>
      </template>
    </draggable>
    <el-popover v-if="customComponents.components.length > 0" placement="right" :show-arrow="false" :width="300" :hide-after="100" popper-class="p-0!">
      <template #reference>
        <div title="Custom Components" class="icon-btn i-iconoir-view-structure-up" text-2xl mb-2 />
      </template>
      <template #default>
        <el-scrollbar max-height="50vh">
          <draggable
            :list="customComponents.components" item-key="id" :group="{ name: 'standard', pull: 'clone', put: false }"
            :clone="cloneCustomComponent" ghost-class="ghost" :sort="false"
          >
            <template #item="{ element }: { element: CustomComponent }">
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
                              <component :is="BlockComponents[element.item.blockType].widget" :item="element.item" :real-content="false" />
                            </layout-wrapper>
                          </div>
                        </div>
                      </template>
                    </el-popover>
                    <div class="i-carbon-trash-can cursor-pointer hover:text-red" @click="customComponents.removeComponent(element)" />
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
