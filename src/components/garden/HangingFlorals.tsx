import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Eucalyptus, Hydrangea, RoseHead, Spray, SwayG, type RoseTone } from './botanical'
import { seeded } from '../../lib/motion'

/**
 * Stage-style hanging flower installation: a dense floral ceiling with cascading
 * strands — long at the sides, short in the middle — framing the couple.
 * Each strand is a 3-joint chain, so wind bends it like a rope rather than a stick.
 */

type Item =
  | { k: 'hyd'; y: number; x: number; r: number; tone: 'blue' | 'lilac'; seed: number }
  | { k: 'rose'; y: number; x: number; r: number; tone: RoseTone; seed: number }
  | { k: 'spray'; y: number; x: number; r: number }
  | { k: 'euca'; y: number; x: number; len: number; seed: number; flip: boolean }

function strandItems(len: number, seed: number, lite: boolean): Item[] {
  const rnd = seeded(seed)
  const items: Item[] = []
  let y = 6
  while (y < len) {
    const roll = rnd()
    const x = (rnd() - 0.5) * 6
    if (roll < 0.36) {
      const r = 8 + rnd() * 4
      items.push({ k: 'hyd', y: y + r * 0.6, x, r, tone: rnd() < 0.7 ? 'blue' : 'lilac', seed: Math.floor(rnd() * 999) })
      y += r * 1.35
    } else if (roll < 0.72) {
      const r = 5.5 + rnd() * 3.5
      const t = rnd()
      items.push({ k: 'rose', y: y + r * 0.6, x, r, tone: t < 0.45 ? 'mauve' : t < 0.8 ? 'peach' : 'ivory', seed: Math.floor(rnd() * 999) })
      y += r * 1.55
    } else if (roll < 0.86 && !lite) {
      items.push({ k: 'spray', y, x: x * 2, r: 6 + rnd() * 3 })
      y += 9
    } else {
      items.push({ k: 'euca', y, x, len: 18 + rnd() * 18, seed: Math.floor(rnd() * 999), flip: rnd() < 0.5 })
      y += 8
    }
  }
  return items
}

function ItemView({ it, lite }: { it: Item; lite: boolean }) {
  switch (it.k) {
    case 'hyd':
      return <g transform={`translate(${it.x} ${it.y})`}>{lite ? <circle r={it.r} fill={it.tone === 'blue' ? '#b9cad7' : '#d6bfcc'} /> : <Hydrangea r={it.r} tone={it.tone} seed={it.seed} />}</g>
    case 'rose':
      return <g transform={`translate(${it.x} ${it.y})`}>{lite ? <circle r={it.r} fill={it.tone === 'mauve' ? '#d7a8b3' : it.tone === 'peach' ? '#f2c9b4' : '#f6efe4'} /> : <RoseHead r={it.r} tone={it.tone} seed={it.seed} />}</g>
    case 'spray':
      return <g transform={`translate(${it.x} ${it.y})`}><Spray r={it.r} dir={-1} /></g>
    case 'euca':
      return <g transform={`translate(${it.x} ${it.y}) rotate(${it.flip ? 18 : -18})`}><Eucalyptus length={it.len} seed={it.seed} size={0.8} /></g>
  }
}

/** One hanging strand built as a chain of joints. */
function Strand({ x, y, len, seed, phase, lite }: { x: number; y: number; len: number; seed: number; phase: number; lite: boolean }) {
  const items = useMemo(() => strandItems(len, seed, lite), [len, seed, lite])
  const joints = 3
  const seg = len / joints
  const bySeg = (s: number) => items.filter((it) => it.y >= s * seg && (s === joints - 1 || it.y < (s + 1) * seg))

  const build = (s: number): ReactNode => {
    if (s >= joints) return null
    const local = bySeg(s).map((it) => ({ ...it, y: it.y - s * seg }))
    return (
      <SwayG amp={2.2 + s * 1.1} phase={phase + s * 0.55} stiffness={1.6 - s * 0.35}>
        <line x1={0} y1={0} x2={0} y2={seg} stroke="#8a9a8f" strokeOpacity={0.5} strokeWidth={0.5} />
        {local.map((it, i) => <ItemView key={i} it={it} lite={lite} />)}
        <g transform={`translate(0 ${seg})`}>{build(s + 1)}</g>
      </SwayG>
    )
  }

  return (
    <g transform={`translate(${x.toFixed(1)} ${y})`}>
      <g className="strand">{build(0)}</g>
    </g>
  )
}

