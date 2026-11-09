import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useSceneTimeline, useSceneMode } from '../story/scene'
import { drawSketch, SketchLink } from '../sketch/sketch'
import { Hydrangea, RoseHead, Eucalyptus } from '../components/garden/botanical'
import { setAttractor } from '../components/garden/wind'
import { wedding } from '../config/wedding'
import { googleCalendarUrl, whatsappShareUrl } from '../lib/calendar'
import { prefersReducedMotion } from '../lib/motion'
import { Couple } from './Couple'
import { Page, Sketch, at, usePageWide } from './Page'
import { FlowerStand, GroundLantern, GuestTable, Palm, RoundTree, StringLights } from './props'

function ArchSketch() {
  return (
    <g filter="url(#pencil)">
      <path className="wash" d="M58 640 L58 342 A 142 142 0 0 1 342 342 L342 640Z" fill="#ead2d6" opacity="0.3" filter="url(#wash)" />
      <path className="sk" d="M10 642 L390 642" />
      <path className="sk" d="M40 642 L40 340 A 160 160 0 0 1 360 340 L360 642" />
      <path className="sk sk-light" d="M58 642 L58 342 A 142 142 0 0 1 342 342 L342 642" />
      <path className="sk sk-light" d="M70 642 l3 -9 l3 9 M320 642 l3 -10 l3 10 M96 642 l2 -6 l3 6" />
    </g>
  )
}

/** Flowers climbing the arch — coloured, not sketched. */
function ArchFlowers() {
  const spots: [number, number, 'hyd' | 'mauve' | 'peach' | 'ivory' | 'euca', number][] = [
    [200, 182, 'hyd', 15], [176, 186, 'mauve', 10], [224, 186, 'peach', 10], [154, 196, 'euca', 0], [246, 196, 'euca', 0],
    [62, 300, 'hyd', 13], [76, 318, 'mauve', 9], [48, 334, 'ivory', 8], [338, 300, 'hyd', 13], [324, 318, 'peach', 9], [352, 334, 'mauve', 8],
    [40, 560, 'hyd', 12], [52, 580, 'peach', 8], [360, 560, 'hyd', 12], [348, 580, 'mauve', 8],
  ]
  return (
    <g>
      {spots.map(([x, y, k, r], i) => (
        <g key={i} className="arch-flower" transform={`translate(${x} ${y})`}>
          {k === 'hyd' ? <Hydrangea r={r} seed={i} tone={i % 3 ? 'blue' : 'lilac'} />
            : k === 'euca' ? <g transform={`rotate(${x < 200 ? 50 : -50})`}><Eucalyptus length={34} seed={i} /></g>
              : <RoseHead r={r} tone={k} seed={i} />}
        </g>
      ))}
    </g>
  )
}


/** Lanterns at the foot of the arch and fairy lights above it. */
function ArchDecor() {
  return (
    <g className="arch-decor">
      <GroundLantern x={22} y={642} s={1} />
      <GroundLantern x={378} y={642} s={1} />
      <GroundLantern x={70} y={642} s={0.7} />
      <GroundLantern x={330} y={642} s={0.7} />
    </g>
  )
}

/** Only on wide pages: flower stands, guest tables, palms and lights around the arch. */
function InviteWide() {
  return (
    <g className="invite-wide" filter="url(#pencil)">
      <path className="sk sk-light" d="M-400 642 L10 642 M390 642 L800 642" />
      <Palm x={-340} y={642} h={260} />
      <RoundTree x={-200} y={642} r={52} />
      <RoundTree x={600} y={642} r={50} />
      <Palm x={740} y={642} h={270} flip />
      <FlowerStand x={-60} y={642} h={150} s={1.8} />
      <FlowerStand x={460} y={642} h={150} s={1.8} />
      <GuestTable x={-230} y={690} s={1.5} />
      <GuestTable x={640} y={690} s={1.5} />
      <StringLights x1={-360} y1={150} x2={60} y2={190} sag={50} n={16} />
      <StringLights x1={340} y1={190} x2={760} y2={150} sag={50} n={16} />
    </g>
  )
}

