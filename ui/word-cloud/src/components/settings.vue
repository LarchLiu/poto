<script setup lang="ts">
import type { BlockPluginSettings } from '@poto/types'
import { FontPicker } from '@poto/block-basics'
import type { Settings, Word } from '~/constants'
import { i18nMessages } from '~/constants'

const { t } = useI18n({
  messages: i18nMessages,
})
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const colorsNum = ref(2)
const customRotation = ref(0)
const customColor = ref(false)
const maskModel = ref(false)
const maskUrl = ref('')
const colorPreset = [
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'],
  ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
  ['#5f0f40', '#9a031e', '#fb8b24', '#e36414', '#0f4c5c'],
]
const OPTIONS_DEFAULTS: Options = {
  pickerId: '',
  families: [],
  categories: [],
  scripts: ['latin'],
  variants: ['regular'],
  filter() { return true },
  limit: 80,
  sort: 'alphabet',
}
const presetIdx = ref(0)
// const { maskCanvas, run, ratio } = useGlobalState()

const settings = computed(() => {
  return (currentItem.value ? (currentItem.value.options as BlockPluginSettings).settings as Settings : undefined)
})
const maskCanvas = computed({
  get() {
    return settings.value?.maskCanvas
  },
  set(value) {
    if (settings.value)
      settings.value.maskCanvas = value
  },
})
const ratio = computed({
  get() {
    return settings.value?.ratio || 1
  },
  set(value) {
    if (settings.value)
      settings.value.ratio = value
  },
})
const run = computed({
  get() {
    return settings.value?.run || false
  },
  set(value) {
    if (settings.value)
      settings.value.run = value
  },
})
const wordCloudInstance = computed(() => {
  return settings.value?.wordCloudInstance
})
const maskChange = (url: string) => {
  wordCloudInstance.value?.stop()
  maskCanvas.value = undefined

  const img = new Image()
  img.src = url

  img.onload = function readPixels() {
    window.URL.revokeObjectURL(url)

    maskCanvas.value = document.createElement('canvas')
    maskCanvas.value.width = img.width
    maskCanvas.value.height = img.height
    ratio.value = img.height / img.width

    const ctx = maskCanvas.value.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0, img.width, img.height)

    const imageData = ctx.getImageData(
      0, 0, maskCanvas.value.width, maskCanvas.value.height)
    const newImageData = ctx.createImageData(imageData)

    for (let i = 0; i < imageData.data.length; i += 4) {
      const tone = imageData.data[i]
          + imageData.data[i + 1]
          + imageData.data[i + 2]
      const alpha = imageData.data[i + 3]

      if (alpha < 128 || tone > 200 * 3) {
        // Area not to draw
        // newImageData.data[i]
        //     = newImageData.data[i + 1]
        //     = newImageData.data[i + 2] = 255
        newImageData.data[i] = imageData.data[i]
        newImageData.data[i + 1] = imageData.data[i + 1]
        newImageData.data[i + 2] = imageData.data[i + 2]
        newImageData.data[i + 3] = 0
      }
      else {
        // Area to draw
        // newImageData.data[i]
        //     = newImageData.data[i + 1]
        //     = newImageData.data[i + 2] = 0
        // newImageData.data[i + 3] = 255
        newImageData.data[i] = imageData.data[i]
        newImageData.data[i + 1] = imageData.data[i + 1]
        newImageData.data[i + 2] = imageData.data[i + 2]
        newImageData.data[i + 3] = 255
      }
    }

    ctx.putImageData(newImageData, 0, 0)
    // container.value?.appendChild(maskCanvas.value)
  }
}

const setupWordCloud = () => {
  if (!run.value)
    run.value = true
}

const clearMask = () => {
  maskCanvas.value = undefined
}

