<script setup lang="ts">
import type { PropType } from 'vue'
import { runTransformer } from '@poto/utils'
import type { BlockItem, BodyContent, RestApiAction, TextSettings, TransformerAction } from '~/types'

const props = defineProps({
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
  isPreview: {
    type: Boolean,
    required: false,
  },
})

const designer = useDesignerStore()
const actionsStore = useActionsStore()
const options = computed(() => {
  return props.item.options as TextSettings
})

const keyIdx = ref(0)

const isSingleColor = computed(() => {
  return options.value.font.color.type === 'single'
})
const linearGradient = computed(() => {
  const type = options.value.font.color.type
  const cOptions = options.value.font.color.options
  const colors = cOptions.colors
  if (type === 'colorful') {
    let gradient = colors.join(', ')
    if (!cOptions.gradient) {
      const length = colors.length
      gradient = colors.map((c: string, i: number) => {
        return `${c} ${i / length * 100}% ${(i + 1) / length * 100}%`
      }).join(', ')
    }
    return `linear-gradient(${cOptions.degree}deg, ${gradient})`
  }
  else if (type === 'image') {
    return `url('${cOptions.url}')`
  }
  else {
    return ''
  }
})

const fetchSourceData = async (actionId: string) => {
  if (actionId) {
    const err = `ptext source data type error ${props.listIndex ? props.listIndex : ''}`
    if (actionId === 'byparent') {
      let rawData = props.parentData
      const listIndex = props.listIndex

      if (!rawData)
        return

      if (options.value.sourceData?.transformer)
        rawData = runTransformer(options.value.sourceData.transformer, rawData, listIndex)

      if (typeof rawData === 'string') {
        keyIdx.value++
        options.value.text = rawData
      }
      else { ElMessage.error(err) }
    }
    else {
      let action = options.value.sourceData?.actionItem
      if (!action)
        action = designer.findAction(actionId)
      if (!action)
        action = actionsStore.findAction(actionId)
      if (action && options.value) {
        if (action?.type === 'restapi') {
          const url = (action.content as RestApiAction<BodyContent>).url
          if (url) {
            const { data } = await useFetch(url)
            let rawData = JSON.parse(data.value as string)
            if (!!rawData && options.value?.sourceData?.transformer)
              rawData = runTransformer(options.value.sourceData.transformer, rawData)

            if (typeof rawData === 'string')
              options.value.text = rawData
            else
              ElMessage.error(err)
          }
        }
        else if (action.type === 'transformer') {
          const transformer = action.content as TransformerAction
          let rawData = runTransformer(transformer, '')
          if (!!rawData && options.value?.sourceData?.transformer)
            rawData = runTransformer(options.value.sourceData.transformer, rawData)
          if (typeof rawData === 'string')
            options.value.text = rawData
          else
            ElMessage.error(err)
        }
      }
    }
  }
}

watch(() => options.value.sourceData, (value) => {
  if (value && value.enable)
    fetchSourceData(value.actionId)
}, {
  deep: true,
})

watch(() => props.parentData, (n, o) => {
  if (n && n !== o && options.value.sourceData?.enable)
    fetchSourceData(options.value.sourceData.actionId)
}, {
  deep: true,
})

onMounted(() => {
  if (options.value.sourceData?.enable)
    fetchSourceData(options.value.sourceData.actionId)
})
</script>

<template>
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
    <div :class="isSingleColor ? 'single' : 'colorful'">
      <div v-if="realContent">
        <div v-if="parentData" :key="keyIdx">
          {{ options.text }}
        </div>
        <div v-else>
          <div v-if="isPreview" v-html="options.text" />
          <tip-tap v-else :key="`tiptap-${keyIdx}`" v-model:content="options.text" />
        </div>
      </div>
      <div v-else v-html="options.name" />
    </div>
  </div>
  <!-- </component> -->
</template>

<style scoped>
  .single {
    color: v-bind('options.font.color.options.colors[0]') !important;
    opacity: v-bind('options.font.color.options.opacity') !important;
  }
  .colorful {
    /* width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content; */
    color: transparent;
    caret-color: black;
    opacity: v-bind('options.font.color.options.opacity') !important;
    background-image: v-bind(linearGradient) !important;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  :deep(.ProseMirror) {
    position: inherit;
  }
</style>
