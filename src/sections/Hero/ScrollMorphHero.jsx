import { useCallback, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import "./ScrollMorphHero.css";
import Button from "../../components/common/Button";
import { heroGallery, heroGalleryMobile } from "../../data/heroGallery";
import { company, buildTelLink, buildWhatsappLink } from "../../data/company";
import { useLenis, scrollToTarget } from "../../hooks/useLenis";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { QUERIES } from "../../utils/breakpoints";
import { gsap, useGSAP, ensureGsapRegistered } from "../../utils/gsapSetup";

ensureGsapRegistered();

/** Timeline stage boundaries, expressed as fractions of the pinned scroll. */
const STAGE = {
  lineEnd: 0.16, // 1 photo deck -> line
  circleEnd: 0.34, // 2 line -> circle
  contentEnd: 0.48, // 3 circle held, central content reveals
  arcEnd: 0.68, // 4 circle -> bottom arc
  carouselEnd: 0.92, // 5 arc rotates through the collection
  // 6 exit runs from carouselEnd -> 1
};

const easeInOut = gsap.parseEase("power2.inOut");
const easeOut = gsap.parseEase("power3.out");

/**
 * Viewport-derived geometry for every layout the cards morph through.
 * Recomputed on ScrollTrigger refresh so resize stays correct.
 */
function computeGeometry(w, h, n, compact) {
  const cardW = compact ? 58 : 96;
  const cardH = compact ? 78 : 128;

  // Ring must clear the centred brand content, and the card body has to stay
  // inside the viewport on short screens (1366x768), so subtract half a card
  // plus a margin from the available half-height rather than using a flat ratio.
  const maxR = h * 0.5 - cardH * 0.5 - 24;
  // Compact: deliberately oversize the ring so it crops at the left/right edges
  // (allowed by spec) — that buys a wide clear centre so the headline never
  // collides with the cards on a narrow screen.
  const circleR = compact
    ? Math.min(w * 0.62, h * 0.34)
    : Math.min(w * 0.34, maxR);
  // On compact the ring becomes an ellipse: cropped at the sides but stretched
  // vertically, which opens a tall clear corridor down the middle. A true circle
  // small enough to fit a phone's width leaves far too little headroom for the
  // eyebrow + two-line headline + body + CTAs, which then collide with the cards.
  const circleRy = compact ? Math.min(circleR * 1.5, h * 0.4) : circleR;
  const lineStep = Math.min((w * 0.94) / n, cardW * 1.12);

  // Arc sits on a large circle whose apex lands ~64% down the viewport.
  const arcR = Math.max(w * (compact ? 1.15 : 0.8), 420);
  const apexY = h * 0.64 - h / 2;
  const arcCenterY = apexY + arcR;
  const arcStep = compact ? 7.5 : 6.2;
  const arcScale = compact ? 1.12 : 1.22;

  return {
    cardW,
    cardH,
    circleR,
    circleRy,
    lineStep,
    arcR,
    arcCenterY,
    arcStep,
    arcScale,
    w,
    h,
    n,
    compact,
  };
}

function circlePos(i, g) {
  const a = (i / g.n) * 360;
  const rad = (a * Math.PI) / 180;
  return {
    x: Math.sin(rad) * g.circleR,
    y: -Math.cos(rad) * g.circleRy,
    rot: a,
  };
}

function linePos(i, g) {
  return { x: (i - (g.n - 1) / 2) * g.lineStep, y: 0, rot: 0 };
}

function deckPos(i, g) {
  const center = (g.n - 1) / 2;
  const offset = i - center;

  const spread = g.compact ? 12 : 18;
  const rotationStep = g.compact ? 3 : 4;
  const fanCurve = g.compact ? 1.8 : 2.4;
  const baseY = g.h * (g.compact ? 0.3 : 0.31);

  return {
    x: offset * spread,
    y: baseY + Math.abs(offset) * fanCurve,
    rot: offset * rotationStep,
    scale: g.compact ? 0.76 : 0.84,
  };
}

function arcPos(i, g, rotOffset) {
  const a = (i - (g.n - 1) / 2) * g.arcStep + rotOffset;
  const rad = (a * Math.PI) / 180;
  return {
    x: Math.sin(rad) * g.arcR,
    y: g.arcCenterY - Math.cos(rad) * g.arcR,
    rot: a,
    angle: a,
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

export default function ScrollMorphHero() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const parallaxRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const contentRef = useRef(null);
  const introRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const supportRef = useRef(null);
  const ctaRef = useRef(null);
  const labelRef = useRef(null);
  const tintRef = useRef(null);

  const lenis = useLenis();
  const isCompact = useMediaQuery("(max-width: 900px)");
  const prefersReducedMotion = false;
  const allowMouse = useMediaQuery(QUERIES.fine);

  const items = isCompact ? heroGalleryMobile : heroGallery;
  const [activeDestination, setActiveDestination] = useState(
    items[0]?.destination ?? "",
  );

  const handleAnchor = useCallback(
    (event, href) => {
      event.preventDefault();
      const header = document.querySelector("header");
      scrollToTarget(lenis, href, {
        offset: -(header?.offsetHeight || 80) - 12,
      });
    },
    [lenis],
  );

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;

      const n = cards.length;
      gsap.set(cards, { xPercent: -50, yPercent: -50 });

      // ---- Reduced motion: no pin, no scrub. Static arc + content visible. ----
      if (prefersReducedMotion) {
        const g = computeGeometry(
          window.innerWidth,
          window.innerHeight,
          n,
          isCompact,
        );
        cards.forEach((card, i) => {
          const p = arcPos(i, g, 0);
          gsap.set(card, {
            x: p.x,
            y: p.y * 0.34,
            rotation: p.rot,
            scale: 1,
            opacity: 1,
          });
        });
        gsap.set(
          [
            eyebrowRef.current,
            supportRef.current,
            ctaRef.current,
            labelRef.current,
            ...headingRef.current.querySelectorAll(".smh-line"),
          ],
          { autoAlpha: 1, y: 0 },
        );
        return;
      }

      // Per-card high-frequency setters (cheaper than gsap.set every frame).
      const setters = cards.map((card) => ({
        x: gsap.quickSetter(card, "x", "px"),
        y: gsap.quickSetter(card, "y", "px"),
        rot: gsap.quickSetter(card, "rotation", "deg"),
        scaleX: gsap.quickSetter(card, "scaleX"),
        scaleY: gsap.quickSetter(card, "scaleY"),
        opacity: gsap.quickSetter(card, "opacity"),
      }));

      let geo = computeGeometry(
        window.innerWidth,
        window.innerHeight,
        n,
        isCompact,
      );
      const lastActive = { i: -1 };
      const proxy = { p: 0 };

      const render = (p) => {
        const g = geo;
        // Rotation applied during stage 5. Clamped to stop a few cards short of
        // the apex so the arc still reads as a full arc at the end (and the last
        // image stays clearly visible) rather than emptying out to one side.
        const TRAIL = 3;
        const maxRot = g.arcStep * Math.max(0, (g.n - 1) / 2 - TRAIL);
        const carouselT =
          p <= STAGE.arcEnd
            ? 0
            : gsap.utils.clamp(
                0,
                1,
                gsap.utils.normalize(
                  STAGE.arcEnd,
                  STAGE.carouselEnd,
                  Math.min(p, STAGE.carouselEnd),
                ),
              );
        const rotOffset = -maxRot * carouselT;

        // Exit progress (stage 6) drifts the whole arc down and fades it out.
        const exitT =
          p <= STAGE.carouselEnd
            ? 0
            : gsap.utils.clamp(
                0,
                1,
                gsap.utils.normalize(STAGE.carouselEnd, 1, p),
              );

        let bestIdx = 0;
        let bestAbs = Infinity;

        for (let i = 0; i < g.n; i++) {
          const lp = linePos(i, g);
          const cp = circlePos(i, g);
          const ap = arcPos(i, g, rotOffset);

          let x;
          let y;
          let rot;
          let scale;
          let opacity = 1;

          if (p < STAGE.lineEnd) {
            // Stage 1 — a clean bottom photo deck opens into a gallery line.
            const t = easeOut(gsap.utils.normalize(0, STAGE.lineEnd, p));
            const dp = deckPos(i, g);

            x = lerp(dp.x, lp.x, t);
            y = lerp(dp.y, lp.y, t);
            rot = lerp(dp.rot, 0, t);
            scale = lerp(dp.scale, 1, t);
            opacity = lerp(0.78, 1, t);
          } else if (p < STAGE.circleEnd) {
            // Stage 2 — line morphs into the ring.
            const t = easeInOut(
              gsap.utils.normalize(STAGE.lineEnd, STAGE.circleEnd, p),
            );
            x = lerp(lp.x, cp.x, t);
            y = lerp(lp.y, cp.y, t);
            rot = lerp(0, cp.rot, t);
            scale = 1;
          } else if (p < STAGE.contentEnd) {
            // Stage 3 — ring holds steady while the brand content reveals.
            x = cp.x;
            y = cp.y;
            rot = cp.rot;
            scale = 1;
          } else if (p < STAGE.arcEnd) {
            // Stage 4 — ring opens out into the wide bottom arc.
            const t = easeInOut(
              gsap.utils.normalize(STAGE.contentEnd, STAGE.arcEnd, p),
            );
            x = lerp(cp.x, ap.x, t);
            y = lerp(cp.y, ap.y, t);
            rot = lerp(cp.rot, ap.rot, t);
            scale = lerp(1, g.arcScale, t);
          } else {
            // Stage 5/6 — arc carousel, then exit drift.
            x = ap.x;
            y = ap.y + exitT * g.h * 0.16;
            rot = ap.rot;
            scale = g.arcScale;
          }

          // Depth falloff + active emphasis once the arc exists.
          if (p >= STAGE.contentEnd) {
            const abs = Math.abs(ap.angle);
            if (abs < bestAbs) {
              bestAbs = abs;
              bestIdx = i;
            }
            const near = gsap.utils.clamp(
              0,
              1,
              1 - abs / (g.arcStep * g.n * 0.5),
            );
            const emph = p > STAGE.arcEnd ? near : 0;
            scale *= 1 + emph * 0.28;
            opacity = gsap.utils.clamp(0.18, 1, 0.42 + near * 0.72);
          }

          if (exitT > 0) opacity *= 1 - exitT;

          setters[i].x(x);
          setters[i].y(y);
          setters[i].rot(rot);
          setters[i].scaleX(scale);
          setters[i].scaleY(scale);
          setters[i].opacity(opacity);
        }

        // Destination label: only touch React state when the active card changes.
        if (p > STAGE.arcEnd && bestIdx !== lastActive.i) {
          lastActive.i = bestIdx;
          setActiveDestination(items[bestIdx].destination);
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (isCompact ? 2.25 : 3.45)}`,
          scrub: 1,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            geo = computeGeometry(
              window.innerWidth,
              window.innerHeight,
              n,
              isCompact,
            );
            render(proxy.p);
          },
          onToggle: (self) => {
            // will-change only while the hero is actually animating.
            stageRef.current?.classList.toggle("is-live", self.isActive);
          },
        },
      });

      // Card morph — one scrubbed proxy feeding the render function keeps
      // forward and reverse scrolling perfectly symmetric.
      tl.to(proxy, { p: 1, duration: 1, onUpdate: () => render(proxy.p) }, 0);

      // Background tone drift — opacity-only cross-fades between destination
      // palettes. Selector strings are safe here: useGSAP scopes them to rootRef.
      tl.to(".smh-tone--tea", { opacity: 1, duration: 0.16 }, 0.1)
        .to(".smh-tone--sand", { opacity: 1, duration: 0.16 }, 0.34)
        .to(".smh-tone--blue", { opacity: 1, duration: 0.16 }, 0.52)
        .to(".smh-tone--cream", { opacity: 1, duration: 0.18 }, 0.7);

      // Stage 2 — brief centred intro line. autoAlpha (not opacity) so the
      // hidden state also drops pointer events.
      tl.fromTo(
        introRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.05 },
        0.17,
      ).to(introRef.current, { autoAlpha: 0, y: -14, duration: 0.05 }, 0.29);

      // Stage 3 — brand content reveal.
      // Text uses plain opacity, NOT autoAlpha: autoAlpha sets visibility:hidden,
      // which would drop the <h1> out of the accessibility tree until the user
      // scrolls. Only the CTA group uses autoAlpha, so hidden buttons stay
      // untabbable and unclickable.
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.05 },
        0.32,
      )
        .fromTo(
          headingRef.current.querySelectorAll(".smh-line"),
          { opacity: 0, y: 42 },
          { opacity: 1, y: 0, duration: 0.06, stagger: 0.02 },
          0.35,
        )
        .fromTo(
          supportRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.05 },
          0.4,
        )
        .fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.05 },
          0.43,
        );

      // Stage 4 — headline lifts toward the upper-middle as the arc forms.
      tl.to(
        contentRef.current,
        { y: () => -window.innerHeight * 0.17, duration: 0.2 },
        STAGE.contentEnd,
      );

      // Stage 5 — destination label.
      tl.fromTo(
        labelRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.04 },
        0.69,
      );

      // Stage 6 — seamless handoff into the dark-green Journey section.
      // Keep the hero alive until the very end, then dissolve it over the
      // Journey colour instead of exposing an empty cream pin-spacer.
      tl.to(
        tintRef.current,
        {
          opacity: 1,
          duration: 0.055,
          ease: "power1.inOut",
        },
        0.94,
      )
        .to(
          labelRef.current,
          {
            autoAlpha: 0,
            y: -10,
            duration: 0.025,
          },
          0.965,
        )
        .to(
          contentRef.current,
          {
            y: () => -window.innerHeight * 0.12,
            scale: 0.97,
            autoAlpha: 0,
            duration: 0.03,
            ease: "power2.in",
          },
          0.97,
        )
        .to(
          stageRef.current,
          {
            yPercent: -2,
            scale: 1.035,
            filter: "blur(7px)",
            autoAlpha: 0,
            duration: 0.025,
            ease: "power2.in",
          },
          0.975,
        );

      render(0);

      // ---- Mouse parallax: one wrapper, never the individual cards ----
      if (allowMouse) {
        const xTo = gsap.quickTo(parallaxRef.current, "x", {
          duration: 0.7,
          ease: "power3",
        });
        const yTo = gsap.quickTo(parallaxRef.current, "y", {
          duration: 0.7,
          ease: "power3",
        });
        const onMove = (event) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          xTo(nx * 56);
          yTo(ny * 22);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
      return undefined;
    },
    {
      scope: rootRef,
      dependencies: [isCompact, prefersReducedMotion, allowMouse, items],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      id="home"
      ref={rootRef}
      className={`smh${prefersReducedMotion ? " smh--static" : ""}`}
      aria-label="ExploreKey Holidays — travel gallery introduction"
      style={{ background: "#0b2b22" }}
    >
      <div ref={pinRef} className="smh-pin">
        <div className="smh-bg" aria-hidden="true">
          <span className="smh-tone smh-tone--mist" />
          <span className="smh-tone smh-tone--tea" />
          <span className="smh-tone smh-tone--sand" />
          <span className="smh-tone smh-tone--blue" />
          <span className="smh-tone smh-tone--cream" />
        </div>
        <div
          ref={tintRef}
          className="smh-bg-exit"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 78% 18%, rgba(226,151,79,0.12), transparent 28%), linear-gradient(180deg, #0b2b22 0%, #082219 100%)",
          }}
        />
        <div className="smh-grain" aria-hidden="true" />

        <div ref={parallaxRef} className="smh-parallax" aria-hidden="true">
          <div ref={stageRef} className="smh-stage">
            {items.map((item, i) => (
              <figure
                key={item.id}
                className="smh-card"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <img
                  src={item.src}
                  srcSet={`${item.srcSmall} 200w, ${item.src} 360w`}
                  sizes="(max-width: 900px) 68px, 110px"
                  alt=""
                  width="360"
                  height="480"
                  loading={item.priority ? "eager" : "lazy"}
                  fetchPriority={item.priority ? "high" : "low"}
                  decoding="async"
                  draggable="false"
                  style={{ objectPosition: item.objectPosition }}
                />
              </figure>
            ))}
          </div>
        </div>

        {/* Screen-reader equivalent of the gallery, which is decorative above. */}
        <ul className="visually-hidden">
          {items.map((item) => (
            <li key={item.id}>{item.alt}</li>
          ))}
        </ul>

        <p ref={introRef} className="smh-intro">
          Every journey begins with a moment.
        </p>

        <div ref={contentRef} className="smh-content">
          <div className="smh-content-glow" aria-hidden="true" />
          <span ref={eyebrowRef} className="smh-eyebrow">
            Unlock Your Perfect Journey
          </span>
          <h1 ref={headingRef} className="smh-heading">
            <span className="smh-line">Your Journey.</span>
            <span className="smh-line">Our Responsibility.</span>
          </h1>
          <p ref={supportRef} className="smh-support">
            From misty mountains and scenic roads to comfortable stays and
            complete trip coordination, ExploreKey Holidays manages every detail
            of your journey.
          </p>
          <div ref={ctaRef} className="smh-cta">
            <Button
              href="#packages"
              icon={ArrowRight}
              iconPosition="right"
              onClick={(e) => handleAnchor(e, "#packages")}
            >
              Explore Packages
            </Button>
            <Button
              href="#final-cta"
              variant="secondaryOnLight"
              onClick={(e) => handleAnchor(e, "#final-cta")}
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
            <Button
              href={buildTelLink()}
              variant="secondaryOnLight"
              icon={Phone}
            >
              Call Now
            </Button>
          </div>
        </div>

        <div ref={labelRef} className="smh-label" aria-live="polite">
          <span className="smh-label-kicker">Now showing</span>
          <span className="smh-label-name">{activeDestination}</span>
        </div>
      </div>
    </section>
  );
}
