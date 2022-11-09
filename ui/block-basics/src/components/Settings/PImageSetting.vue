<script setup lang="ts">
import { i18nMessages } from '~/constants'
import type { ImageSettings } from '~/types'

const { t } = useI18n({
  messages: i18nMessages,
})
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const widgetOptions = computed(() => (currentItem.value ? currentItem.value.options as ImageSettings : undefined))
const photoModel = ref(false)

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
      <el-form-item :label="t('componentSettings.imageSettings.url')">
        <el-button @click="photoModel = true">
          {{ t('basicSettings.imageSettings') }}
        </el-button>
        <PhotoSetting v-model:open="photoModel" v-model:url="widgetOptions.src" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.imageSettings.fit')">
        <el-radio-group v-model="widgetOptions.fit">
          <el-radio label="none">
            None
          </el-radio>
          <el-radio label="contain">
            Contain
          </el-radio>
          <el-radio label="fill">
            Fill
          </el-radio>
          <el-radio label="cover">
            Cover
          </el-radio>
          <el-radio label="scale-down">
            Scale down
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('componentSettings.imageSettings.imageWidth')">
        <el-input v-model="widgetOptions.width" placeholder="100px" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.imageSettings.imageHeight')">
        <el-input v-model="widgetOptions.height" placeholder="100px" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 8px;
  }
</style>
