import { motion } from 'framer-motion'
import { wedding } from '../../config/wedding'
import { arabicWeekday, gregorianParts, hijriParts } from '../../lib/dates'
import { Countdown } from '../ui/Countdown'
import { SectionHeading } from '../ui/Ornament'
import { Rose } from '../garden/botanical'

const ease = [0.22, 1, 0.36, 1] as const

function MonthGrid({ iso }: { iso: string }) {
  const d = new Date(iso)
  const fmt = (o: Intl.DateTimeFormatOptions) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', ...o }).format(d))
  const day = fmt({ day: 'numeric' }), month = fmt({ month: 'numeric' }), year = fmt({ year: 'numeric' })
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]

  return (
    <div className="mx-auto w-full max-w-[18rem]">
      <div className="grid grid-cols-7 gap-y-1 text-center font-[family-name:var(--font-display)] text-[0.62rem] tracking-widest text-[var(--color-sage-deep)]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-1.5 text-center text-[0.95rem] text-[var(--color-ink-soft)]">
        {cells.map((c, i) =>
          c === day ? (
            <span key={i} className="relative grid place-items-center">
              <motion.svg viewBox="0 0 40 40" className="absolute h-10 w-10" aria-hidden>
                <motion.circle
                  cx="20" cy="20" r="16" fill="none" stroke="url(#g-gold)" strokeWidth="1.6"
                  initial={{ pathLength: 0, rotate: -90 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.4, ease }}
                  style={{ transformOrigin: '20px 20px' }}
                />
              </motion.svg>
              <span className="relative font-semibold text-[var(--color-gold-deep)]">{c}</span>
            </span>
          ) : (
            <span key={i}>{c ?? ''}</span>
          ),
        )}
      </div>
    </div>
  )
}

export function DateTime() {
  const main = wedding.events[0]
  const g = gregorianParts(main.start)
  const h = hijriParts(main.start)

  return (
    <section id="date" className="relative px-5 pt-4 pb-16 sm:pb-24">
      <SectionHeading eyebrow="Save the date" title="The Blessed Day" arabic="يَوْمٌ مُبَارَك" />

      <motion.div
        className="card relative mx-auto max-w-3xl overflow-hidden p-6 sm:p-10"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease }}
      >
        <div className="grid gap-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
          {/* Gregorian */}
          <div className="text-center">
            <p className="eyebrow">{g.weekday}</p>
            <div className="relative mx-auto my-2 grid h-36 w-36 place-items-center">
              <motion.svg
                viewBox="-40 -60 80 80" className="absolute inset-0 h-full w-full" aria-hidden
                initial={{ scale: 0.2, rotate: -120, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 0.32 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease }}
              >
                <g transform="translate(0 18)"><Rose r={34} /></g>
              </motion.svg>
              <span className="relative font-[family-name:var(--font-display)] text-7xl text-[var(--color-moss)]">{g.day}</span>
            </div>
            <p className="font-[family-name:var(--font-display)] text-lg tracking-[0.25em] text-[var(--color-ink)] uppercase">{g.month} {g.year}</p>
          </div>

          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent sm:h-40 sm:w-px sm:bg-gradient-to-b" />

          {/* Hijri */}
          <div className="text-center">
            <p className="arabic text-lg text-[var(--color-sage-deep)]">{arabicWeekday(main.start)}</p>
            <p className="arabic gold-text my-2 text-[2.6rem] leading-[1.5] sm:text-5xl">
              {h.dayAr} {h.monthAr} {h.yearAr} هـ
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-[var(--color-ink)] uppercase">
              {h.day} {h.monthEn} {h.year} AH
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[rgba(184,146,74,0.25)] pt-7">
          <MonthGrid iso={main.start} />
        </div>
      </motion.div>

      <motion.div
        className="mx-auto mt-12 max-w-md"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease }}
      >
        <p className="mb-5 text-center font-[family-name:var(--font-script)] text-3xl text-[var(--color-sage-deep)]">counting the moments</p>
        <Countdown to={main.start} />
      </motion.div>
    </section>
  )
}
