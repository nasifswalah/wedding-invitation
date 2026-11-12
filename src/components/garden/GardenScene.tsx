import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Cluster } from './Cluster'
import { HangingStrands } from './HangingStrands'
import { Butterflies } from './Butterflies'
import { Leaf } from './botanical'
import { useSway } from './useSway'
import { prefersReducedMotion } from '../../lib/motion'

function Hills() {
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[34%] w-full" aria-hidden>
      <path d="M0 160 C 200 90 380 140 560 110 C 760 76 940 130 1200 96 L1200 300 L0 300Z" fill="url(#g-hill-back)" opacity={0.8} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 131) % 1200} cy={150 + ((i * 53) % 90)} r={2 + (i % 3)} fill={i % 3 === 0 ? '#8e3344' : i % 3 === 1 ? '#7a2a38' : '#f6e7d6'} opacity={0.75} />
      ))}
      <path d="M0 220 C 240 170 420 230 640 196 C 860 162 1010 210 1200 184 L1200 300 L0 300Z" fill="url(#g-hill-front)" opacity={0.7} />
    </svg>
  )
}

function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="ray" style={{ left: '-10%', width: '38%', animationDelay: '0s' }} />
      <div className="ray" style={{ left: '12%', width: '22%', animationDelay: '-3s', opacity: 0.7 }} />
      <div className="ray" style={{ left: '30%', width: '30%', animationDelay: '-6s', opacity: 0.5 }} />
      <div
        className="absolute -left-[20%] -top-[25%] h-[70%] w-[90%] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(233,201,166,0.14), rgba(233,201,166,0))' }}
      />
    </div>
  )
}

/** Big soft out-of-focus leaves in the very front for depth of field. */
function FrontLeaf({ side, top, rot, size, phase }: { side: 'left' | 'right'; top: string; rot: number; size: number; phase: number }) {
  const ref = useSway<HTMLDivElement>({ amp: side === 'left' ? 3 : -3, phase, stiffness: 1.8, bias: 0, origin: side === 'left' ? '0% 100%' : '100% 100%' })
  return (
    <div
      className="pointer-events-none absolute"
      style={{ [side]: `-${size * 0.25}px`, top, width: size, height: size * 1.6, filter: 'blur(3px)', opacity: 0.55 }}
    >
      <div ref={ref} className="h-full w-full">
        <svg viewBox="-30 -100 60 100" className="h-full w-full" style={{ transform: `rotate(${rot}deg)`, overflow: 'visible' }}>
          <Leaf w={26} l={98} fill="url(#g-leaf-dark)" />
        </svg>
      </div>
    </div>
  )
}

/**
 * The living garden behind the hero. Layers at three depths move with
 * slight parallax on scroll and pointer, while the wind animates every plant.
 */
export function GardenScene() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]')
      layers.forEach((el) => {
        const d = Number(el.dataset.depth)
        gsap.to(el, {
          yPercent: d * 18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      // gentle pointer parallax on desktop
      if (window.matchMedia('(pointer: fine)').matches) {
        const movers = layers.map((el) => ({ d: Number(el.dataset.depth), x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }) }))
        const onMove = (e: PointerEvent) => {
          const u = e.clientX / window.innerWidth - 0.5
          movers.forEach((m) => m.x(-u * (12 + 30 * (1 - m.d))))
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #431420 0%, #3a0f19 50%, #2e0c14 100%)' }} />
      <LightRays />
      <div data-depth="0.9" className="absolute inset-0">
        <Hills />
      </div>
      <div data-depth="0.45" className="absolute inset-x-0 bottom-0 flex justify-between">
        <Cluster variant="a" className="-mb-2 -ml-6 w-[52vw] max-w-[380px] sm:w-[40vw]" />
        <Cluster variant="b" mirror className="-mb-2 -mr-6 w-[52vw] max-w-[380px] sm:w-[40vw]" />
      </div>
      <div data-depth="0.2" className="absolute inset-x-0 top-0">
        <HangingStrands />
      </div>
      <Butterflies count={2} />
      <div data-depth="0.05" className="absolute inset-0">
        <FrontLeaf side="left" top="66%" rot={34} size={96} phase={1} />
        <FrontLeaf side="right" top="72%" rot={-30} size={110} phase={3} />
      </div>
    </div>
  )
}
