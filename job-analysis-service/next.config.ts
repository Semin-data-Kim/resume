import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF 파싱 라이브러리를 번들링하지 않고 Node.js에서 직접 사용
  serverExternalPackages: ['pdf2json'],
  ...(process.env.VERCEL
    ? {
        outputFileTracingRoot: __dirname,
      }
    : {
        turbopack: {
          root: __dirname,
        },
      }),
};

export default nextConfig;
