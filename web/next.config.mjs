/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    // Some Solana deps reach for fs/crypto in node-only paths.
    // Fall them back to nothing on the client bundle.
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
