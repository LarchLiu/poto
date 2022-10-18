<script setup lang="ts">
import { TextSettings } from '@poto/types'
import type { BlockItem } from '@poto/types'
import type { PropType } from 'vue'

defineProps({
  item: {
    type: Object as PropType<BlockItem>,
    required: true,
  },
  realContent: {
    type: Boolean,
    default: true,
  },
  parentData: {
    type: Object as PropType<any>,
    required: false,
  },
  listIndex: {
    type: Number,
    required: false,
  },
})
</script>

<template>
  <div v-if="realContent" :style="{ color: (item.options as TextSettings).font.color.options.colors[0] }">
    block plugin template block view
  </div>
  <div v-else :style="{ color: (item.options as TextSettings).font.color.options.colors[0] }">
    {{ item.options.name }}
  </div>
</template>
