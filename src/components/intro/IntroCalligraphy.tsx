import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { wedding } from '../../config/wedding'
import { prefersReducedMotion } from '../../lib/motion'

const BISMILLAH = 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
const DUA = ['بَارَكَ ٱللَّٰهُ لَكُمَا', 'وَبَارَكَ عَلَيْكُمَا', 'وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ']

function Seal({ onOpen }: { onOpen: () => void }) {
  const { bride, groom } = wedding.shortNames
  return (
    <motion.div
      key="gate"
      className="flex flex-col items-center px-6 text-center"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)', transition: { duration: 0.9, ease: 'easeIn' } }}
    >
      <p className="eyebrow mb-8">You are cordially invited</p>
      <button
        onClick={onOpen}
        className="group relative grid h-44 w-44 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
        aria-label="Open the invitation"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-gold-light)] opacity-20 [animation-duration:2.6s]" />
        <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:rotate-12">
          <path
            d={Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2
              const r = i % 2 ? 90 : 96
              return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
            }).join(' ') + 'Z'}
            fill="url(#g-gold)"
          />
          <circle r="80" fill="none" stroke="#fff6dc" strokeOpacity="0.55" strokeWidth="1" />
          <circle r="72" fill="none" stroke="#8a6a2f" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="2 4" />
        </svg>
        <span className="relative font-[family-name:var(--font-script)] text-[2.6rem] leading-none text-[#fff8e6] drop-shadow-[0_1px_1px_rgba(90,60,20,0.5)]">
          {bride[0]}<span className="mx-1 text-2xl">&amp;</span>{groom[0]}
        </span>
      </button>
      <p className="mt-9 font-[family-name:var(--font-display)] text-xs tracking-[0.3em] text-[var(--color-ink-soft)] uppercase">
        Tap the seal to open
      </p>
    </motion.div>
  )
}

