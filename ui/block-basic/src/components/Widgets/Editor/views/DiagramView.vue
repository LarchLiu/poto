<script>
// Code Mirror
import { Codemirror } from 'vue-codemirror'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
// import 'codemirror/addon/edit/continuelist'
// import 'codemirror/addon/selection/active-line'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/neat.css'
// import 'codemirror/mode/markdown/markdown'

import mermaid from 'mermaid'

import { MermaidTemplates } from '~/constants'

export default {
  name: 'Diagram',
  components: {
    Codemirror,
    NodeViewWrapper,
  },
  props: nodeViewProps,
  data() {
    return {
      fullScreen: false,
      mode: 'preview',
      provider: 'mermaid',
      template: 'flow',
      example: '',
      svg: '',
      error: false,
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
    height: {
      get() {
        return this.node.attrs.height || 400
      },
      set(height) {
        this.updateAttributes({
          height,
        })
      },
    },
    toggleLabel() {
      return this.mode === 'edit' ? this.$o.lang.label.preview : this.$o.lang.label.edit
    },
    contentClass() {
      return this.fullScreen ? 'full-screen' : ''
    },
    mermaidDiagrams() {
      return [
        { label: '流程图 (Flow)', value: 'flow' },
        { label: '时序图 (Sequence)', value: 'sequence' },
        { label: '类图 (Class)', value: 'class' },
        { label: '状态图 (State)', value: 'state' },
        { label: '甘特图 (Gantt)', value: 'gantt' },
      ]
    },
  },
  watch: {
    template(val) {
      this.onSelectTemplate(val)
    },
  },
  mounted() {
    this.initDiagram()
  },
  methods: {
    initDiagram() {
      if (this.provider === 'mermaid') {
        if (!this.src) {
          this.src = MermaidTemplates[this.template]
          setTimeout(() => {
            this.renderMermaid()
          }, 100)
        }
        else {
          this.renderMermaid()
        }
      }
    },
    renderMermaid() {
      try {
        mermaid.mermaidAPI.initialize({
          securityLevel: 'loose',
          sequence: { showSequenceNumbers: true },
        })

        // check code
        mermaid.parse(this.src)
        this.error = false

        // svgId
        const svgId = `svg-${this.getUuid().substr(0, 6)}`

        // Render
        mermaid.mermaidAPI.render(svgId, this.src, (svgGraph) => {
          // console.log('svgGraph', svgGraph)
          this.svg = svgGraph
        })
      }
      catch (e) {
        this.error = true
      }
    },
    onToggleFullScreen(value) {
      this.fullScreen = value
    },
    toggleMode() {
      try {
        this.error = false
        // check source
        if (this.mode === 'edit')
          mermaid.parse(this.src)

        // toggle mode
        this.mode = (this.mode === 'edit') ? 'preview' : 'edit'

        // reset
        if (this.mode === 'preview') {
          this.renderMermaid()
        }
        else {
          setTimeout(() => {
            this.$refs.codemirror.codemirror.focus()
          }, 100)
        }
      }
      catch (e) {
        console.error(e)
        this.error = true
      }
    },
    onEditorChanged() {
      if (this.timeout)
        clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.renderMermaid()
      }, 300)
    },
    onSelectTemplate(item) {
      // console.log('template', item, MermaidTemplates[item.value])
      if (this.provider === 'mermaid') {
        this.src = MermaidTemplates[item]
        this.timeout = setTimeout(() => {
          this.renderMermaid()
        }, 300)
      }
    },
    onDelete() {
      this.deleteNode()
    },
    onHelp() {
      const url = 'https://mermaid-js.github.io/mermaid/#/examples'

      window.open(url, '_blank')
    },
    getUuid() {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++)
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)

      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '' // -

      return s.join('').substr(0, 6)
    },
  },
}
</script>

<template>
  <NodeViewWrapper class="o-diagram">
    <el-popover
      :width="600"
      :offset="20"
      trigger="click"
      :show-arrow="false"
      transition="none"
    >
      <div class="col source">
        <Codemirror
          id="codemirror"
          ref="codemirror"
          v-model="src"
          class="diagram-editor codemirror"
          :options="editorOption"
          :hint="true"
          @change="onEditorChanged"
        />

        <div class="flex justify-between items-center mt-1 bg-gray-50">
          <div class="flex items-center">
            <div class="i-carbon-ibm-cloud-pak-manta-automated-data-lineage mr-2" /> Diagram
          </div>
          <div flex>
            <select
              v-model="template"
              mr-2
            >
              <option
                v-for="option in mermaidDiagrams"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="i-carbon-trash-can cursor-pointer text-red" @click="onDelete" />
          </div>
        </div>
      </div>
      <template #reference>
        <div class="flex justify-center">
          <div v-html="svg" />
        </div>
      </template>
    </el-popover>
  </NodeViewWrapper>
</template>

<style lang="scss">
  .o-diagram {
    position: relative;
    cursor: pointer;

    .diagram {
      width: 100%;

      .source {
        position: relative;
        min-height: 200px;
        border: solid 1px rgba(0,0,0,0.05);

        .diagram-editor {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;

          .CodeMirror {
            width: 100%;
            height: 100%;

            pre {
              background: unset;
              color: unset;
              padding: unset;
              border-radius: unset;
              font-size: 1rem;
              font-family: "Source Code Pro", 'Ubuntu Mono', Consolas, monospace !important;
            }

            pre.CodeMirror-line {
              padding: 0 4px;
            }
          }
        }

        .error {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 10;
        }
      }

      .preview {
        text-align: center;
      }
    }

    &.selected .o-card-content {
      outline-style: dashed;
      outline-width: 1px;
      -moz-outline-radius: 4px;
      outline-color: rgba(0, 0, 0, 0.1);
    }
  }

  .codemirror .cm-editor {
    height: 200px;
  }
</style>
