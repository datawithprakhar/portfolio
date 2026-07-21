"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import { profile, social } from "@/lib/profile";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ id = "connect" }) {
  const rootRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray(`.${styles.reveal}`).forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          }
        );
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <footer id={id} ref={rootRef} className={styles.section} aria-label="Contact">
      <div className={styles.inner}>
        <p className={`${styles.eyebrow} ${styles.reveal}`}>Connect with me</p>
        <p className={`${styles.lead} ${styles.reveal}`}>
          Open to conversations about data platform work.
        </p>

        <div className={`${styles.contacts} ${styles.reveal}`}>
          <a className={styles.contactLink} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className={styles.contactLink} href={`tel:${profile.phone}`}>
            {profile.phone}
          </a>
        </div>

        <div className={`${styles.bottom} ${styles.reveal}`}>
          <p className={styles.copyright}>&copy; 2026 &middot; Prakhar Mittal</p>
          <div className={styles.socialRow}>
            {social.map((item) => (
              <a
                key={item.id}
                className={styles.socialLink}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${profile.firstName} ${profile.lastName} on ${item.name}`}
              >
                {item.id === "linkedin" ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
                  </svg>
                )}
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
