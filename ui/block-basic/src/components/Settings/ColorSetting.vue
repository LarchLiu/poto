<script setup lang="ts">
import type { EleColor } from '~/types'

const props = defineProps<{
  modelValue: EleColor
  showAlpha: boolean
}>()

const emit = defineEmits(['update:modelValue'])
const colorsNum = ref(2)
const photoModel = ref(false)
// let color = $ref(props.modelValue)
const color = computed({
  get() {
    colorsNum.value = props.modelValue.options.colors.length
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const handleColorsNumChange = (cur: number | undefined) => {
  if (cur && cur > 1) {
    for (let i = color.value.options.colors.length; i < cur; i++)
      color.value.options.colors[i] = '#000000'

    color.value.options.colors.length = cur
  }
}
const handleColorTypeChange = (cur: string | number | boolean) => {
  if (cur && cur === 'colorful' && color.value.options.colors.length === 1) {
    color.value.options.colors.push(color.value.options.colors[0])
    colorsNum.value = 2
  }
}
</script>

<template>
  <div class="flex flex-col w-full">
    <el-radio-group v-model="color.type" @change="handleColorTypeChange">
      <el-radio-button label="single">
        单色
      </el-radio-button>
      <el-radio-button label="colorful">
        彩色
      </el-radio-button>
      <el-radio-button label="image">
        图片
      </el-radio-button>
    </el-radio-group>
    <div v-if="color.type === 'single'" class="mt-1">
      <el-form-item label="选择颜色">
        <el-color-picker v-model="color.options.colors[0]" :show-alpha="showAlpha" />
      </el-form-item>
    </div>
    <div v-else-if="color.type === 'colorful'" class="mt-1">
      <el-form-item label="颜色数量">
        <el-input-number v-model="colorsNum" :min="2" :max="10" @change="handleColorsNumChange" />
      </el-form-item>
      <el-form-item v-for="(_, i) in color.options.colors" :key="i" label="选择颜色">
        <el-color-picker v-model="color.options.colors[i]" :show-alpha="showAlpha" />
      </el-form-item>
      <el-form-item label="是否渐变">
        <el-switch v-model="color.options.gradient" />
      </el-form-item>
      <div class="flex flex-row justify-between">
        <div>方向</div>
        <div>{{ `${color.options.degree}deg` }}</div>
      </div>
      <!-- <input v-model="color.options.degree" w-full type="range" min="0" max="360" step="1"> -->
      <div class="mr-3">
        <el-slider v-model="color.options.degree" class="mr-3" :max="360" :step="1" />
      </div>
    </div>
    <div v-else class="mt-1">
      <el-button @click="photoModel = true">
        打开设置
      </el-button>
      <PhotoSetting v-model:open="photoModel" v-model:url="color.options.url" />
    </div>
    <div v-if="!showAlpha">
      <div class="flex flex-row justify-between">
        <div>不透明度</div>
        <div>{{ `${Math.round(color.options.opacity * 100)}%` }}</div>
      </div>
      <!-- <input v-model="color.options.opacity" w-full type="range" min="0" max="1" step="0.05"> -->
      <div class="mr-3">
        <el-slider v-model="color.options.opacity" :max="1" :step="0.05" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
