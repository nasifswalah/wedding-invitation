import { useEffect, useRef, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { SceneMode } from './scene'

export type TrailerScene = { id: string; C: ComponentType; duration: number; exit?: 'gust' | 'fade' }

const exits = {
  // the names scene is carried away on the gust of wind
  gust: { opacity: 0, x: '-28%', rotate: -1.5, filter: 'blur(10px)', transition: { duration: 1.5, ease: [0.55, 0, 0.45, 1] } },
  fade: { opacity: 0, scale: 1.03, filter: 'blur(8px)', transition: { duration: 1.1, ease: [0.55, 0, 0.45, 1] } },
} as const

/**
 * The opening "movie trailer": scenes play one after another on their own,
 * with a story-style progress bar, Pause and Skip. Calls `onDone` at the end.
 * Pause freezes GSAP's global timeline, which holds every scene animation
 * and the timer that advances the scenes.
 */
export function Trailer({ scenes, onDone, onSceneChange }: { scenes: TrailerScene[]; onDone: () => void; onSceneChange?: (i: number) => void }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const bars = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    onSceneChange?.(index)
    const s = scenes[index]
    const fill = gsap.fromTo(bars.current[index], { scaleX: 0 }, { scaleX: 1, duration: s.duration, ease: 'none' })
    const next = gsap.delayedCall(s.duration, () => (index + 1 < scenes.length ? setIndex(index + 1) : onDone()))
    return () => { fill.kill(); next.kill() }
  }, [index, scenes, onDone, onSceneChange])

  useEffect(() => {
    if (paused) gsap.globalTimeline.pause()
    else gsap.globalTimeline.resume()
  }, [paused])
  useEffect(() => () => { gsap.globalTimeline.resume() }, [])

  const S = scenes[index]

  return (
    <div className="fixed inset-0 z-20 overflow-hidden" role="region" aria-label="Invitation trailer">
      <SceneMode.Provider value="trailer">
        <AnimatePresence initial={false}>
          <motion.div
            key={S.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, delay: 0.3 } }}
            exit={exits[S.exit ?? 'fade']}
          >
            <S.C />
          </motion.div>
        </AnimatePresence>
      </SceneMode.Provider>

      {/* progress + controls */}
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.6rem,env(safe-area-inset-top))]">
        <div className="flex gap-1">
          {scenes.map((s, i) => (
            <span key={s.id} className="h-[2px] flex-1 overflow-hidden rounded-full bg-[rgba(107,122,140,0.2)]">
              <span
                ref={(el) => { bars.current[i] = el }}
                className="block h-full w-full origin-left bg-[var(--color-mauve)]"
                style={{ transform: `scaleX(${i < index ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="fixed right-2 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-1">
        <button
          onClick={() => setPaused((p) => !p)}
          className="grid h-11 w-11 place-items-center rounded-full text-[var(--color-pencil)]"
          aria-label={paused ? 'Play' : 'Pause'}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 1.5 L12 7 L3 12.5Z" fill="currentColor" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 1.5 h3 v11 h-3z M8.5 1.5 h3 v11 h-3z" fill="currentColor" /></svg>
          )}
        </button>
        <button
          onClick={onDone}
          className="h-11 px-3 font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.3em] text-[var(--color-pencil)] uppercase"
        >
          Skip ›
        </button>
      </div>
    </div>
  )
}
