<template>
  <!--  <div ref="drawDiv" class="drawArea">-->
  <!--    <div>-->
  <!--      <div>-->
  <!--        <span>야호</span>-->
  <!--        <span class="point" />-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <span class="point" />-->
  <!--        <span>야호</span>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div>-->
  <!--      <div>-->
  <!--        <span>야호</span>-->
  <!--        <span class="point" />-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <span class="point" />-->
  <!--        <span>야호2</span>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <router-view />
</template>

<script setup>
const drawDiv = ref()

const addX = 40
let startX, startY, endX, endY, line

const createLine = () => {
  const line = document.createElement('div')
  line.className = 'drawLine'
  line.style.width = '0px'
  line.style.height = '3px'
  line.style.backgroundColor = '#333'
  drawDiv.value.appendChild(line)

  line.addEventListener('click', (e) => {
    e.target.remove()
  })
  return line
}

const moveHandler = (e) => {
  endX = e.offsetX + addX
  endY = e.offsetY
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
  const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI

  console.log(startX, startY, endX, endY, length, angle)
  if (endY > 5) {
    const lineStyle = line.style
    lineStyle.position = 'absolute'
    lineStyle.width = `${length}px`
    lineStyle.left = `${startX}px`
    lineStyle.top = `${startY}px`
    lineStyle.transform = `rotate(${angle}deg)`
    lineStyle.transformOrigin = 'top left'
  }
}

const upHandler = () => {
  console.log(startX, startY, endX, endY)
  drawDiv.value.removeEventListener('mousemove', moveHandler)
  drawDiv.value.removeEventListener('mouseup', upHandler)
}

onMounted(() => {
  // drawDiv.value.addEventListener('mousedown', (e) => {
  //   startX = e.offsetX + addX
  //   startY = e.offsetY
  //   line = createLine()
  //   drawDiv.value.addEventListener('mousemove', moveHandler)
  //   drawDiv.value.addEventListener('mouseup', upHandler)
  // })
})
</script>

<style>
.drawArea {
  width: 100vw;
  height: 100vh;
}
</style>
