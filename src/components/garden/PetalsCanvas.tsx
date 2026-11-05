import { useEffect, useRef } from 'react'
import { getWind, getTime } from './wind'
import { prefersReducedMotion } from '../../lib/motion'

type Petal = {
  x: number; y: number; vy: number; size: number
  rot: number; vr: number; spin: number; vs: number
  sway: number; hue: 0 | 1 | 2; drift: number
}
type Mote = { x: number; y: number; r: number; phase: number; speed: number }

const COLORS: [string, string][] = [
  ['#f6d9cf', '#d99a8c'], // blush
  ['#fffaf0', '#e8dcc0'], // ivory / jasmine
  ['#f1cfc3', '#c98577'], // rose
]

/**
 * Petals drifting down through the whole page plus warm dust motes in the light.
 * Petal drift is driven by the same wind field as the flowers.
 */
export function PetalsCanvas({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0, dpr = 1
    let petals: Petal[] = []
    let motes: Mote[] = []

    const spawn = (p: Partial<Petal> = {}): Petal => ({
      x: Math.random() * w * 1.2 - w * 0.2,
      y: -20 - Math.random() * h,
      vy: 16 + Math.random() * 26,
      size: 6 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 1.4,
      spin: Math.random() * Math.PI * 2,
      vs: 1 + Math.random() * 2.2,
      sway: Math.random() * 10,
      hue: (Math.floor(Math.random() * 3) as 0 | 1 | 2),
      drift: 18 + Math.random() * 26,
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
      const count = Math.round((w < 640 ? 13 : w < 1100 ? 20 : 28) * density)
      petals = Array.from({ length: count }, () => spawn({ y: Math.random() * h }))
      motes = Array.from({ length: w < 640 ? 18 : 32 }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 1.8,
        phase: Math.random() * 10, speed: 4 + Math.random() * 8,
      }))
    }
    resize()
    window.addEventListener('resize', resize)

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
      ctx.globalAlpha = 0.88
      ctx.beginPath()
      ctx.moveTo(0, s)
      ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.75, -s * 0.7, 0, -s)
      ctx.bezierCurveTo(-s * 0.2, -s * 0.6, -s * 0.9, -s * 0.2, 0, s)
      ctx.fill()
      ctx.restore()
    }

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, w, h)
      const t = getTime()

      // dust motes in warm light
      for (const m of motes) {
        m.y -= m.speed * dt * 0.4
        m.x += Math.sin(t * 0.4 + m.phase) * 0.15 + getWind(m.x / w) * 4 * dt
        if (m.y < -5) { m.y = h + 5; m.x = Math.random() * w }
        if (m.x > w + 5) m.x = -5
        const a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + m.phase))
        ctx.globalAlpha = a
        ctx.fillStyle = '#e8cf8f'
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        const wind = getWind(Math.min(1, Math.max(0, p.x / w)), p.sway)
        p.y += p.vy * dt * (1 + Math.max(0, wind) * 0.15)
        p.x += (Math.sin(t * 0.9 + p.sway) * p.drift * 0.5 + wind * 55) * dt
        p.rot += (p.vr + wind * 0.6) * dt
        p.spin += p.vs * dt * (1 + Math.abs(wind) * 0.8)
        if (p.y > h + 30 || p.x > w + 60 || p.x < -80) petals[i] = spawn()
        drawPetal(p)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-30" aria-hidden />
}
