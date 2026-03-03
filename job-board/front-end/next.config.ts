/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/agency/login',
        destination: '/login', // points to your login page
      },
      {
        source: '/agency/register',
        destination: '/register', // points to your register page
      },
      {
        source: '/agency/dashboard/:role',
        destination: '/dashboard/:role', // points to dashboard page
      },
    ];
  },
};

module.exports = nextConfig;
