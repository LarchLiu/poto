<script setup lang="ts">
import { store } from '~/store'

const props = defineProps<{
  open: boolean
  url?: string
}>()

const emit = defineEmits(['update:open', 'update:url'])
const selectedPhoto = ref('')
const photoList = ref<Array<any>>([])
const openModel = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  },
})
const urlModel = computed({
  get() {
    return props.url
  },
  set(value) {
    emit('update:url', value)
  },
})
const saveUrl = (value: string) => {
  selectedPhoto.value = value
  openModel.value = false
  emit('update:url', value)
}
onMounted(async () => {
  const { data } = await useFetch(`https://pixabay.com/api/?key=${store.pixabayApiKey}&image_type=photo`)
  photoList.value = JSON.parse(data.value as string).hits
})
</script>

<template>
  <el-drawer v-model="openModel" direction="rtl">
    <template #header>
      <h4>图片设置</h4>
    </template>
    <template #default>
      <div>
        <el-form-item label="URL">
          <el-input v-model="urlModel" />
        </el-form-item>
        <div class="container">
          <div class="mask">
            <img v-for="img in photoList" :key="img.id" :src="img.previewURL" @click="saveUrl(img.largeImageURL)">
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <el-button type="primary" @click="openModel = false">
        cancel
      </el-button>
      <el-button type="primary" @click="saveUrl(selectedPhoto)">
        save
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.container {
  filter: drop-shadow(0px 3px 7px rgba(0,0,0,0.2));
}
.mask {
  clip-path: inset(0, 0);

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
}
@media (min-width: 920px) {
  mask {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 34vh);
  }
}
</style>