import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsapSetup'
import { useGsapContext } from '../../utils/animationCleanup'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Animated count-up, triggered once when it enters the viewport. */
export default function Counter({ value, suffix = '', duration = 2, className }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useGsapContext(
    ref,
    () => {
      const el = ref.current
      if (prefersReducedMotion) {
        el.textContent = `${value.toLocaleString('en-IN')}${suffix}`
        return
      }

      const counter = { val: 0 }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${Math.floor(counter.val).toLocaleString('en-IN')}${suffix}`
            },
          })
        },
      })
    },
    [value, suffix, duration, prefersReducedMotion]
  )

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
