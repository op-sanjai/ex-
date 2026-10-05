/**
 * Shared breakpoint queries — used by both CSS-adjacent JS (matchMedia,
 * gsap.matchMedia) and React hooks so every part of the app agrees on
 * where "mobile" ends and "desktop" begins.
 */
export const QUERIES = {
  mobile: '(max-width: 640px)',
  tablet: '(min-width: 641px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  touch: '(hover: none) and (pointer: coarse)',
  fine: '(hover: hover) and (pointer: fine)',
}
