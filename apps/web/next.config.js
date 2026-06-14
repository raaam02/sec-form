const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sec-form/shared', '@sec-form/ui', '@sec-form/validators'],
};

module.exports = withNextIntl(nextConfig);