/** Dense floral ceiling the strands hang from. */
function Ceiling({ w }: { w: number }) {
  const rnd = seeded(77)
  const items: ReactNode[] = []
  for (let x = -10, i = 0; x < w + 20; x += 15, i++) {
    const roll = rnd()
    const y = 6 + rnd() * 12
    if (roll < 0.45) items.push(<g key={i} transform={`translate(${x} ${y})`}><Hydrangea r={11 + rnd() * 5} tone={rnd() < 0.75 ? 'blue' : 'lilac'} seed={i} /></g>)
    else if (roll < 0.8) items.push(<g key={i} transform={`translate(${x} ${y + 4})`}><RoseHead r={8 + rnd() * 4} tone={rnd() < 0.5 ? 'mauve' : rnd() < 0.6 ? 'peach' : 'ivory'} seed={i} /></g>)
    else items.push(<g key={i} transform={`translate(${x} ${y})`}><Eucalyptus length={26} seed={i} /></g>)
  }
  return (
    <g>
      <rect x={0} y={-4} width={w} height={12} fill="#a9bbb1" opacity={0.6} />
      {items}
    </g>
  )
}

export function HangingFlorals({ className = '', heightRatio = 0.46 }: { className?: string; heightRatio?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  // sized synchronously so the strands exist when the scene builds its timeline
  const [size, setSize] = useState(() => ({ w: document.documentElement.clientWidth, h: window.innerHeight }))

  useEffect(() => {
    const el = ref.current!
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.round(e.contentRect.width), h: Math.round(window.innerHeight) }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w } = size
  const H = Math.round(Math.min(560, Math.max(260, size.h * heightRatio)))
  const gap = w < 500 ? 24 : 30
  const n = w ? Math.floor(w / gap) + 1 : 0
  const off = (w - (n - 1) * gap) / 2

  const lenAt = (x: number, jitter: number) => {
    const u = Math.abs((x / w) * 2 - 1) // 0 centre … 1 edge
    const shape = u < 0.2 ? 0.16 : 0.16 + 0.84 * Math.pow((u - 0.2) / 0.8, 1.3)
    return H * shape * (0.85 + jitter * 0.3)
  }

  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden>
      {w > 0 && (
        <>
          {/* back layer: smaller, simpler, softer */}
          <svg width={w} height={H + 30} className="absolute inset-x-0 top-0" style={{ overflow: 'visible', opacity: 0.7 }}>
            {Array.from({ length: n }, (_, i) => {
              const x = off + i * gap + gap / 2
              const rnd = seeded(i * 13 + 5)
              return <Strand key={i} x={x} y={10} len={lenAt(x, rnd()) * 0.8} seed={i * 7 + 300} phase={i * 0.6 + 2} lite />
            })}
          </svg>
          {/* main layer */}
          <svg width={w} height={H + 40} className="absolute inset-x-0 top-0" style={{ overflow: 'visible' }}>
            {Array.from({ length: n }, (_, i) => {
              const x = off + i * gap
              const rnd = seeded(i * 29 + 11)
              return <Strand key={i} x={x} y={14} len={lenAt(x, rnd())} seed={i * 11 + 1} phase={i * 0.55} lite={false} />
            })}
            <Ceiling w={w} />
          </svg>
          {/* front layer: a couple of big out-of-focus strands at the edges */}
          <svg width={w} height={H + 60} className="absolute inset-x-0 top-0" style={{ overflow: 'visible', filter: 'blur(1.6px)' }}>
            {[-6, 14, w - 14, w + 6].map((x, i) => (
              <g key={i} transform={`scale(1.3) translate(${(x / 1.3 - x).toFixed(1)} 0)`}>
                <Strand x={x} y={4} len={H * (0.85 + (i % 2) * 0.15) / 1.3} seed={900 + i} phase={i * 1.3 + 5} lite={false} />
              </g>
            ))}
          </svg>
        </>
      )}
    </div>
  )
}
