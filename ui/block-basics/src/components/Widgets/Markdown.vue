<script setup lang="ts">
import type { PropType } from 'vue'
import type { BlockItem, TextSettings } from '~/types'

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

const emit = defineEmits(['update:item'])

const _item = computed({
  get() {
    return props.item
  },
  set(value) {
    emit('update:item', value)
  },
})

const options = computed(() => {
  return props.item.options as TextSettings
})

const isSingleColor = computed(() => {
  return options.value.font.color.type === 'single'
})
</script>

<template>
  <!-- <component :is="realContent ? Wrapper : ContentWrapper" :item="item"> -->
  <div
    :style="{
      fontStyle: options.font.style,
      fontSize: options.font.size,
      fontWeight: options.font.weight,
      textAlign: options.align,
      textDecorationLine: options.font.decoration,
      textDecorationColor: options.font.color.options.colors[0],
    }"
  >
    <div :class="isSingleColor ? 'single' : ''">
      <div v-if="realContent">
        <div v-if="isPreview" v-html="options.text" />
        <tip-tap v-if="realContent" v-model:content="(_item.options as TextSettings).text" is-markdown />
        <!-- <milkdown v-if="realContent" v-model:content="(_item.options as TextSettings).text" is-markdown /> -->
      </div>
      <div v-else v-html="item.options.name" />
    </div>
  </div>
  <!-- </component> -->
</template>

<style scoped>
  .single {
    color: v-bind('options.font.color.options.colors[0]') !important;
    opacity: v-bind('options.font.color.options.opacity') !important;
  }
</style>
