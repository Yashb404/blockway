import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma (and its WASM/runtime files) should not be bundled by Turbopack/Webpack.
  // Leaving it external lets Node resolve the runtime modules correctly.
  serverExternalPackages: ["@prisma/client", "prisma", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
