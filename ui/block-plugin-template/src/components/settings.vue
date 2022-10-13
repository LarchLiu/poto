<script setup lang="ts">
import { useDesignerStore } from '@poto/pinia'
import { computed } from 'vue'
const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
</script>

<template>
  <div v-if="!!currentItem">
    block plugin template settings view
  </div>
</template>
