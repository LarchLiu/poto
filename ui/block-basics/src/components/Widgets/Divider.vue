<script setup lang="ts">
import type { PropType } from 'vue'
import type { BlockItem, DividerSettings } from '~/types'

const props = defineProps({
  item: {
    type: Object as PropType<BlockItem>,
    required: true,
  },
})

const options = computed(() => {
  return props.item.options as DividerSettings
})
</script>

<template>
  <div :style="{ height: options.height }" />
</template>

<style scoped>

</style>
