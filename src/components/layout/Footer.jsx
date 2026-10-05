import { useRef } from "react";
import { Clock, Mail, MapPin, MoveUp, Phone } from "lucide-react";

import styles from "./Footer.module.css";
import SocialIcon from "../common/SocialIcon";
import { company, buildTelLink } from "../../data/company";
import { destinations } from "../../data/destinations";
import { tripCategories } from "../../data/tripCategories";

import { useGsapContext } from "../../utils/animationCleanup";
import { gsap } from "../../utils/gsapSetup";
import { useLenis } from "../../hooks/useLenis";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const supportLinks = [
  { label: "Contact Us", href: "#final-cta" },
  { label: "Customise Your Trip", href: "#final-cta" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
];

/* The marquee reads from real content rather than invented strapline copy. */
const MARQUEE = [
  ...destinations.map((d) => d.name),
  ...tripCategories.slice(0, 4).map((c) => c.title),
];

/* Pull toward the pointer, as a fraction of the offset from centre. */
const MAGNET_PULL = 0.35;
const MAGNET_TILT = 0.12;

export default function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const leadRef = useRef(null);
  const columnsRef = useRef(null);

  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  const year = new Date().getFullYear();

  const handleBackToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });

      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGsapContext(
    footerRef,
    () => {
      const footer = footerRef.current;

      if (!footer) return undefined;

      const wordmark = wordmarkRef.current;
      const reveal = [leadRef.current, columnsRef.current].filter(Boolean);

      /*
        | Reduced motion still leaves everything on screen and readable.
        | The failure mode to avoid here is a guard that returns early and
        | strands content at opacity 0 — so the visible state is set
        | explicitly rather than left to a tween that never runs.
        */
      if (prefersReducedMotion) {
        if (wordmark) gsap.set(wordmark, { autoAlpha: 1, y: 0, scale: 1 });

        gsap.set(reveal, { autoAlpha: 1, y: 0 });

        return undefined;
      }

      /* The wordmark drifts up and settles as the footer comes into view. */
      if (wordmark) {
        gsap.fromTo(
          wordmark,
          { autoAlpha: 0, y: "12%", scale: 0.9 },
          {
            autoAlpha: 1,
            y: "0%",
            scale: 1,
            ease: "power1.out",

            scrollTrigger: {
              trigger: footer,
              start: "top 85%",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      if (reveal.length) {
        gsap.fromTo(
          reveal,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.15,
            ease: "power3.out",

            scrollTrigger: {
              trigger: footer,
              start: "top 70%",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      /*
        | Magnetic pills. Fine pointers only — there is nothing for a finger
        | to hover toward, and the pull would fight a tap.
        */
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return undefined;
      }

      const magnets = Array.from(footer.querySelectorAll("[data-magnetic]"));
      const cleanups = [];

      magnets.forEach((magnet) => {
        const onMove = (event) => {
          const rect = magnet.getBoundingClientRect();

          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          gsap.to(magnet, {
            x: x * MAGNET_PULL,
            y: y * MAGNET_PULL,
            rotationX: -y * MAGNET_TILT,
            rotationY: x * MAGNET_TILT,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onLeave = () => {
          gsap.to(magnet, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
          });
        };

        magnet.addEventListener("pointermove", onMove);
        magnet.addEventListener("pointerleave", onLeave);

        cleanups.push(() => {
          magnet.removeEventListener("pointermove", onMove);
          magnet.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    [prefersReducedMotion],
  );

  return (
    <footer ref={footerRef} className={styles.footer} id="contact">
      {/* Ambient light and grid, both decorative. */}
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      {/* Oversized brand mark behind everything. */}
      <span ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">
        {company.shortName}
      </span>

      {/* Angled marquee of real destinations and categories. */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.marqueeRun}>
              {MARQUEE.map((label) => (
                <span key={`${copy}-${label}`} className={styles.marqueeItem}>
                  {label}
                  <span className={styles.marqueeStar}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`container ${styles.inner}`}>
        {/* =====================================================
            LEAD
        ===================================================== */}

        <div ref={leadRef} className={styles.lead}>
          <span className={styles.eyebrow}>{company.name}</span>

          <h2 className={styles.headline}>{company.tagline}</h2>

          <div className={styles.actions}>
            <a
              className={`${styles.pill} ${styles.pillPrimary}`}
              href={buildTelLink()}
              data-magnetic
            >
              <Phone size={18} aria-hidden="true" />
              {company.contact.phone}
            </a>

            <a
              className={`${styles.pill} ${styles.pillPrimary}`}
              href={`mailto:${company.contact.email}`}
              data-magnetic
            >
              <Mail size={18} aria-hidden="true" />
              {company.contact.email}
            </a>
          </div>
        </div>

        {/* =====================================================
            COLUMNS
        ===================================================== */}

        <div ref={columnsRef} className={styles.columns}>
          <div className={styles.brandCol}>
            <div className={styles.logoRow}>
              <span className={styles.logo}>{company.shortName}</span>
              <span className={styles.logoSub}>Holidays</span>
            </div>

            <p className={styles.tagline}>
              {company.tagline} — cinematic South India journeys across Munnar,
              Vagamon, Wayanad, Coorg, Ooty, Goa and Alleppey, planned and
              coordinated end to end.
            </p>

            <div className={styles.socialRow}>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="ExploreKey Holidays on Instagram"
                data-magnetic
              >
                <SocialIcon name="instagram" size={18} />
              </a>

              <a
                href={company.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="ExploreKey Holidays on Facebook"
                data-magnetic
              >
                <SocialIcon name="facebook" size={18} />
              </a>

              <a
                href={company.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="ExploreKey Holidays on YouTube"
                data-magnetic
              >
                <SocialIcon name="youtube" size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className={styles.colTitle}>Destinations</h3>

            <ul className={styles.linkList}>
              {destinations.map((d) => (
                <li key={d.id}>
                  <a href="#destinations">{d.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Trip Categories</h3>

            <ul className={styles.linkList}>
              {tripCategories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <a href="#trip-categories">{c.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Get In Touch</h3>

            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={16} aria-hidden="true" />
                <span>
                  {company.contact.address.line1},{" "}
                  {company.contact.address.line2},{" "}
                  {company.contact.address.line3}
                </span>
              </li>

              <li className={styles.contactItem}>
                <Clock size={16} aria-hidden="true" />
                <span>{company.contact.workingHours}</span>
              </li>
            </ul>

            <h3 className={`${styles.colTitle} ${styles.colTitleSpaced}`}>
              Support
            </h3>

            <ul className={styles.linkList}>
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}

              <li>
                <a
                  href={company.contact.mapEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find us on Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {year} {company.name}. All rights reserved.
          </span>

          <span className={`${styles.pill} ${styles.pillQuiet}`}>
            Crafted for South India&rsquo;s most immersive journeys.
          </span>

          <button
            type="button"
            className={styles.toTop}
            onClick={handleBackToTop}
            aria-label="Back to top"
            data-magnetic
          >
            <MoveUp size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
