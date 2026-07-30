import * as THREE from "three";

/**
 * Shared vehicle geometry — the single source of truth for Verdikt's original
 * car silhouette, consumed by every 3D surface that renders the vehicle (the
 * hero `VehicleSilhouette` and the feature `AnalysisStage`). Extracted here so
 * the hand-plotted profile lives once: retune the shape in one place and every
 * scene inherits it.
 *
 * This is an ORIGINAL silhouette authored for Verdikt — hand-plotted control
 * points, not a scan or import of any real make/model — so it carries zero
 * licensing risk (see `references/models/README.md`: procedural over sourced,
 * always).
 */

/**
 * WebGL can't read CSS custom properties — these hexes mirror the OKLCH
 * signature tokens in `globals.css`. Keep them in sync when the palette moves.
 */
export const BRAND = {
  signature: "#3b82f6",
  signature2: "#8b5cf6",
  obsidian: "#0b0d12",
} as const;

/**
 * Builds a low-poly, faceted vehicle side-profile as a closed 2D curve, then
 * extrudes it into a solid. It reads as "a car" through silhouette alone: a
 * raked windshield, a fastback roofline, and a low, wide stance, faceted to
 * match the brand mark's diamond geometry rather than aiming for photorealism.
 */
export function buildBodyGeometry(): THREE.ExtrudeGeometry {
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

export function buildWheelGeometry(): THREE.CylinderGeometry {
  return new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
}

/**
 * Wheel hub positions in body-local space. z-offsets stay within the body's
 * extrude depth (1.05, half = 0.525) so the wheels sit flush against the flanks
 * rather than poking out disconnected.
 */
export const WHEEL_POSITIONS: readonly [number, number, number][] = [
  [-1.1, -0.3, 0.42],
  [-1.1, -0.3, -0.42],
  [1.05, -0.3, 0.42],
  [1.05, -0.3, -0.42],
];
