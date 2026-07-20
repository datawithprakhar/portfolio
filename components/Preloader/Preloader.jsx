"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import { releaseIntro } from "@/lib/introGate";
import { profile } from "@/lib/profile";
import styles from "./Preloader.module.css";

const SETTLE = 0.7; // the welcome phrase lands first
const COUNT_DURATION = 2.1; // then the count runs

export default function Preloader() {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Land at the top: a restored scroll position would drop the visitor
    // halfway down the page the moment the curtain lifts.
    window.scrollTo(0, 0);
    document.body.classList.add("introLocked");

    const unlock = () => {
      document.body.classList.remove("introLocked");
      // Layout changed while locked — let ScrollTrigger recompute.
      window.dispatchEvent(new Event("resize"));
    };

    if (reduceMotion) {
      unlock();
      releaseIntro();
      setIsDone(true);
      return undefined;
    }

    const context = gsap.context(() => {
      const progress = { value: 0 };

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          unlock();
          releaseIntro();
          setIsDone(true);
        },
      });

      timeline
        // The whole phrase arrives as one unit. No per-line stagger: the
        // sentence should read as a sentence, not assemble itself.
        .fromTo(
          `.${styles.center}`,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: SETTLE }
        )
        .fromTo(
          `.${styles.readout}`,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          SETTLE * 0.5
        )
        // Only once the words are on screen does the count begin.
        .to(
          progress,
          {
            value: 100,
            duration: COUNT_DURATION,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(progress.value)
                ).padStart(3, "0");
              }
            },
          },
          SETTLE
        )
        .fromTo(
          `.${styles.barFill}`,
          { scaleX: 0 },
          { scaleX: 1, duration: COUNT_DURATION, ease: "power1.inOut" },
          SETTLE
        )
        // Exit: the words leave, then the panel lifts as a curtain.
        .to(
          `.${styles.center}`,
          { opacity: 0, y: -16, duration: 0.6, ease: "power2.in" },
          "+=0.3"
        )
        .to(`.${styles.readout}`, { opacity: 0, duration: 0.45 }, "<")
        .to(
          `.${styles.curtain}`,
          { yPercent: -100, duration: 1.2, ease: "expo.inOut" },
          "-=0.2"
        );
    }, rootRef);

    return () => context.revert();
  }, []);

  if (isDone) return null;

  return (
    <div ref={rootRef} className={styles.root} role="status" aria-live="polite">
      <div className={styles.curtain}>
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.center}>
          <p className={styles.welcome}>Welcome to</p>

          <p className={styles.mark}>
            <span className={styles.markLine}>{profile.firstName}</span>
            <span className={`${styles.markLine} ${styles.markLineAccent}`}>
              {profile.lastName}&rsquo;s
            </span>
          </p>

          <p className={styles.suffix}>Portfolio</p>
        </div>

        <div className={styles.readout}>
          <span className={styles.counter} ref={counterRef}>
            000
          </span>
          <span className={styles.bar} aria-hidden="true">
            <span className={styles.barFill} />
          </span>
        </div>
      </div>
    </div>
  );
}
