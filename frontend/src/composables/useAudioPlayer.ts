import { ref, shallowRef, computed, watch, triggerRef } from 'vue'

export interface Track {
  id: string
  title: string
  artist: string
  src?: string
  cover?: string
  duration?: number
}

/* ========================================
   Global Singleton Audio Player State
   ======================================== */

const audioRef = ref<HTMLAudioElement | null>(null)
const audioCtx = ref<AudioContext | null>(null)
const analyserNode = ref<AnalyserNode | null>(null)
const frequencyData = shallowRef(new Uint8Array(0) as Uint8Array<ArrayBuffer>)

const playlist = ref<Track[]>([])
const currentIndex = ref(-1)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.15)
const error = ref('')
const isLoading = ref(false)
const currentTrack = ref<Track | null>(null)

const hasRealAudio = computed(() => !!currentTrack.value?.src)

/* ── Restore volume from localStorage ── */
try {
  const saved = localStorage.getItem('player-volume')
  if (saved !== null) {
    const v = parseFloat(saved)
    if (!isNaN(v) && v >= 0 && v <= 1) volume.value = v
  }
} catch {
  /* ignore localStorage errors */
}

/* ── Persist volume ── */
watch(volume, (v) => {
  try {
    localStorage.setItem('player-volume', String(v))
  } catch {
    /* ignore */
  }
})

/* ── Simulated playback timer ── */
let simTimer: ReturnType<typeof setInterval> | null = null
let pumpRafId: number | null = null

function startSimulation() {
  stopSimulation()
  simTimer = setInterval(() => {
    if (duration.value <= 0) return
    currentTime.value += 1
    if (currentTime.value >= duration.value) {
      currentTime.value = 0
      next()
    }
  }, 1000)
}

function stopSimulation() {
  if (simTimer) {
    clearInterval(simTimer)
    simTimer = null
  }
}

function stopPump() {
  if (pumpRafId !== null) {
    cancelAnimationFrame(pumpRafId)
    pumpRafId = null
  }
}

watch(isPlaying, (val) => {
  if (val && !hasRealAudio.value) {
    startSimulation()
  } else {
    stopSimulation()
  }
})

/* ── Audio & Web Audio API init ── */

function initAudio() {
  if (audioRef.value) return

  const audio = new Audio()
  audio.volume = volume.value
  audio.preload = 'metadata'

  // Web Audio API for real visualizer
  const ctx = new AudioContext()
  const anl = ctx.createAnalyser()
  anl.fftSize = 64
  anl.smoothingTimeConstant = 0.8
  const src = ctx.createMediaElementSource(audio)
  src.connect(anl)
  anl.connect(ctx.destination)

  audioCtx.value = ctx
  analyserNode.value = anl
  audioRef.value = audio

  // Events
  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
  })
  audio.addEventListener('loadedmetadata', () => {
    duration.value = audio.duration || currentTrack.value?.duration || 0
    isLoading.value = false
  })
  audio.addEventListener('play', () => {
    isPlaying.value = true
  })
  audio.addEventListener('pause', () => {
    isPlaying.value = false
  })
  audio.addEventListener('ended', () => {
    next()
  })
  audio.addEventListener('error', () => {
    error.value = '这段旋律迷失在了深空中。'
    isLoading.value = false
    isPlaying.value = false
  })
  audio.addEventListener('waiting', () => {
    isLoading.value = true
  })
  audio.addEventListener('canplay', () => {
    isLoading.value = false
  })

  // Real-time frequency data pump (reuses buffer to avoid per-frame allocation)
  const bufferLength = anl.frequencyBinCount
  frequencyData.value = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>

  function pump() {
    if (analyserNode.value) {
      analyserNode.value.getByteFrequencyData(frequencyData.value)
      triggerRef(frequencyData)
    }
    pumpRafId = requestAnimationFrame(pump)
  }
  pumpRafId = requestAnimationFrame(pump)
}

function resumeContext() {
  if (audioCtx.value?.state === 'suspended') {
    audioCtx.value.resume()
  }
}

/* ── Track loading ── */

function loadTrack(index: number) {
  if (!audioRef.value) initAudio()
  const audio = audioRef.value!
  const track = playlist.value[index]
  if (!track) return

  isLoading.value = true
  error.value = ''
  currentIndex.value = index
  currentTrack.value = track
  currentTime.value = 0
  duration.value = track.duration || 0

  if (track.src) {
    audio.src = track.src
    audio.load()
  } else {
    // Simulated track: no audio source
    isLoading.value = false
  }
}

/* ── Playback controls ── */

async function play(index?: number) {
  if (!audioRef.value) initAudio()
  resumeContext()

  if (index !== undefined && index !== currentIndex.value) {
    loadTrack(index)
  }

  const audio = audioRef.value!

  if (currentTrack.value?.src) {
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        error.value = '需要你的触碰，音乐才能流淌。点击页面任意处后重试。'
      })
    }
  } else {
    // Simulated playback
    isPlaying.value = true
  }
}

function pause() {
  audioRef.value?.pause()
  isPlaying.value = false
  stopSimulation()
}

function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function next() {
  if (playlist.value.length === 0) return
  const nextIndex = (currentIndex.value + 1) % playlist.value.length
  loadTrack(nextIndex)
  play()
}

function prev() {
  if (playlist.value.length === 0) return
  const prevIndex =
    (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  loadTrack(prevIndex)
  play()
}

function seek(time: number) {
  if (audioRef.value && currentTrack.value?.src) {
    audioRef.value.currentTime = time
  }
  currentTime.value = time
}

function setVolume(val: number) {
  const clamped = Math.max(0, Math.min(1, val))
  volume.value = clamped
  if (audioRef.value) {
    audioRef.value.volume = clamped
  }
}

function setPlaylist(tracks: Track[], startIndex = 0) {
  playlist.value = tracks
  if (tracks.length > 0) {
    loadTrack(startIndex)
  }
}

function destroy() {
  stopSimulation()
  stopPump()

  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.removeAttribute('src')
    audioRef.value = null
  }

  if (audioCtx.value && audioCtx.value.state !== 'closed') {
    audioCtx.value.close()
    audioCtx.value = null
  }

  analyserNode.value = null
  frequencyData.value = new Uint8Array(0) as Uint8Array<ArrayBuffer>
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
}

/* ========================================
   Composable Export
   ======================================== */

export function useAudioPlayer() {
  return {
    // State (refs)
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

    // Actions
    initAudio,
    setPlaylist,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    destroy,
  }
}
