"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, User, Briefcase, Mail, Home } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Projects", href: "#projects", icon: Briefcase },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(NAV_ITEMS[0].label);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => ({
        id: item.href.substring(1),
        label: item.label,
      }));
      
      const scrollPosition = window.scrollY + 200; // offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(sections[i].label);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop & Mobile Floating Island */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          className={`pointer-events-auto flex items-center justify-between gap-12 md:gap-16 px-10 py-3.5 rounded-full transition-all duration-500 w-fit ${
            isScrolled ? "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl" : "bg-transparent border border-transparent"
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={() => setActiveTab("Home")}
            className="flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>TS</span>
            </div>
          </a>

          {/* Desktop Nav - Tubelight Effect */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveTab(item.label)}
                  className={`relative px-5 py-2 rounded-full text-xs font-medium transition-colors ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="tubelight"
                      className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                        <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </a>
              );
            })}
            
            <a
              href="#contact"
              onClick={() => setActiveTab("Contact")}
              className="ml-4 inline-flex items-center justify-center w-fit flex-none px-4 py-1.5 whitespace-nowrap rounded-full text-xs font-medium border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </motion.nav>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV_ITEMS.map((item, i) => {
              const isActive = activeTab === item.label;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.label);
                    setIsMobileOpen(false);
                  }}
                  className={`text-4xl font-bold flex items-center gap-4 transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-text-secondary hover:text-white"
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <item.icon className={`w-8 h-8 ${isActive ? "text-accent" : "text-text-secondary"}`} />
                  {item.label}
                </motion.a>
              )
            })}

            <motion.a
              href="#contact"
              onClick={() => {
                setActiveTab("Contact");
                setIsMobileOpen(false);
              }}
              className="mt-8 px-8 py-4 rounded-full text-lg font-bold bg-white text-black flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Let's Talk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

