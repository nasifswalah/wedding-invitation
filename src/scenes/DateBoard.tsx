import { useRef } from 'react'
import { useSceneTimeline } from '../story/scene'
import { drawSketch, roughEllipse } from '../sketch/sketch'
import { Hydrangea, RoseHead } from '../components/garden/botanical'
import { wedding } from '../config/wedding'
import { arabicWeekday, gregorianMonthGrid, gregorianParts, hijriMonthGrid, hijriParts, toArabicDigits, type MonthGrid } from '../lib/dates'
import { Page, Sketch, at } from './Page'

const BX = 52, BW = 296, BY = 250
const colX = (c: number) => BX + (BW / 7) * (c + 0.5)
const rowY = (r: number) => 356 + r * 29

function GateSketch() {
  return (
    <g filter="url(#pencil)">
      <path className="sk" d="M0 640 L400 640" />
      <path className="sk sk-light" d="M150 700 L178 640 M250 700 L222 640" />
      <path className="sk" d="M18 640 L18 336 L50 336 L50 640 M12 336 L56 336 L52 322 L16 322 Z" />
      <circle className="sk" cx="34" cy="311" r="9" />
      <path className="sk" d="M350 640 L350 336 L382 336 L382 640 M344 336 L388 336 L384 322 L348 322 Z" />
      <circle className="sk" cx="366" cy="311" r="9" />
      <path className="sk" d="M50 362 C 72 236 328 236 350 362" />
      <path className="sk sk-light" d="M50 384 C 76 262 324 262 350 384" />
      <path className="sk sk-light" d="M24 380 L44 380 M24 440 L44 440 M24 500 L44 500 M24 560 L44 560 M356 380 L376 380 M356 440 L376 440 M356 500 L376 500 M356 560 L376 560" />
      <path className="sk sk-light" d="M64 640 l4 -10 l3 10 M86 640 l3 -8 l3 8 M318 640 l3 -9 l3 9 M336 640 l4 -11 l3 11" />
      <path className="wash" d="M50 362 C 72 236 328 236 350 362 L350 640 L50 640Z" fill="#d3e0ea" opacity="0.3" filter="url(#wash)" />
    </g>
  )
}

function EaselSketch() {
  return (
    <g filter="url(#pencil)">
      <path className="sk" d="M120 528 L92 652 M280 528 L308 652 M200 528 L200 642" />
      <path className="sk" d="M84 536 L316 536" />
      <rect className="sk sk-ink" x={BX} y={BY} width={BW} height={280} rx={6} />
      <rect className="sk sk-light" x={BX + 10} y={BY + 10} width={BW - 20} height={260} rx={4} />
    </g>
  )
}

function Face({ grid, arabic, cls }: { grid: MonthGrid & { titleAr?: string }; arabic?: boolean; cls: string }) {
  const labels = arabic ? ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const col = (wd: number) => (arabic ? 6 - wd : wd)
  const cells = Array.from({ length: grid.days }, (_, i) => {
    const idx = grid.firstWeekday + i
    return { d: i + 1, c: col(idx % 7), r: Math.floor(idx / 7) }
  })
  const hi = cells[grid.highlight - 1]
  return (
    <g className={cls}>
      <text x={200} y={BY + 42} textAnchor="middle" className={arabic ? 'arabic' : ''}
        fontFamily={arabic ? 'Amiri, serif' : 'Caveat, cursive'} fontSize={arabic ? 25 : 31} fill="#3d4b5c" direction={arabic ? 'rtl' : 'ltr'}>
        {arabic ? `${grid.titleAr} ${toArabicDigits(grid.year)} هـ` : `${grid.title} ${grid.year}`}
      </text>
      {labels.map((l, i) => (
        <text key={i} x={colX(i)} y={BY + 76} textAnchor="middle" fontSize={arabic ? 14 : 12} fontFamily={arabic ? 'Amiri, serif' : 'Cinzel, serif'} fill="#6f8aa1">{l}</text>
      ))}
      {cells.map((c) => (
        <text key={c.d} className="num" x={colX(c.c)} y={rowY(c.r)} textAnchor="middle" fontSize={c.d === grid.highlight ? 19 : 16}
          fontFamily={arabic ? 'Amiri, serif' : 'Cormorant Garamond, serif'} fontWeight={c.d === grid.highlight ? 700 : 400}
          fill={c.d === grid.highlight ? '#9c6473' : '#3d4b5c'}>
          {arabic ? toArabicDigits(c.d) : c.d}
        </text>
      ))}
      {hi && <path className="mark" d={roughEllipse(colX(hi.c), rowY(hi.r) - 6, 18, 15, grid.highlight)} fill="none" stroke={arabic ? '#c98e9c' : '#6f8aa1'} strokeWidth={2} strokeLinecap="round" />}
    </g>
  )
}

