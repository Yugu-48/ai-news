import type { NextConfig } from "next";

// Repo root has its own pnpm-lock.yaml; pin the app root so Next doesn't trace from the parent.
const root = import.meta.dirname;

const nextConfig: NextConfig = {
  outputFileTracingRoot: root,
  turbopack: { root },
};

export default nextConfig;
