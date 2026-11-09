import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSceneTimeline } from '../story/scene'
import { drawSketch, roughEllipse } from '../sketch/sketch'
import { Eucalyptus, Hydrangea, RoseHead, Spray, SwayG } from '../components/garden/botanical'
import { wedding } from '../config/wedding'
import { gregorianParts } from '../lib/dates'
import { Page, Sketch, at } from './Page'
import { FlowerStand, StringLights } from './props'

const CX = 200, CY = 300, R = 96

/** Sketched clock face: rims, hour ticks and roman numerals. */
function ClockFace() {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2
    const r1 = R - (i % 5 === 0 ? 14 : 6), r2 = R - 2
    return `M${(CX + Math.sin(a) * r1).toFixed(1)} ${(CY - Math.cos(a) * r1).toFixed(1)} L${(CX + Math.sin(a) * r2).toFixed(1)} ${(CY - Math.cos(a) * r2).toFixed(1)}`
  })
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
  return (
    <g filter="url(#pencil)">
      <circle className="wash" cx={CX} cy={CY} r={R} fill="#fdfaf4" opacity="0.95" />
      <circle className="wash" cx={CX} cy={CY} r={R - 22} fill="#d3e0ea" opacity="0.35" filter="url(#wash)" />
      <circle className="sk sk-ink" cx={CX} cy={CY} r={R} />
      <circle className="sk sk-light" cx={CX} cy={CY} r={R + 6} />
      <circle className="sk sk-light" cx={CX} cy={CY} r={R - 22} />
      <path className="sk sk-light" d={ticks.filter((_, i) => i % 5).join(' ')} />
      <path className="sk" d={ticks.filter((_, i) => i % 5 === 0).join(' ')} />
      {numerals.map((n, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <text key={n} className="clock-num" x={CX + Math.sin(a) * (R - 30)} y={CY - Math.cos(a) * (R - 30) + 4} textAnchor="middle"
            fontFamily="Cinzel, serif" fontSize={i % 3 === 0 ? 12 : 9} fill="#6b7a8c">{n}</text>
        )
      })}
    </g>
  )
}

/** Hands drawn pointing at 12 — the timeline sweeps them round to the wedding time. */
function Hands() {
  return (
    <g>
      <g className="hand-hour">
        <path d={`M${CX} ${CY + 10} L${CX - 3.5} ${CY - 20} L${CX} ${CY - 48} L${CX + 3.5} ${CY - 20} Z`} fill="#3d4b5c" />
        <circle cx={CX} cy={CY - 30} r={3} fill="none" stroke="#fdfaf4" strokeWidth={1} />
      </g>
      <g className="hand-min">
        <path d={`M${CX} ${CY + 14} L${CX - 2.4} ${CY - 30} L${CX} ${CY - 72} L${CX + 2.4} ${CY - 30} Z`} fill="#9c6473" />
      </g>
      <circle cx={CX} cy={CY} r={5} fill="#c98e9c" stroke="#3d4b5c" strokeWidth={1} />
    </g>
  )
}

/** A wreath of flowers around the clock. */
function Wreath() {
  const items: { a: number; k: 'h' | 'hl' | 'm' | 'p' | 'i' | 'e' | 's'; r: number }[] = []
  const kinds: ('h' | 'hl' | 'm' | 'p' | 'i' | 'e' | 's')[] = ['h', 'm', 'e', 'p', 'hl', 's', 'i', 'e', 'm', 'h', 'p', 'e', 's', 'hl', 'm', 'e', 'i', 'h']
  // flowers gather in two arcs (top-left and bottom-right), leaving the face readable
  kinds.forEach((k, i) => {
    const t = i / kinds.length
    const a = i < 9 ? -150 + t * 2 * 110 : 30 + (t - 0.5) * 2 * 110
    items.push({ a, k, r: k === 'h' || k === 'hl' ? 13 : k === 'e' ? 0 : 9 })
  })
  return (
    <g className="wreath">
      {items.map((it, i) => {
        const rad = (it.a * Math.PI) / 180
        const x = CX + Math.cos(rad) * (R + 8), y = CY + Math.sin(rad) * (R + 8)
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            {it.k === 'h' || it.k === 'hl' ? <Hydrangea r={it.r} seed={i} tone={it.k === 'h' ? 'blue' : 'lilac'} />
              : it.k === 'e' ? <g transform={`rotate(${it.a + 90})`}><Eucalyptus length={30} seed={i} /></g>
                : it.k === 's' ? <Spray r={8} dir={1} />
                  : <RoseHead r={it.r} tone={it.k === 'm' ? 'mauve' : it.k === 'p' ? 'peach' : 'ivory'} seed={i} />}
          </g>
        )
      })}
    </g>
  )
}