/** A hand-written letter that rises over the scene and reads itself line by line. */
function Letter() {
  const wide = usePageWide()
  const inv = wedding.invitation
  const { bride, groom } = wedding.shortNames
  return (
    <div className="letter z-10" data-wide={wide ? '1' : ''} style={wide ? at(610, 64, 330) : at(200, 148, 352)}>
      <div
        className="relative rounded-[6px] px-[8%] pt-9 pb-6 text-center"
        style={{
          background: 'linear-gradient(180deg, #fffdf8 0%, #faf3e6 100%)',
          boxShadow: '0 26px 50px -26px rgba(61,75,92,0.55), 0 2px 6px -2px rgba(61,75,92,0.12)',
        }}
      >
        {/* pencil border, drawn in */}
        <svg className="letter-border pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <rect className="sk sk-light" x="0" y="0" width="100" height="100" rx="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* wax seal */}
        <div
          className="seal absolute -top-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full font-[family-name:var(--font-script)] text-[1.15rem] text-[#fffaf5]"
          style={{ background: 'radial-gradient(circle at 35% 30%, #d9a3b0, #9c6473 75%)', boxShadow: '0 4px 10px -3px rgba(156,100,115,0.7)' }}
        >
          {bride[0]}&amp;{groom[0]}
        </div>

        <p className="l-in eyebrow !text-[0.6rem]">An invitation</p>
        <p className="l-in mt-1.5 text-[0.95rem] italic text-[var(--color-blue-deep)]">{inv.opening}</p>
        <div className="mt-3 space-y-0.5">
          {inv.lines.map((l) => (
            <p key={l} className="l-in text-[1.08rem] leading-snug text-balance text-[var(--color-ink)]">{l}</p>
          ))}
        </div>
        <svg viewBox="0 0 120 10" className="l-in mx-auto my-3 h-2.5 w-28" aria-hidden>
          <path d="M2 5 C 30 5 40 1 56 5 M118 5 C 90 5 80 1 64 5" stroke="#c98e9c" strokeWidth="1" fill="none" />
          <path d="M60 2 L63 5 L60 8 L57 5Z" fill="#a9bfcf" />
        </svg>
        <p className="l-in arabic text-[1.25rem] leading-[1.7] text-[var(--color-mauve-deep)]">{inv.quoteAr}</p>
        <p className="l-in text-[0.88rem] italic text-[var(--color-pencil)]">{inv.quoteEn}</p>
        <p className="l-in mt-0.5 font-[family-name:var(--font-display)] text-[0.55rem] tracking-[0.28em] text-[var(--color-blue-deep)] uppercase">{inv.quoteRef}</p>
        <p className="l-in mt-3 font-[family-name:var(--font-script)] text-[1.55rem] leading-tight text-[var(--color-ink)]">{inv.signature}</p>
        <div className="l-in mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
          <SketchLink href={whatsappShareUrl()} external delay={0.2}>Share on WhatsApp</SketchLink>
          <SketchLink href={googleCalendarUrl(wedding.event)} external color="#6f8aa1" delay={0.4}>Save to calendar</SketchLink>
        </div>
      </div>
    </div>
  )
}

