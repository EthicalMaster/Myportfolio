"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import {
  education,
  skillCategories,
  certifications,
  currentlyBuilding,
  interests,
  socialLinks,
} from "@/data/about";

/* ─── Shared ──────────────────────────────────────────────────────────────── */

function useStage(margin: any = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function About() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const buildingGlow = useTransform(scrollYProgress, [0.4, 0.6], [0.05, 0.45]);

  const identity = useStage("-60px");
  const narrative = useStage("-100px");
  const techField = useStage("-80px");
  const statement = useStage("-100px");
  const certsStage = useStage();
  const closing = useStage("-80px");

  return (
    <section
      ref={section}
      id="about"
      className="section-padding relative flex justify-center w-full"
    >
      <div className="w-full max-w-5xl relative z-10">

        {/* ═══════════════════════════════════════════════════════════════
            COMPOSITION 1 — IDENTITY (PRESERVED)
            Large typography + portrait. Wide asymmetric two-column.
        ═══════════════════════════════════════════════════════════════ */}
        <div
          ref={identity.ref}
          className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-20 items-center mb-40 md:mb-52"
        >
          {/* Text — left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={identity.inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={identity.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="text-xs font-mono tracking-[0.2em] text-accent uppercase mb-8 block"
            >
              01. Background
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={identity.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.08 }}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-white leading-[0.92] mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hi, I'm{" "}
              <span className="text-accent">Taher</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={identity.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.16 }}
              className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-5 max-w-lg"
            >
              Computer Science student focused on Data Science, AI,
              and building practical software.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={identity.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.24 }}
              className="text-sm text-zinc-600 leading-relaxed max-w-md"
            >
              Currently pursuing two data-science-focused undergraduate
              programs while actively developing my skills through hands-on
              projects and technical experimentation.
            </motion.p>

            {/* Social links */}
            {(socialLinks.instagram || socialLinks.linkedin) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={identity.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.32 }}
                className="flex items-center gap-6 mt-8"
              >
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex items-center gap-2 text-zinc-600 hover:text-accent transition-colors duration-300"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">Instagram</span>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="flex items-center gap-2 text-zinc-600 hover:text-accent transition-colors duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Portrait — right, visual anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={identity.inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease, delay: 0.15 }}
            className="relative w-full max-w-xs lg:max-w-sm mx-auto lg:mx-0 order-first lg:order-last"
          >
            <motion.div style={{ y: reduced ? 0 : portraitY }}>
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:24px_24px]" />
                <Image
                  src="/portrait.jpg"
                  alt="Taher Saifee"
                  fill
                  sizes="(max-width: 768px) 320px, 384px"
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 z-10"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20">
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white" />
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">Status: Building</span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">2026</span>
                </div>
              </div>
              <div className="absolute -inset-4 bg-accent/5 blur-2xl -z-10 rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════

            EVERYTHING BELOW IS THE REDESIGNED EDITORIAL EXPERIENCE.

        ═══════════════════════════════════════════════════════════════ */}

        {/* Visual transition — thin rule */}
        <div className="mb-32 md:mb-40">
          <div className="h-px w-16 bg-white/10" />
        </div>

        {/* ─────────────────────────────────────────────────────────────
            NARRATIVE — Education as large editorial typography.
            No cards. No containers. Scale and whitespace do the work.
            Right-offset on desktop for asymmetry.
        ───────────────────────────────────────────────────────────── */}
        <div ref={narrative.ref} className="mb-40 md:mb-56 lg:pl-[12%]">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 45 }}
              animate={narrative.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: i * 0.18 }}
              className={i > 0 ? "mt-20 md:mt-28" : ""}
            >
              {/* Large degree title — the visual */}
              <h3
                className="text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {edu.title}
              </h3>

              {/* Institution + period on one line (desktop) */}
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-6 mb-3">
                <span className="text-sm text-accent/50">
                  {edu.institution}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-700 mt-1 md:mt-0">
                  {edu.period}
                </span>
              </div>

              {/* Brief description — intentionally understated */}
              <p className="text-sm text-zinc-600 leading-relaxed max-w-md">
                {edu.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TYPOGRAPHIC FIELD — Skills as flowing words across the
            viewport width. No pills, no badges, no categories as UI.
            The words themselves are the composition.
        ───────────────────────────────────────────────────────────── */}
        <div ref={techField.ref} className="mb-40 md:mb-56">
          <motion.div
            initial={{ opacity: 0 }}
            animate={techField.inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, ease }}
            className="flex flex-wrap gap-x-5 gap-y-3 md:gap-x-8 md:gap-y-4 items-baseline"
          >
            {skillCategories.flatMap((cat) => cat.items).map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, y: 15 }}
                animate={techField.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.025 }}
                className={`cursor-default transition-colors duration-400
                  ${i < 6
                    ? "text-lg md:text-xl lg:text-2xl text-zinc-400 hover:text-white font-medium"
                    : i < 12
                      ? "text-base md:text-lg text-zinc-500 hover:text-zinc-200"
                      : "text-sm md:text-base text-zinc-600 hover:text-zinc-300"
                  }`}
                style={{ fontFamily: i < 6 ? "var(--font-display)" : undefined }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STATEMENT — What I'm building.
            Large typography. Centered visual moment.
            The ONE elevated area in the entire About.
        ───────────────────────────────────────────────────────────── */}
        <div ref={statement.ref} className="mb-40 md:mb-56 relative">
          {/* Scroll-linked ambient glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none"
            style={{ opacity: reduced ? 0.15 : buildingGlow }}
          />

          <div className="relative z-10 text-center lg:text-left lg:max-w-3xl lg:mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={statement.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-3 mb-10 justify-center lg:justify-start"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.15em] text-accent/60 uppercase">
                Currently
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 50 }}
              animate={statement.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.0] mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {currentlyBuilding.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={statement.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {currentlyBuilding.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={statement.inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start items-baseline"
            >
              {currentlyBuilding.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-wide text-zinc-700"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] font-mono tracking-widest text-zinc-800 ml-2">
                {currentlyBuilding.year}
              </span>
            </motion.div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CERTIFICATIONS — hidden when empty. Minimal when visible.
        ───────────────────────────────────────────────────────────── */}
        {certifications.length > 0 && (
          <div ref={certsStage.ref} className="mb-40 md:mb-56 lg:pl-[8%]">
            {certifications.map((cert, i) => (
              <motion.a
                key={i}
                href={cert.credentialUrl || undefined}
                target={cert.credentialUrl ? "_blank" : undefined}
                rel={cert.credentialUrl ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 25 }}
                animate={certsStage.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className={`flex items-baseline gap-6 py-5 border-b border-white/[0.05] group
                  ${cert.credentialUrl ? "cursor-pointer" : "cursor-default"}
                  ${i === 0 ? "border-t" : ""}`}
              >
                <span className="text-white text-base font-medium group-hover:text-accent transition-colors duration-300">
                  {cert.title}
                </span>
                <span className="text-zinc-700 text-xs">
                  {cert.issuer}
                </span>
                <span className="text-zinc-800 text-[10px] font-mono tracking-widest ml-auto shrink-0">
                  {cert.year}
                </span>
                {cert.credentialUrl && (
                  <ArrowUpRight className="w-3 h-3 text-zinc-700 group-hover:text-accent shrink-0 transition-colors duration-300" />
                )}
              </motion.a>
            ))}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            CLOSING — Interests as expressive text + Social as
            discoverable links. Wide split on desktop.
        ───────────────────────────────────────────────────────────── */}
        <div
          ref={closing.ref}
          className="flex flex-col lg:flex-row lg:justify-between gap-20 lg:gap-32"
        >
          {/* Interests — flowing, expressive */}
          <div className="flex-1">
            {interests.map((item, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={closing.inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: i * 0.12 }}
                className="text-xl md:text-2xl text-zinc-600 font-medium leading-snug mb-3 hover:text-zinc-300 transition-colors duration-400 cursor-default"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
