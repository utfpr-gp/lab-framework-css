/**
 * Simulador de Navbar Responsiva — Bootstrap 5
 *
 * Três controles: a largura da tela, o breakpoint de expansão e o
 * jeito de esconder o menu. O aluno cruza os dois primeiros e
 * descobre a regra — expande a partir de, não colapsa em.
 */
import './navbar.scss';
// o colapso e a gaveta de verdade, para o botão hambúrguer funcionar
import 'bootstrap/js/dist/collapse.js';
import 'bootstrap/js/dist/offcanvas.js';
import { criarPalco, posicaoDe } from '../../js/motor.js';

const wrapper = document.querySelector('[data-navbar-wrapper]');
const veredito = document.querySelector('[data-veredito]');
const codigo = document.querySelector('[data-codigo]');

let expand = 'lg';
let tipo = 'collapse';

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
};

const LINKS = ['Início', 'Cursos', 'Sobre', 'Contato'];

/**
 * Monta a navbar do zero.
 *
 * Os dois tipos compartilham a estrutura; o que muda é o invólucro
 * do menu e o data-bs-toggle do botão. Como o Bootstrap escuta o
 * clique por delegação no documento, trocar o HTML inteiro funciona
 * sem precisar reinicializar nada na mão.
 */
function montarNavbar() {
  const itens = LINKS.map(
    (texto, i) => `
      <li class="nav-item">
        <a class="nav-link ${i === 0 ? 'active' : ''}" href="#">${texto}</a>
      </li>`
  ).join('');

  const botao = `
    <button class="navbar-toggler" type="button"
            data-bs-toggle="${tipo}" data-bs-target="#menu"
            aria-controls="menu" aria-label="Abrir menu">
      <span class="navbar-toggler-icon"></span>
    </button>`;

  // Duas coisas importam neste HTML:
  //
  // 1. A gaveta responsiva leva SÓ a classe offcanvas-lg, sem a
  //    .offcanvas avulsa. Com as duas, a regra .navbar-expand-lg
  //    .offcanvas do Bootstrap — que existe para o caso NÃO
  //    responsivo — força visibility e transform com !important
  //    sempre que o navegador de verdade passa de 992px, e a gaveta
  //    aparece aberta no lugar errado.
  //
  // 2. No offcanvas o backdrop do Bootstrap seria anexado ao body e
  //    cobriria o laboratório inteiro, não o palco. Desligá-lo é
  //    opção legítima do componente e mantém a gaveta no palco.
  const menu =
    tipo === 'offcanvas'
      ? `
        <div class="offcanvas-${expand} offcanvas-end" id="menu"
             data-bs-backdrop="false" data-bs-scroll="true"
             tabindex="-1" aria-labelledby="menu-titulo">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="menu-titulo">Menu</h5>
            <!-- o data-bs-target aqui não é enfeite: sem a classe
                 .offcanvas avulsa, o botão de fechar do Bootstrap não
                 acha sozinho a gaveta a que pertence -->
            <button type="button" class="btn-close"
                    data-bs-dismiss="offcanvas" data-bs-target="#menu"
                    aria-label="Fechar"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav flex-grow-1">${itens}</ul>
            <a class="btn btn-primary btn-sm" href="#">Entrar</a>
          </div>
        </div>`
      : `
        <div class="collapse navbar-collapse" id="menu">
          <ul class="navbar-nav me-auto">${itens}</ul>
          <a class="btn btn-primary btn-sm" href="#">Entrar</a>
        </div>`;

  wrapper.innerHTML = `
    <nav class="navbar navbar-expand-${expand} bg-dark rounded">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">MinhaPágina</a>
        ${botao}
        ${menu}
      </div>
    </nav>`;
}

// -------------------------------------------------------------
//  Controles
// -------------------------------------------------------------
function ligarGrupo(seletor, aoEscolher) {
  const grupo = document.querySelector(seletor);

  grupo.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button');
    if (!botao) return;

    grupo.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    botao.classList.add('active');

    aoEscolher(botao.dataset.valor);
    montarNavbar();
    atualizar();
  });
}

ligarGrupo('[data-expand]', (v) => (expand = v));
ligarGrupo('[data-tipo]', (v) => (tipo = v));

// -------------------------------------------------------------
//  Palco
// -------------------------------------------------------------
montarNavbar();

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
    const nome = tipo === 'offcanvas' ? 'a gaveta' : 'o menu';

    veredito.innerHTML = expandida
      ? `<span class="veredito veredito--expandida">
           Expandida — a tela alcançou <code>${expand}</code>, os links aparecem em linha
         </span>`
      : `<span class="veredito veredito--colapsada">
           Colapsada — a tela ainda não chegou em <code>${expand}</code>, então ${nome} fica atrás do botão
         </span>`;

    const classeMenu =
      tipo === 'offcanvas'
        ? `offcanvas-${expand} offcanvas-end`
        : 'collapse navbar-collapse';

    codigo.innerHTML = [
      `<span class="tag">&lt;nav class=</span>"<span class="destaque">navbar navbar-expand-${expand}</span>"<span class="tag">&gt;</span>`,
      `  <span class="tag">&lt;button class=</span>"<span class="destaque">navbar-toggler</span>" <span class="tag">data-bs-toggle=</span>"<span class="destaque">${tipo}</span>"<span class="tag">&gt;</span>`,
      `  <span class="tag">&lt;div class=</span>"<span class="destaque">${classeMenu}</span>"<span class="tag">&gt;</span>`,
      `<span class="tag">&lt;/nav&gt;</span>`,
    ].join('\n');
  },
});
