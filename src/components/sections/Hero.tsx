import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { GardenScene } from '../garden/GardenScene'
import { wedding, type Person } from '../../config/wedding'
import { gregorianParts } from '../../lib/dates'
import { prefersReducedMotion } from '../../lib/motion'

function Letters({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
          {w > 0 && <span className="inline-block w-[0.25em]" />}
          {Array.from(word).map((c, i) => (
            <span key={i} className="hero-letter gold-text inline-block" style={{ padding: '0.08em 0.2em 0.12em', margin: '-0.08em -0.2em -0.12em' }}>
              {c}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

function PersonBlock({ p, side }: { p: Person; side: 'bride' | 'groom' }) {
  return (
    <div className={`hero-person hero-${side} flex flex-col items-center`}>
      <h1 className="font-[family-name:var(--font-script)] text-[clamp(2.5rem,12.5vw,3.2rem)] leading-[1.1] sm:text-7xl">
        <Letters text={p.name} />
      </h1>
      <p className="hero-fade mt-2 font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.3em] text-[var(--color-sage-deep)] uppercase sm:text-xs">
        {p.relation}
      </p>
      <p className="hero-fade mt-1 text-[1.05rem] leading-snug text-[var(--color-ink)] sm:text-xl">
        {p.father} <span className="text-[var(--color-gold)]">&amp;</span> {p.mother}
      </p>
      {p.family && <p className="hero-fade mt-0.5 text-[0.92rem] italic text-[var(--color-ink-soft)]">{p.family}</p>}
    </div>
  )
}

export function Hero({ revealed }: { revealed: boolean }) {
  const root = useRef<HTMLElement>(null)
  const g = gregorianParts(wedding.events[0].start)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      if (!revealed) {
        gsap.set(q('.hero-letter, .hero-fade, .hero-amp, .hero-eyebrow, .hero-date, .scroll-wrap'), { opacity: 0 })
        gsap.set(q('.garden-rise'), { opacity: 0, yPercent: 10 })
        return
      }
      if (prefersReducedMotion()) {
        gsap.to(q('.garden-rise, .hero-letter, .hero-fade, .hero-amp, .hero-eyebrow, .hero-date, .scroll-wrap'), { opacity: 1, yPercent: 0, duration: 0.8 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(q('.garden-rise'), { yPercent: 10, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2.6, ease: 'power2.out' }, 0)
        .to(q('.hero-eyebrow'), { opacity: 1, y: 0, duration: 1 }, 0.6)
        .fromTo(
          q('.hero-bride .hero-letter'),
          { opacity: 0, y: 26, rotate: -8, filter: 'blur(6px)' },
          { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.06 },
          0.9,
        )
        .to(q('.hero-bride .hero-fade'), { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.6')
        .fromTo(q('.hero-amp'), { opacity: 0, scale: 0.4, rotate: -40 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.8)' }, '-=0.5')
        .fromTo(
          q('.hero-groom .hero-letter'),
          { opacity: 0, y: 26, rotate: 8, filter: 'blur(6px)' },
          { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.06 },
          '-=0.7',
        )
        .to(q('.hero-groom .hero-fade'), { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.6')
        .to(q('.hero-date'), { opacity: 1, y: 0, duration: 1 }, '-=0.4')
        .to(q('.scroll-wrap'), { opacity: 1, duration: 1 }, '-=0.3')
      gsap.set(q('.hero-fade, .hero-eyebrow, .hero-date'), { y: 12 })

      // as the guest scrolls away, the names drift up and soften
      gsap.to(q('.hero-content'), {
        yPercent: -12, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root, dependencies: [revealed] },
  )

  return (
    <section ref={root} id="home" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="garden-rise absolute inset-0">
        <GardenScene />
      </div>

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-6 pt-[16svh] pb-[22svh] text-center sm:pt-[18svh]">
        <div
          className="pointer-events-none absolute inset-x-[-10%] inset-y-[8%] -z-10"
          style={{ background: 'radial-gradient(closest-side, rgba(251,247,238,0.92), rgba(251,247,238,0.6) 55%, rgba(251,247,238,0))' }}
        />
        <p className="hero-eyebrow eyebrow mb-5">Together with their families</p>

        <PersonBlock p={wedding.bride} side="bride" />

        <div className="hero-amp my-4 flex items-center gap-3 sm:my-6">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
          <svg viewBox="0 0 60 40" className="h-9 w-14" aria-hidden>
            <circle cx="23" cy="22" r="11" fill="none" stroke="url(#g-gold)" strokeWidth="1.8" />
            <circle cx="37" cy="22" r="11" fill="none" stroke="url(#g-gold)" strokeWidth="1.8" />
            <path d="M37 7 l3 4 l-3 3 l-3 -3z" fill="#e6cd8f" stroke="#a7823f" strokeWidth="0.6" />
          </svg>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
        </div>

        <PersonBlock p={wedding.groom} side="groom" />

        <div className="hero-date mt-8 flex items-center gap-3 font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-[var(--color-moss)] sm:text-base">
          <span>{g.day}</span>
          <span className="h-1 w-1 rotate-45 bg-[var(--color-gold)]" />
          <span className="uppercase">{g.month}</span>
          <span className="h-1 w-1 rotate-45 bg-[var(--color-gold)]" />
          <span>{g.year}</span>
        </div>
      </div>

      <div className="scroll-wrap absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="scroll-cue flex flex-col items-center gap-1 text-[var(--color-gold-deep)]">
          <span className="font-[family-name:var(--font-display)] text-[0.6rem] tracking-[0.35em] uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" aria-hidden>
            <path d="M8 2 C 12 8 12 14 8 22 C 4 14 4 8 8 2Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M8 6 L8 18" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
    </section>
  )
}
