<script setup lang="ts">
import type { Font, Options } from '@samuelmeuli/font-manager'
import { UUID } from '@poto/utils'
import type { BasicSettings, DesignerActionItem } from '~/types'
import { i18nMessages, shadowBoxElevation, shadowBoxMargin } from '~/constants'
import { config } from '~/config'

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

const { t } = useI18n({
  messages: i18nMessages,
})

const OPTIONS_DEFAULTS: Options = {
  pickerId: '',
  families: [],
  categories: [],
  scripts: ['latin'],
  variants: ['regular'],
  filter() { return true },
  limit: 80,
  sort: 'alphabet',
}
// const designer = inject('designer') as Designer
const designer = useDesignerStore()
const actionsStore = useActionsStore()
const currentItem = computed(() => {
  return props.isDesigner ? designer : designer.getCurrentItem()
})
const widgetOptions = computed(() => props.isDesigner ? designer.options : (currentItem.value ? currentItem.value.options as BasicSettings : undefined))
const transformer = ref(widgetOptions.value?.sourceData?.transformer.rawData ? widgetOptions.value.sourceData.transformer.rawData : 'return data')

const designerActions = computed(() => {
  const actions = designer.actions
  if (widgetOptions.value?.hasParentData)
    return [{ id: 'byparent', name: 'By Parent', type: 'byparent' }].concat(actions) as DesignerActionItem[]

  return actions
})

