import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  build: {
    target: 'es2022',
    outDir: fileURLToPath(new URL('../site/js', import.meta.url)),
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/main.jsx', import.meta.url)),
      formats: ['es'],
      fileName: () => 'forge-immersive-r2.js',
      cssFileName: 'forge-immersive-r2'
    },
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
});
