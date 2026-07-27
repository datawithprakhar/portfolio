"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import CinematicLayer from "@/components/CinematicLayer/CinematicLayer";
import { whenIntroReady } from "@/lib/introGate";
import { profile } from "@/lib/profile";
import styles from "./VideoIntro.module.css";

const SOURCE = "/media/hero.mp4";
const POSTER = "/media/hero-poster.jpg";
const HINT_TIMEOUT = 7000;

/** Split a word into per-character spans so GSAP can stagger the reveal. */
function SplitWord({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, index) => (
        <span key={`${char}-${index}`} className={styles.charMask} aria-hidden="true">
          <span className={styles.char}>{char}</span>
        </span>
      ))}
    </span>
  );
}

export default function VideoIntro({ nextSectionId = "profile" }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const ambientRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // A second decoding video stream under a 64px blur is the most expensive
  // thing on this page. Phones get a blurred still instead.
  const [useAmbientVideo, setUseAmbientVideo] = useState(false);

  useEffect(() => {
    const canAfford =
      window.matchMedia("(min-width: 900px)").matches &&
      !window.matchMedia("(pointer: coarse)").matches;
    setUseAmbientVideo(canAfford);
  }, []);

  /* ---------------------------------------------------------------- video -- */

  // Keep the blurred ambient copy locked to the foreground video. It drifts
  // because the two elements decode independently; a periodic nudge is
  // cheaper and steadier than trying to keep them frame-accurate.
  useEffect(() => {
    const video = videoRef.current;
    const ambient = ambientRef.current;
    if (!video || !ambient) return;

    const sync = () => {
      if (Math.abs(ambient.currentTime - video.currentTime) > 0.3) {
        ambient.currentTime = video.currentTime;
      }
    };

    const interval = window.setInterval(sync, 1000);
    video.addEventListener("seeked", sync);
    return () => {
      window.clearInterval(interval);
      video.removeEventListener("seeked", sync);
    };
  }, [useAmbientVideo]);

  // Autoplay can be refused even when muted. Reflect reality in the UI rather
  // than assuming it worked.
  useEffect(() => {
    const video = videoRef.current;
    const ambient = ambientRef.current;
    if (!video) return;

    const attempt = async () => {
      try {
        await video.play();
        ambient?.play().catch(() => {});
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    const onLoaded = () => {
      setIsReady(true);
      attempt();
    };

    if (video.readyState >= 2) onLoaded();
    else video.addEventListener("loadeddata", onLoaded, { once: true });

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // The sound hint retires on its own so it never becomes furniture.
  useEffect(() => {
    if (!showHint) return undefined;
    const timer = window.setTimeout(() => setShowHint(false), HINT_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [showHint]);

  // Called only from the preloader's tap, which is the gesture browsers
  // require before audio may play. The sound stays on for one full pass of the
  // video, then mutes itself — heard once, never nagging.
  const detachLoopWatchRef = useRef(() => {});

  const startWithSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    setShowHint(false);
    video.play().catch(() => {
      // Refused anyway — fall back to muted rather than a frozen frame.
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
    });

    let lastTime = video.currentTime;
    const onTimeUpdate = () => {
      // A loop shows up as the clock jumping backwards.
      if (video.currentTime < lastTime - 0.5) {
        video.muted = true;
        setIsMuted(true);
        detachLoopWatchRef.current();
      }
      lastTime = video.currentTime;
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    detachLoopWatchRef.current = () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      detachLoopWatchRef.current = () => {};
    };
  }, []);

  useEffect(() => () => detachLoopWatchRef.current(), []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    const ambient = ambientRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      ambient?.play().catch(() => {});
    } else {
      video.pause();
      ambient?.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // A manual choice overrides the automatic mute-after-one-loop.
    detachLoopWatchRef.current();
    const next = !video.muted;
    video.muted = next;
    if (!next && video.paused) video.play().catch(() => {});
    setIsMuted(next);
    setShowHint(false);
  }, []);

  /* ------------------------------------------------------------- entrance -- */

  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let unsubscribe = () => {};

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            `.${styles.stage}`,
            `.${styles.tagline}`,
            `.${styles.char}`,
            `.${styles.role}`,
            `.${styles.subtitle}`,
            `.${styles.meta}`,
            `.${styles.controls}`,
            `.${styles.scrollCue}`,
          ],
          { opacity: 1, y: 0, clearProps: "transform" }
        );
        return;
      }

      // Held until the preloader lifts — otherwise the entrance plays out
      // behind the curtain and reveals an already-finished frame.
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
        delay: 0.15,
      });

      timeline
        // The frame opens first — a slow lift out of black, like a fade-in
        // from a projector rather than a UI transition.
        .fromTo(
          `.${styles.stage}`,
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }
        )
        .fromTo(
          `.${styles.tagline}`,
          { opacity: 0, y: 18, letterSpacing: "0.5em" },
          { opacity: 1, y: 0, letterSpacing: "0.32em", duration: 1.4 },
          "-=1.5"
        )
        // Characters rise out of their masks, first name then last.
        .fromTo(
          `.${styles.char}`,
          { yPercent: 118, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            stagger: { each: 0.035, from: "start" },
            ease: "expo.out",
          },
          "-=1.15"
        )
        .fromTo(
          `.${styles.rule}`,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.6, ease: "expo.out" },
          "-=0.95"
        )
        .fromTo(
          [`.${styles.role}`, `.${styles.subtitle}`, `.${styles.meta}`],
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1.3, stagger: 0.12 },
          "-=1.35"
        )
        .fromTo(
          `.${styles.controls}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.1 },
          "-=1.0"
        )
        .fromTo(
          `.${styles.scrollCue}`,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 1.1 },
          "-=0.9"
        );
      unsubscribe = whenIntroReady((withSound) => {
        timeline.play();
        if (withSound) startWithSound();
      });
    }, rootRef);

    return () => {
      unsubscribe();
      context.revert();
    };
  }, [startWithSound]);

  const scrollToNext = useCallback(() => {
    const target = document.getElementById(nextSectionId);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [nextSectionId]);

  /* ------------------------------------------------------------------ ui -- */

  return (
    <section
      id="intro"
      ref={rootRef}
      className={`${styles.hero} ${isReady ? styles.heroReady : ""}`}
      aria-label="Introduction"
    >
      <div className={styles.sticky}>
        <div className={styles.stage}>
          {/* Ambient layer: the same frame, blown out and blurred, so the
              letterboxed edges bleed into colour instead of black bars.
              The still sits underneath as the base — on phones it's the only
              ambient layer, and everywhere it covers the video's first frames. */}
          <div className={styles.ambientStill} aria-hidden="true" />

          {useAmbientVideo ? (
            <video
              ref={ambientRef}
              className={styles.ambientVideo}
              src={SOURCE}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              tabIndex={-1}
              aria-hidden="true"
            />
          ) : null}

          <video
            ref={videoRef}
            className={styles.video}
            src={SOURCE}
            poster={POSTER}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={`${profile.firstName} ${profile.lastName} introduction video`}
          />

          <div className={styles.grade} aria-hidden="true" />
          <div className={styles.vignette} aria-hidden="true" />
          <div className={styles.practical} aria-hidden="true" />
          <div className={styles.grain} aria-hidden="true" />

          <CinematicLayer />

          <div className={styles.content}>
            <p className={styles.tagline}>{profile.tagline}</p>

            <h1 className={styles.name}>
              <SplitWord text={profile.firstName} className={styles.nameLine} />
              <SplitWord
                text={profile.lastName}
                className={`${styles.nameLine} ${styles.nameLineAccent}`}
              />
            </h1>

            <span className={styles.rule} aria-hidden="true" />

            <p className={styles.role}>{profile.role}</p>
            <p className={styles.subtitle}>{profile.subtitle}</p>

            <p className={styles.meta}>
              <span>{profile.location}</span>
              <span className={styles.metaDot} aria-hidden="true" />
              <a href={`mailto:${profile.email}`} className={styles.metaLink}>
                {profile.email}
              </a>
            </p>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.glassButton}
              onClick={togglePlay}
              aria-pressed={!isPlaying}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              <span className={styles.icon} aria-hidden="true">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <rect x="7" y="5" width="3.4" height="14" rx="1.1" fill="currentColor" />
                    <rect x="13.6" y="5" width="3.4" height="14" rx="1.1" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M8 5.2v13.6L19 12 8 5.2z" fill="currentColor" />
                  </svg>
                )}
              </span>
              <span className={styles.buttonLabel}>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              type="button"
              className={styles.glassButton}
              onClick={toggleMute}
              aria-pressed={!isMuted}
              aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
            >
              <span className={styles.icon} aria-hidden="true">
                {isMuted ? (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                    <path
                      d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4z"
                      fill="currentColor"
                    />
                    <path
                      d="M16 9.6l4.2 4.8M20.2 9.6L16 14.4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
                    <path d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4z" fill="currentColor" />
                    <path
                      d="M15.6 9.2a3.9 3.9 0 010 5.6M18.3 6.9a7.6 7.6 0 010 10.2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              <span className={styles.buttonLabel}>{isMuted ? "Sound off" : "Sound on"}</span>
            </button>

            {isMuted && showHint ? (
              <button
                type="button"
                className={styles.hint}
                onClick={toggleMute}
                aria-label="Turn sound on"
              >
                <span className={styles.hintPulse} aria-hidden="true" />
                Tap for sound
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className={styles.scrollCue}
            onClick={scrollToNext}
            aria-label="Scroll to experience"
          >
            <span className={styles.scrollLabel}>Scroll</span>
            <span className={styles.scrollTrack} aria-hidden="true">
              <span className={styles.scrollPulse} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