/** Scene 3 — a garden gate with an easel board: the date is circled, then the board flips to the Hijri month. */
export function DateBoard() {
  const root = useRef<HTMLElement>(null)
  const iso = wedding.event.start
  const g = gregorianParts(iso)
  const h = hijriParts(iso)
  const en = gregorianMonthGrid(iso)
  const ar = hijriMonthGrid(iso)

  useSceneTimeline(root, (tl, q, el) => {
    q('.mark').forEach((m) => {
      const p = m as SVGPathElement
      const L = p.getTotalLength() + 2
      p.style.strokeDasharray = `${L}`
      p.style.strokeDashoffset = `${L}`
    })
    tl.set(q('.face-ar'), { opacity: 0 })
    drawSketch(tl, el.querySelector('.gate'), { at: 0.1, duration: 2, washAt: 1.6 })
    tl.from(q('.gate-flowers'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.1 }, 1.4)
    drawSketch(tl, el.querySelector('.easel'), { at: 1.5, duration: 1.2 })
    tl.from(q('.board-fill'), { opacity: 0, duration: 0.6 }, 1.9)
      .from(q('.hdr-en'), { opacity: 0, y: 8, duration: 0.8, stagger: 0.15 }, 2.2)
      .from(q('.face-en text:not(.num)'), { opacity: 0, duration: 0.5, stagger: 0.04 }, 2.5)
      .from(q('.face-en .num'), { opacity: 0, y: 3, duration: 0.25, stagger: 0.018 }, 2.8)
      .to(q('.face-en .mark'), { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 3.7)
      // flip the board over to the Hijri side
      .to(q('.board'), { scaleX: 0, duration: 0.45, ease: 'power2.in', transformOrigin: '50% 50%' }, 5.7)
      .set(q('.face-en'), { opacity: 0 })
      .set(q('.face-ar'), { opacity: 1 })
      .to(q('.board'), { scaleX: 1, duration: 0.55, ease: 'back.out(1.6)' })
      .from(q('.face-ar .num'), { opacity: 0, duration: 0.25, stagger: 0.015 }, '-=0.2')
      .to(q('.face-ar .mark'), { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.1')
      .from(q('.hdr-ar'), { opacity: 0, y: 8, duration: 0.8 }, '-=0.6')
  })

  return (
    <section ref={root} className="scene h-[100svh]">
      <Page>
        <Sketch>
          <g className="gate"><GateSketch /></g>
          <g className="gate-flowers" transform="translate(34 300)"><Hydrangea r={13} seed={4} /><g transform="translate(14 8)"><RoseHead r={8} tone="mauve" seed={2} /></g></g>
          <g className="gate-flowers" transform="translate(366 300)"><Hydrangea r={13} tone="lilac" seed={9} /><g transform="translate(-14 8)"><RoseHead r={8} tone="peach" seed={5} /></g></g>
          <g className="easel"><EaselSketch /></g>
          <g className="board">
            <rect className="board-fill" x={BX + 3} y={BY + 3} width={BW - 6} height={274} rx={5} fill="#fdfaf4" opacity={0.92} />
            <Face grid={en} cls="face-en" />
            <Face grid={ar} arabic cls="face-ar" />
          </g>
        </Sketch>
        <div style={at(200, 70, 380)} className="text-center">
          <p className="hdr-en eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">Save the date</p>
          <p className="hdr-en mt-1 font-[family-name:var(--font-script)] text-[clamp(2rem,10cqw,3rem)] leading-tight text-[var(--color-ink)]">
            {g.weekday}, {g.day} {g.month}
          </p>
          <p className="hdr-ar arabic mt-1 text-[clamp(1rem,5cqw,1.4rem)] text-[var(--color-mauve-deep)]">
            {arabicWeekday(iso)} · {h.dayAr} {h.monthAr} {h.yearAr} هـ
          </p>
        </div>
      </Page>
    </section>
  )
}
