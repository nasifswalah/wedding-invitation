import { useEffect, useRef } from 'react'
import { getWind } from './wind'
import { prefersReducedMotion, seeded } from '../../lib/motion'

/**
 * A light curtain of hanging flower strands across the top of the hero,
 * drawn on a canvas so it stays smooth on phones.
 *
 * Each flower is painted once into a small sprite; every frame we only
 * work out where each strand's joints are (from the shared wind) and stamp
 * the sprites along it. Strands are long at the sides, short in the middle,
 * so the couple's names stay framed and clear.
 */

type Kind = 'rose-mauve' | 'rose-peach' | 'rose-ivory' | 'hyd-blue' | 'hyd-lilac' | 'spray' | 'leaf'
type Bloom = { t: number; kind: Kind; size: number; rot: number; dx: number }
type Strand = { x: number; len: number; phase: number; blooms: Bloom[]; angles: number[]; drop: number; delay: number }

const ROSE: Record<string, [string, string, string]> = {
  'rose-mauve': ['#4a1018', '#8e3344', '#d99aa0'],
  'rose-peach': ['#9a4a52', '#d9a3a8', '#f1d6cf'],
  'rose-ivory': ['#cdb99a', '#efe5d4', '#f6e7d6'],
}

function paintSprite(kind: Kind, r: number, dpr: number, rnd: () => number) {
  const S = Math.ceil(r * 2.6)
  const c = document.createElement('canvas')
  c.width = c.height = S * dpr
  const g = c.getContext('2d')!
  g.scale(dpr, dpr)
  g.translate(S / 2, S / 2)

  if (kind.startsWith('rose')) {
    const [core, mid, edge] = ROSE[kind]
    const ring = (n: number, len: number, wid: number, off: number) => {
      for (let i = 0; i < n; i++) {
        g.save()
        g.rotate(off + (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.25)
        const grad = g.createLinearGradient(0, 0, 0, -len)
        grad.addColorStop(0, mid)
        grad.addColorStop(1, edge)
        g.fillStyle = grad
        g.beginPath()
        g.moveTo(0, 0)
        g.bezierCurveTo(wid, -len * 0.2, wid * 1.15, -len * 0.85, 0, -len)
        g.bezierCurveTo(-wid * 1.15, -len * 0.85, -wid, -len * 0.2, 0, 0)
        g.fill()
        g.strokeStyle = 'rgba(40,8,14,0.25)'
        g.lineWidth = 0.5
        g.stroke()
        g.restore()
      }
    }
    ring(6, r, r * 0.55, 0)
    ring(5, r * 0.75, r * 0.48, 0.5)
    ring(5, r * 0.52, r * 0.4, 0.2)
    const cg = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.38)
    cg.addColorStop(0, core)
    cg.addColorStop(1, mid)
    g.fillStyle = cg
    g.beginPath(); g.arc(0, 0, r * 0.36, 0, Math.PI * 2); g.fill()
    g.strokeStyle = core
    g.globalAlpha = 0.5
    g.lineWidth = 0.7
    g.beginPath(); g.arc(0, 0, r * 0.2, 0.3, Math.PI * 1.7); g.stroke()
  } else if (kind.startsWith('hyd')) {
    const blue = kind === 'hyd-blue'
    g.fillStyle = blue ? '#b88a80' : '#8a4652'
    g.beginPath(); g.arc(0, 0, r * 0.95, 0, Math.PI * 2); g.fill()
    for (let i = 0; i < 16; i++) {
      const t = (i + 0.5) / 16
      const rad = Math.sqrt(t) * r * 0.8
      const a = i * 2.39996
      const s = r * (0.36 - t * 0.1)
      g.save()
      g.translate(Math.cos(a) * rad, Math.sin(a) * rad)
      g.rotate(rnd() * Math.PI)
      for (let k = 0; k < 4; k++) {
        g.rotate(Math.PI / 2)
        g.fillStyle = blue ? (k % 2 ? '#f1dcc8' : '#d9b8a8') : (k % 2 ? '#e6c3c0' : '#b97a80')
        g.beginPath(); g.ellipse(0, -s * 0.5, s * 0.38, s * 0.52, 0, 0, Math.PI * 2); g.fill()
      }
      g.fillStyle = blue ? '#8a5a50' : '#6a2a36'
      g.beginPath(); g.arc(0, 0, s * 0.13, 0, Math.PI * 2); g.fill()
      g.restore()
    }
  } else if (kind === 'spray') {
    g.strokeStyle = '#7a8456'
    g.lineWidth = 0.6
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (rnd() - 0.5) * 2.4
      const L = r * (0.6 + rnd() * 0.5)
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(Math.cos(a) * L * 0.4, Math.sin(a) * L * 0.6, Math.cos(a) * L, Math.sin(a) * L); g.stroke()
      g.fillStyle = '#f6e7d6'
      g.beginPath(); g.arc(Math.cos(a) * L, Math.sin(a) * L, r * 0.16, 0, Math.PI * 2); g.fill()
    }
  } else {
    const grad = g.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r)
    grad.addColorStop(0, '#a7ad84')
    grad.addColorStop(1, '#5f6b42')
    g.fillStyle = grad
    g.beginPath(); g.ellipse(0, 0, r * 0.8, r * 0.68, 0, 0, Math.PI * 2); g.fill()
  }
  return { img: c, size: S }
}

