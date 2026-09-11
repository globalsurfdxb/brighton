import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azurebloglearn.blob.core.windows.net",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/interior-lighting/spin",
        destination: "/lighting/spin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
