import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import KatexBlockView from '../views/KatexView.vue'

export default Node.create({
  name: 'katex-block',
  group: 'block',
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      src: {
        default: '\\sum Block',
      },
      isBlock: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'katex-block',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['katex-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexBlockView)
  },
})

