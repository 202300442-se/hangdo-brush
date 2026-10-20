import type { NextConfig } from "next";

// GitHub Pages: https://202300442-se.github.io/hangdo-brush/
// 11월 Vercel 이전 시 NEXT_PUBLIC_BASE_PATH 를 비워 두면 루트 경로로 배포된다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