/** Moroccan-style lantern hanging from (0,0). */
function Lantern({ len }: { len: number }) {
  const L = len
  return (
    <g>
      <ellipse className="lantern-glow" cx={0} cy={L + 37} rx={24} ry={28} fill="url(#g-peach-petal)" opacity={0.7} />
      <path className="sk" d={`M0 0 L0 ${L}`} />
      <path className="sk sk-ink" d={`M-9 ${L + 14} L-5 ${L + 6} L5 ${L + 6} L9 ${L + 14} Z M-9 ${L + 14} C -19 ${L + 30} -19 ${L + 48} -8 ${L + 60} L8 ${L + 60} C 19 ${L + 48} 19 ${L + 30} 9 ${L + 14} Z`} />
      <path className="sk sk-light" d={`M0 ${L + 14} L0 ${L + 60} M-14 ${L + 37} L14 ${L + 37}`} />
      <path className="sk sk-ink" d={`M-8 ${L + 60} L-5 ${L + 68} L5 ${L + 68} L8 ${L + 60} M0 ${L + 68} L0 ${L + 78}`} />
    </g>
  )
}

/** Only on wide pages: hanging lanterns, fairy lights and flower stands either side. */
function TimeWide() {
  return (
    <g className="time-wide">
      {[[-320, 60, 0], [-200, 120, 2], [-80, 40, 4], [480, 50, 1], [600, 130, 3], [720, 70, 5]].map(([x, len, ph]) => (
        <g key={x} transform={`translate(${x} -20)`}>
          <SwayG amp={2.2} phase={ph} stiffness={1.1}><Lantern len={len} /></SwayG>
        </g>
      ))}
      <StringLights x1={-400} y1={30} x2={-40} y2={20} sag={40} n={14} />
      <StringLights x1={440} y1={20} x2={800} y2={30} sag={40} n={14} />
      <FlowerStand x={-140} y={640} h={110} s={1.6} />
      <FlowerStand x={-300} y={660} h={80} s={1.3} />
      <FlowerStand x={540} y={640} h={110} s={1.6} />
      <FlowerStand x={700} y={660} h={80} s={1.3} />
    </g>
  )
}

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  return [
    { label: 'Days', value: Math.floor(ms / 864e5) },
    { label: 'Hours', value: Math.floor(ms / 36e5) % 24 },
    { label: 'Mins', value: Math.floor(ms / 6e4) % 60 },
    { label: 'Secs', value: Math.floor(ms / 1e3) % 60 },
  ]
}

