/**
 * Primary header navigation. This build ships the full experience as one
 * cinematic homepage (per brief), so every entry deep-links to an anchor
 * on that page rather than a separate route. If dedicated pages are added
 * later, swap the matching `href` for a real route — nothing else in the
 * Header needs to change since it just renders this list.
 */
export const primaryNav = [
  { label: 'Home', href: '#home' },
  { label: 'Tour Packages', href: '#packages' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Group Tours', href: '#trip-categories' },
  { label: 'College Tours', href: '#college-tours' },
  { label: 'Couple Packages', href: '#couple-tours' },
  { label: 'Corporate Tours', href: '#trip-categories' },
  { label: 'Customise Your Trip', href: '#final-cta' },
  { label: 'About Us', href: '#why-choose-us' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact Us', href: '#final-cta' },
]

/** Booking lookups aren't backed by a system yet, so this routes to a WhatsApp enquiry instead of a dead page. */
export const myBookingWhatsappMessage =
  "Hi ExploreKey Holidays, I'd like to check the status of my booking."
