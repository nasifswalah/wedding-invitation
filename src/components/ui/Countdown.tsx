import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    done: ms === 0,
    parts: [
      { label: 'Days', value: Math.floor(ms / 864e5) },
      { label: 'Hours', value: Math.floor(ms / 36e5) % 24 },
      { label: 'Minutes', value: Math.floor(ms / 6e4) % 60 },
      { label: 'Seconds', value: Math.floor(ms / 1e3) % 60 },
    ],
  }
}

/** Petal-shaped tiles; each digit change rolls in like a turning leaf. */
export function Countdown({ to }: { to: string }) {
  const target = new Date(to).getTime()
  const [state, setState] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setState(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (state.done) {
    return <p className="text-center font-[family-name:var(--font-script)] text-4xl text-[var(--color-gold-deep)]">Alhamdulillah — the day is here!</p>
  }

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4" role="timer" aria-live="off">
      {state.parts.map((p) => (
        <div key={p.label} className="flex flex-col items-center">
          <div
            className="relative grid h-[4.4rem] w-full max-w-[5.5rem] place-items-center overflow-hidden sm:h-24"
            style={{
              borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
              background: 'linear-gradient(160deg, #fffaf0 0%, #f3e6cb 100%)',
              border: '1px solid rgba(184,146,74,0.45)',
              boxShadow: '0 10px 22px -14px rgba(63,85,65,0.55), inset 0 1px 0 #fff',
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={p.value}
                initial={{ rotateX: -90, opacity: 0, y: -8 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                exit={{ rotateX: 90, opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-[family-name:var(--font-display)] text-[1.55rem] text-[var(--color-moss)] tabular-nums sm:text-3xl"
              >
                {String(p.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="mt-2 font-[family-name:var(--font-display)] text-[0.6rem] tracking-[0.2em] text-[var(--color-ink-soft)] uppercase sm:text-xs">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  )
}
