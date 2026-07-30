/**
 * GSAP integration.
 *
 * Centralizes plugin registration so no component imports GSAP plugins ad hoc.
 * ScrollTrigger touches the DOM, so registration is guarded to the client. Use
 * the `useGsap` hook (below) rather than calling gsap directly in components —
 * it scopes animations and cleans them up on unmount.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
