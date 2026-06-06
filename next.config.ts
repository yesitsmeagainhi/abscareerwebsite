import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import path from "path";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (the repo has other lockfiles above it).
  turbopack: { root: projectRoot },
  // Images are uploaded to /public/uploads and served same-origin — no remote
  // patterns needed.
};

export default nextConfig;
