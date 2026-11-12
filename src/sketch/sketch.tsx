import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { seeded } from '../lib/motion'

/**
 * Pencil-drawing helpers.
 *  - Any SVG shape with class `sk` is "drawn" by animating its stroke.
 *  - Any element with class `wash` is a watercolour fill that bleeds in afterwards.
 */

export function prepSketch(root: Element | null) {
  if (!root) return [] as SVGGeometryElement[]
  const paths = Array.from(root.querySelectorAll<SVGGeometryElement>('.sk'))
  paths.forEach((p) => {
    const len = typeof p.getTotalLength === 'function' ? Math.ceil(p.getTotalLength()) + 2 : 600
    p.style.strokeDasharray = `${len}`
    p.style.strokeDashoffset = `${len}`
  })
  root.querySelectorAll<SVGElement>('.wash').forEach((el) => {
    // remember the designed (soft) opacity so the wash fades back to it, not to 1
    if (!el.dataset.op) el.dataset.op = el.getAttribute('opacity') ?? '1'
    el.style.opacity = '0'
  })
  return paths
}

/** Adds the drawing of every `.sk` line (in DOM order) then the washes, to a timeline. */
export function drawSketch(
  tl: gsap.core.Timeline,
  root: Element | null,
  { at = 0, duration = 2.4, washAt }: { at?: number | string; duration?: number; washAt?: number | string } = {},
) {
  const paths = prepSketch(root)
  if (!paths.length || !root) return tl
  const each = Math.max(0.35, duration * 0.35)
  const stagger = paths.length > 1 ? (duration - each) / (paths.length - 1) : 0
  tl.to(paths, { strokeDashoffset: 0, duration: each, stagger, ease: 'power1.inOut' }, at)
  const washes = root.querySelectorAll('.wash')
  if (washes.length) {
    tl.to(washes, { opacity: (_: number, el: SVGElement) => Number(el.dataset.op ?? 1), duration: 1.2, stagger: 0.12, ease: 'sine.out' }, washAt ?? '>-0.8')
  }
  return tl
}

/** A hand-drawn loop around something, like circling a date with a pencil. */
export function roughEllipse(cx: number, cy: number, rx: number, ry: number, seed = 1) {
  const rnd = seeded(seed)
  const pts: string[] = []
  const turns = 1.18
  const steps = 26
  const start = -2.2 + rnd() * 0.4
  for (let i = 0; i <= steps; i++) {
    const a = start + (i / steps) * Math.PI * 2 * turns
    const j = 1 + (rnd() - 0.5) * 0.08 + (i / steps) * 0.06
    pts.push(`${(cx + Math.cos(a) * rx * j).toFixed(1)} ${(cy + Math.sin(a) * ry * j).toFixed(1)}`)
  }
  return `M ${pts[0]} ` + pts.slice(1).map((p) => `L ${p}`).join(' ')
}

/** A slightly wavy underline. */
export function roughLine(x1: number, y: number, x2: number, seed = 1) {
  const rnd = seeded(seed)
  const mid = (x1 + x2) / 2
  return `M ${x1} ${y + (rnd() - 0.5) * 2} Q ${mid} ${y + 3 + rnd() * 2} ${x2} ${y - 1 + (rnd() - 0.5) * 2}`
}

/** Link/button with no border or shadow — a pencil ellipse draws itself around it. */
export function SketchLink({
  children, href, onClick, color = '#e6b59c', delay = 0, external,
}: { children: ReactNode; href?: string; onClick?: () => void; color?: string; delay?: number; external?: boolean }) {
  const inner = (
    <>
      <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] overflow-visible" aria-hidden>
        <motion.path
          d={roughEllipse(100, 30, 96, 26, children?.toString().length ?? 3)}
          fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      <span className="relative">{children}</span>
    </>
  )
  const cls = 'relative inline-flex min-h-[46px] items-center justify-center gap-2 px-5 font-[family-name:var(--font-display)] text-[0.74rem] tracking-[0.2em] uppercase text-[var(--color-mauve-deep)] transition-transform active:scale-95'
  return href ? (
    <a className={cls} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{inner}</a>
  ) : (
    <button className={cls} onClick={onClick}>{inner}</button>
  )
}

/** The main call-to-action: a filled, softly pulsing pill with a pencil outline and a hand-written hint. */
export function DirectionsButton({ href, delay = 0, hint = 'Tap to open the map' }: { href: string; delay?: number; hint?: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative isolate inline-flex min-h-[52px] items-center gap-2.5 rounded-full px-7 font-[family-name:var(--font-display)] text-[0.78rem] tracking-[0.22em] text-[#3a0f19] uppercase transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg, #c9977c 0%, #ecc6a6 55%, #c48a74 100%)', boxShadow: '0 10px 24px -12px rgba(0,0,0,0.5)' }}
      >
        {/* soft pulse */}
        <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-[var(--color-mauve)] opacity-25 [animation-duration:2.4s]" />
        {/* pencil outline drawn around it */}
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-2.5 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.25rem)] overflow-visible" aria-hidden>
          <motion.path
            d={roughEllipse(100, 30, 98, 28, 9)}
            fill="none" stroke="#e6b59c" strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.2, delay: delay + 0.4 }}
          />
        </svg>
        <motion.svg width="16" height="16" viewBox="0 0 24 24" aria-hidden animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </motion.svg>
        Get directions
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M3 9 L9 3 M4 3 H9 V8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </a>
      <span className="mt-2 flex items-center gap-1 font-[family-name:var(--font-hand)] text-[1.05rem] text-[var(--color-blue-deep)]">
        <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden><path d="M20 12 C 14 12 8 10 4 3 M4 3 L3 8 M4 3 L9 4" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
        {hint}
      </span>
    </motion.div>
  )
}
