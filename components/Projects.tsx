"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { projects } from "@/data/project";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

/* ─── Per-project scroll stage ────────────────────────────────────────────── */

function ProjectRow({
  project,
  index,
  reversed,
}: {
  project: (typeof projects)[0];
  index: number;
  reversed: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle image parallax — ±20px
  const imageY = useTransform(scrollYProgress, [0, 1], ["-20px", "20px"]);

  const ease = [0.16, 1, 0.3, 1] as const;
  const hasLink = project.github || project.link;
  const href = project.github || project.link || "#";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease }}
      className={`group flex flex-col gap-8 lg:gap-14 items-center
        ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
    >
      {/* Image */}
      <div
        className={`w-full relative rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/8 group-hover:border-white/15 transition-colors duration-500
          ${index === 0 ? "lg:w-[58%] aspect-[16/10]" : "lg:w-[55%] aspect-[4/3]"}`}
      >
        {project.image && (
          <motion.div
            className="absolute -inset-6"
            style={{ y: reduced ? 0 : imageY }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-center grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
            />
          </motion.div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div
        className={`w-full lg:flex-1 flex flex-col justify-center
          ${reversed ? "lg:items-end lg:text-right" : ""}`}
      >
        <span className="text-[11px] font-mono tracking-widest text-zinc-600 mb-4 block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4 leading-tight group-hover:text-accent transition-colors duration-300"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>

        <p className={`text-zinc-500 text-sm leading-relaxed mb-6 max-w-md ${reversed ? "lg:ml-auto" : ""}`}>
          {project.description.length > 160
            ? project.description.substring(0, 160) + "..."
            : project.description}
        </p>

        <div className={`flex flex-wrap gap-2 mb-8 ${reversed ? "lg:justify-end" : ""}`}>
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono tracking-wide text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {hasLink && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] hover:text-white transition-colors duration-300 group/link
              ${reversed ? "lg:ml-auto" : ""}`}
          >
            View Project
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function Projects() {
  const sectionRef = useRef(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const featuredProjects = projects.filter((p) => p.featured);
  if (featuredProjects.length === 0) return null;

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-padding relative flex justify-center w-full"
    >
      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-20 lg:gap-28">
        {/* Section Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-left"
        >
          <span className="text-xs font-mono tracking-[0.2em] text-accent uppercase mb-6 block">
            02. Projects
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Selected Works
          </h2>
        </motion.header>

        {/* Projects — alternating compositions */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {featuredProjects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              reversed={i % 2 !== 0}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-start pt-8 border-t border-white/[0.06]"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 text-xs font-semibold text-zinc-500 uppercase tracking-[0.15em] hover:text-white transition-colors duration-300"
          >
            View all projects on GitHub
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
