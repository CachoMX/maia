/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Disable static page generation for pages that require authentication
  // This ensures all authenticated routes are rendered dynamically
  output: "standalone",
  // Transpile recharts and related packages to avoid build issues
  transpilePackages: ['recharts', 'recharts-scale', 'd3-scale', 'd3-array', 'd3-shape', 'd3-interpolate', 'd3-color', 'd3-format', 'd3-time', 'd3-time-format'],
};

export default nextConfig;
