/**
 * Simulador de Utilitários Responsivos — Bootstrap 5
 *
 * O mesmo slider de largura do simulador de grid, mas agora o que muda
 * são utilitários: elementos aparecem, somem, viram de lado e
 * realinham. A tabela embaixo diz, a cada instante, o que está valendo.
 */
import './utilitarios.scss';
import { criarPalco } from '../../js/motor.js';

const palco = document.querySelector('[data-palco]');
const legenda = document.querySelector('[data-legenda]');

// Os elementos que a tabela acompanha, com o que perguntar sobre cada um
const OBSERVADOS = [
  {
    nome: 'Menu completo',
    seletor: '.mini-topo nav',
    classes: 'd-none d-md-flex',
    ler: (el) => (visivel(el) ? 'visível' : 'escondido'),
  },
  {
    nome: 'Botão ☰',
    seletor: '.mini-hamburguer',
    classes: 'd-block d-md-none',
    ler: (el) => (visivel(el) ? 'visível' : 'escondido'),
  },
  {
    nome: 'Cabeçalho',
    seletor: '.mini-topo',
    classes: 'flex-column flex-md-row',
    ler: (el) =>
      estilo(el, 'flex-direction') === 'column'
        ? 'empilhado (column)'
        : 'lado a lado (row)',
  },
  {
    nome: 'Barra lateral',
    seletor: '.mini-lateral',
    classes: 'd-none d-lg-block',
    ler: (el) => (visivel(el) ? 'visível' : 'escondida'),
  },
  {
    nome: 'Texto do artigo',
    seletor: '.mini-conteudo p',
    classes: 'text-center text-lg-start',
    ler: (el) =>
      estilo(el, 'text-align') === 'center' ? 'centralizado' : 'à esquerda',
  },
];

/** Lê uma propriedade já calculada pelo navegador. */
function estilo(el, propriedade) {
  return getComputedStyle(el).getPropertyValue(propriedade);
}

function visivel(el) {
  return estilo(el, 'display') !== 'none';
}

// Monta as linhas da tabela uma vez só
legenda.innerHTML = OBSERVADOS.map(
  (item) => `
    <tr>
      <td>${item.nome}</td>
      <td><code class="mono">${item.classes}</code></td>
      <td class="text-end fw-semibold" data-estado></td>
    </tr>`
).join('');

const celulas = [...legenda.querySelectorAll('[data-estado]')];

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
};

criarPalco({
  slider: document.getElementById('largura'),
  janela: document.querySelector('[data-janela]'),
  palco,
  regua: document.querySelector('[data-regua]'),
  elementos: () => [...palco.querySelectorAll('.mini-lateral, .mini-conteudo')],

  aoAtualizar({ largura, bp }) {
    saida.largura.textContent = largura;
    saida.sigla.textContent = bp.sigla;
    saida.regra.textContent =
      bp.min === 0 ? 'padrão, sem media query' : `a partir de ${bp.min}px`;

    OBSERVADOS.forEach((item, i) => {
      const el = palco.querySelector(item.seletor);
      const estado = item.ler(el);
      celulas[i].textContent = estado;
      celulas[i].className = `text-end fw-semibold ${
        estado.startsWith('escondid') ? 'escondido' : 'visivel'
      }`;
    });
  },
});
