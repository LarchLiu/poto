<script setup lang="ts">
import { Editor, ThemeGlobal, defaultValueCtx, rootCtx } from '@milkdown/core'
import { getMarkdown, replaceAll } from '@milkdown/utils'
import { VueEditor, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'
// import { slash } from '@milkdown/plugin-slash'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { nord } from '@milkdown/theme-nord'
// import { tooltip } from '@milkdown/plugin-tooltip'
import { useHead } from '@vueuse/head'

const props = defineProps<{
  content: string
  isMarkdown?: boolean
}>()
const emit = defineEmits(['update:content'])
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
    },
  ],
})
const designer = useDesignerStore()
const hasChanged = ref(false)
const extendedNord = nord.override((emotion, manager) => {
  manager.set(ThemeGlobal, () => {
    emotion.injectGlobal`
        editorLayout {
          padding: 0px 0px;
          outline: none;
          & > * {
              margin: 0;
          }
        }
    `
  })
})

const editor = useEditor((root) => {
  const e = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, props.content)
      ctx.get(listenerCtx)
        .markdownUpdated((ctx, markdown, prevMarkdown) => {
          hasChanged.value = true
          designer.ignoreListHis = true
          emit('update:content', markdown)
        })
        .blur((ctx) => {
          if (hasChanged.value) {
            hasChanged.value = false
            designer.addHistory()
          }
        })
    })
    .use(extendedNord)
    // .use(tooltip)
    .use(listener)
    .use(commonmark)
  return props.isMarkdown ? e : e
},
).editor

watch(() => props.content, (value) => {
  const isSame = editor.editor.value?.action(getMarkdown()) === value
  if (isSame)
    return

  editor.editor.value?.action(replaceAll(value))
})
</script>

<template>
  <VueEditor :editor="editor" :class="isMarkdown ? 'markdown-body' : ''" />
</template>

<style scoped lang="scss">
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    height: auto !important;
  }
  :deep(.ProseMirror) {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */

    & >*:last-child {
      margin-bottom: 0 !important;
    }
  }
  :deep(img.ProseMirror-separator) {
    display: inline !important;
    border: none !important;
    margin: 0px !important;
  }
  :deep(.code-fence) {
    background-color: transparent;
    font-size: 16px;
    padding: 0;
  }
  :deep(.code-fence_selector-wrapper) {
    visibility: hidden;
    height: 0;
  }
  :deep(.tooltip) {
    .icon {
      width: 36px;
      line-height: 36px;
    }
  }
</style>
