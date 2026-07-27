"use client";

import { useEffect, useRef, useState } from "react";
import { whenIntroReady } from "@/lib/introGate";
import styles from "./ProgressRail.module.css";

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "profile", label: "Experience" },
  { id: "capabilities", label: "Capabilities" },
  { id: "connect", label: "Connect" },
];

export default function ProgressRail() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [visible, setVisible] = useState(false);
  // Which sections currently cross the middle band. Kept in a ref because it
  // churns on every scroll frame and must not drive re-renders itself.
  const crossingRef = useRef(new Set());

  // Held back until the preloader lifts, matching the nav.
  useEffect(() => whenIntroReady(() => setVisible(true)), []);

  useEffect(() => {
    const elements = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      Boolean
    );
    if (elements.length === 0) return undefined;

    const crossing = crossingRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        });

        // Deliberately NOT comparing intersectionRatio. The hero is
        // `position: sticky`, so it stays geometrically inside the viewport
        // for the whole page even once later sections cover it — and ratio is
        // relative to each target's own height, which makes a tall section
        // score lower than a short one occupying the same band. Taking the
        // last crossing section in document order sidesteps both problems and
        // means scrolling down always advances.
        for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
          if (crossing.has(SECTIONS[i].id)) {
            setActiveId(SECTIONS[i].id);
            return;
          }
        }
      },
      {
        // Only the middle 30% of the viewport counts as "where you are".
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const activeIndex = SECTIONS.findIndex((section) => section.id === activeId);

  return (
    <nav
      className={`${styles.rail} ${visible ? styles.railVisible : ""}`}
      aria-label="Page progress"
    >
      <span className={styles.track} aria-hidden="true">
        {/* The lit portion of the rail grows as you descend. */}
        <span
          className={styles.trackFill}
          style={{
            transform: `scaleY(${
              SECTIONS.length > 1 ? activeIndex / (SECTIONS.length - 1) : 0
            })`,
          }}
        />
      </span>

      <ul className={styles.list}>
        {SECTIONS.map((section, index) => {
          const isActive = section.id === activeId;
          const isPassed = index < activeIndex;
          return (
            <li key={section.id} className={styles.item}>
              <button
                type="button"
                className={`${styles.tick} ${isActive ? styles.tickActive : ""} ${
                  isPassed ? styles.tickPassed : ""
                }`}
                onClick={() => goTo(section.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Go to ${section.label}`}
              >
                <span className={styles.tickLabel}>{section.label}</span>
                <span className={styles.tickMark} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
