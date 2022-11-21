<script setup lang="ts">
import type { BlockInfo, PotoTemplate } from '~/types'

interface Props {
  title: string
  template: PotoTemplate
  loadFun: (t: PotoTemplate) => void
  blockInfo: BlockInfo
}

defineProps<Props>()
</script>

<template>
  <div class="border rounded p-2 cursor-pointer shadow-sm hover:shadow-md m-3" @dblclick="loadFun(template)">
    <div flex justify-between>
      <div font-bold>
        {{ title }}
      </div>
      <div>
        <el-popover placement="right" :show-arrow="false" :width="377" :hide-after="100" popper-class="p-0!">
          <template #reference>
            <div class="i-iconoir-layout-left cursor-pointer hover:text-blue" @click="loadFun(template)" />
          </template>
          <template #default>
            <el-scrollbar max-height="50vh">
              <div
                class="w-750px h-750px scale-50 origin-top-left"
                :style="{ fontSize: `${template?.potoDesigner.theme.elFontSize}px` }"
              >
                <div
                  v-for="element in template?.potoDesigner.list"
                  :key="element.id"
                  :style="{ width: `${element.options.size.width}%` }"
                >
                  <wrapper v-if="!!blockInfo[element.blockType]" :item="element" is-preview>
                    <component :is="blockInfo[element.blockType].blockView" :item="element" is-preview />
                  </wrapper>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
