<script setup lang="ts">
import type { PropType } from 'vue'
import type { BlockItem, BlockPluginSettings } from '@poto/types'
import { UUID } from '@poto/utils'
import type { Settings } from '~/constants'
import { i18nMessages } from '~/constants'

const props = defineProps({
  item: {
    type: Object as PropType<BlockItem>,
    required: true,
  },
  realContent: {
    type: Boolean,
    default: true,
  },
  isPreview: {
    type: Boolean,
    required: false,
  },
})

const { t } = useI18n({
  messages: i18nMessages,
})

onMounted(() => {
  if (!((props.item.options as BlockPluginSettings).captures as Settings).imagesElId)
    ((props.item.options as BlockPluginSettings).captures as Settings).imagesElId = UUID()
})
</script>

<template>
  <div v-if="realContent && !isPreview" :id="((item.options as BlockPluginSettings).captures as Settings).imagesElId" />
  <div v-else>
    <div class="flex justify-center items-center p-y">
      <div class="i-carbon-cut-out text-2xl mr-2" />
      {{ t('componentSettings.pluginName') }}
    </div>
  </div>
</template>

<style scoped>

</style>
