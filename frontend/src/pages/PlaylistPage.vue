<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { playlistTracks } from '@/data/playlist'

const {
  playlist,
  currentTrack,
  currentIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  error,
  isLoading,
  frequencyData,
  hasRealAudio,
  setPlaylist,
  play,
  togglePlay,
  next,
  prev,
  seek,
  setVolume,
} = useAudioPlayer()

// Ensure playlist is set (idempotent if already set in App.vue)
onMounted(() => {
  if (playlist.value.length === 0) {
    setPlaylist(playlistTracks, 0)
  }
})

const progress = computed(() => {
  if (duration.value <= 0) return 0
  return (currentTime.value / duration.value) * 100
})

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* ── Progress drag ────────────── */

const isDragging = ref(false)
const progressBarRef = ref<HTMLElement | null>(null)

function getRatioFromEvent(e: MouseEvent | TouchEvent): number {
  const bar = progressBarRef.value
  if (!bar) return 0
  const rect = bar.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0]!.clientX : e.clientX
  const ratio = (clientX - rect.left) / rect.width
  return Math.max(0, Math.min(1, ratio))
}

function handleProgressClick(e: MouseEvent) {
  seek(getRatioFromEvent(e) * duration.value)
}

function onDragStart(e: MouseEvent) {
  isDragging.value = true
  seek(getRatioFromEvent(e) * duration.value)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  seek(getRatioFromEvent(e) * duration.value)
}

function onDragEnd() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

/* ── Real visualizer ──────────── */

const VISUALIZER_BARS = 32

const visualizerHeights = computed(() => {
  const bars: number[] = []

  if (hasRealAudio.value && isPlaying.value && frequencyData.value.length > 0) {
    const data = frequencyData.value
    const step = Math.max(1, Math.floor(data.length / VISUALIZER_BARS))
    for (let i = 0; i < VISUALIZER_BARS; i++) {
      const raw = data[i * step] || 0
      const normalized = raw / 255
      const shaped = Math.pow(normalized, 0.8)
      bars.push(Math.max(0.04, shaped * 0.95))
    }
    return bars
  }

  const seed = currentIndex.value * 7 + visCounter.value * 0.05
  for (let i = 0; i < VISUALIZER_BARS; i++) {
    const pseudo = Math.sin(i * 0.6 + seed * 0.3) * 0.5 + 0.5
    const rand = ((seed * (i + 1) * 137) % 100) / 100
    const val = isPlaying.value
      ? pseudo * 0.6 + rand * 0.4
      : 0.08 + rand * 0.04
    bars.push(Math.max(0.04, val))
  }
  return bars
})

/* ── Album art rotation ───────── */

const rotation = ref(0)
let rotRaf: number | null = null

function tickRotation() {
  if (isPlaying.value) {
    rotation.value += 0.15
  }
  rotRaf = requestAnimationFrame(tickRotation)
}

/* ── Visualizer counter (continuous for smooth animation) ── */

const visCounter = ref(0)
let visCounterRaf: number | null = null

function tickVisCounter() {
  if (isPlaying.value) {
    visCounter.value++
  }
  visCounterRaf = requestAnimationFrame(tickVisCounter)
}

onMounted(() => {
  rotRaf = requestAnimationFrame(tickRotation)
  visCounterRaf = requestAnimationFrame(tickVisCounter)
})

onUnmounted(() => {
  if (rotRaf) cancelAnimationFrame(rotRaf)
  if (visCounterRaf) cancelAnimationFrame(visCounterRaf)
})
</script>

