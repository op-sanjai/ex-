import { createContext, createElement, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../utils/gsapSetup'
import { useReducedMotion } from './useReducedMotion'

const LenisContext = createContext(null)

/**
 * Owns the single Lenis smooth-scroll instance for the whole app and keeps
 * it ticking in lockstep with GSAP's ticker so ScrollTrigger reads accurate
 * scroll positions every frame (the standard Lenis + GSAP integration).
 *
 * When the user has requested reduced motion, Lenis is skipped entirely —
 * the browser's native scroll takes over and ScrollTrigger keeps working
 * against it unmodified.
 */
export function LenisProvider({ children }) {
  const lenisRef = useRef(null)
  const [lenis, setLenis] = useState(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.classList.remove('has-lenis')
      setLenis(null)
      return undefined
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    })

    lenisRef.current = instance
    setLenis(instance)
    document.documentElement.classList.add('has-lenis')

    const onScroll = () => ScrollTrigger.update()
    instance.on('scroll', onScroll)

    const tick = (time) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.off('scroll', onScroll)
      instance.destroy()
      lenisRef.current = null
      setLenis(null)
      document.documentElement.classList.remove('has-lenis')
    }
  }, [prefersReducedMotion])

  return createElement(LenisContext.Provider, { value: lenis }, children)
}

/** Returns the live Lenis instance, or null while unavailable (reduced motion / not yet mounted). */
export function useLenis() {
  return useContext(LenisContext)
}

/** Smooth-scrolls to a target (selector, element or offset) using Lenis when available, else native scrollIntoView. */
export function scrollToTarget(lenis, target, options = {}) {
  const { offset = 0, duration = 1.2 } = options
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return

  if (lenis) {
    lenis.scrollTo(el, { offset, duration })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
