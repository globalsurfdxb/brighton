import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

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
