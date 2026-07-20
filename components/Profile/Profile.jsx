"use client";

import { useRef } from "react";
import gsap from "gsap";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, education, marquee, resume, timeline, profile } from "@/lib/profile";
import styles from "./Profile.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Profile({ id = "profile" }) {
  const rootRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray(`.${styles.reveal}`).forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <section id={id} ref={rootRef} className={styles.section} aria-label="Experience">
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...marquee, ...marquee].map((item, index) => (
            <span key={`${item}-${index}`} className={styles.marqueeItem}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.inner}>
        <header className={`${styles.header} ${styles.reveal}`}>
          <p className={styles.eyebrow}>{about.eyebrow}</p>
          <h2 className={styles.heading}>{about.lead}</h2>
          <p className={styles.lede}>{about.body}</p>
        </header>

        <ol className={styles.timeline}>
          {timeline.map((entry) => (
            <li key={`${entry.company}-${entry.period}`} className={`${styles.entry} ${styles.reveal}`}>
              <div className={styles.entryMeta}>
                <span className={styles.period}>{entry.period}</span>
                <span className={styles.place}>{entry.place}</span>
              </div>
              <div className={styles.entryBody}>
                <h3 className={styles.company}>{entry.company}</h3>
                <p className={styles.jobTitle}>{entry.title}</p>
                <ul className={styles.points}>
                  {entry.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className={`${styles.education} ${styles.reveal}`}>
          <p className={styles.eyebrow}>Education & research</p>
          <ul className={styles.eduList}>
            {education.map((item) => (
              <li key={item.title} className={styles.eduItem}>
                <span className={styles.period}>{item.period}</span>
                <div>
                  <h3 className={styles.eduTitle}>{item.title}</h3>
                  <p className={styles.eduDetail}>{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.resume} ${styles.reveal}`}>
          <div>
            <p className={styles.eyebrow}>Resume</p>
            <h3 className={styles.resumeTitle}>The full record, on one page.</h3>
            <p className={styles.resumeMeta}>{resume.meta}</p>
          </div>
          <div className={styles.resumeActions}>
            <a className={styles.resumeButton} href={resume.href} download={resume.filename}>
              <span className={styles.resumeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                  <path
                    d="M12 4v11m0 0l-4.2-4.2M12 15l4.2-4.2M5 19h14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {resume.label}
            </a>
            <a
              className={styles.resumeSecondary}
              href={resume.href}
              target="_blank"
              rel="noreferrer"
            >
              Open in browser
            </a>
          </div>
        </div>

        <footer className={`${styles.footer} ${styles.reveal}`}>
          <p className={styles.footerLead}>Open to conversations about data platform work.</p>
          <div className={styles.footerLinks}>
            <a className={styles.footerLink} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className={styles.footerLink} href={`tel:${profile.phone}`}>
              {profile.phone}
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
