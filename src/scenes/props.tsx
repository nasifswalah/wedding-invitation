import { Hydrangea, RoseHead, Spray, Eucalyptus } from '../components/garden/botanical'

/**
 * Sketched wedding props shared by the scenes. Lines carry `.sk` (they draw in),
 * fills carry `.wash` (they bleed in afterwards). All are positioned by their base.
 */

const f = (n: number) => n.toFixed(1)

export function Palm({ x, y, h = 180, flip = false }: { x: number; y: number; h?: number; flip?: boolean }) {
  const d = flip ? -1 : 1
  const tx = x + d * h * 0.12, ty = y - h
  return (
    <g>
      <path className="sk" d={`M${x} ${y} C ${f(x - d * 4)} ${f(y - h * 0.4)} ${f(x + d * 2)} ${f(y - h * 0.75)} ${f(tx)} ${f(ty)} M${x + 6} ${y} C ${f(x + 2 - d * 4)} ${f(y - h * 0.4)} ${f(x + 8 + d * 2)} ${f(y - h * 0.75)} ${f(tx + 4)} ${f(ty + 2)}`} />
      <path className="sk sk-light" d={`M${x - 1} ${f(y - h * 0.2)} l7 -3 M${x - 2} ${f(y - h * 0.4)} l7 -3 M${x} ${f(y - h * 0.6)} l7 -3`} />
      <path className="sk" d={[[-58, 14], [-48, -22], [-14, -40], [26, -36], [54, -10], [60, 22], [-34, 28]]
        .map(([dx, dy]) => `M${f(tx)} ${f(ty)} C ${f(tx + dx * 0.3)} ${f(ty + dy * 0.6 - 14)} ${f(tx + dx * 0.75)} ${f(ty + dy - 8)} ${f(tx + dx)} ${f(ty + dy)}`).join(' ')} />
    </g>
  )
}

export function RoundTree({ x, y, r = 40 }: { x: number; y: number; r?: number }) {
  const cy = y - r * 1.9
  const blob = `M${f(x - r)} ${f(cy + r * 0.3)} C ${f(x - r * 1.3)} ${f(cy - r * 0.6)} ${f(x - r * 0.4)} ${f(cy - r * 1.2)} ${f(x)} ${f(cy - r * 0.9)} C ${f(x + r * 0.5)} ${f(cy - r * 1.3)} ${f(x + r * 1.3)} ${f(cy - r * 0.5)} ${f(x + r)} ${f(cy + r * 0.2)} C ${f(x + r * 1.2)} ${f(cy + r * 0.9)} ${f(x + r * 0.3)} ${f(cy + r * 1.1)} ${f(x)} ${f(cy + r * 0.8)} C ${f(x - r * 0.5)} ${f(cy + r * 1.1)} ${f(x - r * 1.2)} ${f(cy + r * 0.9)} ${f(x - r)} ${f(cy + r * 0.3)} Z`
  return (
    <g>
      <path className="wash" d={blob} fill="#cbd8d0" opacity="0.55" filter="url(#wash)" />
      <path className="sk" d={blob} />
      <path className="sk" d={`M${x - 3} ${y} L${f(x - 2)} ${f(cy + r * 0.7)} M${x + 4} ${y} L${f(x + 3)} ${f(cy + r * 0.7)} M${x} ${f(cy + r * 0.9)} l-10 -12 M${x + 1} ${f(cy + r * 0.95)} l10 -10`} />
    </g>
  )
}

/** Tall pedestal with a ball of flowers — lines an aisle or frames an arch. */
export function FlowerStand({ x, y, h = 70, s = 1 }: { x: number; y: number; h?: number; s?: number }) {
  return (
    <g>
      <path className="sk" d={`M${f(x - 8 * s)} ${y} L${f(x + 8 * s)} ${y} M${f(x - 5 * s)} ${y} L${f(x - 2 * s)} ${f(y - h)} M${f(x + 5 * s)} ${y} L${f(x + 2 * s)} ${f(y - h)} M${f(x - 7 * s)} ${f(y - h)} L${f(x + 7 * s)} ${f(y - h)}`} />
      <g className="prop-bloom" transform={`translate(${x} ${f(y - h - 9 * s)}) scale(${s})`}>
        <g transform="translate(6 10) rotate(140)"><Eucalyptus length={22} seed={Math.round(x)} /></g>
        <g transform="translate(-6 10) rotate(-140)"><Eucalyptus length={20} seed={Math.round(x) + 1} /></g>
        <Hydrangea r={11} seed={Math.round(x)} />
        <g transform="translate(-8 4)"><RoseHead r={6} tone="mauve" seed={Math.round(x) + 2} /></g>
        <g transform="translate(8 3)"><RoseHead r={6} tone="peach" seed={Math.round(x) + 3} /></g>
        <g transform="translate(0 -9)"><Spray r={6} dir={1} /></g>
      </g>
    </g>
  )
}

