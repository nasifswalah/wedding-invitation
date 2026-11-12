import { useRef } from 'react'
import { useSceneTimeline, useSceneMode } from '../story/scene'
import { drawSketch, DirectionsButton } from '../sketch/sketch'
import { wedding } from '../config/wedding'
import { Hydrangea, RoseHead, Spray } from '../components/garden/botanical'
import { Page, Sketch, at, usePageWide } from './Page'
import { FlowerStand, GroundLantern, GuestTable, Palm, RoundTree, StringLights, chairPath, hedge } from './props'

const HZ = 472 // horizon / ground line
const ROWS = [500, 532, 570, 615, 668]
const edgeL = (y: number) => 188 - ((y - HZ) * 68) / 228
const edgeR = (y: number) => 212 + ((y - HZ) * 68) / 228
const scaleAt = (y: number) => 0.55 + ((y - HZ) / 228) * 0.95

function chairRows(minX: number, maxX: number) {
  return ROWS.flatMap((y) => {
    const s = scaleAt(y)
    const left: string[] = [], right: string[] = []
    for (let i = 0; i < 40; i++) {
      const xl = edgeL(y) - 10 * s - i * 18 * s
      const xr = edgeR(y) + 10 * s + i * 18 * s
      if (xl > minX) left.push(chairPath(xl, s))
      if (xr < maxX) right.push(chairPath(xr, s))
    }
    return [{ y, d: left.join(' ') }, { y, d: right.join(' ') }]
  })
}

/** Floral canopy (mandap) at the end of the aisle: posts, drapes, hanging florals, a small stage with the couple's seat. */
function Canopy() {
  return (
    <g>
      <path className="wash" d="M160 478 L240 478 L236 470 L164 470 Z" fill="#7a2a38" opacity="0.8" />
      <path className="wash" d="M170 400 C 182 426 174 452 182 470 L170 470Z M230 400 C 218 426 226 452 218 470 L230 470Z" fill="#d9a88f" opacity="0.6" filter="url(#wash)" />
      <path className="wash" d="M170 398 C 185 410 215 410 230 398 L230 404 C 215 416 185 416 170 404Z" fill="#4a1622" opacity="0.9" />
      <path className="sk sk-ink" d="M170 470 L170 396 M230 470 L230 396 M163 396 L237 396 M163 390 L237 390 M163 390 L163 396 M237 390 L237 396" />
      <path className="sk sk-light" d="M178 470 L178 404 M222 470 L222 404 M170 404 C 185 416 215 416 230 404" />
      <path className="sk sk-light" d="M158 478 L242 478 M158 470 L242 470 M158 470 L158 478 M242 470 L242 478" />
      {/* the couple's seat */}
      <path className="sk sk-light" d="M188 468 L188 456 Q 200 448 212 456 L212 468 M186 462 L214 462" />
    </g>
  )
}

function CanopyFlowers() {
  const tops: [number, number, 'h' | 'm' | 'p' | 'i', number][] = [
    [164, 391, 'h', 9], [178, 388, 'm', 6], [192, 387, 'h', 8], [208, 387, 'p', 6], [222, 388, 'h', 8], [236, 391, 'i', 6],
    [170, 468, 'h', 7], [230, 468, 'h', 7], [176, 466, 'm', 5], [224, 466, 'p', 5],
  ]
  return (
    <g className="venue-flowers">
      {tops.map(([x, y, k, r], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {k === 'h' ? <Hydrangea r={r} seed={i} tone={i % 3 ? 'blue' : 'lilac'} /> : <RoseHead r={r} tone={k === 'm' ? 'mauve' : k === 'p' ? 'peach' : 'ivory'} seed={i} />}
        </g>
      ))}
      {/* short hanging strands under the canopy beam */}
      {[176, 188, 200, 212, 224].map((x, i) => (
        <g key={`s${i}`} transform={`translate(${x} 398)`}>
          <line x1={0} y1={0} x2={0} y2={10 + (i % 2) * 6} stroke="#7a8456" strokeWidth={0.4} />
          <g transform={`translate(0 ${12 + (i % 2) * 6})`}>{i % 2 ? <RoseHead r={2.6} tone="mauve" seed={i} /> : <Spray r={3} dir={-1} />}</g>
        </g>
      ))}
    </g>
  )
}

function VenueSketch({ wide }: { wide: boolean }) {
  const minX = wide ? -400 : -10, maxX = wide ? 800 : 410
  const chairMin = wide ? -70 : -10, chairMax = wide ? 470 : 410
  return (
    <g filter="url(#pencil)">
      <path className="wash" d={`M${minX} ${HZ} L${maxX} ${HZ} L${maxX} 700 L${minX} 700Z`} fill="#5d6440" opacity="0.35" filter="url(#wash)" />
      {/* tree line behind the lawn */}
      <path className="sk sk-light" d={hedge(minX, 150, HZ - 2, wide ? 18 : 6, -4)} />
      <path className="sk sk-light" d={hedge(250, maxX, HZ - 2, wide ? 18 : 6, 4)} />
      <path className="sk sk-light" d={`M${minX} ${HZ} L${maxX} ${HZ}`} />
      <Palm x={58} y={HZ} h={150} />
      <Palm x={340} y={HZ} h={156} flip />
      <Canopy />
      {/* aisle with an ivory runner */}
      <path className="wash" d={`M192 ${HZ} L208 ${HZ} L262 700 L138 700Z`} fill="#4a1622" opacity="0.9" />
      <path className="sk" d={`M188 ${HZ} L120 700 M212 ${HZ} L280 700`} />
      <path className="sk sk-light" d={`M192 ${HZ} L138 700 M208 ${HZ} L262 700`} />
      {chairRows(chairMin, chairMax).map((r, i) => (
        <path key={i} className="sk sk-light" transform={`translate(0 ${r.y})`} d={r.d} />
      ))}
    </g>
  )
}

