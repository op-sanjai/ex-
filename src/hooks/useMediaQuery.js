import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query string and returns whether it currently matches.
 * Re-evaluates on viewport resize / orientation change via the native
 * MediaQueryList change event — no polling.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)

    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
