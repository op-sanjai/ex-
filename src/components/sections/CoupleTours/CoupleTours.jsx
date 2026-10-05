import { useRef, useState } from "react";
import {
  Building,
  Camera,
  Car,
  DoorClosed,
  Flame,
  Gift,
  MessageCircle,
  Trees,
  Waves,
} from "lucide-react";

import styles from "./CoupleTours.module.css";
import SceneArt from "../../common/SceneArt";
import Button from "../../common/Button";
import { coupleSeriesLabel, coupleTourFeatures } from "../../../data/coupleTours";
import { buildWhatsappLink } from "../../../data/company";
import { useGsapContext } from "../../../utils/animationCleanup";
import { gsap, ScrollTrigger } from "../../../utils/gsapSetup";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

const ICONS = { DoorClosed, Building, Waves, Flame, Gift, Camera, Trees, Car };

const TOTAL = coupleTourFeatures.length;

/* The scrollytelling layout needs two columns to be worth having. Mirrored
   by the same value in CoupleTours.module.css — change both together. */
const WIDE = "(min-width: 900px)";

/* Cascading, so a fractional viewport width always matches something. */
const BREAKPOINTS = { wide: WIDE, base: "(min-width: 1px)" };

/* Scene stays fixed across beats on purpose. SceneArt ships six scenes and
   only `jeep-safari` genuinely matches a feature — swapping the backdrop for
   some beats and not others would read as a fault, not a flourish. Per-feature
   art is picked up automatically if `scene`/`palette` are ever added to
   src/data/coupleTours.js. */
const SCENE = "pool-resort";
const PALETTE = ["#7a3a1e", "#e8703a", "#f1d9a4", "#fbe0bd"];

export default function CoupleTours() {
  const sectionRef = useRef(null);
  const beatRefs = useRef([]);

  const [active, setActive] = useState(0);

  const prefersReducedMotion = useReducedMotion();

  useGsapContext(
    sectionRef,
    () => {
      const beats = beatRefs.current.filter(Boolean);

      if (!beats.length) return undefined;

      if (prefersReducedMotion) {
        gsap.set(beats, { opacity: 1, y: 0 });

        return undefined;
      }

      const media = gsap.matchMedia();

      media.add(BREAKPOINTS, (context) => {
        const { wide } = context.conditions;

        /* Narrow: no sticky column to drive, so the beats simply arrive. */
        if (!wide) {
          gsap.set(beats, { opacity: 0, y: 24 });

          gsap.to(beats, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",

            scrollTrigger: {
              trigger: beats[0].parentElement,
              start: "top 85%",
              once: true,
            },
          });

          return;
        }

        beats.forEach((beat, index) => {
          const range = {
            trigger: beat,
            start: "top 90%",
            end: "bottom 15%",
            scrub: true,
            invalidateOnRefresh: true,
          };

          /* A single linear drift across the whole pass. */
          gsap.fromTo(
            beat,
            { y: 20 },
            { y: -20, ease: "none", scrollTrigger: range },
          );

          /* Fades up, holds through the middle, fades out — the first beat
             starts lit so the column is not blank before any scrolling. */
          const timeline = gsap.timeline({ scrollTrigger: range });

          timeline
            .fromTo(
              beat,
              { opacity: index === 0 ? 1 : 0 },
              { opacity: 0.7, duration: 0.3, ease: "none" },
            )
            .to(beat, { opacity: 1, duration: 0.4, ease: "none" })
            .to(beat, { opacity: 0, duration: 0.3, ease: "none" });

          /* Whichever beat holds the middle band owns the sticky panel. */
          ScrollTrigger.create({
            trigger: beat,
            start: "center 62%",
            end: "center 38%",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          });
        });
      });

      return () => media.revert();
    },
    [prefersReducedMotion],
  );

  return (
    <section
      id="couple-tours"
      ref={sectionRef}
      className={styles.section}
      aria-label="Couple and honeymoon packages"
    >
      <div className={`container ${styles.grid}`}>
        {/* =========================================================
            STICKY VISUAL
        ========================================================= */}

        <div className={styles.visual}>
          <div className={styles.visualInner}>
            <div className={styles.visualArt}>
              <SceneArt scene={SCENE} palette={PALETTE} />
            </div>

            {/* One layer per feature, cross-faded. Mirrors the reference's
                stacked images without needing eight of them. */}
            <div className={styles.plates} aria-hidden="true">
              {coupleTourFeatures.map((feature, index) => {
                const Icon = ICONS[feature.icon];

                return (
                  <div
                    key={feature.label}
                    className={`${styles.plate} ${
                      index === active ? styles.plateActive : ""
                    }`}
                  >
                    <span className={styles.plateIndex}>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(TOTAL).padStart(2, "0")}
                    </span>

                    {Icon && (
                      <span className={styles.plateIcon}>
                        <Icon size={26} strokeWidth={1.5} />
                      </span>
                    )}

                    <span className={styles.plateLabel}>{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <span className={styles.chapterLabel}>{coupleSeriesLabel}</span>
          </div>
        </div>

        {/* =========================================================
            SCROLLING NARRATIVE
        ========================================================= */}

        <div className={styles.narrative}>
          <div className={styles.intro}>
            <span className="eyebrow">Couple &amp; Honeymoon</span>

            <h2 className={styles.heading}>Slower mornings, made for two</h2>

            <p className={styles.lede}>
              Private stays, quiet viewpoints and evenings built around just the
              two of you — planned down to the small details that make a trip
              feel personal.
            </p>
          </div>

          <ol className={styles.beats}>
            {coupleTourFeatures.map((feature, index) => {
              const Icon = ICONS[feature.icon];

              return (
                <li
                  key={feature.label}
                  ref={(element) => {
                    beatRefs.current[index] = element;
                  }}
                  className={styles.beat}
                >
                  <span className={styles.beatIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className={styles.beatBody}>
                    {Icon && (
                      <span className={styles.beatIcon}>
                        <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                    )}

                    <span className={styles.beatLabel}>{feature.label}</span>

                    {/* Rendered only if the data grows a description — see
                        the note above SCENE. */}
                    {feature.description && (
                      <span className={styles.beatDesc}>
                        {feature.description}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className={styles.actions}>
            <Button href="#final-cta">Plan Our Trip</Button>

            <Button
              href={buildWhatsappLink(
                "Hi ExploreKey Holidays, we would like details on a couple/honeymoon package.",
              )}
              external
              variant="secondaryOnLight"
              icon={MessageCircle}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
