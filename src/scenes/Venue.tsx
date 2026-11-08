import { useRef } from 'react'
import { useSceneTimeline, useSceneMode } from '../story/scene'
import { drawSketch, SketchLink } from '../sketch/sketch'
import { wedding } from '../config/wedding'
import { Hydrangea, RoseHead } from '../components/garden/botanical'
import { Page, Sketch, at } from './Page'

const ROWS = [500, 532, 570, 615, 668]
const edgeL = (y: number) => 188 - ((y - 472) * 68) / 228
const edgeR = (y: number) => 212 + ((y - 472) * 68) / 228

function chair(x: number, s: number) {
  const w = 14 * s
  const l = x - w / 2, r = x + w / 2
  return `M${l.toFixed(1)} 0 L${l.toFixed(1)} ${(-10 * s).toFixed(1)} M${r.toFixed(1)} 0 L${r.toFixed(1)} ${(-10 * s).toFixed(1)} M${(l - 1).toFixed(1)} ${(-10 * s).toFixed(1)} L${(r + 1).toFixed(1)} ${(-10 * s).toFixed(1)} M${l.toFixed(1)} ${(-10 * s).toFixed(1)} L${l.toFixed(1)} ${(-24 * s).toFixed(1)} Q${x.toFixed(1)} ${(-29 * s).toFixed(1)} ${r.toFixed(1)} ${(-24 * s).toFixed(1)} L${r.toFixed(1)} ${(-10 * s).toFixed(1)}`
}

/** One path per row and side: chairs either side of the aisle, in perspective. */
function chairRows() {
  return ROWS.flatMap((y) => {
    const k = (y - 472) / 228
    const s = 0.55 + k * 0.95
    const left: string[] = [], right: string[] = []
    for (let i = 0; i < 6; i++) {
      const xl = edgeL(y) - 10 * s - i * 18 * s
      const xr = edgeR(y) + 10 * s + i * 18 * s
      if (xl > -10) left.push(chair(xl, s))
      if (xr < 410) right.push(chair(xr, s))
    }
    return [{ y, d: left.join(' ') }, { y, d: right.join(' ') }]
  })
}

function OpenVenueSketch() {
  return (
    <g filter="url(#pencil)">
      <path className="wash" d="M0 470 L400 470 L400 700 L0 700Z" fill="#cbd8d0" opacity="0.35" filter="url(#wash)" />
      <path className="sk sk-light" d="M0 470 L400 470" />
      {/* palms behind */}
      <path className="sk" d="M58 470 C 56 420 64 370 80 332 M64 470 C 62 420 70 372 85 334" />
      <path className="sk" d="M82 332 C 60 318 40 326 26 344 M82 332 C 70 306 50 300 34 306 M82 332 C 92 308 112 302 130 310 M82 332 C 102 326 118 336 124 354 M82 332 C 80 312 84 298 92 288" />
      <path className="sk" d="M346 470 C 348 420 340 372 326 330 M340 470 C 342 420 335 374 321 332" />
      <path className="sk" d="M323 330 C 344 316 364 324 378 342 M323 330 C 334 304 354 298 370 304 M323 330 C 312 306 292 300 274 308 M323 330 C 304 324 288 334 282 352 M323 330 C 326 310 322 296 314 286" />
      {/* floral canopy (mandap) at the end of the aisle */}
      <path className="wash" d="M172 404 C 182 430 176 455 182 472 L172 472Z M228 404 C 218 430 224 455 218 472 L228 472Z" fill="#c98e9c" opacity="0.6" filter="url(#wash)" />
      <path className="sk sk-ink" d="M172 472 L172 402 M228 472 L228 402 M164 402 L236 402 M164 396 L236 396" />
      <path className="sk sk-light" d="M160 478 L240 478 M160 472 L160 478 M240 472 L240 478" />
      <path className="sk sk-light" d="M190 466 L190 456 Q 194 452 198 456 L198 466 M202 466 L202 456 Q 206 452 210 456 L210 466" />
      {/* string lights */}
      <path className="sk sk-light" d="M84 352 Q 140 404 200 392 Q 262 404 322 350" />
      {/* aisle */}
      <path className="sk" d="M188 472 L120 700 M212 472 L280 700" />
      <path className="sk sk-light" d={ROWS.map((y) => `M${(edgeL(y) + 4).toFixed(0)} ${y} L${(edgeR(y) - 4).toFixed(0)} ${y}`).join(' ')} />
      {/* chairs */}
      {chairRows().map((r, i) => (
        <path key={i} className="sk sk-light" transform={`translate(0 ${r.y})`} d={r.d} />
      ))}
    </g>
  )
}

