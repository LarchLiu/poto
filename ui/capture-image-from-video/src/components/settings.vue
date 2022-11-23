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
const url = ref('https://static.smartisanos.cn/common/video/smartisant1.mp4')
const seek = ref(0)
const duration = ref(0)
const offsetT = ref(0)
const offsetB = ref(0)
const offsetL = ref(0)
const offsetR = ref(0)
const offsetH = computed(() => {
  return 100 - offsetT.value - offsetB.value
})
const offsetW = computed(() => {
  return 100 - offsetL.value - offsetR.value
})

const captureVideo = () => {
  const scaleH = (100 - offsetT.value - offsetB.value) / 100
  const scaleW = (100 - offsetL.value - offsetR.value) / 100
  if (videoE.value && videoWrap.value && captures.value) {
    const canvasEl = document.createElement('canvas')
    const imgEl = document.createElement('img')
    const imagesEl = document.getElementById(captures.value.imagesElId)
    const videoWidth = videoE.value.videoWidth
    const videoHeight = videoE.value.videoHeight
    const useVideoSize = videoWidth > (imagesEl?.offsetWidth || 0)

    canvasEl.width = useVideoSize ? videoWidth : (imagesEl?.offsetWidth || 0) + 4 // selected item padding 1*2 px, border 1*2 px
    canvasEl.height = (useVideoSize ? videoHeight : canvasEl.width * videoHeight / videoWidth) * scaleH / scaleW
    canvasEl.getContext('2d')?.drawImage(videoE.value,
      videoWidth * offsetL.value / 100, videoHeight * offsetT.value / 100, videoWidth * scaleW, videoHeight * scaleH,
      0, 0, canvasEl.width, canvasEl.height)

    imgEl.id = UUID()
    imgEl.src = canvasEl.toDataURL()
    imgEl.ondblclick = () => {
      imgEl.remove()
    }

    imagesEl?.appendChild(imgEl)
  }
}

const videoSeek = () => {
  if (videoE.value)
    videoE.value.currentTime = seek.value
}

const videoLoaded = () => {
  duration.value = videoE.value?.duration || 0
}

const mouseDown = ({ target: resizer, pageX: initialPageX, pageY: initialPageY }: MouseEvent, direction: string) => {
  const _offsetL = offsetL.value
  const _offsetR = offsetR.value
  const _offsetT = offsetT.value
  const _offsetB = offsetB.value
  const curBlock = videoWrap.value
  const blockWidth = curBlock?.offsetWidth ? curBlock?.offsetWidth : 0
  const blockHeight = curBlock?.offsetHeight ? curBlock?.offsetHeight : 0

  designer.ignoreListHis = true
  const resize = (initialSize: number, offset = 0) => {
    return initialSize ? offset / initialSize * 100 : 0
  }
  const onMouseMove = function ({ pageX, pageY }: MouseEvent) {
    const width = resize(blockWidth, pageX - initialPageX)
    const height = resize(blockHeight, pageY - initialPageY)
    let w = 0
    let h = 0
    switch (direction) {
      case 'left':
        w = _offsetL + width
        w = w > 100 ? 100 : w
        w = w < 0 ? 0 : w
        offsetL.value = w
        break

      case 'right':
        w = _offsetR - width
        w = w > 100 ? 100 : w
        w = w < 0 ? 0 : w
        offsetR.value = w
        break

      case 'top':
        h = _offsetT + height
        h = h > 100 ? 100 : h
        h = h < 0 ? 0 : h
        offsetT.value = h
        break

      case 'bottom':
        h = _offsetB - height
        h = h > 100 ? 100 : h
        h = h < 0 ? 0 : h
        offsetB.value = h
        break
    }

    designer.ignoreListHis = true
  }

  const onMouseUp = function () {
    removeEventListener('mousemove', onMouseMove)
    removeEventListener('mouseup', onMouseUp)
  }

  addEventListener('mousemove', onMouseMove)
  addEventListener('mouseup', onMouseUp)
}

const resetSize = () => {
  offsetT.value = 0
  offsetB.value = 0
  offsetL.value = 0
  offsetR.value = 0
}

watch(currentItem, (n, o) => {
  // watching options change of item and add to history
  if (!n || !o || n.id !== o.id || designer.ignoreListHis) {
    if (designer.ignoreListHis)
      designer.ignoreListHis = false
    return
  }

  designer.addHistory()
}, {
  deep: true,
})

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
      <div ref="videoWrap" class="mb-2 relative">
        <video ref="videoE" controls crossorigin="anonymous" :src="url" type="video/mp4" @loadeddata="videoLoaded" />
        <div
          class="absolute border-l-2 cursor-col-resize border-l-sky-500"
          :style="{ height: `${offsetH * 0.9}%`, left: `${offsetL}%`, top: `${offsetT + offsetH * 0.05}%` }"
          @mousedown="mouseDown($event, 'left')"
        />
        <div
          class="absolute border-r-2 cursor-col-resize border-r-sky-500"
          :style="{ height: `${offsetH * 0.9}%`, right: `${offsetR}%`, top: `${offsetT + offsetH * 0.05}%` }"
          @mousedown="mouseDown($event, 'right')"
        />
        <div
          class="absolute border-t-2 cursor-row-resize border-t-sky-500"
          :style="{ width: `${offsetW * 0.9}%`, top: `${offsetT}%`, left: `${offsetL + offsetW * 0.05}%` }"
          @mousedown="mouseDown($event, 'top')"
        />
        <div
          class="absolute border-b-2 cursor-row-resize border-b-sky-500"
          :style="{ width: `${offsetW * 0.9}%`, bottom: `${offsetB}%`, left: `${offsetL + offsetW * 0.05}%` }"
          @mousedown="mouseDown($event, 'bottom')"
        />
      </div>
      <div class="flex justify-between">
        <el-button class="mb-2" @click="captureVideo">
          {{ t('componentSettings.capture') }}
        </el-button>
        <el-button @click="resetSize">
          {{ t('componentSettings.resetSize') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped>

</style>
