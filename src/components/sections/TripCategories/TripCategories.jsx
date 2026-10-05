import { useRef, useState } from "react";
import styles from "./TripCategories.module.css";

import { tripCategories } from "../../../data/tripCategories";
import { heroGallery } from "../../../data/heroGallery";
import { buildWhatsappLink, company } from "../../../data/company";

import { useGsapContext } from "../../../utils/animationCleanup";
import { gsap, ScrollTrigger } from "../../../utils/gsapSetup";
import { QUERIES } from "../../../utils/breakpoints";

const IMAGES = new Map(heroGallery.map((image) => [image.id, image]));

const SECTION_LINKS = {
  "college-tours": "#college-tours",
  "couple-packages": "#couple-tours",
};

const CATEGORIES = tripCategories.map((category, index) => {
  const image = IMAGES.get(category.image);
  const anchor = SECTION_LINKS[category.id];

  return {
    ...category,
    number: String(index + 1).padStart(2, "0"),
    src: image?.src,
    alt: image?.alt ?? category.title,
    href:
      anchor ??
      buildWhatsappLink(
        `Hi ${company.shortName}, I'd like to plan a ${category.title.toLowerCase()} trip.`,
      ),
    external: !anchor,
  };
});

const TOTAL = CATEGORIES.length;
const TOTAL_LABEL = String(TOTAL).padStart(2, "0");

const EYEBROW = "Every kind of trip";
const LEDE =
  "From a college department tour to a private honeymoon — the planning is just as careful.";

const TRACK = [...CATEGORIES, ...CATEGORIES];

/* -------------------------------------------------------
   3D SURFER CONFIG
------------------------------------------------------- */

const CONFIG = {
  desktop: {
    stepX: 245,
    stepY: -82,
    stepZ: -300,
    rotate: -45,
    perspective: 2100,
    screens: 5.2,
    scrub: 1.15,
    focusScale: 0.14,
    focusZ: 55,
    magnetRadius: 390,
    magnetScale: 1.14,
  },

  tablet: {
    stepX: 185,
    stepY: -64,
    stepZ: -225,
    rotate: -38,
    perspective: 1550,
    screens: 4.7,
    scrub: 1.1,
    focusScale: 0.12,
    focusZ: 42,
    magnetRadius: 330,
    magnetScale: 1.11,
  },

  mobile: {
    stepX: 96,
    stepY: -48,
    stepZ: -155,
    rotate: -23,
    perspective: 1050,
    screens: 4.1,
    scrub: 0.95,
    focusScale: 0.1,
    focusZ: 28,
    magnetRadius: 0,
    magnetScale: 1,
  },
};

const BEHIND = 2;
const FOCUS_RANGE = 1.45;

const BREAKPOINTS = {
  desktop: QUERIES.desktop,
  tablet: "(min-width: 641px)",
  mobile: "(min-width: 1px)",
  fine: QUERIES.fine,
};

/* -------------------------------------------------------
   ANIMATED VERSION
------------------------------------------------------- */

