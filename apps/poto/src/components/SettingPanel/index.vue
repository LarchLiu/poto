<script setup lang="ts">
import { BlockPlugins } from '~/poto-auto-imports'
import { BlockBasics } from '~/utils'

const { t } = useI18n()
const blockInfo = { ...BlockBasics, ...BlockPlugins }
const activeTab = ref('2')
const { height: windowHeight } = useWindowSize()
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
      <el-tab-pane :label="t('settings.blockSetting.title')" name="1">
        <el-scrollbar class="setting-scrollbar" :style="{ height: scrollerHeight }">
          <component :is="blockInfo[currentItem.blockType].settingsView" v-if="currentItem" :key="currentItem.id" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="t('settings.designerSetting.title')" name="2">
        <el-scrollbar class="setting-scrollbar" :style="{ height: scrollerHeight }">
          <designer-setting />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="t('settings.actionsSetting.title')" name="3">
        <el-scrollbar class="setting-scrollbar" :style="{ height: scrollerHeight }">
          <action-setting />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped>

</style>
