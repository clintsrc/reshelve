import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

/*
 * Proxy API requests to the backend GraphQL server to avoid CORS issues
 * The frontend runs on port 3000, and the backend runs on port 3001.
 * Requests to '/graphql' from the frontend are forwarded to the backend server.
 */
export default defineConfig({
  plugins: [react()], // enable React support in Vite
  server: {
    port: 3000, // vite's port
    open: true,
    proxy: {
      "/graphql": { // graphql endpoint rules
        target: "http://localhost:3001",  // backend's port
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
