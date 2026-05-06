<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStarfield } from '@/composables/useStarfield'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { initCanvas } = useStarfield(canvasRef)

onMounted(() => {
  initCanvas()
})
</script>

<template>
  <canvas ref="canvasRef" class="starfield" />
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
