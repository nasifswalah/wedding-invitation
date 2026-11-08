import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSceneTimeline } from '../story/scene'
import { drawSketch, roughEllipse } from '../sketch/sketch'
import { SwayG } from '../components/garden/botanical'
import { wedding } from '../config/wedding'
import { gregorianParts } from '../lib/dates'
import { Page, Sketch, at } from './Page'

function DoorSketch() {
  return (
    <g filter="url(#pencil)">
      <path className="wash" d="M70 640 L70 330 C 70 236 150 196 200 150 C 250 196 330 236 330 330 L330 640Z" fill="#d3e0ea" opacity="0.3" filter="url(#wash)" />
      <path className="sk" d="M30 660 L370 660 L370 640 L30 640 Z" />
      <path className="sk" d="M50 640 L50 320 C 50 214 140 170 200 118 C 260 170 350 214 350 320 L350 640" />
      <path className="sk sk-light" d="M70 640 L70 330 C 70 236 150 196 200 150 C 250 196 330 236 330 330 L330 640" />
      <path className="sk sk-light" d="M200 572 L200 640 M84 580 L188 580 L188 632 L84 632 Z M212 580 L316 580 L316 632 L212 632 Z" />
      <path className="sk sk-light" d="M40 320 L60 320 M340 320 L360 320 M196 108 L200 96 L204 108" />
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
      <circle className="sk" cx={0} cy={L + 3} r={3} />
      <path className="sk sk-ink" d={`M-9 ${L + 14} L-5 ${L + 6} L5 ${L + 6} L9 ${L + 14} Z`} />
      <path className="sk sk-ink" d={`M-9 ${L + 14} C -19 ${L + 30} -19 ${L + 48} -8 ${L + 60} L8 ${L + 60} C 19 ${L + 48} 19 ${L + 30} 9 ${L + 14} Z`} />
      <path className="sk sk-light" d={`M0 ${L + 14} L0 ${L + 60} M-14 ${L + 37} L14 ${L + 37}`} />
      <path className="sk sk-ink" d={`M-8 ${L + 60} L-5 ${L + 68} L5 ${L + 68} L8 ${L + 60} M0 ${L + 68} L0 ${L + 78}`} />
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
    <div className="grid grid-cols-4 gap-[2.5cqw]" role="timer">
      {parts.map((p, i) => (
        <div key={p.label} className="cd-tile relative flex flex-col items-center px-[1.5cqw] py-[1.2cqw]">
          <svg viewBox="0 0 60 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <path className="sk sk-light" d={roughEllipse(30, 28, 27, 25, i + 3)} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="relative h-[8cqw] overflow-hidden" style={{ perspective: 200 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={p.value}
                className="block font-[family-name:var(--font-display)] text-[clamp(1.1rem,6.4cqw,1.8rem)] leading-[8cqw] text-[var(--color-ink)] tabular-nums"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                {String(p.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="relative font-[family-name:var(--font-hand)] text-[clamp(0.85rem,4cqw,1.1rem)] leading-none text-[var(--color-blue-deep)]">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Scene 4 — a lantern-lit doorway holding the time, with a countdown below. */
export function TimeScene() {
  const root = useRef<HTMLElement>(null)
  const e = wedding.event
  const s = gregorianParts(e.start)

  useSceneTimeline(root, (tl, q, el) => {
    drawSketch(tl, el.querySelector('.door'), { at: 0.1, duration: 1.8, washAt: 1.4 })
    drawSketch(tl, el.querySelector('.lanterns'), { at: 0.6, duration: 1.6, washAt: 1.8 })
    tl.from(q('.t-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.8, stagger: 0.2 }, 1.6)
      .from(q('.cd-tile'), { opacity: 0, y: 10, duration: 0.6, stagger: 0.12 }, '-=0.2')
  })

  return (
    <section ref={root} className="scene h-[100svh]">
      <Page>
        <Sketch>
          <g className="door"><DoorSketch /></g>
          <g className="lanterns">
            {[[60, 40, 0], [200, 30, 2], [340, 50, 4]].map(([x, len, ph]) => (
              <g key={x} transform={`translate(${x} -40)`}>
                <SwayG amp={2.4} phase={ph} stiffness={1.2}>
                  <Lantern len={len} />
                </SwayG>
              </g>
            ))}
          </g>
        </Sketch>
        <div style={at(200, 210, 250)} className="flex flex-col items-center text-center">
          <p className="t-in arabic text-[clamp(1.1rem,5.5cqw,1.5rem)] text-[var(--color-mauve-deep)]">{e.arabicTitle}</p>
          <p className="t-in font-[family-name:var(--font-script)] text-[clamp(2.2rem,11cqw,3.2rem)] leading-tight text-[var(--color-ink)]">{e.title}</p>
          <p className="t-in mt-2 font-[family-name:var(--font-display)] text-[clamp(0.6rem,2.8cqw,0.78rem)] tracking-[0.25em] text-[var(--color-blue-deep)] uppercase">{s.weekday} · {s.day} {s.month} {s.year}</p>
          <p className="t-in mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,11cqw,3.2rem)] leading-none text-[var(--color-ink)]">{s.time}</p>
          <p className="t-in hand mt-1 text-[clamp(1rem,5cqw,1.4rem)] text-[var(--color-pencil)]">{e.note ?? 'onwards'}</p>
        </div>
        <div style={at(200, 455, 290)}>
          <p className="t-in hand mb-2 text-center text-[clamp(1rem,5cqw,1.35rem)] text-[var(--color-mauve-deep)]">counting the moments…</p>
          <SketchCountdown to={e.start} />
        </div>
      </Page>
    </section>
  )
}
