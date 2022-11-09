<script setup lang="ts">
const props = defineProps<{
  modelValue: number[]
  isCorner: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const num = ref(0)
const hasIdx = ref([{
  idx: 0,
  has: false,
}, {
  idx: 1,
  has: false,
}, {
  idx: 2,
  has: false,
}, {
  idx: 3,
  has: false,
}])
const list = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const hasItemByIdx = (idx: number) => hasIdx.value[idx].has
const isAll = computed(() => {
  for (let i = 0; i < hasIdx.value.length; i++) {
    if (!hasItemByIdx(i))
      return false
  }

  return true
})
const isEmpty = computed(() => {
  for (let i = 0; i < hasIdx.value.length; i++) {
    if (hasItemByIdx(i))
      return false
  }

  return true
})
const onItemClick = (idx: number) => {
  if (isEmpty.value)
    num.value = list.value[idx]

  if (hasItemByIdx(idx))
    hasIdx.value[idx].has = false

  else
    hasIdx.value[idx].has = true
    // list.value[idx] = num.value
}
const onButtonClick = () => {
  if (isAll.value) {
    hasIdx.value.forEach((item) => {
      item.has = false
    })
  }
  else {
    hasIdx.value.forEach((item) => {
      item.has = true
      // list.value[item.idx] = num.value
    })
  }
}
watch(num, () => {
  hasIdx.value.forEach((item) => {
    if (item.has)
      list.value[item.idx] = num.value
  })
})
// onMounted(() => {
//   list.value.forEach((item, idx) => {
//     if (item !== 0)
//       hasIdx[idx].has = true
//     if (item > num.value)
//       num.value = item
//   })
// })
</script>

<template>
  <div class="flex flex-row items-center">
    <div class="relative w-20 h-20 ring-4 ring-gray-400 ring-opacity-10 ring-inset rounded-xl flex-none text-center">
      <div v-if="isCorner">
        <div :class="hasItemByIdx(0) ? 'has' : ''" class="border-t-4 border-l-4 item rounded-tl-xl " @click="onItemClick(0)">
          {{ list[0] }}
        </div>
        <div :class="hasItemByIdx(1) ? 'has' : ''" class="right-0 border-t-4 border-r-4 item rounded-tr-xl" @click="onItemClick(1)">
          {{ list[1] }}
        </div>
        <div :class="hasItemByIdx(2) ? 'has' : ''" class="bottom-0 right-0 border-b-4 border-r-4 item rounded-br-xl" @click="onItemClick(2)">
          {{ list[2] }}
        </div>
        <div :class="hasItemByIdx(3) ? 'has' : ''" class="bottom-0 border-b-4 border-l-4 item rounded-bl-xl" @click="onItemClick(3)">
          {{ list[3] }}
        </div>
      </div>
      <div v-else>
        <div :class="hasItemByIdx(0) ? 'has' : ''" class="transform -translate-x-1/2 border-t-4 item left-1/2" @click="onItemClick(0)">
          {{ list[0] }}
        </div>
        <div :class="hasItemByIdx(1) ? 'has' : ''" class="right-0 transform -translate-y-1/2 border-r-4 item top-1/2" @click="onItemClick(1)">
          {{ list[1] }}
        </div>
        <div :class="hasItemByIdx(2) ? 'has' : ''" class="bottom-0 transform -translate-x-1/2 border-b-4 item left-1/2" @click="onItemClick(2)">
          {{ list[2] }}
        </div>
        <div :class="hasItemByIdx(3) ? 'has' : ''" class="transform -translate-y-1/2 border-l-4 item top-1/2" @click="onItemClick(3)">
          {{ list[3] }}
        </div>
      </div>
      <div class="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-400 border-opacity-25 rounded button left-1/2 top-1/2" @click="onButtonClick" />
    </div>
    <div class="ml-1">
      <el-input-number v-model="num" :min="isCorner ? 0 : undefined" :disabled="isEmpty" />
    </div>
  </div>
</template>

<style scoped>
  .item {
    --tw-border-opacity: 1;
    border-color: rgba(209,213,219,var(--tw-border-opacity));
    --tw-border-opacity: .4;
    cursor: pointer;
    height: 1.55rem;
    position: absolute;
    width: 1.55rem;
    -webkit-transition-property: all;
    -o-transition-property: all;
    transition-property: all;
    -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
    -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    -webkit-transition-duration: .15s;
    -o-transition-duration: .15s;
    transition-duration: .15s;
    -webkit-transition-duration: .2s;
    -o-transition-duration: .2s;
    transition-duration: .2s;
  }

  .item:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(156,163,175,var(--tw-bg-opacity));
    --tw-bg-opacity: .2;
  }
  .item.active {
    --tw-border-opacity: 1;
    border-color: rgba(14,165,233,var(--tw-border-opacity));
  }
  .item.has:not(.active) {
    --tw-border-opacity: 1;
    border-color: rgba(56,189,248,var(--tw-border-opacity));
    --tw-border-opacity: .7;
  }

  .button {
    cursor: pointer;
  }
  .button:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(156,163,175,var(--tw-bg-opacity));
    --tw-bg-opacity: .2;
  }
</style>
