import type { ReactNode } from 'react'
import { useSway } from './useSway'
import type { SwayOptions } from './wind'

/**
 * Hand-built botanical parts. Every part is drawn with its pivot at local (0,0)
 * — stems at their base, leaves at their joint, garlands at their hook — so the
 * wind can rotate them exactly where a real plant would bend.
 */

export function SwayG({ children, ...opts }: SwayOptions & { children: ReactNode }) {
  const ref = useSway<SVGGElement>(opts)
  return <g ref={ref}>{children}</g>
}

const petalPath = (w: number, l: number) =>
  `M0 0 C ${w} ${-l * 0.2} ${w * 1.15} ${-l * 0.82} 0 ${-l} C ${-w * 1.15} ${-l * 0.82} ${-w} ${-l * 0.2} 0 0Z`

const leafPath = (w: number, l: number) =>
  `M0 0 C ${w} ${-l * 0.18} ${w * 0.95} ${-l * 0.7} 0 ${-l} C ${-w * 0.75} ${-l * 0.68} ${-w * 0.9} ${-l * 0.2} 0 0Z`

export function Leaf({ w = 9, l = 30, fill = 'url(#g-leaf)', vein = true }: { w?: number; l?: number; fill?: string; vein?: boolean }) {
  return (
    <g>
      <path d={leafPath(w, l)} fill={fill} />
      {vein && <path d={`M0 0 Q ${w * 0.12} ${-l * 0.5} 0 ${-l * 0.94}`} stroke="#e9eedb" strokeOpacity={0.45} strokeWidth={0.7} fill="none" />}
    </g>
  )
}

export function Rose({ r = 16, tone = 'blush' }: { r?: number; tone?: 'blush' | 'ivory' }) {
  const petal = tone === 'blush' ? 'url(#g-rose-petal)' : 'url(#g-ivory-petal)'
  const core = tone === 'blush' ? 'url(#g-rose)' : 'url(#g-ivory-petal)'
  const edge = tone === 'blush' ? '#c47d6f' : '#cdbb94'
  const cy = -r * 0.95
  return (
    <g>
      {/* sepals */}
      {[-50, 0, 50].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={leafPath(r * 0.16, r * 0.55)} fill="url(#g-leaf)" />
        </g>
      ))}
      <g transform={`translate(0 ${cy})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={petalPath(r * 0.52, r)} transform={`rotate(${a + 18})`} fill={petal} stroke={edge} strokeOpacity={0.25} strokeWidth={0.5} />
        ))}
        {[36, 108, 180, 252, 324].map((a) => (
          <path key={a} d={petalPath(r * 0.42, r * 0.72)} transform={`rotate(${a})`} fill={petal} stroke={edge} strokeOpacity={0.3} strokeWidth={0.5} />
        ))}
        <circle r={r * 0.42} fill={core} />
        <path
          d={`M ${-r * 0.25} 0 A ${r * 0.25} ${r * 0.25} 0 1 1 ${r * 0.12} ${r * 0.2} M ${-r * 0.1} ${-r * 0.05} A ${r * 0.12} ${r * 0.12} 0 1 1 ${r * 0.05} ${r * 0.08}`}
          fill="none" stroke={edge} strokeOpacity={0.55} strokeWidth={0.8} strokeLinecap="round"
        />
      </g>
    </g>
  )
}

export function Jasmine({ r = 9 }: { r?: number }) {
  return (
    <g>
      <path d={`M0 0 L0 ${-r * 0.6}`} stroke="#6f8a62" strokeWidth={1.2} />
      <g transform={`translate(0 ${-r * 1.4})`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d={petalPath(r * 0.3, r)} transform={`rotate(${a})`} fill="url(#g-jasmine)" stroke="#d9cfb2" strokeWidth={0.4} />
        ))}
        <circle r={r * 0.17} fill="url(#g-center)" />
      </g>
    </g>
  )
}

export function Bud({ r = 8, fill = 'url(#g-rose-petal)' }: { r?: number; fill?: string }) {
  return (
    <g>
      <path d={`M0 ${-r * 0.2} C ${r * 0.75} ${-r * 0.6} ${r * 0.5} ${-r * 1.7} 0 ${-r * 2.1} C ${-r * 0.5} ${-r * 1.7} ${-r * 0.75} ${-r * 0.6} 0 ${-r * 0.2}Z`} fill={fill} />
      {[-35, 35].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={leafPath(r * 0.28, r * 1.1)} fill="url(#g-leaf)" />
        </g>
      ))}
    </g>
  )
}

export function Blade({ h = 80, bend = 14, w = 2.6, fill = 'url(#g-leaf)' }: { h?: number; bend?: number; w?: number; fill?: string }) {
  return <path d={`M${-w} 0 Q ${bend * 0.35 - w * 0.3} ${-h * 0.55} ${bend} ${-h} Q ${bend * 0.35 + w * 0.4} ${-h * 0.55} ${w} 0 Z`} fill={fill} />
}

type FlowerKind = 'rose' | 'ivory' | 'jasmine' | 'bud' | 'spray'

export type PlantProps = {
  x: number
  y: number
  h: number
  bend?: number
  kind?: FlowerKind
  size?: number
  leaves?: number
  dir?: 1 | -1
  amp?: number
  phase?: number
  scale?: number
}

function quad(t: number, h: number, bend: number) {
  const p1x = bend * 0.9, p1y = -h * 0.5, p2x = bend, p2y = -h
  const x = 2 * (1 - t) * t * p1x + t * t * p2x
  const y = 2 * (1 - t) * t * p1y + t * t * p2y
  const dx = 2 * (1 - t) * p1x + 2 * t * (p2x - p1x)
  const dy = 2 * (1 - t) * p1y + 2 * t * (p2y - p1y)
  return { x, y, angle: (Math.atan2(dx, -dy) * 180) / Math.PI }
}

function Head({ kind, size }: { kind: FlowerKind; size: number }) {
  switch (kind) {
    case 'rose': return <Rose r={size} />
    case 'ivory': return <Rose r={size} tone="ivory" />
    case 'jasmine': return <Jasmine r={size * 0.7} />
    case 'bud': return <Bud r={size * 0.55} />
    case 'spray': return <Spray r={size} />
  }
}

/** A full stem: base sway → leaves flutter → head lags behind (secondary motion). */
export function Plant({ x, y, h, bend = 0, kind = 'rose', size = 15, leaves = 2, dir = 1, amp = 5, phase = 0, scale = 1 }: PlantProps) {
  const tip = quad(1, h, bend)
  const leafTs = Array.from({ length: leaves }, (_, i) => 0.22 + (i * 0.55) / Math.max(1, leaves - 1 || 1))
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <SwayG amp={amp * dir} phase={phase} stiffness={2.2}>
        <path d={`M0 0 Q ${bend * 0.9} ${-h * 0.5} ${bend} ${-h}`} stroke="#5d7556" strokeWidth={2.8} fill="none" strokeLinecap="round" />
        {leafTs.map((t, i) => {
          const p = quad(t, h, bend)
          const side = i % 2 === 0 ? 1 : -1
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.angle + side * 52})`}>
              <SwayG amp={amp * 1.6 * dir} phase={phase + i * 1.7} stiffness={5}>
                <Leaf w={size * 0.5} l={size * 1.7} fill={i % 3 === 1 ? 'url(#g-leaf-light)' : 'url(#g-leaf)'} />
              </SwayG>
            </g>
          )
        })}
        <g transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
          <SwayG amp={amp * 1.3 * dir} phase={phase + 0.9} stiffness={1.6}>
            <Head kind={kind} size={size} />
          </SwayG>
        </g>
      </SwayG>
    </g>
  )
}

