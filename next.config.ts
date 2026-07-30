import type { NextConfig } from "next";

/**
 * Next.js configuration for Verdikt.
 *
 * Kept intentionally lean: platform concerns (headers, redirects, image
 * optimization) live here so that application code never has to reason about
 * infrastructure. Anything environment-specific is read from `src/config/env`.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Transpile 3D / animation packages that ship modern syntax so they play
  // nicely with server components and the Turbopack/webpack boundary.
  transpilePackages: ["three"],

  experimental: {
    // Optimize barrel imports for large icon / animation libraries.
    optimizePackageImports: ["lucide-react", "motion", "@react-three/drei"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase storage — public asset delivery.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
