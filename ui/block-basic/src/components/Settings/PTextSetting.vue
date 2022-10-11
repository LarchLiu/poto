<script setup lang="ts">
import { store } from '~/store'
import type { TextSettings } from '~/types'

const designer = useDesignerStore(store.piniaInstance)
const currentItem = computed(() => designer.getCurrentItem())
const widgetOptions = computed(() => (currentItem.value ? currentItem.value.options as TextSettings : undefined))
</script>

<template>
  <div v-if="widgetOptions">
    <div class="italic font-bold mb-2">
      基本属性
    </div>
    <basic-setting />
    <el-form v-if="widgetOptions" size="small">
      <div class="italic font-bold mb-2">
        组件属性
      </div>
      <el-form-item label="对齐">
        <el-radio-group v-model="widgetOptions.align">
          <el-radio-button label="left">
            居左
          </el-radio-button>
          <el-radio-button label="center">
            居中
          </el-radio-button>
          <el-radio-button label="right">
            居右
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div class="font-bold mb-2">
        字体
      </div>
      <el-form-item label="大小">
        <el-input v-model="widgetOptions.font.size" />
      </el-form-item>
      <el-form-item label="字重">
        <el-slider v-model="widgetOptions.font.weight" class="mr-3" :min="100" :max="900" :step="100" />
      </el-form-item>
      <el-form-item label="样式">
        <el-radio-group v-model="widgetOptions.font.style">
          <el-radio-button label="normal">
            正常
          </el-radio-button>
          <el-radio-button label="italic">
            <span class="italic">斜体</span>
          </el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="widgetOptions.font.decoration" class="mt-1">
          <el-radio-button label="none">
            正常
          </el-radio-button>
          <el-radio-button label="underline">
            <span class="underline">下划线</span>
          </el-radio-button>
          <el-radio-button label="line-through">
            <span class="line-through">贯穿线</span>
          </el-radio-button>
          <el-radio-button label="overline">
            <span class="overline">上划线</span>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="颜色">
        <color-setting v-model="widgetOptions.font.color" :show-alpha="true" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  :deep(.el-form-item--small) {
    margin-bottom: 8px;
  }
</style>
