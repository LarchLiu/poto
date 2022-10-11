<script setup lang="ts">
import { BasicSetting, BlockBasics, Columns2Config, Columns3Config, GroupConfig, MarkdownConfig, TextConfig, TitleConfig } from '@poto/block-basic'
import { BlockItem } from './types'

const designer = useDesignerStore()
const actionsStore = useActionsStore()
const customBlocks = useCustomBlocksStore()
const widgetMenu = useWidgetMenuStore()
// const jsonList = useLocalStorage('jsonList', '')
const jsonActions = useLocalStorage('jsonActions', '')
const jsonComponents = useLocalStorage('jsonCustomComponents', '')
const currentItem = computed(() => designer.getCurrentItem())
const borderIsSingleColor = computed(() => {
  return designer.options.border.color.type === 'single'
})
const borderLinearGradient = computed(() => {
  if (!borderIsSingleColor.value) {
    const options = designer.options.border.color.options
    const colors = options.colors
    let gradient = colors.join(', ')
    if (!options.gradient) {
      const length = colors.length
      gradient = colors.map((c: string, i: number) => {
        return `${c} ${i / length * 100}% ${(i + 1) / length * 100}%`
      }).join(', ')
    }
    return `linear-gradient(${options.degree}deg, ${gradient})`
  }
  else {
    return ''
  }
})
// const bgIsSingleColor = computed(() => {
//   return designer.options.backgroundColor.type === 'single'
// })
const bgLinearGradient = computed(() => {
  const type = designer.options.backgroundColor.type
  const options = designer.options.backgroundColor.options
  const colors = options.colors
  if (type === 'colorful') {
    let gradient = colors.join(', ')
    if (!options.gradient) {
      const length = colors.length
      gradient = colors.map((c: string, i: number) => {
        return `${c} ${i / length * 100}% ${(i + 1) / length * 100}%`
      }).join(', ')
    }
    return `linear-gradient(${options.degree}deg, ${gradient})`
  }
  else if (type === 'single') {
    return `linear-gradient(${colors[0]}, ${colors[0]})`
  }
  else {
    return `url('${options.url}')`
  }
})
const borderWidth = computed(() => {
  return `${designer.options.border.width.join('px ')}px`
})
const borderRadius = computed(() => {
  return `${designer.options.border.radius.join('px ')}px`
})
const elePadding = computed(() => {
  return `${designer.options.padding.join('px ')}px`
})
const eleMargin = computed(() => {
  return `${designer.options.margin.join('px ')}px`
})
const backgroundImage = computed(() => {
  return `url('${designer.options.backgroundColor.options.url}')`
})
const borderBackgroundImage = computed(() => {
  return `url('${designer.options.border.color.options.url}')`
})

onMounted(() => {
  // console.log(BlockBasics.TEXT.widget)
  actionsStore.createByJsonString(jsonActions.value)
  customBlocks.createByJsonString(jsonComponents.value)
  designer.addItem(TextConfig)
  designer.addItem(TitleConfig)
  designer.addItem(MarkdownConfig)
  designer.addItem(GroupConfig)
  designer.addItem(Columns2Config)
  designer.addItem(Columns3Config)
})
</script>

<template>
  <div id="page">
    <div class="flex flex-row justify-center">
      <div class="p-2 border-r-2">
        <BasicSetting is-designer />
      </div>
      <div class="w-500px">
        <draggable
          v-bind="{
            animation: 200,
            group: 'standard',
            disabled: false,
            ghostClass: 'ghost',
          }"
          handle=".handle"
          :list="designer.list"
          item-key="id"
          class="ele-padding ele-margin box-border w-500px"
          :class="[designer.options.border.has ? `border-${designer.options.border.color.type}` : '',
                   (designer.options.border.has && !borderIsSingleColor) ? '' : `bg-${designer.options.backgroundColor.type}`]"
        >
          <template #item="{ element }: { element: BlockItem }">
            <div :id="`layout-${element.category}-${element.id}`" :style="{ width: `${element.options.size.width}%` }">
              <layout-wrapper :item="element">
                <component :is="BlockBasics[element.blockType].blockView" :item="element" :real-content="false" />
              </layout-wrapper>
            </div>
          </template>
        </draggable>
      </div>
      <div class="w-500px border-l-2 border-r-2">
        <div
          :class="[designer.options.border.has ? `border-${designer.options.border.color.type}` : '',
                   (designer.options.border.has && !borderIsSingleColor) ? '' : `bg-${designer.options.backgroundColor.type}`]"
          class="ele-padding ele-margin box-border"
        >
          <div v-for="element in designer.list" :id="`${element.category}-${element.id}`" :key="element.id" :style="{ width: `${element.options.size.width}%` }">
            <wrapper :item="element">
              <component :is="BlockBasics[element.blockType].blockView" :item="element" />
            </wrapper>
          </div>
        </div>
      </div>
      <div>
        <div class="p-2 w-300px">
          <component :is="BlockBasics[currentItem.blockType].settingsView" v-if="currentItem" :key="currentItem.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .border-single {
    border-width: v-bind(borderWidth) !important;
    border-style: v-bind('designer.options.border.style') !important;
    border-radius: v-bind(borderRadius) !important;
    border-color: v-bind('designer.options.border.color.options.colors[0]') !important;
  }
  .border-colorful {
    box-sizing: border-box !important;
    border-width: v-bind(borderWidth) !important;
    border-style: v-bind('designer.options.border.style') !important;
    border-radius: v-bind(borderRadius) !important;
    border-color: transparent !important;

    background-image: v-bind(bgLinearGradient), v-bind(borderLinearGradient) !important;
    background-origin: border-box;
    background-clip: padding-box,border-box;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .border-image {
    border-width: v-bind(borderWidth) !important;
    border-style: v-bind('designer.options.border.style') !important;
    border-radius: v-bind(borderRadius) !important;

    background-image: v-bind(bgLinearGradient) !important;
    border-image: v-bind(borderBackgroundImage) 20%;
    background-origin: border-box;
    background-clip: padding-box,border-box;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .bg-single {
    background-color: v-bind('designer.options.backgroundColor.options.colors[0]') !important;
  }
  .bg-colorful {
    background-image: v-bind(bgLinearGradient) !important;
    -webkit-background-clip: padding-box, border-box;
    background-origin: border-box;
    background-clip: padding-box, border-box;
  }
  .bg-image {
    background-image: v-bind(backgroundImage) !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .ele-padding {
    padding: v-bind(elePadding) !important;
  }
  .ele-margin {
    margin: v-bind(eleMargin) !important;
  }
  .add-line {
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(152, 172, 189);

    .add-button {
      margin-right: 8px;
      font-size: 14px !important;
      text-align: center;
      cursor: pointer;
      padding: 2px;
      height: 20px;
      line-height: 20px;
      outline: transparent solid 2px;
      outline-offset: 2px;
      width: auto;
      border-radius: 9999px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-width: 1px;
      border-style: solid;
      border-color: #e5e0df;
    }
    :last-child {
        margin-right: 0;
      }
  }
  :deep(.menu-position) {
    position: absolute;
    left: v-bind('`${widgetMenu.left}px`');
    top: v-bind('`${widgetMenu.top}px`');
  }
</style>
