import { useRef } from 'react'
import { useSceneTimeline } from '../story/scene'
import { drawSketch, roughEllipse } from '../sketch/sketch'
import { Hydrangea, RoseHead, Eucalyptus } from '../components/garden/botanical'
import { wedding } from '../config/wedding'
import { arabicWeekday, gregorianParts, hijriParts } from '../lib/dates'
import { Page, Sketch, at } from './Page'

/** Stepping-stone joints across the path, in perspective. */
function stones() {
  const out: string[] = []
  for (const y of [446, 476, 512, 556, 610, 676]) {
    const k = (y - 420) / 280
    const l = 180 - k * 85, r = 220 + k * 85
    out.push(`M${(l + 3).toFixed(0)} ${y} L${(r - 3).toFixed(0)} ${y}`)
    const mid = (l + r) / 2
    out.push(`M${mid.toFixed(0)} ${y} L${(mid + (y % 2 ? 4 : -4)).toFixed(0)} ${(y + 18 + k * 20).toFixed(0)}`)
  }
  return out.join(' ')
}

function hedge(x0: number, x1: number, yBase: number, dir: 1 | -1) {
  let d = `M${x0} ${yBase}`
  const n = 6
  for (let i = 0; i < n; i++) {
    const a = x0 + ((x1 - x0) * i) / n, b = x0 + ((x1 - x0) * (i + 1)) / n
    const y = yBase - (i * 4 * dir) / n
    d += ` C ${a.toFixed(0)} ${(y - 26).toFixed(0)} ${b.toFixed(0)} ${(y - 26).toFixed(0)} ${b.toFixed(0)} ${y.toFixed(0)}`
  }
  return d
}

function EntranceSketch() {
  return (
    <g filter="url(#pencil)">
      {/* lawn wash */}
      <path className="wash" d="M0 430 L170 420 L230 420 L400 430 L400 700 L0 700Z" fill="#cbd8d0" opacity="0.35" filter="url(#wash)" />
      <path className="sk sk-light" d="M0 430 L170 420 M230 420 L400 430" />
      {/* path */}
      <path className="sk" d="M180 420 L95 700 M220 420 L305 700" />
      <path className="sk sk-light" d={stones()} />
      {/* hedges either side */}
      <path className="sk" d={hedge(0, 166, 448, 1)} />
      <path className="sk" d={hedge(234, 400, 444, -1)} />
      {/* palm, left */}
      <path className="sk" d="M70 446 C 66 380 74 320 92 270 M76 446 C 72 380 80 322 96 272" />
      <path className="sk" d="M94 270 C 70 254 48 262 34 282 M94 270 C 80 244 58 236 42 242 M94 270 C 102 244 122 238 140 246 M94 270 C 114 262 130 272 138 292 M94 270 C 92 250 96 234 104 224" />
      {/* tree, right */}
      <path className="wash" d="M262 360 C 250 320 280 290 305 300 C 320 270 360 285 355 315 C 375 335 350 370 320 362 C 300 375 270 375 262 360 Z" fill="#cbd8d0" opacity="0.6" filter="url(#wash)" />
      <path className="sk" d="M262 360 C 250 320 280 290 305 300 C 320 270 360 285 355 315 C 375 335 350 370 320 362 C 300 375 270 375 262 360" />
      <path className="sk" d="M306 440 L309 368" />
      {/* entrance arch at the end of the path, with drapes */}
      <path className="wash" d="M168 326 C 178 360 172 396 176 420 L168 420Z M232 326 C 222 360 228 396 224 420 L232 420Z" fill="#c98e9c" opacity="0.55" filter="url(#wash)" />
      <path className="sk sk-ink" d="M168 420 L168 320 A 32 32 0 0 1 232 320 L232 420 M174 420 L174 322 A 26 26 0 0 1 226 322 L226 420" />
      {/* string lights */}
      <path className="sk sk-light" d="M96 300 Q 148 334 200 290 Q 262 336 330 318" />
      {/* signboard beside the path */}
      <path className="sk" style={{ stroke: '#8a6f5a' }} d="M226 592 L222 684 M364 592 L368 684" />
      <rect className="sk" style={{ stroke: '#8a6f5a', strokeWidth: 1.6 }} x={202} y={436} width={186} height={156} rx={6} />
      <rect className="sk sk-light" style={{ stroke: '#8a6f5a' }} x={210} y={444} width={170} height={140} rx={4} />
    </g>
  )
}

function Bulbs() {
  const pts: [number, number][] = []
  for (let i = 1; i < 9; i++) { const t = i / 9; pts.push([96 + 104 * t, (1 - t) * (1 - t) * 300 + 2 * (1 - t) * t * 334 + t * t * 290]) }
  for (let i = 1; i < 9; i++) { const t = i / 9; pts.push([200 + 130 * t, (1 - t) * (1 - t) * 290 + 2 * (1 - t) * t * 336 + t * t * 318]) }
  return <g className="bulbs">{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y + 3} r={2.2} fill={i % 2 ? '#efc1a8' : '#fbe7da'} className="lantern-glow" style={{ animationDelay: `${-i * 0.4}s` }} />)}</g>
}

