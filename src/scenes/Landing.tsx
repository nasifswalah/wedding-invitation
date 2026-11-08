import { useRef } from 'react'
import { useSceneTimeline } from '../story/scene'
import { drawSketch } from '../sketch/sketch'

const BISMILLAH = 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
const DUA = ['بَارَكَ ٱللَّٰهُ لَكُمَا', 'وَبَارَكَ عَلَيْكُمَا', 'وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ']

/** Opening: the Bismillah writes itself right→left, then the marriage du'a. Small and quiet. */
export function Landing() {
  const root = useRef<HTMLElement>(null)

  useSceneTimeline(root, (tl, q, el) => {
    tl.set(q('.basmala-text'), { strokeDasharray: 700, strokeDashoffset: 700, fillOpacity: 0 })
      .to(q('.feather'), { x: -760, duration: 3, ease: 'power1.inOut' }, 0.4)
      .fromTo(q('.pen'), { x: 560, opacity: 0 }, { x: 40, opacity: 1, duration: 3, ease: 'power1.inOut' }, 0.4)
      .to(q('.pen'), { opacity: 0, duration: 0.4 }, '>-0.3')
      .to(q('.basmala-text'), { strokeDashoffset: 0, duration: 3.2, ease: 'power1.inOut' }, 0.4)
      .to(q('.basmala-text'), { fillOpacity: 1, duration: 1.2 }, 2.2)
      .to(q('.basmala-text'), { strokeOpacity: 0, duration: 1 }, 3)
      .fromTo(q('.basmala-en'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.9 }, 3)
    drawSketch(tl, el.querySelector('.flourish'), { at: 3.6, duration: 1.2 })
    tl.fromTo(q('.dua-line'), { opacity: 0, y: 10, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.6 }, 4.2)
      .fromTo(q('.dua-en'), { opacity: 0 }, { opacity: 1, duration: 0.9, stagger: 0.2 }, 6.1)
  })

  return (
    <section ref={root} className="scene flex h-[100svh] items-center justify-center">
      <div className="flex w-full max-w-[420px] flex-col items-center px-8 text-center">
        <svg viewBox="0 0 600 150" className="w-[78%] max-w-[300px]" role="img" aria-label="Bismillah ir-Rahman ir-Raheem">
          <defs>
            <linearGradient id="feather-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.16" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="write-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="150">
              <rect className="feather" x="600" y="0" width="760" height="150" fill="url(#feather-grad)" />
            </mask>
            <radialGradient id="pen-glow">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#c98e9c" stopOpacity="0.55" />
              <stop offset="1" stopColor="#c98e9c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g mask="url(#write-mask)">
            <text className="basmala-text" x="300" y="100" textAnchor="middle" direction="rtl" fontFamily="Amiri, serif" fontSize="64"
              fill="#3d4b5c" stroke="#6b7a8c" strokeWidth="0.8">
              {BISMILLAH}
            </text>
          </g>
          <circle className="pen" cx="0" cy="82" r="14" fill="url(#pen-glow)" opacity="0" />
        </svg>
        <p className="basmala-en mt-1 text-[0.82rem] italic text-[var(--color-pencil)] opacity-0">
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>

        <svg viewBox="0 0 200 24" className="flourish my-5 w-40" aria-hidden>
          <path className="sk" style={{ stroke: '#c98e9c' }} d="M6 12 C 40 12 50 4 80 12 C 88 15 94 15 98 12" />
          <path className="sk" style={{ stroke: '#c98e9c' }} d="M194 12 C 160 12 150 4 120 12 C 112 15 106 15 102 12" />
          <path className="sk" style={{ stroke: '#a9bfcf', strokeWidth: 1.6 }} d="M100 6 L105 12 L100 18 L95 12Z" />
        </svg>

        <div className="arabic flex flex-col text-[1.35rem] leading-[1.9] text-[var(--color-mauve-deep)]">
          {DUA.map((l) => <span key={l} className="dua-line block opacity-0">{l}</span>)}
        </div>
        <p className="dua-en mt-4 font-[family-name:var(--font-display)] text-[0.58rem] tracking-[0.22em] text-[var(--color-pencil)] uppercase opacity-0">
          Bārakallāhu lakumā wa bāraka ʿalaykumā wa jamaʿa baynakumā fī khayr
        </p>
        <p className="dua-en mt-2 max-w-[18rem] text-[0.86rem] italic leading-snug text-[var(--color-ink)] opacity-0">
          May Allah bless you both, shower His blessings upon you, and unite you in goodness.
        </p>
      </div>
    </section>
  )
}
