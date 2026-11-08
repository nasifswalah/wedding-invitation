import { useRef } from 'react'
import { useSceneTimeline } from '../story/scene'
import { drawSketch } from '../sketch/sketch'
import { HangingFlorals } from '../components/garden/HangingFlorals'
import { Plant } from '../components/garden/botanical'
import { triggerGust } from '../components/garden/wind'
import { wedding, type Person } from '../config/wedding'
import { gregorianParts } from '../lib/dates'
import { Page, Sketch } from './Page'

/** Pencil sketch of the wedding stage: platform, carved arch, drapes, seat and urns. */
function StageSketch() {
  return (
    <g filter="url(#pencil)">
      <path className="wash" d="M92 595 L92 306 C 92 222 170 196 200 152 C 230 196 308 222 308 306 L308 595Z" fill="#d3e0ea" opacity="0.35" filter="url(#wash)" />
      <path className="sk" d="M10 642 L390 642" />
      <path className="sk" d="M36 642 L36 612 L364 612 L364 642" />
      <path className="sk sk-light" d="M60 612 L72 596 L328 596 L340 612" />
      <path className="sk" d="M70 596 L70 300 C 70 200 160 172 200 118 C 240 172 330 200 330 300 L330 596" />
      <path className="sk sk-light" d="M92 596 L92 306 C 92 222 170 196 200 152 C 230 196 308 222 308 306 L308 596" />
      <path className="sk sk-light" d="M60 300 L80 300 M320 300 L340 300 M62 290 L78 290 M322 290 L338 290" />
      <path className="sk sk-light" d="M98 312 C 128 380 112 470 124 594" />
      <path className="sk sk-light" d="M302 312 C 272 380 288 470 276 594" />
      <path className="sk sk-light" d="M150 594 L150 566 C 150 542 250 542 250 566 L250 594 M144 576 L256 576" />
      <path className="sk" d="M26 612 C 22 588 30 580 40 578 L60 578 C 70 580 78 588 74 612 M34 578 L66 578" />
      <path className="sk" d="M326 612 C 322 588 330 580 340 578 L360 578 C 370 580 378 588 374 612 M334 578 L366 578" />
    </g>
  )
}

function Urns() {
  return (
    <g>
      <Plant x={44} y={578} h={70} bend={-14} kind="hydrangea" size={13} leaves={2} amp={3} phase={1} />
      <Plant x={56} y={578} h={52} bend={10} kind="rose" size={10} leaves={1} amp={3.5} phase={2} />
      <Plant x={50} y={578} h={40} bend={-2} kind="spray" size={9} leaves={0} amp={4} phase={3} />
      <Plant x={356} y={578} h={70} bend={14} kind="hydrangea" size={13} leaves={2} amp={3} phase={4} dir={-1} />
      <Plant x={344} y={578} h={52} bend={-10} kind="peach" size={10} leaves={1} amp={3.5} phase={5} dir={-1} />
      <Plant x={350} y={578} h={40} bend={2} kind="spray" size={9} leaves={0} amp={4} phase={6} dir={-1} />
    </g>
  )
}

function Written({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
          {w > 0 && <span className="inline-block w-[0.25em]" />}
          {Array.from(word).map((c, i) => <span key={i} className="name-letter inline-block">{c}</span>)}
        </span>
      ))}
    </span>
  )
}

function PersonBlock({ p, side }: { p: Person; side: string }) {
  return (
    <div className={`person-${side} flex flex-col items-center`}>
      <h1 className="font-[family-name:var(--font-script)] text-[clamp(2.4rem,11.5cqw,3.6rem)] leading-[1.15] text-[var(--color-ink)]">
        <Written text={p.name} />
      </h1>
      <p className="fade mt-1 font-[family-name:var(--font-display)] text-[clamp(0.55rem,2.6cqw,0.72rem)] tracking-[0.3em] text-[var(--color-blue-deep)] uppercase">{p.relation}</p>
      <p className="fade text-[clamp(0.92rem,4.4cqw,1.15rem)] leading-snug text-[var(--color-ink)]">
        {p.father} <span className="text-[var(--color-mauve)]">&amp;</span> {p.mother}
      </p>
      {p.family && <p className="fade text-[clamp(0.8rem,3.8cqw,1rem)] italic text-[var(--color-pencil)]">{p.family}</p>}
    </div>
  )
}

/** Scene 2 — the stage, the hanging flowers and the couple's names. Ends with a gust. */
export function Names({ gustAt }: { gustAt?: number }) {
  const root = useRef<HTMLElement>(null)
  const g = gregorianParts(wedding.event.start)

  useSceneTimeline(root, (tl, q, el) => {
    tl.from(q('.strand'), { y: -320, duration: 1.8, ease: 'power3.out', stagger: { each: 0.035, from: 'edges' } }, 0)
    drawSketch(tl, el.querySelector('.stage'), { at: 0.4, duration: 2.2, washAt: 2 })
    tl.from(q('.urns'), { opacity: 0, y: 14, duration: 1 }, 1.6)
      .from(q('.eyebrow-in'), { opacity: 0, y: 8, duration: 0.8 }, 1.4)
      .from(q('.person-bride .name-letter'), { opacity: 0, y: 14, filter: 'blur(4px)', duration: 0.7, stagger: 0.045 }, 1.8)
      .from(q('.person-bride .fade'), { opacity: 0, y: 6, duration: 0.6, stagger: 0.1 }, '-=0.3')
      .from(q('.amp'), { opacity: 0, scale: 0.5, duration: 0.8, ease: 'back.out(2)' }, '-=0.3')
      .from(q('.person-groom .name-letter'), { opacity: 0, y: 14, filter: 'blur(4px)', duration: 0.7, stagger: 0.045 }, '-=0.4')
      .from(q('.person-groom .fade'), { opacity: 0, y: 6, duration: 0.6, stagger: 0.1 }, '-=0.3')
      .from(q('.date-line'), { opacity: 0, y: 6, duration: 0.8 }, '-=0.2')
    // the breeze picks up and shakes petals loose
    tl.call(() => triggerGust(2.6), [], gustAt ?? '+=0.6')
  })

  return (
    <section ref={root} className="scene h-[100svh]">
      <Page>
        <Sketch>
          <g className="stage"><StageSketch /></g>
          <g className="urns"><Urns /></g>
        </Sketch>
        <div className="absolute inset-x-[4%] top-[25%] flex flex-col items-center text-center">
          <div className="pointer-events-none absolute inset-x-[-6%] inset-y-[-6%] -z-10" style={{ background: 'radial-gradient(closest-side, rgba(253,250,244,0.9), rgba(253,250,244,0.5) 60%, rgba(253,250,244,0))' }} />
          <p className="eyebrow-in eyebrow mb-3 !text-[clamp(0.55rem,2.5cqw,0.7rem)]">Together with their families</p>
          <PersonBlock p={wedding.bride} side="bride" />
          <span className="amp my-1.5 font-[family-name:var(--font-script)] text-[clamp(2rem,9cqw,2.8rem)] leading-none text-[var(--color-mauve)]">&amp;</span>
          <PersonBlock p={wedding.groom} side="groom" />
          <p className="date-line mt-4 font-[family-name:var(--font-display)] text-[clamp(0.7rem,3.2cqw,0.9rem)] tracking-[0.3em] text-[var(--color-blue-deep)] uppercase">
            {g.day} · {g.month} · {g.year}
          </p>
        </div>
      </Page>
      <HangingFlorals className="absolute inset-x-0 top-0 h-[50svh]" />
    </section>
  )
}
