<script setup lang="ts">
import type { DividerSettings } from '~/types'
import { i18nMessages } from '~/constants'

const { t } = useI18n({
  messages: i18nMessages,
})

const defaultHeight = '1em'
const designer = useDesignerStore()
const currentItem = computed(() => {
  return designer.getCurrentItem()
})
const widgetOptions = computed(() => (currentItem.value ? currentItem.value.options as DividerSettings : undefined))

const sliderMouseDown = () => {
  designer.ignoreListHis = true
  designer.ignoreOptionsHis = true

  const onMouseMove = function () {
    designer.ignoreListHis = true
    designer.ignoreOptionsHis = true
  }

  const onMouseUp = function () {
    removeEventListener('mousemove', onMouseMove)
    removeEventListener('mouseup', onMouseUp)
    designer.addHistory()
  }

  addEventListener('mousemove', onMouseMove)
  addEventListener('mouseup', onMouseUp)
}

const directionChange = (value: string | number | boolean) => {
  if (value === 'horizontal') {
    widgetOptions.value!.size.width = 100
    widgetOptions.value!.border.width[3] = 0
    widgetOptions.value!.height = ''
    widgetOptions.value!.margin = [2, 0, 2, 0]
  }
  else {
    widgetOptions.value!.size.width = 0
    widgetOptions.value!.border.width[0] = 0
    widgetOptions.value!.height = defaultHeight
    widgetOptions.value!.margin = [0, 2, 0, 2]
  }
}
</script>

<template>
  <div v-if="currentItem && widgetOptions">
    <el-form size="small">
      <el-form-item :label="t('basicSettings.name')">
        <el-input v-model="widgetOptions.name" />
      </el-form-item>
      <el-form-item :label="t('basicSettings.width')">
        <span class="w-full mr-3" @mousedown="sliderMouseDown">
          <el-slider v-model="widgetOptions.size.width" class="mr-3" :min="0" :step="0.1" />
        </span>
      </el-form-item>
      <el-form-item :label="t('componentSettings.dividerSettings.direction')">
        <div class="flex flex-col">
          <el-radio-group v-model="widgetOptions.direction" @change="directionChange">
            <el-radio-button label="horizontal">
              {{ t('componentSettings.dividerSettings.horizontal') }}
            </el-radio-button>
            <el-radio-button label="vertical">
              {{ t('componentSettings.dividerSettings.vertical') }}
            </el-radio-button>
          </el-radio-group>
          <el-form-item :label="t('basicSettings.borderStyle')" class="mt-2">
            <el-radio-group v-model="widgetOptions.border.style">
              <el-radio-button label="solid">
                {{ t('basicSettings.solid') }}
              </el-radio-button>
              <el-radio-button label="dashed">
                {{ t('basicSettings.dashed') }}
              </el-radio-button>
              <el-radio-button label="dotted">
                {{ t('basicSettings.dotted') }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('componentSettings.dividerSettings.borderWidth')">
            <div class="ml-1">
              <el-input-number
                v-if="widgetOptions.direction === 'horizontal'"
                v-model="widgetOptions.border.width[0]"
                :min="1"
                @change="widgetOptions!.border.width[3] = 0"
              />
              <el-input-number
                v-else
                v-model="widgetOptions.border.width[3]"
                :min="1"
                @change="widgetOptions!.border.width[0] = 0"
              />
            </div>
          </el-form-item>
          <el-form-item v-if="widgetOptions.direction === 'vertical'" :label="t('componentSettings.dividerSettings.divHeight')">
            <el-input v-model="widgetOptions.height" placeholder="1em | 10px" />
          </el-form-item>
          <el-form-item :label="t('basicSettings.color')">
            <color-setting v-model="widgetOptions.border.color" :show-alpha="true" />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="t('basicSettings.margin')">
        <ring-setting v-model="widgetOptions.margin" :is-corner="false" />
      </el-form-item>
      <el-form-item :label="t('basicSettings.padding')">
        <ring-setting v-model="widgetOptions.padding" :is-corner="false" />
      </el-form-item>
      <el-form-item :label="t('basicSettings.background')">
        <color-setting v-model="widgetOptions.backgroundColor" :show-alpha="true" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
      margin-bottom: 8px;
    }
</style>
