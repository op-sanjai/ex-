import { useId, useMemo } from 'react'

/**
 * Generated layered-landscape illustration used everywhere a real client
 * photograph isn't available yet (destinations, packages, gallery, college
 * & couple sections). Every consumer documents the real image path/size it
 * expects in its data file — swapping in a photo later is a matter of
 * rendering an <img>/background-image instead of <SceneArt>, no markup
 * restructuring required.
 *
 * `scene` picks a composition; `palette` (2-4 hex colours, dark → light)
 * themes it to match each destination's mood.
 */

const HILL_BACK = 'M0,520 C120,470 220,560 340,500 C460,440 560,530 680,480 C740,455 780,470 800,460 L800,1000 L0,1000 Z'
const HILL_MID = 'M0,620 C100,580 240,660 360,610 C480,560 600,650 720,600 C760,585 780,595 800,590 L800,1000 L0,1000 Z'
const HILL_FRONT = 'M0,740 C140,700 260,770 400,730 C540,690 660,760 800,720 L800,1000 L0,1000 Z'
const WATER_TOP = 'M0,860 C100,850 200,870 300,858 C420,845 520,868 620,855 C700,846 760,858 800,850 L800,1000 L0,1000 Z'

function seeded(i, salt = 1) {
  const x = Math.sin(i * 12.9898 * salt + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function Sky({ gradId, from, to }) {
  return (
    <>
      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
      <rect width="800" height="1000" fill={`url(#${gradId})`} />
    </>
  )
}

function SunGlow({ glowId, cx = 560, cy = 220, r = 220, color }) {
  return (
    <>
      <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={color} stopOpacity="0.55" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${glowId})`} />
      <circle cx={cx} cy={cy} r={34} fill={color} opacity="0.85" />
    </>
  )
}

function Mist({ y, color, opacity = 0.35 }) {
  return <ellipse cx="400" cy={y} rx="520" ry="46" fill={color} opacity={opacity} filter="blur(2px)" />
}

function TeaRows({ color }) {
  const rows = Array.from({ length: 7 })
  return (
    <g opacity="0.5">
      {rows.map((_, i) => {
        const y = 760 + i * 26
        const wobble = seeded(i) * 14
        return (
          <path
            key={i}
            d={`M0,${y + wobble} C200,${y - 10 + wobble} 400,${y + 14 + wobble} 600,${y - 6 + wobble} C700,${y + wobble} 760,${y + 4 + wobble} 800,${y + wobble}`}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

function PineTrees({ color, baseY = 780, count = 9 }) {
  return (
    <g opacity="0.85">
      {Array.from({ length: count }).map((_, i) => {
        const x = 40 + i * (720 / (count - 1)) + (seeded(i) - 0.5) * 30
        const h = 60 + seeded(i, 2) * 40
        const y = baseY - (seeded(i, 3) * 60)
        return (
          <polygon
            key={i}
            points={`${x},${y - h} ${x - h * 0.32},${y} ${x + h * 0.32},${y}`}
            fill={color}
          />
        )
      })}
    </g>
  )
}

function CoffeeBushes({ color, baseY = 800, count = 16 }) {
  return (
    <g opacity="0.7">
      {Array.from({ length: count }).map((_, i) => {
        const x = 10 + i * (780 / (count - 1)) + (seeded(i) - 0.5) * 20
        const y = baseY + (seeded(i, 4) - 0.5) * 40
        const r = 16 + seeded(i, 5) * 10
        return <circle key={i} cx={x} cy={y} r={r} fill={color} />
      })}
    </g>
  )
}

function ForestCanopy({ color, baseY = 700 }) {
  return (
    <g opacity="0.8">
      {Array.from({ length: 22 }).map((_, i) => {
        const x = (i % 11) * 76 + (seeded(i) - 0.5) * 24
        const y = baseY + Math.floor(i / 11) * 70 + (seeded(i, 6) - 0.5) * 26
        const r = 42 + seeded(i, 7) * 20
        return <circle key={i} cx={x} cy={y} r={r} fill={color} />
      })}
    </g>
  )
}

function Waterfall({ x = 430 }) {
  return (
    <g opacity="0.8">
      <path d={`M${x},380 C${x - 6},460 ${x + 6},520 ${x},620`} stroke="#f8f5ee" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.7" />
      <ellipse cx={x} cy="630" rx="30" ry="10" fill="#f8f5ee" opacity="0.4" />
    </g>
  )
}

function LakeReflection({ color }) {
  return (
    <g>
      <path d={WATER_TOP} fill={color} opacity="0.9" />
      <g opacity="0.22" transform="translate(0,1720) scale(1,-1)">
        <path d={HILL_MID} fill={color} />
      </g>
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M${60 + i * 40},${900 + i * 8} q40,-6 80,0`}
          stroke="#f8f5ee"
          strokeWidth="3"
          opacity="0.3"
          fill="none"
        />
      ))}
    </g>
  )
}

