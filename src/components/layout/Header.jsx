import { useRef, useState } from 'react'
import { Menu, MessageCircle, Phone } from 'lucide-react'
import styles from './Header.module.css'
import Button from '../common/Button'
import MobileMenu from './MobileMenu'
import { primaryNav } from '../../data/navigation'
import { company, buildTelLink, buildWhatsappLink } from '../../data/company'
import { useLenis, scrollToTarget } from '../../hooks/useLenis'
import { useGsapContext } from '../../utils/animationCleanup'
import { ScrollTrigger } from '../../utils/gsapSetup'

export default function Header() {
  const headerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  // The hero renders on a light background, so the header needs dark ink while
  // it is in view and reverts to the light-on-dark treatment afterwards.
  const [onLight, setOnLight] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lenis = useLenis()

  useGsapContext(
    headerRef,
    () => {
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onToggle: (self) => setScrolled(self.isActive),
      })

      const hero = document.getElementById('home')
      if (!hero) {
        setOnLight(false)
        return
      }
      // Watch the single point where the hero leaves the top of the viewport,
      // rather than the hero's whole range. A range trigger reports inactive at
      // scroll 0 (the start boundary is exclusive), which stranded the header in
      // dark mode over the light hero. This mirrors the `scrolled` trigger above,
      // which is the same open-ended shape and is reliable at both extremes.
      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top',
        end: 99999,
        // The hero's height is only final AFTER its own pin adds a spacer, and
        // Header mounts first — so refresh this one last.
        refreshPriority: -1,
        onToggle: (self) => setOnLight(!self.isActive),
        onRefresh: (self) => setOnLight(!self.isActive),
      })
    },
    []
  )

  function handleNavClick(event, href) {
    if (!href.startsWith('#')) return
    event.preventDefault()
    // The mobile menu calls lenis.stop() while open — restart it before
    // scrolling, otherwise scrollTo() is queued against a paused raf loop
    // and never actually animates.
    lenis?.start()
    const offset = -(headerRef.current?.offsetHeight || 80) - 12
    scrollToTarget(lenis, href, { offset })
    setMobileOpen(false)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={[styles.header, scrolled ? styles.scrolled : '', onLight ? styles.onLight : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={`container ${styles.row}`}>
          <a
            href="#home"
            className={styles.logo}
            onClick={(e) => handleNavClick(e, '#home')}
            aria-label={`${company.name} — home`}
          >
            <span className={styles.logoMain}>{company.shortName}</span>
            <span className={styles.logoSub}>Holidays</span>
          </a>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={styles.navLink} onClick={(e) => handleNavClick(e, item.href)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <div className={styles.iconAction}>
              <Button
                as="a"
                href={buildWhatsappLink(`Hi ${company.name}, I'd like to know more about your tour packages.`)}
                external
                variant="whatsapp"
                size="sm"
                icon={MessageCircle}
              >
                WhatsApp
              </Button>
              <Button
                as="a"
                href={buildTelLink()}
                variant={onLight ? 'secondaryOnLight' : 'secondary'}
                size="sm"
                icon={Phone}
              >
                Call Now
              </Button>
            </div>
            <button
              type="button"
              className={styles.hamburger}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} onNavClick={handleNavClick} />
    </>
  )
}
