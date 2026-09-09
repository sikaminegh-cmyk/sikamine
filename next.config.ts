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
