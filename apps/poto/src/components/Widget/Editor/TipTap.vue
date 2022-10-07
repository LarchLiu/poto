<script setup lang="ts">
import {
  BubbleMenu,
  EditorContent, FloatingMenu, useEditor,
} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import KatexInline from './extentions/KatexInline'
import KatexBlock from './extentions/KatexBlock'
import Diagram from './extentions/Diagram'

const props = defineProps<{
  content: string
  isMarkdown?: boolean
}>()

const emit = defineEmits(['update:content'])

const editor = useEditor({
  content: props.content,
  extensions: [
    StarterKit,
    KatexInline,
    KatexBlock,
    Diagram,
  ],
  onUpdate: () => {
    emit('update:content', editor.value?.getHTML())
  },
})

const commandKatexInline = () => {
  editor.value!
    .chain()
    .focus()
    .command(({ commands, state, dispatch }) => {
    // manipulate the transaction
      // tr.insertText('hey, that’s cool!')
      const { selection } = state
      const position = selection.$from ? selection.$from.pos : selection.$to.pos
      commands.insertContentAt(position, {
        type: 'katex-inline',
      })
      return true
    })
    .run()
}

const commandKatexBlock = () => {
  editor.value!
    .chain()
    .focus()
    .command(({ commands, state, dispatch }) => {
      const { selection } = state
      const position = selection.$from ? selection.$from.pos : selection.$to.pos
      commands.insertContentAt(position, {
        type: 'katex-block',
      })
      return true
    })
    .run()
}

const commandDiagram = () => {
  editor.value!
    .chain()
    .focus()
    .command(({ commands, state, dispatch }) => {
      const { selection } = state
      const position = selection.$from ? selection.$from.pos : selection.$to.pos
      commands.insertContentAt(position, {
        type: 'diagram',
      })
      return true
    })
    .run()
}

watch(() => props.content, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (isSame)
    return

  editor.value?.commands.setContent(value, false)
})
</script>

<template>
  <div v-if="!!editor">
    <BubbleMenu
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button :class="{ 'is-active': editor.isActive('bold') }" @click="editor!.chain().focus().toggleBold().run()">
        Bold
      </button>
      <button :class="{ 'is-active': editor.isActive('italic') }" @click="editor!.chain().focus().toggleItalic().run()">
        Italic
      </button>
      <button :class="{ 'is-active': editor.isActive('strike') }" @click="editor!.chain().focus().toggleStrike().run()">
        Strike
      </button>
      <button :class="{ 'is-active': editor.isActive('katex-inline') }" @click="commandKatexInline">
        Katex
      </button>
      <button :class="{ 'is-active': editor.isActive('katex-block') }" @click="commandKatexBlock">
        Katex Block
      </button>
    </BubbleMenu>

    <FloatingMenu
      class="floating-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor!.chain().focus().toggleHeading({ level: 1 }).run()">
        H1
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor!.chain().focus().toggleHeading({ level: 2 }).run()">
        H2
      </button>
      <button :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor!.chain().focus().toggleBulletList().run()">
        Bullet List
      </button>
      <button :class="{ 'is-active': editor.isActive('katex-block') }" @click="commandKatexBlock">
        Katex Block
      </button>
      <button :class="{ 'is-active': editor.isActive('diagram') }" @click="commandDiagram">
        Diagram
      </button>
    </FloatingMenu>
  </div>
  <EditorContent :editor="editor" :class="isMarkdown ? 'markdown-body' : ''" />
</template>

<style scoped lang="scss">
.bubble-menu {
  display: flex;
  background-color: #0D0D0D;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    color: #FFF !important;
    -webkit-text-fill-color: #FFF !important;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

.floating-menu {
  display: flex;
  background-color: #0D0D0D10;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    color: #0D0D0D;
    -webkit-text-fill-color: #0D0D0D !important;
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
</style>

