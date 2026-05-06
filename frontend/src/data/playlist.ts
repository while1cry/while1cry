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
    src: 'https://while1cry.me/downloads/M3mo - 荒诞插曲.mp3',
  },
  {
    id: 't2',
    title: 'wake me when it\'s over',
    artist: 'Vorsa',
    duration: 147,
    src: 'https://while1cry.me/downloads/Vorsa - wake me when it\'s over.mp3',
  },
  {
    id: 't3',
    title: 'scenery',
    artist: 'Xeuphoria,OneChilledPanda',
    duration: 1200,
    src: 'https://while1cry.me/downloads/Xeuphoria,OneChilledPanda - scenery.mp3',
  },
  {
    id: 't4',
    title: 'CANCION FAVORITA',
    artist: '-Prey,Scythermane,dearukia',
    duration: 101,
    src: 'https://while1cry.me/downloads/-Prey,Scythermane,dearukia - CANCION FAVORITA.mp3',
  },
  {
    id: 't5',
    title: 'Tidechase',
    artist: 'aethoro',
    duration: 269,
    src: 'https://while1cry.me/downloads/aethoro - Tidechase.mp3',
  },
]
