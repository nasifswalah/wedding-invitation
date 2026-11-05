import { motion } from 'framer-motion'

export function MusicToggle({ playing, available, onToggle }: { playing: boolean; available: boolean; onToggle: () => void }) {
  if (!available) return null
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid h-12 w-12 place-items-center rounded-full border border-[rgba(184,146,74,0.5)] bg-[rgba(251,247,238,0.85)] shadow-[0_10px_24px_-12px_rgba(63,85,65,0.6)] backdrop-blur"
      aria-label={playing ? 'Pause music' : 'Play music'}
      aria-pressed={playing}
    >
      <span className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-[var(--color-gold)]"
            animate={playing ? { height: ['30%', '100%', '45%', '80%', '30%'] } : { height: '30%' }}
            transition={playing ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </span>
    </motion.button>
  )
}
