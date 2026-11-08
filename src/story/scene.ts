import { createContext, useContext, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '../lib/motion'

/** Scenes render in the auto-playing trailer or as sections of the scroll page. */
export type SceneMode = 'trailer' | 'scroll'
export const SceneMode = createContext<SceneMode>('scroll')
export const useSceneMode = () => useContext(SceneMode)

/**
 * Each scene builds ONE GSAP timeline. In the trailer it plays straight away;
 * on the scroll page it plays when the scene scrolls into view.
 * Reduced-motion users get the finished drawing immediately.
 */
export function useSceneTimeline(
  root: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline, q: (sel: string) => Element[], root: HTMLElement) => void,
  deps: unknown[] = [],
) {
  const mode = useSceneMode()
  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const q = gsap.utils.selector(el)
      const tl = gsap.timeline({ paused: true })
      build(tl, q, el)
      if (prefersReducedMotion()) {
        tl.progress(1)
        return
      }
      if (mode === 'trailer') {
        tl.play(0)
      } else {
        ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => tl.play(0) })
      }
    },
    { scope: root, dependencies: [mode, ...deps] },
  )
  return mode
}
