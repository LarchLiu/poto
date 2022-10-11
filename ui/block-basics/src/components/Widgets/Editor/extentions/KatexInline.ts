import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import KatexInlineView from '../views/KatexView.vue'

export default Node.create({
  name: 'katex-inline',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: '\\sum Inline',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'katex-inline',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['katex-inline', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexInlineView)
  },
})

