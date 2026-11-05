import { motion } from 'framer-motion'
import { wedding } from '../../config/wedding'
import { whatsappShareUrl, downloadIcs } from '../../lib/calendar'
import { Cluster } from '../garden/Cluster'

const ease = [0.22, 1, 0.36, 1] as const

/** The garden at dusk — fireflies wake as the guest reaches the end of the invitation. */
export function Closing() {
  const { bride, groom } = wedding.shortNames
  return (
    <section
      id="closing"
      className="relative overflow-hidden px-5 pt-24 pb-[46vw] text-center sm:pb-72"
      style={{ background: 'linear-gradient(180deg, rgba(247,241,227,0) 0%, #e8e3cc 30%, #c9cfb3 70%, #9fae92 100%)' }}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="firefly"
          style={{ left: `${(i * 37) % 100}%`, top: `${35 + ((i * 23) % 55)}%`, animationDelay: `${-i * 0.9}s`, animationDuration: `${6 + (i % 4)}s` }}
          aria-hidden
        />
      ))}

      <motion.div
        className="relative z-10 mx-auto max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, ease }}
      >
        <p className="arabic text-3xl text-[var(--color-gold-deep)]">جَزَاكُمُ ٱللَّٰهُ خَيْرًا</p>
        <p className="eyebrow mt-3">Your presence is our blessing</p>
        <h2 className="mt-5 font-[family-name:var(--font-script)] text-6xl leading-tight sm:text-7xl">
          <span className="gold-text">{bride}</span>
          <span className="mx-3 text-4xl text-[var(--color-sage-deep)]">&amp;</span>
          <span className="gold-text">{groom}</span>
        </h2>
        <p className="mt-4 text-lg italic text-[var(--color-ink)]">{wedding.invitation.signature}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a className="btn btn-gold" href={whatsappShareUrl()} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z" /></svg>
            Share on WhatsApp
          </a>
          <button className="btn btn-outline" onClick={() => downloadIcs(wedding.events[0])}>Save to calendar</button>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between" aria-hidden>
        <Cluster variant="b" dusk className="-mb-2 -ml-6 w-[50vw] max-w-[340px]" />
        <Cluster variant="a" dusk mirror className="-mb-2 -mr-6 w-[50vw] max-w-[340px]" />
      </div>
      <p className="absolute inset-x-0 bottom-3 z-10 font-[family-name:var(--font-display)] text-[0.6rem] tracking-[0.3em] text-[#f7f1e3] uppercase opacity-80">
        In shaa Allah · {new Date(wedding.events[0].start).getFullYear()}
      </p>
    </section>
  )
}
