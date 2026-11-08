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
  return { available, playing, toggle }
}

/** Trailer timing (seconds). */
const SCENES: TrailerScene[] = [
  { id: 'landing', C: Landing, duration: 9 },
  { id: 'names', C: Names, duration: 8.5 },
  { id: 'date', C: DateBoard, duration: 10 },
  { id: 'time', C: TimeScene, duration: 7.5 },
  { id: 'venue', C: Venue, duration: 7.5 },
  { id: 'invite', C: Invitation, duration: 11 },
]

export default function App() {
  // ?skip jumps straight to the scroll page; reduced-motion users skip the trailer too
  const [free, setFree] = useState(() => new URLSearchParams(location.search).has('skip') || prefersReducedMotion())
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

      {showPetals && <PetalsCanvas />}
      <MusicToggle playing={music.playing} available={music.available} onToggle={music.toggle} />
    </>
  )
}
