import { useRef } from 'react'
import {
  BedDouble,
  BookOpen,
  Building2,
  Bus,
  CalendarRange,
  Factory,
  FileCheck2,
  GraduationCap,
  MessageCircle,
  Sun,
  UserCheck,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import styles from './CollegeTours.module.css'
import SceneArt from '../../common/SceneArt'
import Button from '../../common/Button'
import { collegeTourCta, collegeTourFeatures, collegeTourHeading, collegeTourWhatsappMessage } from '../../../data/collegeTours'
import { buildWhatsappLink } from '../../../data/company'
import { useGsapContext } from '../../../utils/animationCleanup'
import { gsap } from '../../../utils/gsapSetup'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

const ICONS = { Factory, BookOpen, Building2, GraduationCap, Users, Sun, CalendarRange, Bus, UtensilsCrossed, BedDouble, UserCheck, FileCheck2 }

export default function CollegeTours() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const featuresRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useGsapContext(
    sectionRef,
    () => {
      const features = featuresRef.current.children
      if (prefersReducedMotion) {
        gsap.set(features, { opacity: 1, y: 0 })
        return
      }

      gsap.to(features, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 85%' },
      })

      gsap.to(bgRef.current, {
        y: '8%',
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    },
    [prefersReducedMotion]
  )

  return (
    <section id="college-tours" ref={sectionRef} className={styles.section} aria-label="College tours">
      <div ref={bgRef} className={styles.bg}>
        <SceneArt scene="bus-campus" palette={['#123a2d', '#1c4d3b', '#e0b567', '#f1d9a4']} />
      </div>
      <div className={styles.scrim} />

      <div className={`container ${styles.content}`}>
        <div>
          <span className="eyebrow">College &amp; Group Tours</span>
          <h2 className={styles.heading}>{collegeTourHeading}</h2>
          <p className={styles.lede}>
            Industrial visits, department tours and final-year trips — planned with the documentation, safety and
            coordination that group travel needs, from a one-day outing to a multi-day tour.
          </p>
          <div ref={featuresRef} className={styles.features}>
            {collegeTourFeatures.map((f) => {
              const Icon = ICONS[f.icon]
              return (
                <div key={f.label} className={styles.feature}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{f.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.ctaCol}>
          <Button
            href={buildWhatsappLink(collegeTourWhatsappMessage)}
            external
            variant="whatsapp"
            icon={MessageCircle}
          >
            {collegeTourCta}
          </Button>
        </div>
      </div>
    </section>
  )
}
