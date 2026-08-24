// frontend-astro/astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import { fileURLToPath } from "node:url";

// Publiczny front interpunkcja.com.pl.
// Strony statyczne (landingi, cennik, prawne) są prerenderowane,
// strony blogowe (kategorie, artykuły, strona główna) mają prerender=false
// i są renderowane serwerowo z API backendu.
export default defineConfig({
  site: "https://www.interpunkcja.com.pl",
  output: "static",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  trailingSlash: "ignore",
  server: {
    port: 4321,
    host: "127.0.0.1",
  },
  vite: {
    resolve: {
      alias: {
        // Komponenty stron są skopiowane 1:1 z SPA (frontend/), więc importują
        // react-router-dom i react-helmet-async. Shims zamieniają Link na <a>
        // i wyłączają Helmet (meta trafiają do <head> przez BaseLayout).
        "react-router-dom": fileURLToPath(
          new URL("./src/shims/react-router-dom.tsx", import.meta.url)
        ),
        "react-helmet-async": fileURLToPath(
          new URL("./src/shims/react-helmet-async.tsx", import.meta.url)
        ),
      },
    },
  },
});
