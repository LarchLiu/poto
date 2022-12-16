<script setup lang="ts">
import { i18nMessages } from '~/constants'
const emit = defineEmits(['add', 'copy', 'delete'])

const { t } = useI18n({
  messages: i18nMessages,
})
const visible = ref(false)
const popover = ref()
onClickOutside(popover, () => visible.value = false)
const addItem = () => {
  emit('add')
  visible.value = false
}
const copyItem = () => {
  emit('copy')
  visible.value = false
}
const deleteItem = () => {
  emit('delete')
  visible.value = false
}
</script>

<template>
  <el-popover ref="popover" popper-class="!p-0" placement="right" :visible="visible" :show-arrow="false">
    <template #reference>
      <span @contextmenu.prevent="visible = true" @dblclick="deleteItem"> ⠿ </span>
    </template>
    <div
      class="flex flex-row items-center cursor-pointer p-2 hover:bg-blue-400 hover:text-white hover:rounded"
      @click="deleteItem"
    >
      <div class="i-carbon-trash-can mr-2" />
      <div>{{ t("componentSettings.delete") }}</div>
    </div>
    <div
      class="flex flex-row items-center cursor-pointer p-2 hover:bg-blue-400 hover:text-white hover:rounded"
      @click="copyItem"
    >
      <div class="i-carbon-copy mr-2" />
      <div>{{ t("componentSettings.copy") }}</div>
    </div>
    <div
      class="flex flex-row items-center cursor-pointer p-2 hover:bg-blue-400 hover:text-white hover:rounded"
      @click="addItem"
    >
      <div class="i-carbon-add mr-2" />
      <div>{{ t("componentSettings.add") }}</div>
    </div>
  </el-popover>
</template>

<style scoped>

</style>
