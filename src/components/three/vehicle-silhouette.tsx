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

import { useHeroScrollProgress, useIsMobile } from "@/hooks";
import {
  BRAND,
  buildBodyGeometry,
  buildWheelGeometry,
  WHEEL_POSITIONS,
} from "./vehicle-geometry";

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
  const scrollGroupRef = React.useRef<THREE.Group>(null);
  const scanRef = React.useRef<THREE.Mesh>(null);
  const rimLightRef = React.useRef<THREE.PointLight>(null);
  const isMobile = useIsMobile();
  const { pointer } = useThree();
  const scroll = useHeroScrollProgress();

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

    // Scroll choreography: as the visitor scrolls down the hero, the car turns
    // toward them, lifts, and recedes slightly — a deliberate "handoff" as the
    // page dives into the content. Eased each frame so it feels weighted, not
    // linear. (Under reduced-motion the canvas idles on a demand frameloop, so
    // this loop doesn't run and the car stays put.)
    if (scrollGroupRef.current) {
      const p = scroll.current;
      const g = scrollGroupRef.current;
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p * 0.9, 0.08);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, p * -0.12, 0.08);
      g.position.y = THREE.MathUtils.lerp(g.position.y, p * 1.6, 0.08);
      const target = 1 - p * 0.18;
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 0.08));
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

      {/* Scroll-controlled wrapper: turns/lifts the car with scroll (see
       * useFrame). Float handles its own idle bob inside, unaffected. */}
      <group ref={scrollGroupRef}>
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
      </group>

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
