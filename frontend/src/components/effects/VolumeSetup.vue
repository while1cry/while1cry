<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

const emit = defineEmits<{
  done: []
}>()

const player = useAudioPlayer()
const sliderValue = ref(player.volume.value)
const isVisible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})

function onInput(e: Event) {
  const v = parseFloat((e.target as HTMLInputElement).value)
  sliderValue.value = v
  player.setVolume(v)
}

function confirm() {
  isVisible.value = false
  setTimeout(() => {
    emit('done')
  }, 600)
}
</script>

<template>
  <Transition name="volume">
    <div
      v-show="isVisible"
      class="volume-overlay"
    >
      <div class="volume-panel">
        <span class="volume-star">✦</span>
        <h2 class="volume-title">校准深空频率</h2>
        <p class="volume-desc">
          调整你的舱内音量，以最佳状态接收信号。
        </p>

        <div class="volume-control">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="sliderValue"
            class="volume-slider"
            @input="onInput"
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>

        <div class="volume-value">{{ Math.round(sliderValue * 100) }}%</div>

        <button class="volume-enter" @click="confirm">
          进入深空
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.volume-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 6, 14, 0.85);
  backdrop-filter: blur(20px);
}

.volume-panel {
  width: 100%;
  max-width: 360px;
  margin: var(--space-lg);
  padding: var(--space-2xl) var(--space-xl);
  background: var(--color-deep-space);
  border: 1px solid rgba(123, 143, 199, 0.12);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4);
}

.volume-star {
  font-size: 2rem;
  color: var(--color-starlight);
  animation: star-pulse 3s ease-in-out infinite;
}

@keyframes star-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.volume-title {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  font-family: var(--font-serif);
  font-weight: 400;
}

.volume-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-family: var(--font-serif);
  line-height: var(--leading-relaxed);
}

/* ── Slider ───────────────────── */

.volume-control {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  padding: 0 var(--space-sm);
}

.volume-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--color-nebula-weak);
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-starlight);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(232, 213, 183, 0.3);
  transition: transform var(--duration-fast), box-shadow var(--duration-fast);
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 14px rgba(232, 213, 183, 0.5);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-starlight);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 8px rgba(232, 213, 183, 0.3);
  transition: transform var(--duration-fast), box-shadow var(--duration-fast);
}

.volume-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 14px rgba(232, 213, 183, 0.5);
}

.volume-slider::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: var(--color-nebula-weak);
}

.volume-value {
  font-size: var(--text-2xl);
  color: var(--color-starlight);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  min-height: 1.4em;
}

/* ── Enter Button ─────────────── */

.volume-enter {
  padding: var(--space-sm) var(--space-2xl);
  border: var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--ease-out-quart),
    border-color var(--duration-fast) var(--ease-out-quart),
    background var(--duration-fast) var(--ease-out-quart),
    transform var(--duration-fast) var(--ease-out-quart);
}

.volume-enter:hover {
  color: var(--color-starlight);
  border-color: var(--color-starlight-dim);
  background: rgba(232, 213, 183, 0.05);
  transform: translateY(-1px);
}

/* ── Transition ───────────────── */

.volume-enter-active,
.volume-leave-active {
  transition: opacity 0.6s var(--ease-out-expo);
}

.volume-enter-from,
.volume-leave-to {
  opacity: 0;
}

.volume-enter-active .volume-panel {
  animation: panel-rise 0.6s var(--ease-out-expo) both;
}

.volume-leave-active .volume-panel {
  animation: panel-rise 0.4s var(--ease-out-expo) reverse both;
}

@keyframes panel-rise {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
