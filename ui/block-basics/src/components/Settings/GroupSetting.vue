<script setup lang="ts">
import type { GroupSettings } from '~/types'
import { i18nMessages } from '~/constants'

const { t } = useI18n({
  messages: i18nMessages,
})
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

watch(currentItem, (n, o) => {
  if (!n || !o || n.id !== o.id || designer.ignoreListHis) {
    if (designer.ignoreListHis)
      designer.ignoreListHis = false
    return
  }

  designer.addHistory()
}, {
  deep: true,
})
</script>

<template>
  <div v-if="widgetOptions">
    <div class="italic font-bold mb-2">
      {{ t('basicSettings.title') }}
    </div>
    <basic-setting />
    <el-form size="small">
      <div class="italic font-bold mb-2">
        {{ t('componentSettings.title') }}
      </div>
      <el-tabs v-model="widgetOptions.containerType" style="height: 100%; width:100%; overflow: hidden">
        <el-tab-pane label="flex" name="flex">
          <el-form-item :label="t('componentSettings.groupSettings.flexBasis')">
            <!-- <input v-model="widgetOptions.flex.basis" class="w-4/5" type="range" :min="0" :max="100" :step="0.1"> -->
            <el-slider v-model="widgetOptions.flex.basis" class="mr-3" :step="0.1" />
          <!-- <span ml-1>{{ `${widgetOptions.flex.basis}%` }}</span> -->
          </el-form-item>
          <el-form-item :label="t('componentSettings.groupSettings.flexDirection')">
            <div class="flex flex-col">
              <el-radio-group v-model="widgetOptions.flex.direction">
                <div class="flex flex-col">
                  <div>
                    <el-radio label="row">
                      {{ t('componentSettings.groupSettings.flexRow') }}
                    </el-radio>
                    <el-radio label="row-reverse">
                      {{ t('componentSettings.groupSettings.flexRowReverse') }}
                    </el-radio>
                  </div>
                  <div>
                    <el-radio label="column">
                      {{ t('componentSettings.groupSettings.flexCol') }}
                    </el-radio>
                    <el-radio label="column-reverse">
                      {{ t('componentSettings.groupSettings.flexColReverse') }}
                    </el-radio>
                  </div>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item :label="t('componentSettings.groupSettings.flexWrap')">
            <el-radio-group v-model="widgetOptions.flex.wrap">
              <el-radio-button label="nowrap">
                {{ isRow ? t('componentSettings.groupSettings.flexRowNoWrap') : t('componentSettings.groupSettings.flexColNoWrap') }}
              </el-radio-button>
              <el-radio-button label="wrap">
                {{ isRow ? t('componentSettings.groupSettings.flexRowWrap') : t('componentSettings.groupSettings.flexColWrap') }}
              </el-radio-button>
              <el-radio-button label="wrap-reverse">
                {{ isRow ? t('componentSettings.groupSettings.flexRowWrapReverse') : t('componentSettings.groupSettings.flexColWrapReverse') }}
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
              </div>
            </div>
          </el-form-item>
          <div class="font-bold mb-2">
            {{ t('componentSettings.groupSettings.flexJustifyContent') }}
          </div>
          <el-form-item :label="isRow ? t('componentSettings.groupSettings.flexHorizontal') : t('componentSettings.groupSettings.flexVertical')">
            <el-radio-group v-model="widgetOptions.flex.justifyContent">
              <el-radio label="flex-start">
                {{ isRow ? t('componentSettings.groupSettings.flexRowStart') : t('componentSettings.groupSettings.flexColStart') }}
              </el-radio>
              <el-radio label="flex-end">
                {{ isRow ? t('componentSettings.groupSettings.flexRowEnd') : t('componentSettings.groupSettings.flexColEnd') }}
              </el-radio>
              <el-radio label="center">
                {{ t('componentSettings.groupSettings.flexCenter') }}
              </el-radio>
              <el-radio label="space-between">
                {{ t('componentSettings.groupSettings.flexSpaceBetween') }}
              </el-radio>
              <el-radio label="space-around">
                {{ t('componentSettings.groupSettings.flexSpaceAround') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="isRow ? t('componentSettings.groupSettings.flexVertical') : t('componentSettings.groupSettings.flexHorizontal')">
            <el-radio-group v-model="widgetOptions.flex.alignItems">
              <el-radio label="flex-start">
                {{ isRow ? t('componentSettings.groupSettings.flexColStart') : t('componentSettings.groupSettings.flexRowStart') }}
              </el-radio>
              <el-radio label="flex-end">
                {{ isRow ? t('componentSettings.groupSettings.flexColEnd') : t('componentSettings.groupSettings.flexRowEnd') }}
              </el-radio>
              <el-radio label="center">
                {{ t('componentSettings.groupSettings.flexCenter') }}
              </el-radio>
              <el-radio label="baseline">
                {{ t('componentSettings.groupSettings.flexBaseline') }}
              </el-radio>
              <el-radio label="stretch">
                {{ t('componentSettings.groupSettings.flexStretch') }}
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