<template>
  <section class="page">
    <!-- Player Panel -->
    <div class="player">
      <span class="player-label">✦ 正在聆听</span>

      <!-- Album Art -->
      <div class="artwork">
        <div class="artwork-disc" :style="{ transform: `rotate(${rotation}deg)` }">
          <div class="disc-groove" />
          <div class="disc-center">
            <span class="disc-icon">♪</span>
          </div>
        </div>
        <div class="artwork-glow" />
      </div>

      <!-- Visualizer -->
      <div class="visualizer">
        <span
          v-for="(h, i) in visualizerHeights"
          :key="i"
          class="vis-bar"
          :style="{ height: h * 100 + '%' }"
        />
      </div>

      <!-- Now Playing Info -->
      <div class="now-playing">
        <h2 class="track-title">{{ currentTrack?.title || '\u00A0' }}</h2>
        <p class="track-artist">{{ currentTrack?.artist || '\u00A0' }}</p>
      </div>

      <!-- Progress -->
      <div
        ref="progressBarRef"
        class="progress-area"
        @click="handleProgressClick"
        @mousedown="onDragStart"
      >
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }">
            <span class="progress-thumb" />
          </div>
        </div>
        <div class="progress-time">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button class="ctrl" @click="prev" aria-label="上一首">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>

        <button class="ctrl ctrl-main" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
          <svg v-if="!isPlaying" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
          <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="5" y="3" width="5" height="18" rx="1" />
            <rect x="14" y="3" width="5" height="18" rx="1" />
          </svg>
        </button>

        <button class="ctrl" @click="next" aria-label="下一首">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      <!-- Volume -->
      <div class="volume-area">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="volume-icon">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path v-if="volume > 0" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path v-if="volume > 0.5" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="volume"
          class="volume-slider"
          @input="(e) => setVolume(parseFloat((e.target as HTMLInputElement).value))"
        />
      </div>

      <!-- Status -->
      <div class="status-line">
        <Transition name="status-fade" mode="out-in">
          <span v-if="isLoading" key="loading" class="status-text">正在从深空接收信号...</span>
          <span v-else-if="error" key="error" class="status-text status-error">{{ error }}</span>
          <span v-else key="empty" class="status-text">&nbsp;</span>
        </Transition>
      </div>
    </div>

    <!-- Track List -->
    <div class="tracklist">
      <div class="tracklist-header">
        <span class="tracklist-label">曲目列表</span>
        <span class="tracklist-count">{{ playlist.length }} 首</span>
      </div>
      <button
        v-for="(track, index) in playlist"
        :key="track.id"
        class="track"
        :class="{ 'is-active': index === currentIndex }"
        :style="{ animationDelay: `${index * 60}ms` }"
        :aria-current="index === currentIndex ? 'true' : undefined"
        @click="play(index)"
      >
        <span class="track-num">
          <span v-if="index === currentIndex && isPlaying" class="track-bars">
            <span class="tb" /><span class="tb" /><span class="tb" />
          </span>
          <span v-else class="track-idx">{{ String(index + 1).padStart(2, '0') }}</span>
        </span>
        <span class="track-name">{{ track.title }}</span>
        <span class="track-len">{{ formatTime(track.duration || 0) }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
/* ════════════════════════════════════════
   MOBILE FIRST (<= 768px)
   保持原有单列垂直布局
   ════════════════════════════════════════ */

.page {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
}

.player {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: var(--space-2xl);
  margin-bottom: var(--space-xl);
  border-bottom: var(--border-subtle);
}

.player-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-xl);
}

/* ── Artwork ──────────────────── */

.artwork {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.artwork-disc {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    var(--color-deep-space) 0%,
    var(--color-space) 25%,
    var(--color-deep-space) 50%,
    var(--color-space) 75%,
    var(--color-deep-space) 100%
  );
  border: 1px solid rgba(123, 143, 199, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.disc-groove {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 1px solid rgba(123, 143, 199, 0.08);
}

.disc-center {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-void);
  border: 1px solid rgba(232, 213, 183, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.disc-icon {
  font-size: var(--text-sm);
  color: var(--color-starlight-dim);
}

.artwork-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(232, 213, 183, 0.06) 0%,
    transparent 70%
  );
  animation: glow-breathe 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glow-breathe {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 1; }
}

/* ── Visualizer ───────────────── */

.visualizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2.5px;
  height: 64px;
  width: 100%;
  max-width: 300px;
  margin-bottom: var(--space-xl);
}

.vis-bar {
  flex: 1;
  min-width: 2px;
  max-width: 7px;
  border-radius: 1px;
  background: linear-gradient(
    180deg,
    var(--color-starlight) 0%,
    rgba(123, 143, 199, 0.6) 60%,
    rgba(123, 143, 199, 0.2) 100%
  );
  transition: height 0.18s linear;
  opacity: 0.7;
}

.vis-bar:nth-child(4n + 1) {
  opacity: 0.45;
}

/* ── Now Playing ──────────────── */

.now-playing {
  text-align: center;
  margin-bottom: var(--space-xl);
  width: 100%;
}

.track-title {
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  font-family: var(--font-serif);
  font-weight: 400;
  margin-bottom: var(--space-xs);
  min-height: 1.3em;
  transition: color var(--duration-normal) var(--ease-out-quart);
}

.track-artist {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  min-height: 1.4em;
  transition: color var(--duration-normal) var(--ease-out-quart);
}

/* ── Progress ─────────────────── */

.progress-area {
  width: 100%;
  margin-bottom: var(--space-lg);
  cursor: pointer;
}

.progress-track {
  height: 3px;
  background: var(--color-nebula-weak);
  border-radius: 2px;
  position: relative;
  transition: height var(--duration-fast);
}

.progress-area:hover .progress-track {
  height: 5px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-nebula-dim), var(--color-starlight));
  border-radius: 2px;
  position: relative;
  transition: width 0.3s linear;
}

.progress-thumb {
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-starlight);
  box-shadow: 0 0 6px rgba(232, 213, 183, 0.3);
  opacity: 0;
  transition: opacity var(--duration-fast);
}

