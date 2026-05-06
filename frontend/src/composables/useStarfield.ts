import { onUnmounted, type Ref } from 'vue'

interface Star {
  x: number
  y: number
  radius: number
  baseAlpha: number
  alpha: number
  twinkleSpeed: number
  twinklePhase: number
  driftX: number
  driftY: number
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  alpha: number
  life: number
  maxLife: number
}

interface Nebula {
  x: number
  y: number
  radius: number
  colorR: number
  colorG: number
  colorB: number
  maxAlpha: number
  phase: number
  speed: number
  cycles: number
}

const NEBULA_COLORS = [
  { r: 123, g: 143, b: 199 }, // nebula blue
  { r: 139, g: 92,  b: 246 }, // violet
  { r: 99,  g: 102, b: 241 }, // indigo
  { r: 168, g: 85,  b: 247 }, // purple
]

export function useStarfield(canvasRef: Ref<HTMLCanvasElement | null>) {
  let ctx: CanvasRenderingContext2D | null = null
  let animationId: number | null = null
  let stars: Star[] = []
  let meteors: Meteor[] = []
  let nebulae: Nebula[] = []
  let width = 0
  let height = 0
  let meteorTimer = 0
  let meteorInterval = 3000 // frames, ~50 seconds between meteors on average
  let nebulaTimer = 0
  let nebulaInterval = 600 // frames, ~10 seconds between nebulae on average
  let time = 0
  let visibilityBound = false

  function onVisibilityChange() {
    if (document.hidden) {
      stopLoop()
    } else {
      startLoop()
    }
  }

  const STAR_COUNT = 200
  const STAR_LAYERS = 3
  const MAX_NEBULAE = 2

  function initCanvas() {
    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    resize()
    createStars()
    window.addEventListener('resize', resize)

    if (!visibilityBound) {
      document.addEventListener('visibilitychange', onVisibilityChange)
      visibilityBound = true
    }
    startLoop()
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    width = window.innerWidth
    height = window.innerHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function createStars() {
    stars = []

    for (let layer = 0; layer < STAR_LAYERS; layer++) {
      const count = STAR_COUNT / STAR_LAYERS
      const depth = layer / STAR_LAYERS

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.3 + depth * 1.2 + Math.random() * 0.5,
          baseAlpha: 0.2 + depth * 0.5,
          alpha: 0,
          twinkleSpeed: 0.003 + Math.random() * 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.04 * (depth + 0.5),
          driftY: (Math.random() - 0.5) * 0.03 * (depth + 0.5),
        })
      }
    }
  }

  function spawnMeteor() {
    const startX = Math.random() * width * 0.8 + width * 0.1
    const startY = Math.random() * height * 0.3

    const angle = -30 + (Math.random() - 0.5) * 20
    const rad = (angle * Math.PI) / 180
    const speed = 6 + Math.random() * 4

    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      length: 60 + Math.random() * 80,
      alpha: 0.9,
      life: 0,
      maxLife: 80 + Math.random() * 40,
    })
  }

  function updateMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]!
      m.x += m.vx
      m.y += m.vy
      m.life++

      const progress = m.life / m.maxLife
      m.alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8
      m.alpha *= 0.9

      if (m.life >= m.maxLife) {
        meteors.splice(i, 1)
      }
    }
  }

  function drawMeteor(m: Meteor) {
    if (!ctx) return

    const angle = Math.atan2(m.vy, m.vx)
    const headX = m.x
    const headY = m.y
    const tailX = headX - Math.cos(angle) * m.length
    const tailY = headY - Math.sin(angle) * m.length

    const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY)
    gradient.addColorStop(0, `rgba(240, 194, 123, ${m.alpha})`)
    gradient.addColorStop(0.3, `rgba(240, 194, 123, ${m.alpha * 0.6})`)
    gradient.addColorStop(1, 'rgba(240, 194, 123, 0)')

    ctx.beginPath()
    ctx.moveTo(headX, headY)
    ctx.lineTo(tailX, tailY)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(headX, headY, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(240, 194, 123, ${m.alpha})`
    ctx.fill()
  }

  /* ── Nebula ─────────────────── */

  function spawnNebula() {
    if (nebulae.length >= MAX_NEBULAE) return

    const color = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]!
    const margin = 100

    nebulae.push({
      x: margin + Math.random() * (width - margin * 2),
      y: margin + Math.random() * (height - margin * 2),
      radius: 80 + Math.random() * 120,
      colorR: color.r,
      colorG: color.g,
      colorB: color.b,
      maxAlpha: 0.025 + Math.random() * 0.035,
      phase: 0,
      speed: 0.003 + Math.random() * 0.004,
      cycles: 2 + Math.random() * 2,
    })
  }

  function updateNebulae() {
    for (let i = nebulae.length - 1; i >= 0; i--) {
      const n = nebulae[i]!
      n.phase += n.speed
      if (n.phase >= Math.PI * 2 * n.cycles) {
        nebulae.splice(i, 1)
      }
    }
  }

  function drawNebula(n: Nebula) {
    if (!ctx) return

    const cycleProgress = (n.phase % (Math.PI * 2)) / (Math.PI * 2)
    const envelope = Math.sin((n.phase / (Math.PI * 2 * n.cycles)) * Math.PI)
    const breathe = 0.5 + 0.5 * Math.sin(n.phase)
    const alpha = n.maxAlpha * breathe * envelope

    if (alpha <= 0.001) return

    const r = n.radius
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r)
    g.addColorStop(0, `rgba(${n.colorR}, ${n.colorG}, ${n.colorB}, ${alpha})`)
    g.addColorStop(0.4, `rgba(${n.colorR}, ${n.colorG}, ${n.colorB}, ${alpha * 0.5})`)
    g.addColorStop(1, `rgba(${n.colorR}, ${n.colorG}, ${n.colorB}, 0)`)

    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(
      n.x,
      n.y,
      r * (0.9 + 0.1 * Math.sin(cycleProgress * Math.PI * 2)),
      r * (0.7 + 0.15 * Math.cos(cycleProgress * Math.PI * 2)),
      cycleProgress * Math.PI * 0.3,
      0,
      Math.PI * 2,
    )
    ctx.fill()
    ctx.restore()
  }

  function drawStars() {
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    for (const n of nebulae) {
      drawNebula(n)
    }

    for (const star of stars) {
      const twinkle =
        0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase)
      star.alpha = star.baseAlpha * (0.6 + 0.4 * twinkle)

      star.x += star.driftX
      star.y += star.driftY

      if (star.x < -10) star.x = width + 10
      if (star.x > width + 10) star.x = -10
      if (star.y < -10) star.y = height + 10
      if (star.y > height + 10) star.y = -10

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(232, 213, 183, ${star.alpha})`
      ctx.fill()
    }

    for (const m of meteors) {
      drawMeteor(m)
    }
  }

  function loop() {
    if (!ctx) return

    time++

    meteorTimer++
    const nextMeteorIn = meteorInterval + Math.random() * 300
    if (meteorTimer >= nextMeteorIn) {
      spawnMeteor()
      meteorTimer = 0
      meteorInterval = Math.floor(Math.random() * 400 + 200)
    }

    nebulaTimer++
    const nextNebulaIn = nebulaInterval + Math.random() * 600
    if (nebulaTimer >= nextNebulaIn) {
      spawnNebula()
      nebulaTimer = 0
      nebulaInterval = Math.floor(Math.random() * 900 + 500)
    }

    updateMeteors()
    updateNebulae()
    drawStars()

    animationId = requestAnimationFrame(loop)
  }

  function startLoop() {
    stopLoop()
    animationId = requestAnimationFrame(loop)
  }

  function stopLoop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  function destroy() {
    stopLoop()
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    visibilityBound = false
    stars = []
    meteors = []
    nebulae = []
    ctx = null
    animationId = null
  }

  onUnmounted(destroy)

  return {
    initCanvas,
    destroy,
  }
}
