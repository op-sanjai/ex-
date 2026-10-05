import { useRef } from "react";
import {
  Car,
  GraduationCap,
  Headset,
  MapPinned,
  Route,
  ShieldCheck,
  UserCheck,
  Wallet,
} from "lucide-react";
import styles from "./WhyChooseUs.module.css";
import { benefits } from "../../../data/benefits";
import { useGsapContext } from "../../../utils/animationCleanup";
import {
  gsap,
  ScrollTrigger,
  ensureGsapRegistered,
} from "../../../utils/gsapSetup";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

ensureGsapRegistered();

const ICONS = {
  Route,
  Wallet,
  Car,
  ShieldCheck,
  UserCheck,
  MapPinned,
  GraduationCap,
  Headset,
};

const NODE_POSITIONS = [
  { x: 12, y: 22 },
  { x: 34, y: 10 },
  { x: 66, y: 12 },
  { x: 88, y: 28 },
  { x: 84, y: 72 },
  { x: 63, y: 88 },
  { x: 32, y: 86 },
  { x: 10, y: 66 },
];

const CORE_STATES = [
  "Planning locked",
  "Pricing verified",
  "Transport assigned",
  "Stay confirmed",
  "Coordinator online",
  "Itinerary customised",
  "Group movement secured",
  "Support active",
];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const networkRef = useRef(null);
  const coreRef = useRef(null);
  const corePulseRef = useRef(null);
  const coreCountRef = useRef(null);
  const coreStateRef = useRef(null);
  const nodesRef = useRef([]);
  const linesRef = useRef([]);
  const orbitRef = useRef(null);
  const vehicleRef = useRef(null);
  const finalRef = useRef(null);
  const progressRef = useRef(null);

  const isCompact = useMediaQuery("(max-width: 1024px)");
  const prefersReducedMotion = false;

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const network = networkRef.current;
    const core = coreRef.current;
    const corePulse = corePulseRef.current;
    const coreCount = coreCountRef.current;
    const coreState = coreStateRef.current;
    const nodes = nodesRef.current.filter(Boolean);
    const lines = linesRef.current.filter(Boolean);
    const orbit = orbitRef.current;
    const vehicle = vehicleRef.current;
    const final = finalRef.current;
    const progress = progressRef.current;

    if (
      !section ||
      !pin ||
      !network ||
      !core ||
      !corePulse ||
      !coreCount ||
      !coreState ||
      !nodes.length ||
      !lines.length ||
      !orbit ||
      !vehicle ||
      !final ||
      !progress
    ) {
      return;
    }

    const total = nodes.length;

    const setActive = (activeIndex) => {
      nodes.forEach((node, index) => {
        node.classList.toggle(styles.nodeActive, index <= activeIndex);
        node.classList.toggle(styles.nodeCurrent, index === activeIndex);
      });

      lines.forEach((line, index) => {
        line.classList.toggle(styles.connectionActive, index <= activeIndex);
      });

      coreCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      coreState.textContent = CORE_STATES[activeIndex] ?? CORE_STATES[0];

      gsap.fromTo(
        [coreCount, coreState],
        { autoAlpha: 0.25, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          overwrite: true,
          ease: "power2.out",
        },
      );
    };

    gsap.set(nodes, {
      autoAlpha: 0,
      scale: 0.55,
    });

    gsap.set(lines, {
      scaleX: 0,
      transformOrigin: "0% 50%",
    });

    gsap.set(core, {
      autoAlpha: 0,
      scale: 0.7,
    });

    gsap.set(corePulse, {
      scale: 0.55,
      autoAlpha: 0,
    });

    gsap.set(vehicle, {
      autoAlpha: 0,
      offsetDistance: "0%",
    });

    gsap.set(final, {
      autoAlpha: 0,
      y: 34,
    });

    gsap.set(progress, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    if (prefersReducedMotion) {
      gsap.set(nodes, { autoAlpha: 1, scale: 1 });
      gsap.set(lines, { scaleX: 1 });
      gsap.set(core, { autoAlpha: 1, scale: 1 });
      gsap.set(corePulse, { autoAlpha: 1, scale: 1 });
      gsap.set(vehicle, { autoAlpha: 1, offsetDistance: "100%" });
      gsap.set(final, { autoAlpha: 1, y: 0 });
      gsap.set(progress, { scaleX: 1 });
      setActive(total - 1);
      return;
    }

    if (isCompact) {
      gsap.to(core, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: core,
          start: "top 82%",
        },
      });

      gsap.to(nodes, {
        autoAlpha: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: network,
          start: "top 78%",
        },
      });

      gsap.to(lines, {
        scaleX: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: network,
          start: "top 74%",
        },
      });

      gsap.to(final, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: final,
          start: "top 88%",
        },
      });

      setActive(total - 1);
      return;
    }

    setActive(0);

    const timeline = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        id: "why-control-room",
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 3.8}`,
        scrub: 1,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(progress, { scaleX: self.progress });

          // Drive the active control-room node directly from scroll progress.
          // This is more reliable than timeline callbacks while scrubbing.
          const nodeProgress = gsap.utils.clamp(
            0,
            0.999,
            gsap.utils.normalize(0.12, 0.8, self.progress),
          );
          const activeIndex = Math.min(
            total - 1,
            Math.floor(nodeProgress * total),
          );

          setActive(activeIndex);
        },
      },
    });

    timeline
      .to(
        core,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.09,
          ease: "back.out(1.7)",
        },
        0.02,
      )
      .to(
        corePulse,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.08,
          ease: "power2.out",
        },
        0.05,
      )
      .to(
        orbit,
        {
          rotation: 220,
          duration: 0.8,
        },
        0.08,
      )
      .to(
        vehicle,
        {
          autoAlpha: 1,
          offsetDistance: "100%",
          duration: 0.76,
        },
        0.12,
      );

    nodes.forEach((node, index) => {
      const at = 0.12 + index * 0.085;

      timeline
        .to(
          lines[index],
          {
            scaleX: 1,
            duration: 0.055,
            ease: "power2.out",
          },
          at,
        )
        .to(
          node,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.065,
            ease: "back.out(2)",
          },
          at + 0.02,
        )
        .to(
          corePulse,
          {
            scale: 1.22,
            autoAlpha: 0.2,
            duration: 0.035,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          at + 0.025,
        );
    });

    timeline
      .to(
        network,
        {
          scale: 0.92,
          autoAlpha: 0.28,
          duration: 0.08,
        },
        0.84,
      )
      .to(
        final,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.1,
          ease: "power3.out",
        },
        0.86,
      )
      .to(
        final,
        {
          scale: 1.03,
          duration: 0.08,
        },
        0.92,
      );

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [isCompact]);

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className={styles.section}
      aria-label="Why choose ExploreKey Holidays"
    >
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.gridBg} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />

        <div className={`container ${styles.shell}`}>
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>02 / Why ExploreKey</span>
              <h2 className={styles.heading}>
                Your journey, under complete control.
              </h2>
            </div>

            <p className={styles.lede}>
              Eight connected systems working together so nothing is left to
              chance.
            </p>
          </div>

          <div ref={networkRef} className={styles.network}>
            <div ref={orbitRef} className={styles.orbit} aria-hidden="true" />

            <div
              ref={corePulseRef}
              className={styles.corePulse}
              aria-hidden="true"
            />

            <div ref={coreRef} className={styles.core}>
              <span className={styles.coreKicker}>Trip Control</span>
              <strong ref={coreCountRef} className={styles.coreCount}>
                01 / 08
              </strong>
              <span ref={coreStateRef} className={styles.coreState}>
                Planning locked
              </span>
            </div>

            <svg
              className={styles.routeSvg}
              viewBox="0 0 1000 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                id="why-control-route"
                d="M92 388 C178 246 286 246 354 304 C426 364 500 424 606 330 C702 246 798 208 912 130"
              />
            </svg>

            <span
              ref={vehicleRef}
              className={styles.vehicle}
              aria-hidden="true"
            >
              <Car size={18} strokeWidth={2} />
            </span>

            {benefits.map((benefit, index) => {
              const Icon = ICONS[benefit.icon];
              const pos = NODE_POSITIONS[index];

              return (
                <div
                  key={benefit.id}
                  ref={(el) => {
                    nodesRef.current[index] = el;
                  }}
                  className={styles.node}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                >
                  <span className={styles.nodeIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className={styles.nodeIcon}>
                    <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                  </span>

                  <div className={styles.nodeCopy}>
                    <strong>{benefit.title}</strong>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              );
            })}

            {NODE_POSITIONS.map((pos, index) => {
              const dx = 50 - pos.x;
              const dy = 50 - pos.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

              return (
                <span
                  key={`line-${index}`}
                  ref={(el) => {
                    linesRef.current[index] = el;
                  }}
                  className={styles.connection}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: `${length}%`,
                    transform: `rotate(${angle}deg)`,
                  }}
                  aria-hidden="true"
                />
              );
            })}
          </div>

          <div ref={finalRef} className={styles.finalStatement}>
            <span>Eight systems. One accountable team.</span>
            <strong>Complete control from departure to return.</strong>
          </div>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <span ref={progressRef} className={styles.progressFill} />
        </div>
      </div>
    </section>
  );
}
