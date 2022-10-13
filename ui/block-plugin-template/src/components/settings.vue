<script setup lang="ts">
import { BasicSettingsView } from '@poto/block-basics'
import { useDesignerStore } from '@poto/pinia'
import { computed } from 'vue'
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
</script>

<template>
  <div v-if="!!currentItem">
    <BasicSettingsView />
    block plugin template settings view {{ currentItem.author }}
  </div>
</template>