function ArchFlowers() {
  return (
    <g className="arch-flowers">
      <g transform="translate(200 290)"><Hydrangea r={11} seed={3} /></g>
      <g transform="translate(184 296)"><RoseHead r={7} tone="mauve" seed={4} /></g>
      <g transform="translate(216 296)"><RoseHead r={7} tone="peach" seed={5} /></g>
      <g transform="translate(170 312)"><Hydrangea r={7} tone="lilac" seed={6} /></g>
      <g transform="translate(230 312)"><Hydrangea r={7} seed={7} /></g>
      <g transform="translate(168 412)"><Hydrangea r={8} seed={8} /></g>
      <g transform="translate(232 412)"><RoseHead r={6} tone="ivory" seed={9} /></g>
      {/* flowers on the board's corner */}
      <g transform="translate(206 440)"><Hydrangea r={10} seed={10} /></g>
      <g transform="translate(220 434)"><RoseHead r={7} tone="mauve" seed={11} /></g>
      <g transform="translate(196 452) rotate(20)"><Eucalyptus length={28} seed={12} /></g>
    </g>
  )
}

/** Scene 3 — a path to the entrance; the signboard beside it shows the date, which then turns to Arabic. */
export function DateBoard() {
  const root = useRef<HTMLElement>(null)
  const iso = wedding.event.start
  const g = gregorianParts(iso)
  const h = hijriParts(iso)

  useSceneTimeline(root, (tl, q, el) => {
    const mark = el.querySelector<SVGPathElement>('.date-mark')!
    const L = mark.getTotalLength() + 2
    mark.style.strokeDasharray = `${L}`
    mark.style.strokeDashoffset = `${L}`
    tl.set(q('.ar-date'), { clipPath: 'inset(0% 0% 0% 100%)' })
    drawSketch(tl, el.querySelector('.entrance'), { at: 0.1, duration: 2.4, washAt: 1.8 })
    tl.from(q('.arch-flowers > g'), { opacity: 0, duration: 0.6, stagger: 0.06 }, 1.4)
      .from(q('.bulbs'), { opacity: 0, duration: 1 }, 1.8)
      .from(q('.board-fill'), { opacity: 0, duration: 0.6 }, 1.9)
      .from(q('.hdr'), { opacity: 0, y: 8, duration: 0.8, stagger: 0.15 }, 1.2)
      .from(q('.en-date > *'), { opacity: 0, y: 8, filter: 'blur(4px)', duration: 0.7, stagger: 0.18 }, 2.3)
      .to(mark, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 3.2)
      // the English date fades away and the Arabic date writes itself in, right to left
      .to(q('.en-date'), { opacity: 0, filter: 'blur(6px)', duration: 0.6 }, 5.4)
      .to(q('.ar-date'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power1.inOut' }, 5.9)
  })

  return (
    <section ref={root} className="scene h-[100svh]">
      <Page>
        <Sketch>
          <g className="entrance"><EntranceSketch /></g>
          <rect className="board-fill" x={211} y={445} width={168} height={138} rx={4} fill="#fdfaf4" opacity={0.85} />
          <Bulbs />
          <ArchFlowers />
        </Sketch>

        <div style={at(200, 70, 360)} className="text-center">
          <p className="hdr eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">Save the date</p>
          <p className="hdr arabic mt-1 text-[clamp(1.1rem,5.5cqw,1.5rem)] text-[var(--color-mauve-deep)]">يَوْمٌ مُبَارَك</p>
          <p className="hdr font-[family-name:var(--font-script)] text-[clamp(2rem,10cqw,3rem)] leading-tight text-[var(--color-ink)]">the blessed day</p>
        </div>

        {/* the signboard */}
        <div style={{ ...at(295, 448, 170), height: `${(138 / 700) * 100}%` }}>
          <div className="en-date absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-[family-name:var(--font-display)] text-[clamp(0.6rem,3cqw,0.8rem)] tracking-[0.28em] text-[var(--color-blue-deep)] uppercase">{g.weekday}</p>
            <p className="relative font-[family-name:var(--font-display)] text-[clamp(2.2rem,13cqw,3.6rem)] leading-none text-[var(--color-ink)]">
              {g.day}
              <svg viewBox="0 0 80 60" className="pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[190%] -translate-x-1/2 -translate-y-1/2 overflow-visible" aria-hidden>
                <path className="date-mark" d={roughEllipse(40, 30, 36, 25, 17)} fill="none" stroke="#c98e9c" strokeWidth={1.6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </p>
            <p className="hand text-[clamp(1.1rem,6cqw,1.6rem)] leading-tight text-[var(--color-ink)]">{g.month} {g.year}</p>
          </div>
          <div className="ar-date arabic absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[clamp(0.9rem,4.4cqw,1.2rem)] leading-tight text-[var(--color-blue-deep)]">{arabicWeekday(iso)}</p>
            <p className="text-[clamp(2.2rem,12cqw,3.4rem)] leading-[1.15] text-[var(--color-ink)]">{h.dayAr}</p>
            <p className="text-[clamp(1rem,5.2cqw,1.4rem)] leading-tight text-[var(--color-mauve-deep)]">{h.monthAr} {h.yearAr} هـ</p>
          </div>
        </div>
      </Page>
    </section>
  )
}
