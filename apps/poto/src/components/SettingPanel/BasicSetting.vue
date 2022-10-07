<script setup lang="ts">
import type { BasicSettings } from '~/types'

const props = defineProps({
  isDesigner: {
    type: Boolean,
    require: false,
    default: false,
  },
  hasParentData: {
    type: Boolean,
    default: false,
  },
})

// const designer = inject('designer') as Designer
const designer = useDesignerStore()
const actionsStore = useActionsStore()
const currentItem = computed(() => {
  return props.isDesigner ? designer : designer.getCurrentItem()
})
const widgetOptions = computed(() => props.isDesigner ? designer.options : (currentItem.value ? currentItem.value.options as BasicSettings : undefined))

const actionsList = computed(() => {
  if (widgetOptions.value?.hasParentData)
    return [{ id: 'byparent', name: 'By Parent', type: 'byparent' }].concat(actionsStore.actions)

  return actionsStore.actions
})

const enableSourceData = computed({
  get() {
    return !!widgetOptions.value?.sourceData && widgetOptions.value?.sourceData.enable
  },
  set(value) {
    if (widgetOptions.value) {
      if (!widgetOptions.value?.sourceData) {
        widgetOptions.value.sourceData = {
          enable: value,
          actionId: '',
          transformer: {
            enable: false,
            rawData: 'return data',
          },
        }
      }
      else {
        widgetOptions.value.sourceData.enable = value
      }
    }
  },
})

const enableTransformer = computed({
  get() {
    return !!widgetOptions.value?.sourceData && widgetOptions.value?.sourceData.enable && widgetOptions.value?.sourceData.transformer.enable
  },
  set(value) {
    if (widgetOptions.value && widgetOptions.value.sourceData)
      widgetOptions.value.sourceData.transformer.enable = value
  },
})
</script>

<template>
  <div v-if="currentItem && widgetOptions">
    <el-form-item label="名称">
      <el-input v-model="widgetOptions.name" />
    </el-form-item>
    <el-form-item label="宽度">
      <!-- <input v-model="widgetOptions.size.width" class="w-4/5" type="range" min="1" max="100" step="0.1">
      <span ml-1>{{ `${widgetOptions.size.width}%` }}</span> -->
      <el-slider v-model="widgetOptions.size.width" class="mr-3" :min="1" :step="0.1" />
    </el-form-item>
    <el-form-item label="边框">
      <div flex-col>
        <el-switch v-model="widgetOptions.border.has" />
        <div v-if="widgetOptions.border.has">
          <el-form-item label="样式">
            <el-radio-group v-model="widgetOptions.border.style">
              <el-radio-button label="solid">
                实线
              </el-radio-button>
              <el-radio-button label="dashed">
                虚线
              </el-radio-button>
              <el-radio-button label="dotted">
                点线
              </el-radio-button>
              <el-radio-button label="double">
                双线
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="宽度">
            <ring-setting v-model="widgetOptions.border.width" :is-corner="false" />
          </el-form-item>
          <el-form-item label="圆角">
            <ring-setting v-model="widgetOptions.border.radius" :is-corner="true" />
          </el-form-item>
          <el-form-item label="颜色">
            <color-setting v-model="widgetOptions.border.color" :show-alpha="true" />
          </el-form-item>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="外边距">
      <ring-setting v-model="widgetOptions.margin" :is-corner="false" />
    </el-form-item>
    <el-form-item label="内边距">
      <ring-setting v-model="widgetOptions.padding" :is-corner="false" />
    </el-form-item>
    <el-form-item label="背景色">
      <color-setting v-model="widgetOptions.backgroundColor" :show-alpha="true" />
    </el-form-item>
    <el-form-item label="数据源">
      <!-- <el-input v-model="widgetOptions.text" type="textarea" :rows="2" /> -->

      <el-switch v-model="enableSourceData" mr-2 />
      <el-select v-if="widgetOptions.sourceData?.enable" v-model="widgetOptions.sourceData.actionId" mr-2>
        <el-option
          v-for="item in actionsList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
          <div flex items-center>
            <div text-blue-400 text-18px mr-1 :class="item.type === 'restapi' ? 'i-mdi-api' : 'i-mdi-language-javascript'" /> {{ item.name }}
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="widgetOptions.sourceData?.enable" label="转换器">
      <el-switch v-model="enableTransformer" />
      <el-input v-if="widgetOptions.sourceData?.transformer.enable" v-model="widgetOptions.sourceData.transformer.rawData" type="textarea" :rows="2" />
    </el-form-item>
  </div>
</template>

<style scoped>

</style>