function SurfedTripCategories() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const sceneRef = useRef(null);

  const cardRefs = useRef([]);
  const innerRefs = useRef([]);

  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const scene = sceneRef.current;

    if (!section || !sticky || !scene) return undefined;

    const cards = cardRefs.current.filter(Boolean);
    const inners = innerRefs.current.filter(Boolean);

    if (cards.length < 2) return undefined;

    const count = cards.length;

    const wrapSlot = gsap.utils.wrap(-BEHIND, count - BEHIND);
    const clamp = gsap.utils.clamp;

    const media = gsap.matchMedia();

    media.add(BREAKPOINTS, (context) => {
      const { desktop, tablet, fine } = context.conditions;

      const config = desktop
        ? CONFIG.desktop
        : tablet
          ? CONFIG.tablet
          : CONFIG.mobile;

      gsap.set(scene, {
        "--scene-perspective": `${config.perspective}px`,
      });

      /* ---------------------------------------------------
         SECTION ENTRANCE
      --------------------------------------------------- */

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 45%",
          scrub: false,
          once: true,
        },
      });

      intro
        .fromTo(
          `.${styles.eyebrow}`,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        )
        .fromTo(
          `.${styles.title}`,
          {
            opacity: 0,
            y: 55,
            clipPath: "inset(100% 0 0 0)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            ease: "power4.out",
          },
          "-=0.45",
        )
        .fromTo(
          `.${styles.lede}`,
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.55",
        );

      /* ---------------------------------------------------
         SHARED SCROLL PROGRESS
      --------------------------------------------------- */

      const progress = {
        value: 0,
      };

      const render = () => {
        const beat = progress.value;

        for (let index = 0; index < count; index += 1) {
          const slot = wrapSlot(index - beat);

          /*
             0 = camera/focus
             positive = behind
             negative = passed camera
          */

          const distance = Math.abs(slot);

          const focus = 1 - Math.min(1, distance / FOCUS_RANGE);

          const scale = 1 + config.focusScale * focus;

          /*
             Cards closest to camera become brighter.
          */

          const nearFade = clamp((slot + BEHIND) / 1.15, 0, 1);

          const farFade = clamp((count - BEHIND - slot) / 1.65, 0, 1);

          const opacity = Math.min(nearFade, farFade);

          /*
             Focus card moves slightly toward camera.
          */

          const focusZ = config.focusZ * focus;

          /*
             Tiny vertical lift gives physical depth.
          */

          const lift = -10 * focus;

          const card = cards[index];

          card.style.transform = `
            translate3d(
              ${slot * config.stepX}px,
              ${slot * config.stepY + lift}px,
              ${slot * config.stepZ + focusZ}px
            )
            rotateY(${config.rotate}deg)
            scale(${scale})
          `;

          card.style.opacity = opacity;

          /*
             Image depth treatment.
          */

          const image = inners[index]?.querySelector("img");

          if (image) {
            const brightness = 0.58 + focus * 0.42;

            const saturation = 0.72 + focus * 0.28;

            const imageScale = 1.045 + focus * 0.035;

            image.style.filter = `
              brightness(${brightness})
              saturate(${saturation})
            `;

            image.style.transform = `
              scale(${imageScale})
            `;
          }

          /*
             Only cards close enough to camera are clickable.
          */

          card.style.pointerEvents = opacity > 0.62 ? "auto" : "none";
        }
      };

      render();

      /* ---------------------------------------------------
         SCROLL
      --------------------------------------------------- */

      gsap.to(progress, {
        value: TOTAL,
        ease: "none",

        onUpdate: render,

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * config.screens}`,

          scrub: config.scrub,

          pin: sticky,
          pinSpacing: true,

          anticipatePin: 1,
          invalidateOnRefresh: true,

          onRefresh: render,

          onUpdate: (self) => {
            const next = Math.round(self.progress * TOTAL) % TOTAL;

            if (next === activeRef.current) {
              return;
            }

            activeRef.current = next;

            setActive(next);

            /*
               Active readout animation.
            */

            const readout = section.querySelector(`.${styles.readout}`);

            if (readout) {
              gsap.fromTo(
                readout,
                {
                  opacity: 0,
                  y: 18,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.45,
                  ease: "power3.out",
                },
              );
            }
          },
        },
      });

      /* ---------------------------------------------------
         MAGNETIC CURSOR
      --------------------------------------------------- */

      if (!fine || config.magnetRadius <= 0) {
        return undefined;
      }

      const scaleTo = inners.map((inner) =>
        gsap.quickTo(inner, "scale", {
          duration: 0.45,
          ease: "power3.out",
        }),
      );

      let pointerX = -10000;
      let pointerY = -10000;
      let running = false;

      const updateMagnet = () => {
        for (let index = 0; index < inners.length; index += 1) {
          const inner = inners[index];

          const rect = inner.getBoundingClientRect();

          const centerX = rect.left + rect.width / 2;

          const centerY = rect.top + rect.height / 2;

          const dx = pointerX - centerX;

          const dy = pointerY - centerY;

          const distance = Math.min(config.magnetRadius, Math.hypot(dx, dy));

          const scale = gsap.utils.mapRange(
            0,
            config.magnetRadius,
            config.magnetScale,
            1,
            distance,
          );

          scaleTo[index](scale);
        }
      };

      const onPointerMove = (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
      };

      const startMagnet = () => {
        if (running) return;

        gsap.ticker.add(updateMagnet);

        running = true;
      };

      const stopMagnet = () => {
        if (running) {
          gsap.ticker.remove(updateMagnet);

          running = false;
        }

        pointerX = -10000;
        pointerY = -10000;

        scaleTo.forEach((reset) => reset(1));
      };

      scene.addEventListener("pointerenter", startMagnet);

      scene.addEventListener("pointermove", onPointerMove);

      scene.addEventListener("pointerleave", stopMagnet);

      return () => {
        if (running) {
          gsap.ticker.remove(updateMagnet);
        }

        scene.removeEventListener("pointerenter", startMagnet);

        scene.removeEventListener("pointermove", onPointerMove);

        scene.removeEventListener("pointerleave", stopMagnet);
      };
    });

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, []);

  const current = CATEGORIES[active] ?? CATEGORIES[0];

  return (
    <section
      ref={sectionRef}
      id="trip-categories"
      className={styles.section}
      aria-label="Trip categories we plan"
    >
      <div ref={stickyRef} className={styles.sticky}>
        <div ref={sceneRef} className={styles.scene}>
          <div className={styles.vignette} />

          <div className={styles.track}>
            {TRACK.map((category, index) => {
              const isDuplicate = index >= TOTAL;

              return (
                <article
                  key={`${category.id}-${index}`}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={styles.card}
                  aria-hidden={isDuplicate || undefined}
                >
                  <a
                    ref={(element) => {
                      innerRefs.current[index] = element;
                    }}
                    className={styles.cardInner}
                    href={category.href}
                    tabIndex={isDuplicate ? -1 : undefined}
                    target={category.external ? "_blank" : undefined}
                    rel={category.external ? "noopener noreferrer" : undefined}
                  >
                    <span className={styles.cardIndex}>{category.number}</span>

                    <span className={styles.cardMedia}>
                      {category.src && (
                        <img
                          src={category.src}
                          alt={category.alt}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </span>

                    <span className={styles.cardShade} />

                    <span className={styles.cardTitle}>{category.title}</span>

                    <span className={styles.cardArrow}>↗</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------
            UI
        --------------------------------------------- */}

        <div className={styles.overlay}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>{EYEBROW}</span>

            <h2 className={styles.title}>
              One route, every kind
              <br />
              of traveller
              <sup className={styles.count}>({TOTAL_LABEL})</sup>
            </h2>

            <p className={styles.lede}>{LEDE}</p>
          </div>

          <div key={current.id} className={styles.readout}>
            <span className={styles.readoutIndex}>
              {current.number} — {TOTAL_LABEL}
            </span>

            <h3 className={styles.readoutTitle}>{current.title}</h3>

            <p className={styles.readoutDesc}>{current.description}</p>
          </div>

          <div className={styles.hint}>
            <span className={styles.hintLine} />

            <span>Scroll to explore</span>
          </div>

          <div className={styles.progressRail}>
            <span
              style={{
                transform: `scaleX(${(active + 1) / TOTAL})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   REDUCED MOTION
------------------------------------------------------- */

function StaticTripCategories() {
  return (
    <section
      id="trip-categories"
      className={styles.section}
      aria-label="Trip categories we plan"
    >
      <div className={`container ${styles.staticPad}`}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{EYEBROW}</span>

          <h2 className={styles.title}>
            One route, every kind
            <br />
            of traveller
            <sup className={styles.count}>({TOTAL_LABEL})</sup>
          </h2>

          <p className={styles.lede}>{LEDE}</p>
        </div>

        <div className={styles.staticGrid}>
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              className={styles.staticCard}
              href={category.href}
              target={category.external ? "_blank" : undefined}
              rel={category.external ? "noopener noreferrer" : undefined}
            >
              <span className={styles.staticMedia}>
                {category.src && (
                  <img
                    src={category.src}
                    alt={category.alt}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </span>

              <span className={styles.staticBody}>
                <span className={styles.staticIndex}>
                  {category.number} — {TOTAL_LABEL}
                </span>

                <span className={styles.staticTitle}>{category.title}</span>

                <span className={styles.staticDesc}>
                  {category.description}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   MAIN
------------------------------------------------------- */

export default function TripCategories() {
  return <SurfedTripCategories />;
}
