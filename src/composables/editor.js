import { useEditorStore } from '@/stores/editor'

export const useEditorComps = () => {
  const r = {} // return object
  const store = useEditorStore()
  const { editor } = storeToRefs(store)

  r.getEditor = () => editor
  r.setEditor = (newEditor) => store.setEditor(newEditor)
  r.setTempEditor = (tempEditor) => store.setTempEditor(tempEditor)

  r.runAction = (action, param) => {
    editor.value.chain().focus()[action](param).run()
  }

  r.selectedNode = computed(() => {
    if (editor.value) {
      const { state, view } = editor.value

      if (state?.dragState$?.isDragging) {
        return false
      } else {
        return {
          name: state?.selection?.node?.type?.name || '',
          dom: view?.nodeDOM(state.selection.from)
        }
      }
    } else {
      return false
    }
  })

  r.setContent = (content) => {
    editor.value.chain().focus().setContent(content).setTextSelection(1).run()
  }

  r.deleteNode = (nodeType) => {
    const { tr } = editor.state
    let hasDeletion = false

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === nodeType) {
        tr.delete(pos, pos + node.nodeSize)
        hasDeletion = true
      }
    })

    if (hasDeletion) {
      editor.view.dispatch(tr)
    }
  }

  return r
}
