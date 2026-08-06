import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@madev/config",
    "@madev/types",
    "@madev/ui-tokens",
    "@madev/validation",
  ],
};

export default nextConfig;