/** Scene 6 — the couple under a floral arch, then a letter with the invitation rises over the scene. */
export function Invitation() {
  const root = useRef<HTMLElement>(null)
  const mode = useSceneMode()

  useSceneTimeline(root, (tl, q, el) => {
    gsap.set(q('.bq-slot'), { scale: 0, transformOrigin: '50% 50%' })
    gsap.set(q('.bq-slot').slice(0, 2), { scale: 1 })
    drawSketch(tl, el.querySelector('.invite-wide'), { at: 0, duration: 1.8, washAt: 1.4 })
    drawSketch(tl, el.querySelector('.arch'), { at: 0.1, duration: 1.4, washAt: 1.2 })
    drawSketch(tl, el.querySelector('.arch-decor'), { at: 0.8, duration: 0.8 })
    tl.from(q('.arch-flower, .prop-bloom'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, 0.8)
    const story = !!(wedding.coupleWalk && wedding.coupleFacing)
    if (story) {
      // walking away up the aisle, hand in hand… then turning to face each other
      tl.fromTo(q('.c-walk'), { opacity: 0, y: 40, scale: 1.08 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' }, 0.6)
        .to(q('.c-walk'), { y: -26, scale: 0.9, duration: 3, ease: 'sine.inOut' }, 1.4)
        .to(q('.c-walk-bob'), { y: -3, duration: 0.38, ease: 'sine.inOut', repeat: 7, yoyo: true }, 1.4)
        .to(q('.c-walk'), { opacity: 0, filter: 'blur(4px)', duration: 0.9 }, 4.3)
        .fromTo(q('.c-face'), { opacity: 0, scale: 0.94, filter: 'blur(6px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }, 4.3)
    } else if (wedding.couplePhoto) {
      tl.from(q('.couple-photo'), { opacity: 0, y: 28, scale: 0.97, filter: 'blur(8px)', duration: 1.8, ease: 'power2.out' }, 0.7)
    } else {
      drawSketch(tl, el.querySelector('.couple'), { at: 0.9, duration: 2.6, washAt: 2.8 })
    }
    tl.from(q('.i-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.9, stagger: 0.2 }, 1.2)

    // after a short pause, the letter rises and reads itself
    const L = story ? 6 : 3.6
    const wide = !!(el.querySelector('.letter') as HTMLElement | null)?.dataset.wide
    tl.fromTo(q('.letter'), { opacity: 0, y: 70, rotate: -2.5 }, { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: 'power3.out' }, L)
    if (!wide) tl.to(q('.art-dim'), { opacity: 0.18, filter: 'blur(1.5px)', duration: 1 }, L)
    drawSketch(tl, el.querySelector('.letter-border'), { at: L + 0.5, duration: 0.9 })
    tl.from(q('.seal'), { scale: 0, rotate: -40, duration: 0.6, ease: 'back.out(2.2)' }, L + 0.7)
      .from(q('.l-in'), { opacity: 0, y: 8, filter: 'blur(4px)', duration: 0.7, stagger: 0.36 }, L + 1)
  })

  // the hand-drawn couple's bouquet fills with petals (not used with a photo/illustration)
  useEffect(() => {
    const el = root.current!
    if (wedding.couplePhoto) return
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('.bq-slot'), { scale: 1 })
      return
    }
    const slots = Array.from(el.querySelectorAll('.bq-slot'))
    let filled = 2
    const target = el.querySelector('.bouquet-target')!
    const attractor = {
      rate: 2.4,
      getPoint: () => {
        if (filled >= slots.length) return null
        const r = target.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.15 || r.top > window.innerHeight * 0.9) return null
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      },
      onLand: () => {
        const s = slots[filled++]
        if (s) gsap.to(s, { scale: 1, duration: 0.6, ease: 'back.out(2.4)' })
      },
    }
    const start = setTimeout(() => setAttractor(attractor), mode === 'trailer' ? 2200 : 0)
    return () => {
      clearTimeout(start)
      setAttractor(null)
    }
  }, [mode])

  return (
    <section ref={root} className="scene">
      <div className="ill relative h-[100svh]">
        <Page>
          <Sketch className="art-dim" wide={<InviteWide />}>
            <g className="arch"><ArchSketch /></g>
            <ArchDecor />
            <ArchFlowers />
            {!wedding.couplePhoto && <g className="couple" transform="translate(50 238)"><Couple /></g>}
          </Sketch>
          {wedding.coupleWalk && wedding.coupleFacing && (
            <div className="art-dim" style={{ ...at(200, 250, 250), aspectRatio: '3 / 4.6' }}>
              <div className="c-walk absolute inset-0 origin-bottom">
                <img src={wedding.coupleWalk} alt="" className="c-walk-bob absolute bottom-0 left-0 block h-auto w-full select-none" draggable={false} />
              </div>
              <div className="c-face absolute inset-0 origin-bottom opacity-0">
                <img src={wedding.coupleFacing} alt={`${wedding.shortNames.bride} and ${wedding.shortNames.groom}`} className="absolute bottom-0 left-0 block h-auto w-full select-none" draggable={false} />
              </div>
            </div>
          )}
          {wedding.couplePhoto && !(wedding.coupleWalk && wedding.coupleFacing) && (
            <div className="couple-photo art-dim" style={at(200, 268, 240)}>
              <img src={wedding.couplePhoto} alt={`${wedding.shortNames.bride} and ${wedding.shortNames.groom}`} className="block h-auto w-full select-none" draggable={false} />
              <div className="absolute inset-x-[8%] -bottom-[1%] -z-10 h-[4%] rounded-[50%] bg-[rgba(107,122,140,0.18)] blur-[6px]" />
            </div>
          )}
          <div style={at(200, 34, 370)} className="art-dim text-center">
            <p className="i-in eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">You are invited</p>
            <p className="i-in mt-1 font-[family-name:var(--font-script)] text-[clamp(1.8rem,9cqw,2.7rem)] leading-tight text-[var(--color-ink)]">
              Join us in our happiness
            </p>
            <p className="i-in hand mt-1 text-[clamp(1rem,4.8cqw,1.35rem)] leading-snug text-[var(--color-mauve-deep)]">
              {wedding.shortNames.bride} &amp; {wedding.shortNames.groom}
            </p>
          </div>
          <Letter />
        </Page>
      </div>
    </section>
  )
}
