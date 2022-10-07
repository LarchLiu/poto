<script setup lang="ts">
import type { PropType } from 'vue'
import type { Item, TextSettings } from '~/types'

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  realContent: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:item'])

const _item = computed({
  get() {
    return props.item
  },
  set(value) {
    emit('update:item', value)
  },
})

const isSingleColor = computed(() => {
  return (props.item.options as TextSettings).font.color.type === 'single'
})
</script>

<template>
  <!-- <component :is="realContent ? Wrapper : ContentWrapper" :item="item"> -->
  <div
    :style="{
      fontStyle: item.options.font.style,
      fontSize: item.options.font.size,
      fontWeight: item.options.font.weight,
      textAlign: item.options.align,
      textDecorationLine: item.options.font.decoration,
      textDecorationColor: item.options.font.color.options.colors[0],
    }"
  >
    <div :class="isSingleColor ? 'single' : ''">
      <tip-tap v-if="realContent" v-model:content="_item.options.text" is-markdown />
      <div v-else v-html="item.options.name" />
    </div>
  </div>
  <!-- </component> -->
</template>

<style scoped>
  .single {
    color: v-bind('item.options.font.color.options.colors[0]') !important;
    opacity: v-bind('item.options.font.color.options.opacity') !important;
  }
</style>
