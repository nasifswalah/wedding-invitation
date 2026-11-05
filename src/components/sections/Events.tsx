import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { wedding, type WeddingEvent } from '../../config/wedding'
import { gregorianParts } from '../../lib/dates'
import { downloadIcs, googleCalendarUrl } from '../../lib/calendar'
import { SectionHeading } from '../ui/Ornament'
import { prefersReducedMotion } from '../../lib/motion'

function Door({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right'
  return (
    <div
      className={`door door-${side} absolute inset-y-0 ${flip ? 'right-0 rounded-r-[26px]' : 'left-0 rounded-l-[26px]'} w-1/2 overflow-hidden`}
      style={{ transformOrigin: flip ? 'right center' : 'left center' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #6f8a66 0%, #5d7556 50%, #4c6347 100%)',
          boxShadow: flip ? 'inset 12px 0 24px -12px rgba(0,0,0,0.35)' : 'inset -12px 0 24px -12px rgba(0,0,0,0.35)',
        }}
      />
      {/* carved inlay */}
      <svg viewBox="0 0 100 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
        <path d="M14 392 L14 120 C 14 70 50 50 72 36 C 82 30 86 22 88 12 L 88 392Z" fill="none" stroke="#d9bd7f" strokeOpacity="0.75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d="M24 384 L24 126 C 24 84 54 66 72 54 C 79 49 82 44 82 38 L 82 384Z" fill="none" stroke="#d9bd7f" strokeOpacity="0.35" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* handle */}
      <div className={`absolute top-1/2 ${flip ? 'left-3' : 'right-3'} h-10 w-2.5 -translate-y-1/2 rounded-full`} style={{ background: 'linear-gradient(180deg, #f0dca4, #a7823f)' }} />
    </div>
  )
}

function EventCard({ e, i }: { e: WeddingEvent; i: number }) {
  const s = gregorianParts(e.start)
  const end = gregorianParts(e.end)
  return (
    <motion.article
      className="card relative overflow-hidden px-6 pt-8 pb-7 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(230,205,143,0.35), transparent)' }} />
      <p className="arabic text-[1.7rem] leading-tight text-[var(--color-gold)]">{e.arabicTitle}</p>
      <h3 className="mt-1 font-[family-name:var(--font-script)] text-[2.6rem] leading-tight text-[var(--color-moss)]">{e.title}</h3>

      <div className="mx-auto my-5 flex flex-col items-center gap-1.5 font-[family-name:var(--font-display)] text-[var(--color-ink)]">
        <span className="text-[0.78rem] tracking-[0.25em] text-[var(--color-sage-deep)] uppercase">{s.weekday} · {s.day} {s.month}</span>
        <span className="flex items-center gap-3 text-lg tracking-[0.12em] whitespace-nowrap text-[var(--color-gold-deep)]">
          <span className="h-px w-6 bg-[var(--color-gold)]" />
          {s.time} – {end.time}
          <span className="h-px w-6 bg-[var(--color-gold)]" />
        </span>
      </div>

      <p className="text-xl font-semibold text-[var(--color-ink)]">{e.venue.name}</p>
      <p className="mt-0.5 text-[1rem] text-[var(--color-ink-soft)]">{e.venue.address}</p>
      {e.note && <p className="mt-2 text-[0.95rem] italic text-[var(--color-sage-deep)]">{e.note}</p>}

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-2.5">
        <a className="btn btn-gold col-span-2" href={`#venue-${e.id}`} onClick={(ev) => {
          ev.preventDefault()
          window.dispatchEvent(new CustomEvent('show-venue', { detail: e.id }))
          document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })
        }}>
          Directions
        </a>
        <a className="btn btn-outline !px-2 !text-[0.66rem]" href={googleCalendarUrl(e)} target="_blank" rel="noopener noreferrer">+ Google Cal</a>
        <button className="btn btn-outline !px-2 !text-[0.66rem]" onClick={() => downloadIcs(e)}>+ Apple / ICS</button>
      </div>
    </motion.article>
  )
}

/**
 * Date → Events: two carved garden doors swing open as you arrive,
 * revealing the ceremonies behind them.
 */
export function Events() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.door', { display: 'none' })
        return
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.door-stage', start: 'top 78%', end: 'top 18%', scrub: 0.9 },
      })
      tl.to('.door-left', { rotateY: 88, xPercent: -18, ease: 'power2.in' }, 0)
        .to('.door-right', { rotateY: -88, xPercent: 18, ease: 'power2.in' }, 0)
        .to('.door', { opacity: 0, duration: 0.25 }, 0.75)
        .fromTo('.door-glow', { opacity: 0.9 }, { opacity: 0, duration: 0.6 }, 0.4)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="events" className="relative px-5 pb-16 sm:pb-24">
      <SectionHeading eyebrow="Celebrations" title="Join Us For" arabic="أَهْلًا وَسَهْلًا" />
      <div className="door-stage relative mx-auto max-w-3xl" style={{ perspective: 1200 }}>
        <div className="grid gap-6 sm:grid-cols-2">
          {wedding.events.map((e, i) => <EventCard key={e.id} e={e} i={i} />)}
        </div>
        <div className="pointer-events-none absolute -inset-2 z-10 overflow-visible rounded-[26px]" aria-hidden style={{ transformStyle: 'preserve-3d' }}>
          <div className="door-glow absolute inset-0 rounded-[26px]" style={{ background: 'radial-gradient(closest-side, rgba(255,240,200,0.9), rgba(255,240,200,0))' }} />
          <Door side="left" />
          <Door side="right" />
        </div>
      </div>
    </section>
  )
}
