"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshDistortMaterial,
  Icosahedron,
  Sparkles,
} from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Brand colors for the WebGL layer.
 *
 * WebGL can't read CSS custom properties, so these hexes mirror the OKLCH
 * signature tokens in `globals.css`. Keep them in sync when the palette moves.
 */
const BRAND = {
  signature: "#3b82f6",
  signature2: "#8b5cf6",
} as const;

/**
 * VerdiktCore — the animated centerpiece of the hero.
 *
 * A slowly-rotating distorted icosahedron with a glossy transmission-like
 * material, floating in an environment that provides realistic reflections,
 * surrounded by drifting sparkles. Pure scene content — mount it inside a
 * <SceneCanvas>. Rotation pauses automatically when the canvas idles under
 * reduced-motion (frameloop="demand").
 */
export function VerdiktCore() {
  const meshRef = React.useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x += delta * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} />
      <pointLight
        position={[-6, -4, -2]}
        intensity={40}
        color={BRAND.signature2}
      />

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <Icosahedron ref={meshRef} args={[1.5, 8]}>
          <MeshDistortMaterial
            color={BRAND.signature}
            emissive={BRAND.signature2}
            emissiveIntensity={0.15}
            roughness={0.12}
            metalness={0.9}
            distort={0.35}
            speed={1.6}
          />
        </Icosahedron>
      </Float>

      <Sparkles
        count={60}
        scale={8}
        size={2}
        speed={0.3}
        opacity={0.5}
        color={BRAND.signature}
      />

      {/* Studio HDRI for reflections — the source of the premium sheen. */}
      <Environment preset="city" />
    </>
  );
}
