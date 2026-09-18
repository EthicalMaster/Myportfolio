"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnterInteractive = () => setIsHovering(true);
    const handleMouseLeaveInteractive = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);

    // Observe interactive elements
    const interactiveSelectors = "a, button, [role='button'], input, textarea, [data-cursor-hover]";
    const elements = document.querySelectorAll(interactiveSelectors);
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterInteractive);
      el.addEventListener("mouseleave", handleMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive);
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-accent"
          animate={{
            width: isHovering ? 48 : 8,
            height: isHovering ? 48 : 8,
            opacity: isHovering ? 0.2 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-accent/40"
          animate={{
            width: isHovering ? 64 : 32,
            height: isHovering ? 64 : 32,
            opacity: isHovering ? 0.4 : 0.15,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>
    </>
  );
}
