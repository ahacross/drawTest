<template>
  <div class="svg-container" ref="refSvgContainer" />
</template>

<script setup>
import { SVG } from '@svgdotjs/svg.js'

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  }
})
const refSvgContainer = ref(null)
let draw
let validPoints = []

onMounted(drawSVG)

function drawSVG() {
  draw?.remove()
  draw = SVG()
    .addTo(refSvgContainer.value)
    .size('100%', `${props.rows.length * 50}px`)

  validPoints = []

  props.rows.forEach((_, index) => {
    const y = index * 50 + 25
    validPoints.push({ x: 5, y, side: 'left', index, used: false })
    validPoints.push({
      x: draw.node.scrollWidth - 5,
      y,
      side: 'right',
      index,
      used: false
    })

    draw
      .circle(10)
      .fill('#000000')
      .move(0, y - 5)
    draw
      .circle(10)
      .fill('#000000')
      .move(draw.node.scrollWidth - 11, y - 5)
  })

  refSvgContainer.value.onmousedown = (event) => handleMouseDown(event)
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
    refSvgContainer.value.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  refSvgContainer.value.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

defineExpose({ drawSVG })
</script>
