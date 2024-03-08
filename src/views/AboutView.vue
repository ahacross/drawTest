<template>
  <div ref="drawing" id="drawing" />
</template>
<script setup>
import { SVG } from '@svgdotjs/svg.js'

const drawing = ref()

onMounted(() => {
  const draw = SVG().addTo(drawing.value).size('100vw', '100vh')

  var predefinedPoints = [
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 200, y: 300 }
  ]

  // 미리 정의된 점들을 드로잉 영역에 찍기
  predefinedPoints.forEach(function (point) {
    draw.circle(10).attr({ cx: point.x, cy: point.y, fill: '#0f9' })
  })

  // Snap 거리 임계값
  var snapThreshold = 50

  // 사용자가 드로잉 영역 클릭 시 실행될 이벤트 리스너
  draw.click(function (event) {
    var clickPoint = { x: event.offsetX, y: event.offsetY }
    var snapPoint = null

    // 클릭 위치와 가장 가까운 미리 정의된 점 찾기
    predefinedPoints.forEach(function (point) {
      var distance = Math.sqrt(
        Math.pow(point.x - clickPoint.x, 2) + Math.pow(point.y - clickPoint.y, 2)
      )
      if (distance < snapThreshold) {
        snapPoint = point
      }
    })

    // Snap 포인트가 있으면 그 포인트에, 없으면 클릭 위치에 점 찍기
    var finalPoint = snapPoint ? snapPoint : clickPoint
    draw.circle(10).attr({ cx: finalPoint.x, cy: finalPoint.y, fill: '#f06' })
  })
})
</script>
