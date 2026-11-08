import { motion } from 'framer-motion'

/** Small sketched music button — browsers only allow sound after the guest taps. */
export function MusicToggle({ playing, available, onToggle }: { playing: boolean; available: boolean; onToggle: () => void }) {
  if (!available) return null
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-50 grid h-11 w-11 place-items-center rounded-full text-[var(--color-mauve-deep)]"
      aria-label={playing ? 'Pause music' : 'Play music'}
      aria-pressed={playing}
    >
      <span className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-current"
            animate={playing ? { height: ['30%', '100%', '45%', '80%', '30%'] } : { height: '30%' }}
            transition={playing ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </span>
    </motion.button>
  )
}
