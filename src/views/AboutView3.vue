<template>
  <div class="container">
    <div class="text-columns">
      <!-- 왼쪽 텍스트 영역 -->
      <div v-for="(row, index) in rows" :key="'left-' + index" class="text">{{ row.leftText }}</div>
    </div>

    <div class="svg-container" ref="svgContainer"></div>

    <div class="text-columns">
      <!-- 오른쪽 텍스트 영역 -->
      <div v-for="(row, index) in rows" :key="'right-' + index" class="text">
        {{ row.rightText }}
      </div>
    </div>
  </div>

  <div>
    <button @click="addRow">Add Row</button>
    <button @click="removeRow">Remove Row</button>
  </div>
</template>

<script setup>
import { SVG } from '@svgdotjs/svg.js'

const svgContainer = ref(null)
const rows = reactive([
  { leftText: 'Start 1', rightText: 'End 1' },
  { leftText: 'Start 2', rightText: 'End 2' }
])
let draw
let currentLine = null
let validEndPoints = []

onMounted(() => {
  drawSVG()
})

const makeRowPoint = (row, index) => {
  const y = index * 50 + 25

  const leftCircle = draw.circle(10).attr({ cx: 5, cy: y, fill: '#f06' })
  const rightCircle = draw.circle(10).attr({ cx: draw.node.scrollWidth - 5, cy: y, fill: '#0f9' })
  leftCircle.addClass('draggable').data('rowData', `left${index}`)
  rightCircle.data('rowData', `right${index}`)
  // Store rightCircle's center position for validation
  validEndPoints.push({ cx: rightCircle.cx(), cy: rightCircle.cy() })
}

function drawSVG() {
  if (draw) {
    draw.remove()
  }

  validEndPoints = [] // Reset valid endpoints

  draw = SVG()
    .addTo(svgContainer.value)
    .size('100%', `${rows.length * 50}px`)

  rows.forEach((row, index) => makeRowPoint(row, index))

  svgContainer.value.addEventListener('mousedown', startLine)
  svgContainer.value.addEventListener('mousemove', drawLine)
  svgContainer.value.addEventListener('mouseup', endLine)
}

function startLine(event) {
  if (!event.target.classList.contains('draggable')) return
  const { cx, cy } = event.target.instance.attr()
  currentLine = draw.line(cx, cy, cx, cy).stroke({ width: 2, color: '#000' })
}

function drawLine(event) {
  if (!currentLine) return
  const rect = svgContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  currentLine.plot(currentLine.attr('x1'), currentLine.attr('y1'), x, y)
}

function endLine(event) {
  if (!currentLine) return
  const rect = svgContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Check if the end point is near any valid right point
  const isEndPointValid = validEndPoints.some(
    (point) => Math.hypot(point.cx - x, point.cy - y) < 10 // Adjust tolerance as needed
  )

  if (!isEndPointValid) {
    currentLine.remove() // Remove the line if end point is not valid
  }
  currentLine = null
}

const addRow = async () => {
  const newRowId = rows.length + 1
  rows.push({ leftText: `Start ${newRowId}`, rightText: `End ${newRowId}` })
  await nextTick(drawSVG) // Re-draw SVG with the new row
}

const removeRow = async () => {
  rows.pop()
  await nextTick(drawSVG) // Re-draw SVG with the new row
}
</script>

<style>
.container {
  display: flex;
  align-items: start;
}

.text-columns {
  width: 100px; /* 텍스트 열 너비 설정 */
}

.text {
  height: 50px; /* 개별 텍스트 높이, SVG 행 높이와 일치 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-container {
  flex-grow: 1;
  border: 1px solid #ccc; /* 시각적으로 구분하기 위한 경계선 */
}
</style>
