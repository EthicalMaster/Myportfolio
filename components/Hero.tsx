"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll-based parallax and scaling effects
  const y = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 250]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, shouldReduceMotion ? 1 : 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle minimal gradient mask background */}
      <div 
        className="absolute inset-0 z-0 bg-[url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)] bg-cover bg-center opacity-[0.07] grayscale"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
        }}
      />

      {/* Main Content Area */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full pt-20"
        style={{ y, opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10 mb-8">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              System / Developer / Engineer
            </span>
          </div>
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Turning Data<br />
            Into <span className="gradient-text-accent pr-2">Insight.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-white tracking-wide">Explore Work</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
          </a>
          <a
            href="#about"
            className="group inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300"
          >
            <span className="tracking-wide relative">
              Discover More
              <span className="absolute left-0 right-0 -bottom-1 h-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </span>
            <ArrowDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform duration-300 group-hover:translate-y-[3px]" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="mono text-text-muted text-[10px] tracking-[0.3em] uppercase">
          Initiate Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
