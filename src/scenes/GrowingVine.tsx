import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Leaf, RoseHead, Hydrangea } from '../components/garden/botanical'
import { prefersReducedMotion } from '../lib/motion'

const PATHS = [
  'M100 0 C 40 70 160 140 100 210 S 40 350 100 420',
  'M100 0 C 160 80 40 140 100 220 S 160 340 100 420',
]
const LEAVES = [0.1, 0.2, 0.31, 0.42, 0.52, 0.62, 0.72, 0.82]
const BLOOMS = [0.27, 0.57, 0.88]

/**
 * Between sections on the scroll page: a pencil vine grows as you scroll,
 * leaves unfurl along it and small blossoms open.
 */
export function GrowingVine({ variant = 0 }: { variant?: 0 | 1 }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const svg = root.current!.querySelector('svg')!
      const path = svg.querySelector<SVGPathElement>('.vine')!
      const len = path.getTotalLength()
      const place = (els: SVGGElement[], ts: number[], flip: boolean) =>
        els.forEach((el, i) => {
          const p = path.getPointAtLength(len * ts[i])
          const p2 = path.getPointAtLength(Math.min(len, len * ts[i] + 1))
          const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI
          el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${flip ? ang + (i % 2 ? -60 : 60) + 90 : 0})`)
        })
      const leaves = gsap.utils.toArray<SVGGElement>('.vleaf', svg)
      const blooms = gsap.utils.toArray<SVGGElement>('.vbloom', svg)
      place(leaves, LEAVES, true)
      place(blooms, BLOOMS, false)
      if (prefersReducedMotion()) return

      const inner = [...leaves, ...blooms].map((l) => l.firstElementChild as SVGGElement)
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(inner, { scale: 0, transformOrigin: '50% 50%' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'bottom 45%', scrub: 0.8 } })
      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
      leaves.forEach((_, i) => tl.to(inner[i], { scale: 1, duration: 0.1, ease: 'back.out(2)' }, LEAVES[i] * 0.95))
      blooms.forEach((_, i) => tl.to(inner[leaves.length + i], { scale: 1, duration: 0.12, ease: 'back.out(1.8)' }, BLOOMS[i] * 0.95))
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative flex h-[20svh] min-h-[130px] justify-center" aria-hidden>
      <svg viewBox="0 0 200 420" className="h-full w-auto overflow-visible">
        <path className="vine" d={PATHS[variant]} fill="none" stroke="#6b7a8c" strokeWidth="1.4" strokeLinecap="round" filter="url(#pencil)" />
        {LEAVES.map((_, i) => (
          <g key={i} className="vleaf"><g><Leaf w={7} l={22} fill={i % 2 ? 'url(#g-leaf)' : 'url(#g-leaf-light)'} /></g></g>
        ))}
        {BLOOMS.map((_, i) => (
          <g key={i} className="vbloom">
            <g>{i === 1 ? <Hydrangea r={9} seed={i} /> : <RoseHead r={7} tone={i ? 'peach' : 'mauve'} seed={i + 4} />}</g>
          </g>
        ))}
      </svg>
    </div>
  )
}
