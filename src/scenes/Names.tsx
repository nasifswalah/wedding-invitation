import { useRef } from 'react'
import gsap from 'gsap'
import { useSceneTimeline } from '../story/scene'
import { GardenScene } from '../components/garden/GardenScene'
import { wedding, type Person } from '../config/wedding'
import { gregorianParts } from '../lib/dates'

function Letters({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
          {w > 0 && <span className="inline-block w-[0.25em]" />}
          {Array.from(word).map((c, i) => (
            <span
              key={i}
              className="hero-letter inline-block"
              style={{ padding: '0.08em 0.2em 0.12em', margin: '-0.08em -0.2em -0.12em' }}
            >
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
    <div className={`hero-${side} flex flex-col items-center`}>
      <h1 className="text-[clamp(2.4rem,11.2vw,3.5rem)] leading-[1.1] text-[var(--color-ink)] sm:text-[5rem]" style={{ fontFamily: "'Ephesis', 'Great Vibes', cursive" }}>
        <Letters text={p.name} />
      </h1>
      <p className="hero-fade mt-2 font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.3em] text-[var(--color-blue-deep)] uppercase sm:text-xs">
        {p.relation}
      </p>
      <p className="hero-fade mt-1 text-[1.05rem] leading-snug text-[var(--color-ink)] sm:text-xl">
        {p.father} <span className="text-[var(--color-mauve)]">&amp;</span> {p.mother}
      </p>
      {p.family && <p className="hero-fade mt-0.5 text-[0.92rem] italic text-[var(--color-pencil)]">{p.family}</p>}
    </div>
  )
}

/** Scene 2 (the hero) — the living garden, hanging flowers and the couple's names. */
export function Names() {
  const root = useRef<HTMLElement>(null)
  const g = gregorianParts(wedding.event.start)

  const mode = useSceneTimeline(root, (tl, q, el) => {
    tl.fromTo(q('.garden-rise'), { yPercent: 10, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2.6, ease: 'power2.out' }, 0)
      .from(q('.hero-eyebrow'), { opacity: 0, y: 12, duration: 1 }, 0.6)
      .from(q('.hero-groom .hero-letter'), { opacity: 0, y: 26, rotate: -8, filter: 'blur(6px)', duration: 1.1, stagger: 0.06 }, 0.9)
      .from(q('.hero-groom .hero-fade'), { opacity: 0, y: 12, duration: 0.9, stagger: 0.12 }, '-=0.6')
      .from(q('.hero-amp'), { opacity: 0, scale: 0.4, rotate: -40, duration: 1.2, ease: 'back.out(1.8)' }, '-=0.5')
      .from(q('.hero-bride .hero-letter'), { opacity: 0, y: 26, rotate: 8, filter: 'blur(6px)', duration: 1.1, stagger: 0.06 }, '-=0.7')
      .from(q('.hero-bride .hero-fade'), { opacity: 0, y: 12, duration: 0.9, stagger: 0.12 }, '-=0.6')
      .from(q('.hero-date'), { opacity: 0, y: 12, duration: 1 }, '-=0.4')
      .from(q('.scroll-wrap'), { opacity: 0, duration: 1 }, '-=0.3')
    void el
  })

  // on the scroll page, the names drift up and soften as the guest scrolls away
  useSceneTimeline(root, (_tl, q, el) => {
    if (mode !== 'scroll') return
    gsap.to(q('.hero-content'), {
      yPercent: -12, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
  })

  return (
    <section ref={root} id="home" className={`scene relative flex ${mode === 'trailer' ? 'h-[100svh]' : 'min-h-[100svh]'} items-center justify-center overflow-hidden`}>
      <div className="garden-rise absolute inset-0">
        <GardenScene />
      </div>

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-6 pt-[16svh] pb-[22svh] text-center sm:pt-[18svh]">
        <div
          className="pointer-events-none absolute inset-x-[-10%] inset-y-[8%] -z-10"
          style={{ background: 'radial-gradient(closest-side, rgba(42,10,18,0.82), rgba(42,10,18,0.5) 55%, rgba(42,10,18,0))' }}
        />
        <p className="hero-eyebrow eyebrow mb-5">Together with their families</p>

        <PersonBlock p={wedding.groom} side="groom" />

        <div className="hero-amp my-4 flex items-center gap-3 sm:my-6">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-mauve)]" />
          <svg viewBox="0 0 60 40" className="h-9 w-14" aria-hidden>
            <circle cx="23" cy="22" r="11" fill="none" stroke="#cbb59c" strokeWidth="1.6" />
            <circle cx="37" cy="22" r="11" fill="none" stroke="#d9a88f" strokeWidth="1.6" />
            <path d="M37 7 l3 4 l-3 3 l-3 -3z" fill="#8e3344" stroke="#e6b59c" strokeWidth="0.6" />
          </svg>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-mauve)]" />
        </div>

        <PersonBlock p={wedding.bride} side="bride" />

        <div className="hero-date mt-8 flex items-center gap-3 font-[family-name:var(--font-display)] text-sm tracking-[0.3em] text-[var(--color-blue-deep)] sm:text-base">
          <span>{g.day}</span>
          <span className="h-1 w-1 rotate-45 bg-[var(--color-mauve)]" />
          <span className="uppercase">{g.month}</span>
          <span className="h-1 w-1 rotate-45 bg-[var(--color-mauve)]" />
          <span>{g.year}</span>
        </div>

      </div>

      {mode === 'scroll' && (
        <div className="scroll-wrap absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 text-center">
          <div className="scroll-cue flex flex-col items-center gap-1 text-[var(--color-mauve-deep)]">
            <span className="font-[family-name:var(--font-display)] text-[0.6rem] tracking-[0.35em] uppercase">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" aria-hidden>
              <path d="M8 2 C 12 8 12 14 8 22 C 4 14 4 8 8 2Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M8 6 L8 18" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      )}
    </section>
  )
}
