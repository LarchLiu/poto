<script setup lang="ts">
const props = defineProps<{
  width: number
  wrapper: HTMLElement
}>()

const emit = defineEmits(['update:width', 'isResizing'])

const isResizing = ref(false)

const mouseDown = ({ target: resizer, pageX: initialPageX, pageY: initialPageY }: MouseEvent) => {
  // const parentIsGroup = props.wrapper.parentElement?.id === 'group'
  const curBlock = props.wrapper.parentElement
  const blockWidth = curBlock?.offsetWidth
  const blockContainer = curBlock?.parentElement
  const blockContainerWidth = blockContainer?.offsetWidth
  // console.log(parentIsGroup, blockWidth, blockContainerWidth)
  isResizing.value = true
  emit('isResizing', isResizing.value)
  const resize = (initialSize: number, offset = 0) => {
    const paneWidth = initialSize + offset

    return paneWidth / blockContainerWidth! * 100
  }
  const onMouseMove = function ({ pageX }: MouseEvent) {
    let width = resize(blockWidth!, pageX - initialPageX)
    width = width > 100 ? 100 : width
    width = width < 0 ? 0 : width

    emit('update:width', width)
  }

  const onMouseUp = function () {
    isResizing.value = false

    removeEventListener('mousemove', onMouseMove)
    removeEventListener('mouseup', onMouseUp)

    emit('isResizing', isResizing.value)
  }

  addEventListener('mousemove', onMouseMove)
  addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div
    class="right-0 transform -translate-y-1/2 rounded border-r-2 box-resize top-1/2"
    @mousedown="mouseDown"
  />
</template>

<style scoped>
  .box-resize {
    cursor: col-resize;
    height: 1.5rem;
    position: absolute;
    width: 1px;
  }
</style>
