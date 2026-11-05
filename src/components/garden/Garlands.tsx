import { useEffect, useRef, useState } from 'react'
import { Garland, Rose } from './botanical'

/**
 * A curtain of hanging jasmine strings across the top — long at the edges,
 * short in the middle — so it frames the couple's names like a stage.
 * Re-lays itself for any viewport width.
 */
export function Garlands({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current!
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const H = Math.min(300, Math.max(180, w * 0.42))
  const gap = w < 500 ? 30 : 42
  const n = Math.max(0, Math.floor(w / gap))
  const offset = (w - (n - 1) * gap) / 2

  return (
    <div ref={ref} className={className} aria-hidden>
      {w > 0 && (
        <svg width={w} height={H + 40} viewBox={`0 0 ${w} ${H + 40}`} style={{ overflow: 'visible', display: 'block' }}>
          {/* gold swag the strings hang from */}
          <path
            d={`M0 6 Q ${w / 4} 22 ${w / 2} 10 T ${w} 6`}
            stroke="url(#g-gold)" strokeWidth={1.4} fill="none" opacity={0.8}
          />
          {Array.from({ length: n }, (_, i) => {
            const x = offset + i * gap
            const u = (x / w) * 2 - 1 // -1 … 1
            const len = H * (0.28 + 0.72 * Math.pow(Math.abs(u), 1.6)) * (0.9 + ((i * 37) % 10) / 50)
            const hookY = 6 + 10 * (1 - Math.abs(u)) * 0.6
            return <Garland key={i} x={x} y={hookY} length={len} phase={i * 0.55} amp={2.5 + Math.abs(u) * 1.5} />
          })}
          {/* small roses where the swag dips */}
          {[0.25, 0.75].map((f) => (
            <g key={f} transform={`translate(${w * f} 18)`}>
              <Rose r={9} />
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
