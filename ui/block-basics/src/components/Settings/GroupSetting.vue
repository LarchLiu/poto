<script setup lang="ts">
import type { GroupSettings } from '~/types'

const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const widgetOptions = computed(() => (currentItem.value ? currentItem.value.options as GroupSettings : undefined))
const alignStyle = (dir: string, idx: number) => {
  if (dir.includes('row')) {
    switch (idx) {
      case 1:
        return { width: '1.5rem', minHeight: '2rem' }
      case 2:
        return { width: '1.5rem', minHeight: '1.5rem' }
      case 3:
        return { width: '1.5rem', minHeight: '3rem' }
    }
  }
  else {
    switch (idx) {
      case 1:
        return { height: '1.5rem', minWidth: '2rem' }
      case 2:
        return { height: '1.5rem', minWidth: '1.5rem' }
      case 3:
        return { height: '1.5rem', minWidth: '3rem' }
    }
  }
}
const isRow = computed(() => {
  return widgetOptions.value && widgetOptions.value.flex.direction.includes('row')
})
</script>

<template>
  <div v-if="widgetOptions">
    <div class="italic font-bold mb-2">
      基本属性
    </div>
    <basic-setting />
    <el-form size="small">
      <div class="italic font-bold mb-2">
        组件属性
      </div>
      <el-tabs v-model="widgetOptions.containerType" style="height: 100%; width:100%; overflow: hidden">
        <el-tab-pane label="flex" name="flex">
          <el-form-item label="元素宽度">
            <!-- <input v-model="widgetOptions.flex.basis" class="w-4/5" type="range" :min="0" :max="100" :step="0.1"> -->
            <el-slider v-model="widgetOptions.flex.basis" class="mr-3" :step="0.1" />
          <!-- <span ml-1>{{ `${widgetOptions.flex.basis}%` }}</span> -->
          </el-form-item>
          <el-form-item label="排列">
            <div class="flex flex-col">
              <el-radio-group v-model="widgetOptions.flex.direction">
                <div class="flex flex-col">
                  <div>
                    <el-radio label="row">
                      行
                    </el-radio>
                    <el-radio label="row-reverse">
                      反向行
                    </el-radio>
                  </div>
                  <div>
                    <el-radio label="column">
                      列
                    </el-radio>
                    <el-radio label="column-reverse">
                      反向列
                    </el-radio>
                  </div>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="堆叠">
            <el-radio-group v-model="widgetOptions.flex.wrap">
              <el-radio-button label="nowrap">
                {{ isRow ? '单行' : '单列' }}
              </el-radio-button>
              <el-radio-button label="wrap">
                {{ isRow ? '多行' : '多列' }}
              </el-radio-button>
              <el-radio-button label="wrap-reverse">
                {{ isRow ? '反向多行' : '反向多列' }}
              </el-radio-button>
            </el-radio-group>
            <div class="pt-1">
              <div
                class="flex bg-teal-100 rounded-md p-1 w-36 h-36"
                :style="{ flexWrap: widgetOptions.flex.wrap, flexDirection: widgetOptions.flex.direction }"
              >
                <div class="border rounded-md border-red-300" :style="{ flexBasis: `${widgetOptions.flex.basis}%` }">
                  <div class="rounded-md bg-red-400 w-6 h-6 m-1" />
                </div>
                <div class="border rounded-md border-yellow-300" :style="{ flexBasis: `${widgetOptions.flex.basis}%` }">
                  <div class="rounded-md bg-yellow-400 w-6 h-6 m-1" />
                </div>
                <div class="border rounded-md border-green-300" :style="{ flexBasis: `${widgetOptions.flex.basis}%` }">
                  <div class="rounded-md bg-green-400 w-6 h-6 m-1" />
                </div>
                <div class="border rounded-md border-teal-300" :style="{ flexBasis: `${widgetOptions.flex.basis}%` }">
                  <div class="rounded-md bg-teal-400 w-6 h-6 m-1" />
                </div>
                <div class="border rounded-md border-blue-300" :style="{ flexBasis: `${widgetOptions.flex.basis}%` }">
                  <div class="rounded-md bg-blue-400 w-6 h-6 m-1" />
                </div>
                <div class="border rounded-md border-purple-300" :style="{ flexBasis: `${widgetOptions.flex.basis}%` }">
                  <div class="rounded-md bg-purple-400 w-6 h-6 m-1" />
                </div>
              </div>
            </div>
          </el-form-item>
          <div class="font-bold mb-2">
            对齐
          </div>
          <el-form-item :label="isRow ? '横向' : '纵向'">
            <el-radio-group v-model="widgetOptions.flex.justifyContent">
              <el-radio label="flex-start">
                {{ isRow ? '左对齐' : '上对齐' }}
              </el-radio>
              <el-radio label="flex-end">
                {{ isRow ? '右对齐' : '下对齐' }}
              </el-radio>
              <el-radio label="center">
                居中
              </el-radio>
              <el-radio label="space-between">
                两端对齐
              </el-radio>
              <el-radio label="space-around">
                均匀分布
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="isRow ? '纵向' : '横向'">
            <el-radio-group v-model="widgetOptions.flex.alignItems">
              <el-radio label="flex-start">
                {{ isRow ? '上对齐' : '左对齐' }}
              </el-radio>
              <el-radio label="flex-end">
                {{ isRow ? '下对齐' : '右对齐' }}
              </el-radio>
              <el-radio label="center">
                居中
              </el-radio>
              <el-radio label="baseline">
                基线
              </el-radio>
              <el-radio label="stretch">
                拉伸
              </el-radio>
            </el-radio-group>
            <div
              class="flex w-36 h-30 bg-teal-100 rounded-md p-1"
              :style="{
                justifyContent: widgetOptions.flex.justifyContent,
                flexDirection: widgetOptions.flex.direction,
                alignItems: widgetOptions.flex.alignItems,
              }"
            >
              <div class="rounded-md bg-red-400 m-1" :style="alignStyle(widgetOptions.flex.direction, 1)" />
              <div class="rounded-md bg-green-400 m-1" :style="alignStyle(widgetOptions.flex.direction, 2)" />
              <div class="rounded-md bg-blue-400 m-1" :style="alignStyle(widgetOptions.flex.direction, 3)" />
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="grid" name="grid" />
        <el-tab-pane label="absolute" name="absolute" />
      </el-tabs>
    </el-form>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 8px;
  }
</style>
