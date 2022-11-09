<script setup lang="ts">
import type { PropType } from 'vue'
import { deepClone, runTransformer } from '@poto/utils'
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
  isPreview: {
    type: Boolean,
    required: false,
  },
})

const actionsStore = useActionsStore()
const designer = useDesignerStore()
const blockPlugins = useDesignerStore().getBlockPlugins()
const blockInfo = { ...BlockBasics, ...blockPlugins }
const ownData = ref<any>()
const keyIdx = ref(0)
const options = computed(() => {
  return props.item.options as GroupSettings
})

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
  const err = `list source data type error ${props.listIndex ? props.listIndex : ''}`
  if (actionId) {
    if (actionId === 'byparent') {
      let rawData = props.parentData

      if (!rawData)
        return

      if (options.value?.sourceData?.transformer)
        rawData = runTransformer(options.value.sourceData.transformer, rawData)

      if (rawData)
        ownData.value = rawData
      else
        ElMessage.error(err)
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
          else
            ElMessage.error('source data type error')
        }
      }
    }
  }
}

const setListItemData = (item: BlockItem, data: any, index: number) => {
  const _item = index ? deepClone(item) : item
  _item.options.hasParentData = !!data
  return _item
}

watch([ownData, () => options.value.list], () => {
  keyIdx.value++
})

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

watch(() => props.parentData, (value) => {
  if (value && options.value.sourceData?.enable)
    fetchSourceData(options.value.sourceData.actionId)
  options.value.list?.map((i) => {
    // TODO: make children change
    if (!value && i.options.sourceData?.enable && i.options.sourceData.actionId === 'byparent')
      i.options.sourceData.enable = false
    return i
  })
}, {
  deep: true,
})

const tempList = ref()
const dragStart = () => {
  designer.ignoreListHis = true
  tempList.value = JSON.stringify(designer.list)
}
const dragEnd = async () => {
  await nextTick(() => {
    if (designer.ignoreListHis)
      designer.ignoreListHis = false
    if (tempList.value !== JSON.stringify(designer.list))
      designer.addHistory()
  })
}

onMounted(() => {
  if (options.value.sourceData?.enable)
    fetchSourceData(options.value.sourceData.actionId)
})
</script>

<template>
  <div
    v-if="realContent"
    class="min-h-26px min-w-26px"
    :style="getContainerStyle()"
  >
    <div v-for="(data, index) in ownData" :key="`${index}-${keyIdx}`" :style="{ flexBasis: options.flex.basis ? `${options.flex.basis}%` : '100%' }">
      <div
        v-for="element in item.options.list"
        :id="`${element.category}-${element.id}`"
        :key="element.id"
        :style="{ flexBasis: flexBasis(element) }"
      >
        <wrapper v-if="!!blockInfo[element.blockType]" :item="element" :is-preview="isPreview">
          <component
            :is="blockInfo[element.blockType].blockView"
            :parent-data="data" :list-index="index"
            :item="setListItemData(element, data, index)"
            :real-content="realContent"
            :is-preview="isPreview"
          />
        </wrapper>
      </div>
    </div>
    <!-- <div
      v-for="element in item.options.list"
      :id="`${element.category}-${element.id}`"
      :key="element.id"
      :style="{ flexBasis: flexBasis(element) }"
    >
      <div v-if="!!ownData">
        <div v-for="(data, index) in ownData" :key="`${element.id}-${index}-${keyIdx}`">
          <wrapper v-if="!!blockInfo[element.blockType]" :item="element" :is-preview="isPreview">
            <component
              :is="blockInfo[element.blockType].blockView"
              :parent-data="data" :list-index="index"
              :item="setListItemData(element, data, index)"
              :real-content="realContent"
              :is-preview="isPreview"
            />
          </wrapper>
        </div>
      </div>
    </div> -->
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
    @start="dragStart"
    @end="dragEnd"
  >
    <template #item="{ element }: { element: BlockItem }">
      <div :id="`layout-${element.category}-${element.id}`" :style="{ flexBasis: flexBasis(element) }">
        <layout-wrapper :block-err="!blockInfo[element.blockType]" :item="element" :un-resize="options.flex.basis > 0" :is-preview="isPreview">
          <component :is="blockInfo[element.blockType].blockView" :item="element" :real-content="realContent" :is-preview="isPreview" />
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
