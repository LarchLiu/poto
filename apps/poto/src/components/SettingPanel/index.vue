<script setup lang="ts">
// import type { Designer } from '~/types'
import { BlockComponents } from '~/utils/constants'

const activeTab = ref('2')
const { height: windowHeight } = useWindowSize()
// const designer = inject('designer') as Designer
const designer = useDesignerStore()
const scrollerHeight = computed(() => `${windowHeight.value - 48 - 55}px`)
const currentItem = computed(() => designer.getCurrentItem())
watch(currentItem, () => {
  if (currentItem.value)
    activeTab.value = '1'
  else
    activeTab.value = '2'
})
</script>

<template>
  <el-container class="px-2">
    <el-tabs v-model="activeTab" style="height: 100%; width:100%; overflow: hidden">
      <el-tab-pane label="组件设置" name="1">
        <el-scrollbar class="setting-scrollbar" :style="{ height: scrollerHeight }">
          <component :is="BlockComponents[currentItem.blockType].setting" v-if="currentItem" :key="currentItem.id" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="页面设置" name="2">
        <el-scrollbar class="setting-scrollbar" :style="{ height: scrollerHeight }">
          <designer-setting />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="数据设置" name="3">
        <el-scrollbar class="setting-scrollbar" :style="{ height: scrollerHeight }">
          <action-setting />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped>

</style>
