<script setup lang="ts">
import { BasicSettingsView } from '@poto/block-basics'
import { useDesignerStore } from '@poto/pinia'
import { computed, watch } from 'vue'
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())

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
</script>

<template>
  <div v-if="!!currentItem">
    <BasicSettingsView />
    block plugin template settings view {{ currentItem.author }}
  </div>
</template>
