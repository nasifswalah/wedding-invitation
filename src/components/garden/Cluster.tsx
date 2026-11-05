import { Blade, Leaf, Plant, SwayG, type PlantProps } from './botanical'

type P = Omit<PlantProps, 'dir'>

/** Two hand-composed bouquets so the left and right sides never look mirrored copies. */
const LAYOUTS: Record<'a' | 'b', { back: P[]; mid: P[]; blades: [number, number, number][] }> = {
  a: {
    back: [
      { x: 38, y: 560, h: 420, bend: 34, kind: 'spray', size: 15, leaves: 2, amp: 4, phase: 0.2 },
      { x: 96, y: 560, h: 365, bend: 48, kind: 'ivory', size: 19, leaves: 3, amp: 4.5, phase: 1.4 },
      { x: 150, y: 560, h: 300, bend: 62, kind: 'spray', size: 12, leaves: 1, amp: 5, phase: 2.6 },
    ],
    mid: [
      { x: 48, y: 560, h: 310, bend: 28, kind: 'rose', size: 24, leaves: 3, amp: 4, phase: 3.1 },
      { x: 120, y: 560, h: 245, bend: 52, kind: 'jasmine', size: 15, leaves: 2, amp: 6, phase: 4.2 },
      { x: 16, y: 560, h: 215, bend: 14, kind: 'rose', size: 27, leaves: 2, amp: 3.5, phase: 5.3 },
      { x: 168, y: 560, h: 190, bend: 58, kind: 'bud', size: 17, leaves: 2, amp: 6.5, phase: 6.1 },
      { x: 80, y: 560, h: 170, bend: 36, kind: 'jasmine', size: 13, leaves: 1, amp: 6, phase: 7.4 },
      { x: 205, y: 560, h: 120, bend: 44, kind: 'spray', size: 10, leaves: 1, amp: 7, phase: 8.2 },
    ],
    blades: [[6, 150, 10], [26, 120, 22], [60, 165, 30], [88, 110, 26], [112, 140, 38], [140, 95, 40], [176, 80, 34], [222, 60, 28], [250, 44, 20]],
  },
  b: {
    back: [
      { x: 60, y: 560, h: 400, bend: 40, kind: 'ivory', size: 18, leaves: 3, amp: 4, phase: 9.1 },
      { x: 20, y: 560, h: 350, bend: 20, kind: 'spray', size: 14, leaves: 2, amp: 4.5, phase: 10.3 },
      { x: 128, y: 560, h: 320, bend: 66, kind: 'spray', size: 13, leaves: 1, amp: 5, phase: 11.2 },
    ],
    mid: [
      { x: 30, y: 560, h: 280, bend: 22, kind: 'rose', size: 25, leaves: 3, amp: 4, phase: 12.4 },
      { x: 98, y: 560, h: 260, bend: 46, kind: 'rose', size: 19, leaves: 2, amp: 4.5, phase: 13.5 },
      { x: 150, y: 560, h: 200, bend: 60, kind: 'jasmine', size: 15, leaves: 2, amp: 6, phase: 14.6 },
      { x: 64, y: 560, h: 185, bend: 30, kind: 'bud', size: 18, leaves: 2, amp: 6, phase: 15.7 },
      { x: 188, y: 560, h: 130, bend: 50, kind: 'jasmine', size: 12, leaves: 1, amp: 7, phase: 16.1 },
      { x: 8, y: 560, h: 150, bend: 8, kind: 'bud', size: 14, leaves: 1, amp: 6, phase: 17.2 },
    ],
    blades: [[4, 130, 8], [36, 160, 24], [72, 115, 30], [100, 150, 40], [130, 100, 36], [160, 85, 42], [196, 70, 30], [236, 50, 24]],
  },
}

export function Cluster({ variant = 'a', mirror = false, className = '', dusk = false }: { variant?: 'a' | 'b'; mirror?: boolean; className?: string; dusk?: boolean }) {
  const L = LAYOUTS[variant]
  const dir = (mirror ? -1 : 1) as 1 | -1
  return (
    <svg
      viewBox="0 0 320 560"
      className={className}
      style={{ transform: mirror ? 'scaleX(-1)' : undefined, overflow: 'visible', filter: dusk ? 'saturate(0.8) brightness(0.92)' : undefined }}
      aria-hidden
    >
      <g opacity={0.55}>
        {L.back.map((p, i) => <Plant key={`b${i}`} {...p} size={(p.size ?? 15) * 1.4} dir={dir} />)}
      </g>
      {L.blades.map(([x, h, b], i) => (
        <g key={`g${i}`} transform={`translate(${x} 562)`}>
          <SwayG amp={7 * dir} phase={i * 0.8} stiffness={3.5}>
            <Blade h={h} bend={b} fill={i % 3 === 0 ? 'url(#g-leaf-light)' : i % 3 === 1 ? 'url(#g-leaf)' : 'url(#g-leaf-dark)'} />
          </SwayG>
        </g>
      ))}
      {L.mid.map((p, i) => <Plant key={`m${i}`} {...p} size={(p.size ?? 15) * 1.5} dir={dir} />)}
      {/* low foliage hugging the ground */}
      {[[-10, -70], [30, -40], [70, -55], [120, -30], [170, -60]].map(([x, a], i) => (
        <g key={`l${i}`} transform={`translate(${x} 566) rotate(${a + 90 * (i % 2 ? 0.35 : 0.6)})`}>
          <SwayG amp={3 * dir} phase={20 + i} stiffness={4}>
            <Leaf w={16} l={58} fill={i % 2 ? 'url(#g-leaf-dark)' : 'url(#g-leaf)'} />
          </SwayG>
        </g>
      ))}
    </svg>
  )
}
