import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../../config/wedding'
import { SectionHeading } from '../ui/Ornament'
import { Leaf } from '../garden/botanical'
import { prefersReducedMotion } from '../../lib/motion'

const TRAIL = 'M40 10 C 120 30 20 90 120 120 S 260 140 220 200 S 120 250 160 292'

/** A trail of petals winds down to a pin that drops onto the venue. */
function PetalTrail() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const path = root.current!.querySelector<SVGPathElement>('.trail')!
      const len = path.getTotalLength()
      const dots = gsap.utils.toArray<SVGGElement>('.trail-petal', root.current)
      dots.forEach((d, i) => {
        const p = path.getPointAtLength((len * (i + 0.5)) / dots.length)
        d.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${(i * 47) % 360})`)
      })
      const inner = dots.map((d) => d.firstElementChild!)
      if (prefersReducedMotion()) return
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(inner, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set('.pin', { y: -60, opacity: 0 })
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 60%', scrub: 0.8 } })
      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
      inner.forEach((el, i) => tl.to(el, { scale: 1, duration: 0.08, ease: 'back.out(3)' }, (i / inner.length) * 0.9))
      tl.to('.pin', { y: 0, opacity: 1, duration: 0.18, ease: 'bounce.out' }, 0.86)
      tl.fromTo('.pin-ring', { scale: 0, opacity: 0.8 }, { scale: 1, opacity: 0, duration: 0.14, transformOrigin: '50% 50%' }, 0.98)
    },
    { scope: root },
  )
  return (
    <div ref={root} className="mx-auto -mt-2 mb-4 w-[220px] sm:w-[260px]" aria-hidden>
      <svg viewBox="0 0 260 330" className="w-full" style={{ overflow: 'visible' }}>
        <path className="trail" d={TRAIL} fill="none" stroke="#b8924a" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="3 6" strokeLinecap="round" />
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i} className="trail-petal">
            <g>
              <path d="M0 6 C 5 2 4 -4 0 -6 C -1 -3 -5 -1 0 6Z" fill={i % 3 ? '#efc2b5' : '#fffaf0'} stroke="#d99a8c" strokeWidth="0.4" />
            </g>
          </g>
        ))}
        <g transform="translate(160 300)">
          <ellipse className="pin-ring" rx="22" ry="7" fill="none" stroke="#b8924a" strokeWidth="1.2" />
          <ellipse rx="10" ry="3" fill="#3f5541" opacity="0.18" />
          <g className="pin">
            <path d="M0 0 C -4 -10 -16 -18 -16 -30 A 16 16 0 1 1 16 -30 C 16 -18 4 -10 0 0Z" fill="url(#g-gold)" stroke="#8a6a2f" strokeWidth="0.8" />
            <circle cy="-30" r="6.5" fill="#fbf7ee" />
            <circle cy="-30" r="3" fill="#c98577" />
          </g>
        </g>
      </svg>
    </div>
  )
}

function MapEmbed({ query, title }: { query: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: '300px' })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-[rgba(184,146,74,0.35)] bg-[var(--color-ivory-deep)] sm:aspect-[16/9]">
      {show && (
        <iframe
          title={`Map — ${title}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
          className="absolute inset-0 h-full w-full"
          style={{ border: 0, filter: 'sepia(0.25) saturate(0.85)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  )
}

export function Location() {
  const events = wedding.events
  const [active, setActive] = useState(events[0].id)
  const e = events.find((x) => x.id === active) ?? events[0]
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const on = (ev: Event) => setActive((ev as CustomEvent<string>).detail)
    window.addEventListener('show-venue', on)
    return () => window.removeEventListener('show-venue', on)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${e.venue.name}, ${e.venue.address}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <section id="location" className="relative px-5 pb-16 sm:pb-24">
      <SectionHeading eyebrow="Finding your way" title="The Venue" arabic="مَكَانُ الحَفْل" />
      <PetalTrail />

      <div className="mx-auto max-w-2xl">
        {events.length > 1 && (
          <div className="mx-auto mb-5 flex w-fit rounded-full border border-[rgba(184,146,74,0.45)] bg-[rgba(251,247,238,0.7)] p-1" role="tablist">
            {events.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === active}
                onClick={() => setActive(x.id)}
                className="relative min-h-[44px] rounded-full px-5 font-[family-name:var(--font-display)] text-[0.72rem] tracking-[0.18em] uppercase"
              >
                {x.id === active && (
                  <motion.span layoutId="venue-pill" className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#a7823f,#d4b26d_50%,#a7823f)]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className={`relative ${x.id === active ? 'text-[#fffaf0]' : 'text-[var(--color-gold-deep)]'}`}>{x.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={e.id}
            id={`venue-${e.id}`}
            className="card p-6 sm:p-9"
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center">
              <p className="eyebrow">{e.title}</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">{e.venue.name}</h3>
              <p className="mt-1 text-[var(--color-ink-soft)]">{e.venue.address}</p>
            </div>

            <ol className="mt-7 space-y-4">
              {e.venue.directions.map((step, i) => (
                <motion.li
                  key={step}
                  className="flex gap-3.5"
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
                >
                  <span className="relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center">
                    <svg viewBox="-12 -24 24 26" className="absolute inset-0 h-full w-full" aria-hidden>
                      <g transform="rotate(45 0 -11)"><Leaf w={10} l={24} fill="url(#g-leaf)" vein={false} /></g>
                    </svg>
                    <span className="relative font-[family-name:var(--font-display)] text-[0.7rem] font-semibold text-[#fffaf0]">{i + 1}</span>
                  </span>
                  <span className="text-[1.04rem] leading-relaxed text-[var(--color-ink)]">{step}</span>
                </motion.li>
              ))}
            </ol>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a className="btn btn-gold" href={e.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                Open in Google Maps
              </a>
              <button className="btn btn-outline" onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
            </div>

            <MapEmbed query={e.venue.embedQuery} title={e.venue.name} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
