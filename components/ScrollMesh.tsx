"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
 * ScrollScene — the single 3D background for the entire portfolio.
 *
 * Visual: a large, dark, translucent sculptural torus-knot with subtle
 * cyan/blue reflections, partially cropped by the viewport. Slow rotation
 * driven by page scroll progress.
 *
 * Replaces the old SVG constellation + blur-blob system with ONE coherent
 * WebGL visual environment.
 * ───────────────────────────────────────────────────────────────────────── */

/** Bridges framer-motion scroll progress into the R3F render loop */
function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => progress.set(v));
    return unsubscribe;
  }, [scrollYProgress, progress]);

  return progress;
}

/* ── The sculptural form ──────────────────────────────────────────────────── */
function Sculpture({ scrollProgress }: { scrollProgress: { get(): number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Custom shader material for the dark translucent look with cyan edge highlights
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uCyan: { value: new THREE.Color("#00f0ff") },
        uDark: { value: new THREE.Color("#050510") },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uScroll;
        uniform vec3 uCyan;
        uniform vec3 uDark;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          // Fresnel edge glow — stronger at glancing angles
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

          // Mix dark base with cyan edge highlight
          vec3 color = mix(uDark, uCyan, fresnel * 0.6);

          // Subtle pulsing based on scroll and time
          float pulse = 0.5 + 0.5 * sin(uTime * 0.3 + uScroll * 6.28);
          float alpha = 0.06 + fresnel * 0.25 + pulse * 0.02;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scroll = scrollProgress.get();
    const t = state.clock.elapsedTime;

    // Slow organic rotation driven primarily by scroll
    meshRef.current.rotation.x = scroll * Math.PI * 0.6 + t * 0.02;
    meshRef.current.rotation.y = scroll * Math.PI * 0.8 + t * 0.015;
    meshRef.current.rotation.z = scroll * Math.PI * 0.3;

    // Subtle scale breathing
    const s = 1 + Math.sin(t * 0.2) * 0.02;
    meshRef.current.scale.set(s, s, s);

    // Update shader uniforms
    material.uniforms.uTime.value = t;
    material.uniforms.uScroll.value = scroll;
  });

  // Scale the geometry relative to the viewport so it always extends beyond edges
  const scale = Math.max(viewport.width, viewport.height) * 0.55;

  return (
    <mesh ref={meshRef} material={material} position={[0, 0, 0]}>
      <torusKnotGeometry args={[scale, scale * 0.35, 256, 64, 2, 3]} />
    </mesh>
  );
}

/* ── A secondary, larger form for depth ───────────────────────────────────── */
function DepthRing({ scrollProgress }: { scrollProgress: { get(): number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00f0ff"),
      transparent: true,
      opacity: 0.03,
      wireframe: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scroll = scrollProgress.get();
    const t = state.clock.elapsedTime;

    meshRef.current.rotation.x = scroll * Math.PI * -0.4 + t * 0.008;
    meshRef.current.rotation.y = scroll * Math.PI * 0.5 + t * 0.01;
  });

  const scale = Math.max(viewport.width, viewport.height) * 0.8;

  return (
    <mesh ref={meshRef} material={material} position={[0, 0, -2]}>
      <torusGeometry args={[scale, scale * 0.06, 32, 128]} />
    </mesh>
  );
}

/* ── Main exported component ──────────────────────────────────────────────── */
export default function ScrollMesh() {
  const shouldReduceMotion = useReducedMotion();
  const scrollProgress = useScrollProgress();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ isolation: "isolate" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Sculpture scrollProgress={scrollProgress} />
        <DepthRing scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
