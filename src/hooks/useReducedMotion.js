import { useMediaQuery } from './useMediaQuery'
import { QUERIES } from '../utils/breakpoints'

/** True when the user has requested reduced motion at the OS level. */
export function useReducedMotion() {
  return useMediaQuery(QUERIES.reducedMotion)
}
