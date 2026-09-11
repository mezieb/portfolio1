import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [tailwindcss()],
  root: '.',
  resolve: {
    // Keeps `@/...` imports working at build time (mirrors tsconfig `paths`).
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // One small CSS file beats several round-trips on a single-page site.
    cssCodeSplit: false,
    assetsInlineLimit: 4096,
    reportCompressedSize: true,
  },
});