function PalmTree({ x, y, scale = 1, color }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity="0.92">
      <path d="M0,0 C6,-40 -4,-90 -10,-130" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = -90 + (i - 2) * 32
        const rad = (angle * Math.PI) / 180
        const ex = -10 + Math.cos(rad) * 70
        const ey = -130 + Math.sin(rad) * 40
        return (
          <path
            key={i}
            d={`M-10,-130 Q${-10 + (ex + 10) * 0.5},${-130 + (ey + 130) * 0.2} ${ex},${ey}`}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

function BeachScene({ palette }) {
  const [dark, , accent, light] = palette
  return (
    <>
      <path d="M0,640 L800,640 L800,1000 L0,1000 Z" fill={dark} opacity="0.92" />
      {Array.from({ length: 4 }).map((_, i) => (
        <path
          key={i}
          d={`M0,${680 + i * 40} C200,${670 + i * 40} 600,${690 + i * 40} 800,${678 + i * 40}`}
          stroke={light || '#f8f5ee'}
          strokeWidth="3"
          opacity={0.25 - i * 0.04}
          fill="none"
        />
      ))}
      <PalmTree x={120} y={640} scale={1.1} color={dark} />
      <PalmTree x={670} y={620} scale={0.9} color={dark} />
      <PalmTree x={720} y={660} scale={0.7} color={accent} />
    </>
  )
}

function BusCampus({ palette }) {
  const [dark, mid, accent, light] = palette
  return (
    <>
      <path d={HILL_BACK} fill={mid} opacity="0.5" />
      <path d={HILL_MID} fill={dark} opacity="0.6" />
      <rect x="0" y="860" width="800" height="140" fill={dark} />
      <rect x="0" y="856" width="800" height="8" fill={light || '#f8f5ee'} opacity="0.5" />
      <rect x="220" y="700" width="360" height="170" rx="26" fill={accent} />
      <rect x="248" y="726" width="70" height="60" rx="8" fill={light || '#f8f5ee'} opacity="0.85" />
      <rect x="336" y="726" width="70" height="60" rx="8" fill={light || '#f8f5ee'} opacity="0.85" />
      <rect x="424" y="726" width="70" height="60" rx="8" fill={light || '#f8f5ee'} opacity="0.85" />
      <rect x="220" y="820" width="360" height="14" fill={dark} opacity="0.4" />
      <circle cx="286" cy="880" r="26" fill={dark} />
      <circle cx="516" cy="880" r="26" fill={dark} />
      <circle cx="286" cy="880" r="10" fill={light || '#f8f5ee'} opacity="0.6" />
      <circle cx="516" cy="880" r="10" fill={light || '#f8f5ee'} opacity="0.6" />
    </>
  )
}

function Campfire({ palette }) {
  const [dark, mid, accent, light] = palette
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={seeded(i) * 800} cy={seeded(i, 8) * 380} r={1.6} fill={light || '#f8f5ee'} opacity={0.4 + seeded(i, 9) * 0.4} />
      ))}
      <path d={HILL_FRONT} fill={dark} opacity="0.95" />
      <PineTrees color={mid} baseY={745} count={11} />
      <radialGradient id="fireglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={accent} stopOpacity="0.65" />
        <stop offset="1" stopColor={accent} stopOpacity="0" />
      </radialGradient>
      <circle cx="400" cy="820" r="160" fill="url(#fireglow)" />
      <ellipse cx="400" cy="880" rx="70" ry="16" fill={dark} />
      <polygon points="400,790 380,850 420,850" fill={accent} />
      <polygon points="400,805 388,850 412,850" fill={light || '#f1d9a4'} opacity="0.9" />
    </>
  )
}

function Houseboat({ palette }) {
  const [dark, mid, accent, light] = palette
  return (
    <>
      <path d={WATER_TOP} fill={mid} opacity="0.95" />
      <PalmTree x={90} y={862} scale={0.8} color={dark} />
      <PalmTree x={700} y={870} scale={1} color={dark} />
      <path d="M240,760 C240,700 320,660 400,660 C480,660 560,700 560,760 Z" fill={accent} />
      <rect x="220" y="760" width="360" height="60" rx="10" fill={dark} />
      <rect x="250" y="775" width="50" height="30" rx="6" fill={light || '#f8f5ee'} opacity="0.8" />
      <rect x="320" y="775" width="50" height="30" rx="6" fill={light || '#f8f5ee'} opacity="0.8" />
      <rect x="390" y="775" width="50" height="30" rx="6" fill={light || '#f8f5ee'} opacity="0.8" />
      <rect x="460" y="775" width="50" height="30" rx="6" fill={light || '#f8f5ee'} opacity="0.8" />
      <path d="M200,820 L600,820 L580,850 L220,850 Z" fill={dark} />
      <g opacity="0.2" transform="translate(0,1780) scale(1,-1)">
        <path d="M240,760 C240,700 320,660 400,660 C480,660 560,700 560,760 Z" fill={accent} />
        <rect x="220" y="760" width="360" height="60" fill={dark} />
      </g>
    </>
  )
}