/** Baby's-breath style filler spray */
export function Spray({ r = 14 }: { r?: number }) {
  const tips = [[-0.9, -1.6], [-0.4, -2.1], [0.2, -2.3], [0.8, -1.8], [1.1, -1.2], [-1.2, -1.0]]
  return (
    <g>
      {tips.map(([tx, ty], i) => (
        <g key={i}>
          <path d={`M0 0 Q ${tx * r * 0.3} ${ty * r * 0.5} ${tx * r} ${ty * r}`} stroke="#7d9470" strokeWidth={0.8} fill="none" />
          <circle cx={tx * r} cy={ty * r} r={r * 0.17} fill="#fffaf0" stroke="#e1d6bb" strokeWidth={0.4} />
          <circle cx={tx * r * 0.7} cy={ty * r * 0.72} r={r * 0.11} fill="#fffaf0" />
        </g>
      ))}
    </g>
  )
}

/** Kerala-style hanging jasmine (mulla) garland, pivot at the hook. */
export function Garland({ x, y, length, phase = 0, amp = 3.5 }: { x: number; y: number; length: number; phase?: number; amp?: number }) {
  const n = Math.floor(length / 11)
  return (
    <g transform={`translate(${x} ${y})`}>
      <SwayG amp={amp} phase={phase} stiffness={1.2} origin="50% 0%">
        <line x1={0} y1={0} x2={0} y2={length} stroke="#b8924a" strokeOpacity={0.55} strokeWidth={0.6} />
        {Array.from({ length: n }, (_, i) => {
          const yy = 8 + i * 11
          const rot = (i % 2 === 0 ? 1 : -1) * 22
          return (
            <g key={i} transform={`translate(0 ${yy}) rotate(${rot})`}>
              <ellipse rx={2.6} ry={5.2} fill="url(#g-jasmine)" stroke="#dcd2b6" strokeWidth={0.4} />
              <ellipse cx={0} cy={-4.6} rx={0.9} ry={1.2} fill="#9fb48f" />
            </g>
          )
        })}
        <g transform={`translate(0 ${length + 12}) rotate(180)`}>
          <Rose r={8} />
        </g>
      </SwayG>
    </g>
  )
}
