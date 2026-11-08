import type { CSSProperties, ReactNode } from 'react'

/**
 * A storybook "page" with a fixed 4:7 shape, anchored to the bottom centre of the
 * screen. Illustrations use a 400×700 viewBox, so overlays can be placed with
 * the same coordinates as percentages (see `at`). Fonts inside use `cqw` units so
 * the whole page scales together on every screen.
 */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${className}`}
      style={{ width: 'min(100vw, calc(100svh * 4 / 7), 520px)', aspectRatio: '4 / 7', containerType: 'inline-size' }}
    >
      {children}
    </div>
  )
}

/** Absolutely position an overlay using illustration (viewBox) coordinates. */
export function at(x: number, y: number, w?: number): CSSProperties {
  return {
    position: 'absolute',
    left: `${(x / 400) * 100}%`,
    top: `${(y / 700) * 100}%`,
    width: w !== undefined ? `${(w / 400) * 100}%` : undefined,
    transform: 'translateX(-50%)',
  }
}

export function Sketch({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 400 700" className={`absolute inset-0 h-full w-full overflow-visible ${className}`} aria-hidden>
      {children}
    </svg>
  )
}
