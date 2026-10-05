import { useRef } from "react";
import styles from "./Statistics.module.css";
import { stats } from "../../../data/stats";
import { useGsapContext } from "../../../utils/animationCleanup";
import {
  gsap,
  ScrollTrigger,
  ensureGsapRegistered,
} from "../../../utils/gsapSetup";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

ensureGsapRegistered();

export default function Statistics() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const numberRef = useRef(null);
  const labelRef = useRef(null);
  const indexRef = useRef(null);
  const orbitRef = useRef(null);
  const cardsRef = useRef([]);
  const gridRef = useRef(null);
  const progressRef = useRef(null);

  const isCompact = useMediaQuery("(max-width: 900px)");
  const prefersReducedMotion = false;

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const number = numberRef.current;
    const label = labelRef.current;
    const indexLabel = indexRef.current;
    const orbit = orbitRef.current;
    const cards = cardsRef.current.filter(Boolean);
    const grid = gridRef.current;
    const progress = progressRef.current;

    if (
      !section ||
      !pin ||
      !stage ||
      !number ||
      !label ||
      !indexLabel ||
      !orbit ||
      !cards.length ||
      !grid ||
      !progress
    )
      return;

    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

    if (prefersReducedMotion || isCompact) {
      gsap.set(stage, { display: "none" });
      gsap.set(grid, { autoAlpha: 1 });
      gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(progress, { scaleX: 1 });
      return;
    }

    gsap.set(cards, { autoAlpha: 0, y: 55, scale: 0.8 });
    gsap.set(grid, { autoAlpha: 0 });
    gsap.set([number, label, indexLabel], { autoAlpha: 0, y: 24 });

    const activeState = { index: -1 };

    const showStat = (nextIndex) => {
      if (nextIndex === activeState.index) return;
      activeState.index = nextIndex;

      const stat = stats[nextIndex];
      if (!stat) return;

      const counter = { value: 0 };

      indexLabel.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(stats.length).padStart(2, "0")}`;
      label.textContent = stat.label;
      number.textContent = `0${stat.suffix ?? ""}`;

      gsap.fromTo(
        [number, label, indexLabel],
        { autoAlpha: 0, y: 28, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.32,
          stagger: 0.035,
          ease: "power3.out",
          overwrite: true,
        },
      );

      gsap.to(counter, {
        value: stat.value,
        duration: 0.65,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => {
          number.textContent = `${Math.round(counter.value).toLocaleString()}${stat.suffix ?? ""}`;
        },
      });

      gsap.fromTo(
        orbit,
        { scale: 0.9, autoAlpha: 0.45 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.42,
          ease: "power2.out",
          overwrite: true,
        },
      );
    };

    showStat(0);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "statistics-observatory",
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 4}`,
        scrub: 1,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = gsap.utils.clamp(
            0,
            0.999,
            gsap.utils.normalize(0.03, 0.76, self.progress),
          );
          const active = Math.min(
            stats.length - 1,
            Math.floor(p * stats.length),
          );
          showStat(active);
          gsap.set(progress, { scaleX: self.progress });
        },
      },
    });

    tl.to(orbit, { rotation: 250, duration: 0.8 }, 0)
      .to(stage, { scale: 0.82, autoAlpha: 0.15, duration: 0.1 }, 0.78)
      .to(grid, { autoAlpha: 1, duration: 0.07 }, 0.82);

    cards.forEach((card, cardIndex) => {
      tl.to(
        card,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.055,
          ease: "back.out(1.8)",
        },
        0.83 + cardIndex * 0.022,
      );
    });

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(timer);
  }, [isCompact]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="ExploreKey Holidays in numbers"
    >
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.gridBg} aria-hidden="true" />

        <div className={`container ${styles.shell}`}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>04 / Trusted by travellers</span>
            <h2 className={styles.heading}>
              Numbers that keep moving forward.
            </h2>
            <p className={styles.lede}>
              A snapshot of the journeys, travellers and destinations behind
              ExploreKey.
            </p>
          </header>

          <div ref={stageRef} className={styles.stage}>
            <div ref={orbitRef} className={styles.orbit} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className={styles.statCopy}>
              <span ref={indexRef} className={styles.statIndex}>
                01 / 06
              </span>
              <strong ref={numberRef} className={styles.bigNumber}>
                0+
              </strong>
              <span ref={labelRef} className={styles.statLabel}>
                {stats[0]?.label}
              </span>
            </div>
          </div>

          <div ref={gridRef} className={styles.finalGrid}>
            {stats.map((stat, cardIndex) => (
              <article
                key={stat.id}
                ref={(el) => {
                  cardsRef.current[cardIndex] = el;
                }}
                className={styles.card}
              >
                <span className={styles.cardNumber}>
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </span>
                <span className={styles.cardLabel}>{stat.label}</span>
              </article>
            ))}
          </div>

          <p className={styles.disclaimer}>
            Figures are indicative placeholders and must be replaced with
            verified company data before launch.
          </p>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <span ref={progressRef} className={styles.progressFill} />
        </div>
      </div>
    </section>
  );
}
