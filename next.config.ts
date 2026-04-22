import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    globalNotFound: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['motion'],
  async headers() {
    return [
      {
        source: '/(.*).(svg|png|jpg|jpeg|gif|webp|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR can be disabled in host environments via DISABLE_HMR.
    // Do not modify; file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
