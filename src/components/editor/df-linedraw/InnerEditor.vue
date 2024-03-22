<template>
  <div ref="refEditor" style="width: 100%" />
</template>

<script setup>
import { Editor, Extension } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useDebounceFn } from '@vueuse/core'
import { useEditorComps } from '@/composables/editor'

const emits = defineEmits(['updateContent'])
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const refEditor = ref(null)

// 에디터 인스턴스를 저장할 변수
const editor = ref(null)
const { setTempEditor } = useEditorComps()

const enterIgnore = Extension.create({
  name: 'enterIgnore',

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        return true
      }
    }
  }
})

onMounted(async () => {
  editor.value = new Editor({
    element: refEditor.value,
    extensions: [
      StarterKit,
      Mathematics.configure({
        katexOptions: {
          displayMode: true //TODO 적용안됨. extension 문제로 추정됨. 추후 확인할 것
        }
      }),
      enterIgnore
    ],
    content: `<p>${props.content}</p>`,
    onFocus({ editor }) {
      setTempEditor(editor)
    },
    onBlur() {
      setTempEditor(null)
    },
    onUpdate: useDebounceFn(({ editor }) => {
      const html = editor.getHTML()
      emits('updateContent', html.replace('<p>', '').replace('</p>', ''))
      console.log(html.replace('<p>', '').replace('</p>', ''))
    }, 300)
  })
})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>
