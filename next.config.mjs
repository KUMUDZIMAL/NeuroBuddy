// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Skips TS errors at build time (not recommended for prod)
  },
};

export default nextConfig;
