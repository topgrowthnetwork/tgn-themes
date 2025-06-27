const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

// Get theme from environment variable, default to 'active'
const theme = process.env.NEXT_PUBLIC_THEME || 'active';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  experimental: {
    optimizePackageImports: []
  },
  images: {
    remotePatterns: [
      {
        hostname: process.env.BIGCOMMERCE_CDN_HOSTNAME ?? '*.bigcommerce.com'
      },
      {
        hostname: process.env.API_HOSTNAME
      }
    ]
  },
  webpack(config) {
    config.resolve.alias['@theme'] = path.resolve(__dirname, `components/themes/${theme}`);
    config.resolve.alias['@shared'] = path.resolve(__dirname, 'components/shared');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);
