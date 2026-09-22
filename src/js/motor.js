/**
 * motor.js — o pedaço de JavaScript compartilhado pelos simuladores
 * que têm um palco com largura controlada por slider.
 *
 * Cuida de: régua de breakpoints, largura do palco, zoom para caber
 * na tela real e a animação FLIP quando o layout se reorganiza.
 */

// Breakpoints oficiais do Bootstrap 5
export const BREAKPOINTS = [
  { sigla: 'xs', min: 0 },
  { sigla: 'sm', min: 576 },
  { sigla: 'md', min: 768 },
  { sigla: 'lg', min: 992 },
  { sigla: 'xl', min: 1200 },
  { sigla: 'xxl', min: 1400 },
];

export const MIN = 320;
export const MAX = 1600;

/** Descobre qual breakpoint está ativo para uma largura. */
export function breakpointDe(largura) {
  return BREAKPOINTS.filter((bp) => largura >= bp.min).pop();
}

/** Posição de um breakpoint na ordem mobile-first (xs = 0, xxl = 5). */
export function posicaoDe(sigla) {
  return BREAKPOINTS.findIndex((bp) => bp.sigla === sigla);
}

/**
 * Animação FLIP.
 *
 * Trocar as classes reposiciona os elementos instantaneamente. Para
 * eles deslizarem em vez de piscar: medimos onde estavam, aplicamos a
 * mudança, medimos onde foram parar, jogamos de volta com transform e
 * soltamos — aí a transition do CSS faz o resto.
 *
 * @param {Element[]} elementos
 * @param {Function} mudar  o que altera o layout
 */
export function animarMudanca(elementos, mudar) {
  const antes = elementos.map((el) => ({ x: el.offsetLeft, y: el.offsetTop }));

  mudar();

  const depois = elementos.map((el) => ({ x: el.offsetLeft, y: el.offsetTop }));

  elementos.forEach((el, i) => {
    const dx = antes[i].x - depois[i].x;
    const dy = antes[i].y - depois[i].y;
    if (!dx && !dy) return;

    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  requestAnimationFrame(() => {
    elementos.forEach((el) => {
      el.style.transition = '';
      el.style.transform = '';
    });
  });
}

/**
 * Adia uma medição até o layout parar de se mexer.
 *
 * As transições do laboratório duram de 0.3s a 0.4s, e durante esse
 * tempo getBoundingClientRect devolve a posição do meio da animação.
 * Medir cedo demais produz diagnóstico errado — normalmente com a
 * cara de "o aviso está uma jogada atrasado".
 *
 * Também serve de freio para o slider, que dispara dezenas de
 * eventos por segundo enquanto o aluno arrasta.
 */
export function aposAcalmar(fn, espera = 450) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), espera);
  };
}

/**
 * Liga o slider de largura ao palco.
 *
 * @param {object} opcoes
 * @param {HTMLInputElement} opcoes.slider
 * @param {Element} opcoes.janela   recorta e dá altura ao palco
 * @param {Element} opcoes.palco    a div pai que muda de largura
 * @param {Element} opcoes.regua    onde as marcas de breakpoint entram
 * @param {Function} opcoes.elementos  devolve os elementos que animam
 * @param {Function} opcoes.aoAtualizar  recebe { largura, bp, zoom }
 * @returns {{ atualizar: Function }}
 */
export function criarPalco({
  slider,
  janela,
  palco,
  regua,
  elementos = () => [],
  aoAtualizar = () => {},
}) {
  // Marcas de breakpoint embaixo do slider
  BREAKPOINTS.forEach((bp) => {
    const marca = document.createElement('span');
    marca.style.left = `${((Math.max(bp.min, MIN) - MIN) / (MAX - MIN)) * 100}%`;
    marca.dataset.sigla = bp.sigla;
    marca.textContent = bp.sigla;
    regua.appendChild(marca);
  });

  /** Encaixa o palco na tela real quando ele é maior. */
  function ajustarZoom(largura) {
    const escala = Math.min(1, janela.clientWidth / largura);

    // O scale fica aplicado mesmo valendo 1. Além de ser inofensivo
    // (scale(1) não muda nada visualmente), um elemento transformado
    // vira o bloco de contenção dos filhos com position: fixed — é o
    // que mantém um offcanvas preso ao palco em vez de cobrir a
    // página inteira do laboratório.
    palco.style.transform = `scale(${escala})`;
    janela.style.height = `${palco.offsetHeight * escala}px`;
    return escala;
  }

  function atualizar() {
    const largura = Number(slider.value);
    const bp = breakpointDe(largura);

    palco.style.width = `${largura}px`;

    if (palco.dataset.bp !== bp.sigla) {
      animarMudanca(elementos(), () => {
        palco.dataset.bp = bp.sigla;
      });
    }

    regua.querySelectorAll('span').forEach((marca) => {
      marca.classList.toggle('ativo', marca.dataset.sigla === bp.sigla);
    });

    aoAtualizar({ largura, bp, zoom: ajustarZoom(largura) });
  }

  slider.addEventListener('input', atualizar);
  window.addEventListener('resize', atualizar);

  // O palco muda de altura quando o conteúdo se reorganiza
  new ResizeObserver(() => {
    const escala = Math.min(1, janela.clientWidth / Number(slider.value));
    janela.style.height = `${palco.offsetHeight * escala}px`;
  }).observe(palco);

  atualizar();
  return { atualizar };
}
