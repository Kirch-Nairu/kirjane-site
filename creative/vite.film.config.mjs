import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({
  root:fileURLToPath(new URL('.',import.meta.url)),
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  esbuild:{jsx:'automatic'},
  build:{
    target:'es2022',
    outDir:fileURLToPath(new URL('../site/js',import.meta.url)),
    emptyOutDir:false,
    cssCodeSplit:false,
    lib:{
      entry:fileURLToPath(new URL('./film/entry.tsx',import.meta.url)),
      formats:['es'],
      fileName:()=>'forge-salryn-cinema-r1.js'
    },
    rollupOptions:{output:{inlineDynamicImports:true}}
  }
});
