<script setup lang="ts">
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
  <div v-if="realContent">
    block plugin template block view
  </div>
  <div v-else>
    {{ item.options.name }}
  </div>
</template>
