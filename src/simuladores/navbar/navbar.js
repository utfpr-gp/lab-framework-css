/**
 * Simulador de Navbar Responsiva — Bootstrap 5
 *
 * Dois controles: a largura da tela e o breakpoint de expansão. O aluno
 * cruza os dois e descobre a regra — expande a partir de, não colapsa em.
 */
import './navbar.scss';
// o colapso de verdade, para o botão hambúrguer funcionar
import 'bootstrap/js/dist/collapse.js';
import { criarPalco, posicaoDe } from '../../js/motor.js';

const navbar = document.querySelector('[data-navbar]');
const veredito = document.querySelector('[data-veredito]');
const codigo = document.querySelector('[data-codigo]');
const grupoExpand = document.querySelector('[data-expand]');

let expand = 'lg';

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
};

/** Troca a classe navbar-expand-* mantendo o resto intacto. */
function aplicarExpand() {
  navbar.className = navbar.className
    .split(' ')
    .filter((c) => !c.startsWith('navbar-expand-'))
    .concat(`navbar-expand-${expand}`)
    .join(' ');
}

grupoExpand.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  grupoExpand
    .querySelectorAll('button')
    .forEach((b) => b.classList.remove('active'));
  botao.classList.add('active');

  expand = botao.dataset.valor;
  aplicarExpand();
  atualizar();
});

const { atualizar } = criarPalco({
  slider: document.getElementById('largura'),
  janela: document.querySelector('[data-janela]'),
  palco: document.querySelector('[data-palco]'),
  regua: document.querySelector('[data-regua]'),

  aoAtualizar({ largura, bp }) {
    saida.largura.textContent = largura;
    saida.sigla.textContent = bp.sigla;
    saida.regra.textContent =
      bp.min === 0 ? 'padrão, sem media query' : `a partir de ${bp.min}px`;

    const expandida = posicaoDe(bp.sigla) >= posicaoDe(expand);

    veredito.innerHTML = expandida
      ? `<span class="veredito veredito--expandida">
           Expandida — a tela alcançou <code>${expand}</code>, os links aparecem em linha
         </span>`
      : `<span class="veredito veredito--colapsada">
           Colapsada — a tela ainda não chegou em <code>${expand}</code>, então vira hambúrguer
         </span>`;

    codigo.innerHTML =
      `<span class="tag">&lt;nav class=</span>` +
      `"<span class="destaque">navbar navbar-expand-${expand}</span>"` +
      `<span class="tag">&gt;</span>`;
  },
});

aplicarExpand();
atualizar();
