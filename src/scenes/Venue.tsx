import { useRef } from 'react'
import { useSceneTimeline, useSceneMode } from '../story/scene'
import { drawSketch, SketchLink } from '../sketch/sketch'
import { wedding } from '../config/wedding'
import { Page, Sketch, at } from './Page'

function StreetSketch() {
  return (
    <g filter="url(#pencil)">
      {/* venue building on the horizon */}
      <path className="wash" d="M120 560 L120 470 L280 470 L280 560Z M150 470 C 150 402 250 402 250 470Z" fill="#ead2d6" opacity="0.55" filter="url(#wash)" />
      <path className="sk sk-ink" d="M120 560 L120 470 L280 470 L280 560" />
      <path className="sk sk-ink" d="M150 470 C 150 402 250 402 250 470" />
      <path className="sk" d="M200 408 L200 388 M194 380 C 198 372 206 372 208 380 C 204 377 198 377 194 380" />
      <path className="sk sk-light" d="M138 560 L138 512 C 138 498 156 498 156 512 L156 560 M244 560 L244 512 C 244 498 262 498 262 512 L262 560 M184 560 L184 506 C 184 488 216 488 216 506 L216 560" />
      <path className="sk" d="M296 560 L296 392 M314 560 L314 392 M292 392 L305 360 L318 392 Z M292 430 L318 430" />
      {/* trees */}
      <path className="wash" d="M18 560 C -2 526 24 490 54 506 C 64 476 104 484 98 520 C 118 540 92 570 62 562Z" fill="#cbd8d0" opacity="0.6" filter="url(#wash)" />
      <path className="sk" d="M18 560 C -2 526 24 490 54 506 C 64 476 104 484 98 520 C 118 540 92 570 62 562 C 50 570 30 570 18 560" />
      <path className="sk" d="M58 562 L60 640" />
      <path className="sk sk-light" d="M352 560 C 340 536 358 512 378 522 C 392 504 420 520 410 546 C 420 566 390 576 372 566" />
      {/* road */}
      <path className="sk" d="M0 640 L400 640" />
      <path className="sk sk-light" d="M110 700 L186 560 M290 700 L214 560" />
      <path className="sk sk-light" d="M200 700 L200 684 M200 668 L200 654 M200 640 L200 628 M200 616 L200 606 M200 596 L200 588 M200 580 L200 574" />
      {/* signpost */}
      <path className="sk sk-ink" d="M330 650 L330 404" />
      <path className="wash" d="M262 412 L346 412 L362 428 L346 444 L262 444 Z" fill="#d3e0ea" opacity="0.8" filter="url(#wash)" />
      <path className="sk sk-ink" d="M262 412 L346 412 L362 428 L346 444 L262 444 Z" />
      <path className="sk sk-ink" d="M300 456 L388 456 L388 486 L300 486 L286 471 Z" />
    </g>
  )
}

/** Scene 5 — the venue, written like an address on a letter, with a sketched directions link. */
export function Venue() {
  const root = useRef<HTMLElement>(null)
  const mode = useSceneMode()
  const v = wedding.event.venue
  const lines = v.address.split(',').map((s) => s.trim())

  useSceneTimeline(root, (tl, q, el) => {
    drawSketch(tl, el.querySelector('.street'), { at: 0.1, duration: 2.2, washAt: 1.6 })
    tl.from(q('.sign-text'), { opacity: 0, duration: 0.5, stagger: 0.2 }, 1.8)
      .from(q('.v-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.8, stagger: 0.18 }, 1.2)
  })

  return (
    <section ref={root} className="scene">
      <div className="relative h-[100svh]">
      <Page>
        <Sketch>
          <g className="street"><StreetSketch /></g>
          <text className="sign-text" x={308} y={433} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={17} fill="#3d4b5c">Venue →</text>
          <text className="sign-text" x={340} y={477} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={15} fill="#9c6473">← Nikah</text>
        </Sketch>
        <div style={at(200, 70, 360)} className="flex flex-col items-center text-center">
          <p className="v-in eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">Finding your way</p>
          <p className="v-in mt-1 font-[family-name:var(--font-script)] text-[clamp(2rem,10cqw,3rem)] leading-tight text-[var(--color-ink)]">The Venue</p>
          <div className="v-in mt-3 hand text-[clamp(1.25rem,6.2cqw,1.75rem)] leading-[1.2] text-[var(--color-ink)]">
            <p className="text-[var(--color-mauve-deep)]">{v.name}</p>
            {lines.map((l) => <p key={l}>{l}</p>)}
          </div>
          <div className="v-in mt-4">
            <SketchLink href={v.mapsUrl} external delay={mode === 'trailer' ? 2.4 : 0.4}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
              Get directions
            </SketchLink>
          </div>
        </div>
      </Page>
      </div>
      {mode === 'scroll' && v.directions.length > 0 && (
        <ol className="v-in mx-auto max-w-md space-y-2 px-8 pb-12 text-[1.02rem] leading-snug text-[var(--color-ink)]">
          {v.directions.map((d, i) => (
            <li key={d} className="flex gap-2"><span className="hand text-[1.25em] leading-none text-[var(--color-blue-deep)]">{i + 1}.</span><span>{d}</span></li>
          ))}
        </ol>
      )}
    </section>
  )
}
