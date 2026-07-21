"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import {
  dagEdges,
  dagNodes,
  dqAudit,
  heatmap,
  perfSeries,
  projects,
  radar,
  skillTags,
  stats,
} from "@/lib/profile";
import styles from "./Dashboard.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ radar -- */

const RADAR_SIZE = 340;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 118;

function radarPoint(index, value, total) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (RADAR_RADIUS * value) / 100;
  return [RADAR_CENTER + r * Math.cos(angle), RADAR_CENTER + r * Math.sin(angle)];
}

function Radar() {
  const rings = [25, 50, 75, 100];
  const total = radar.length;

  const dataPoints = radar.map((d, i) => radarPoint(i, d.value, total));
  const dataPath = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg
      className={styles.radarSvg}
      viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
      role="img"
      aria-label="Skill domain radar chart"
    >
      {rings.map((ring) => (
        <polygon
          key={ring}
          className={styles.radarRing}
          points={radar.map((_, i) => radarPoint(i, ring, total).join(",")).join(" ")}
        />
      ))}
      {radar.map((_, i) => {
        const [x, y] = radarPoint(i, 100, total);
        return (
          <line
            key={i}
            className={styles.radarSpoke}
            x1={RADAR_CENTER}
            y1={RADAR_CENTER}
            x2={x}
            y2={y}
          />
        );
      })}
      <polygon className={`${styles.radarArea} radar-area`} points={dataPath} />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} className={`${styles.radarDot} radar-dot`} cx={x} cy={y} r="4" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------ perf chart -- */

const PERF_W = 560;
const PERF_H = 220;
const PERF_PAD = 34;

