"use client";

import * as React from "react";

/**
 * Detects whether the browser can actually create a WebGL2 context. Guards the
 * full-bleed 3D hero: on unsupported browsers (old Safari, software renderers,
 * some in-app webviews) we skip mounting the Canvas entirely rather than
 * crashing or burning CPU on a failed context, and show the gradient fallback
 * permanently instead.
 */
export function useWebglSupported(): boolean {
  const [supported, setSupported] = React.useState(true);

  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
