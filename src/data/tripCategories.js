/**
 * The eight kinds of trip we plan.
 *
 * Consumed by TripCategories.jsx (the 3D collection surfer) and by the footer
 * link column, so this file is the single source of truth for category names —
 * editing a title here updates both.
 *
 * `icon`  — a lucide-react component name, resolved in TripCategories.jsx.
 * `image` — a hero-gallery id, resolved against src/data/heroGallery.js. Those
 *           files are Creative Commons placeholders; see the note in that
 *           module before launch.
 */
export const tripCategories = [
  {
    id: 'college-tours',
    icon: 'GraduationCap',
    image: 'group-tea-trail',
    title: 'College Tours',
    description:
      'Industrial visits, department tours and final-year trips with complete documentation support.',
  },
  {
    id: 'couple-packages',
    icon: 'Heart',
    image: 'sunset-pool-stay',
    title: 'Couple Packages',
    description:
      'Romantic escapes designed around your pace, from peaceful stays to unforgettable experiences.',
  },
  {
    id: 'corporate-tours',
    icon: 'BriefcaseBusiness',
    // GALLERY_GAPS in heroGallery.js flags corporate as having no licence-clean
    // placeholder — a resort frame is the closest stand-in until client photos land.
    image: 'hill-resort-pool',
    title: 'Corporate Tours',
    description:
      'Team retreats, conferences and corporate travel planned with smooth logistics from start to finish.',
  },
  {
    id: 'group-tours',
    icon: 'Users',
    image: 'goa-beach-friends',
    title: 'Group Tours',
    description:
      'Flexible group holidays with carefully planned transport, stays and experiences.',
  },
  {
    id: 'customised-trips',
    icon: 'Compass',
    image: 'kerala-lake-hills',
    title: 'Customised Trips',
    description:
      'Tell us the shape of your trip — we plan every detail around it, start to finish.',
  },
  {
    id: 'adventure-trips',
    icon: 'Mountain',
    image: 'summit-trek',
    title: 'Adventure Trips',
    description:
      'Mountains, trails and unforgettable outdoor experiences for travellers who want more.',
  },
  {
    id: 'premium-escapes',
    icon: 'Sparkles',
    image: 'alleppey-houseboat',
    title: 'Premium Escapes',
    description:
      'Beautiful stays, private experiences and carefully curated journeys made around you.',
  },
  {
    id: 'international-trips',
    icon: 'Plane',
    // No international photography in the placeholder set — this is a stand-in.
    image: 'goa-sunset-palms',
    title: 'International Trips',
    description:
      'End-to-end international travel planning with flights, stays and experiences handled.',
  },
]
