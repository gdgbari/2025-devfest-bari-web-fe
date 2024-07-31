import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import AstroPWA from "@vite-pwa/astro";
import { WebsiteConfig } from "./src/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    AstroPWA({
      mode: import.meta.env.DEV ? 'development' : 'production',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: WebsiteConfig.DEVFEST_NAME,
        short_name: WebsiteConfig.DEVFEST_NAME,
        theme_color: WebsiteConfig.DEVFEST_THEME_COLOR,
        icons: [
          {
            src: 'assets/images/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'assets/images/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'assets/images/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/images/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
      },


    }),
  ],
});
