<script setup lang="ts">
import type { PropType } from 'vue'
import type { BlockItem, BlockPluginSettings } from '@poto/types'
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

const imagesEl = ref<HTMLElement>()

onMounted(() => {
  ((props.item.options as BlockPluginSettings).captures as Settings).imagesEl = imagesEl.value
})
</script>

<template>
  <div v-if="realContent && !isPreview" id="capture-image-from-video" ref="imagesEl" />
  <div v-else>
    <div class="flex justify-center items-center p-y">
      <div class="i-iconoir-screenshot text-2xl mr-2" />
      {{ t('componentSettings.pluginName') }}
    </div>
  </div>
</template>

<style scoped>

</style>
