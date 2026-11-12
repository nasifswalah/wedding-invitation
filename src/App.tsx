import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { wedding } from './config/wedding'
import { GardenDefs } from './components/garden/GardenDefs'
import { PetalsCanvas } from './components/garden/PetalsCanvas'
import { MusicToggle } from './components/ui/MusicToggle'
import { prefersReducedMotion } from './lib/motion'
import { Trailer, type TrailerScene } from './story/Trailer'
import { SceneMode } from './story/scene'
import { Landing } from './scenes/Landing'
import { Names } from './scenes/Names'
import { DateBoard } from './scenes/DateBoard'
import { TimeScene } from './scenes/TimeScene'
import { Venue } from './scenes/Venue'
import { Invitation } from './scenes/Invitation'
import { GrowingVine } from './scenes/GrowingVine'

const MUSIC_VOLUME = 0.55

/**
 * Background song. Browsers block sound until the guest interacts, so it tries to start straight away
 * and otherwise starts on the first tap / key press. Once the guest mutes it, it stays muted.
 * It pauses while the tab is hidden.
 */
function useMusic(src: string | null, startAt = 0) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const playingRef = useRef(false)
  const mutedByGuest = useRef(false)
  const [available, setAvailable] = useState(!!src)
  const [playing, setPlaying] = useState(false)

  const fadeTo = useCallback((v: number) => {
    const a = audio.current
    if (!a) return
    gsap.killTweensOf(a)
    gsap.to(a, { volume: v, duration: 1.6, ease: 'sine.inOut', onComplete: () => { if (v === 0) a.pause() } })
  }, [])

  const start = useCallback(() => {
    const a = audio.current
    if (!a || playingRef.current) return Promise.resolve()
    return a.play().then(() => { playingRef.current = true; setPlaying(true); fadeTo(MUSIC_VOLUME) })
  }, [fadeTo])

  const stop = useCallback(() => {
    if (!playingRef.current) return
    playingRef.current = false
    setPlaying(false)
    fadeTo(0)
  }, [fadeTo])

  useEffect(() => {
    if (!src) return
    const a = new Audio(src)
    a.preload = 'auto'
    a.volume = 0
    // the song starts at `startAt` and loops back there instead of to 0:00
    const toStart = () => { if (a.currentTime < startAt) a.currentTime = startAt }
    const onEnded = () => { a.currentTime = startAt; a.play().catch(() => {}) }
    const onError = () => setAvailable(false)
    a.addEventListener('loadedmetadata', toStart)
    a.addEventListener('play', toStart)
    a.addEventListener('ended', onEnded)
    a.addEventListener('error', onError)
    setAvailable(true)
    audio.current = a

    // only these events count as a "user activation" that unlocks sound on phones
    // (pointerdown does NOT on touch screens), and we keep listening until a play actually succeeds
    const events = ['click', 'touchend', 'pointerup', 'keydown'] as const
    const stopListening = () => events.forEach((e) => window.removeEventListener(e, onFirstGesture))
    const onFirstGesture = (e: Event) => {
      // a tap on the music button itself is handled by its own toggle
      if ((e.target as Element | null)?.closest?.('[data-music-toggle]')) { stopListening(); return }
      if (mutedByGuest.current) { stopListening(); return }
      start()?.then(stopListening).catch(() => {})
    }
    start()?.catch(() => events.forEach((e) => window.addEventListener(e, onFirstGesture, { passive: true })))

    let resumeOnShow = false
    const onVisibility = () => {
      if (document.hidden) { resumeOnShow = playingRef.current; if (resumeOnShow) { gsap.killTweensOf(a); a.pause() } }
      else if (resumeOnShow) a.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stopListening()
      document.removeEventListener('visibilitychange', onVisibility)
      // detach the listeners first: clearing the source fires an 'error' event, which used to hide the button
      a.removeEventListener('loadedmetadata', toStart)
      a.removeEventListener('play', toStart)
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('error', onError)
      gsap.killTweensOf(a)
      a.pause()
      a.removeAttribute('src')
      a.load()
      if (audio.current === a) audio.current = null
      playingRef.current = false
      setPlaying(false)
    }
  }, [src, startAt, start])

  const toggle = useCallback(() => {
    if (playingRef.current) { mutedByGuest.current = true; stop() }
    else { mutedByGuest.current = false; start()?.catch(() => {}) }
  }, [start, stop])
  const play = useCallback(() => { if (!mutedByGuest.current) start()?.catch(() => {}) }, [start])
  return { available, playing, toggle, play }
}