/** Glass lantern with a candle, standing on the ground. */
export function GroundLantern({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const w = 9 * s, h = 22 * s
  return (
    <g>
      <ellipse className="lantern-glow" cx={x} cy={f(y - h * 0.45)} rx={f(w * 2)} ry={f(h * 0.9)} fill="url(#g-peach-petal)" opacity={0.6} />
      <path className="sk sk-ink" d={`M${f(x - w)} ${y} L${f(x + w)} ${y} L${f(x + w)} ${f(y - h)} L${f(x - w)} ${f(y - h)} Z M${f(x - w - 2)} ${f(y - h)} L${x} ${f(y - h - 8 * s)} L${f(x + w + 2)} ${f(y - h)} M${x} ${f(y - h - 8 * s)} q 0 -6 4 -6`} />
      <path className="sk sk-light" d={`M${f(x - 3 * s)} ${f(y - 2)} L${f(x - 3 * s)} ${f(y - h * 0.4)} L${f(x + 3 * s)} ${f(y - h * 0.4)} L${f(x + 3 * s)} ${f(y - 2)}`} />
    </g>
  )
}

/** Round guest table with a long cloth, a centrepiece and chairs, seen from the side. */
export function GuestTable({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const r = 34 * s, top = y - 26 * s
  const chair = (cx: number) => `M${f(cx - 6 * s)} ${y} L${f(cx - 6 * s)} ${f(y - 12 * s)} M${f(cx + 6 * s)} ${y} L${f(cx + 6 * s)} ${f(y - 12 * s)} M${f(cx - 7 * s)} ${f(y - 12 * s)} L${f(cx + 7 * s)} ${f(y - 12 * s)} M${f(cx - 6 * s)} ${f(y - 12 * s)} L${f(cx - 6 * s)} ${f(y - 30 * s)} Q ${f(cx)} ${f(y - 35 * s)} ${f(cx + 6 * s)} ${f(y - 30 * s)} L${f(cx + 6 * s)} ${f(y - 12 * s)}`
  return (
    <g>
      <path className="wash" d={`M${f(x - r)} ${f(top)} C ${f(x - r - 2)} ${f(y - 8 * s)} ${f(x - r + 4)} ${y} ${f(x - r + 6)} ${y} L${f(x + r - 6)} ${y} C ${f(x + r - 4)} ${y} ${f(x + r + 2)} ${f(y - 8 * s)} ${f(x + r)} ${f(top)} Z`} fill="#fdfaf4" opacity="0.95" />
      <path className="sk" d={chair(x - r - 9 * s) + ' ' + chair(x + r + 9 * s)} />
      <ellipse className="sk" cx={x} cy={f(top)} rx={f(r)} ry={f(7 * s)} />
      <path className="sk sk-light" d={`M${f(x - r)} ${f(top)} C ${f(x - r - 2)} ${f(y - 8 * s)} ${f(x - r + 4)} ${y} ${f(x - r + 6)} ${y} M${f(x + r)} ${f(top)} C ${f(x + r + 2)} ${f(y - 8 * s)} ${f(x + r - 4)} ${y} ${f(x + r - 6)} ${y} M${f(x - r * 0.4)} ${f(top + 6 * s)} L${f(x - r * 0.45)} ${y} M${f(x + r * 0.4)} ${f(top + 6 * s)} L${f(x + r * 0.45)} ${y}`} />
      <path className="wash" d={`M${f(x - r * 0.7)} ${f(top + 4 * s)} L${f(x + r * 0.7)} ${f(top + 4 * s)} L${f(x + r * 0.6)} ${f(top + 16 * s)} L${f(x - r * 0.6)} ${f(top + 16 * s)} Z`} fill="#c98e9c" opacity="0.4" filter="url(#wash)" />
      <path className="sk sk-light" d={`M${x} ${f(top)} L${x} ${f(top - 14 * s)}`} />
      <g className="prop-bloom" transform={`translate(${x} ${f(top - 18 * s)}) scale(${s * 0.8})`}>
        <Hydrangea r={8} seed={Math.round(x)} />
        <g transform="translate(-7 3)"><RoseHead r={5} tone="mauve" seed={Math.round(x) + 5} /></g>
        <g transform="translate(7 3)"><RoseHead r={5} tone="ivory" seed={Math.round(x) + 6} /></g>
      </g>
    </g>
  )
}

/** Wooden chair with a mauve sash, for aisle rows. Returns path data at (x, 0). */
export function chairPath(x: number, s: number) {
  const w = 14 * s
  const l = x - w / 2, r = x + w / 2
  return `M${f(l)} 0 L${f(l)} ${f(-10 * s)} M${f(r)} 0 L${f(r)} ${f(-10 * s)} M${f(l - 1)} ${f(-10 * s)} L${f(r + 1)} ${f(-10 * s)} M${f(l)} ${f(-10 * s)} L${f(l)} ${f(-24 * s)} Q${f(x)} ${f(-29 * s)} ${f(r)} ${f(-24 * s)} L${f(r)} ${f(-10 * s)} M${f(l)} ${f(-17 * s)} L${f(r)} ${f(-17 * s)}`
}

/** Fairy lights hanging in a swag between two points, with glowing bulbs. */
export function StringLights({ x1, y1, x2, y2, sag = 30, n = 8 }: { x1: number; y1: number; x2: number; y2: number; sag?: number; n?: number }) {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2
  const pt = (t: number) => [
    (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2,
    (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2,
  ]
  return (
    <g>
      <path className="sk sk-light" d={`M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} />
      <g className="bulbs">
        {Array.from({ length: n }, (_, i) => {
          const [bx, by] = pt((i + 1) / (n + 1))
          return <circle key={i} cx={f(bx)} cy={f(by + 3)} r={2.1} fill={i % 2 ? '#efc1a8' : '#fbe7da'} className="lantern-glow" style={{ animationDelay: `${-i * 0.37}s` }} />
        })}
      </g>
    </g>
  )
}

/** Scalloped hedge between x0 and x1 at a base line. */
export function hedge(x0: number, x1: number, y: number, n = 6, tilt = 0) {
  let d = `M${x0} ${y}`
  for (let i = 0; i < n; i++) {
    const a = x0 + ((x1 - x0) * i) / n, b = x0 + ((x1 - x0) * (i + 1)) / n
    const yy = y - (i * tilt) / n
    d += ` C ${f(a)} ${f(yy - 26)} ${f(b)} ${f(yy - 26)} ${f(b)} ${f(yy)}`
  }
  return d
}