const handleColorsNumChange = (cur: number | undefined) => {
  if (cur && cur > 1) {
    for (let i = settings.value!.fontColor.options.colors.length; i < cur; i++)
      settings.value!.fontColor.options.colors[i] = '#000000'

    settings.value!.fontColor.options.colors.length = cur
  }
}
const handleColorTypeChange = (cur: string | number | boolean) => {
  if (cur && cur === 'colorful') {
    settings.value!.fontColor.options.colors = [...colorPreset[presetIdx.value]]
    settings.value!.color = (word: string, weight: number) => {
      const random = customColor.value ? Math.floor(Math.random() * colorsNum.value) : Math.floor(Math.random() * colorPreset[presetIdx.value].length)
      return settings.value!.fontColor.options.colors[random]
    }
    if (customColor.value)
      colorsNum.value = colorPreset[presetIdx.value].length
  }
  else {
    settings.value!.color = settings.value!.fontColor.options.colors[0]
  }
}

const presetChange = (idx: number) => {
  presetIdx.value = idx
  settings.value!.fontColor.options.colors = [...colorPreset[idx]]
}

const defaultSettings = {
  weight: 16, repeat: 1,
}

const addNewWord = (idx: number) => {
  if (settings.value && settings.value.list)
    settings.value.list.splice(idx + 1, 0, { ...defaultSettings, word: '' })
}

const copyWord = (idx: number) => {
  if (settings.value && settings.value.list)
    settings.value.list.splice(idx + 1, 0, { ...settings.value.list[idx] })
}

const deleteWord = (idx: number) => {
  if (settings.value && settings.value.list)
    settings.value.list.splice(idx, 1)
}

const delCustomRotation = (idx: number) => {
  settings.value?.customRotations.splice(idx, 1)
}

const addCustomRotation = () => {
  settings.value?.customRotations.push(customRotation.value)
}

const onFontChange = (font: Font) => {
  if (settings.value)
    settings.value.fontFamily = (font.family === 'Default' ? 'Trebuchet MS' : font.family)
}

const originSetting = () => {
  if (settings.value)
    settings.value.settingOrigin = !settings.value.settingOrigin
}

const originClear = () => {
  if (settings.value)
    settings.value.origin = null
}

watch(maskUrl, (value) => {
  maskChange(value)
})

watch(customColor, (value) => {
  settings.value!.fontColor.options.colors = [...colorPreset[presetIdx.value]]
  if (value)
    colorsNum.value = colorPreset[presetIdx.value].length
})

watch(() => settings.value?.fontColor.options.colors, (value) => {
  if (settings.value && value) {
    if (settings.value.fontColor.type === 'single') {
      settings.value.color = value[0]
    }
    else {
      // settings.value!.fontColor.options.colors = [...colorPreset[presetIdx.value]]
      settings.value.color = (word: string, weight: number) => {
        const random = customColor.value ? Math.floor(Math.random() * colorsNum.value) : Math.floor(Math.random() * colorPreset[presetIdx.value].length)
        return settings.value!.fontColor.options.colors[random]
      }
    }
  }
}, { deep: true })

onMounted(() => {
  if (settings.value) {
    if (settings.value.fontColor.type === 'single') {
      settings.value.color = settings.value!.fontColor.options.colors[0]
    }
    else {
      // settings.value!.fontColor.options.colors = [...colorPreset[presetIdx.value]]
      settings.value.color = (word: string, weight: number) => {
        const random = customColor.value ? Math.floor(Math.random() * colorsNum.value) : Math.floor(Math.random() * colorPreset[presetIdx.value].length)
        return settings.value!.fontColor.options.colors[random]
      }
    }
  }
})
</script>

