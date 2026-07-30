"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Edges,
  Environment,
  Float,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

import { useIsMobile } from "@/hooks";

/**
 * WebGL can't read CSS custom properties — these hexes mirror the OKLCH
 * signature tokens in `globals.css`. Keep them in sync when the palette moves.
 */
const BRAND = {
  signature: "#3b82f6",
  signature2: "#8b5cf6",
  obsidian: "#0b0d12",
} as const;

/**
 * Builds a low-poly, faceted vehicle side-profile as a closed 2D curve, then
 * extrudes it into a solid. This is an ORIGINAL silhouette authored for
 * Verdikt — hand-plotted control points, not a scan or import of any real
 * make/model — so it carries zero licensing risk (see
 * `references/models/README.md`: procedural over sourced, always). It reads as
 * "a car" through silhouette alone: a raked windshield, a fastback roofline,
 * and a low, wide stance, faceted to match the brand mark's diamond geometry
 * rather than aiming for photorealism.
 */
function buildBodyGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  // Profile plotted in a 2D plane (x: length, y: height), nose at +x.
  shape.moveTo(-1.85, 0.08); // rear bumper, low
  shape.lineTo(-1.7, 0.32); // rear valance
  shape.quadraticCurveTo(-1.55, 0.62, -1.15, 0.66); // deck lid
  shape.lineTo(-0.55, 0.72); // fastback roofline start
  shape.quadraticCurveTo(0.05, 0.98, 0.55, 0.7); // roof apex → windshield header
  shape.lineTo(0.95, 0.4); // raked windshield
  shape.quadraticCurveTo(1.15, 0.28, 1.55, 0.24); // hood
  shape.lineTo(1.85, 0.1); // front bumper, low nose
  shape.quadraticCurveTo(1.9, 0.02, 1.8, -0.02); // nose tip facet
  shape.lineTo(-1.75, -0.02); // rocker / underbody, flat and low
  shape.lineTo(-1.85, 0.08); // close

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.05,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 1,
    curveSegments: 8,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function buildWheelGeometry(): THREE.CylinderGeometry {
  return new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
}

// z-offsets stay within the body's extrude depth (1.05, half = 0.525) so the
// wheels sit flush against the flanks rather than poking out disconnected.
const WHEEL_POSITIONS: readonly [number, number, number][] = [
  [-1.1, -0.3, 0.42],
  [-1.1, -0.3, -0.42],
  [1.05, -0.3, 0.42],
  [1.05, -0.3, -0.42],
];

/**
 * VehicleSilhouette — the hero's centerpiece.
 *
 * A faceted body (deep obsidian, glass-clearcoat) wrapped in a glowing
 * holographic edge shell, wheels rendered as simple emissive rings, a slow
 * vertical "analysis" scan plane, and drifting data-point sparkles. Rotation
 * and the scan sweep pause automatically when the canvas idles under
 * reduced-motion (the parent Canvas switches to a demand frameloop).
 */
export function VehicleSilhouette() {
  const bodyRef = React.useRef<THREE.Mesh>(null);
  const scanRef = React.useRef<THREE.Mesh>(null);
  const rimLightRef = React.useRef<THREE.PointLight>(null);
  const isMobile = useIsMobile();
  const { pointer } = useThree();

  const bodyGeometry = React.useMemo(() => buildBodyGeometry(), []);
  const wheelGeometry = React.useMemo(() => buildWheelGeometry(), []);

  useFrame((state, delta) => {
    // Gentle continuous rotation, independent of pointer-driven parallax
    // applied to the parent group in HeroScene.
    if (bodyRef.current) {
      bodyRef.current.rotation.y += delta * 0.1;
    }

    // Vertical "AI analysis" scan sweep across the body.
    if (scanRef.current) {
      const t = (state.clock.elapsedTime * 0.35) % 1;
      scanRef.current.position.y = -0.9 + t * 1.8;
      const material = scanRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.35 * Math.sin(t * Math.PI);
    }

    // Dynamic lighting: the rim light drifts and shifts hue between the two
    // signature tones, and eases toward the cursor for a "light that notices
    // you" feel.
    if (rimLightRef.current) {
      const hue = 0.62 + Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
      rimLightRef.current.color.setHSL(hue, 0.75, 0.6);
      rimLightRef.current.position.x = THREE.MathUtils.lerp(
        rimLightRef.current.position.x,
        -3 + pointer.x * 2,
        0.05,
      );
      rimLightRef.current.position.y = THREE.MathUtils.lerp(
        rimLightRef.current.position.y,
        1.5 + pointer.y * 1.5,
        0.05,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight
        ref={rimLightRef}
        position={[-3, 1.5, -2]}
        intensity={3}
        color={BRAND.signature2}
      />

      {/*
       * Procedural studio environment — the source of the clearcoat's premium
       * sheen. Built from virtual light shapes (`Lightformer`) rather than a
       * fetched HDRI: zero network dependency (an `Environment preset` pulls a
       * ~1MB file from a third-party CDN on every load — a real reliability
       * and performance liability for a hero, and it reflected a generic city
       * rooftop instead of our own palette). Baked once (`frames={1}`) since
       * the rig is static, so it costs nothing after first paint.
       */}
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
          intensity={1.5}
          position={[-4, -2, 3]}
          scale={[3, 4, 1]}
        />
        <Lightformer
          form="ring"
          color="#ffffff"
          intensity={0.6}
          position={[0, 4, -4]}
          scale={4}
        />
      </Environment>

      <Float
        speed={1.2}
        rotationIntensity={0.15}
        floatIntensity={0.5}
        enabled={!isMobile}
      >
        {/*
         * Sit low in the frame: the hero's copy is top-anchored, so the
         * vehicle owns the lower field instead of colliding with it at a
         * shared vertical center.
         */}
        <group scale={0.62} position={[0, -0.95, 0]}>
          <mesh ref={bodyRef} geometry={bodyGeometry} castShadow>
            <meshPhysicalMaterial
              color={BRAND.obsidian}
              metalness={0.85}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.15}
              emissive={BRAND.signature}
              emissiveIntensity={0.12}
            />
            <Edges
              threshold={15}
              color={BRAND.signature}
              transparent
              opacity={0.9}
              toneMapped={false}
              renderOrder={1}
            />

            {/* Vertical analysis scan plane. */}
            <mesh ref={scanRef} position={[0, 0, 0]} renderOrder={2}>
              <planeGeometry args={[4.2, 0.06]} />
              <meshBasicMaterial
                color={BRAND.signature2}
                transparent
                opacity={0}
                toneMapped={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            {WHEEL_POSITIONS.map((position, i) => (
              <mesh
                key={i}
                geometry={wheelGeometry}
                position={position}
                rotation={[0, 0, Math.PI / 2]}
              >
                <meshStandardMaterial
                  color="#050608"
                  metalness={0.6}
                  roughness={0.4}
                  emissive={BRAND.signature}
                  emissiveIntensity={0.25}
                />
              </mesh>
            ))}
          </mesh>
        </group>
      </Float>

      <Sparkles
        count={isMobile ? 30 : 70}
        scale={4.5}
        size={2}
        speed={0.25}
        opacity={0.45}
        color={BRAND.signature}
      />
    </>
  );
}
