import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

let registered = false

/**
 * Registers GSAP plugins exactly once for the whole app lifetime.
 * Safe to call from every component that needs ScrollTrigger —
 * repeated calls are no-ops thanks to the module-level guard.
 */
export function ensureGsapRegistered() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger, useGSAP)

  gsap.defaults({
    ease: 'power2.out',
  })

  ScrollTrigger.config({
    ignoreMobileResize: true,
  })

  registered = true
}

export { gsap, ScrollTrigger, useGSAP }
