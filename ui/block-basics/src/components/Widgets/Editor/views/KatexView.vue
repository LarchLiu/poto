<script>
// import { openUrl } from 'src/utils/shared'
// Code Mirror
import { Codemirror } from 'vue-codemirror'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
// import 'codemirror/addon/edit/continuelist'
// import 'codemirror/addon/selection/active-line'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/neat.css'
// import 'codemirror/mode/markdown/markdown'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default {
  name: 'KatexView',
  components: {
    Codemirror,
    NodeViewWrapper,
  },
  props: nodeViewProps,
  data() {
    return {
      example: '',
      html: '',
      error: false,
      isBlock: !!this.node.attrs.isBlock,
      timeout: 0,
      // editor
      editorOption: {
        tabSize: 4,
        // mode: 'text/x-gfm',
        mode: {
          name: 'markdown',
          json: true,
        },
        theme: 'neat',
        line: true,
        lineWrapping: true,
        lineNumbers: true,
        // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
        // keyMap: 'sublime',
        // 按键映射
        extraKeys: {
          Enter: 'newlineAndIndentContinueMarkdownList',
        },
        // 代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],

        // Styles
        // 选中文本自动高亮，及高亮方式
        styleActiveLine: true,
        styleSelectedText: true,
        scrollbarStyle: 'native',
        tabindex: 1,
        autofocus: false,
        // TOC
      },
    }
  },
  computed: {
    src: {
      get() {
        return this.node.attrs.src
      },
      set(src) {
        this.updateAttributes({
          src,
        })
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.src) {
        this.src = '\\sum'

        setTimeout(() => {
          this.renderKatex()
        }, 100)
      }
      else {
        this.renderKatex()
      }
    },
    renderKatex() {
      try {
        this.error = false
        this.html = katex.renderToString(this.src, { displayMode: (!!this.isBlock) })
      }
      catch (e) {
        this.error = true
        this.html = e.message
      }
    },
    onEditorChanged() {
      if (this.timeout)
        clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.renderKatex()
      }, 300)
    },
    onSelectTemplate(item) {
    },
    onHelp() {
      // openUrl('https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference')
    },
    onDelete() {
      // const tr = this.view.state.tr
      // const pos = this.getPos()
      // tr.delete(pos, pos + this.node.nodeSize)
      // this.view.dispatch(tr)

      this.deleteNode()
    },
  },
}
</script>

<template>
  <NodeViewWrapper class="o-katex-inline">
    <el-popover
      :width="600"
      :offset="20"
      trigger="click"
      :show-arrow="false"
      transition="none"
      popper-class="o-katex-editor"
    >
      <template #reference>
        <div v-if="isBlock" class="text-center" v-html="html" />
        <span v-else v-html="html" />
      </template>
      <Codemirror
        v-model="src"
        class="codemirror"
        :options="editorOption"
        @change="onEditorChanged"
      />
      <div class="flex justify-between items-center mt-1 bg-gray-50">
        <div class="flex items-center">
          <div class="i-carbon-sigma" /> {{ isBlock ? 'Block' : 'Inline' }}
        </div>
        <div>
          <div class="i-carbon-trash-can cursor-pointer text-red" @click="onDelete" />
        </div>
      </div>
    </el-popover>
  </NodeViewWrapper>
</template>

<style lang="scss">
  .o-katex-inline {
    position: relative;
    display: inline;
    white-space: unset;
    cursor: pointer;
  }

  .o-katex-inline .el-tooltip__trigger:hover,
  .o-katex-inline:hover {
    background: rgba(0,0,0,0.05);
  }

  .o-katex-editor {
    min-width: 600px;
    background: rgba(0,0,0,0.05);

    .o-toolbar {
      background: rgba(0,0,0,0.05);
    }
  }
  .codemirror .cm-editor {
    height: 100px;
  }
</style>
