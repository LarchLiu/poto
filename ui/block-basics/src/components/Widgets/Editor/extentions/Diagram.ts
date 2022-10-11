import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import DiagramView from '../views/DiagramView.vue'

export default Node.create({
  name: 'diagram',
  group: 'block',
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      height: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'diagram',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['diagram', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(DiagramView)
  },
})
