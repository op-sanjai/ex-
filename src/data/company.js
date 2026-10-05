/**
 * Single source of truth for every editable business fact used across the
 * site — name, contact channels, socials and review rating.
 *
 * Anything marked PLACEHOLDER is unverified sample data standing in for a
 * real value ExploreKey Holidays has not yet provided. Replace every
 * PLACEHOLDER before launch; nothing here should be presented to a visitor
 * as a verified fact until it is one.
 */
export const company = {
  name: 'ExploreKey Holidays',
  shortName: 'ExploreKey',
  tagline: 'Unlock Your Perfect Journey',

  hero: {
    line1: 'Your Journey.',
    line2: 'Our Responsibility.',
    supporting:
      'Explore unforgettable destinations with carefully planned itineraries, comfortable accommodation, reliable transportation and complete trip coordination from ExploreKey Holidays.',
  },

  contact: {
    phone: '+91 90000 00000', // PLACEHOLDER — verified business number pending
    whatsappNumber: '919000000000', // PLACEHOLDER — digits only, country code first
    email: 'hello@explorekeyholidays.com', // PLACEHOLDER
    address: {
      line1: 'ExploreKey Holidays', // PLACEHOLDER
      line2: 'PLACEHOLDER Building, PLACEHOLDER Road',
      line3: 'Kochi, Kerala 682001, India', // PLACEHOLDER
    },
    mapEmbedUrl: 'https://maps.google.com/?q=ExploreKey+Holidays+Kochi', // PLACEHOLDER
    workingHours: 'Mon – Sun · 9:00 AM – 8:00 PM', // PLACEHOLDER
  },

  social: {
    instagram: 'https://instagram.com/explorekeyholidays', // PLACEHOLDER
    facebook: 'https://facebook.com/explorekeyholidays', // PLACEHOLDER
    youtube: 'https://youtube.com/@explorekeyholidays', // PLACEHOLDER
  },

  // Kept unset until the client supplies a verified Google rating —
  // the UI must never invent a number here.
  googleReviews: {
    rating: null,
    reviewCount: null,
    profileUrl: 'https://g.page/r/PLACEHOLDER/review', // PLACEHOLDER
  },
}

export function buildWhatsappLink(message) {
  const base = `https://wa.me/${company.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildTelLink() {
  return `tel:${company.contact.phone.replace(/\s+/g, '')}`
}
