"use client";

import { useEffect, useState } from "react";
import { whenIntroReady } from "@/lib/introGate";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#profile", label: "Experience" },
  { href: "#resume", label: "Resume" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#connect", label: "Connect with me" },
];

export default function Nav() {
  // Held back until the preloader lifts, so the nav doesn't float over the
  // welcome curtain.
  const [visible, setVisible] = useState(false);

  useEffect(() => whenIntroReady(() => setVisible(true)), []);

  const onClick = (event, href) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      className={`${styles.nav} ${visible ? styles.navVisible : ""}`}
      aria-label="Sections"
    >
      {LINKS.map((link) => (
        <a
          key={link.href}
          className={styles.link}
          href={link.href}
          onClick={(event) => onClick(event, link.href)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
