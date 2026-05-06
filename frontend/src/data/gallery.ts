import type { GalleryImage } from '@/types'

/**
 * Gallery Image Data
 * ==================
 * 支持混合使用远程 URL 与本地静态资源。
 *
 * 本地资源：将图片放入 public/images/gallery/，路径写为 /images/gallery/xxx.jpg
 * 远程资源：直接使用完整 HTTPS URL
 *
 * 构建时 Vite 会把 public/ 下的文件原样复制到 dist/ 根目录。
 */

export const galleryImages: GalleryImage[] = [
  // === 默认使用 Picsum 占位图，方便预览 ===
  // 替换为本地资源时，把 src 和 thumbnail 改成 /images/gallery/ 下的路径即可
  {
    id: 'g1',
    src: 'https://picsum.photos/id/1015/800/600',
    thumbnail: 'https://picsum.photos/id/1015/400/300',
    title: '远山的轮廓',
    description: '雾霭中的山脊，如同深空中的星系悬臂。',
  },
  {
    id: 'g2',
    src: 'https://picsum.photos/id/1018/800/600',
    thumbnail: 'https://picsum.photos/id/1018/400/300',
    title: '寂静谷',
    description: '风与光在此交汇，留下无声的痕迹。',
  },
  {
    id: 'g3',
    src: 'https://picsum.photos/id/1035/800/600',
    thumbnail: 'https://picsum.photos/id/1035/400/300',
    title: '光之裂隙',
    description: '穿过云层的第一束光，像宇宙大爆炸的回响。',
  },
  {
    id: 'g4',
    src: 'https://picsum.photos/id/1043/800/600',
    thumbnail: 'https://picsum.photos/id/1043/400/300',
    title: '孤岛',
    description: '广袤中的一点存在，无人问津，自在其中。',
  },
  {
    id: 'g5',
    src: 'https://picsum.photos/id/106/800/600',
    thumbnail: 'https://picsum.photos/id/106/400/300',
    title: '微光',
    description: '微弱而不熄的光，是深空中最温柔的信号。',
  },
  {
    id: 'g6',
    src: 'https://picsum.photos/id/107/800/600',
    thumbnail: 'https://picsum.photos/id/107/400/300',
    title: '未名之地',
    description: '不知名的角落，恰好容纳一段独处的时光。',
  },
  {
    id: 'g7',
    src: 'https://picsum.photos/id/108/800/600',
    thumbnail: 'https://picsum.photos/id/108/400/300',
    title: '静默航线',
    description: '没有航标的旅途，凭星光导航。',
  },
  {
    id: 'g8',
    src: 'https://picsum.photos/id/116/800/600',
    thumbnail: 'https://picsum.photos/id/116/400/300',
    title: '星痕',
    description: '短暂的光轨，在镜头中成为永恒。',
  },

  // === 本地资源示例（取消注释并放入对应文件即可使用）===
  // {
  //   id: 'local-1',
  //   src: '/images/gallery/photo-1.jpg',
  //   thumbnail: '/images/gallery/photo-1-thumb.jpg',
  //   title: '自托管照片',
  //   description: '放在 public/images/gallery/ 下的本地图片。',
  // },
]
