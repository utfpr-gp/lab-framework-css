import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const raiz = resolve(process.cwd());

/** Caminho do index.html de um simulador. */
const pagina = (nome) => resolve(raiz, `src/simuladores/${nome}/index.html`);

export default defineConfig({
  // Caminhos relativos: o site roda tanto em / (local) quanto em
  // /lab-framework-css/ (GitHub Pages) sem precisar mudar nada.
  base: './',

  // MPA: cada página do laboratório é um index.html próprio.
  // Toda página nova precisa ser registrada aqui embaixo.
  build: {
    rollupOptions: {
      input: {
        home: resolve(raiz, 'index.html'),
        'bootstrap-grid': pagina('bootstrap-grid'),
        'grid-avancado': pagina('grid-avancado'),
        'utilitarios-responsivos': pagina('utilitarios-responsivos'),
        espacamento: pagina('espacamento'),
        componentes: pagina('componentes'),
        containers: pagina('containers'),
        navbar: pagina('navbar'),
        flexbox: pagina('flexbox'),
        gutters: pagina('gutters'),
        cores: pagina('cores'),
        formulario: pagina('formulario'),
        'sticky-footer': pagina('sticky-footer'),
        vazamento: pagina('vazamento'),
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
