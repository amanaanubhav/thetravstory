/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use src/ directory for source code
  // App Router is in src/app/

  // Preserve existing image domains if needed
  images: {
    unoptimized: true,
  },

  // Suppress hydration warnings during migration
  reactStrictMode: true,
};

export default nextConfig;
