"use client";

import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();

  // Parallax effect for the entire footer content
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Moves the footer content up slightly as it comes into view, creating depth
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [100, 0]);

  return (
    <footer
      ref={containerRef}
      className="relative z-10 pt-32 pb-12 lg:pt-48 lg:pb-16 overflow-hidden border-t border-white/5"
    >
      {/* Cinematic Atmospheric Veil — pushes the 3D background back with subtle depth-of-field */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#050505]/95 backdrop-blur-[6px] pointer-events-none -z-20" />

      {/* Ambient background glow — visually grounds the bottom of the page */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-[100%] blur-[120px] pointer-events-none -z-10" />

      <motion.div
        style={{ y }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col h-full relative z-10"
      >
        {/* Main Footer Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 lg:mb-32 gap-16">
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-mono tracking-[0.2em] text-accent uppercase mb-8 block">
              Thanks for scrolling
            </span>
            <h2
              className="text-6xl md:text-[6rem] lg:text-[9rem] font-bold text-white tracking-tighter leading-[0.85]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TAHER
              <br />
              SAIFEE.
            </h2>
          </motion.div>

          {/* Back to top — Interactive Element */}
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex self-start md:self-auto"
          >
            <a
              href="#hero"
              className="group flex items-center gap-4 lg:gap-6 text-zinc-500 hover:text-white transition-colors duration-400"
              aria-label="Back to top"
            >
              <span className="text-xs font-mono tracking-[0.2em] uppercase">
                Back to top
              </span>
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-full border border-white/10 flex items-center justify-center overflow-hidden bg-white/[0.02] group-hover:border-accent/30 transition-colors duration-400">
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-400" />
                
                {/* Default icon slides up and out */}
                <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-y-10 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                
                {/* Cyan icon slides up and in */}
                <ArrowUp className="w-4 h-4 lg:w-5 lg:h-5 absolute translate-y-10 group-hover:translate-y-0 text-accent transition-transform duration-500 ease-[0.16,1,0.3,1]" />
              </div>
            </a>
          </motion.div>
        </div>

        {/* Supporting Information Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-white/5"
        >
          <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
            © {new Date().getFullYear()} — All Rights Reserved
          </span>

          <span className="text-[10px] font-mono tracking-widest text-zinc-700 uppercase">
            Engineered w/ Next.js & Framer
          </span>
        </motion.div>
      </motion.div>
    </footer>
  );
}