function SketchCountdown({ to }: { to: string }) {
  const target = new Date(to).getTime()
  const [parts, setParts] = useState(() => diff(target))
  useEffect(() => {
    const id = setInterval(() => setParts(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  if (parts.every((p) => p.value === 0)) {
    return <p className="font-[family-name:var(--font-script)] text-3xl text-[var(--color-mauve-deep)]">Alhamdulillah — today is the day!</p>
  }
  return (
    <div className="mx-auto grid max-w-[300px] grid-cols-4 gap-2.5" role="timer">
      {parts.map((p, i) => (
        <div key={p.label} className="cd-tile relative flex flex-col items-center px-1.5 py-1.5">
          <svg viewBox="0 0 60 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <path className="sk sk-light" d={roughEllipse(30, 28, 27, 25, i + 3)} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="relative h-8 overflow-hidden" style={{ perspective: 200 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={p.value}
                className="block font-[family-name:var(--font-display)] text-[1.45rem] leading-8 text-[var(--color-ink)] tabular-nums"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {String(p.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="relative font-[family-name:var(--font-hand)] text-[1rem] leading-none text-[var(--color-blue-deep)]">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Scene 4 — a floral clock whose hands sweep round to the wedding time, with a countdown below. */
export function TimeScene() {
  const root = useRef<HTMLElement>(null)
  const e = wedding.event
  const s = gregorianParts(e.start)
  const d = new Date(e.start)
  const hh = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(d)) % 12
  const minutes = Number(e.start.slice(14, 16)) || 0 // local minutes, straight from the ISO time
  const hourAngle = hh * 30 + minutes * 0.5
  const minAngle = minutes * 6

  useSceneTimeline(root, (tl, q, el) => {
    drawSketch(tl, el.querySelector('.time-wide'), { at: 0, duration: 1.6, washAt: 1.2 })
    drawSketch(tl, el.querySelector('.clock'), { at: 0.1, duration: 1.6, washAt: 0.9 })
    tl.from(q('.clock-num'), { opacity: 0, duration: 0.4, stagger: 0.04 }, 1)
      .from(q('.wreath > g, .prop-bloom'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.04, ease: 'back.out(2)' }, 0.8)
      .fromTo(q('.hand-min'), { rotation: minAngle - 1080, svgOrigin: `${CX} ${CY}` }, { rotation: minAngle, svgOrigin: `${CX} ${CY}`, duration: 2.8, ease: 'power3.out' }, 1.2)
      .fromTo(q('.hand-hour'), { rotation: hourAngle - 360, svgOrigin: `${CX} ${CY}` }, { rotation: hourAngle, svgOrigin: `${CX} ${CY}`, duration: 2.8, ease: 'power3.out' }, 1.2)
      .from(q('.t-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.8, stagger: 0.15 }, 1.4)
      .from(q('.cd-tile'), { opacity: 0, y: 10, duration: 0.6, stagger: 0.1 }, 3)
  })

  return (
    <section ref={root} className="scene h-[100svh]">
      <Page>
        <Sketch wide={<TimeWide />}>
          <g className="clock"><ClockFace /></g>
          <Wreath />
          <Hands />
        </Sketch>
        <div style={at(200, 40, 360)} className="flex flex-col items-center text-center">
          <p className="t-in arabic text-[clamp(1.1rem,5.5cqw,1.5rem)] text-[var(--color-mauve-deep)]">{e.arabicTitle}</p>
          <p className="t-in font-[family-name:var(--font-script)] text-[clamp(2.1rem,10.5cqw,3rem)] leading-tight text-[var(--color-ink)]">{e.title}</p>
          <p className="t-in mt-1 font-[family-name:var(--font-display)] text-[clamp(0.6rem,2.8cqw,0.78rem)] tracking-[0.25em] text-[var(--color-blue-deep)] uppercase">{s.weekday} · {s.day} {s.month} {s.year}</p>
        </div>
        <div style={at(200, 428, 360)} className="flex flex-col items-center text-center">
          <p className="t-in font-[family-name:var(--font-display)] text-[clamp(2rem,11cqw,3.2rem)] leading-none text-[var(--color-ink)]">{s.time}</p>
          <p className="t-in hand mt-1 text-[clamp(1rem,5cqw,1.4rem)] text-[var(--color-pencil)]">{e.note ?? 'Onwards'}</p>
          <p className="t-in hand mt-3 mb-2 text-[clamp(1rem,5cqw,1.3rem)] text-[var(--color-mauve-deep)]">Counting the moments…</p>
          <SketchCountdown to={e.start} />
        </div>
      </Page>
    </section>
  )
}