function Writing({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = gsap.utils.selector(root)
    const reduced = prefersReducedMotion()
    const tl = gsap.timeline({ onComplete: onDone, defaults: { ease: 'power2.out' } })

    if (reduced) {
      tl.set(q('.feather'), { x: -760 })
        .to(q('.basmala-text'), { fillOpacity: 1, duration: 0.6 })
        .to(q('.basmala-en'), { opacity: 1, duration: 0.6 })
        .to(q('.dua-line, .dua-en'), { opacity: 1, duration: 0.6 }, '+=0.8')
        .to({}, { duration: 2 })
      return () => { tl.kill() }
    }

    tl.set(q('.basmala-text'), { strokeDasharray: 900, strokeDashoffset: 900, fillOpacity: 0 })
      // the pen writes right → left
      .to(q('.feather'), { x: -760, duration: 3.4, ease: 'power1.inOut' }, 0.2)
      .fromTo(q('.pen'), { x: 560, opacity: 0 }, { x: 40, opacity: 1, duration: 3.4, ease: 'power1.inOut' }, 0.2)
      .to(q('.pen'), { opacity: 0, duration: 0.5 }, '>-0.3')
      .to(q('.basmala-text'), { strokeDashoffset: 0, duration: 3.6, ease: 'power1.inOut' }, 0.2)
      .to(q('.basmala-text'), { fillOpacity: 1, duration: 1.4 }, 2.4)
      .to(q('.basmala-text'), { strokeOpacity: 0.25, duration: 1 }, 3.2)
      .fromTo(q('.basmala-glow'), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.6 }, 2.8)
      .fromTo(q('.basmala-en'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1 }, 3.4)
      .to({}, { duration: 1.1 })
      // bismillah rises, du'a blooms in phrase by phrase
      .to(q('.basmala'), { y: -18, scale: 0.84, duration: 1.2, ease: 'power3.inOut' })
      .fromTo(q('.divider'), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1, ease: 'power3.out' }, '<0.3')
      .fromTo(
        q('.dua-line'),
        { opacity: 0, y: 14, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.75 },
        '<0.3',
      )
      .fromTo(q('.dua-en'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1, stagger: 0.25 }, '-=0.4')
      .to({}, { duration: 2.4 })

    return () => { tl.kill() }
  }, [onDone])

  return (
    <motion.div
      key="writing"
      ref={root}
      className="flex w-full max-w-[640px] flex-col items-center px-5 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      <div className="basmala relative w-full">
        <div className="basmala-glow pointer-events-none absolute inset-x-[10%] top-1/2 h-24 -translate-y-1/2 rounded-full opacity-0"
          style={{ background: 'radial-gradient(closest-side, rgba(230,205,143,0.45), rgba(230,205,143,0))' }} />
        <svg viewBox="0 0 600 170" className="relative w-full" role="img" aria-label="Bismillah ir-Rahman ir-Raheem">
          <defs>
            <linearGradient id="feather-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.16" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="write-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="170">
              <rect className="feather" x="600" y="0" width="760" height="170" fill="url(#feather-grad)" />
            </mask>
            <radialGradient id="pen-glow">
              <stop offset="0" stopColor="#fff6d8" />
              <stop offset="0.4" stopColor="#e6cd8f" stopOpacity="0.8" />
              <stop offset="1" stopColor="#e6cd8f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g mask="url(#write-mask)">
            <text
              className="basmala-text"
              x="300" y="112" textAnchor="middle" direction="rtl"
              fontFamily="Amiri, serif" fontSize="66"
              fill="url(#g-gold)" stroke="#a7823f" strokeWidth="0.9"
            >
              {BISMILLAH}
            </text>
          </g>
          <circle className="pen" cx="0" cy="92" r="16" fill="url(#pen-glow)" opacity="0" />
        </svg>
        <p className="basmala-en -mt-1 font-[family-name:var(--font-serif)] text-[0.95rem] italic text-[var(--color-ink-soft)] opacity-0 sm:text-lg">
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>
      </div>

      <div className="divider my-6 h-px w-40 origin-center bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-0" />

      <div className="arabic flex flex-col gap-1 font-[family-name:var(--font-ruqaa)] text-[1.9rem] leading-[1.6] text-[var(--color-gold-deep)] sm:text-[2.4rem]">
        {DUA.map((l) => (
          <span key={l} className="dua-line block opacity-0">{l}</span>
        ))}
      </div>
      <p className="dua-en mt-5 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.25em] text-[var(--color-gold-deep)] uppercase opacity-0">
        Bārakallāhu lakumā wa bāraka ʿalaykumā wa jamaʿa baynakumā fī khayr
      </p>
      <p className="dua-en mt-2 max-w-sm text-[0.98rem] italic text-[var(--color-ink-soft)] opacity-0">
        May Allah bless you both, shower His blessings upon you, and unite you in goodness.
      </p>
    </motion.div>
  )
}

export function IntroCalligraphy({ onOpen, onDone }: { onOpen: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<'gate' | 'writing'>('gate')

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 50% 40%, #fbf6ea 0%, #f4ecd9 60%, #e9dec4 100%)' }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.04, transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] } }}
    >
      {/* fine geometric frame */}
      <svg className="pointer-events-none absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]" preserveAspectRatio="none" aria-hidden>
        <rect x="0.5" y="0.5" width="99.6%" height="99.6%" rx="18" fill="none" stroke="#b8924a" strokeOpacity="0.35" />
      </svg>
      <AnimatePresence mode="wait">
        {phase === 'gate' ? (
          <Seal
            key="gate"
            onOpen={() => {
              onOpen()
              setPhase('writing')
            }}
          />
        ) : (
          <Writing key="writing" onDone={onDone} />
        )}
      </AnimatePresence>
      {phase === 'writing' && (
        <button
          onClick={onDone}
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.3em] text-[var(--color-ink-soft)] uppercase opacity-70 transition-opacity hover:opacity-100"
          style={{ minHeight: 44, padding: '0 1rem' }}
        >
          Skip
        </button>
      )}
    </motion.div>
  )
}
