import { Node } from '@tiptap/core'
import { mergeAttributes, VueNodeViewRenderer } from '@tiptap/vue-3'
import DfLinedrawNodeView from '@/components/editor/df-linedraw/DfLinedrawNodeView.vue'

export const DfLinedraw = Node.create({
  name: 'dfLinedraw',
  group: 'block',
  content: 'block*',

  addAttributes() {
    return {
      rows: {
        default: ''
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div'
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {}), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(DfLinedrawNodeView)
  }
})
