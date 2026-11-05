import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Leaf, Rose } from '../garden/botanical'
import { prefersReducedMotion } from '../../lib/motion'

const PATH = 'M100 0 C 40 70 160 140 100 210 S 40 350 100 420 S 160 520 100 600'
const LEAVES = [0.08, 0.16, 0.26, 0.35, 0.44, 0.53, 0.62, 0.71, 0.8, 0.88]

/**
 * Hero → Date: a gold-stemmed vine grows down the page as you scroll,
 * leaves unfurl along it, and a rose blooms where the date card begins.
 */
export function VineTransition() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const svg = root.current!.querySelector('svg')!
      const path = svg.querySelector<SVGPathElement>('.vine')!
      const len = path.getTotalLength()
      const leaves = gsap.utils.toArray<SVGGElement>('.vleaf', svg)
      leaves.forEach((el, i) => {
        const t = LEAVES[i]
        const p = path.getPointAtLength(len * t)
        const p2 = path.getPointAtLength(Math.min(len, len * t + 1))
        const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI
        el.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${ang + (i % 2 ? -60 : 60) + 90})`)
      })
      const inner = leaves.map((l) => l.firstElementChild as SVGGElement)
      const bloom = svg.querySelector('.vbloom')!

      if (prefersReducedMotion()) return

      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(inner, { scale: 0, transformOrigin: '50% 100%' })
      gsap.set(bloom, { scale: 0, rotate: -90, transformOrigin: '50% 50%' })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.8 },
      })
      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
      inner.forEach((el, i) => tl.to(el, { scale: 1, duration: 0.12, ease: 'back.out(2)' }, LEAVES[i] * 0.95))
      tl.to(bloom, { scale: 1, rotate: 0, duration: 0.15, ease: 'back.out(1.6)' }, 0.86)
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative -mt-[8svh] flex h-[46svh] min-h-[300px] justify-center" aria-hidden>
      <svg viewBox="0 0 200 640" className="h-full w-auto" style={{ overflow: 'visible' }}>
        <path className="vine" d={PATH} fill="none" stroke="url(#g-gold)" strokeWidth="2.2" strokeLinecap="round" />
        {LEAVES.map((_, i) => (
          <g key={i} className="vleaf">
            <g>
              <Leaf w={9} l={30} fill={i % 2 ? 'url(#g-leaf)' : 'url(#g-leaf-light)'} />
            </g>
          </g>
        ))}
        <g transform="translate(100 618)">
          <g className="vbloom">
            <g transform="translate(0 16)">
              <Rose r={20} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
