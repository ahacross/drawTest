<template>
  <node-view-wrapper>
    안녕
    <!--			<div>-->
    <!--				<button @click="addRow">add</button>-->
    <!--				<button @click="removeRow">remove</button>-->
    <!--			</div>-->
    <!--			<div class="linedraw">-->
    <!--				<div class="text-columns">-->
    <!--					&lt;!&ndash; 왼쪽 텍스트 영역 &ndash;&gt;-->
    <!--					<div-->
    <!--						v-for="(row, index) in rowData"-->
    <!--						:key="`left-${index}`"-->
    <!--						class="text"-->
    <!--					>-->
    <!--						<InnerEditor-->
    <!--							:content="row.left"-->
    <!--							@updateContent="text => updateText(text, row, 'left')"-->
    <!--						/>-->
    <!--					</div>-->
    <!--				</div>-->

    <!--				<SvgDraw ref="refSvgDraw" :rows="rowData" />-->

    <!--				<div class="text-columns">-->
    <!--					&lt;!&ndash; 오른쪽 텍스트 영역 &ndash;&gt;-->
    <!--					<div-->
    <!--						v-for="(row, index) in rowData"-->
    <!--						:key="`right-${index}`"-->
    <!--						class="text"-->
    <!--					>-->
    <!--						<InnerEditor-->
    <!--							:content="row.right"-->
    <!--							@updateContent="text => updateText(text, row, 'right')"-->
    <!--						/>-->
    <!--					</div>-->
    <!--				</div>-->
    <!--			</div>-->
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  ...nodeViewProps,
  rows: {
    type: String,
    default: ''
  }
})
const refSvgDraw = ref()
const rowData = reactive([])

onMounted(() => {
  console.log('rows', props.rows)
  rowData.push(...JSON.parse(props.rows || '[]'))
})

const updateText = (text, row, type) => {
  row[type] = text
}

watch(rowData, () => {
  console.log(JSON.stringify(rowData))
  props.updateAttributes({
    rows: JSON.stringify(rowData)
  })
})

const addRow = () => {
  rowData.push({
    left: `kakao`,
    right: `naver`
  })
  nextTick(refSvgDraw.value.drawSVG)
}

const removeRow = () => {
  rowData.pop()
  nextTick(refSvgDraw.value.drawSVG)
}
</script>

<style scoped lang="scss">
.linedraw {
  display: flex;
  align-items: flex-start;
}

.text-columns {
  width: 30%; /* Set the width of the text columns */
}

.text {
  height: 50px; /* Individual text height, matching SVG row height */
  display: flex;
  align-items: center;
  justify-content: center;
  & p {
    width: 100%;
  }
}

.svg-container {
  flex-grow: 1;
  margin: 0;
}
</style>
