import type { Track } from '@/composables/useAudioPlayer'

/**
 * Playlist Track Data
 * ===================
 * 支持混合使用远程 URL 与本地静态资源。
 *
 * 本地音频：将文件放入 public/music/，路径写为 /music/xxx.mp3
 * 远程音频：直接使用完整 HTTPS URL
 *
 * 若 src 为空，播放器将以「模拟模式」运行（进度条自动前进，无真实音频）。
 * 构建时 Vite 会把 public/ 下的文件原样复制到 dist/ 根目录。
 */

export const playlistTracks: Track[] = [
  // === 默认无音频源，以模拟模式运行 ===
  {
    id: 't1',
    title: '荒诞插曲',
    artist: 'M3mo',
    duration: 133,
    src: '/music/M3mo - 荒诞插曲.mp3',
  },
  {
    id: 't2',
    title: '深空回响',
    artist: 'while1cry',
    duration: 195,
    // src: '/music/deep-echo.mp3',
  },
  {
    id: 't3',
    title: '寂静舱',
    artist: 'while1cry',
    duration: 247,
    // src: '/music/silent-cabin.mp3',
  },
  {
    id: 't4',
    title: '事件视界',
    artist: 'while1cry',
    duration: 163,
    // src: '/music/event-horizon.mp3',
  },
  {
    id: 't5',
    title: '微光跃迁',
    artist: 'while1cry',
    duration: 202,
    // src: '/music/faint-jump.mp3',
  },
  {
    id: 't6',
    title: '无尽循环',
    artist: 'while1cry',
    duration: 180,
    // src: '/music/endless-loop.mp3',
  },
]
