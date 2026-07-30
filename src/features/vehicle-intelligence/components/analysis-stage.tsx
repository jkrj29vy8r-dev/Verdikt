"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

import { useIsMobile, usePrefersReducedMotion } from "@/hooks";
import { BRAND } from "@/components/three/vehicle-geometry";

import type { AnalysisPhase } from "../analysis";
import { approach } from "./analysis-motion";
import { AnalysisVehicle } from "./analysis-vehicle";

/** Reflective floor height — the wheels rest here at stage scale. */
const GROUND_Y = -1.02;

/** Per-phase camera framing (world space): where the lens sits and what it
 * looks at. Idle holds a wide hero 3/4; scanning dollies in; the reveal pulls
 * back to a 3/4 that shows the exposed front and the flagged flank. */
const CAMERA: Record<
  AnalysisPhase,
  { pos: [number, number, number]; look: [number, number, number] }
> = {
  idle: { pos: [0.8, 0.62, 5.7], look: [0, -0.32, 0] },
  scanning: { pos: [0.15, 0.42, 4.55], look: [0, -0.18, 0] },
  revealing: { pos: [1.55, 0.6, 5.0], look: [0.25, -0.3, 0] },
  complete: { pos: [1.55, 0.6, 5.0], look: [0.25, -0.3, 0] },
};

/**
 * CameraRig — drives the default camera through the phase framings with a
 * pointer-parallax overlay, so the "camera animation" reads as a deliberate
 * cinematic push-in and settle. Snaps under reduced motion.
 */
function CameraRig({ phase }: { phase: AnalysisPhase }) {
  const reduced = usePrefersReducedMotion();
  const { camera, pointer, invalidate } = useThree();
  const look = React.useRef(new THREE.Vector3(0, 0.05, 0));

  React.useEffect(() => {
    invalidate();
  }, [phase, invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const target = CAMERA[phase];
    const px = pointer.x * 0.5;
    const py = pointer.y * 0.3;

    camera.position.x = approach(
      camera.position.x,
      target.pos[0] + px,
      2.5,
      dt,
      reduced,
    );
    camera.position.y = approach(
      camera.position.y,
      target.pos[1] + py,
      2.5,
      dt,
      reduced,
    );
    camera.position.z = approach(
      camera.position.z,
      target.pos[2],
      2.5,
      dt,
      reduced,
    );

    look.current.set(
      approach(look.current.x, target.look[0], 2.5, dt, reduced),
      approach(look.current.y, target.look[1], 2.5, dt, reduced),
      approach(look.current.z, target.look[2], 2.5, dt, reduced),
    );
    camera.lookAt(look.current);
  });

  return null;
}

/**
 * AnalysisStage — the full interactive scene mounted inside `SceneCanvas`.
 *
 * Composes ambient + key + rim lighting and a procedural `Lightformer` studio
 * (the source of the body's clearcoat sheen and the ground reflection — no
 * fetched HDRI, per the 3D references), a `MeshReflectorMaterial` floor
 * (resolution downshifted on mobile), the phase-driven `CameraRig`, and the
 * `AnalysisVehicle`. Pure scene content: all interaction state arrives as the
 * single `phase` prop.
 */
export function AnalysisStage({ phase }: { phase: AnalysisPhase }) {
  const isMobile = useIsMobile();

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />

      {/* Procedural studio environment — reflections without a CDN HDRI. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          color={BRAND.signature}
          intensity={2}
          position={[4, 3, 2]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="rect"
          color={BRAND.signature2}
          intensity={1.6}
          position={[-4, -1, 3]}
          scale={[3, 4, 1]}
        />
        <Lightformer
          form="ring"
          color="#ffffff"
          intensity={0.6}
          position={[0, 5, -4]}
          scale={5}
        />
      </Environment>

      <CameraRig phase={phase} />
      <AnalysisVehicle phase={phase} />

      {/* Reflective ground — grounds the car and doubles the holographic glow. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          resolution={isMobile ? 256 : 1024}
          mixBlur={1}
          blur={isMobile ? [120, 40] : [320, 90]}
          mixStrength={isMobile ? 24 : 40}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#090b10"
          metalness={0.6}
          mirror={0.55}
        />
      </mesh>

      <Sparkles
        count={isMobile ? 24 : 60}
        scale={[8, 4, 4]}
        position={[0, 0.5, 0]}
        size={2}
        speed={0.22}
        opacity={0.4}
        color={BRAND.signature}
      />
    </>
  );
}
