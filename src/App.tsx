import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { wedding } from './config/wedding'
import { GardenDefs } from './components/garden/GardenDefs'
import { PetalsCanvas } from './components/garden/PetalsCanvas'
import { IntroCalligraphy } from './components/intro/IntroCalligraphy'
import { Hero } from './components/sections/Hero'
import { VineTransition } from './components/transitions/VineTransition'
import { DateTime } from './components/sections/DateTime'
import { Events } from './components/sections/Events'
import { Location } from './components/sections/Location'
import { Message } from './components/sections/Message'
import { Closing } from './components/sections/Closing'
import { MusicToggle } from './components/ui/MusicToggle'
import { prefersReducedMotion } from './lib/motion'

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
  const play = () => {
    const a = audio.current
    if (!a) return
    a.play().then(() => { setPlaying(true); fadeTo(0.55) }).catch(() => {})
  }
  const toggle = () => {
    if (playing) { setPlaying(false); fadeTo(0) } else play()
  }
  return { available, playing, play, toggle }
}

export default function App() {
  // ?skip in the URL jumps straight to the invitation (handy while editing)
  const [introDone, setIntroDone] = useState(() => new URLSearchParams(location.search).has('skip'))
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
    document.body.classList.toggle('locked', !introDone)
    if (introDone) {
      window.scrollTo(0, 0)
      // fonts/layout settle after intro → recompute scroll positions
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      setTimeout(() => ScrollTrigger.refresh(), 600)
    }
  }, [introDone])

  const finishIntro = useCallback(() => setIntroDone(true), [])
  const playMusic = music.play

  return (
    <>
      <GardenDefs />
      <AnimatePresence>
        {!introDone && <IntroCalligraphy key="intro" onOpen={playMusic} onDone={finishIntro} />}
      </AnimatePresence>

      <main className="relative overflow-x-clip">
        <Hero revealed={introDone} />
        <VineTransition />
        <DateTime />
        <Events />
        <Location />
        <Message />
        <Closing />
      </main>

      {introDone && <PetalsCanvas />}
      <MusicToggle playing={music.playing} available={music.available && introDone} onToggle={music.toggle} />
    </>
  )
}
