import { useEffect, useRef } from "react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import styles from "./Hero.module.css";
import HeroScene from "./HeroScene";
import Button from "../../common/Button";
import SplitWords from "../../common/SplitWords";
import {
  company,
  buildTelLink,
  buildWhatsappLink,
} from "../../../data/company";
import { useLenis, scrollToTarget } from "../../../hooks/useLenis";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useDeviceCapability } from "../../../hooks/useDeviceCapability";
import { useGsapContext } from "../../../utils/animationCleanup";
import {
  gsap,
  ScrollTrigger,
  ensureGsapRegistered,
} from "../../../utils/gsapSetup";

ensureGsapRegistered();

const PARALLAX_LAYERS = [
  { layer: "sky", x: 4, y: 2 },
  { layer: "clouds-back", x: 10, y: 5 },
  { layer: "mountain-back", x: 12, y: 5 },
  { layer: "mountain-mid", x: 18, y: 8 },
  { layer: "mist-back", x: 20, y: 8 },
  { layer: "mountain-front", x: 24, y: 10 },
  { layer: "tea-hills", x: 30, y: 13 },
  { layer: "road", x: 20, y: 10 },
  { layer: "vehicle", x: 26, y: 14 },
  { layer: "trees-left", x: 40, y: 18 },
  { layer: "trees-right", x: 40, y: 18 },
  { layer: "grass-front", x: 48, y: 22 },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const supportingRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const quickToRef = useRef({});
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const { allowMouseParallax } = useDeviceCapability();

  useGsapContext(sectionRef, () => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const content = contentRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const supporting = supportingRef.current;
    const buttons = buttonsRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!section || !stage || !content || !heading || !supporting || !buttons) {
      return;
    }

    const words = heading.querySelectorAll(".word-inner");
    const buttonItems = buttons.children;

    const getLayer = (name) => section.querySelector(`[data-layer="${name}"]`);

    const getLayerInner = (name) =>
      section.querySelector(`[data-layer="${name}"] [data-inner="true"]`);

    const sky = getLayer("sky");
    const clouds = getLayer("clouds-back");
    const mountainBack = getLayer("mountain-back");
    const mountainMid = getLayer("mountain-mid");
    const mistBack = getLayer("mist-back");
    const mountainFront = getLayer("mountain-front");
    const teaHills = getLayer("tea-hills");
    const road = getLayer("road");
    const vehicle = getLayer("vehicle");
    const treesLeft = getLayer("trees-left");
    const treesRight = getLayer("trees-right");
    const grassFront = getLayer("grass-front");
    const sunGlow = getLayer("sun-glow");
    const fogCover = getLayer("fog-cover");

    gsap.set(stage, {
      autoAlpha: 1,
    });

    gsap.set(content, {
      autoAlpha: 1,
      x: 0,
      y: 0,
    });

    if (prefersReducedMotion) {
      gsap.set(eyebrow, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(words, {
        autoAlpha: 1,
        yPercent: 0,
      });

      gsap.set(supporting, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(buttonItems, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });

      gsap.set(scrollIndicator, {
        autoAlpha: 1,
      });

      return;
    }

    /*
     * Initial states
     */
    gsap.set(eyebrow, {
      autoAlpha: 0,
      y: 22,
      letterSpacing: "0.34em",
    });

    gsap.set(words, {
      autoAlpha: 0,
      yPercent: 120,
      rotateX: -12,
      transformOrigin: "50% 100%",
    });

    gsap.set(supporting, {
      autoAlpha: 0,
      y: 30,
    });

    gsap.set(buttonItems, {
      autoAlpha: 0,
      y: 28,
      scale: 0.94,
    });

    gsap.set(scrollIndicator, {
      autoAlpha: 0,
      y: 16,
    });

    gsap.set(clouds, {
      autoAlpha: 0,
      y: -35,
      scale: 1.1,
    });

    gsap.set(mountainBack, {
      y: 45,
      scale: 1.08,
    });

    gsap.set(mountainMid, {
      y: 65,
      scale: 1.1,
    });

    gsap.set(mountainFront, {
      y: 90,
      scale: 1.12,
    });

    gsap.set(teaHills, {
      y: 105,
      scale: 1.12,
    });

    gsap.set(road, {
      y: 110,
      scale: 1.12,
    });

    gsap.set(vehicle, {
      autoAlpha: 0,
      y: 90,
      scale: 0.65,
    });

    gsap.set(treesLeft, {
      xPercent: -14,
      y: 55,
    });

    gsap.set(treesRight, {
      xPercent: 14,
      y: 55,
    });

    gsap.set(grassFront, {
      y: 90,
    });

    gsap.set(sunGlow, {
      autoAlpha: 0,
      scale: 0.65,
    });

    gsap.set(fogCover, {
      autoAlpha: 0.2,
      scale: 1.35,
      yPercent: 10,
    });

    /*
     * Page-load cinematic entrance
     */
    const introTimeline = gsap.timeline({
      delay: 0.15,
      defaults: {
        ease: "power3.out",
      },
    });

    introTimeline
      .to(fogCover, {
        autoAlpha: 0.04,
        scale: 1.1,
        yPercent: 0,
        duration: 1.8,
        ease: "power2.out",
      })
      .to(
        clouds,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.6,
        },
        0,
      )
      .to(
        mountainBack,
        {
          y: 0,
          scale: 1,
          duration: 1.5,
        },
        0.15,
      )
      .to(
        mountainMid,
        {
          y: 0,
          scale: 1,
          duration: 1.55,
        },
        0.25,
      )
      .to(
        mountainFront,
        {
          y: 0,
          scale: 1,
          duration: 1.6,
        },
        0.35,
      )
      .to(
        teaHills,
        {
          y: 0,
          scale: 1,
          duration: 1.6,
        },
        0.45,
      )
      .to(
        road,
        {
          y: 0,
          scale: 1,
          duration: 1.5,
        },
        0.5,
      )
      .to(
        treesLeft,
        {
          xPercent: 0,
          y: 0,
          duration: 1.7,
        },
        0.4,
      )
      .to(
        treesRight,
        {
          xPercent: 0,
          y: 0,
          duration: 1.7,
        },
        0.4,
      )
      .to(
        grassFront,
        {
          y: 0,
          duration: 1.5,
        },
        0.55,
      )
      .to(
        sunGlow,
        {
          autoAlpha: 0.65,
          scale: 1,
          duration: 1.8,
        },
        0.45,
      )
      .to(
        eyebrow,
        {
          autoAlpha: 1,
          y: 0,
          letterSpacing: "0.2em",
          duration: 0.8,
        },
        0.7,
      )
      .to(
        words,
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.15,
          stagger: 0.055,
        },
        0.85,
      )
      .to(
        supporting,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
        },
        1.35,
      )
      .to(
        buttonItems,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
        },
        1.55,
      )
      .to(
        vehicle,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
        },
        1.35,
      )
      .to(
        scrollIndicator,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
        },
        2,
      )
      .call(() => {
        ScrollTrigger.refresh();
      });

    /*
     * Continuous ambient animation
     */
    gsap.to(getLayerInner("clouds-back"), {
      x: 55,
      duration: 16,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(getLayerInner("mist-back"), {
      x: -45,
      y: -8,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const vehicleInner = getLayerInner("vehicle");

    if (vehicleInner) {
      gsap.to(vehicleInner, {
        y: -5,
        rotation: 0.5,
        transformOrigin: "50% 70%",
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    const scrollDot = scrollIndicator?.querySelector(`.${styles.scrollDot}`);

    if (scrollDot) {
      gsap.fromTo(
        scrollDot,
        {
          y: -3,
          autoAlpha: 1,
        },
        {
          y: 28,
          autoAlpha: 0,
          duration: 1.5,
          repeat: -1,
          ease: "power1.inOut",
        },
      );
    }

    /*
     * Mouse parallax
     */
    quickToRef.current = {};

    if (allowMouseParallax) {
      PARALLAX_LAYERS.forEach(({ layer, x, y }) => {
        const inner = getLayerInner(layer);

        if (!inner) return;

        quickToRef.current[layer] = {
          xTo: gsap.quickTo(inner, "x", {
            duration: 1,
            ease: "power3.out",
          }),
          yTo: gsap.quickTo(inner, "y", {
            duration: 1,
            ease: "power3.out",
          }),
          xMax: x,
          yMax: y,
        };
      });

      quickToRef.current.content = {
        xTo: gsap.quickTo(content, "x", {
          duration: 1,
          ease: "power3.out",
        }),
        yTo: gsap.quickTo(content, "y", {
          duration: 1,
          ease: "power3.out",
        }),
        xMax: 8,
        yMax: 5,
      };
    }

    /*
     * ScrollTrigger cinematic sequence
     */
    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 1025px)",
        tablet: "(min-width: 641px) and (max-width: 1024px)",
        mobile: "(max-width: 640px)",
      },
      (context) => {
        const { desktop, tablet } = context.conditions;

        const scrollDistance = desktop
          ? window.innerHeight * 4.8
          : tablet
            ? window.innerHeight * 3.5
            : window.innerHeight * 2.6;

        const strength = desktop ? 1 : tablet ? 0.7 : 0.45;

        const scrollTimeline = gsap.timeline({
          defaults: {
            ease: "none",
          },
          scrollTrigger: {
            id: "hero-cinematic",
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1.2,
            pin: stage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            preventOverlaps: true,
            markers: false,
          },
        });

        /*
         * Stage 1: camera starts moving into landscape
         */
        scrollTimeline
          .to(
            content,
            {
              y: -65 * strength,
              scale: 0.96,
            },
            0,
          )
          .to(
            scrollIndicator,
            {
              autoAlpha: 0,
              y: 25,
            },
            0,
          )
          .to(
            sky,
            {
              scale: 1.08,
            },
            0,
          )
          .to(
            clouds,
            {
              xPercent: 8 * strength,
              scale: 1.16,
            },
            0,
          )
          .to(
            mountainBack,
            {
              scale: 1 + 0.18 * strength,
              y: 10 * strength,
            },
            0,
          )
          .to(
            mountainMid,
            {
              scale: 1 + 0.3 * strength,
              y: 20 * strength,
            },
            0,
          )
          .to(
            mountainFront,
            {
              scale: 1 + 0.48 * strength,
              y: 32 * strength,
            },
            0,
          )
          .to(
            teaHills,
            {
              scale: 1 + 0.62 * strength,
              y: 55 * strength,
            },
            0,
          )
          .to(
            road,
            {
              scale: 1 + 0.75 * strength,
              y: 85 * strength,
            },
            0,
          )
          .to(
            grassFront,
            {
              scale: 1 + 0.8 * strength,
              y: 95 * strength,
            },
            0,
          );

        /*
         * Stage 2: foreground opens like camera passing through
         */
        scrollTimeline
          .to(
            treesLeft,
            {
              xPercent: -42 * strength,
              scale: 1.35,
            },
            1.8,
          )
          .to(
            treesRight,
            {
              xPercent: 42 * strength,
              scale: 1.35,
            },
            1.8,
          )
          .to(
            vehicle,
            {
              y: 160 * strength,
              scale: 2.6,
              autoAlpha: 0,
            },
            1.9,
          )
          .to(
            supporting,
            {
              autoAlpha: 0,
              y: -45,
            },
            2.1,
          )
          .to(
            buttons,
            {
              autoAlpha: 0,
              y: -45,
            },
            2.1,
          );

        /*
         * Stage 3: heading exits, sunlight and mist appear
         */
        scrollTimeline
          .to(
            words,
            {
              yPercent: -140,
              autoAlpha: 0,
              stagger: 0.025,
            },
            3.5,
          )
          .to(
            eyebrow,
            {
              autoAlpha: 0,
              y: -25,
            },
            3.5,
          )
          .to(
            sunGlow,
            {
              autoAlpha: 1,
              scale: 1.7,
            },
            3.25,
          )
          .to(
            mistBack,
            {
              autoAlpha: 0.7,
              scale: 1.9,
            },
            3.3,
          )
          .to(
            mountainBack,
            {
              scale: 1 + 0.38 * strength,
            },
            3.3,
          )
          .to(
            mountainMid,
            {
              scale: 1 + 0.6 * strength,
            },
            3.3,
          )
          .to(
            mountainFront,
            {
              scale: 1 + 0.95 * strength,
            },
            3.3,
          )
          .to(
            teaHills,
            {
              scale: 1 + 1.15 * strength,
            },
            3.3,
          );

        /*
         * Stage 4: fog transition into next section
         */
        scrollTimeline
          .to(
            fogCover,
            {
              autoAlpha: 1,
              scale: 1,
              yPercent: 0,
              duration: 1.8,
            },
            5.5,
          )
          .to(
            stage,
            {
              filter: "brightness(1.08)",
              duration: 1.2,
            },
            5.7,
          )
          .to(
            content,
            {
              autoAlpha: 0,
              duration: 1,
            },
            5.7,
          );

        return () => {
          scrollTimeline.scrollTrigger?.kill();
          scrollTimeline.kill();
        };
      },
    );

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.clearTimeout(refreshTimer);
      media.revert();
      quickToRef.current = {};
    };
  }, [prefersReducedMotion, allowMouseParallax]);

  useEffect(() => {
    if (!allowMouseParallax || prefersReducedMotion) {
      return undefined;
    }

    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    function handlePointerMove(event) {
      const rect = section.getBoundingClientRect();

      const normalX = (event.clientX - rect.left) / rect.width - 0.5;

      const normalY = (event.clientY - rect.top) / rect.height - 0.5;

      Object.values(quickToRef.current).forEach((item) => {
        if (!item?.xTo || !item?.yTo) return;

        item.xTo(normalX * item.xMax);
        item.yTo(normalY * item.yMax);
      });
    }

    function resetPointerPosition() {
      Object.values(quickToRef.current).forEach((item) => {
        if (!item?.xTo || !item?.yTo) return;

        item.xTo(0);
        item.yTo(0);
      });
    }

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", resetPointerPosition);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", resetPointerPosition);
    };
  }, [allowMouseParallax, prefersReducedMotion]);

  function handleAnchorClick(event, href) {
    event.preventDefault();

    const header = document.querySelector("header");
    const offset = -(header?.offsetHeight || 80) - 12;

    scrollToTarget(lenis, href, {
      offset,
    });
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className={styles.section}
      aria-label="ExploreKey Holidays — introduction"
    >
      <div ref={stageRef} className={styles.stage}>
        <HeroScene />

        <div ref={contentRef} className={styles.content}>
          <span ref={eyebrowRef} className={`eyebrow ${styles.eyebrow}`}>
            {company.tagline}
          </span>

          <h1 ref={headingRef} className={styles.heading}>
            <span className={styles.headingLine}>
              <SplitWords text={company.hero.line1} />
            </span>

            <span className={styles.headingLine}>
              <SplitWords text={company.hero.line2} />
            </span>
          </h1>

          <p ref={supportingRef} className={styles.supporting}>
            {company.hero.supporting}
          </p>

          <div ref={buttonsRef} className={styles.buttonRow}>
            <Button
              href="#packages"
              onClick={(event) => handleAnchorClick(event, "#packages")}
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore Packages
            </Button>

            <Button
              href="#final-cta"
              variant="secondary"
              onClick={(event) => handleAnchorClick(event, "#final-cta")}
            >
              Customise My Trip
            </Button>

            <Button
              href={buildWhatsappLink(
                `Hi ${company.name}, I'd like to know more about your tour packages.`,
              )}
              external
              variant="whatsapp"
              icon={MessageCircle}
            >
              WhatsApp Us
            </Button>

            <Button href={buildTelLink()} variant="secondary" icon={Phone}>
              Call Now
            </Button>
          </div>
        </div>

        <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
          <span>Scroll</span>

          <span className={styles.scrollLine}>
            <span className={styles.scrollDot} />
          </span>
        </div>
      </div>
    </section>
  );
}
