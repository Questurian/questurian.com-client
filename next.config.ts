import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API proxy is handled via src/app/api/[[...path]]/route.ts
  // This route handler manages:
  // - Forwarding requests to the backend
  // - Tunneling cookies (rewriting domain for cross-domain cookie access)
  // - Preserving all request/response headers
};

export default nextConfig;
