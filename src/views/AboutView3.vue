<template>
  <div class="container">
    <div class="text-columns">
      <!-- Left text area -->
      <div v-for="(row, index) in rows" :key="'left-' + index" class="text">{{ row.leftText }}</div>
    </div>

    <div class="svg-container" ref="svgContainer"></div>

    <div class="text-columns">
      <!-- Right text area -->
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
import { ref, reactive, onMounted, nextTick } from 'vue'

const svgContainer = ref(null)
const rows = reactive([
  { leftText: 'Start 1', rightText: 'End 1' },
  { leftText: 'Start 2', rightText: 'End 2' }
])
let draw
let validPoints = []

onMounted(() => {
  drawSVG()
})

function drawSVG() {
  draw?.remove()
  draw = SVG()
    .addTo(svgContainer.value)
    .size('100%', `${rows.length * 50}px`)

  validPoints = []

  rows.forEach((_, index) => {
    const y = index * 50 + 25
    validPoints.push({ x: 5, y, side: 'left', index, used: false })
    validPoints.push({ x: draw.node.scrollWidth - 5, y, side: 'right', index, used: false })

    draw
      .circle(10)
      .fill('#f06')
      .move(5 - 5, y - 5)
    draw
      .circle(10)
      .fill('#0f9')
      .move(draw.node.scrollWidth - 5 - 5, y - 5)
  })

  svgContainer.value.onmousedown = (event) => handleMouseDown(event)
}

function handleMouseDown(event) {
  const { offsetX, offsetY } = event

  const startPoint = validPoints.find(
    (p) => p.side === 'left' && !p.used && Math.hypot(p.x - offsetX, p.y - offsetY) < 10
  )
  if (!startPoint) return

  let line = draw
    .line(startPoint.x, startPoint.y, startPoint.x, startPoint.y)
    .stroke({ width: 2, color: '#000' })
  let isDrawing = true

  function handleMouseMove(event) {
    if (!isDrawing) return

    const { offsetX: moveX, offsetY: moveY } = event
    const closestEndPoint = validPoints.find(
      (p) => p.side === 'right' && !p.used && Math.hypot(p.x - moveX, p.y - moveY) < 15
    )

    if (closestEndPoint) {
      line.plot(startPoint.x, startPoint.y, closestEndPoint.x, closestEndPoint.y)
    } else {
      line.plot(startPoint.x, startPoint.y, moveX, moveY)
    }
  }

  function handleMouseUp(event) {
    if (!isDrawing) return

    const { offsetX: endX, offsetY: endY } = event
    const endPoint = validPoints.find(
      (p) => p.side === 'right' && !p.used && Math.hypot(p.x - endX, p.y - endY) < 15
    )

    if (endPoint) {
      line.plot(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
      startPoint.used = true
      endPoint.used = true
    } else {
      line.remove()
    }

    isDrawing = false
    svgContainer.value.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  svgContainer.value.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const addRow = () => {
  rows.push({ leftText: `Start ${rows.length + 1}`, rightText: `End ${rows.length + 1}` })
  nextTick(drawSVG)
}

const removeRow = () => {
  rows.pop()
  nextTick(drawSVG)
}
</script>

<style>
.container {
  display: flex;
  align-items: start;
}

.text-columns {
  width: 100px; /* Set the width of the text columns */
}

.text {
  height: 50px; /* Individual text height, matching SVG row height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-container {
  flex-grow: 1;
  border: 1px solid #ccc; /* Visual boundary */
  margin-left: 20px;
  margin-right: 20px;
}
</style>
