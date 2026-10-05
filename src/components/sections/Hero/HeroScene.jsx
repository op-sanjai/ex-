import styles from './HeroScene.module.css'

/**
 * Hero background scene, built as separate absolutely-positioned layers so
 * each one can move at its own speed (scroll timeline + mouse parallax).
 *
 * This is the 2.5D placeholder standing in for real photography. To swap
 * in final assets, replace each layer's inline <svg> with an <img>/
 * background-image pointing at the matching file below — the layer div
 * structure, sizing and data-layer hooks used by Hero.jsx stay identical:
 *
 *   sky.webp            — full-bleed sky gradient, 1600x900 min
 *   clouds-back.webp     — transparent PNG/WebP, soft cloud puffs
 *   mountain-back.webp   — transparent WebP, farthest ridge silhouette
 *   mountain-mid.webp    — transparent WebP, mid ridge silhouette
 *   mountain-front.webp  — transparent WebP, nearest ridge silhouette
 *   tea-hills.webp       — transparent WebP, tea-plantation / hill slope band
 *   fog.webp             — transparent WebP, soft mist wisps
 *   trees-front.webp     — transparent PNG, foreground tree clusters (L/R)
 *   grass-front.webp     — transparent PNG, foreground grass silhouette
 *   road.webp            — transparent PNG, perspective road
 *   vehicle.webp         — transparent PNG, small travel vehicle
 */

function seeded(i, salt = 1) {
  const x = Math.sin(i * 12.9898 * salt + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const HILL_BACK = 'M0,420 C200,360 400,460 600,400 C800,340 1000,440 1200,380 C1350,340 1500,370 1600,360 L1600,900 L0,900 Z'
const HILL_MID = 'M0,520 C220,470 420,560 640,510 C860,460 1060,540 1280,500 C1400,480 1500,495 1600,490 L1600,900 L0,900 Z'
const HILL_FRONT = 'M0,640 C240,600 460,660 680,620 C900,580 1120,650 1360,610 C1450,595 1520,605 1600,600 L1600,900 L0,900 Z'

function CloudsLayer() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {Array.from({ length: 5 }).map((_, i) => {
        const cx = 120 + i * 340 + seeded(i) * 80
        const cy = 130 + seeded(i, 2) * 90
        const rx = 130 + seeded(i, 3) * 60
        return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={rx * 0.36} fill="#f8f5ee" opacity={0.16 + seeded(i, 4) * 0.1} filter="blur(1px)" />
      })}
    </svg>
  )
}

function MountainLayer({ path, fill }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path d={path} fill={fill} />
    </svg>
  )
}

function TeaHillsLayer() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path d={HILL_FRONT} fill="#123a2d" />
      <g opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 700 + i * 22
          const w = seeded(i) * 10
          return (
            <path
              key={i}
              d={`M0,${y + w} C400,${y - 12 + w} 800,${y + 16 + w} 1200,${y - 6 + w} C1350,${y + w} 1480,${y + 4 + w} 1600,${y + w}`}
              stroke="#6f8f5a"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
          )
        })}
      </g>
    </svg>
  )
}

function MistLayer() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <ellipse cx="420" cy="560" rx="420" ry="60" fill="#f8f5ee" opacity="0.32" filter="blur(3px)" />
      <ellipse cx="1150" cy="600" rx="380" ry="54" fill="#f8f5ee" opacity="0.26" filter="blur(3px)" />
      <ellipse cx="800" cy="660" rx="520" ry="46" fill="#f8f5ee" opacity="0.22" filter="blur(3px)" />
    </svg>
  )
}

function TreeCluster({ side }) {
  const baseX = side === 'left' ? 0 : 1600
  const dir = side === 'left' ? 1 : -1
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g opacity="0.95">
        {Array.from({ length: 6 }).map((_, i) => {
          const x = baseX + dir * (i * 70 + seeded(i, side === 'left' ? 5 : 6) * 40)
          const h = 220 + seeded(i, 7) * 140
          const y = 900 - seeded(i, 8) * 30
          return <polygon key={i} points={`${x},${y - h} ${x - h * 0.4},${y} ${x + h * 0.4},${y}`} fill="#0b2b22" />
        })}
      </g>
    </svg>
  )
}

