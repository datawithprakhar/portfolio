"use client";

import { useState } from "react";
import styles from "./CompanyLogo.module.css";

/**
 * Prefers a real logo file at /public/logos/{slug}.svg (or .png). Falls back
 * to a monogram badge if the file is missing or fails to load — which, out
 * of the box, is every slug, since no logo files ship by default. See
 * public/logos/README.md for how to add the real ones.
 */
export default function CompanyLogo({ slug, name, initials }) {
  const [failed, setFailed] = useState(false);

  if (!failed && slug) {
    return (
      <span className={styles.wrap}>
        <img
          src={`/logos/${slug}.svg`}
          alt={`${name} logo`}
          className={styles.mark}
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className={styles.badge} aria-hidden="true">
      {initials}
    </span>
  );
}
