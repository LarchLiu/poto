<script setup lang="ts">
import type { BasicSettings, Item } from '~/types'
import { BlockType } from '~/types'

const props = defineProps<{
  item: Item
  unResize?: boolean
}>()

const designer = useDesignerStore()
const wrapper = ref<HTMLElement>()
const isResizing = ref(false)

const options = computed(() => {
  return props.item.options as BasicSettings
})
const isEmpty = computed(() => {
  return props.item.blockType === BlockType.Group ? (options.value.list ? options.value.list.length === 0 : true) : false
})

const selected = computed(() => {
  return designer.isSelected(props.item)
})
const isWidget = computed(() => {
  return designer.isWidget(props.item)
})
const borderIsSingleColor = computed(() => {
  return options.value.border.color.type === 'single'
})
const borderLinearGradient = computed(() => {
  if (!borderIsSingleColor.value) {
    const cOptions = options.value.border.color.options
    const colors = cOptions.colors
    let gradient = colors.join(', ')
    if (!cOptions.gradient) {
      const length = colors.length
      gradient = colors.map((c: string, i: number) => {
        return `${c} ${i / length * 100}% ${(i + 1) / length * 100}%`
      }).join(', ')
    }
    return `linear-gradient(${cOptions.degree}deg, ${gradient})`
  }
  else {
    return ''
  }
})
// const bgIsSingleColor = computed(() => {
//   return options.value.backgroundColor.type === 'single'
// })
const bgLinearGradient = computed(() => {
  const type = (props.item.options as BasicSettings).backgroundColor.type
  const options = (props.item.options as BasicSettings).backgroundColor.options
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
  return `${options.value.border.width.join('px ')}px`
})
const borderRadius = computed(() => {
  return `${options.value.border.radius.join('px ')}px`
})
const elePadding = computed(() => {
  return `${options.value.padding.join('px ')}px`
})
const eleMargin = computed(() => {
  return `${options.value.margin.join('px ')}px`
})
const setIsResizing = (is: boolean) => {
  isResizing.value = is
}
const backgroundImage = computed(() => {
  return `url('${props.item.options.backgroundColor.options.url}')`
})
const borderBackgroundImage = computed(() => {
  return `url('${props.item.options.border.color.options.url}')`
})
</script>

<template>
  <div ref="wrapper" class="flex relative" :class="isResizing ? 'cursor-col-resize' : ''">
    <WidgetHandler :item="item" />
    <resizer
      v-if="!unResize && selected"
      v-model:width="options.size.width"
      :class="isWidget ? 'border-blue-500' : 'border-green-500'"
      :wrapper="wrapper!"
      @is-resizing="is => setIsResizing(is)"
    />

    <div
      :class="selected ? `border ${isWidget ? 'border-blue-400' : 'border-green-400'}`
        : (isEmpty ? 'border border-dashed! border-red-400'
          : `border border-dashed! ${isWidget ? 'border-blue-300!' : 'border-green-300!'}`)"
      p-1 w-full box-border
    >
      <div
        :class="[item.options.border.has ? `border-${options.border.color.type}` : '',
                 (options.border.has && !borderIsSingleColor) ? '' : `bg-${options.backgroundColor.type}`]"
        class="ele-padding ele-margin box-border"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .border-single {
    border-width: v-bind(borderWidth) !important;
    border-style: v-bind('item.options.border.style') !important;
    border-radius: v-bind(borderRadius) !important;
    border-color: v-bind('item.options.border.color.options.colors[0]') !important;
  }
  .border-colorful {
    box-sizing: border-box !important;
    border-width: v-bind(borderWidth) !important;
    border-style: v-bind('item.options.border.style') !important;
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
    border-style: v-bind('item.options.border.style') !important;
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
    background-color: v-bind('item.options.backgroundColor.options.colors[0]') !important;
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
    font-size: 12px;
    opacity: 0.6;
    color: rgb(152, 172, 189);

    .line {
        flex: 1 1 0%;
        height: 8px;
        border-bottom: 1px solid rgb(152, 172, 189);
    }
    .add-button {
      text-align: center;
      cursor: pointer;
      padding: 0px 20px;
      height: 16px;
      line-height: 16px;
    }
  }
</style>
