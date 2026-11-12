/** Mute / unmute button for the background song. Sits in the bottom-right control group next to play / pause. */
export function MusicToggle({ playing, available, onToggle }: { playing: boolean; available: boolean; onToggle: () => void }) {
  if (!available) return null
  return (
    <button
      onClick={onToggle}
      data-music-toggle
      className="ctrl-btn grid h-10 w-10 place-items-center"
      aria-label={playing ? 'Mute music' : 'Play music'}
      title={playing ? 'Mute music' : 'Play music'}
      aria-pressed={playing}
    >
      <svg width="17" height="15" viewBox="0 0 17 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M1.5 5.2 h2.8 L8 2 v11 L4.3 9.8 H1.5z" fill="currentColor" />
        {playing ? (
          <>
            <path d="M10.6 5 q1.6 2.5 0 5" />
            <path d="M12.8 3 q3 4.5 0 9" />
          </>
        ) : (
          <path d="M11 5 l4.5 5 M15.5 5 L11 10" />
        )}
      </svg>
    </button>
  )
}
