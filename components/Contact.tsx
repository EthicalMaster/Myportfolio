"use client";

import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [shouldReduceMotion ? 1 : 0.95, 1]);

  return (
    <section
      ref={containerRef}
      id="contact"
      className="section-padding relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div 
        className="max-w-5xl mx-auto relative z-10 w-full flex flex-col items-center justify-center"
        style={{ scale }}
      >
        
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md mb-12"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Available For Projects
          </span>
        </motion.div>

        {/* Huge Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-white block mb-2 md:mb-4">Let's work</span>
            <span className="text-zinc-500 block">together</span>
          </h2>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=saifeetaher5@gmail.com"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md overflow-hidden shadow-2xl"
            style={{ borderRadius: "9999px" }}
          >
            <motion.div 
              className="flex items-center justify-center overflow-hidden h-[80px]"
              initial={false}
              animate={{ 
                width: isHovered ? 180 : 80,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-center w-full h-full relative">
                <motion.span 
                  className="text-white font-semibold absolute left-6 tracking-wide text-sm whitespace-nowrap"
                  initial={false}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -20
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Email Me
                </motion.span>
                <motion.div
                  className="absolute"
                  initial={false}
                  animate={{
                    x: isHovered ? 45 : 0,
                    rotate: isHovered ? 45 : 0
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ArrowUpRight className="w-8 h-8 text-white" strokeWidth={1.5} />
                </motion.div>
              </div>
            </motion.div>
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
}
