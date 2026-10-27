import type {NextConfig} from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
let repoBasePath = '';

if (isGithubActions && process.env.NEXT_EXPORT === 'true') {
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
  } else if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    if (parts.length > 1 && !parts[1].endsWith('.github.io')) {
      repoBasePath = `/${parts[1]}`;
    }
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  basePath: repoBasePath || undefined,
  assetPrefix: repoBasePath || undefined,
  output: process.env.NEXT_EXPORT === 'true' ? 'export' : 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
