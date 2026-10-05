/**
 * Recent Trip Gallery — masonry grid. `image` documents the intended
 * client asset path (recommended 1200×1500 portrait or 1600×1067
 * landscape, WebP). `scene`/`palette`/`tall` drive the generated
 * placeholder art and layout until real photos are supplied.
 */
export const galleryItems = [
  { id: 'g1', category: 'College Tours', caption: 'Industrial visit group photo', scene: 'forest-falls', palette: ['#123a2d', '#3f6b4a'], tall: true, isVideo: false },
  { id: 'g2', category: 'Friends Trips', caption: 'Sunset at the viewpoint', scene: 'tea-hills', palette: ['#1c4d3b', '#e0b567'], tall: false, isVideo: false },
  { id: 'g3', category: 'Couple Trips', caption: 'Private candlelight dinner', scene: 'beach-palms', palette: ['#0b2b22', '#e8703a'], tall: false, isVideo: true },
  { id: 'g4', category: 'Jeep Safaris', caption: 'Off-road trail in the hills', scene: 'coffee-mist', palette: ['#123a2d', '#7c9a5a'], tall: true, isVideo: false },
  { id: 'g5', category: 'Campfire Evenings', caption: 'Campfire night at the resort', scene: 'meadow-pines', palette: ['#0e2f2f', '#e0b567'], tall: false, isVideo: true },
  { id: 'g6', category: 'Houseboat Stays', caption: 'Alleppey backwaters at dusk', scene: 'blue-hills-lake', palette: ['#0e2f2f', '#5b8a8a'], tall: true, isVideo: false },
  { id: 'g7', category: 'Adventure Activities', caption: 'Trekking group at the summit', scene: 'forest-falls', palette: ['#0b2b22', '#9fb98a'], tall: false, isVideo: false },
  { id: 'g8', category: 'Corporate Outings', caption: 'Team offsite group activity', scene: 'tea-hills', palette: ['#1c4d3b', '#f1d9a4'], tall: false, isVideo: false },
  { id: 'g9', category: 'College Tours', caption: 'Department tour, day one', scene: 'meadow-pines', palette: ['#123a2d', '#8fae6a'], tall: true, isVideo: false },
  { id: 'g10', category: 'Friends Trips', caption: 'Beach evening, Goa', scene: 'beach-palms', palette: ['#0b2b22', '#f1d9a4'], tall: false, isVideo: true },
]

export const galleryCategories = [
  'All',
  'College Tours',
  'Friends Trips',
  'Couple Trips',
  'Jeep Safaris',
  'Campfire Evenings',
  'Houseboat Stays',
  'Adventure Activities',
  'Corporate Outings',
]