function perfPath(values, max) {
  const step = (PERF_W - PERF_PAD * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = PERF_PAD + i * step;
      const y = PERF_H - PERF_PAD - ((PERF_H - PERF_PAD * 2) * v) / max;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

/* -------------------------------------------------------------- component -- */

const TABS = [
  { id: "dag", label: "DAG Viewer" },
  { id: "dq", label: "Data Quality Audit" },
  { id: "perf", label: "Performance Tuning" },
];

export default function Dashboard() {
  const rootRef = useRef(null);
  const [activeTags, setActiveTags] = useState([]);
  const [tab, setTab] = useState("dag");

  const visibleProjects = useMemo(() => {
    if (activeTags.length === 0) return projects;
    return projects.filter((project) =>
      activeTags.every((tag) => project.tags.includes(tag))
    );
  }, [activeTags]);

  const toggleTag = (tag) => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    );
  };

  const perfMax = Math.max(...perfSeries.legacy) * 1.15;

  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.utils.toArray(`.${styles.heatFill}`).forEach((el) => {
          gsap.set(el, { scaleY: Number(el.dataset.level) / 100 });
        });
        gsap.utils.toArray(`.${styles.statValue}`).forEach((el) => {
          el.textContent = Number(el.dataset.final).toFixed(Number(el.dataset.decimals || 0));
        });
        return;
      }

      gsap.utils.toArray(`.${styles.statValue}`).forEach((el) => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: parseFloat(el.dataset.final),
          duration: 1.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = counter.value.toFixed(Number(el.dataset.decimals || 0));
          },
        });
      });

      // Radar blooms from the centre; dots pop after.
      gsap.fromTo(
        ".radar-area",
        { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.radarCard}`, start: "top 80%", once: true },
        }
      );
      gsap.fromTo(
        ".radar-dot",
        { scale: 0, opacity: 0, transformOrigin: "center" },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: `.${styles.radarCard}`, start: "top 80%", once: true },
        }
      );

      // Heatmap bars rise with their value counters.
      gsap.utils.toArray(`.${styles.heatFill}`).forEach((el, index) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: Number(el.dataset.level) / 100,
            duration: 1.3,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: `.${styles.heatCard}`, start: "top 80%", once: true },
          }
        );
      });

      gsap.utils.toArray(`.${styles.reveal}`).forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          }
        );
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  /* DAG layout: tiers left→right, nodes spread vertically inside a tier. */
  const dagLayout = useMemo(() => {
    const tiers = {};
    dagNodes.forEach((node) => {
      (tiers[node.tier] = tiers[node.tier] || []).push(node);
    });
    const width = 560;
    const height = 230;
    const positions = {};
    const tierCount = Object.keys(tiers).length;
    Object.entries(tiers).forEach(([tier, nodes]) => {
      const x = 70 + (Number(tier) * (width - 140)) / (tierCount - 1);
      nodes.forEach((node, i) => {
        const y = ((i + 1) * height) / (nodes.length + 1);
        positions[node.id] = { x, y };
      });
    });
    return { positions, width, height };
  }, []);

  return (
    <section id="capabilities" ref={rootRef} className={styles.section} aria-label="Skills dashboard">
      <div className={styles.inner}>
        <header className={`${styles.header} ${styles.reveal}`}>
          <p className={styles.eyebrow}>Capabilities</p>
          <h2 className={styles.heading}>The stack, measured.</h2>
        </header>

        <div className={`${styles.statStrip} ${styles.reveal}`}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <p className={styles.statNumber}>
                <span
                  className={styles.statValue}
                  data-final={stat.value}
                  data-decimals={stat.decimals || 0}
                >
                  0
                </span>
                <span className={styles.statSuffix}>{stat.suffix}</span>
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Row 1: radar + heatmap */}
        <div className={styles.chartRow}>
          <div className={`${styles.card} ${styles.radarCard} ${styles.reveal}`}>
            <h3 className={styles.cardTitle}>Skill Domain Focus</h3>
            <div className={styles.radarWrap}>
              <Radar />
            </div>
            <ul className={styles.radarLegend}>
              {radar.map((d) => (
                <li key={d.axis} className={styles.radarLegendItem}>
                  <span className={styles.radarLegendAxis}>{d.axis}</span>
                  <span className={styles.radarLegendNote}>{d.note}</span>
                  <span className={styles.radarLegendValue}>{d.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.card} ${styles.heatCard} ${styles.reveal}`}>
            <h3 className={styles.cardTitle}>Active Tech Stack Heatmap</h3>
            <div className={styles.heatChart}>
              {heatmap.map((item) => (
                <div key={item.name} className={styles.heatCol}>
                  <span className={styles.heatValue}>{item.value}</span>
                  <div className={styles.heatTrack}>
                    <span
                      className={styles.heatFill}
                      data-level={item.value}
                      style={{ transform: "scaleY(0)" }}
                    />
                  </div>
                  <span className={styles.heatName}>{item.name}</span>
                  {item.note ? <span className={styles.heatNote}>{item.note}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: interactive project & skill filter */}
        <div className={`${styles.card} ${styles.reveal}`}>
          <div className={styles.filterHead}>
            <h3 className={styles.cardTitle}>Interactive Project &amp; Skill Filter</h3>
            {activeTags.length > 0 ? (
              <button
                type="button"
                className={styles.filterClear}
                onClick={() => setActiveTags([])}
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className={styles.tagRow} role="group" aria-label="Filter projects by skill">
            {skillTags.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`${styles.tag} ${active ? styles.tagActive : ""}`}
                  aria-pressed={active}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className={styles.projectGrid}>
            {visibleProjects.map((project) => (
              <article key={project.title} className={styles.project}>
                <p className={styles.projectOrg}>{project.org}</p>
                <h4 className={styles.projectTitle}>{project.title}</h4>
                <p className={styles.projectDesc}>{project.description}</p>
                <div className={styles.projectTags}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${styles.projectTag} ${
                        activeTags.includes(tag) ? styles.projectTagHit : ""
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
            {visibleProjects.length === 0 ? (
              <p className={styles.projectEmpty}>
                No single project uses that whole combination — try fewer tags.
              </p>
            ) : null}
          </div>
        </div>

        {/* Row 3: pipeline & quality viewer */}
        <div className={`${styles.card} ${styles.reveal}`}>
          <h3 className={styles.cardTitle}>Data Pipeline &amp; Quality Viewer</h3>

          <div className={styles.tabRow} role="tablist" aria-label="Pipeline views">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`${styles.tabButton} ${tab === t.id ? styles.tabButtonActive : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "dag" ? (
            <div className={styles.panel}>
              <svg
                className={styles.dagSvg}
                viewBox={`0 0 ${dagLayout.width} ${dagLayout.height}`}
                role="img"
                aria-label="Airflow DAG dependency graph"
              >
                {dagEdges.map(([from, to]) => {
                  const a = dagLayout.positions[from];
                  const b = dagLayout.positions[to];
                  const mx = (a.x + b.x) / 2;
                  return (
                    <path
                      key={`${from}-${to}`}
                      className={styles.dagEdge}
                      d={`M${a.x + 44},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x - 44},${b.y}`}
                    />
                  );
                })}
                {dagNodes.map((node) => {
                  const p = dagLayout.positions[node.id];
                  return (
                    <g key={node.id}>
                      <rect
                        className={styles.dagNode}
                        x={p.x - 44}
                        y={p.y - 15}
                        width="88"
                        height="30"
                        rx="4"
                      />
                      <text className={styles.dagLabel} x={p.x} y={p.y + 4} textAnchor="middle">
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <p className={styles.panelNote}>
                Airflow dependency graph — the shape of a nightly banking load: extract fans out
                to validation and transform, reconciles, then publishes.
              </p>
            </div>
          ) : null}

          {tab === "dq" ? (
            <div className={styles.panel}>
              <table className={styles.dqTable}>
                <thead>
                  <tr>
                    <th scope="col">Check</th>
                    <th scope="col">Scope</th>
                    <th scope="col">Result</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {dqAudit.map((row) => (
                    <tr key={row.check}>
                      <td>{row.check}</td>
                      <td className={styles.dqScope}>{row.scope}</td>
                      <td>
                        <span
                          className={`${styles.dqBadge} ${
                            row.result === "Live" ? styles.dqBadgeLive : ""
                          }`}
                        >
                          {row.result}
                        </span>
                      </td>
                      <td className={styles.dqValue}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {tab === "perf" ? (
            <div className={styles.panel}>
              <svg
                className={styles.perfSvg}
                viewBox={`0 0 ${PERF_W} ${PERF_H}`}
                role="img"
                aria-label="Legacy versus optimized query runtimes"
              >
                {[0.25, 0.5, 0.75, 1].map((f) => (
                  <line
                    key={f}
                    className={styles.perfGrid}
                    x1={PERF_PAD}
                    x2={PERF_W - PERF_PAD}
                    y1={PERF_H - PERF_PAD - (PERF_H - PERF_PAD * 2) * f}
                    y2={PERF_H - PERF_PAD - (PERF_H - PERF_PAD * 2) * f}
                  />
                ))}
                <path className={styles.perfLegacy} d={perfPath(perfSeries.legacy, perfMax)} />
                <path
                  className={styles.perfOptimized}
                  d={perfPath(perfSeries.optimized, perfMax)}
                />
                {perfSeries.labels.map((label, i) => {
                  const x =
                    PERF_PAD + (i * (PERF_W - PERF_PAD * 2)) / (perfSeries.labels.length - 1);
                  return (
                    <text
                      key={label}
                      className={styles.perfLabel}
                      x={x}
                      y={PERF_H - 10}
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
              <div className={styles.perfLegend}>
                <span className={styles.perfKeyLegacy}>Legacy Teradata</span>
                <span className={styles.perfKeyOptimized}>Optimized Spark / Tez</span>
                <span className={styles.perfKeyNote}>runtime, minutes — six workloads</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
