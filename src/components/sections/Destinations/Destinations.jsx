import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

import styles from "./Destinations.module.css";
import SceneArt from "../../common/SceneArt";
import Button from "../../common/Button";
import { destinations } from "../../../data/destinations";
import { useGsapContext } from "../../../utils/animationCleanup";
import { gsap } from "../../../utils/gsapSetup";
import { useLenis, scrollToTarget } from "../../../hooks/useLenis";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

/*
|--------------------------------------------------------------------------
| Draggable destination pile
|--------------------------------------------------------------------------
| A scattered stack of destination cards you can pick up, throw and shuffle.
|
| Built on GSAP's own Draggable + InertiaPlugin rather than motion/react:
| both ship inside the gsap package this project already depends on (they
| became free in 3.13), so the throw physics, bounds and edge resistance are
| real rather than reimplemented — and nothing new is installed.
|
| Registered here rather than in gsapSetup so the change stays inside this
| section. registerPlugin is idempotent.
*/

gsap.registerPlugin(Draggable, InertiaPlugin);

/* Where each card lands in the pile, and the angle it rests at. Percentages
   are of the stage, so the scatter holds its shape at any width. */
const PILE = [
  { top: "10%", left: "8%", rotate: -7 },
  { top: "30%", left: "20%", rotate: 5 },
  { top: "8%", left: "34%", rotate: -3 },
  { top: "32%", left: "46%", rotate: 8 },
  { top: "12%", left: "58%", rotate: -5 },
  { top: "34%", left: "70%", rotate: 4 },
];

/* How far the card tilts as the pointer crosses it. */
const TILT = 16;

/* Pointer distance, in px, that maps to full tilt. */
const TILT_RANGE = 300;

/*
 * Dragging is desktop-and-mouse only. On touch, a drag surface this size
 * swallows the vertical swipe the page needs to scroll — so coarse pointers
 * get a plain readable grid instead, with every card and CTA intact.
 */
const DRAGGABLE = "(min-width: 1025px) and (hover: hover) and (pointer: fine)";

const BREAKPOINTS = { drag: DRAGGABLE, base: "(min-width: 1px)" };

function handleExploreClick(event, lenis) {
  event.preventDefault();

  const headerEl = document.querySelector("header");
  const offset = -(headerEl?.offsetHeight || 80) - 12;

  scrollToTarget(lenis, "#packages", { offset });
}

export default function Destinations() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useGsapContext(
    sectionRef,
    () => {
      const stage = stageRef.current;
      const cards = cardRefs.current.filter(Boolean);

      if (!stage || !cards.length) return undefined;

      const media = gsap.matchMedia();

      media.add(BREAKPOINTS, (context) => {
        const { drag } = context.conditions;

        /* Coarse pointer or narrow viewport: the CSS has already laid the
           cards out as a grid. Nothing to wire up. */
        if (!drag) return undefined;

        /* Raised each time a card is picked up, so the one in hand is always
           on top of the pile. */
        let topZ = cards.length;

        const instances = [];
        const cleanups = [];

        cards.forEach((card, index) => {
          const glare = card.querySelector(`.${styles.glare}`);

          gsap.set(card, {
            rotation: PILE[index % PILE.length].rotate,
            zIndex: index + 1,
            transformPerspective: 1200,
          });

          /* quickTo keeps the tilt on a smoothed follow rather than snapping
             to the pointer — the same softened feel as a spring. */
          const tiltX = gsap.quickTo(card, "rotationX", {
            duration: 0.6,
            ease: "power3.out",
          });
          const tiltY = gsap.quickTo(card, "rotationY", {
            duration: 0.6,
            ease: "power3.out",
          });
          const glareTo = glare
            ? gsap.quickTo(glare, "opacity", {
                duration: 0.6,
                ease: "power3.out",
              })
            : null;

          const settle = () => {
            tiltX(0);
            tiltY(0);

            if (glareTo) glareTo(0);
          };

          /* Reduced motion keeps the drag — it is user-driven, not something
             the page does at you — but drops the tilt and glare. */
          if (!prefersReducedMotion) {
            const onPointerMove = (event) => {
              const rect = card.getBoundingClientRect();

              const dx = event.clientX - (rect.left + rect.width / 2);
              const dy = event.clientY - (rect.top + rect.height / 2);

              const nx = gsap.utils.clamp(-1, 1, dx / TILT_RANGE);
              const ny = gsap.utils.clamp(-1, 1, dy / TILT_RANGE);

              tiltY(nx * TILT);
              tiltX(-ny * TILT);

              if (glareTo) glareTo(Math.abs(nx) * 0.22);
            };

            card.addEventListener("pointermove", onPointerMove);
            card.addEventListener("pointerleave", settle);

            cleanups.push(() => {
              card.removeEventListener("pointermove", onPointerMove);
              card.removeEventListener("pointerleave", settle);
            });
          }

          const [instance] = Draggable.create(card, {
            type: "x,y",
            /* Bounded to the stage, so a thrown card can never end up over a
               neighbouring section. */
            bounds: stage,
            inertia: true,
            edgeResistance: 0.7,
            /* Lets the Explore link stay clickable inside a draggable card. */
            dragClickables: false,
            cursor: "grab",
            activeCursor: "grabbing",

            onPress() {
              topZ += 1;
              gsap.set(card, { zIndex: topZ });
            },

            onRelease: settle,
          });

          instances.push(instance);
        });

        return () => {
          cleanups.forEach((fn) => fn());
          instances.forEach((instance) => instance?.kill());
        };
      });

      return () => media.revert();
    },
    [prefersReducedMotion],
  );

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className={styles.section}
      aria-label="Popular destinations"
    >
      <div className={styles.intro}>
        <span className={styles.eyebrow}>03 / Destinations</span>

        <h2 className={styles.title}>
          Places that become part of your story.
        </h2>

        <p className={styles.lede}>
          Six landscapes, loose on the table. Pick one up and move it around.
        </p>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <p className={styles.hint} aria-hidden="true">
          Drag the cards
        </p>

        {destinations.map((destination, index) => {
          const spot = PILE[index % PILE.length];

          return (
            <article
              key={destination.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className={styles.card}
              style={{
                "--spot-top": spot.top,
                "--spot-left": spot.left,
                "--panel-bg": destination.palette[0],
                "--panel-accent": destination.palette[3],
              }}
              aria-label={`${destination.name}, ${destination.state}`}
            >
              <div className={styles.art}>
                {destination.image ? (
                  <img
                    src={destination.image}
                    alt={`${destination.name} ${destination.state}`}
                    className={styles.image}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                ) : (
                  <SceneArt
                    scene={destination.scene}
                    palette={destination.palette}
                  />
                )}
              </div>

              <div className={styles.scrim} />

              <div className={styles.topMeta}>
                <span className={styles.number}>{destination.number}</span>

                <span className={styles.state}>{destination.state}</span>
              </div>

              <div className={styles.copy}>
                <h3 className={styles.name}>{destination.name}</h3>

                <p className={styles.tagline}>{destination.tagline}</p>

                <p className={styles.description}>{destination.description}</p>

                <Button
                  href="#packages"
                  icon={ArrowRight}
                  iconPosition="right"
                  className={styles.exploreButton}
                  onClick={(event) => handleExploreClick(event, lenis)}
                >
                  Explore {destination.name}
                </Button>
              </div>

              {/* Sheen that follows the pointer across the card. */}
              <span className={styles.glare} aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
