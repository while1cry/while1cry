export interface NavItem {
  to: string
  label: string
}

export const navItems: NavItem[] = [
  { to: '/', label: '首页' },
  { to: '/works', label: '作品' },
  { to: '/gallery', label: '画廊' },
  { to: '/playlist', label: '歌单' },
  { to: '/links', label: '链接' },
]
