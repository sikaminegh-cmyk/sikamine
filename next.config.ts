import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  images: {
    // `process.env.NEXT_PUBLIC_SUPABASE_URL` is not reliably populated yet at
    // the point Next.js evaluates this file (.env.local loads afterwards),
    // so a specific hostname can't be derived here. Any host is allowed, but
    // only under the Supabase Storage public-object path — this covers local
    // dev (127.0.0.1) and any production Supabase project host without
    // needing that env var at config-load time, while staying restricted to
    // one path shape rather than arbitrary remote images.
    remotePatterns: [
      { protocol: "http", hostname: "**", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "**", pathname: "/storage/v1/object/public/**" },
    ],
    // Next.js blocks image optimization requests to private/local IPs by
    // default (SSRF protection) — that's exactly what local Supabase
    // (127.0.0.1) is, so it's only relaxed outside production. A real
    // production Supabase project is a public HTTPS host, so this never
    // applies there and the protection stays fully in effect.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  // Dev-only: Next.js refuses cross-origin requests to dev assets (HMR
  // websocket, client JS chunks, fonts) by default — anyone loading the app
  // through a tunnel (a different hostname than localhost) gets a page that
  // never hydrates, so every button silently does nothing. Wildcarded so it
  // survives ngrok issuing a new random subdomain on each restart. Never
  // applies in production (no dev server there to guard).
  allowedDevOrigins: process.env.NODE_ENV === "production" ? undefined : ["*.ngrok-free.dev", "*.ngrok-free.app"],
  // Dev-only convenience: proxies relative /storage/* requests to local
  // Supabase Storage through this same origin. This lets the app (and any
  // tunnel exposing it, e.g. ngrok) serve locally-uploaded images without
  // the viewer's browser needing to reach 127.0.0.1 directly — that address
  // means "their own machine", not this one. Production always talks to the
  // real Supabase project directly via absolute URLs, so this never applies
  // there. See lib/supabase/client.ts's upload helpers for the matching
  // dev-only relative-URL behavior.
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [{ source: "/storage/:path*", destination: "http://127.0.0.1:54321/storage/:path*" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
