const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

// Get theme from environment variable, default to 'active'
const theme = process.env.NEXT_PUBLIC_THEME || 'active';

// Extract hostname from NEXT_PUBLIC_API_URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiHostname = apiUrl ? new URL(apiUrl).hostname : undefined;

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
    remotePatterns: [...(apiHostname ? [{ hostname: apiHostname }] : [])]
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

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'shkoko',
  project: 'tgn-themes',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});
