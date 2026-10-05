/**
 * ScrollMorphHero gallery source.
 *
 * IMAGES ARE DEVELOPMENT PLACEHOLDERS.
 * Every file in `src/assets/hero-gallery/` is a Creative Commons photograph
 * sourced via Openverse and filtered to licences that permit BOTH commercial
 * use AND modification (CC0 / CC BY / CC BY-SA) — see ATTRIBUTION.md in that
 * folder for the per-file creator + licence, which MUST be honoured or the
 * files replaced before launch.
 *
 * Replacing with client photography: drop a `<id>.webp` (360x480, 3:4) and a
 * `<id>-sm.webp` (200x267, 3:4) into src/assets/hero-gallery/ using the same
 * `id` below. Nothing else needs to change — the glob picks them up.
 */

// Vite resolves + hashes these at build time; no remote URLs at runtime.
const full = import.meta.glob('../assets/hero-gallery/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

function asset(id, small = false) {
  const key = `../assets/hero-gallery/${id}${small ? '-sm' : ''}.webp`
  return full[key]
}

/**
 * `priority: true` marks the images preloaded eagerly (first 8) — they are the
 * ones visible earliest in the scatter/line stages. The rest lazy-load.
 */
const ITEMS = [
  { id: 'munnar-tea-estate',   destination: 'Munnar',   category: 'Tea Plantations',      objectPosition: 'center',     alt: 'Terraced tea estates rolling across the Munnar hills' },
  { id: 'alleppey-houseboat',  destination: 'Alleppey', category: 'Houseboats',           objectPosition: 'center',     alt: 'A traditional Kerala houseboat moored on the Alleppey backwaters' },
  { id: 'wayanad-green-hills', destination: 'Wayanad',  category: 'Forests',              objectPosition: 'center',     alt: 'Green forested hills rising above the Wayanad canopy' },
  { id: 'goa-sunset-palms',    destination: 'Goa',      category: 'Beaches',              objectPosition: 'center',     alt: 'Coconut palms silhouetted against a Goa sunset' },
  { id: 'vagamon-meadows',     destination: 'Vagamon',  category: 'Hills & Meadows',      objectPosition: 'center 60%', alt: 'Mist drifting over the open grassland meadows of Vagamon' },
  { id: 'coorg-waterfall',     destination: 'Coorg',    category: 'Waterfalls',           objectPosition: 'center',     alt: 'A tall waterfall falling through dense forest' },
  { id: 'munnar-tea-path',     destination: 'Munnar',   category: 'Scenic Roads',         objectPosition: 'center',     alt: 'A narrow path winding down through terraced tea slopes' },
  { id: 'trek-group-hills',    destination: 'Wayanad',  category: 'Adventure Activities', objectPosition: 'center',     alt: 'A trekking group climbing a green hillside together' },
  { id: 'munnar-tea-valley',   destination: 'Munnar',   category: 'Tea Plantations',      objectPosition: 'center',     alt: 'Wide view over the tea valleys around Munnar' },
  { id: 'kerala-backwaters',   destination: 'Alleppey', category: 'Houseboats',           objectPosition: 'center',     alt: 'A houseboat drifting along a palm-lined backwater channel' },
  { id: 'wayanad-deer',        destination: 'Wayanad',  category: 'Jeep Safaris',         objectPosition: 'center',     alt: 'Spotted deer standing in dappled forest light' },
  { id: 'goa-beach-sunset',    destination: 'Goa',      category: 'Beaches',              objectPosition: 'center',     alt: 'Warm sunset light behind palms on a quiet beach' },
  { id: 'group-tea-trail',     destination: 'Munnar',   category: 'College Tours',        objectPosition: 'center',     alt: 'A travel group walking a trail between tea plantations' },
  { id: 'wayanad-falls',       destination: 'Wayanad',  category: 'Waterfalls',           objectPosition: 'center',     alt: 'Wide cascading falls spilling over mossy rock' },
  { id: 'munnar-viewpoint',    destination: 'Munnar',   category: 'Mountain Viewpoints',  objectPosition: 'center',     alt: 'A viewpoint railing looking out to a distant peak' },
  { id: 'hill-resort-pool',    destination: 'Coorg',    category: 'Resorts',              objectPosition: 'center',     alt: 'A resort pool framed by palms and garden greenery' },
  { id: 'kerala-lake-hills',   destination: 'Kerala',   category: 'Kerala Landscapes',    objectPosition: 'center',     alt: 'A quiet lake backed by green hills in the Kerala highlands' },
  { id: 'wayanad-elephant',    destination: 'Wayanad',  category: 'Jeep Safaris',         objectPosition: 'center',     alt: 'An elephant among the trees in a forest reserve' },
  { id: 'goa-beach-friends',   destination: 'Goa',      category: 'Friends Trips',        objectPosition: 'center',     alt: 'Friends playing together on an open beach' },
  { id: 'coorg-hills',         destination: 'Coorg',    category: 'Hills & Meadows',      objectPosition: 'center',     alt: 'Layered green hills fading into cloud over Coorg' },
  { id: 'ooty-tea-picker',     destination: 'Ooty',     category: 'Kerala Landscapes',    objectPosition: 'center 40%', alt: 'A tea estate worker among the Nilgiri tea bushes' },
  { id: 'summit-trek',         destination: 'Vagamon',  category: 'Adventure Activities', objectPosition: 'center',     alt: 'Trekkers following a ridge path toward the summit' },
  { id: 'sunset-pool-stay',    destination: 'Coorg',    category: 'Couple Trips',         objectPosition: 'center',     alt: 'A still poolside evening under a wide sunset sky' },
  { id: 'group-bus-travel',    destination: 'Kerala',   category: 'Bus Travel',           objectPosition: 'center',     alt: 'A road-side bus on a local Indian highway' },
]

const PRIORITY_COUNT = 8

export const heroGallery = ITEMS.map((item, i) => ({
  ...item,
  src: asset(item.id),
  srcSmall: asset(item.id, true),
  priority: i < PRIORITY_COUNT,
})).filter((item) => Boolean(item.src))

/**
 * Mobile shows a reduced set (spec: 10-14 images) so the ring stays legible and
 * fewer bytes are fetched. Taking every other item keeps the destination mix
 * varied rather than clustering one region.
 */
export const heroGalleryMobile = heroGallery.filter((_, i) => i % 2 === 0).slice(0, 12)

/** Categories the client should shoot to replace the weakest placeholders. */
export const GALLERY_GAPS = [
  'Campfire Evenings — no licence-clean placeholder found; needs client photo',
  'Corporate Outings — no licence-clean placeholder found; needs client photo',
  'Customer Celebrations — no licence-clean placeholder found; needs client photo',
]
