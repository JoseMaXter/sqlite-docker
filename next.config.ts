import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No incluyas sqlite3 en el bundle del cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        sqlite3: false,
      };
    }
    return config;
  },
  // Configuración para desarrollo con Docker
  watchOptions: {
    pollIntervalMs: 1000, // Intervalo de polling en milisegundos
  },
};

export default nextConfig;