function VenueFlowers() {
  return (
    <g className="venue-flowers">
      {[[166, 398, 'h', 9], [182, 395, 'm', 6], [200, 394, 'h', 10], [218, 395, 'p', 6], [234, 398, 'h', 9], [172, 470, 'h', 7], [228, 470, 'i', 6]].map(([x, y, k, r], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {k === 'h' ? <Hydrangea r={r as number} seed={i} tone={i % 2 ? 'lilac' : 'blue'} /> : <RoseHead r={r as number} tone={k === 'm' ? 'mauve' : k === 'p' ? 'peach' : 'ivory'} seed={i} />}
        </g>
      ))}
      {/* petal bowls (urli) along the aisle */}
      {[532, 615].flatMap((y, i) => [edgeL(y) + 10, edgeR(y) - 10].map((x, j) => (
        <g key={`${i}${j}`} transform={`translate(${x} ${y + 4})`}>
          <ellipse rx={7 + i * 3} ry={2.6 + i} fill="#c9ab8c" opacity={0.75} />
          <ellipse cy={-1.2} rx={5.5 + i * 2.5} ry={1.8 + i * 0.8} fill={j ? '#e7a6b3' : '#efc1a8'} />
        </g>
      )))}
    </g>
  )
}

function Bulbs() {
  const pts: [number, number][] = []
  for (let i = 1; i < 8; i++) { const t = i / 8; pts.push([84 + 116 * t, (1 - t) * (1 - t) * 352 + 2 * (1 - t) * t * 404 + t * t * 392]) }
  for (let i = 1; i < 8; i++) { const t = i / 8; pts.push([200 + 122 * t, (1 - t) * (1 - t) * 392 + 2 * (1 - t) * t * 404 + t * t * 350]) }
  return <g className="bulbs">{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y + 3} r={2} fill={i % 2 ? '#efc1a8' : '#fbe7da'} className="lantern-glow" style={{ animationDelay: `${-i * 0.4}s` }} />)}</g>
}

/** Scene 5 — an open-air ceremony (aisle, chairs, floral canopy); the address is written above with a directions link. */
export function Venue() {
  const root = useRef<HTMLElement>(null)
  const mode = useSceneMode()
  const v = wedding.event.venue
  const lines = v.address.split(',').map((s) => s.trim())

  useSceneTimeline(root, (tl, q, el) => {
    drawSketch(tl, el.querySelector('.venue'), { at: 0.1, duration: 2.4, washAt: 1.8 })
    tl.from(q('.venue-flowers > g'), { opacity: 0, duration: 0.5, stagger: 0.05 }, 1.6)
      .from(q('.bulbs'), { opacity: 0, duration: 1 }, 2)
      .from(q('.v-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.8, stagger: 0.18 }, 1.2)
  })

  return (
    <section ref={root} className="scene">
      <div className="relative h-[100svh]">
      <Page>
        <Sketch>
          <g className="venue"><OpenVenueSketch /></g>
          <Bulbs />
          <VenueFlowers />
        </Sketch>
        <div style={at(200, 70, 360)} className="flex flex-col items-center text-center">
          <p className="v-in eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">Finding your way</p>
          <p className="v-in mt-1 font-[family-name:var(--font-script)] text-[clamp(2rem,10cqw,3rem)] leading-tight text-[var(--color-ink)]">The Venue</p>
          <div className="v-in mt-3 hand text-[clamp(1.25rem,6.2cqw,1.75rem)] leading-[1.2] text-[var(--color-ink)]">
            <p className="text-[var(--color-mauve-deep)]">{v.name}</p>
            {lines.map((l) => <p key={l}>{l}</p>)}
          </div>
          <div className="v-in mt-4">
            <SketchLink href={v.mapsUrl} external delay={mode === 'trailer' ? 2.4 : 0.4}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
              Get directions
            </SketchLink>
          </div>
        </div>
      </Page>
      </div>
      {mode === 'scroll' && v.directions.length > 0 && (
        <ol className="v-in mx-auto max-w-md space-y-2 px-8 pb-12 text-[1.02rem] leading-snug text-[var(--color-ink)]">
          {v.directions.map((d, i) => (
            <li key={d} className="flex gap-2"><span className="hand text-[1.25em] leading-none text-[var(--color-blue-deep)]">{i + 1}.</span><span>{d}</span></li>
          ))}
        </ol>
      )}
    </section>
  )
}
