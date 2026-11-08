import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * A storybook "page". Illustrations are drawn around a 400×700 centre stage.
 *  - phones / portrait: a 4:7 page showing just the centre stage
 *  - desktop / landscape: a 12:7 page — the same centre stage plus 400 extra
 *    units on each side (viewBox x from -400 to 800) where each scene adds
 *    more of the wedding (trees, lanterns, tables, flower stands…)
 * Overlays are placed with `at()` in the same coordinates, so they line up in both.
 */

const WideCtx = createContext(false)
export const usePageWide = () => useContext(WideCtx)

const QUERY = '(min-aspect-ratio: 1/1) and (min-width: 768px)'
function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  const wide = useWide()
  const style = {
    width: wide ? 'min(100vw, calc(100svh * 12 / 7))' : 'min(100vw, calc(100svh * 4 / 7), 520px)',
    aspectRatio: wide ? '12 / 7' : '4 / 7',
    containerType: 'inline-size',
    '--x0': wide ? -400 : 0,
    '--vw': wide ? 1200 : 400,
  } as CSSProperties
  return (
    <WideCtx.Provider value={wide}>
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${className}`} style={style}>
        {children}
      </div>
    </WideCtx.Provider>
  )
}

/** Absolutely position an overlay using illustration (viewBox) coordinates. */
export function at(x: number, y: number, w?: number): CSSProperties {
  return {
    position: 'absolute',
    left: `calc((${x} - var(--x0)) * 100% / var(--vw))`,
    top: `${(y / 700) * 100}%`,
    width: w !== undefined ? `calc(${w} * 100% / var(--vw))` : undefined,
    transform: 'translateX(-50%)',
  }
}

/** The illustration layer. `wide` content (the side extensions) only renders on wide pages. */
export function Sketch({ children, wide, className = '' }: { children: ReactNode; wide?: ReactNode; className?: string }) {
  const isWide = usePageWide()
  return (
    <svg viewBox={isWide ? '-400 0 1200 700' : '0 0 400 700'} className={`absolute inset-0 h-full w-full overflow-visible ${className}`} aria-hidden>
      {isWide && wide}
      {children}
    </svg>
  )
}

/** Font size that stays readable on both page shapes (cqw is relative to the page width). */
export const fs = (min: string, portraitCqw: number, max: string) =>
  `clamp(${min}, ${portraitCqw}cqw, ${max})`
