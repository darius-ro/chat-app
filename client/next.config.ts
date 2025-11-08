import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:8000",
    NEXT_PUBLIC_AUTH_LOCALSTORAGE_NAME: "_auth"
  },
  crossOrigin: 'anonymous'
};

export default nextConfig;
