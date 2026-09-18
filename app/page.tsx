"use client";

import { useState, useCallback } from "react";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollMesh from "@/components/ScrollMesh";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* Intro loader */}
      <Loader onComplete={handleLoadComplete} />

      {/* Custom cursor (desktop only) */}
      {isLoaded && <CustomCursor />}

      {/* Main content */}
      {isLoaded && (
        <SmoothScroll>
          {/* 3D background environment */}
          <ScrollMesh />

          <Navbar />
          <main className="relative">
            <Hero />

            {/* Divider */}
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <About />

            {/* Divider */}
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Projects />

            {/* Divider */}
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Contact />
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}