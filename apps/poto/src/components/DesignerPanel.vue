<script setup lang="ts">
// import type { Designer } from '~/types'
import { BlockComponents } from '~/utils/constants'

// const designer = inject('designer') as Designer
const designer = useDesignerStore()
// const designer.options = designer.options
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
</script>

<template>
  <div class="preview" bg-white style="fontSize: 32px">
    <div
      :class="[designer.options.border.has ? `border-${designer.options.border.color.type}` : '',
               (designer.options.border.has && !borderIsSingleColor) ? '' : `bg-${designer.options.backgroundColor.type}`]"
      class="ele-padding ele-margin box-border"
    >
      <div v-for="element in designer.list" :id="`${element.type}-${element.id}`" :key="element.id" :style="{ width: `${element.options.size.width}%` }">
        <wrapper :item="element">
          <component :is="BlockComponents[element.blockType].widget" :item="element" />
        </wrapper>
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
    // background-size: 100% auto;
    // background-repeat: repeat;
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
</style>
