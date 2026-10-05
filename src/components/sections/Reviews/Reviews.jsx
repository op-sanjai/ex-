import { useRef } from 'react'
import { ExternalLink, Star, Video } from 'lucide-react'
import styles from './Reviews.module.css'
import SceneArt from '../../common/SceneArt'
import Button from '../../common/Button'
import SectionHeading from '../../common/SectionHeading'
import { testimonials, testimonialTypeLabels } from '../../../data/testimonials'
import { company } from '../../../data/company'
import { useGsapContext } from '../../../utils/animationCleanup'
import { gsap } from '../../../utils/gsapSetup'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

export default function Reviews() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const items = prefersReducedMotion ? testimonials : [...testimonials, ...testimonials]

  useGsapContext(
    sectionRef,
    () => {
      if (prefersReducedMotion) return

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: 'none',
        duration: 42,
        repeat: -1,
      })

      const el = sectionRef.current
      const pause = () => tween.pause()
      const resume = () => tween.play()
      el.addEventListener('mouseenter', pause)
      el.addEventListener('mouseleave', resume)
      el.addEventListener('focusin', pause)
      el.addEventListener('focusout', resume)

      return () => {
        el.removeEventListener('mouseenter', pause)
        el.removeEventListener('mouseleave', resume)
        el.removeEventListener('focusin', pause)
        el.removeEventListener('focusout', resume)
      }
    },
    [prefersReducedMotion]
  )

  return (
    <section id="reviews" ref={sectionRef} className={styles.section} aria-label="Customer reviews">
      <div className={styles.bgArt} aria-hidden="true">
        <SceneArt scene="tea-hills" palette={['#0b2b22', '#1c4d3b', '#6f8f5a', '#e0b567']} />
      </div>

      <div className="container">
        <div className={styles.header}>
          <SectionHeading
            eyebrow="Traveller Stories"
            heading="What the last group said"
            lede="A mix of Google reviews, written notes and video stories from recent trips."
          />
          {company.googleReviews.rating ? (
            <span className={styles.ratingNote}>
              {company.googleReviews.rating.toFixed(1)} ★ from {company.googleReviews.reviewCount}+ Google reviews
            </span>
          ) : (
            <span className={styles.ratingNote}>Google rating verification in progress</span>
          )}
        </div>
      </div>

      <div className={styles.trackViewport}>
        <div ref={trackRef} className={styles.track}>
          {items.map((t, i) => (
            <article key={`${t.id}-${i}`} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.typeTag}>
                  {testimonialTypeLabels[t.type]}
                  {t.type === 'video' && <Video size={12} style={{ marginLeft: 6, verticalAlign: '-2px' }} aria-hidden="true" />}
                </span>
                <span className={styles.stars} aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} fill={s < t.rating ? 'currentColor' : 'none'} aria-hidden="true" />
                  ))}
                </span>
              </div>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className={styles.personName}>{t.name}</div>
                  <div className={styles.personGroup}>{t.group}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Button href={company.googleReviews.profileUrl} external variant="secondary" icon={ExternalLink} iconPosition="right">
          View All Google Reviews
        </Button>
      </div>
    </section>
  )
}
