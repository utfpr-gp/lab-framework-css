import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const raiz = resolve(process.cwd());

export default defineConfig({
  // MPA: cada página do laboratório é um index.html próprio.
  // Toda página nova precisa ser registrada aqui embaixo.
  build: {
    rollupOptions: {
      input: {
        home: resolve(raiz, 'index.html'),
        'bootstrap-grid': resolve(
          raiz,
          'src/simuladores/bootstrap-grid/index.html'
        ),
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // permite "@use 'bootstrap/scss/bootstrap'" sem caminho relativo
        loadPaths: [resolve(raiz, 'node_modules')],
        quietDeps: true,
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },
});
