/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: '/visuals', destination: '/FallingTrees', permanent: true },
      { source: '/visuals/:slug', destination: '/FallingTrees/:slug', permanent: true },
      { source: '/poems', destination: '/PhirBhi', permanent: true },
      { source: '/poems/:slug', destination: '/PhirBhi/:slug', permanent: true },
      { source: '/hero-kaun', destination: '/HeroKaun', permanent: true },
      { source: '/hero-kaun/:slug', destination: '/HeroKaun/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
