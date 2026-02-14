import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@oath/shared', '@oath/ui-kit'],

  // Bundle size 防護：阻止前端 import 伺服器端排盤引擎 (B4-4)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = {
        ...config.resolve.alias,
        '@oath/astrology-engine': false,
        '@oath/bazi-engine': false,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
