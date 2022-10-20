<script setup lang="ts">
import type { DesignerTheme } from '@poto/types'
import contrast from 'get-contrast'
import { CssColor, cssColorNames } from '~/utils/constants'

const designer = useDesignerStore()
// const curTheme = designer.options.theme
const pinnedColor = ref('')
const usePreset = ref(false)
const pinnedColors = ['white', 'black', 'blue', 'dodgerblue', 'skyblue', 'indigo', 'blueviolet', 'fuchsia', 'violet',
  'hotpink', 'red', 'orangered', 'orange', 'gold', 'yellow', 'springgreen', 'teal', 'cyan']

// from https://github.com/johno/random-hex-color
const randomHexColor = () => {
  return `#${(`000000${Math.floor(Math.random() * 16777215).toString(16)}`).slice(-6)}`
}

const getColorPair = (pinnedColor?: string) => {
  const colorA: string = pinnedColor || randomHexColor()
  let colorB: string = randomHexColor()
  let colorC: string = randomHexColor()
  let colorD: string = randomHexColor()
  let scoreB: number = contrast.ratio(colorA, colorB)
  let scoreC: number = contrast.ratio(colorA, colorC)

  while (!contrast.isAccessible(colorA, colorB)) {
    colorB = randomHexColor()
    scoreB = contrast.ratio(colorA, colorB)
  }
  while (!contrast.isAccessible(colorA, colorC)) {
    colorC = randomHexColor()
    scoreC = contrast.ratio(colorA, colorC)
  }
  while (!contrast.isAccessible(scoreB > scoreC ? colorB : colorC, colorD))
    colorD = randomHexColor()

  return (scoreB > scoreC) ? [colorA, colorB, colorC, colorD] : [colorA, colorC, colorB, colorD]
}
const colors = ref<string[]>([])
const getColors = () => {
  colors.value = getColorPair(usePreset.value ? pinnedColor.value : '')
}
const setPinnedColor = (color: CssColor) => {
  pinnedColor.value = cssColorNames[color]
  getColors()
}
const setTheme = (bg: string, font: string, primary: string) => {
  const theme: DesignerTheme = {
    backgroundColor: bg,
    primaryColor: primary,
    fontColor: font,
    fontFamily: '',
    elFontSize: 32,
  }
  designer.setTheme(theme)
}

watch(() => designer.theme, (value) => {
  if (!value)
    designer.resetTheme()
})
onMounted(() => {
  if (designer.theme) {
    const colorA: string = designer.theme.backgroundColor
    const colorB: string = designer.theme.fontColor
    const colorC: string = designer.theme.primaryColor
    let colorD: string = randomHexColor()
    while (!contrast.isAccessible(colorB, colorD))
      colorD = randomHexColor()
    colors.value = [colorA, colorB, colorC, colorD]
  }
  else {
    designer.resetTheme()
  }
})
</script>

<template>
  <basic-settings-view :is-designer="true" />
  <div id="theme">
    <div>Theme</div>
    <el-form size="small">
      <el-form-item label="Pinned">
        <el-switch v-model="usePreset" />
      </el-form-item>
    </el-form>
    <div v-if="usePreset" class="flex flex-wrap gap-2 justify-center p-2 shadow-gray-400">
      <div
        v-for="c in pinnedColors" :key="c" :title="c" :style="{ background: c }"
        class="shadow-md h-22px w-22px rounded-1/2 cursor-pointer" @click="setPinnedColor(c as CssColor)"
      />
    </div>
    <div :style="{ background: colors[0], padding: '8px' }">
      <div
        :style="{ color: colors[1], border: `2px solid ${colors[2]}` }"
        class="rounded p-2 transition-colors"
      >
        <div class="flex gap-2 items-center">
          <div>{{ `font: ${colors[1]}` }}</div>
          <el-color-picker v-model="colors[1]" size="small" />
        </div>
        <div class="flex gap-2 items-center">
          <div>{{ `primary: ${colors[2]}` }}</div>
          <el-color-picker v-model="colors[2]" size="small" />
        </div>
        <div class="flex gap-2 items-center">
          <div>{{ `background: ${colors[0]}` }}</div>
          <el-color-picker v-model="colors[0]" size="small" />
        </div>
      </div>
      <div class="flex justify-between items-center mt-2">
        <div :style="{ color: colors[1], fontWeight: 700 }">
          Select this theme
        </div>
        <div
          :style="{ color: colors[1], border: `2px solid ${colors[2]}`, borderRadius: '999px' }"
          class="px-4 transition-colors cursor-pointer"
          @click="setTheme(colors[0], colors[1], colors[2])"
        >
          OK
        </div>
      </div>
    </div>
    <div :style="{ background: colors[1], padding: '8px', marginTop: '8px' }">
      <div
        :style="{ color: colors[0], border: `2px solid ${colors[3]}` }"
        class="rounded p-2 transition-colors"
      >
        <div class="flex gap-2 items-center">
          <div>{{ `font: ${colors[0]}` }}</div>
          <el-color-picker v-model="colors[0]" size="small" />
        </div>
        <div class="flex gap-2 items-center">
          <div>{{ `primary: ${colors[3]}` }}</div>
          <el-color-picker v-model="colors[3]" size="small" />
        </div>
        <div class="flex gap-2 items-center">
          <div>{{ `background: ${colors[1]}` }}</div>
          <el-color-picker v-model="colors[1]" size="small" />
        </div>
      </div>
      <div class="flex justify-between items-center mt-2">
        <div :style="{ color: colors[0], fontWeight: 700 }">
          Select this theme
        </div>
        <div
          :style="{ color: colors[0], border: `2px solid ${colors[3]}`, borderRadius: '999px' }"
          class="px-4 transition-colors cursor-pointer"
          @click="setTheme(colors[1], colors[0], colors[3])"
        >
          OK
        </div>
      </div>
    </div>
    <button
      :style="{
        color: designer.theme.fontColor,
        background: designer.theme.backgroundColor,
        border: `2px solid ${designer.theme.primaryColor}`,
        padding: '4px 8px',
      }"
      class="mt-2 rounded-md"
      @click="getColors"
    >
      Next Theme
    </button>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 8px;
  }
</style>
