import type { NextConfig } from "next"
import { assertClerkProductionConfig } from "./lib/clerk-env"

assertClerkProductionConfig()

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  poweredByHeader: false,
}

export default nextConfig
