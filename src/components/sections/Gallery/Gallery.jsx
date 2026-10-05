import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import styles from "./Gallery.module.css";
import SceneArt from "../../common/SceneArt";
import SectionHeading from "../../common/SectionHeading";
import { galleryCategories, galleryItems } from "../../../data/gallery";
import { useGsapContext } from "../../../utils/animationCleanup";
import { gsap } from "../../../utils/gsapSetup";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

/*
|--------------------------------------------------------------------------
| Coverflow geometry
|--------------------------------------------------------------------------
| Every distance is a fraction of card width, so the whole rake scales with
| --cf-card and the only thing worth measuring is one card.
|
| `falloff` below 1 is what keeps the second card readable: a linear ramp
| folds it almost shut, whereas an exponent eases the tilt off as cards
| travel out.
*/

const RAKE = {
  wide: { rotate: 44, depth: 0.6, falloff: 0.56, fade: 0.1, gap: 0.05 },
  narrow: { rotate: 30, depth: 0.4, falloff: 0.62, fade: 0.14, gap: 0.04 },
};

/* Capped short of edge-on so a far card never turns its back. */
const MAX_TILT = 82;

const SETTLE_DURATION = 0.7;

/* Below this the ring is too short to hide a card at the half-turn, so the
   run stays linear and clamped instead of looping. Filtering by category
   often leaves one or two items, which would otherwise be culled to nothing. */
const MIN_LOOP_SLIDES = 6;

const clampTo = (value, min, max) => Math.max(min, Math.min(max, value));

