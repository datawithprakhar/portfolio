# Prakhar Mittal — cinematic portfolio hero

Next.js (App Router) + React + Three.js + GSAP + CSS Modules.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's here

```
app/
  layout.js                 Font pairing (Bebas Neue / Sora / JetBrains Mono), metadata
  page.js                   Composes the two sections
  globals.css               Design tokens, reset, reduced-motion baseline
components/
  VideoIntro/               Sticky fullscreen hero — video layers, controls, GSAP entrance
  CinematicLayer/           Three.js bokeh field on a transparent canvas
  Profile/                  Experience section, ScrollTrigger reveals
lib/
  profile.js                All page copy, derived from the resume
  useIsomorphicLayoutEffect.js
public/media/hero.mp4       Your talking-head video
```

## How the hero is layered

Bottom to top, inside one sticky `100svh` stage:

| z | layer | job |
|---|-------|-----|
| 0 | ambient video | same file, scaled 118% and blurred 64px — bleeds colour into the frame edges so nothing letterboxes to black |
| 1 | foreground video | `object-fit: cover`, framed at `center 22%` to sit the face in the upper third |
| 2 | grade / vignette / practicals | dark gradients for legibility, plus a warm key from frame-left and a cold monitor spill from lower-right |
| 3 | `CinematicLayer` | Three.js particles, additive blending, `pointer-events: none` |
| 4 | grain | inline SVG fractal noise, `overlay` blend |
| 5–6 | copy, controls, scroll cue | the only interactive layer |

The two `<video>` elements decode independently and drift apart, so the ambient
copy is nudged back into sync once a second rather than every frame.

## The Three.js layer

- 260 points on desktop, 110 under 768px — these sprites are large and
  overlapping, so fill rate is the constraint, not vertex count.
- One `ShaderMaterial`. Position is offset by three out-of-phase sine waves per
  axis in the vertex shader, so motion never visibly loops and the CPU never
  touches the buffer after upload.
- The fragment shader uses a wide `smoothstep` falloff plus a faint core —
  defocused highlight, not a hard dot. ~22% of particles are oversized and
  near-transparent, which is what reads as bokeh.
- Camera parallax is damped toward the pointer, disabled on coarse pointers.
- Rendering stops when the tab is hidden and when the hero leaves the viewport
  (`IntersectionObserver`). Geometry, material and renderer are all disposed on
  unmount, and the WebGL context is force-released.
- `prefers-reduced-motion` renders one static frame and cancels the loop.

## Autoplay and sound

The video starts muted, which is the only way autoplay is permitted. If the
browser refuses anyway, the `play()` rejection is caught and the button state
flips to "Play" rather than lying about it. The "Tap for sound" badge retires
after 7 seconds or on first use, whichever comes first.

## Swapping the video

Drop a new file at `public/media/hero.mp4`. Two things to check:

- **Resolution.** The current file is 1280×720. It's upscaled on large
  displays; a 1080p or 1440p master will look noticeably crisper.
- **Loop point.** It's 10 seconds and cuts hard back to frame one. Grading the
  first and last half-second to a hold, or matching the head position at both
  ends, makes the loop invisible.

Framing is controlled by `object-position` in `VideoIntro.module.css` (`.video`)
— adjust the vertical percentage if the face sits high or low.

## Editing the content

Everything on the page comes from `lib/profile.js`. Nothing is hardcoded in the
components.
