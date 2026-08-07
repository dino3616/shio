import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

const config = defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins:
    lazyPlugins(() => [
      tailwindcss(),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tanstackStart(),
      viteReact(),
    ]) ?? [],
});

export default config;
