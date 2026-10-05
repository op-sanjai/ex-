import { useEffect, useRef } from 'react'
import { MessageCircle, Phone, X } from 'lucide-react'
import styles from './MobileMenu.module.css'
import Button from '../common/Button'
import { primaryNav } from '../../data/navigation'
import { company, buildTelLink, buildWhatsappLink } from '../../data/company'
import { useLenis } from '../../hooks/useLenis'

export default function MobileMenu({ open, onClose, onNavClick }) {
  const closeBtnRef = useRef(null)
  const lenis = useLenis()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
      closeBtnRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, lenis])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      id="mobile-menu"
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
    >
      <div className={styles.topRow}>
        <span className={styles.brand}>{company.name}</span>
        <button ref={closeBtnRef} type="button" className={styles.closeBtn} aria-label="Close menu" onClick={onClose} tabIndex={open ? 0 : -1}>
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile primary">
        <ul className={styles.navList}>
          {primaryNav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={styles.navLink}
                tabIndex={open ? 0 : -1}
                onClick={(e) => onNavClick(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.actions}>
        <Button
          as="a"
          href={buildWhatsappLink(`Hi ${company.name}, I'd like to know more about your tour packages.`)}
          external
          variant="whatsapp"
          icon={MessageCircle}
          tabIndex={open ? 0 : -1}
        >
          WhatsApp Us
        </Button>
        <Button as="a" href={buildTelLink()} variant="secondary" icon={Phone} tabIndex={open ? 0 : -1}>
          Call Now
        </Button>

        <div className={styles.contactRow}>
          <span>{company.contact.workingHours}</span>
        </div>
      </div>
    </div>
  )
}