const KINDS: Kind[] = ['rose-mauve', 'rose-peach', 'rose-ivory', 'hyd-blue', 'hyd-blue', 'hyd-lilac', 'spray', 'leaf', 'leaf']

function buildStrands(w: number, H: number): Strand[] {
  const rnd = seeded(41)
  const gap = w < 500 ? 34 : 44
  const n = Math.max(4, Math.floor(w / gap))
  const off = (w - (n - 1) * gap) / 2
  const strands: Strand[] = []
  for (let i = 0; i < n; i++) {
    const x = off + i * gap + (rnd() - 0.5) * 8
    const u = Math.abs((x / w) * 2 - 1)
    if (u < 0.3 && rnd() < 0.55) continue // keep the centre airy
    const len = H * (0.18 + 0.82 * Math.pow(u, 1.5)) * (0.8 + rnd() * 0.35)
    const count = Math.max(2, Math.round(len / 34))
    const blooms: Bloom[] = []
    for (let k = 0; k < count; k++) {
      const kind = KINDS[Math.floor(rnd() * KINDS.length)]
      blooms.push({
        t: (k + 0.6) / count + (rnd() - 0.5) * 0.08,
        kind,
        size: kind.startsWith('hyd') ? 9 + rnd() * 4 : kind === 'leaf' ? 5 + rnd() * 2 : 7 + rnd() * 3,
        rot: rnd() * Math.PI * 2,
        dx: (rnd() - 0.5) * 6,
      })
    }
    // a bigger bloom finishes each strand
    blooms.push({ t: 1, kind: rnd() < 0.5 ? 'hyd-blue' : 'rose-mauve', size: 10 + rnd() * 3, rot: rnd() * 6, dx: 0 })
    strands.push({ x, len, phase: i * 0.7, blooms, angles: [0, 0, 0, 0], drop: 0, delay: 0.15 + u * 0.1 + (i % 3) * 0.12 })
  }
  return strands
}

export function HangingStrands({ className = '', maxHeight = 300 }: { className?: string; maxHeight?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = prefersReducedMotion()
    let w = 0, H = 0, dpr = 1
    let strands: Strand[] = []
    const sprites = new Map<string, { img: HTMLCanvasElement; size: number }>()
    const sprite = (kind: Kind, size: number) => {
      const key = `${kind}-${Math.round(size)}`
      let s = sprites.get(key)
      if (!s) { s = paintSprite(kind, Math.round(size), dpr, seeded(key.length * 13 + size)); sprites.set(key, s) }
      return s
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      H = Math.min(maxHeight, Math.max(170, w * 0.42))
      canvas.width = w * dpr
      canvas.height = (H + 40) * dpr
      canvas.style.height = `${H + 40}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sprites.clear()
      strands = buildStrands(w, H)
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()
    let last = start
    let raf = 0
    const JOINTS = 4

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const el = (now - start) / 1000
      const rect = canvas.getBoundingClientRect()
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        ctx.clearRect(0, 0, w, H + 40)

        // the cord they hang from
        ctx.strokeStyle = 'rgba(207,174,143,0.55)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(0, 5)
        ctx.quadraticCurveTo(w / 4, 16, w / 2, 9)
        ctx.quadraticCurveTo((3 * w) / 4, 2, w, 5)
        ctx.stroke()

        for (const s of strands) {
          // drop in, then sway
          const p = reduced ? 1 : Math.min(1, Math.max(0, (el - s.delay) / 1.6))
          s.drop = 1 - Math.pow(1 - p, 3)
          const xNorm = s.x / w
          for (let j = 0; j < JOINTS; j++) {
            const target = reduced ? 0 : (0.035 + j * 0.03) * getWind(xNorm, s.phase + j * 0.6)
            const k = 1 - Math.exp(-dt * (2.2 - j * 0.35))
            s.angles[j] += (target - s.angles[j]) * k
          }
          const seg = (s.len * s.drop) / JOINTS
          const pts: { x: number; y: number; a: number }[] = [{ x: s.x, y: 8, a: 0 }]
          let a = 0
          for (let j = 0; j < JOINTS; j++) {
            a += s.angles[j]
            const prev = pts[pts.length - 1]
            pts.push({ x: prev.x - Math.sin(a) * seg, y: prev.y + Math.cos(a) * seg, a })
          }
          ctx.strokeStyle = 'rgba(207,174,143,0.4)'
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
          ctx.stroke()

          for (const b of s.blooms) {
            const f = b.t * JOINTS
            const j = Math.min(JOINTS - 1, Math.floor(f))
            const u = f - j
            const p0 = pts[j], p1 = pts[j + 1]
            const x = p0.x + (p1.x - p0.x) * u + b.dx
            const y = p0.y + (p1.y - p0.y) * u
            const sp = sprite(b.kind, b.size)
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(b.rot + p1.a)
            ctx.globalAlpha = s.drop
            ctx.drawImage(sp.img, -sp.size / 2, -sp.size / 2, sp.size, sp.size)
            ctx.restore()
          }
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [maxHeight])

  return <canvas ref={ref} className={`pointer-events-none block w-full ${className}`} aria-hidden />
}
