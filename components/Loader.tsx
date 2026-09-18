"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("reveal"), 400);
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1400);
          return 100;
        }
        const increment = prev < 60 ? Math.random() * 5 : prev < 90 ? Math.random() * 2 : 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-bg-primary overflow-hidden"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
        >
          {/* Abstract Geometric Core */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-border opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner dynamic shape */}
            <motion.div
              className="absolute w-32 h-32 border border-accent/40 rounded-full"
              animate={phase === "reveal" ? {
                scale: [1, 0, 20],
                opacity: [1, 1, 0],
                borderWidth: ["1px", "4px", "0px"]
              } : {
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180]
              }}
              transition={phase === "reveal" ? {
                duration: 1,
                ease: [0.87, 0, 0.13, 1]
              } : {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Core glowing dot */}
            <motion.div
              className="absolute w-2 h-2 bg-accent rounded-full shadow-[0_0_20px_4px_rgba(0,240,255,0.5)]"
              animate={phase === "reveal" ? {
                scale: 0,
                opacity: 0
              } : {
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Minimalist Progress Line */}
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-4"
            animate={phase === "reveal" ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-accent"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            <div className="mono text-[10px] tracking-[0.2em] text-text-muted">
              INITIALIZING {Math.floor(progress).toString().padStart(3, '0')}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
