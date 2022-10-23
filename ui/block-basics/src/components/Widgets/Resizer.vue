<script setup lang="ts">
const props = defineProps<{
  width: number
  wrapper: HTMLElement
}>()

const emit = defineEmits(['update:width', 'isResizing'])

const designer = useDesignerStore()
const isResizing = ref(false)

const mouseDown = ({ target: resizer, pageX: initialPageX, pageY: initialPageY }: MouseEvent) => {
  // const parentIsGroup = props.wrapper.parentElement?.id === 'group'
  const curBlock = props.wrapper.parentElement
  const blockWidth = curBlock?.offsetWidth ? curBlock?.offsetWidth : 0
  const blockContainer = curBlock?.parentElement
  const containerStyle = getComputedStyle(blockContainer!)
  const containerOffset = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight) + parseFloat(containerStyle.borderLeftWidth) + parseFloat(containerStyle.borderRightWidth)
  const blockContainerWidth = blockContainer?.offsetWidth ? blockContainer?.offsetWidth - containerOffset : 0
  designer.ignoreListHis = true
  isResizing.value = true
  emit('isResizing', isResizing.value)
  const resize = (initialSize: number, offset = 0) => {
    const panelWidth = initialSize + offset

    return blockContainerWidth ? panelWidth / blockContainerWidth * 100 : 0
  }
  const onMouseMove = function ({ pageX }: MouseEvent) {
    let width = resize(blockWidth!, pageX - initialPageX)
    width = width > 100 ? 100 : width
    width = width < 0 ? 0 : width

    designer.ignoreListHis = true
    emit('update:width', width)
  }

  const onMouseUp = function () {
    isResizing.value = false

    removeEventListener('mousemove', onMouseMove)
    removeEventListener('mouseup', onMouseUp)

    emit('isResizing', isResizing.value)
    designer.addHistory()
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