/** Trailer timing (seconds). */
const SCENES: TrailerScene[] = [
  // after the du'a the story waits for the guest to tap "Open the invitation" (that tap also starts the music)
  { id: 'landing', C: Landing, duration: 8.5, waitForGuest: true },
  { id: 'names', C: Names, duration: 8.5 },
  { id: 'date', C: DateBoard, duration: 8.6 },
  { id: 'time', C: TimeScene, duration: 6.2 },
  { id: 'venue', C: Venue, duration: 6.2 },
  { id: 'invite', C: Invitation, duration: wedding.coupleWalk && wedding.coupleFacing ? 15.5 : 9.5 },
]

export default function App() {
  // the site opens with the story (auto-playing trailer), then hands over to the scrolling page.
  // ?skip jumps straight to the page; reduced-motion users skip the story too.
  const [free, setFree] = useState(() => new URLSearchParams(location.search).has('skip') || prefersReducedMotion())
  const [sceneIdx, setSceneIdx] = useState(0)
  const music = useMusic(wedding.music, wedding.musicStart)

  // smooth scrolling, synced with GSAP's ticker so ScrollTrigger stays frame-perfect
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('locked', !free)
    if (free) {
      window.scrollTo(0, 0)
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      const t = setTimeout(() => ScrollTrigger.refresh(), 800)
      return () => clearTimeout(t)
    }
  }, [free])

  const finish = useCallback(() => setFree(true), [])
  const startStory = useCallback(() => {
    setSceneIdx(0)
    setFree(false)
    music.play() // the tap counts as permission to play sound
  }, [music.play])
  const showPetals = free || sceneIdx >= 1
  const musicButton = <MusicToggle playing={music.playing} available={music.available} onToggle={music.toggle} />

  return (
    <>
      <GardenDefs />

      <AnimatePresence>
        {!free && (
          <motion.div key="trailer" exit={{ opacity: 0, transition: { duration: 1 } }}>
            <Trailer scenes={SCENES} onDone={finish} onSceneChange={setSceneIdx} onGuestTap={music.play} controls={musicButton} />
          </motion.div>
        )}
      </AnimatePresence>

      {free && (
        <SceneMode.Provider value="scroll">
          <motion.main
            className="relative overflow-x-clip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.2, delay: 0.4 } }}
          >
            <Names />
            <GrowingVine />
            <DateBoard />
            <GrowingVine variant={1} />
            <TimeScene />
            <GrowingVine />
            <Venue />
            <GrowingVine variant={1} />
            <Invitation />
          </motion.main>
        </SceneMode.Provider>
      )}

      {free && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.2, duration: 1 } }}
          className="fixed right-2 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-2"
        >
          {musicButton}
          {!prefersReducedMotion() && (
            <button
              onClick={startStory}
              aria-label="Watch our story"
              title="Watch our story"
              className="ctrl-btn grid h-10 w-10 place-items-center"
            >
              <svg width="12" height="13" viewBox="0 0 10 11" aria-hidden><path d="M1.5 1 L9 5.5 L1.5 10Z" fill="currentColor" /></svg>
            </button>
          )}
        </motion.div>
      )}

      {showPetals && <PetalsCanvas />}
    </>
  )
}
