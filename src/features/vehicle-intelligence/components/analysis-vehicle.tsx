"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Edges } from "@react-three/drei";
import * as THREE from "three";

import { usePrefersReducedMotion } from "@/hooks";
import {
  BRAND,
  buildBodyGeometry,
  buildWheelGeometry,
  WHEEL_POSITIONS,
} from "@/components/three/vehicle-geometry";

import {
  DAMAGE_POINTS,
  POWERTRAIN,
  type AnalysisPhase,
  type BodyAnchor,
} from "../analysis";
import { approach } from "./analysis-motion";

/**
 * Verdict-status hexes for WebGL. Mirror the OKLCH `--verdict-*` tokens in
 * `globals.css` (WebGL can't read CSS custom properties). Keep in sync with the
 * palette, exactly as `BRAND` does for the signature tones.
 */
const VERDICT_HEX = {
  clear: "#34d39a",
  caution: "#f5c14e",
  flagged: "#f4746e",
} as const;

/** Inner transform: shrink the ~3.7-unit-long body to stage scale and drop it
 * so its wheels rest on the reflective ground at y ≈ -1.15. */
const BODY_SCALE = 0.62;
const BODY_Y = -0.62;

/** Held presentation angle once analysis begins — a 3/4 that turns the front
 * and the camera-facing flank (where the damage markers live) toward the lens. */
const HOLD_ANGLE = -0.62;

/**
 * A single flagged region: a billboarded ring + core dot in the finding's
 * severity color, pulsing to draw the eye. Hidden (scaled to nothing) until the
 * body turns transparent. Static under reduced motion.
 */
function DamageMarker({
  position,
  color,
  active,
}: {
  position: BodyAnchor;
  color: string;
  active: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const groupRef = React.useRef<THREE.Group>(null);
  const ringRef = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const target = active ? 1 : 0.0001;
    const s = approach(group.scale.x, target, 6, delta, reduced);
    group.scale.setScalar(s);

    if (ringRef.current && active && !reduced) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.18;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      scale={0.0001}
    >
      <Billboard>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.12, 0.16, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.9}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[0.05, 24]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </Billboard>
      <pointLight color={color} intensity={active ? 1.4 : 0} distance={1.2} />
    </group>
  );
}

/**
 * AnalysisVehicle — the interactive, analyzable car.
 *
 * Reuses the shared Verdikt silhouette geometry, then dresses it for the
 * cinematic: a glass-clearcoat body wrapped in a holographic edge shell,
 * animated headlights (emissive lenses + forward spotlights), a glowing
 * internal powertrain core, and pulsing damage markers. Everything is driven by
 * one `phase`:
 *
 * - `idle` — opaque body, gentle rotation, headlights breathing.
 * - `scanning` — rotation eases to a held 3/4, a bright plane sweeps the length,
 *   edges and headlights flare.
 * - `revealing` / `complete` — the body turns transparent (x-ray), the
 *   powertrain lights up, and the damage markers pop in.
 *
 * Motion is framerate-independent and collapses to instant state changes under
 * reduced motion.
 */
