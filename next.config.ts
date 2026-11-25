import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server build for Azure App Service (`node server.js`)
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brightonwebstorage.blob.core.windows.net",
      },
      {
        // legacy uploads still referenced by existing content
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