function GrassLayer() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path
        d="M0,900 L0,820 C60,790 100,830 160,800 C220,770 260,810 320,790 C400,760 440,800 500,780 C580,750 640,800 720,770 C820,740 900,800 1000,780 C1100,760 1160,800 1240,780 C1340,750 1420,800 1520,780 C1560,772 1580,776 1600,770 L1600,900 Z"
        fill="#0e2f1f"
      />
    </svg>
  )
}

function RoadLayer() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path d="M760,600 L840,600 L1020,900 L580,900 Z" fill="#2c342f" opacity="0.88" />
      <path d="M796,610 L804,610 L800,900 L800,900 Z" fill="none" />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={796} y={640 + i * 52} width="8" height="26" fill="#e7e6df" opacity="0.5" transform={`translate(${(i - 2) * 2},0)`} />
      ))}
    </svg>
  )
}

function VehicleLayer() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g transform="translate(800,634)">
        <rect x="-22" y="-14" width="44" height="18" rx="4" fill="#e8703a" />
        <rect x="-14" y="-24" width="26" height="12" rx="3" fill="#e8703a" />
        <rect x="-10" y="-22" width="8" height="8" fill="#f8f5ee" opacity="0.8" />
        <circle cx="-13" cy="4" r="6" fill="#10201a" />
        <circle cx="13" cy="4" r="6" fill="#10201a" />
      </g>
    </svg>
  )
}

export default function HeroScene() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.layer} data-layer="sky">
        <div className={styles.layerInner} data-inner="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0b2b22" />
                <stop offset="0.55" stopColor="#1c4d3b" />
                <stop offset="1" stopColor="#6f8f5a" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#heroSky)" />
          </svg>
        </div>
      </div>

      <div className={styles.layer} data-layer="clouds-back">
        <div className={styles.layerInner} data-inner="true">
          <CloudsLayer />
        </div>
      </div>

      <div className={styles.layer} data-layer="mountain-back">
        <div className={styles.layerInner} data-inner="true">
          <MountainLayer path={HILL_BACK} fill="#3a5a45" />
        </div>
      </div>

      <div className={styles.layer} data-layer="mountain-mid">
        <div className={styles.layerInner} data-inner="true">
          <MountainLayer path={HILL_MID} fill="#1c4d3b" />
        </div>
      </div>

      <div className={styles.layer} data-layer="mist-back">
        <div className={styles.layerInner} data-inner="true">
          <MistLayer />
        </div>
      </div>

      <div className={styles.layer} data-layer="mountain-front">
        <div className={styles.layerInner} data-inner="true">
          <MountainLayer path={HILL_FRONT} fill="#123a2d" />
        </div>
      </div>

      <div className={styles.layer} data-layer="tea-hills">
        <div className={styles.layerInner} data-inner="true">
          <TeaHillsLayer />
        </div>
      </div>

      <div className={styles.layer} data-layer="road">
        <div className={styles.layerInner} data-inner="true">
          <RoadLayer />
        </div>
      </div>

      <div className={styles.layer} data-layer="vehicle">
        <div className={styles.layerInner} data-inner="true">
          <VehicleLayer />
        </div>
      </div>

      <div className={`${styles.layer} ${styles.treesLeft}`} data-layer="trees-left">
        <div className={styles.layerInner} data-inner="true">
          <TreeCluster side="left" />
        </div>
      </div>

      <div className={`${styles.layer} ${styles.treesRight}`} data-layer="trees-right">
        <div className={styles.layerInner} data-inner="true">
          <TreeCluster side="right" />
        </div>
      </div>

      <div className={styles.layer} data-layer="grass-front">
        <div className={styles.layerInner} data-inner="true">
          <GrassLayer />
        </div>
      </div>

      <div className={styles.sunOverlay} data-layer="sun-glow" />
      <div className={styles.fogCover} data-layer="fog-cover" />
    </div>
  )
}
