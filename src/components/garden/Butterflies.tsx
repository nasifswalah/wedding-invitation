import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../../lib/motion'

function Butterfly({ hue }: { hue: 'gold' | 'blush' }) {
  const a = hue === 'gold' ? '#e9c9a6' : '#d9a3a8'
  const b = hue === 'gold' ? '#b08a6a' : '#8e3344'
  return (
    <svg viewBox="-20 -16 40 32" width="34" height="28" style={{ overflow: 'visible' }}>
      <g className="bf-wing-l">
        <path d="M0 0 C -6 -14 -20 -16 -18 -4 C -17 2 -8 3 0 0Z" fill={a} stroke={b} strokeWidth={0.6} />
        <path d="M0 0 C -8 4 -14 12 -8 13 C -3 13 -1 6 0 0Z" fill={a} stroke={b} strokeWidth={0.6} opacity={0.9} />
        <circle cx={-11} cy={-6} r={1.6} fill={b} opacity={0.6} />
      </g>
      <g className="bf-wing-r">
        <path d="M0 0 C 6 -14 20 -16 18 -4 C 17 2 8 3 0 0Z" fill={a} stroke={b} strokeWidth={0.6} />
        <path d="M0 0 C 8 4 14 12 8 13 C 3 13 1 6 0 0Z" fill={a} stroke={b} strokeWidth={0.6} opacity={0.9} />
        <circle cx={11} cy={-6} r={1.6} fill={b} opacity={0.6} />
      </g>
      <ellipse rx={1.2} ry={7} fill="#e9c9a6" />
      <path d="M0 -6 Q -3 -11 -5 -12 M0 -6 Q 3 -11 5 -12" stroke="#e9c9a6" strokeWidth={0.5} fill="none" />
    </svg>
  )
}

/** Butterflies that wander the hero, pausing and changing direction like real ones. */
export function Butterflies({ count = 2 }: { count?: number }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const items = Array.from(host.current!.children) as HTMLElement[]
    const tweens: gsap.core.Tween[] = []
    items.forEach((el, i) => {
      const bounds = () => host.current!.getBoundingClientRect()
      let { width, height } = bounds()
      gsap.set(el, { x: width * (0.2 + 0.6 * Math.random()), y: height * (0.25 + 0.4 * Math.random()) })
      const fly = () => {
        ;({ width, height } = bounds())
        const cx = gsap.getProperty(el, 'x') as number
        const cy = gsap.getProperty(el, 'y') as number
        const nx = gsap.utils.clamp(10, width - 40, cx + gsap.utils.random(-180, 180))
        const ny = gsap.utils.clamp(height * 0.12, height * 0.8, cy + gsap.utils.random(-120, 120))
        const heading = (Math.atan2(ny - cy, nx - cx) * 180) / Math.PI + 90
        const dist = Math.hypot(nx - cx, ny - cy)
        gsap.to(el, { rotation: gsap.utils.clamp(-50, 50, heading > 180 ? heading - 360 : heading) * 0.5, duration: 0.6, ease: 'sine.out' })
        tweens.push(
          gsap.to(el, {
            x: nx, y: ny,
            duration: 1.6 + dist / 90,
            ease: 'sine.inOut',
            delay: Math.random() < 0.3 ? gsap.utils.random(0.6, 2) : 0,
            onComplete: fly,
          }),
        )
      }
      gsap.delayedCall(i * 1.3, fly)
    })
    return () => {
      tweens.forEach((t) => t.kill())
      items.forEach((el) => gsap.killTweensOf(el))
    }
  }, [count])

  return (
    <div ref={host} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="absolute left-0 top-0" style={{ willChange: 'transform' }}>
          <div className="bf-bob" style={{ animationDelay: `${i * -0.7}s` }}>
            <Butterfly hue={i % 2 ? 'blush' : 'gold'} />
          </div>
        </div>
      ))}
    </div>
  )
}
