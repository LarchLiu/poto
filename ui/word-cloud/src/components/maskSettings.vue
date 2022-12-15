<script setup lang="ts">
import heart from '../assets/heart.png'
import china from '../assets/china-map.png'
import runMan from '../assets/run-man.png'
import shape1 from '../assets/shape-1.png'
import like from '../assets/like.png'
import message from '../assets/message.png'
import github from '../assets/github.png'
import apple from '../assets/apple.png'
import tesla from '../assets/tesla.png'
import { i18nMessages } from '~/constants'

const props = defineProps<{
  open: boolean
  url?: string
}>()

const emit = defineEmits(['update:open', 'update:url'])

const { t } = useI18n({
  messages: i18nMessages,
})
const mask = ref<HTMLInputElement>()
const photoList = [
  heart,
  china,
  runMan,
  shape1,
  like,
  message,
  github,
  apple,
  tesla,
]
const openModel = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  },
})

const saveUrl = (value: string) => {
  openModel.value = false
  emit('update:url', value)
}

const maskChange = () => {
  const file = mask.value?.files && mask.value?.files[0]

  if (!file)
    return

  const url = window.URL.createObjectURL(file)
  mask.value!.value = ''

  saveUrl(url)
}
</script>

<template>
  <el-drawer v-model="openModel" direction="rtl">
    <template #header>
      <h4>{{ t('componentSettings.maskSettings') }}</h4>
    </template>
    <template #default>
      <div>
        <input
          id="config-mask" ref="mask" type="file" accept="image/png"
          style="display:none;" @change="maskChange"
        >
        <el-button @click="mask!.click()">
          {{ t('componentSettings.selectFile') }}
        </el-button>
        <div style="filter: drop-shadow(0px 3px 7px rgba(0,0,0,0.2));">
          <div
            style="clip-path: inset(0, 0);
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                padding: 10px;
                box-sizing: border-box;
                cursor: pointer;
                overflow: hidden;"
          >
            <img
              v-for="img, idx in photoList"
              :key="idx"
              class="border rounded p-2"
              style="width: 100%;height: 100px;object-fit: contain;"
              :src="img" @click="saveUrl(img)"
            >
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>