export default function Gallery() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  /** Fractional card index at the centre — the single source of truth. */
  const posRef = useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = useRef(0);

  const widthRef = useRef(0);
  const countRef = useRef(0);
  const loopRef = useRef(false);
  const rakeRef = useRef(RAKE.wide);
  const dragRef = useRef(null);
  const reducedRef = useRef(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState(0);

  const prefersReducedMotion = useReducedMotion();
  reducedRef.current = prefersReducedMotion;

  const visibleItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const count = visibleItems.length;

  /** Nearest whole card, folded back into range. */
  const indexAt = useCallback((pos) => {
    const total = countRef.current;

    if (!total) return 0;

    return loopRef.current
      ? ((Math.round(pos) % total) + total) % total
      : clampTo(Math.round(pos), 0, total - 1);
  }, []);

  const clampPos = useCallback(
    (pos) => (loopRef.current ? pos : clampTo(pos, 0, countRef.current - 1)),
    [],
  );

  /*
   * Painted straight to the DOM. Sixty state updates a second would
   * re-render every card for numbers React never needs to see.
   */
  const paint = useCallback(() => {
    const width = widthRef.current;
    const total = countRef.current;

    if (!width || !total) return;

    const rake = rakeRef.current;
    const pitch = width * (1 + rake.gap);
    const pos = posRef.current;
    const looping = loopRef.current;

    for (let index = 0; index < total; index += 1) {
      const card = cardRefs.current[index];

      if (!card) continue;

      let offset = index - pos;

      /* Fold onto the shorter way round the ring. This is the entire
         looping mechanism — no cloned nodes, no reshuffling the DOM. */
      if (looping) {
        offset = ((offset % total) + total) % total;

        if (offset > total / 2) offset -= total;
      }

      const distance = Math.abs(offset);
      const ramp = distance ** rake.falloff;
      const tilt = Math.min(rake.rotate * ramp, MAX_TILT) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-rake.depth * width * ramp}px) ` +
        `rotateY(${-tilt}deg)`;

      /* A looping card is teleported across the ring at exactly half a turn
         out, so it has to be gone by then or the jump is visible. */
      const edge = looping
        ? clampTo(total / 2 - distance, 0, 1)
        : 1;

      card.style.opacity = String(
        Math.max(0, 1 - rake.fade * distance) * edge,
      );
      card.style.zIndex = String(100 - Math.round(distance));
    }
  }, []);

  const settle = useCallback(
    (target) => {
      targetRef.current = target;
      setSelected(indexAt(target));

      if (reducedRef.current) {
        gsap.killTweensOf(posRef);
        posRef.current = target;
        paint();

        return;
      }

      gsap.to(posRef, {
        current: target,
        duration: SETTLE_DURATION,
        ease: "power3.out",
        overwrite: true,
        onUpdate: paint,
      });
    },
    [indexAt, paint],
  );

  const goTo = useCallback(
    (index) => {
      const total = countRef.current;

      /* Take the shorter way round rather than unwinding the whole ring. */
      const target = loopRef.current
        ? index + Math.round((targetRef.current - index) / total) * total
        : index;

      settle(clampPos(target));
    },
    [clampPos, settle],
  );

  const nudge = useCallback(
    (by) => settle(clampPos(Math.round(targetRef.current) + by)),
    [clampPos, settle],
  );

  /* =========================================================
     POINTER DRAG
  ========================================================= */

  const onPointerDown = (event) => {
    if (countRef.current < 2) return;

    gsap.killTweensOf(posRef);
    event.currentTarget.setPointerCapture(event.pointerId);

    targetRef.current = posRef.current;

    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      velocity: 0,
      time: performance.now(),
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + rakeRef.current.gap);

    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;

    posRef.current = clampPos(drag.pos - (event.clientX - drag.x) / pitch);

    /* Cards per second, for the throw. */
    drag.velocity =
      ((posRef.current - previous) / Math.max(now - drag.time, 1)) * 1000;
    drag.time = now;

    const next = indexAt(posRef.current);

    if (next !== selected) setSelected(next);

    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;

    if (!drag || drag.id !== event.pointerId) return;

    dragRef.current = null;

    /* Let a flick carry, but never more than two cards. */
    const carried = clampTo(drag.velocity * 0.18, -2, 2);

    settle(clampPos(Math.round(posRef.current + carried)));
  };

  /* =========================================================
     MEASURE + RESET

     Card width drives pitch, depth and perspective, so it is the
     only thing worth measuring — and only when the box changes.
  ========================================================= */

  useLayoutEffect(() => {
    const stage = stageRef.current;

    if (!stage) return undefined;

    cardRefs.current.length = count;
    countRef.current = count;
    loopRef.current = count >= MIN_LOOP_SLIDES;

    gsap.killTweensOf(posRef);
    posRef.current = 0;
    targetRef.current = 0;
    setSelected(0);

    const measure = () => {
      const card = cardRefs.current[0];

      if (!card) return;

      widthRef.current = card.offsetWidth;
      rakeRef.current = window.matchMedia("(max-width: 640px)").matches
        ? RAKE.narrow
        : RAKE.wide;

      paint();
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stage);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(posRef);
    };
  }, [count, paint]);

  /* =========================================================
     SECTION REVEAL
  ========================================================= */

  useGsapContext(
    sectionRef,
    () => {
      const stage = stageRef.current;

      if (!stage) return;

      if (prefersReducedMotion) {
        gsap.set(stage, { opacity: 1, y: 0 });

        return;
      }

      gsap.fromTo(
        stage,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );
    },
    [prefersReducedMotion],
  );

  const active = visibleItems[selected];

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={styles.section}
      aria-label="Recent trip gallery"
    >
      <div className="container">
        <SectionHeading
          className={styles.header}
          align="center"
          eyebrow="From Recent Trips"
          heading="Moments from the road"
          lede="College tours, friends trips, couple getaways and everything in between."
        />

        <div
          className={styles.filters}
          role="tablist"
          aria-label="Filter gallery by category"
        >
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`${styles.filterBtn} ${
                activeCategory === category ? styles.filterBtnActive : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className={styles.carousel}
          role="region"
          aria-roledescription="carousel"
          aria-label="Trip photographs"
        >
          <div
            ref={stageRef}
            className={styles.stage}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                nudge(-1);
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                nudge(1);
              }
            }}
          >
            <div className={styles.track}>
              {visibleItems.map((item, index) => (
                <figure
                  key={item.id}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={styles.card}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${item.caption}`}
                >
                  <div className={styles.cardArt}>
                    <SceneArt scene={item.scene} palette={item.palette} />
                  </div>

                  {item.isVideo && (
                    <span className={styles.videoBadge} aria-hidden="true">
                      <Play size={14} fill="currentColor" />
                    </span>
                  )}
                </figure>
              ))}
            </div>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                aria-label="Previous photograph"
                onClick={() => nudge(-1)}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                aria-label="Next photograph"
                onClick={() => nudge(1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {active && (
          /* Keyed on the item so React remounts it and the fade replays. */
          <figcaption key={active.id} className={styles.caption}>
            <span className={styles.captionCategory}>{active.category}</span>

            <span className={styles.captionText}>{active.caption}</span>
          </figcaption>
        )}

        {count > 1 && (
          <div className={styles.dots}>
            {visibleItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.dot} ${
                  index === selected ? styles.dotActive : ""
                }`}
                aria-label={`Go to photograph ${index + 1}`}
                aria-current={index === selected}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
