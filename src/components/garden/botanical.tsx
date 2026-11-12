import type { ReactNode } from 'react'
import { useSway } from './useSway'
import type { SwayOptions } from './wind'
import { seeded } from '../../lib/motion'

/**
 * Hand-built botanical parts. Every part is drawn with its pivot at local (0,0)
 * — stems at their base, strands at their hook — so the wind can rotate them
 * exactly where a real plant or hanging strand would bend.
 */

export function SwayG({ children, ...opts }: SwayOptions & { children: ReactNode }) {
  const ref = useSway<SVGGElement>(opts)
  return <g ref={ref}>{children}</g>
}

const petalPath = (w: number, l: number) =>
  `M0 0 C ${w} ${-l * 0.2} ${w * 1.15} ${-l * 0.82} 0 ${-l} C ${-w * 1.15} ${-l * 0.82} ${-w} ${-l * 0.2} 0 0Z`

export const leafPath = (w: number, l: number) =>
  `M0 0 C ${w} ${-l * 0.18} ${w * 0.95} ${-l * 0.7} 0 ${-l} C ${-w * 0.75} ${-l * 0.68} ${-w * 0.9} ${-l * 0.2} 0 0Z`

export function Leaf({ w = 9, l = 30, fill = 'url(#g-leaf)', vein = true }: { w?: number; l?: number; fill?: string; vein?: boolean }) {
  return (
    <g>
      <path d={leafPath(w, l)} fill={fill} />
      {vein && <path d={`M0 0 Q ${w * 0.12} ${-l * 0.5} 0 ${-l * 0.94}`} stroke="#c9cfae" strokeOpacity={0.45} strokeWidth={0.7} fill="none" />}
    </g>
  )
}

export type RoseTone = 'mauve' | 'peach' | 'ivory'
const ROSE: Record<RoseTone, { petal: string; core: string; edge: string }> = {
  mauve: { petal: 'url(#g-mauve-petal)', core: 'url(#g-mauve-core)', edge: '#4a1018' },
  peach: { petal: 'url(#g-peach-petal)', core: 'url(#g-peach-core)', edge: '#b97458' },
  ivory: { petal: 'url(#g-ivory-petal)', core: 'url(#g-ivory-core)', edge: '#bba98b' },
}

/** Face-on garden rose: three rings of shaded petals around a cupped, spiralled heart. */
export function RoseHead({ r = 14, tone = 'mauve', seed = 1 }: { r?: number; tone?: RoseTone; seed?: number }) {
  const c = ROSE[tone]
  const rnd = seeded(seed * 97 + 13)
  const ring = (n: number, w: number, l: number, off: number, op: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = off + (360 / n) * i + (rnd() - 0.5) * 14
      const s = 0.9 + rnd() * 0.2
      return (
        <path key={`${l}-${i}`} d={petalPath(w * s, l * s)} transform={`rotate(${a.toFixed(1)})`}
          fill={c.petal} stroke={c.edge} strokeOpacity={op} strokeWidth={0.45} />
      )
    })
  return (
    <g>
      {ring(6, r * 0.55, r, 0, 0.18)}
      {ring(5, r * 0.5, r * 0.78, 30, 0.22)}
      {ring(5, r * 0.42, r * 0.56, 12, 0.28)}
      <circle r={r * 0.36} fill={c.core} />
      <path
        d={`M ${-r * 0.22} ${r * 0.04} C ${-r * 0.24} ${-r * 0.22} ${r * 0.2} ${-r * 0.26} ${r * 0.2} ${r * 0.02} C ${r * 0.2} ${r * 0.2} ${-r * 0.08} ${r * 0.22} ${-r * 0.1} ${r * 0.02} C ${-r * 0.1} ${-r * 0.1} ${r * 0.08} ${-r * 0.1} ${r * 0.06} ${r * 0.04}`}
        fill="none" stroke={c.edge} strokeOpacity={0.6} strokeWidth={0.7} strokeLinecap="round"
      />
    </g>
  )
}

/** Rose with sepals, pivot at the stem joint (for upright stems). */
export function Rose({ r = 16, tone = 'mauve', seed }: { r?: number; tone?: RoseTone; seed?: number }) {
  return (
    <g>
      {[-50, 0, 50].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={leafPath(r * 0.16, r * 0.55)} fill="url(#g-leaf)" />
        </g>
      ))}
      <g transform={`translate(0 ${-r * 0.95})`}>
        <RoseHead r={r} tone={tone} seed={seed ?? Math.round(r * 7)} />
      </g>
    </g>
  )
}

/** Four-petal floret as one path (keeps the DOM light). */
function floretPath(s: number) {
  const pts: string[] = []
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2
    const rot = (x: number, y: number) => {
      const cx = x * Math.cos(a) - y * Math.sin(a)
      const cy = x * Math.sin(a) + y * Math.cos(a)
      return `${cx.toFixed(2)} ${cy.toFixed(2)}`
    }
    pts.push(`M0 0 C ${rot(s * 0.55, -s * 0.15)} ${rot(s * 0.6, -s * 0.85)} ${rot(0, -s)} C ${rot(-s * 0.6, -s * 0.85)} ${rot(-s * 0.55, -s * 0.15)} 0 0Z`)
  }
  return pts.join(' ')
}

