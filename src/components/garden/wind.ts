import gsap from 'gsap'
import { prefersReducedMotion } from '../../lib/motion'

/**
 * One shared wind field drives every swaying flower, leaf, garland and petal,
 * so the whole garden moves together like real air rather than looping clips.
 *
 *  - a layered sine "breeze" (never repeats noticeably)
 *  - occasional gusts that travel across the screen from left to right
 */

type Gust = { start: number; strength: number; duration: number; travel: number }

let time = 0
let gusts: Gust[] = []
let nextGust = 2.5

function breeze(t: number) {
  return (
    0.55 * Math.sin(t * 0.83) +
    0.28 * Math.sin(t * 1.61 + 1.3) +
    0.12 * Math.sin(t * 2.97 + 0.4) +
    0.05 * Math.sin(t * 5.3 + 2.1)
  )
}

/** Wind at time t for a given horizontal screen position x ∈ [0,1] */
export function windAt(t: number, x: number, phase = 0) {
  let g = 0
  for (const gust of gusts) {
    const u = (t - gust.start - x * gust.travel) / gust.duration
    if (u > 0 && u < 1) {
      const s = Math.sin(Math.PI * u)
      g += gust.strength * s * s
    }
  }
  return 0.45 * breeze(t + phase) + g
}

export const getWind = (x: number, phase = 0) => windAt(time, x, phase)
export const getTime = () => time

type SwayItem = {
  setRot: (v: number) => void
  amp: number
  phase: number
  x: number
  stiffness: number
  bias: number
  current: number
  visible: () => boolean
}

const items = new Set<SwayItem>()
let running = false

function tick(_t: number, deltaMs: number) {
  const dt = Math.min(deltaMs, 50) / 1000
  time += dt

  // schedule new gusts
  if (time > nextGust) {
    gusts.push({
      start: time,
      strength: 0.6 + Math.random() * 0.9,
      duration: 2.2 + Math.random() * 1.8,
      travel: 1.1 + Math.random() * 0.6,
    })
    nextGust = time + 4 + Math.random() * 6
  }
  gusts = gusts.filter((g) => time - g.start < g.duration + g.travel + 0.5)

  for (const it of items) {
    if (!it.visible()) continue
    const target = it.bias + it.amp * windAt(time, it.x, it.phase)
    // critically-damped-ish follow → gives each part its own inertia
    const k = 1 - Math.exp(-dt * it.stiffness)
    it.current += (target - it.current) * k
    it.setRot(it.current)
  }
}

function ensureRunning() {
  if (running || prefersReducedMotion()) return
  running = true
  gsap.ticker.add(tick)
}

export type SwayOptions = {
  /** max rotation in degrees for a strong gust */
  amp?: number
  /** phase offset so neighbours don't move in lockstep */
  phase?: number
  /** horizontal position 0..1 (for travelling gusts); auto-detected if omitted */
  x?: number
  /** how quickly the part follows the wind (higher = stiffer) */
  stiffness?: number
  /** resting lean in degrees */
  bias?: number
  /** transform origin, default stem base */
  origin?: string
}

export function registerSway(el: Element, opts: SwayOptions = {}) {
  // SVG parts are drawn with their pivot at local (0,0) → rotate() about it exactly.
  const isSvgPart = el instanceof SVGElement && !(el instanceof SVGSVGElement)
  const setRot = isSvgPart
    ? (v: number) => el.setAttribute('transform', `rotate(${v.toFixed(2)})`)
    : (gsap.quickSetter(el, 'rotation', 'deg') as (v: number) => void)
  if (!isSvgPart) gsap.set(el, { transformOrigin: opts.origin ?? '50% 100%' })
  setRot(opts.bias ?? 0)
  if (prefersReducedMotion()) return () => {}

  let x = opts.x
  if (x === undefined) {
    const r = el.getBoundingClientRect()
    x = Math.min(1, Math.max(0, (r.left + r.width / 2) / window.innerWidth))
  }

  let visible = true
  const host = (el as SVGElement).ownerSVGElement ?? el
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '120px' })
  io.observe(host)

  const item: SwayItem = {
    setRot,
    amp: opts.amp ?? 4,
    phase: opts.phase ?? Math.random() * 10,
    x,
    stiffness: opts.stiffness ?? 3,
    bias: opts.bias ?? 0,
    current: opts.bias ?? 0,
    visible: () => visible,
  }
  items.add(item)
  ensureRunning()
  return () => {
    items.delete(item)
    io.disconnect()
  }
}
