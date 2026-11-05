import { motion } from 'framer-motion'
import { wedding } from '../../config/wedding'
import { OrnamentDivider } from '../ui/Ornament'
import { Plant } from '../garden/botanical'

const ease = [0.22, 1, 0.36, 1] as const

function CornerSpray({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 140 140" className={className} style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }} aria-hidden>
      <g transform="rotate(-38 10 130)">
        <Plant x={10} y={130} h={95} bend={20} kind="rose" size={13} leaves={2} amp={3} dir={flip ? -1 : 1} phase={2} />
        <Plant x={26} y={132} h={70} bend={34} kind="jasmine" size={10} leaves={1} amp={4} dir={flip ? -1 : 1} phase={4} />
        <Plant x={0} y={134} h={60} bend={6} kind="bud" size={10} leaves={1} amp={4} dir={flip ? -1 : 1} phase={6} />
      </g>
    </svg>
  )
}

/** The invitation message on parchment — lines unveil one by one like a letter being read. */
export function Message() {
  const inv = wedding.invitation
  return (
    <section id="message" className="relative px-5 pb-16 sm:pb-24">
      <motion.div
        className="relative mx-auto max-w-2xl rounded-[28px] px-7 py-14 text-center sm:px-14 sm:py-20"
        style={{
          background: 'radial-gradient(120% 100% at 50% 0%, #fffdf6 0%, #f8efdb 70%, #f1e4c6 100%)',
          border: '1px solid rgba(184,146,74,0.4)',
          boxShadow: '0 30px 60px -36px rgba(63,85,65,0.55), inset 0 0 0 8px rgba(251,247,238,0.7), inset 0 0 0 9px rgba(184,146,74,0.25)',
        }}
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease }}
      >
        <CornerSpray className="absolute -top-8 -left-6 h-32 w-32 sm:h-40 sm:w-40" />
        <CornerSpray className="absolute -top-8 -right-6 h-32 w-32 sm:h-40 sm:w-40" flip />

        <p className="eyebrow">An invitation</p>
        <p className="mt-4 font-[family-name:var(--font-serif)] text-lg italic text-[var(--color-sage-deep)]">{inv.opening}</p>
        <OrnamentDivider className="my-6" />

        <div className="space-y-2">
          {inv.lines.map((l, i) => (
            <motion.p
              key={l}
              className="text-[1.25rem] leading-relaxed text-balance text-[var(--color-ink)] sm:text-2xl"
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.9, delay: i * 0.18, ease }}
            >
              {l}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.2, ease }}
        >
          <p className="arabic text-[1.65rem] leading-[2] text-[var(--color-gold-deep)] sm:text-3xl">{inv.quoteAr}</p>
          <p className="mt-4 text-[1.05rem] italic leading-relaxed text-[var(--color-ink-soft)]">{inv.quoteEn}</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.3em] text-[var(--color-gold-deep)] uppercase">{inv.quoteRef}</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
