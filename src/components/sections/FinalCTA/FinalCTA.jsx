import { useRef, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import styles from './FinalCTA.module.css'
import SceneArt from '../../common/SceneArt'
import Button from '../../common/Button'
import SplitWords from '../../common/SplitWords'
import { budgetOptions, destinationOptions, tripCategoryOptions } from '../../../data/formOptions'
import { buildTelLink, buildWhatsappLink, company } from '../../../data/company'
import { useGsapContext } from '../../../utils/animationCleanup'
import { gsap } from '../../../utils/gsapSetup'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

const INITIAL_FORM = {
  name: '',
  mobile: '',
  whatsapp: '',
  email: '',
  startLocation: '',
  destination: '',
  travelDate: '',
  travellers: '',
  days: '',
  budget: '',
  category: '',
  requirements: '',
}

function buildEnquiryMessage(form) {
  const lines = [
    `Hi ${company.name}, I'd like a customised trip quote.`,
    `Name: ${form.name}`,
    `Mobile: ${form.mobile}`,
    form.whatsapp && `WhatsApp: ${form.whatsapp}`,
    form.email && `Email: ${form.email}`,
    form.startLocation && `Starting location: ${form.startLocation}`,
    form.destination && `Preferred destination: ${form.destination}`,
    form.travelDate && `Travel date: ${form.travelDate}`,
    form.travellers && `Travellers: ${form.travellers}`,
    form.days && `Days: ${form.days}`,
    form.budget && `Budget: ${form.budget}`,
    form.category && `Trip category: ${form.category}`,
    form.requirements && `Additional requirements: ${form.requirements}`,
  ].filter(Boolean)
  return lines.join('\n')
}

export default function FinalCTA() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const glowRef = useRef(null)
  const headingRef = useRef(null)
  const formRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  function updateField(key) {
    return (event) => setForm((f) => ({ ...f, [key]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const message = buildEnquiryMessage(form)
    window.open(buildWhatsappLink(message), '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  useGsapContext(
    sectionRef,
    () => {
      const words = headingRef.current.querySelectorAll('.word-inner')

      if (prefersReducedMotion) {
        gsap.set(words, { yPercent: 0, opacity: 1 })
        gsap.set(formRef.current, { opacity: 1, y: 0 })
        return
      }

      gsap.set(words, { yPercent: 100, opacity: 0 })

      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.03,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      gsap.to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
      })

      gsap.to(bgRef.current, {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

      gsap.to(glowRef.current, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom bottom', scrub: 1 },
      })

      gsap.utils.toArray(`.${styles.particle}`).forEach((p, i) => {
        gsap.to(p, {
          y: -120 - i * 20,
          x: (i % 2 === 0 ? 1 : -1) * (20 + i * 6),
          opacity: 0,
          duration: 4 + i * 0.6,
          repeat: -1,
          delay: i * 0.7,
          ease: 'sine.out',
        })
      })
    },
    [prefersReducedMotion]
  )

  return (
    <section id="final-cta" ref={sectionRef} className={styles.section} aria-label="Plan your customised trip">
      <div ref={bgRef} className={styles.bgArt} aria-hidden="true">
        <SceneArt scene="campfire" palette={['#1a1109', '#341c0f', '#e8703a', '#f1d9a4']} />
      </div>
      <div ref={glowRef} className={styles.glow} aria-hidden="true" style={{ opacity: prefersReducedMotion ? 0.6 : 0 }} />
      {!prefersReducedMotion &&
        Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={styles.particle}
            aria-hidden="true"
            style={{ left: `${15 + i * 13}%` }}
          />
        ))}

      <div className={`container ${styles.grid}`}>
        <div>
          <span className="eyebrow">Let's Plan It</span>
          <h2 ref={headingRef} className={styles.heading}>
            <SplitWords text="Planning a trip? Let us build the right package for you." />
          </h2>
          <p className={styles.lede}>
            Share a few details and our team will put together a itinerary and quote tailored to your group, your
            pace and your budget.
          </p>
          <div className={styles.contactRow}>
            <Button href={buildTelLink()} variant="secondary" icon={Phone}>
              Call Now
            </Button>
            <Button href={buildWhatsappLink(`Hi ${company.name}, I'd like to plan a trip.`)} external variant="whatsapp" icon={MessageCircle}>
              WhatsApp Us
            </Button>
          </div>
        </div>

        <form ref={formRef} className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-name">
                Name
              </label>
              <input id="cta-name" className={styles.input} type="text" required value={form.name} onChange={updateField('name')} placeholder="Your full name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-mobile">
                Mobile number
              </label>
              <input id="cta-mobile" className={styles.input} type="tel" required value={form.mobile} onChange={updateField('mobile')} placeholder="+91 90000 00000" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-whatsapp">
                WhatsApp number
              </label>
              <input id="cta-whatsapp" className={styles.input} type="tel" value={form.whatsapp} onChange={updateField('whatsapp')} placeholder="If different from mobile" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-email">
                Email
              </label>
              <input id="cta-email" className={styles.input} type="email" value={form.email} onChange={updateField('email')} placeholder="you@email.com" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-start">
                Starting location
              </label>
              <input id="cta-start" className={styles.input} type="text" value={form.startLocation} onChange={updateField('startLocation')} placeholder="City you're travelling from" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-destination">
                Preferred destination
              </label>
              <select id="cta-destination" className={styles.select} value={form.destination} onChange={updateField('destination')}>
                <option value="">Select destination</option>
                {destinationOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-date">
                Travel date
              </label>
              <input id="cta-date" className={styles.input} type="date" value={form.travelDate} onChange={updateField('travelDate')} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-travellers">
                Number of travellers
              </label>
              <input id="cta-travellers" className={styles.input} type="number" min="1" value={form.travellers} onChange={updateField('travellers')} placeholder="e.g. 4" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-days">
                Number of days
              </label>
              <input id="cta-days" className={styles.input} type="number" min="1" value={form.days} onChange={updateField('days')} placeholder="e.g. 3" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cta-budget">
                Approximate budget
              </label>
              <select id="cta-budget" className={styles.select} value={form.budget} onChange={updateField('budget')}>
                <option value="">Select budget range</option>
                {budgetOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="cta-category">
                Trip category
              </label>
              <select id="cta-category" className={styles.select} value={form.category} onChange={updateField('category')}>
                <option value="">Select trip category</option>
                {tripCategoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="cta-requirements">
                Additional requirements
              </label>
              <textarea
                id="cta-requirements"
                className={styles.textarea}
                value={form.requirements}
                onChange={updateField('requirements')}
                placeholder="Anything else we should know?"
              />
            </div>

            <div className={styles.submitRow}>
              <Button type="submit">Get My Customised Quote</Button>
            </div>
            {submitted && (
              <p className={styles.successNote} role="status">
                Opening WhatsApp with your trip details — send the message to reach our team directly.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