function AisleDecor() {
  return (
    <g className="aisle-decor">
      {[515, 585, 660].map((y, i) => {
        const s = scaleAt(y)
        return (
          <g key={y}>
            <FlowerStand x={edgeL(y) - 2} y={y} h={36 * s} s={s * 0.85} />
            <FlowerStand x={edgeR(y) + 2} y={y} h={36 * s} s={s * 0.85} />
            {i < 2 && <GroundLantern x={(edgeL(y + 30) + 6)} y={y + 30} s={s * 0.6} />}
            {i < 2 && <GroundLantern x={(edgeR(y + 30) - 6)} y={y + 30} s={s * 0.6} />}
          </g>
        )
      })}
      {/* petals scattered on the runner */}
      {Array.from({ length: 18 }, (_, i) => {
        const y = 490 + ((i * 37) % 200)
        const x = 200 + (((i * 53) % 100) / 100 - 0.5) * (y - 460) * 0.45
        return <ellipse key={i} cx={x} cy={y} rx={1.8 + (y - 470) / 120} ry={1} fill={i % 3 ? '#e7a6b3' : '#efc1a8'} opacity={0.8} transform={`rotate(${i * 40} ${x} ${y})`} />
      })}
    </g>
  )
}

/** Only on wide pages: guest tables, more palms and trees, lights across the lawn. */
function VenueWide() {
  return (
    <g className="venue-wide" filter="url(#pencil)">
      <Palm x={-360} y={HZ} h={170} />
      <RoundTree x={-250} y={HZ} r={36} />
      <Palm x={-110} y={HZ} h={140} flip />
      <RoundTree x={520} y={HZ} r={34} />
      <Palm x={640} y={HZ} h={168} flip />
      <RoundTree x={760} y={HZ} r={40} />
      <GuestTable x={-300} y={640} s={1.25} />
      <GuestTable x={-140} y={600} s={1} />
      <GuestTable x={540} y={600} s={1} />
      <GuestTable x={700} y={640} s={1.25} />
      <GroundLantern x={-60} y={690} s={1.2} />
      <GroundLantern x={460} y={690} s={1.2} />
    </g>
  )
}

/** Scene 5 — an open-air ceremony (aisle, chairs, floral canopy); the address is written above with a directions button. */
export function Venue() {
  const root = useRef<HTMLElement>(null)
  const mode = useSceneMode()
  const v = wedding.event.venue
  const lines = v.address.split(',').map((s) => s.trim())

  useSceneTimeline(root, (tl, q, el) => {
    drawSketch(tl, el.querySelector('.venue-wide'), { at: 0, duration: 2.4, washAt: 1.8 })
    drawSketch(tl, el.querySelector('.venue'), { at: 0.1, duration: 2.4, washAt: 1.8 })
    drawSketch(tl, el.querySelector('.aisle-decor'), { at: 1.4, duration: 1.2 })
    tl.from(q('.venue-flowers > g, .prop-bloom'), { opacity: 0, duration: 0.5, stagger: 0.03 }, 1.6)
      .from(q('.bulbs'), { opacity: 0, duration: 1 }, 2)
      .from(q('.v-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.8, stagger: 0.18 }, 1.2)
  })

  return (
    <section ref={root} className="scene">
      <div className="relative h-[100svh]">
        <Page>
          <VenueSketchLayer />
          <div style={at(200, 64, 360)} className="flex flex-col items-center text-center">
            <p className="v-in eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">Finding your way</p>
            <p className="v-in mt-1 font-[family-name:var(--font-script)] text-[clamp(2rem,10cqw,3rem)] leading-tight text-[var(--color-ink)]">The Venue</p>
            <div className="v-in mt-2 hand text-[clamp(1.2rem,6cqw,1.7rem)] leading-[1.18] text-[var(--color-ink)]">
              <p className="text-[var(--color-mauve-deep)]">{v.name}</p>
              {lines.map((l) => <p key={l}>{l}</p>)}
            </div>
            <div className="v-in mt-4">
              <DirectionsButton href={v.mapsUrl} delay={mode === 'trailer' ? 2.2 : 0.3} />
            </div>
          </div>
        </Page>
      </div>
    </section>
  )
}

function VenueSketchLayer() {
  const wide = usePageWide()
  return (
    <Sketch wide={<VenueWide />}>
      <g className="venue"><VenueSketch wide={wide} /></g>
      <StringLights x1={70} y1={330} x2={200} y2={386} sag={14} n={7} />
      <StringLights x1={200} y1={386} x2={330} y2={326} sag={14} n={7} />
      {wide && <StringLights x1={-350} y1={300} x2={70} y2={330} sag={40} n={14} />}
      {wide && <StringLights x1={330} y1={326} x2={650} y2={306} sag={40} n={14} />}
      <CanopyFlowers />
      <AisleDecor />
    </Sketch>
  )
}
