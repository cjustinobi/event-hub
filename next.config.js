/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  webpack: (config) => {
    
    config.module.rules.push({
      test: /\.cdc$/,
      loader: "raw-loader",
    })

    return config;
  }
}

module.exports = nextConfig
