import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, ensureGsapRegistered } from './gsapSetup'

/**
 * Standard lifecycle wrapper every scroll-animated section uses: runs
 * `setup()` inside a gsap.context() scoped to `scopeRef`, then reverts
 * every tween/ScrollTrigger it created on unmount or dependency change.
 * This is the one cleanup path for the whole app — no component manages
 * gsap.context or ScrollTrigger.kill by hand.
 */
export function useGsapContext(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    ensureGsapRegistered()
    if (!scopeRef.current) return undefined

    const ctx = gsap.context(setup, scopeRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * ScrollTrigger measures the page on mount, but hero fonts/images can
 * still be loading then, which throws pin distances off. Call once at
 * app root to refresh measurements after everything has actually settled.
 */
export function refreshScrollTriggerAfterLoad() {
  const refresh = () => ScrollTrigger.refresh()

  if (document.readyState === 'complete') {
    requestAnimationFrame(refresh)
  } else {
    window.addEventListener('load', () => requestAnimationFrame(refresh), { once: true })
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(refresh).catch(() => {})
  }
}

/** Shared scrub/duration constants so section timelines feel consistent. */
export const MOTION = {
  scrubSoft: 0.6,
  scrubMed: 1,
  scrubHeavy: 1.5,
  easeCinematic: 'power2.out',
  easeSoft: 'sine.inOut',
}
