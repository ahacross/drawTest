export const useEditorStore = defineStore('editor', () => {
  const r = {}

  const stateEditor = ref(null)
  r.editor = computed(() => stateTempEditor.value || stateEditor.value)
  r.setEditor = (editor) => {
    stateEditor.value = editor
  }

  const stateTempEditor = ref(null)
  r.tempEditor = computed(() => stateTempEditor.value)
  r.setTempEditor = (editor) => {
    stateTempEditor.value = editor
  }

  return { ...r }
})
