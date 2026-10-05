import { useMemo } from 'react'
import { useMediaQuery } from './useMediaQuery'
import { QUERIES } from '../utils/breakpoints'

/**
 * Coarse device-capability signal used to simplify heavy scroll scenes
 * (fewer parallax layers, shorter pins, no mouse-follow) on touch devices
 * and lower-powered hardware, instead of trying to benchmark FPS at runtime.
 */
export function useDeviceCapability() {
  const isTouch = useMediaQuery(QUERIES.touch)
  const isFine = useMediaQuery(QUERIES.fine)
  const isMobile = useMediaQuery(QUERIES.mobile)
  const isTablet = useMediaQuery(QUERIES.tablet)

  return useMemo(() => {
    const cores =
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 8
    const memory =
      typeof navigator !== 'undefined' && navigator.deviceMemory
        ? navigator.deviceMemory
        : 8

    const isLowPower = cores <= 4 || memory <= 4
    const isHighEnd = !isTouch && !isMobile && !isTablet && !isLowPower

    return {
      isTouch,
      hasFinePointer: isFine,
      isMobile,
      isTablet,
      isLowPower,
      isHighEnd,
      allowMouseParallax: isFine && !isTouch,
      allowHeavyEffects: isHighEnd,
    }
  }, [isTouch, isFine, isMobile, isTablet])
}
