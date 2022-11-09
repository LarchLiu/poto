<script setup lang="ts">
import type { PropType } from 'vue'
import { runTransformer } from '@poto/utils'
import type { BlockItem, BodyContent, ImageSettings, RestApiAction, TransformerAction } from '~/types'

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
  return props.item.options as ImageSettings
})

const borderRadius = computed(() => {
  return `${options.value.border.radius.join('px ')}px`
})

const keyIdx = ref(0)

const fetchSourceData = async (actionId: string) => {
  if (actionId) {
    const err = `Image source data type error ${props.listIndex ? props.listIndex : ''}`
    if (actionId === 'byparent') {
      let rawData = props.parentData
      const listIndex = props.listIndex

      if (!rawData)
        return

      if (options.value.sourceData?.transformer)
        rawData = runTransformer(options.value.sourceData.transformer, rawData, listIndex)

      if (typeof rawData === 'string') {
        keyIdx.value++
        options.value.src = rawData
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
              options.value.src = rawData
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
            options.value.src = rawData
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
  <div>
    <img
      v-if="realContent"
      :style="{ objectFit: options.fit, borderRadius, width: options.width, height: options.height }"
      :src="options.src"
    >
    <div v-else class="flex flex-col items-center justify-center p-2">
      <div class="i-carbon-image text-4xl" />
    </div>
  </div>
</template>

<style scoped>

</style>
