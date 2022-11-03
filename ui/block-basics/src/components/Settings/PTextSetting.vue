<script setup lang="ts">
import { i18nMessages } from '~/constants'
import type { TextSettings } from '~/types'

const { t } = useI18n({
  messages: i18nMessages,
})
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const widgetOptions = computed(() => (currentItem.value ? currentItem.value.options as TextSettings : undefined))

watch(currentItem, (n, o) => {
  // watching options change of item and add to history
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
    <el-form v-if="widgetOptions" size="small">
      <div class="italic font-bold mb-2">
        {{ t('componentSettings.title') }}
      </div>
      <el-form-item :label="t('componentSettings.pTextSettings.align')">
        <el-radio-group v-model="widgetOptions.align">
          <el-radio-button label="left">
            {{ t('componentSettings.pTextSettings.left') }}
          </el-radio-button>
          <el-radio-button label="center">
            {{ t('componentSettings.pTextSettings.center') }}
          </el-radio-button>
          <el-radio-button label="right">
            {{ t('componentSettings.pTextSettings.right') }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div class="font-bold mb-2">
        {{ t('componentSettings.pTextSettings.font') }}
      </div>
      <el-form-item :label="t('componentSettings.pTextSettings.fontSize')">
        <el-input v-model="widgetOptions.font.size" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.pTextSettings.fontWeight')">
        <el-slider v-model="widgetOptions.font.weight" class="mr-3" :min="100" :max="900" :step="100" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.pTextSettings.fontStyle')">
        <el-radio-group v-model="widgetOptions.font.style">
          <el-radio-button label="normal">
            {{ t('componentSettings.pTextSettings.fontNormal') }}
          </el-radio-button>
          <el-radio-button label="italic">
            <span class="italic">{{ t('componentSettings.pTextSettings.fontItalic') }}</span>
          </el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="widgetOptions.font.decoration" class="mt-1">
          <el-radio-button label="none">
            {{ t('componentSettings.pTextSettings.fontNormal') }}
          </el-radio-button>
          <el-radio-button label="underline">
            <span class="underline">{{ t('componentSettings.pTextSettings.fontUnderline') }}</span>
          </el-radio-button>
          <el-radio-button label="line-through">
            <span class="line-through">{{ t('componentSettings.pTextSettings.fontLineThrough') }}</span>
          </el-radio-button>
          <el-radio-button label="overline">
            <span class="overline">{{ t('componentSettings.pTextSettings.fontOverline') }}</span>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('componentSettings.pTextSettings.fontColor')">
        <color-setting v-model="widgetOptions.font.color" :show-alpha="true" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 8px;
  }
</style>
