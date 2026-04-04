/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // TypeScript errors ko ignore karega build ke waqt
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint errors ko ignore karega build ke waqt
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
