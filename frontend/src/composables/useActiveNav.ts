import { useRoute } from 'vue-router'

export function useActiveNav() {
  const route = useRoute()

  function isActive(to: string): boolean {
    if (to === '/') return route.path === '/'
    return route.path.startsWith(to)
  }

  return { isActive }
}
