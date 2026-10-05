import { useRef, useState } from "react";
import {
  BedDouble,
  Car,
  Check,
  MapPin,
  MessageCircle,
  UtensilsCrossed,
} from "lucide-react";

import styles from "./Packages.module.css";
import SceneArt from "../../common/SceneArt";
import SectionHeading from "../../common/SectionHeading";
import { packages, priceDisclaimer } from "../../../data/packages";
import { destinations } from "../../../data/destinations";
import { buildWhatsappLink } from "../../../data/company";

import { useGsapContext } from "../../../utils/animationCleanup";
import {
  gsap,
  ScrollTrigger,
  ensureGsapRegistered,
} from "../../../utils/gsapSetup";

ensureGsapRegistered();

const destinationById = Object.fromEntries(destinations.map((d) => [d.id, d]));

const TILTS = [-1.1, 0.9, -1.8, 1.4, -0.8, 1.7, -1.5, 1];

const VISIBLE_HIGHLIGHTS = 2;

function PackageCard({ pkg, index }) {
  const [expanded, setExpanded] = useState(false);

  const destination = destinationById[pkg.destinationId];

  const highlights = expanded
    ? pkg.highlights
    : pkg.highlights.slice(0, VISIBLE_HIGHLIGHTS);

  const hiddenCount = pkg.highlights.length - VISIBLE_HIGHLIGHTS;

  const inclusions = [
    {
      icon: UtensilsCrossed,
      label: pkg.food,
    },
    {
      icon: Car,
      label: pkg.vehicle,
    },
    {
      icon: BedDouble,
      label: pkg.accommodation,
    },
  ];

  return (
    <article className={styles.card}>
      <div
        className={styles.frame}
        style={{
          "--tilt": `${TILTS[index % TILTS.length]}deg`,
        }}
      >
        {pkg.popular && <span className={styles.popular}>Most booked</span>}

        <div className={styles.media}>
          {destination && (
            <SceneArt scene={destination.scene} palette={destination.palette} />
          )}

          <span className={styles.duration}>{pkg.duration}</span>
        </div>

        <div className={styles.body}>
          <h3 className={styles.name}>{pkg.name}</h3>

          <p className={styles.from}>
            <MapPin size={13} aria-hidden="true" />
            Departs {pkg.startingFrom}
          </p>

          <p className={styles.price}>
            <span className={styles.priceValue}>
              ₹{pkg.price.toLocaleString("en-IN")}
            </span>

            <span className={styles.priceUnit}>per person</span>
          </p>

          <ul className={styles.features}>
            {inclusions.map(({ icon: Icon, label }) => (
              <li key={label} className={styles.feature}>
                <span className={styles.tick}>
                  <Icon size={11} aria-hidden="true" />
                </span>

                {label}
              </li>
            ))}

            {highlights.map((highlight) => (
              <li key={highlight} className={styles.feature}>
                <span className={styles.tick}>
                  <Check size={11} aria-hidden="true" />
                </span>

                {highlight}
              </li>
            ))}
          </ul>

          {hiddenCount > 0 && (
            <button
              type="button"
              className={styles.expand}
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : `+${hiddenCount} more highlights`}
            </button>
          )}

          <div className={styles.actions}>
            <a className={`${styles.cta} ${styles.ctaGhost}`} href="#final-cta">
              View details
            </a>

            <a
              className={`${styles.cta} ${styles.ctaSolid}`}
              href={buildWhatsappLink(
                `Hi ExploreKey Holidays, I'd like to enquire about the ${pkg.name} (${pkg.duration}) package.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Enquire
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Packages() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const grid = gridRef.current;

    if (!section || !grid) return;

    const cards = Array.from(grid.children);

    if (!cards.length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    /*
     * =====================================================
     * MOBILE
     * =====================================================
     *
     * Simple strong slide animation.
     *
     * Card 1  ←
     * Card 2  →
     * Card 3  ←
     * Card 4  →
     */

    if (isMobile) {
      cards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;

        const media = card.querySelector(`.${styles.media}`);

        const duration = card.querySelector(`.${styles.duration}`);

        const content = card.querySelectorAll(
          `
            .${styles.name},
            .${styles.from},
            .${styles.price},
            .${styles.feature},
            .${styles.expand},
            .${styles.actions}
            `,
        );

        /*
         * Initial card position.
         */

        gsap.set(card, {
          autoAlpha: 0,
          x: direction * 120,
          y: 20,
          scale: 0.94,
          rotation: direction * 2,
        });

        /*
         * Image initial state.
         */

        if (media) {
          gsap.set(media, {
            scale: 1.08,
          });
        }

        /*
         * Content hidden.
         */

        gsap.set(content, {
          autoAlpha: 0,
          y: 15,
        });

        /*
         * Scroll animation.
         *
         * NO scrub here.
         * This makes the slide clearly visible.
         */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,

            start: "top 88%",

            toggleActions: "play none none reverse",

            once: false,
          },
        });

        /*
         * CARD SLIDE
         */

        tl.to(card, {
          autoAlpha: 1,

          x: 0,

          y: 0,

          scale: 1,

          rotation: 0,

          duration: 0.8,

          ease: "power4.out",
        });

        /*
         * IMAGE ZOOM
         */

        if (media) {
          tl.to(
            media,
            {
              scale: 1,

              duration: 0.9,

              ease: "power3.out",
            },
            "<",
          );
        }

        /*
         * BADGE POP
         */

        if (duration) {
          tl.fromTo(
            duration,
            {
              autoAlpha: 0,
              y: 15,
              scale: 0.7,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.35,
              ease: "back.out(2)",
            },
            "-=0.35",
          );
        }

        /*
         * CONTENT CASCADE
         */

        tl.to(
          content,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.4,

            stagger: 0.045,

            ease: "power3.out",
          },
          "-=0.15",
        );
      });

      /*
       * Mobile refresh.
       */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return;
    }

    /*
     * =====================================================
     * DESKTOP
     * =====================================================
     *
     * Cinematic 3D entrance.
     */

    cards.forEach((card, index) => {
      const direction = index % 2 === 0 ? -1 : 1;

      const frame = card.querySelector(`.${styles.frame}`);

      const media = card.querySelector(`.${styles.media}`);

      const duration = card.querySelector(`.${styles.duration}`);

      const name = card.querySelector(`.${styles.name}`);

      const from = card.querySelector(`.${styles.from}`);

      const price = card.querySelector(`.${styles.price}`);

      const features = card.querySelectorAll(`.${styles.feature}`);

      const expand = card.querySelector(`.${styles.expand}`);

      const actions = card.querySelector(`.${styles.actions}`);

      /*
       * Initial 3D state.
       */

      gsap.set(card, {
        autoAlpha: 0,

        x: direction * 120,

        y: 80,

        scale: 0.82,

        rotateY: direction * 18,

        rotateX: 10,

        rotateZ: direction * 2.5,

        transformPerspective: 1600,

        transformOrigin: direction === -1 ? "left center" : "right center",
      });

      if (media) {
        gsap.set(media, {
          scale: 1.18,
        });
      }

      if (duration) {
        gsap.set(duration, {
          autoAlpha: 0,
          y: 20,
          scale: 0.8,
        });
      }

      gsap.set(
        [name, from, price, ...features, expand, actions].filter(Boolean),
        {
          autoAlpha: 0,
          y: 22,
        },
      );

      /*
       * Main timeline.
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,

          start: "top 88%",

          toggleActions: "play none none reverse",

          once: false,
        },
      });

      /*
       * 3D CARD
       */

      tl.to(card, {
        autoAlpha: 1,

        x: 0,

        y: 0,

        scale: 1,

        rotateY: 0,

        rotateX: 0,

        rotateZ: 0,

        duration: 1,

        ease: "power4.out",
      });

      /*
       * IMAGE
       */

      if (media) {
        tl.to(
          media,
          {
            scale: 1,

            duration: 1,

            ease: "power3.out",
          },
          "<",
        );
      }

      /*
       * BADGE
       */

      if (duration) {
        tl.to(
          duration,
          {
            autoAlpha: 1,

            y: 0,

            scale: 1,

            duration: 0.35,

            ease: "back.out(2)",
          },
          "-=0.4",
        );
      }

      /*
       * TEXT
       */

      tl.to(
        [name, from, price].filter(Boolean),
        {
          autoAlpha: 1,

          y: 0,

          duration: 0.4,

          stagger: 0.06,

          ease: "power3.out",
        },
        "-=0.15",
      );

      /*
       * FEATURES
       */

      if (features.length) {
        tl.to(
          features,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.3,

            stagger: 0.045,

            ease: "power2.out",
          },
          "-=0.1",
        );
      }

      /*
       * BUTTONS
       */

      tl.to(
        [expand, actions].filter(Boolean),
        {
          autoAlpha: 1,

          y: 0,

          duration: 0.35,

          ease: "power3.out",
        },
        "-=0.08",
      );

      /*
       * IMAGE PARALLAX
       */

      if (media) {
        gsap.to(media, {
          yPercent: index % 2 === 0 ? -8 : 8,

          ease: "none",

          scrollTrigger: {
            trigger: card,

            start: "top bottom",

            end: "bottom top",

            scrub: 1.5,
          },
        });
      }

      /*
       * ACTIVE CARD SCALE
       */

      if (frame) {
        gsap.fromTo(
          frame,
          {
            scale: 0.98,
          },
          {
            scale: 1.025,

            ease: "none",

            scrollTrigger: {
              trigger: card,

              start: "top 65%",

              end: "center 45%",

              scrub: 1,
            },
          },
        );
      }
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    <section
      id="packages"
      ref={sectionRef}
      className={styles.section}
      aria-label="Popular tour packages"
    >
      <div className="container">
        <SectionHeading
          className={styles.header}
          align="center"
          eyebrow="Popular Packages"
          heading="Journeys ready to book"
          lede="Handpicked itineraries across South India — every one built around comfort, pace and value."
        />

        <div ref={gridRef} className={styles.grid}>
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>

        <p className={styles.disclaimer}>{priceDisclaimer}</p>
      </div>
    </section>
  );
}
