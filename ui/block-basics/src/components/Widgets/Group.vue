<script setup lang="ts">
import type { PropType } from 'vue'
import { runTransformer } from '@poto/utils'
import type { BlockItem, BodyContent, GroupSettings, RestApiAction, TransformerAction } from '~/types'
import { BlockBasics } from '~/constants'

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
})

const actionsStore = useActionsStore()

const options = computed(() => {
  return props.item.options as GroupSettings
})
const ownData = ref<any>()
const keyIdx = ref(0)

const flexBasis = (item: BlockItem) => {
  return options.value.flex.basis ? `${options.value.flex.basis}%` : `${item.options.size.width}%`
}

const getContainerStyle = () => {
  if (options.value.containerType === 'flex') {
    return {
      display: options.value.flex.display,
      flexDirection: options.value.flex.direction,
      flexWrap: options.value.flex.wrap,
      justifyContent: options.value.flex.justifyContent,
      alignItems: options.value.flex.alignItems,
    }
  }
}

const fetchSourceData = async (actionId: string) => {
  if (actionId) {
    const err = `group source data type error ${props.listIndex ? props.listIndex : ''}`
    if (actionId === 'byparent') {
      let rawData = props.parentData
      const listIndex = props.listIndex

      if (!rawData)
        return

      if (options.value?.sourceData?.transformer)
        rawData = runTransformer(options.value.sourceData.transformer, rawData, listIndex)
      if (rawData)
        ownData.value = rawData

      else ElMessage.error(err)
    }
    else {
      const action = actionsStore.findAction(actionId)
      if (action && options.value) {
        if (action?.type === 'restapi') {
          const url = (action.content as RestApiAction<BodyContent>).url
          if (url) {
            const { data } = await useFetch(url)
            let rawData = JSON.parse(data.value as string)
            if (!!rawData && options.value?.sourceData?.transformer)
              rawData = runTransformer(options.value.sourceData.transformer, rawData)

            if (rawData)
              ownData.value = rawData

            else ElMessage.error(err)
          }
        }
        else if (action.type === 'transformer') {
          const transformer = action.content as TransformerAction
          const rawData = runTransformer(transformer, '')
          if (rawData)
            ownData.value = rawData

          else ElMessage.error(err)
        }
      }
    }
  }
}

const setListItemData = (item: BlockItem, data: any) => {
  item.options.hasParentData = !!data
  return item
}

watch(() => options.value.sourceData, (value) => {
  if (value) {
    if (value.enable)
      fetchSourceData(value.actionId)
    else
      ownData.value = undefined
  }
}, {
  deep: true,
})

watch(ownData, () => {
  keyIdx.value++
}, {
  deep: true,
})

watch(() => props.parentData, (value) => {
  if (value && options.value.sourceData?.enable)
    fetchSourceData(options.value.sourceData.actionId)
  options.value.list?.map((i) => {
    if (!value && i.options.sourceData?.enable && i.options.sourceData.actionId === 'byparent')
      i.options.sourceData.enable = false
    return i
  })
}, {
  deep: true,
})

onMounted(() => {
  if (options.value?.sourceData?.enable)
    fetchSourceData(options.value.sourceData.actionId)
})
</script>

<template>
  <div
    v-if="realContent"
    class="min-h-26px min-w-26px"
    :style="getContainerStyle()"
  >
    <div v-for="element in options.list" :id="`${element.category}-${element.id}`" :key="`${element.id}-${keyIdx}`" :style="{ flexBasis: flexBasis(element) }">
      <wrapper :item="element">
        <component :is="BlockBasics[element.blockType].blockView" :item="setListItemData(element, ownData)" :parent-data="ownData" :list-index="listIndex" :real-content="realContent" />
      </wrapper>
    </div>
  </div>
  <draggable
    v-else
    v-bind="{
      animation: 200,
      group: 'standard',
      disabled: false,
      ghostClass: 'ghost',
    }"
    handle=".handle"
    item-key="id"
    :list="item.options.list"
    class="min-h-26px min-w-26px"
    :style="getContainerStyle()"
  >
    <template #item="{ element }: { element: BlockItem }">
      <div :id="`layout-${element.category}-${element.id}`" :style="{ flexBasis: flexBasis(element) }">
        <layout-wrapper :item="element" :un-resize="options.flex.basis > 0">
          <component :is="BlockBasics[element.blockType].blockView" :item="element" :real-content="realContent" />
        </layout-wrapper>
      </div>
    </template>
  </draggable>
</template>

<style scoped>
  .ctn-flex {
    display: v-bind('options.flex.display');
    flex-direction: v-bind('options.flex.direction');
    flex-wrap: v-bind('options.flex.wrap');
    justify-content: v-bind('options.flex.justifyContent');
    align-items: v-bind('options.flex.alignItems');
  }
</style>
