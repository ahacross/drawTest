<template>
  <div ref="drawing" class="svg-container" @click="editText($event)" />
  <input
    v-if="editing"
    ref="textInput"
    class="text-input"
    v-model="inputValue"
    @blur="finishEdit"
    @keyup.enter="finishEdit"
  />
</template>

<script setup>
import { SVG } from '@svgdotjs/svg.js'

const drawing = ref(null)
const textInput = ref(null)
const editing = ref(false)
const inputPosition = reactive({ x: 0, y: 0 })
const inputValue = ref('')
let currentTextElement = null

onMounted(() => {
  const draw = SVG().addTo(drawing.value).size(800, 500)
  const textElements = []

  for (let i = 0; i < 5; i++) {
    const textA = draw
      .text('Text A')
      .move(20, 20 + i * 100)
      .addClass('editable-text')
      .data('index', i)
    textElements.push(textA)

    draw
      .circle(10)
      .attr({ cx: 120, cy: 30 + i * 100, fill: '#f06', class: 'start-point', 'data-index': i })
    draw
      .circle(10)
      .attr({ cx: 680, cy: 30 + i * 100, fill: '#0f9', class: 'end-point', 'data-index': i })

    const textB = draw
      .text('Text B')
      .move(720, 20 + i * 100)
      .addClass('editable-text')
      .data('index', i + 5)
    textElements.push(textB)
  }

  // for (let i = 0; i < 5; i++) {
  //   const textA = draw
  //     .text('Text A')
  //     .move(20, 20 + i * 100)
  //     .addClass('editable-text')
  //     .data('index', i)
  //   textElements.push(textA)
  //
  //   draw
  //     .circle(10)
  //     .attr({ cx: 120, cy: 30 + i * 100, fill: '#f06', class: 'start-point', 'data-index': i })
  //   draw
  //     .circle(10)
  //     .attr({ cx: 680, cy: 30 + i * 100, fill: '#0f9', class: 'end-point', 'data-index': i })
  //
  //   const textB = draw
  //     .text('Text B')
  //     .move(720, 20 + i * 100)
  //     .addClass('editable-text')
  //     .data('index', i + 5)
  //   textElements.push(textB)
  //   // 왼쪽 포인트
  //
  //   const startCircle = draw
  //     .circle(10)
  //     .attr({ cx: 120, cy: 30 + i * 100, fill: '#f06', class: 'start-point', 'data-index': i })
  //   // 오른쪽 포인트
  //   const endCircle = draw
  //     .circle(10)
  //     .attr({ cx: 680, cy: 30 + i * 100, fill: '#0f9', class: 'end-point', 'data-index': i })
  //   // 오른쪽 텍스트
  //   draw
  //     .text('Text B')
  //     .addClass('editable-text')
  //     .move(720, 20 + i * 100)
  //
  //   let lineBeingDrawn = null
  //   startCircle.on('mousedown', (event) => {
  //     const startX = event.target.cx.baseVal.value
  //     const startY = event.target.cy.baseVal.value
  //     // 임시 선 시작
  //     lineBeingDrawn = draw.line(startX, startY, startX, startY).stroke({ width: 2, color: '#000' })
  //     drawing.value.addEventListener('mousemove', onMouseMove)
  //     drawing.value.addEventListener('mouseup', onMouseUp)
  //   })
  //
  //   const onMouseMove = (event) => {
  //     if (!lineBeingDrawn) return
  //     const rect = drawing.value.getBoundingClientRect()
  //     const x = event.clientX - rect.left
  //     const y = event.clientY - rect.top
  //     lineBeingDrawn.plot(lineBeingDrawn.attr('x1'), lineBeingDrawn.attr('y1'), x, y)
  //   }
  //
  //   const onMouseUp = (event) => {
  //     if (!lineBeingDrawn) return
  //     drawing.value.removeEventListener('mousemove', onMouseMove)
  //     drawing.value.removeEventListener('mouseup', onMouseUp)
  //
  //     const rect = drawing.value.getBoundingClientRect()
  //     const x = event.clientX - rect.left
  //     const y = event.clientY - rect.top
  //     // 마우스 업 이벤트가 오른쪽 포인트 내부에서 발생하는지 확인
  //     if (Math.hypot(x - endCircle.cx(), y - endCircle.cy()) <= endCircle.attr('r')) {
  //       lineBeingDrawn.plot(
  //         lineBeingDrawn.attr('x1'),
  //         lineBeingDrawn.attr('y1'),
  //         endCircle.cx(),
  //         endCircle.cy()
  //       )
  //     } else {
  //       // 마우스 업 이벤트가 오른쪽 포인트 밖에서 발생하면 선 제거
  //       lineBeingDrawn.remove()
  //     }
  //     lineBeingDrawn = null
  //   }
  // }

  // 기본 드래그 동작 방지
  // drawing.value.addEventListener('dragstart', (event) => event.preventDefault())
})
const editText = (event) => {
  const target = event.target.parentElement.instance
  console.log(event)
  if (target && target.hasClass('editable-text')) {
    editing.value = true
    inputValue.value = target.text()
    currentTextElement = target
    inputPosition.x = event.clientX
    inputPosition.y = event.clientY
    // Ensure the input field is displayed and focused
    nextTick(() => {
      textInput.value.style.top = `${inputPosition.y}px`
      textInput.value.style.left = `${inputPosition.x}px`
      textInput.value.focus()
    })
  }
}

const finishEdit = () => {
  if (currentTextElement && inputValue.value.trim() !== '') {
    currentTextElement.text(inputValue.value)
  }
  editing.value = false
}
</script>

<style scoped>
.svg-container {
  width: 800px;
  height: 500px;
  border: 1px solid #ccc;
}

.svg-container .editable-text {
  width: 200px;
}
</style>
