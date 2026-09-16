/**
 * Simulador de Grid Responsivo — Bootstrap 5
 *
 * Ideia: o aluno arrasta o slider, o palco muda de largura com
 * animação e os 12 blocos se reempilham conforme as classes
 * col-12 / col-md-6 / col-lg-4 / col-xl-3.
 */
import './grid-simulator.scss';

// Breakpoints oficiais do Bootstrap 5
const BREAKPOINTS = [
  { sigla: 'xs', min: 0 },
  { sigla: 'sm', min: 576 },
  { sigla: 'md', min: 768 },
  { sigla: 'lg', min: 992 },
  { sigla: 'xl', min: 1200 },
  { sigla: 'xxl', min: 1400 },
];

// As classes usadas nos blocos, na ordem mobile-first
const CLASSES = [
  { bp: 'xs', classe: 'col-12', colunas: 12 },
  { bp: 'md', classe: 'col-md-6', colunas: 6 },
  { bp: 'lg', classe: 'col-lg-4', colunas: 4 },
  { bp: 'xl', classe: 'col-xl-3', colunas: 3 },
];

const MIN = 320;
const MAX = 1600;

const slider = document.getElementById('largura');
const janela = document.querySelector('[data-janela]');
const palco = document.querySelector('[data-palco]');
const linha = document.querySelector('[data-linha]');
const regua = document.querySelector('[data-regua]');

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
  classe: document.querySelector('[data-classe-ativa]'),
  colunas: document.querySelector('[data-colunas]'),
  porLinha: document.querySelector('[data-por-linha]'),
  zoom: document.querySelector('[data-zoom]'),
};

/** Descobre qual breakpoint está ativo para uma largura. */
function breakpointDe(largura) {
  return BREAKPOINTS.filter((bp) => largura >= bp.min).pop();
}

/** Descobre qual classe col-* está mandando nesse breakpoint. */
function classeDe(sigla) {
  const posicao = BREAKPOINTS.findIndex((bp) => bp.sigla === sigla);
  return CLASSES.filter(
    (c) => BREAKPOINTS.findIndex((bp) => bp.sigla === c.bp) <= posicao
  ).pop();
}

// -------------------------------------------------------------
//  Monta os 12 blocos
// -------------------------------------------------------------
for (let i = 1; i <= 12; i++) {
  const coluna = document.createElement('div');
  coluna.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
  coluna.innerHTML = `<div class="bloco bloco--${i}">${i}</div>`;
  linha.appendChild(coluna);
}

const colunas = [...linha.children];

// -------------------------------------------------------------
//  Monta a régua de breakpoints embaixo do slider
// -------------------------------------------------------------
BREAKPOINTS.forEach((bp) => {
  const marca = document.createElement('span');
  const posicao = ((Math.max(bp.min, MIN) - MIN) / (MAX - MIN)) * 100;
  marca.style.left = `${posicao}%`;
  marca.dataset.sigla = bp.sigla;
  marca.textContent = bp.sigla;
  regua.appendChild(marca);
});

// -------------------------------------------------------------
//  Movimento: animação FLIP
//
//  Trocar o data-bp reposiciona os blocos instantaneamente. Para
//  eles deslizarem em vez de piscar: medimos onde estavam, onde
//  foram parar, jogamos de volta com transform e soltamos — aí a
//  transition CSS faz o resto.
// -------------------------------------------------------------
function trocarBreakpoint(sigla) {
  if (palco.dataset.bp === sigla) return;

  const antes = colunas.map((el) => ({ x: el.offsetLeft, y: el.offsetTop }));

  palco.dataset.bp = sigla; // aqui o layout muda

  const depois = colunas.map((el) => ({ x: el.offsetLeft, y: el.offsetTop }));

  colunas.forEach((el, i) => {
    const dx = antes[i].x - depois[i].x;
    const dy = antes[i].y - depois[i].y;
    if (!dx && !dy) return;

    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  requestAnimationFrame(() => {
    colunas.forEach((el) => {
      el.style.transition = '';
      el.style.transform = '';
    });
  });
}

// -------------------------------------------------------------
//  Encaixa o palco na tela real (zoom) quando ele é maior
// -------------------------------------------------------------
function ajustarZoom(largura) {
  const disponivel = janela.clientWidth;
  const escala = Math.min(1, disponivel / largura);

  palco.style.transform = escala < 1 ? `scale(${escala})` : '';
  janela.style.height = `${palco.offsetHeight * escala}px`;

  return escala;
}

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar() {
  const largura = Number(slider.value);
  const bp = breakpointDe(largura);
  const classe = classeDe(bp.sigla);

  palco.style.width = `${largura}px`;
  trocarBreakpoint(bp.sigla);

  saida.largura.textContent = largura;
  saida.sigla.textContent = bp.sigla;
  saida.regra.textContent =
    bp.min === 0 ? 'padrão, sem media query' : `a partir de ${bp.min}px`;
  saida.classe.textContent = classe.classe;
  saida.colunas.textContent = `${classe.colunas} de 12`;
  saida.porLinha.textContent = 12 / classe.colunas;
  saida.zoom.textContent = `${Math.round(ajustarZoom(largura) * 100)}%`;

  regua.querySelectorAll('span').forEach((marca) => {
    marca.classList.toggle('ativo', marca.dataset.sigla === bp.sigla);
  });
}

slider.addEventListener('input', atualizar);
window.addEventListener('resize', atualizar);

// O palco muda de altura quando os blocos se reempilham
new ResizeObserver(() => {
  const escala = Math.min(1, janela.clientWidth / Number(slider.value));
  janela.style.height = `${palco.offsetHeight * escala}px`;
}).observe(palco);

atualizar();
