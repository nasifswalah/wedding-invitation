import { motion } from 'framer-motion'

/** Gold flourish divider that draws itself when it scrolls into view. */
export function OrnamentDivider({ className = '' }: { className?: string }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] } },
  }
  return (
    <motion.svg
      viewBox="0 0 240 30"
      className={`mx-auto h-6 w-52 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      aria-hidden
    >
      <motion.path variants={draw} d="M4 15 C 40 15 60 4 90 15 C 100 19 108 19 112 15" stroke="url(#g-gold)" strokeWidth="1.2" fill="none" />
      <motion.path variants={draw} d="M236 15 C 200 15 180 4 150 15 C 140 19 132 19 128 15" stroke="url(#g-gold)" strokeWidth="1.2" fill="none" />
      <motion.path
        variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { delay: 0.9, duration: 0.6, type: 'spring' } } }}
        d="M120 6 L126 15 L120 24 L114 15Z"
        fill="url(#g-gold)"
        style={{ transformOrigin: '120px 15px' }}
      />
    </motion.svg>
  )
}

/** Thin gold Islamic arch outline (ogee top). */
export function ArchFrame({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 460" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M10 455 L10 170 C 10 95 80 60 120 40 C 138 31 146 20 150 6 C 154 20 162 31 180 40 C 220 60 290 95 290 170 L290 455"
        fill="none" stroke="url(#g-gold)" strokeWidth="1.3" vectorEffect="non-scaling-stroke"
      />
      <path
        d="M22 455 L22 174 C 22 106 88 74 126 54 C 141 46 147 37 150 26 C 153 37 159 46 174 54 C 212 74 278 106 278 174 L278 455"
        fill="none" stroke="#b8924a" strokeOpacity="0.4" strokeWidth="0.8" vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function SectionHeading({ eyebrow, title, arabic }: { eyebrow: string; title: string; arabic?: string }) {
  return (
    <motion.div
      className="mb-8 text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {arabic && <p className="arabic mb-1 text-2xl text-[var(--color-gold)]">{arabic}</p>}
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-[family-name:var(--font-script)] text-[2.9rem] leading-tight text-[var(--color-moss)] sm:text-6xl">{title}</h2>
      <OrnamentDivider className="mt-2" />
    </motion.div>
  )
}
