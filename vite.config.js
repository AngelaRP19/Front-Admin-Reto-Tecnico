import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// El backend (ver API_GUIDE.md) solo permite CORS desde http://localhost:5173, que ya
// ocupa el proyecto público (Front-Reto-T-cnico). En vez de depender de un cambio en el
// backend, este panel habla con el backend a través del proxy de Vite: el navegador le
// pega a este mismo origen (sin CORS de por medio) y Vite reenvía la petición server-side.
// vite.config.js corre en Node, fuera del alcance de import.meta.env, así que el target
// del proxy no lee VITE_API_URL — si el backend corre en otro puerto, ajustar acá también.
const BACKEND_URL = "http://localhost:8081";
// Aunque el navegador ya no ve esto como cross-origin (le pega al mismo puerto del front),
// igual manda el header Origin real (5174) en la petición, y el filtro CORS de Spring lo
// valida también en la petición real (no solo en el preflight) — lo pisamos acá para que
// el backend vea el único origen que tiene permitido.
const ALLOWED_ORIGIN = "http://localhost:5173";

function proxyOptions() {
  return {
    target: BACKEND_URL,
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on("proxyReq", (proxyReq) => {
        proxyReq.setHeader("Origin", ALLOWED_ORIGIN);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 resolve: {
    alias: {
      fs: "empty-module",
      path: "path-browserify",
      os: "os-browserify/browser",
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    proxy: {
      "/auth": proxyOptions(),
      "/oauth2": proxyOptions(),
      "/nodos": proxyOptions(),
    },
  },
});
