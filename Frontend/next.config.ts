import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  
  // Suppress the lockfile warning for monorepo
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
