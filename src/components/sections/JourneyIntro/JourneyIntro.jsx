import { useRef } from "react";
import {
  BedDouble,
  Bus,
  Headset,
  NotebookPen,
  Route,
  UtensilsCrossed,
} from "lucide-react";
import styles from "./JourneyIntro.module.css";
import { journeySteps } from "../../../data/journeySteps";
import { useGsapContext } from "../../../utils/animationCleanup";
import {
  gsap,
  ScrollTrigger,
  ensureGsapRegistered,
} from "../../../utils/gsapSetup";

ensureGsapRegistered();

const ICONS = {
  NotebookPen,
  Bus,
  BedDouble,
  UtensilsCrossed,
  Route,
  Headset,
};

const MANIFESTO_LINES = [
  "We do not just plan trips.",
  "We shape every moment.",
  "You remember it forever.",
];

export default function JourneyIntro() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const eyebrowRef = useRef(null);
  const manifestoRef = useRef(null);
  const stepsRef = useRef(null);
  const routePathRef = useRef(null);
  const routeDotRef = useRef(null);
  const portalRef = useRef(null);
  const portalCopyRef = useRef(null);
  const progressRef = useRef(null);

  // Force the cinematic sequence on for this section.
  // The reduced-motion hook was resolving to true on this PC and skipping
  // the complete ScrollTrigger timeline.
  const prefersReducedMotion = false;

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const eyebrow = eyebrowRef.current;
    const manifesto = manifestoRef.current;
    const steps = Array.from(stepsRef.current?.children ?? []);
    const routePath = routePathRef.current;
    const routeDot = routeDotRef.current;
    const portal = portalRef.current;
    const portalCopy = portalCopyRef.current;
    const progress = progressRef.current;

    if (
      !section ||
      !pin ||
      !eyebrow ||
      !manifesto ||
      !steps.length ||
      !routePath ||
      !routeDot ||
      !portal ||
      !portalCopy ||
      !progress
    ) {
      return;
    }

    const lines = Array.from(
      manifesto.querySelectorAll(`.${styles.manifestoLine}`),
    );

    const pathLength = routePath.getTotalLength();

    gsap.set(routePath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    if (prefersReducedMotion) {
      gsap.set([eyebrow, lines, steps, routeDot, portalCopy], {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });
      gsap.set(routePath, { strokeDashoffset: 0 });
      gsap.set(portal, { scale: 1, autoAlpha: 1 });
      gsap.set(progress, { scaleX: 1 });
      return;
    }

    gsap.set(eyebrow, {
      autoAlpha: 0,
      y: 18,
    });

    gsap.set(lines, {
      autoAlpha: 0,
      yPercent: 115,
      filter: "blur(14px)",
      rotateX: -18,
      transformOrigin: "50% 100%",
    });

    gsap.set(steps, {
      autoAlpha: 0,
      y: 34,
      scale: 0.9,
    });

    gsap.set(routeDot, {
      autoAlpha: 0,
      scale: 0,
    });

    gsap.set(portal, {
      autoAlpha: 0,
      scale: 0.12,
    });

    gsap.set(portalCopy, {
      autoAlpha: 0,
      y: 20,
    });

    gsap.set(progress, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        id: "journey-manifesto",
        trigger: pin,
        start: "top top",
        end: () => `+=${window.innerHeight * 4.2}`,
        scrub: 1.15,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(progress, { scaleX: self.progress });
        },
      },
    });

    timeline
      .to(
        pin,
        {
          borderRadius: "0px",
          duration: 0.045,
          ease: "power1.out",
        },
        0,
      )
      .to(
        eyebrow,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.08,
          ease: "power2.out",
        },
        0,
      )
      .to(
        lines[0],
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 0.16,
          ease: "power3.out",
        },
        0.045,
      )
      .to(
        lines[1],
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 0.16,
          ease: "power3.out",
        },
        0.16,
      )
      .to(
        lines[2],
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 0.16,
          ease: "power3.out",
        },
        0.275,
      )
      // Route starts only after all three manifesto lines have fully revealed.
      .to(
        routePath,
        {
          strokeDashoffset: 0,
          duration: 0.2,
          ease: "power1.inOut",
        },
        0.5,
      )
      .to(
        routeDot,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.045,
          ease: "back.out(2)",
        },
        0.675,
      );

    steps.forEach((step, index) => {
      const icon = step.querySelector(`.${styles.stepIcon}`);

      timeline
        .to(
          step,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.075,
            ease: "power3.out",
          },
          0.62 + index * 0.045,
        )
        .fromTo(
          icon,
          {
            rotation: -12,
            scale: 0.65,
          },
          {
            rotation: 0,
            scale: 1,
            duration: 0.075,
            ease: "back.out(2)",
          },
          0.62 + index * 0.045,
        );
    });

    timeline
      .to(
        manifesto,
        {
          y: () => -window.innerHeight * 0.12,
          scale: 0.94,
          autoAlpha: 0.38,
          duration: 0.14,
        },
        0.78,
      )
      .to(
        stepsRef.current,
        {
          y: () => -window.innerHeight * 0.08,
          autoAlpha: 0.3,
          duration: 0.14,
        },
        0.79,
      )
      .to(
        portal,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.14,
          ease: "power3.out",
        },
        0.84,
      )
      .to(
        portalCopy,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.09,
          ease: "power2.out",
        },
        0.8,
      )
      .to(
        [eyebrow, manifesto, stepsRef.current],
        {
          autoAlpha: 0,
          duration: 0.06,
        },
        0.9,
      )
      .to(
        portal,
        {
          scale: 12,
          borderRadius: "0%",
          duration: 0.12,
          ease: "power2.inOut",
        },
        0.91,
      )
      .to(
        portalCopy,
        {
          autoAlpha: 0,
          scale: 0.82,
          duration: 0.06,
        },
        0.96,
      );

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={styles.section}
      aria-label="How ExploreKey plans your journey"
    >
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.topBar}>
          <span ref={eyebrowRef} className={styles.eyebrow}>
            01 / The Journey
          </span>

          <span className={styles.sideNote}>
            From the first idea to the final memory
          </span>
        </div>

        <div className={styles.main}>
          <div ref={manifestoRef} className={styles.manifesto}>
            {MANIFESTO_LINES.map((line, index) => (
              <span
                key={line}
                className={`${styles.manifestoLine} ${
                  index === 1 ? styles.manifestoAccent : ""
                }`}
              >
                {line}
              </span>
            ))}
          </div>

          <div className={styles.routeWrap} aria-hidden="true">
            <svg
              className={styles.routeSvg}
              viewBox="0 0 1200 220"
              preserveAspectRatio="none"
            >
              <path
                ref={routePathRef}
                className={styles.routePath}
                d="M20 176 C160 44 280 205 410 105 C540 10 650 190 780 92 C900 8 1015 138 1180 42"
              />
            </svg>

            <span ref={routeDotRef} className={styles.routeDot} />
          </div>

          <ul ref={stepsRef} className={styles.steps}>
            {journeySteps.map((step, index) => {
              const Icon = ICONS[step.icon];

              return (
                <li key={step.id} className={styles.step}>
                  <span className={styles.stepNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className={styles.stepIcon}>
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </span>

                  <span className={styles.stepLabel}>{step.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div ref={portalRef} className={styles.portal} aria-hidden="true">
          <div className={styles.portalTexture} />

          <div ref={portalCopyRef} className={styles.portalCopy}>
            <span>Everything handled.</span>
            <strong>You only enjoy the journey.</strong>
          </div>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <span ref={progressRef} className={styles.progressFill} />
        </div>
      </div>
    </section>
  );
}
