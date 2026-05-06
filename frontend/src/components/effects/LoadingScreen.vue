<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  loaded: []
}>()

const isVisible = ref(true)
const isFading = ref(false)
const textIndex = ref(0)
const texts = [
  '正在穿越深空...',
  '正在校准星图...',
  '正在接收信号...',
  '正在连接孤岛...',
]
let textTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  textTimer = setInterval(() => {
    textIndex.value = (textIndex.value + 1) % texts.length
  }, 1600)

  const minDuration = 1200
  const startTime = performance.now()

  function finish() {
    const elapsed = performance.now() - startTime
    const remaining = Math.max(0, minDuration - elapsed)

    setTimeout(() => {
      if (textTimer) clearInterval(textTimer)
      isFading.value = true
      setTimeout(() => {
        isVisible.value = false
        emit('loaded')
      }, 1000)
    }, remaining)
  }

  if (document.readyState === 'complete') {
    finish()
  } else {
    window.addEventListener('load', finish, { once: true })
  }
})
</script>

<template>
  <Transition name="loading">
    <div v-if="isVisible" class="loading-screen" :class="{ 'is-fading': isFading }">
      <div class="loading-center">
        <span class="loading-star">✦</span>
        <p class="loading-text">{{ texts[textIndex] }}</p>
      </div>
    </div>
  </Transition>
</template>

<style>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-void);
  transition: opacity 1s var(--ease-out-expo);
}

.loading-screen.is-fading {
  opacity: 0;
  pointer-events: none;
}

.loading-center {
  text-align: center;
}

.loading-star {
  display: block;
  font-size: 3rem;
  color: var(--color-starlight);
  margin-bottom: var(--space-lg);
  animation: loading-pulse 2s var(--ease-in-out-quint) infinite;
}

.loading-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-family: var(--font-serif);
  min-height: 1.5em;
  letter-spacing: 0.05em;
}

@keyframes loading-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

.loading-enter-active {
  transition: none;
}
.loading-leave-active {
  transition: opacity 0.6s var(--ease-out-expo);
}
.loading-leave-to {
  opacity: 0;
}
</style>