export function AnalysisVehicle({ phase }: { phase: AnalysisPhase }) {
  const reduced = usePrefersReducedMotion();
  const { pointer, invalidate } = useThree();

  const tiltRef = React.useRef<THREE.Group>(null);
  const spinRef = React.useRef<THREE.Group>(null);
  const bodyMatRef = React.useRef<THREE.MeshPhysicalMaterial>(null);
  const engineRef = React.useRef<THREE.Group>(null);
  const engineMatRef = React.useRef<THREE.MeshStandardMaterial>(null);
  const engineLightRef = React.useRef<THREE.PointLight>(null);
  const scanRef = React.useRef<THREE.Mesh>(null);
  const headlightRef = React.useRef<THREE.SpotLight>(null);
  const lensMatRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const rimLightRef = React.useRef<THREE.PointLight>(null);

  const bodyGeometry = React.useMemo(() => buildBodyGeometry(), []);
  const wheelGeometry = React.useMemo(() => buildWheelGeometry(), []);
  const headlightTarget = React.useMemo(() => new THREE.Object3D(), []);

  const xray = phase === "revealing" || phase === "complete";
  const scanning = phase === "scanning";

  // Ensure a frame renders on every phase change (matters under the reduced-
  // motion demand frameloop, where `useFrame` otherwise never ticks).
  React.useEffect(() => {
    invalidate();
  }, [phase, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1); // clamp after tab-switch stalls
    const t = state.clock.elapsedTime;

    // Pointer tilt — the car "notices" the cursor (mouse reactivity).
    if (tiltRef.current) {
      tiltRef.current.rotation.x = approach(
        tiltRef.current.rotation.x,
        -pointer.y * 0.12,
        3,
        dt,
        reduced,
      );
      tiltRef.current.rotation.y = approach(
        tiltRef.current.rotation.y,
        pointer.x * 0.18,
        3,
        dt,
        reduced,
      );
    }

    // Rotation: free slow spin while idle; ease to the held angle once analysis
    // begins so the flagged flank stays readable.
    if (spinRef.current) {
      if (phase === "idle") {
        if (!reduced) spinRef.current.rotation.y += dt * 0.28;
      } else {
        spinRef.current.rotation.y = approach(
          spinRef.current.rotation.y,
          HOLD_ANGLE,
          4,
          dt,
          reduced,
        );
      }
    }

    // Body x-ray: fade the clearcoat down as the internals are exposed.
    if (bodyMatRef.current) {
      bodyMatRef.current.opacity = approach(
        bodyMatRef.current.opacity,
        xray ? 0.14 : 1,
        4,
        dt,
        reduced,
      );
      // Write depth while (near-)opaque so the car reads solid at idle, but not
      // once it x-rays open — otherwise the interior would be occluded.
      bodyMatRef.current.depthWrite = bodyMatRef.current.opacity > 0.9;
      bodyMatRef.current.emissiveIntensity = approach(
        bodyMatRef.current.emissiveIntensity,
        scanning ? 0.4 : xray ? 0.24 : 0.12,
        4,
        dt,
        reduced,
      );
    }

    // Powertrain core: scale + glow in on reveal.
    if (engineRef.current) {
      const s = approach(
        engineRef.current.scale.x,
        xray ? 1 : 0.0001,
        6,
        dt,
        reduced,
      );
      engineRef.current.scale.setScalar(s);
    }
    if (engineMatRef.current) {
      engineMatRef.current.emissiveIntensity = approach(
        engineMatRef.current.emissiveIntensity,
        xray ? 1.6 : 0,
        5,
        dt,
        reduced,
      );
    }
    if (engineLightRef.current) {
      const base = xray ? 2.2 : 0;
      engineLightRef.current.intensity = reduced
        ? base
        : base * (1 + Math.sin(t * 4) * 0.12);
    }

    // Sweeping scan plane — a bright wall travelling nose-to-tail while scanning.
    if (scanRef.current) {
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      if (scanning && !reduced) {
        const sweep = (t * 1.15) % 1; // 0→1 loop
        scanRef.current.position.x = 2.1 - sweep * 4.2;
        mat.opacity = Math.sin(sweep * Math.PI) * 0.65;
      } else {
        mat.opacity = approach(mat.opacity, 0, 8, dt, reduced);
      }
    }

    // Animated headlights: a startup flare during the scan, gentle breathing
    // otherwise — light that feels alive.
    const lensTarget = scanning ? 3.2 : xray ? 1.4 : 1;
    if (lensMatRef.current) {
      const breathe = reduced ? 1 : 1 + Math.sin(t * 1.6) * 0.12;
      lensMatRef.current.opacity = approach(
        lensMatRef.current.opacity,
        Math.min(1, 0.55 * lensTarget * breathe),
        4,
        dt,
        reduced,
      );
    }
    if (headlightRef.current) {
      headlightRef.current.intensity = approach(
        headlightRef.current.intensity,
        lensTarget * 3,
        4,
        dt,
        reduced,
      );
    }

    // Rim light drifts hue across the signature range and follows the cursor.
    if (rimLightRef.current) {
      rimLightRef.current.color.setHSL(
        0.62 + (reduced ? 0 : Math.sin(t * 0.15) * 0.03),
        0.75,
        0.6,
      );
      rimLightRef.current.position.x = approach(
        rimLightRef.current.position.x,
        -3 + pointer.x * 2,
        2,
        dt,
        reduced,
      );
    }
  });

  return (
    <group ref={tiltRef}>
      <pointLight
        ref={rimLightRef}
        position={[-3, 1.6, -2]}
        intensity={2.6}
        color={BRAND.signature2}
      />

      <group ref={spinRef}>
        <group scale={BODY_SCALE} position={[0, BODY_Y, 0]}>
          {/* Body — glass clearcoat that x-rays open. `transparent` always on so
           * the opacity ease is smooth; edges stay lit as the holographic shell. */}
          <mesh geometry={bodyGeometry} castShadow>
            <meshPhysicalMaterial
              ref={bodyMatRef}
              color={BRAND.obsidian}
              metalness={0.85}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.15}
              emissive={BRAND.signature}
              emissiveIntensity={0.12}
              transparent
              opacity={1}
              depthWrite={false}
            />
            <Edges
              threshold={15}
              color={BRAND.signature}
              transparent
              opacity={0.9}
              toneMapped={false}
              renderOrder={2}
            />
          </mesh>

          {/* Wheels */}
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

          {/* Headlights: a bright lens core inside a soft additive halo (reads
           * as a real glow without post-processing bloom), plus a forward
           * spotlight that pools on the reflective ground. */}
          {([0.32, -0.32] as const).map((z) => (
            <group key={z} position={[1.78, 0.12, z]}>
              <mesh>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshBasicMaterial
                  ref={z > 0 ? lensMatRef : undefined}
                  color="#eaf4ff"
                  transparent
                  opacity={0.7}
                  toneMapped={false}
                />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshBasicMaterial
                  color="#8ec5ff"
                  transparent
                  opacity={0.22}
                  toneMapped={false}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          ))}
          <spotLight
            ref={headlightRef}
            position={[1.9, 0.2, 0]}
            target={headlightTarget}
            angle={0.5}
            penumbra={0.6}
            distance={7}
            intensity={3}
            color="#cfe4ff"
          />
          <primitive object={headlightTarget} position={[4.5, -0.9, 0]} />

          {/* Powertrain core — battery slab + twin motors, revealed on x-ray. */}
          <group
            ref={engineRef}
            position={[
              POWERTRAIN.position[0],
              POWERTRAIN.position[1],
              POWERTRAIN.position[2],
            ]}
            scale={0.0001}
          >
            <mesh>
              <boxGeometry args={[1.7, 0.16, 0.72]} />
              <meshStandardMaterial
                ref={engineMatRef}
                color={BRAND.signature}
                emissive={BRAND.signature}
                emissiveIntensity={0}
                metalness={0.4}
                roughness={0.3}
                toneMapped={false}
              />
              <Edges
                threshold={15}
                color={BRAND.signature2}
                toneMapped={false}
              />
            </mesh>
            {([0.95, -0.95] as const).map((x) => (
              <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.78, 20]} />
                <meshStandardMaterial
                  color={BRAND.signature2}
                  emissive={BRAND.signature2}
                  emissiveIntensity={0.9}
                  metalness={0.5}
                  roughness={0.35}
                  toneMapped={false}
                />
              </mesh>
            ))}
            <pointLight
              ref={engineLightRef}
              color={BRAND.signature}
              intensity={0}
              distance={2.4}
            />
          </group>

          {/* Damage markers */}
          {DAMAGE_POINTS.map((point) => (
            <DamageMarker
              key={point.id}
              position={point.position}
              color={VERDICT_HEX[point.severity]}
              active={xray}
            />
          ))}

          {/* Sweeping scan wall (normal along X, spans Y·Z). */}
          <mesh
            ref={scanRef}
            position={[2.1, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[1.4, 1.5]} />
            <meshBasicMaterial
              color={BRAND.signature}
              transparent
              opacity={0}
              toneMapped={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