function JeepSafari({ palette }) {
  const [dark, mid, accent, light] = palette
  return (
    <>
      <path d={HILL_BACK} fill={mid} opacity="0.55" />
      <path d="M-40,900 L840,780 L840,1000 L-40,1000 Z" fill={dark} opacity="0.5" />
      <ellipse cx="180" cy="900" rx="70" ry="14" fill={light || '#f8f5ee'} opacity="0.25" />
      <ellipse cx="130" cy="892" rx="50" ry="10" fill={light || '#f8f5ee'} opacity="0.2" />
      <rect x="420" y="800" width="220" height="80" rx="14" fill={accent} />
      <rect x="440" y="760" width="120" height="50" rx="10" fill={accent} />
      <rect x="452" y="770" width="40" height="30" fill={light || '#f8f5ee'} opacity="0.75" />
      <rect x="500" y="770" width="40" height="30" fill={light || '#f8f5ee'} opacity="0.75" />
      <circle cx="470" cy="884" r="28" fill={dark} />
      <circle cx="590" cy="884" r="28" fill={dark} />
    </>
  )
}

function PoolResort({ palette }) {
  const [dark, mid, accent, light] = palette
  return (
    <>
      <rect x="180" y="560" width="440" height="220" rx="6" fill={dark} opacity="0.92" />
      <polygon points="180,560 400,470 620,560" fill={mid} />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={220 + i * 76} y="610" width="46" height="46" rx="6" fill={light || '#f1d9a4'} opacity="0.8" />
      ))}
      <rect x="120" y="800" width="560" height="140" rx="18" fill={accent} opacity="0.85" />
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={i} d={`M160,${840 + i * 18} q60,-10 120,0 q60,10 120,0 q60,-10 120,0`} stroke={light || '#f8f5ee'} strokeWidth="3" opacity="0.35" fill="none" />
      ))}
      <PalmTree x={100} y={780} scale={0.9} color={dark} />
      <PalmTree x={700} y={800} scale={1.05} color={dark} />
    </>
  )
}

function LandscapeBase({ scene, palette }) {
  const [dark, mid, accent, light] = palette
  return (
    <>
      <path d={HILL_BACK} fill={mid} opacity="0.55" />
      <Mist y={560} color={light || '#f8f5ee'} opacity="0.3" />
      <path d={HILL_MID} fill={dark} opacity="0.85" />
      {scene === 'forest-falls' && <ForestCanopy color={mid} baseY={660} />}
      {scene === 'forest-falls' && <Waterfall x={420} />}
      <Mist y={700} color={light || '#f8f5ee'} opacity="0.28" />
      <path d={scene === 'blue-hills-lake' ? WATER_TOP : HILL_FRONT} fill={scene === 'blue-hills-lake' ? mid : dark} />
      {scene === 'tea-hills' && <TeaRows color={light || accent} />}
      {scene === 'meadow-pines' && <PineTrees color={dark} baseY={800} count={10} />}
      {scene === 'coffee-mist' && <CoffeeBushes color={dark} baseY={820} count={18} />}
      {scene === 'blue-hills-lake' && <LakeReflection color={mid} />}
    </>
  )
}

const SCENE_SKY = {
  'tea-hills': ['#a9c4b0', '#3a5a45'],
  'meadow-pines': ['#bcd4c4', '#274a3a'],
  'forest-falls': ['#9fb8a3', '#1c3a2b'],
  'coffee-mist': ['#c2c9a8', '#3a4a2e'],
  'blue-hills-lake': ['#c7dbe0', '#2c4a52'],
  'beach-palms': ['#fbe3c2', '#e8703a'],
  'bus-campus': ['#cfe0d2', '#2c4a3a'],
  campfire: ['#0e1a26', '#0b2b22'],
  houseboat: ['#dce8de', '#2c4a4a'],
  'jeep-safari': ['#e6d9b8', '#3a4a2e'],
  'pool-resort': ['#fbe0bd', '#e0b567'],
}

export default function SceneArt({ scene = 'tea-hills', palette = ['#0b2b22', '#1c4d3b', '#e8703a', '#f1d9a4'], className }) {
  const uid = useId()
  const [skyFrom, skyTo] = SCENE_SKY[scene] || SCENE_SKY['tea-hills']
  const showSun = ['tea-hills', 'meadow-pines', 'coffee-mist', 'blue-hills-lake', 'beach-palms', 'bus-campus', 'jeep-safari', 'pool-resort'].includes(scene)

  const content = useMemo(() => {
    switch (scene) {
      case 'beach-palms':
        return <BeachScene palette={palette} />
      case 'bus-campus':
        return <BusCampus palette={palette} />
      case 'campfire':
        return <Campfire palette={palette} />
      case 'houseboat':
        return <Houseboat palette={palette} />
      case 'jeep-safari':
        return <JeepSafari palette={palette} />
      case 'pool-resort':
        return <PoolResort palette={palette} />
      default:
        return <LandscapeBase scene={scene} palette={palette} />
    }
  }, [scene, palette])

  return (
    <svg
      className={className}
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <Sky gradId={`sky-${uid}`} from={skyFrom} to={skyTo} />
      {showSun && <SunGlow glowId={`glow-${uid}`} color={palette[2] || '#e0b567'} />}
      {content}
    </svg>
  )
}
