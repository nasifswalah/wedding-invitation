import { useEffect, useRef } from 'react'
import { getWind, getTime, onBurst, getAttractor } from './wind'
import { prefersReducedMotion } from '../../lib/motion'

type Petal = {
  x: number; y: number; vx: number; vy: number; size: number
  rot: number; vr: number; spin: number; vs: number
  sway: number; hue: number; drift: number
  extra: boolean; captured: boolean; flight?: number
}

// colours of the card: champagne, burgundy, blush, cream
const COLORS: [string, string][] = [
  ['#f1dcc8', '#c49a8a'],
  ['#d99aa0', '#7a2a38'],
  ['#fbe3d6', '#e7ab8f'],
  ['#f6e7d6', '#c9a98c'],
]

/**
 * Petals that fall from the hanging flowers across the whole page.
 *  - a few drift down all the time
 *  - `burst(n)` (from a wind gust) shakes loose a flurry from the top
 *  - an attractor (the bride's bouquet) can catch petals mid-air
 * Drift uses the same wind field as the flowers.
 */
export function PetalsCanvas({ base = 1 }: { base?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0, dpr = 1
    let petals: Petal[] = []
    let baseCount = 0

    const make = (p: Partial<Petal> = {}): Petal => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: 0,
      vy: 18 + Math.random() * 22,
      size: 5.5 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 1.4,
      spin: Math.random() * Math.PI * 2,
      vs: 1 + Math.random() * 2.2,
      sway: Math.random() * 10,
      hue: Math.floor(Math.random() * COLORS.length),
      drift: 14 + Math.random() * 22,
      extra: false,
      captured: false,
      ...p,
    })

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      baseCount = Math.round((w < 640 ? 9 : w < 1100 ? 14 : 20) * base)
      petals = Array.from({ length: baseCount }, () => make({ y: Math.random() * h }))
    }
    resize()
    window.addEventListener('resize', resize)

    // a gust shakes petals loose from the hanging strands at the top
    const offBurst = onBurst((n) => {
      for (let i = 0; i < n; i++) {
        petals.push(make({
          x: Math.random() * w * 0.9,
          y: Math.random() * h * 0.32,
          vx: 60 + Math.random() * 120,
          vy: 10 + Math.random() * 30,
          vs: 3 + Math.random() * 3,
          extra: true,
        }))
      }
    })

    const drawPetal = (p: Petal) => {
      const [c1, c2] = COLORS[p.hue]
      const flip = Math.cos(p.spin) // 3D tumble
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.scale(Math.max(0.15, Math.abs(flip)), 1)
      const s = p.size
      const g = ctx.createLinearGradient(0, -s, 0, s)
      g.addColorStop(0, flip > 0 ? c1 : c2)
      g.addColorStop(1, flip > 0 ? c2 : c1)
      ctx.fillStyle = g
      ctx.globalAlpha = 0.92
      ctx.beginPath()
      ctx.moveTo(0, s)
      ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.75, -s * 0.7, 0, -s)
      ctx.bezierCurveTo(-s * 0.2, -s * 0.6, -s * 0.9, -s * 0.2, 0, s)
      ctx.fill()
      ctx.restore()
    }

    let raf = 0
    let last = performance.now()
    let catchClock = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, w, h)
      const t = getTime()

      // bouquet catching petals
      const att = getAttractor()
      const target = att?.getPoint() ?? null
      if (att && target) {
        catchClock += dt
        const every = 1 / (att.rate ?? 1.6)
        const flying = petals.filter((p) => p.captured).length
        if (catchClock > every && flying < 6) {
          catchClock = 0
          const free = petals.filter((p) => !p.captured && p.y > 0 && p.y < target.y - 40)
          const pick = free.length ? free[Math.floor(Math.random() * free.length)] : null
          if (pick) pick.captured = true
          else petals.push(make({ x: Math.random() * w, y: -10, captured: true, extra: true }))
        }
      }

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        if (p.captured && target) {
          // steer into the bouquet, slowing as it arrives
          const dx = target.x - p.x, dy = target.y - p.y
          const d = Math.hypot(dx, dy)
          const speed = Math.min(260, 90 + d * 1.1)
          const k = Math.min(1, dt * (d < 60 ? 9 : 3)) // tighten the turn on approach so it can't orbit
          p.vx += ((dx / (d || 1)) * speed - p.vx) * k
          p.vy += ((dy / (d || 1)) * speed - p.vy) * k
          p.x += p.vx * dt + Math.sin(t * 3 + p.sway) * 0.4
          p.y += p.vy * dt
          p.rot += p.vr * dt
          p.spin += p.vs * dt
          p.flight = (p.flight ?? 0) + dt
          if (d < 16 || (p.flight > 4 && d < 60)) {
            att!.onLand()
            if (p.extra) petals.splice(i, 1)
            else petals[i] = make()
            continue
          }
        } else {
          if (p.captured) p.captured = false
          const wind = getWind(Math.min(1, Math.max(0, p.x / w)), p.sway)
          p.vx *= 1 - Math.min(1, dt * 0.8) // burst velocity fades into the breeze
          p.y += p.vy * dt * (1 + Math.max(0, wind) * 0.15)
          p.x += (p.vx + Math.sin(t * 0.9 + p.sway) * p.drift * 0.5 + wind * 50) * dt
          p.rot += (p.vr + wind * 0.6) * dt
          p.spin += p.vs * dt * (1 + Math.abs(wind) * 0.8)
          if (p.y > h + 30 || p.x > w + 60 || p.x < -80) {
            if (p.extra) { petals.splice(i, 1); continue }
            petals[i] = make()
          }
        }
        drawPetal(p)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      offBurst()
    }
  }, [base])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-30" aria-hidden />
}
