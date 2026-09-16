/**
 * Simulador de Grid Responsivo — Bootstrap 5
 *
 * O aluno arrasta o slider, o palco muda de largura com animação e os
 * 12 blocos se reempilham conforme col-12 / col-md-6 / col-lg-4 / col-xl-3.
 */
import './grid-simulator.scss';
import { criarPalco, posicaoDe } from '../../js/motor.js';

// As classes usadas nos blocos, na ordem mobile-first
const CLASSES = [
  { bp: 'xs', classe: 'col-12', colunas: 12 },
  { bp: 'md', classe: 'col-md-6', colunas: 6 },
  { bp: 'lg', classe: 'col-lg-4', colunas: 4 },
  { bp: 'xl', classe: 'col-xl-3', colunas: 3 },
];

/** Descobre qual classe col-* está mandando nesse breakpoint. */
function classeDe(sigla) {
  return CLASSES.filter((c) => posicaoDe(c.bp) <= posicaoDe(sigla)).pop();
}

const linha = document.querySelector('[data-linha]');

// Monta os 12 blocos
for (let i = 1; i <= 12; i++) {
  const coluna = document.createElement('div');
  coluna.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
  coluna.innerHTML = `<div class="bloco bloco--${i}">${i}</div>`;
  linha.appendChild(coluna);
}

const colunas = [...linha.children];

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
  classe: document.querySelector('[data-classe-ativa]'),
  colunas: document.querySelector('[data-colunas]'),
  porLinha: document.querySelector('[data-por-linha]'),
  zoom: document.querySelector('[data-zoom]'),
};

criarPalco({
  slider: document.getElementById('largura'),
  janela: document.querySelector('[data-janela]'),
  palco: document.querySelector('[data-palco]'),
  regua: document.querySelector('[data-regua]'),
  elementos: () => colunas,

  aoAtualizar({ largura, bp, zoom }) {
    const classe = classeDe(bp.sigla);

    saida.largura.textContent = largura;
    saida.sigla.textContent = bp.sigla;
    saida.regra.textContent =
      bp.min === 0 ? 'padrão, sem media query' : `a partir de ${bp.min}px`;
    saida.classe.textContent = classe.classe;
    saida.colunas.textContent = `${classe.colunas} de 12`;
    saida.porLinha.textContent = 12 / classe.colunas;
    saida.zoom.textContent = `${Math.round(zoom * 100)}%`;
  },
});
