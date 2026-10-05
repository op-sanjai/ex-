import { MessageCircle, Phone } from 'lucide-react'
import styles from './StickyActions.module.css'
import { company, buildTelLink, buildWhatsappLink } from '../../data/company'

/** Sticky mobile/tablet-only WhatsApp + Call buttons — desktop already has both permanently in the header. */
export default function StickyActions() {
  return (
    <div className={styles.wrap}>
      <a
        href={buildWhatsappLink(`Hi ${company.name}, I'd like to know more about your tour packages.`)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.whatsapp}`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} aria-hidden="true" />
      </a>
      <a href={buildTelLink()} className={`${styles.btn} ${styles.call}`} aria-label="Call ExploreKey Holidays now">
        <Phone size={20} aria-hidden="true" />
      </a>
    </div>
  )
}