.progress-area:hover .progress-thumb {
  opacity: 1;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

/* ── Controls ─────────────────── */

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.ctrl {
  color: var(--color-text-secondary);
  padding: var(--space-sm);
  border-radius: 50%;
  transition:
    color var(--duration-fast),
    transform var(--duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ctrl:hover {
  color: var(--color-starlight);
  transform: scale(1.1);
}

.ctrl:active {
  transform: scale(0.95);
}

.ctrl-main {
  color: var(--color-starlight);
  background: rgba(232, 213, 183, 0.08);
  padding: 14px;
  border: 1px solid rgba(232, 213, 183, 0.1);
}

.ctrl-main:hover {
  background: rgba(232, 213, 183, 0.14);
  transform: scale(1.08);
}

/* ── Volume ───────────────────── */

.volume-area {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  color: var(--color-text-muted);
}

.volume-icon {
  flex-shrink: 0;
}

.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100px;
  height: 3px;
  border-radius: 2px;
  background: var(--color-nebula-weak);
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-starlight);
  cursor: pointer;
  transition: transform var(--duration-fast);
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-starlight);
  cursor: pointer;
  border: none;
  transition: transform var(--duration-fast);
}

.volume-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.volume-slider::-moz-range-track {
  height: 3px;
  border-radius: 2px;
  background: var(--color-nebula-weak);
}

/* ── Status ───────────────────── */

.status-line {
  text-align: center;
  min-height: 1.6em;
  line-height: 1.6em;
}

.status-text {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-serif);
}

.status-error {
  color: var(--color-starlight-dim);
}

.status-fade-enter-active,
.status-fade-leave-active {
  transition: opacity var(--duration-fast) var(--ease-out-quart);
}
.status-fade-enter-from,
.status-fade-leave-to {
  opacity: 0;
}

/* ── Tracklist ────────────────── */

.tracklist {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tracklist-header {
  display: none;
}

.track {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 10px var(--space-md);
  border-bottom: var(--border-subtle);
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
  color: inherit;
  animation: fade-in-up var(--duration-slow) var(--ease-out-expo) both;
  transition: background var(--duration-fast);
}

.track:hover {
  background: rgba(123, 143, 199, 0.04);
}

.track.is-active {
  background: rgba(232, 213, 183, 0.03);
}

.track.is-active .track-name {
  color: var(--color-starlight);
}

.track-num {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.track-idx {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.track-bars {
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 12px;
}

.tb {
  width: 2.5px;
  background: var(--color-starlight);
  border-radius: 1px;
  animation: tb-pulse 0.55s ease-in-out infinite;
}
.tb:nth-child(2) { animation-delay: 0.12s; }
.tb:nth-child(3) { animation-delay: 0.24s; }

@keyframes tb-pulse {
  0%, 100% { height: 3px; }
  50% { height: 12px; }
}

.track-name {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  transition: color var(--duration-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-len {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

/* ════════════════════════════════════════
   DESKTOP (> 768px)
   双栏布局：左侧 sticky 播放器，右侧曲目列表
   ════════════════════════════════════════ */

@media (min-width: 769px) {
  .page {
    max-width: var(--content-wide-max-width);
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: var(--space-2xl);
    align-items: start;
    padding: var(--space-3xl) var(--space-xl);
  }

  .player {
    position: sticky;
    top: calc(var(--header-height) + var(--space-xl));
    padding: var(--space-xl);
    background: rgba(10, 13, 23, 0.6);
    border: var(--border-subtle);
    border-radius: var(--radius-lg);
    margin-bottom: 0;
    border-bottom: var(--border-subtle);
    backdrop-filter: blur(8px);
  }

  .artwork {
    width: 160px;
    height: 160px;
    margin-bottom: var(--space-lg);
  }

  .artwork-disc {
    width: 140px;
    height: 140px;
  }

  .artwork-glow {
    width: 160px;
    height: 160px;
  }

  .visualizer {
    max-width: 280px;
    margin-bottom: var(--space-lg);
  }

  .now-playing {
    margin-bottom: var(--space-lg);
  }

  .tracklist {
    padding-top: var(--space-sm);
  }

  .tracklist-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) var(--space-md) var(--space-md);
    margin-bottom: var(--space-sm);
    border-bottom: var(--border-subtle);
  }

  .tracklist-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .tracklist-count {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
  }

  .track {
    padding: 12px var(--space-md);
    border-radius: var(--radius-sm);
    border-bottom: none;
    margin-bottom: 2px;
  }

  .track.is-active {
    background: rgba(232, 213, 183, 0.05);
    border: 1px solid rgba(232, 213, 183, 0.08);
  }
}

/* ════════════════════════════════════════
   TABLET (640px - 768px)
   微调，仍为单列但略宽
   ════════════════════════════════════════ */

@media (max-width: 768px) and (min-width: 641px) {
  .page {
    max-width: 560px;
  }
}

/* ════════════════════════════════════════
   SMALL MOBILE (<= 640px)
   ════════════════════════════════════════ */

@media (max-width: 640px) {
  .player {
    padding-bottom: var(--space-xl);
  }
  .controls {
    gap: var(--space-lg);
  }
  .ctrl {
    padding: var(--space-md);
  }
  .ctrl-main {
    padding: 16px;
  }
  .artwork {
    width: 120px;
    height: 120px;
  }
  .artwork-disc {
    width: 100px;
    height: 100px;
  }
  .track {
    padding: 14px var(--space-md);
  }
  .volume-area {
    margin-bottom: var(--space-lg);
  }
  .volume-slider {
    width: 120px;
  }
}
</style>
