<template>
  <div class="container">
    <EditorContent :editor="editor" />
    <EditorContent :editor="editor2" />
  </div>
</template>

<script setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { DfLinedraw } from '@/components/editor/df-linedraw/df-linedraw'
import { DfLinedraw2 } from '@/components/editor/df-linedraw/df-linedraw2'

const editor = useEditor({
  extensions: [Document, Paragraph, Text, DfLinedraw],
  onCreate: (props) => {
    console.log(props)
  }
})

const editor2 = useEditor({
  extensions: [Document, Paragraph, Text, DfLinedraw2],
  onCreate: (props) => {
    console.log(props)
  }
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  await delay(2000)
  editor.value
    .chain()
    .focus()
    .insertContent({
      type: 'dfLinedraw'
    })
    .run()

  editor2.value
    .chain()
    .focus()
    .insertContent({
      type: 'dfLinedraw2'
    })
    .run()
})
</script>
<style>
.tiptap {
  width: 500px;
  height: 500px;
  border: 1px solid;
}
</style>
