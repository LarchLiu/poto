<script setup lang="ts">
import { UUID } from '@poto/utils'
import type { BlockPluginSettings } from '@poto/types'
import type { Settings } from '~/constants'
import { i18nMessages } from '~/constants'

const { t } = useI18n({
  messages: i18nMessages,
})
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const captures = computed(() => {
  return (currentItem.value ? (currentItem.value.options as BlockPluginSettings).captures as Settings : undefined)
})

const videoE = ref<HTMLVideoElement>()
const videoWrap = ref<HTMLElement>()
const url = ref('https://static.smartisanos.cn/common/video/smartisan-tnt-jianguo.mp4')
const seek = ref(0)
const duration = ref(0)
// const imgUri = ref('')

const captureVideo = () => {
  // await getBlobUrl()
  const scaleH = 1
  if (videoE.value && videoWrap.value && captures.value) {
    const canvasEl = document.createElement('canvas')
    const imgEl = document.createElement('img')

    const videoWidth = videoE.value.videoWidth
    const videoHeight = videoE.value.videoHeight
    canvasEl.width = captures.value?.imagesEl?.offsetWidth || videoWrap.value.offsetWidth
    canvasEl.height = canvasEl.width * videoHeight / videoWidth * scaleH
    canvasEl.getContext('2d')?.drawImage(videoE.value,
      0, videoHeight * (1 - scaleH), videoWidth, videoHeight * scaleH,
      0, 0, canvasEl.width, canvasEl.height)

    // imgUri.value = canvasEl.toDataURL()
    imgEl.id = UUID()
    imgEl.src = canvasEl.toDataURL()
    imgEl.ondblclick = () => {
      imgEl.remove()
    }

    captures.value?.imagesEl?.appendChild(imgEl)
  }
}

const videoSeek = () => {
  if (videoE.value)
    videoE.value.currentTime = seek.value
}

const videoLoaded = () => {
  duration.value = videoE.value?.duration || 0
}

onMounted(() => {
  videoE.value && videoE.value.addEventListener('seeked', () => {
    captureVideo()
  })
})
</script>

<template>
  <div v-if="!!currentItem">
    <div class="italic font-bold mb-2">
      {{ t('basicSettings.title') }}
    </div>
    <BasicSettingsView />
    <el-form v-if="captures" size="small">
      <div class="italic font-bold mb-2">
        {{ t('componentSettings.title') }}
      </div>
      <el-form-item :label="t('componentSettings.url')" class="!mb-2">
        <el-input v-model="url" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.seek')" class="!mb-2">
        <div class="flex">
          <div>
            <el-input-number v-model="seek" :min="0" :max="duration" />
          </div>
          <div class="ml-2">
            <el-button @click="videoSeek">
              {{ t('componentSettings.capture') }}
            </el-button>
          </div>
        </div>
      </el-form-item>
      <div ref="videoWrap" class="mb-2">
        <video ref="videoE" controls crossorigin="anonymous" :src="url" type="video/mp4" @loadeddata="videoLoaded" />
      </div>
      <el-button class="mb-2" @click="captureVideo">
        {{ t('componentSettings.capture') }}
      </el-button>
    </el-form>
  </div>
</template>

<style scoped>

</style>
