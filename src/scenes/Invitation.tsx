import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { useSceneTimeline, useSceneMode } from '../story/scene'
import { drawSketch, SketchLink } from '../sketch/sketch'
import { Hydrangea, RoseHead, Eucalyptus } from '../components/garden/botanical'
import { setAttractor } from '../components/garden/wind'
import { wedding } from '../config/wedding'
import { downloadIcs, whatsappShareUrl } from '../lib/calendar'
import { prefersReducedMotion } from '../lib/motion'
import { Couple } from './Couple'
import { Page, Sketch, at } from './Page'
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

/** Scene 6 — the couple under a floral arch; falling petals fill the bride's bouquet. */
export function Invitation() {
  const root = useRef<HTMLElement>(null)
  const mode = useSceneMode()
  const inv = wedding.invitation

  useSceneTimeline(root, (tl, q, el) => {
    gsap.set(q('.bq-slot'), { scale: 0, transformOrigin: '50% 50%' })
    gsap.set(q('.bq-slot').slice(0, 2), { scale: 1 })
    drawSketch(tl, el.querySelector('.invite-wide'), { at: 0, duration: 1.8, washAt: 1.4 })
    drawSketch(tl, el.querySelector('.arch'), { at: 0.1, duration: 1.4, washAt: 1.2 })
    drawSketch(tl, el.querySelector('.arch-decor'), { at: 0.8, duration: 0.8 })
    tl.from(q('.arch-flower, .prop-bloom'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, 0.8)
    if (wedding.couplePhoto) {
      tl.from(q('.couple-photo'), { opacity: 0, y: 28, scale: 0.97, filter: 'blur(8px)', duration: 1.8, ease: 'power2.out' }, 0.7)
    } else {
      drawSketch(tl, el.querySelector('.couple'), { at: 0.9, duration: 2.6, washAt: 2.8 })
    }
    tl.from(q('.i-in'), { opacity: 0, y: 10, filter: 'blur(4px)', duration: 0.9, stagger: 0.2 }, 1.2)
  })

  // the bouquet catches petals whenever this scene is on screen
  useEffect(() => {
    const el = root.current!
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('.bq-slot'), { scale: 1 })
      return
    }
    // drawn couple: petals fill empty bouquet slots; photo: petals land in her bouquet with a soft glow
    const slots = Array.from(el.querySelectorAll('.bq-slot'))
    const glow = el.querySelector('.bq-glow')
    const total = wedding.couplePhoto ? 14 : slots.length
    let filled = wedding.couplePhoto ? 0 : 2
    const target = el.querySelector('.bouquet-target')!
    const attractor = {
      rate: 2.4,
      // only catch while the bouquet is comfortably on screen
      getPoint: () => {
        if (filled >= total) return null
        const r = target.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.15 || r.top > window.innerHeight * 0.9) return null
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      },
      onLand: () => {
        const s = slots[filled++]
        if (!wedding.couplePhoto && s) gsap.to(s, { scale: 1, duration: 0.6, ease: 'back.out(2.4)' })
        if (glow) gsap.fromTo(glow, { opacity: 0.85, scale: 0.6 }, { opacity: 0, scale: 1.6, duration: 0.9, ease: 'power2.out' })
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
          <Sketch wide={<InviteWide />}>
            <g className="arch"><ArchSketch /></g>
            <ArchDecor />
            <ArchFlowers />
            {!wedding.couplePhoto && <g className="couple" transform="translate(50 238)"><Couple /></g>}
          </Sketch>
          {wedding.couplePhoto && (
            <div className="couple-photo" style={at(200, 190, 290)}>
              <img src={wedding.couplePhoto} alt={`${wedding.shortNames.bride} and ${wedding.shortNames.groom}`} className="block h-auto w-full select-none" draggable={false} />
              {/* her bouquet, where the falling petals land */}
              <span className="bouquet-target absolute h-1 w-1" style={{ left: '43%', top: '40%' }} />
              <span className="bq-glow pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{ left: '43%', top: '40%', background: 'radial-gradient(closest-side, rgba(255,250,240,0.95), rgba(234,210,214,0.5) 50%, rgba(234,210,214,0))' }} />
              <div className="absolute inset-x-[8%] -bottom-[1%] -z-10 h-[4%] rounded-[50%] bg-[rgba(107,122,140,0.18)] blur-[6px]" />
            </div>
          )}
          <div style={at(200, 34, 370)} className="text-center">
            <p className="i-in eyebrow !text-[clamp(0.55rem,2.6cqw,0.72rem)]">You are invited</p>
            <p className="i-in mt-1 font-[family-name:var(--font-script)] text-[clamp(1.8rem,9cqw,2.7rem)] leading-tight text-[var(--color-ink)]">
              join us in our happiness
            </p>
            <p className="i-in hand mt-1 text-[clamp(1rem,4.8cqw,1.35rem)] leading-snug text-[var(--color-mauve-deep)]">
              {wedding.shortNames.bride} &amp; {wedding.shortNames.groom}
            </p>
          </div>
        </Page>
      </div>

      {mode === 'scroll' && (
        <div className="mx-auto max-w-xl px-7 pt-6 pb-24 text-center">
          <p className="eyebrow">An invitation</p>
          <p className="mt-3 italic text-[var(--color-blue-deep)]">{inv.opening}</p>
          <div className="mt-6 space-y-1.5">
            {inv.lines.map((l, i) => (
              <motion.p
                key={l}
                className="text-[1.2rem] leading-relaxed text-balance text-[var(--color-ink)] sm:text-[1.4rem]"
                initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.9, delay: i * 0.15 }}
              >
                {l}
              </motion.p>
            ))}
          </div>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <p className="arabic text-[1.5rem] leading-[2] text-[var(--color-mauve-deep)]">{inv.quoteAr}</p>
            <p className="mt-3 text-[1rem] italic leading-relaxed text-[var(--color-pencil)]">{inv.quoteEn}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-[0.64rem] tracking-[0.3em] text-[var(--color-blue-deep)] uppercase">{inv.quoteRef}</p>
          </motion.div>
          <p className="arabic mt-12 text-2xl text-[var(--color-ink)]">جَزَاكُمُ ٱللَّٰهُ خَيْرًا</p>
          <p className="mt-2 font-[family-name:var(--font-script)] text-3xl text-[var(--color-ink)]">{inv.signature}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
            <SketchLink href={whatsappShareUrl()} external>Share on WhatsApp</SketchLink>
            <SketchLink onClick={() => downloadIcs(wedding.event)} color="#6f8aa1" delay={0.3}>Save to calendar</SketchLink>
          </div>
          <p className="mt-14 font-[family-name:var(--font-display)] text-[0.6rem] tracking-[0.3em] text-[var(--color-pencil)] uppercase">
            In shaa Allah · {new Date(wedding.event.start).getFullYear()}
          </p>
        </div>
      )}
    </section>
  )
}
