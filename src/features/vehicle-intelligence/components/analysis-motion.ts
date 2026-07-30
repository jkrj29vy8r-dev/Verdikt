import * as THREE from "three";

/**
 * Framerate-independent ease toward a target value, shared by every animated
 * property in the analysis scene (the vehicle's materials and the camera rig).
 *
 * When `instant` is set (the viewer prefers reduced motion) it snaps to the
 * target so the scene, rendered one frame per phase change on a demand
 * frameloop, still lands in the right state without any in-between motion.
 */
export function approach(
  current: number,
  target: number,
  lambda: number,
  dt: number,
  instant: boolean,
): number {
  return instant ? target : THREE.MathUtils.damp(current, target, lambda, dt);
}
