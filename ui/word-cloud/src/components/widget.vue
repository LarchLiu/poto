<script setup lang="ts">
import type { BlockItem, BlockPluginSettings } from '@poto/types'
import type { PropType } from 'vue'
import WordCloud from './WordCloud'
import type { Settings } from '~/constants'
// import { useGlobalState } from '~/store/wordCloud'

const props = defineProps({
  item: {
    type: Object as PropType<BlockItem>,
    required: true,
  },
  realContent: {
    type: Boolean,
    default: true,
  },
  isPreview: {
    type: Boolean,
    required: false,
  },
})
const settings = computed(() => {
  return (props.item.options as BlockPluginSettings).settings as Settings
})
const wordCloud = ref<HTMLCanvasElement>()
const container = ref<HTMLElement>()
// const maskCanvas = useGlobalState().maskCanvas
// const ratio = useGlobalState().ratio
// const run = useGlobalState().run
const maskCanvas = computed(() => {
  return settings.value.maskCanvas
})
const ratio = computed(() => {
  return settings.value.ratio
})
const run = computed({
  get() {
    return settings.value.run
  },
  set(value) {
    settings.value.run = value
  },
})
const wordCloudInstance = computed({
  get() {
    return settings.value.wordCloudInstance
  },
  set(value) {
    settings.value.wordCloudInstance = value
  },
})
const containerW = computed(() => {
  return (container.value && (container.value.offsetWidth + 4)) || 0
})
const containerH = computed(() => {
  return maskCanvas.value ? containerW.value * ratio.value : settings.value.height / 100 * containerW.value
})
const setupWordCloud = () => {
  const list: { word: string; weight: number; rotate: number | undefined }[] = []
  settings.value.list.forEach((item) => {
    const word = { word: item.word, weight: item.weight, rotate: item.rotate, color: item.color }
    for (let i = 0; i < item.repeat; i++)
      list.push(word)
  })
  const canvasWidth = () => {
    return (wordCloud.value && wordCloud.value.width) || 0
  }
  const canvasHeight = () => {
    return (wordCloud.value && wordCloud.value.height) || 0
  }
  const options = { ...settings.value, list }

  if (maskCanvas.value) {
    options.clearCanvas = false
    options.ellipticity = 1
    // options.shrinkToFit = true
    // options.origin = [375, 300]
    // options.maskColor = 'rgba(0,0,0,0.1)'
    // options.maskGapWidth = 0.1

    /* Determine bgPixel by creating
         another canvas and fill the specified background color. */
    const bctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!

    bctx.fillStyle = options.backgroundColor || '#fff'
    bctx.fillRect(0, 0, 1, 1)
    const bgPixel = bctx.getImageData(0, 0, 1, 1).data

    const maskCanvasScaled
        = document.createElement('canvas')
    maskCanvasScaled.width = canvasWidth()
    maskCanvasScaled.height = canvasHeight()
    const ctx = maskCanvasScaled.getContext('2d', { willReadFrequently: true })!

    ctx.drawImage(maskCanvas.value,
      0, 0, maskCanvas.value.width, maskCanvas.value.height,
      0, 0, maskCanvasScaled.width, maskCanvasScaled.height)

    const imageData = ctx.getImageData(0, 0, canvasWidth(), canvasHeight())
    const newImageData = ctx.createImageData(imageData)
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 128) {
        if (options.showMaskShape) {
          newImageData.data[i] = imageData.data[i]
          newImageData.data[i + 1] = imageData.data[i + 1]
          newImageData.data[i + 2] = imageData.data[i + 2]
          newImageData.data[i + 3] = (options.maskOpacity / 100 * 255) | 0
        }
        else {
          newImageData.data[i] = bgPixel[0]
          newImageData.data[i + 1] = bgPixel[1]
          newImageData.data[i + 2] = bgPixel[2]
          newImageData.data[i + 3] = bgPixel[3] - 1
        }
      }
      else {
        // This color must not be the same w/ the bgPixel.
        newImageData.data[i] = bgPixel[0]
        newImageData.data[i + 1] = bgPixel[1]
        newImageData.data[i + 2] = bgPixel[2]
        newImageData.data[i + 3] = bgPixel[3]
      }
    }

    ctx.putImageData(newImageData, 0, 0)

    const wcCtx = wordCloud.value!.getContext('2d')!
    wcCtx.fillStyle = options.backgroundColor
    wcCtx.clearRect(0, 0, canvasWidth(), canvasHeight())
    if (options.showMaskShape)
      wcCtx.fillRect(0, 0, canvasWidth(), canvasHeight())

    wcCtx.drawImage(maskCanvasScaled, 0, 0)
  }
  wordCloudInstance.value = new WordCloud(wordCloud.value, {
    ...options,
  })
  wordCloudInstance.value.start()
}

onMounted(() => {
  if (containerW.value > 0) {
    nextTick(() => {
      watch(run, (value) => {
        if (value) {
          setupWordCloud()
          run.value = false
        }
      })
      setupWordCloud()
    })
  }
})
</script>

<template>
  <div v-if="realContent && !isPreview" ref="container" class="w-full">
    <canvas v-if="containerW" ref="wordCloud" class="canvas" :width="containerW" :height="containerH" />
  </div>
  <div v-else class="flex justify-center items-center">
    <div class="i-carbon-word-cloud text-4xl mr-4" />
    <div>Word Cloud</div>
  </div>
</template>

<style scoped>
  .canvas {
    display: block;
    position: relative;
    overflow: hidden;
  }
</style>