/** Hydrangea head: a dome of small four-petal florets, lighter at the top. */
export function Hydrangea({ r = 16, tone = 'blue', seed = 1 }: { r?: number; tone?: 'blue' | 'lilac'; seed?: number }) {
  const rnd = seeded(seed * 31 + 7)
  const fill = tone === 'blue' ? 'url(#g-hydra-blue)' : 'url(#g-hydra-lilac)'
  const edge = tone === 'blue' ? '#8a5a50' : '#6a2a36'
  const n = 15
  const florets = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n
    const rad = Math.sqrt(t) * r * 0.82
    const ang = i * 2.39996
    return { x: Math.cos(ang) * rad, y: Math.sin(ang) * rad, s: r * (0.36 - t * 0.1), rot: rnd() * 90 }
  })
  return (
    <g>
      <circle r={r * 0.95} fill={tone === 'blue' ? '#b88a80' : '#8a4652'} opacity={0.9} />
      {florets.map((f, i) => (
        <g key={i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)})`}>
          <path d={floretPath(f.s)} fill={fill} stroke={edge} strokeOpacity={0.35} strokeWidth={0.35} />
          <circle r={f.s * 0.14} fill={edge} opacity={0.6} />
        </g>
      ))}
    </g>
  )
}

/** Trailing eucalyptus: hangs DOWN from (0,0) with paired round leaves. */
export function Eucalyptus({ length = 60, seed = 1, size = 1 }: { length?: number; seed?: number; size?: number }) {
  const rnd = seeded(seed * 17 + 3)
  const n = Math.max(3, Math.floor(length / 11))
  const bend = (rnd() - 0.5) * 14
  return (
    <g>
      <path d={`M0 0 Q ${bend} ${length * 0.5} ${bend * 0.4} ${length}`} stroke="#5f6b42" strokeWidth={0.9} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.6) / n
        const y = t * length
        const x = bend * 2 * t * (1 - t) + bend * 0.4 * t * t
        const rr = (5.2 - t * 2.4) * size
        const side = i % 2 ? 1 : -1
        return (
          <ellipse key={i} cx={x + side * rr * 0.9} cy={y} rx={rr} ry={rr * 0.85} fill="url(#g-euca)" stroke="#4f5a36" strokeOpacity={0.3} strokeWidth={0.4}
            transform={`rotate(${side * 20} ${x} ${y})`} />
        )
      })}
    </g>
  )
}

/** Baby's breath: little ivory dots on fine stems (drawn hanging or upright by `dir`). */
export function Spray({ r = 14, dir = -1 }: { r?: number; dir?: 1 | -1 }) {
  const tips = [[-0.9, 1.6], [-0.4, 2.1], [0.2, 2.3], [0.8, 1.8], [1.1, 1.2], [-1.2, 1.0]]
  return (
    <g>
      {tips.map(([tx, ty], i) => (
        <g key={i}>
          <path d={`M0 0 Q ${tx * r * 0.3} ${-dir * ty * r * 0.5} ${tx * r} ${-dir * ty * r}`} stroke="#7a8456" strokeWidth={0.6} fill="none" />
          <circle cx={tx * r} cy={-dir * ty * r} r={r * 0.15} fill="#f6e7d6" stroke="#c9ab8c" strokeWidth={0.35} />
          <circle cx={tx * r * 0.7} cy={-dir * ty * r * 0.72} r={r * 0.1} fill="#f6e7d6" />
        </g>
      ))}
    </g>
  )
}

export function Bud({ r = 8, fill = 'url(#g-mauve-petal)' }: { r?: number; fill?: string }) {
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


export function Jasmine({ r = 9 }: { r?: number }) {
  return (
    <g>
      <path d={`M0 0 L0 ${-r * 0.6}`} stroke="#5f6b42" strokeWidth={1.1} />
      <g transform={`translate(0 ${-r * 1.4})`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d={petalPath(r * 0.3, r)} transform={`rotate(${a})`} fill="url(#g-jasmine)" stroke="#ddd5c6" strokeWidth={0.4} />
        ))}
        <circle r={r * 0.17} fill="url(#g-center)" />
      </g>
    </g>
  )
}

export function Blade({ h = 80, bend = 14, w = 2.6, fill = 'url(#g-leaf)' }: { h?: number; bend?: number; w?: number; fill?: string }) {
  return <path d={`M${-w} 0 Q ${bend * 0.35 - w * 0.3} ${-h * 0.55} ${bend} ${-h} Q ${bend * 0.35 + w * 0.4} ${-h * 0.55} ${w} 0 Z`} fill={fill} />
}

type FlowerKind = 'rose' | 'peach' | 'ivory' | 'hydrangea' | 'jasmine' | 'bud' | 'spray'

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
    case 'rose': return <Rose r={size} tone="mauve" />
    case 'peach': return <Rose r={size} tone="peach" />
    case 'ivory': return <Rose r={size} tone="ivory" />
    case 'hydrangea': return <g transform={`translate(0 ${-size})`}><Hydrangea r={size} /></g>
    case 'jasmine': return <Jasmine r={size * 0.7} />
    case 'bud': return <Bud r={size * 0.55} />
    case 'spray': return <Spray r={size} dir={1} />
  }
}

/** A full upright stem: base sway → leaves flutter → head lags behind (secondary motion). */
export function Plant({ x, y, h, bend = 0, kind = 'rose', size = 15, leaves = 2, dir = 1, amp = 5, phase = 0, scale = 1 }: PlantProps) {
  const tip = quad(1, h, bend)
  const leafTs = Array.from({ length: leaves }, (_, i) => 0.22 + (i * 0.55) / Math.max(1, leaves - 1 || 1))
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <SwayG amp={amp * dir} phase={phase} stiffness={2.2}>
        <path d={`M0 0 Q ${bend * 0.9} ${-h * 0.5} ${bend} ${-h}`} stroke="#4f5a36" strokeWidth={2.2} fill="none" strokeLinecap="round" />
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
