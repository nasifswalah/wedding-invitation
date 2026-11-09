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

function useMusic(src: string | null) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [available, setAvailable] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!src) return
    const a = new Audio(src)
    a.loop = true
    a.preload = 'auto'
    a.volume = 0
    a.addEventListener('canplaythrough', () => setAvailable(true), { once: true })
    a.addEventListener('error', () => setAvailable(false))
    audio.current = a
    return () => a.pause()
  }, [src])

  const fadeTo = (v: number) => {
    const a = audio.current
    if (!a) return
    gsap.to(a, { volume: v, duration: 1.6, ease: 'sine.inOut', onComplete: () => { if (v === 0) a.pause() } })
  }
  const toggle = () => {
    const a = audio.current
    if (!a) return
    if (playing) { setPlaying(false); fadeTo(0) } else a.play().then(() => { setPlaying(true); fadeTo(0.55) }).catch(() => {})
  }
  const play = () => { if (!playing) toggle() }
  return { available, playing, toggle, play }
}

/** Trailer timing (seconds). */
const SCENES: TrailerScene[] = [
  { id: 'landing', C: Landing, duration: 8.5 },
  { id: 'names', C: Names, duration: 8.5 },
  { id: 'date', C: DateBoard, duration: 8.6 },
  { id: 'time', C: TimeScene, duration: 6.2 },
  { id: 'venue', C: Venue, duration: 6.2 },
  { id: 'invite', C: Invitation, duration: wedding.coupleWalk && wedding.coupleFacing ? 15.5 : 12 },
]

export default function App() {
  // the site opens as a normal scrolling page; the story (auto-playing trailer) starts from the hero.
  // ?story opens straight into the story.
  const [free, setFree] = useState(() => !new URLSearchParams(location.search).has('story') || prefersReducedMotion())
  const [sceneIdx, setSceneIdx] = useState(0)
  const music = useMusic(wedding.music)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [music.playing, music.available])
  const showPetals = free || sceneIdx >= 1

  return (
    <>
      <GardenDefs />

      <AnimatePresence>
        {!free && (
          <motion.div key="trailer" exit={{ opacity: 0, transition: { duration: 1 } }}>
            <Trailer scenes={SCENES} onDone={finish} onSceneChange={setSceneIdx} />
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

      {free && !prefersReducedMotion() && (
        <motion.button
          onClick={startStory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 2.5, duration: 1 } }}
          className="fixed right-2 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 inline-flex h-11 items-center gap-2 px-3 font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.3em] text-[var(--color-pencil)] uppercase"
        >
          <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden><path d="M1.5 1 L9 5.5 L1.5 10Z" fill="currentColor" /></svg>
          Watch our story
        </motion.button>
      )}

      {showPetals && <PetalsCanvas />}
      <MusicToggle playing={music.playing} available={music.available} onToggle={music.toggle} />
    </>
  )
}
