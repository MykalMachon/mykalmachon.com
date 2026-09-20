import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import icon from "astro-icon";

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: "https://mykalmachon.com",
  output: "server",
  integrations: [sitemap(), react(), markdoc(), icon()],
  redirects: {
    "/garden/[...slug]": "/posts/[...slug]",
  },
  adapter: node({
    mode: "standalone",
  }),
  build: {
    inlineStylesheets: "auto",
  },
  markdown: {
    shikiConfig: {
      theme: "vitesse-dark",
      wrap: false,
    },
  },
});