<template>
  <div v-if="!!currentItem && !!settings">
    <div class="flex flex-row justify-between items-center">
      <div class="font-bold">
        {{ t('componentSettings.wordsList') }}
      </div>
      <div>
        <span class="text-12px mr-1">{{ t('componentSettings.shuffle') }}</span>
        <el-switch v-model="settings.shuffleList" size="small" />
      </div>
    </div>
    <table class="w-full">
      <thead>
        <tr class="text-13px text-left bg-gray-100">
          <th class="w-14px" />
          <th class="w-auto">
            <span>{{ t("componentSettings.word") }}</span>
          </th>
          <th class="w-45px">
            <span>{{ t("componentSettings.size") }}</span>
          </th>
          <th class="w-40px">
            {{ t("componentSettings.color") }}
          </th>
          <th class="w-60px">
            {{ t("componentSettings.rotate") }}
          </th>
          <th class="w-50px">
            {{ t("componentSettings.repeat") }}
          </th>
        </tr>
      </thead>
    </table>
    <el-scrollbar :style="{ height: '310px' }">
      <table id="text_table_list">
        <tbody>
          <draggable
            v-bind="{
              animation: 200,
              group: 'wordcloud',
              disabled: false,
              ghostClass: 'ghost',
            }"
            handle=".handle"
            item-key="id"
            :list="settings?.list"
            class="min-h-26px min-w-26px"
          >
            <template #item="{ element, index }: { element: Word, index: number }">
              <tr>
                <td class="text-13px w-14px handle cursor-move">
                  <handler @add="addNewWord(index)" @copy="copyWord(index)" @delete="deleteWord(index)" />
                </td>
                <td class="text-13px w-auto">
                  <input
                    v-model="element.word"
                    class="p-1px border border-transparent ml-1px outline-0 bg-transparent rounded-2px w-full focus:border-gray-300 hover:border-gray-300"
                  >
                </td>
                <td class="text-12px w-45px">
                  <input
                    v-model="element.weight"
                    class="p-1px border border-transparent ml-1px outline-0 bg-transparent rounded-2px w-full focus:border-gray-300 hover:border-gray-300"
                    type="number" min="1" max="500"
                  >
                </td>
                <td class="text-12px w-40px">
                  <ElColorPicker v-model="element.color" size="small" />
                </td>
                <td class="text-12px w-60px">
                  <input
                    v-model="element.rotate"
                    class="p-1px border border-transparent ml-1px outline-0 bg-transparent rounded-2px w-full focus:border-gray-300 hover:border-gray-300"
                    type="number" placeholder="auto" min="-360" max="360"
                  >
                </td>
                <td class="text-12px w-50px">
                  <input
                    v-model="element.repeat"
                    class="p-1px border border-transparent ml-1px outline-0 bg-transparent rounded-2px w-full focus:border-gray-300 hover:border-gray-300"
                    type="number" min="1" max="500"
                  >
                </td>
              </tr>
            </template>
          </draggable>
        </tbody>
      </table>
    </el-scrollbar>
    <ElForm size="small">
      <div class="italic font-bold mb-2">
        {{ t('componentSettings.title') }}
      </div>
      <ElFormItem :label="t('componentSettings.height')" class="!mb-2">
        <span class="w-full mr-3">
          <el-slider v-model="settings.height" class="mr-3" :min="1" :max="200" :step="0.1" />
        </span>
      </ElFormItem>
      <FontPicker
        class="!mb-2"
        :active-font="settings.fontFamily ? settings.fontFamily : 'Default'"
        :options="OPTIONS_DEFAULTS"
        suffix="word-cloud"
        @change="onFontChange"
      />
      <ElFormItem :label="t('componentSettings.gridSize')" class="!mb-2">
        <span class="w-full mr-3">
          <el-slider v-model="settings.gridSize" class="mr-3" :min="4" :max="30" :step="1" />
        </span>
      </ElFormItem>
      <ElFormItem :label="t('componentSettings.fontColor')" class="!mb-2">
        <div class="flex flex-col w-full">
          <el-radio-group v-model="settings.fontColor.type" @change="handleColorTypeChange">
            <el-radio-button label="single">
              {{ t('componentSettings.single') }}
            </el-radio-button>
            <el-radio-button label="colorful">
              {{ t('componentSettings.colorful') }}
            </el-radio-button>
          </el-radio-group>
          <div v-if="settings.fontColor.type === 'single'" class="mt-1">
            <el-form-item :label="t('componentSettings.colorSelect')">
              <el-color-picker v-model="settings.fontColor.options.colors[0]" />
            </el-form-item>
          </div>
          <div v-else-if="settings.fontColor.type === 'colorful'" class="mt-1 w-full">
            <ElFormItem :label="t('componentSettings.customColor')">
              <ElSwitch v-model="customColor" />
            </ElFormItem>
            <div v-if="customColor">
              <el-form-item :label="t('componentSettings.colorNumber')">
                <el-input-number v-model="colorsNum" :min="2" :max="10" @change="handleColorsNumChange" />
              </el-form-item>
              <el-form-item
                v-for="(_, i) in settings.fontColor.options.colors"
                :key="i"
                :label="t('componentSettings.colorSelect')"
              >
                <el-color-picker v-model="settings.fontColor.options.colors[i]" />
              </el-form-item>
            </div>
            <div v-else class="w-full flex flex-row flex-wrap justify-between mt-1">
              <div
                v-for="colors, idx in colorPreset"
                :key="colors.join('-')"
                :class="presetIdx === idx ? 'outline outline-black' : ''"
                class="mb-1 mr-1 basis-9/20 cursor-pointer hover:outline hover:outline-black"
                @click="presetChange(idx)"
              >
                <div class="flex flex-row ">
                  <div
                    v-for="color in colors" :key="color"
                    class="h-6 w-full"
                    :class="`basis-1/${colors.length}`"
                    :style="{ background: `${color}` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem :label="t('componentSettings.backgroundColor')" class="!mb-2">
        <el-color-picker v-model="settings.backgroundColor" />
      </ElFormItem>
      <ElFormItem :label="t('componentSettings.mask')" class="!mb-2">
        <el-button @click="maskModel = true">
          {{ t('componentSettings.maskSettings') }}
        </el-button>
        <el-button :disabled="!maskCanvas" class="ml-2" @click="clearMask">
          {{ t('componentSettings.clear') }}
        </el-button>
        <mask-settings v-model:open="maskModel" v-model:url="maskUrl" />
      </ElFormItem>
      <ElFormItem v-if="maskCanvas" :label="t('componentSettings.showMask')" class="!mb-2">
        <div class="flex flex-col w-full">
          <el-switch v-model="settings.showMaskShape" />
          <ElFormItem v-if="maskCanvas" :label="t('componentSettings.maskOpacity')" class="!mb-0 mr-3">
            <el-slider v-model="settings.maskOpacity" :min="1" :max="100" />
          </ElFormItem>
        </div>
      </ElFormItem>
      <ElFormItem :label="t('componentSettings.rotateRatio')" class="!mb-2">
        <span class="w-full mr-3">
          <el-slider v-model="settings.rotateRatio" class="mr-3" :min="0" :max="1" :step="0.1" />
        </span>
      </ElFormItem>
      <ElFormItem :label="t('componentSettings.fontRotation')" class="!mb-2">
        <div class="flex flex-col">
          <el-radio-group v-model="settings.randomRotation">
            <el-radio-button :label="true">
              {{ t('componentSettings.random') }}
            </el-radio-button>
            <el-radio-button :label="false">
              {{ t('componentSettings.customRotation') }}
            </el-radio-button>
          </el-radio-group>
          <div v-if="!settings.randomRotation" class="flex flex-row flex-wrap">
            <div v-for="rotation, idx in settings.customRotations" :key="`${idx}-${rotation}`" class="flex flex-row items-center border rounded-sm border-gray-300 mr-1 mt-1 px-2">
              <div>{{ settings.customRotations[idx] }}</div>
              <div class="i-carbon-misuse-alt text-sm hover:text-red-500 ml-2 cursor-pointer" @click="delCustomRotation(idx)" />
            </div>
          </div>
          <div v-if="!settings.randomRotation" class="flex flex-row items-center mt-1">
            <ElInputNumber v-model="customRotation" controls-position="right" size="small" :min="-360" :max="360" />
            <ElButton class="ml-1" size="small" type="primary" @click.stop="addCustomRotation">
              {{ t('componentSettings.add') }}
            </ElButton>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem :label="t('componentSettings.origin')" class="!mb-2">
        <el-button @click="originSetting">
          {{ settings.settingOrigin ? t('componentSettings.settingEnd') : t('componentSettings.settingStart') }}
        </el-button>
        <el-button :disabled="!settings.origin" class="ml-2" @click="originClear">
          {{ t('componentSettings.clear') }}
        </el-button>
        <div v-if="settings.settingOrigin">
          {{ t('componentSettings.originTip') }}
        </div>
      </ElFormItem>
    </ElForm>
    <ElButton size="small" type="primary" @click.stop="setupWordCloud">
      {{ t('componentSettings.run') }}
    </ElButton>
  </div>
</template>

<style scoped>

</style>