const actionsList = computed(() => {
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

const enableShadowBox = computed({
  get() {
    return !!widgetOptions.value?.shadowBox && widgetOptions.value?.shadowBox.has
  },
  set(value) {
    if (widgetOptions.value) {
      if (!widgetOptions.value?.shadowBox) {
        widgetOptions.value.shadowBox = {
          has: value,
          elevation: 'medium',
          margin: shadowBoxMargin.medium,
          shadows: shadowBoxElevation.medium,
        }
      }
      else {
        widgetOptions.value.shadowBox.has = value
      }
    }
  },
})

const setShadowBox = (elevation: 'low' | 'medium' | 'high' | string | number | boolean) => {
  const ele = elevation as 'low' | 'medium' | 'high'
  if (widgetOptions.value?.shadowBox) {
    widgetOptions.value.shadowBox.elevation = ele
    widgetOptions.value.shadowBox.margin = shadowBoxMargin[ele]
    widgetOptions.value.shadowBox.shadows = shadowBoxElevation[ele]
  }
}

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

const onActionChange = (id: string) => {
  const actions = designer.actions
  let has = false

  for (let i = 0; i < actions.length; i++) {
    if (id === actions[i].id || id === actions[i].fromId) {
      if (widgetOptions.value && widgetOptions.value.sourceData) {
        widgetOptions.value.sourceData.actionId = actions[i].id
        widgetOptions.value.sourceData.actionItem = actions[i]
      }
      has = true
      return
    }
  }

  if (!has) {
    for (let i = 0; i < actionsStore.actions.length; i++) {
      if (id === actionsStore.actions[i].id) {
        const _id = UUID()
        if (widgetOptions.value && widgetOptions.value.sourceData) {
          widgetOptions.value.sourceData.actionId = _id
          widgetOptions.value.sourceData.actionItem = { ...actionsStore.actions[i], id: _id, fromId: id }
        }
        designer.addAction({ ...actionsStore.actions[i], id: _id, fromId: id })
        break
      }
    }
  }
}

const onTransformerChange = () => {
  if (widgetOptions.value && widgetOptions.value.sourceData)
    widgetOptions.value.sourceData.transformer.rawData = transformer.value
}

watch(widgetOptions, () => {
  // watching options change of designer and add to history
  if (props.isDesigner) {
    if (designer.ignoreOptionsHis) {
      designer.ignoreOptionsHis = false
      return
    }

    designer.addHistory()
  }
}, {
  deep: true,
})

watch(() => widgetOptions.value?.sourceData?.transformer.rawData, (value) => {
  if (value)
    transformer.value = value
})

const onFontChange = (font: Font) => {
  if (widgetOptions.value)
    widgetOptions.value.fontFamily = font.family || 'Default'
}
</script>

<template>
  <div v-if="currentItem && widgetOptions">
    <el-form size="small">
      <el-form-item :label="t('basicSettings.name')">
        <el-input v-model="widgetOptions.name" />
      </el-form-item>
      <el-form-item :label="t('basicSettings.width')">
        <!-- <input v-model="widgetOptions.size.width" class="w-4/5" type="range" min="1" max="100" step="0.1">
      <span ml-1>{{ `${widgetOptions.size.width}%` }}</span> -->
        <span class="w-full mr-3" @mousedown="sliderMouseDown">
          <el-slider v-model="widgetOptions.size.width" class="mr-3" :min="1" :step="0.1" />
        </span>
      </el-form-item>
      <el-form-item :label="t('basicSettings.border')">
        <div class="flex flex-col">
          <el-switch v-model="widgetOptions.border.has" />
          <div v-if="widgetOptions.border.has">
            <el-form-item :label="t('basicSettings.borderStyle')">
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
                <!-- <el-radio-button label="double">
                  {{ t('basicSettings.double') }}
                </el-radio-button> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="t('basicSettings.width')">
              <ring-setting v-model="widgetOptions.border.width" :is-corner="false" />
            </el-form-item>
            <el-form-item :label="t('basicSettings.radius')">
              <ring-setting v-model="widgetOptions.border.radius" :is-corner="true" />
            </el-form-item>
            <el-form-item :label="t('basicSettings.color')">
              <color-setting v-model="widgetOptions.border.color" :show-alpha="true" />
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="t('basicSettings.shadowBox')">
        <el-switch v-model="enableShadowBox" class="mr-2" />
        <el-radio-group v-if="widgetOptions.shadowBox?.has" v-model="widgetOptions.shadowBox.elevation" @change="setShadowBox">
          <el-radio-button label="low">
            {{ t('basicSettings.low') }}
          </el-radio-button>
          <el-radio-button label="medium">
            {{ t('basicSettings.medium') }}
          </el-radio-button>
          <el-radio-button label="high">
            {{ t('basicSettings.high') }}
          </el-radio-button>
        </el-radio-group>
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
      <el-form-item :label="t('basicSettings.dataSource')">
        <!-- <el-input v-model="widgetOptions.text" type="textarea" :rows="2" /> -->

        <el-switch v-model="enableSourceData" class="mr-2" />
        <el-select
          v-if="widgetOptions.sourceData?.enable"
          v-model="widgetOptions.sourceData.actionId" class="mr-2"
          @change="onActionChange"
        >
          <el-option-group :label="t('basicSettings.designerActions')">
            <el-option
              v-for="item in designerActions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div class="flex items-center">
                <div class="text-blue-400 text-18px mr-1" :class="item.type === 'restapi' ? 'i-mdi-api' : 'i-mdi-language-javascript'" /> {{ item.name }}
              </div>
            </el-option>
          </el-option-group>
          <el-option-group :label="t('basicSettings.globalActions')">
            <el-option
              v-for="item in actionsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <div class="flex items-center">
                <div class="text-blue-400 text-18px mr-1" :class="item.type === 'restapi' ? 'i-mdi-api' : 'i-mdi-language-javascript'" /> {{ item.name }}
              </div>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item v-if="widgetOptions.sourceData?.enable" :label="t('basicSettings.transformer')">
        <el-switch v-model="enableTransformer" />
        <el-input v-if="widgetOptions.sourceData?.transformer.enable" v-model="transformer" type="textarea" :rows="2" />
        <el-button v-if="widgetOptions.sourceData?.transformer.enable" class="mt-1" @click="onTransformerChange">
          {{ t('common.ok') }}
        </el-button>
      </el-form-item>
      <FontPicker
        :api-key="config.googleFontsApiKey"
        :active-font="widgetOptions.fontFamily ? widgetOptions.fontFamily : 'Default'"
        :options="OPTIONS_DEFAULTS"
        :suffix="`${isDesigner ? '-designer' : ''}`"
        @change="onFontChange"
      />
    </el-form>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 8px;
  }
</style>
