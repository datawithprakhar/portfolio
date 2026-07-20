"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./CinematicLayer.module.css";

/**
 * Ambient bokeh field rendered on a transparent, pointer-transparent canvas
 * that sits above the video and below the hero copy.
 *
 * Design intent: defocused highlights drifting through a dark room — warm
 * ember motes in the near field, cold monitor-blue ones falling away behind
 * them. Everything moves on slow sine curves so nothing reads as "animated".
 */

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aSeed;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uDrift;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    // Three offset sine waves per axis: motion never visibly loops.
    pos.x += sin(uTime * 0.11 + aSeed.x * 6.283) * aSeed.z * 2.4 * uDrift;
    pos.y += sin(uTime * 0.08 + aSeed.y * 6.283) * aSeed.z * 1.9 * uDrift;
    pos.z += sin(uTime * 0.06 + aSeed.z * 6.283) * 1.2 * uDrift;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Manual size attenuation so distant motes bloom wide and faint.
    gl_PointSize = aSize * uPixelRatio * (110.0 / max(-mvPosition.z, 0.001));
    gl_Position = projectionMatrix * mvPosition;

    // Slow luminance breathing keeps the field alive when motion is subtle.
    vAlpha = aAlpha * (0.72 + 0.28 * sin(uTime * 0.5 + aSeed.x * 12.0));
    vColor = aColor;
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform float uOpacity;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Wide, very soft radial falloff = defocused lens bokeh, not a hard dot.
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    float halo = smoothstep(0.5, 0.02, d);
    float core = smoothstep(0.28, 0.0, d) * 0.55;
    float a = (halo * halo * 0.85 + core) * vAlpha * uOpacity;

    gl_FragColor = vec4(vColor, a);
  }
`;

export default function CinematicLayer({ count, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.innerWidth < 768;

    // Keep the fill rate honest: these are very large, overlapping sprites.
    const particleCount = count ?? (isNarrow ? 110 : 260);

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isNarrow ? 1.5 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    renderer.domElement.classList.add(styles.canvas);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 220);
    camera.position.set(0, 0, 42);

    // ---- geometry -----------------------------------------------------------
    const positions = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    const ember = new THREE.Color("#ff7a18");
    const emberSoft = new THREE.Color("#ffc48a");
    const warmWhite = new THREE.Color("#fff4e6");
    const monitor = new THREE.Color("#4c8dff");

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;

      // Depth-weighted scatter: a wide, shallow slab rather than a cube, so
      // the field feels like a room and not a starfield.
      const depth = Math.pow(Math.random(), 0.7);
      positions[i3] = (Math.random() - 0.5) * 96;
      positions[i3 + 1] = (Math.random() - 0.5) * 58;
      positions[i3 + 2] = -depth * 78 + 12;

      seeds[i3] = Math.random();
      seeds[i3 + 1] = Math.random();
      seeds[i3 + 2] = 0.35 + Math.random() * 0.9;

      const roll = Math.random();
      let color;
      if (roll < 0.5) color = ember;
      else if (roll < 0.74) color = emberSoft;
      else if (roll < 0.92) color = warmWhite;
      else color = monitor; // cold spill, used sparingly

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // A few large, near-transparent discs carry the "out of focus" read.
      const isBokeh = Math.random() < 0.22;
      sizes[i] = isBokeh ? 26 + Math.random() * 40 : 5 + Math.random() * 13;
      alphas[i] = isBokeh ? 0.1 + Math.random() * 0.14 : 0.24 + Math.random() * 0.42;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uOpacity: { value: 0 }, // fades up on first frames
        uDrift: { value: reduceMotion ? 0 : 1 },
      },
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- interaction --------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onPointerMove = (event) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    if (!isCoarse && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // ---- resize -------------------------------------------------------------
    const resize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // ---- loop ---------------------------------------------------------------
    const clock = new THREE.Clock();
    let frame = 0;
    let running = true;
    let fade = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      const delta = Math.min(clock.getDelta(), 0.05);

      fade = Math.min(fade + delta * 0.55, 1);
      material.uniforms.uOpacity.value = fade;
      material.uniforms.uTime.value += reduceMotion ? 0 : delta;

      // Damped parallax: the camera drifts toward the pointer, never snaps.
      pointer.x += (target.x - pointer.x) * Math.min(delta * 1.6, 1);
      pointer.y += (target.y - pointer.y) * Math.min(delta * 1.6, 1);
      camera.position.x = pointer.x * 3.6;
      camera.position.y = -pointer.y * 2.2;
      camera.lookAt(0, 0, -10);

      renderer.render(scene, camera);

      // Reduced motion: draw the field once, then stop burning frames.
      if (reduceMotion && fade >= 1) {
        cancelAnimationFrame(frame);
        running = false;
      }
    };
    frame = requestAnimationFrame(render);

    // Stop rendering entirely when the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        running = false;
      } else if (!running && !(reduceMotion && fade >= 1)) {
        running = true;
        clock.getDelta();
        frame = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Stop rendering when the hero has scrolled away.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(frame);
          running = false;
        } else if (!running && !document.hidden && !(reduceMotion && fade >= 1)) {
          running = true;
          clock.getDelta();
          frame = requestAnimationFrame(render);
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(mount);

    // ---- teardown -----------------------------------------------------------
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [count]);

  return <div ref={mountRef} className={`${styles.layer} ${className}`} aria-hidden="true" />;
}
