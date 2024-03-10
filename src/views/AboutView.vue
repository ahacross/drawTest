<template>
  <div ref="drawing" id="drawing" />
</template>
<script setup>
import { SVG } from '@svgdotjs/svg.js'

const drawing = ref()

let isDragging = false
let dragStartPoint = null
let selectedPoints = []

const points = []

onMounted(() => {
  const draw = SVG().addTo(drawing.value).size('100vw', '100vh')

  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 800)
    const y = Math.floor(Math.random() * 600)
    points.push({
      element: draw
        .circle(10)
        .move(x - 5, y - 5)
        .fill('#f056'),
      x,
      y
    })
  }

  draw.node.addEventListener('mousedown', (e) => {
    isDragging = true
    selectedPoints = []
    dragStartPoint = { x: e.offsetX, y: e.offsetY }
  })

  draw.node.addEventListener('mousemove', (e) => {
    if (isDragging && dragStartPoint) {
      const currentPoint = { x: e.offsetX, y: e.offsetY }
      console.log(currentPoint)

      points.forEach((point) => {
        if (
          point.x >= Math.min(dragStartPoint.x, currentPoint.x) &&
          point.x <= Math.max(dragStartPoint.x, currentPoint.x) &&
          point.y >= Math.min(dragStartPoint.y, currentPoint.y) &&
          point.y <= Math.max(dragStartPoint.y, currentPoint.y)
        ) {
          if (!selectedPoints.includes(point)) {
            selectedPoints.push(point)
            point.element.fill('#00f')
          }
        }
      })
    }
  })

  draw.node.addEventListener('mouseup', () => {
    if (selectedPoints.length > 1) {
      for (let i = 0; i < selectedPoints.length - 1; i++) {
        draw
          .line(dragStartPoint.x, dragStartPoint.y, selectedPoints[i].x, selectedPoints[i].y)
          .stroke({ width: 2, color: '#000' })
      }
    }
    isDragging = false
    dragStartPoint = null
  })
})
</script>
