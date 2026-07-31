import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Явно фиксируем корень воркспейса (в $HOME есть лишний package-lock.json).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
