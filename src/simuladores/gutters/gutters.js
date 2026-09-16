/**
 * Simulador de Gutters — Bootstrap 5
 *
 * Cada camada do gutter recebe uma cor: o container, a .row (que vaza
 * para fora por causa da margem negativa), o padding da coluna e o
 * conteúdo. Mudando o degrau dá para ver as três camadas crescendo.
 */
import './gutters.scss';

// A mesma escala do espaçamento: múltiplos de $spacer (1rem)
const ESCALA = [0, 0.25, 0.5, 1, 1.5, 3];
const REM_EM_PX = 16;
const COLUNAS = 4;

const estado = { degrau: 3, direcao: 'g', pintura: 'interna' };

const slider = document.getElementById('degrau');
const linha = document.querySelector('[data-linha]');
const container = document.querySelector('.demo-container');
const marcas = document.querySelector('[data-escala]');
const nota = document.querySelector('[data-nota]');
const codigo = document.querySelector('[data-codigo]');

const saida = {
  classe: document.querySelector('[data-classe]'),
  px: document.querySelector('[data-valor-px]'),
  metade: document.querySelector('[data-valor-metade]'),
};

/** A classe que o estado atual gera. */
function classeAtual() {
  return `${estado.direcao}-${estado.degrau}`;
}

// Marcas embaixo do slider
marcas.innerHTML = ESCALA.map(
  (_, i) => `<span style="left:${(i / 5) * 100}%" data-degrau="${i}">${i}</span>`
).join('');

// -------------------------------------------------------------
//  Botões
// -------------------------------------------------------------
function ligarBotoes(seletor, campo) {
  const grupo = document.querySelector(seletor);

  grupo.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button');
    if (!botao) return;

    grupo.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    botao.classList.add('active');

    estado[campo] = botao.dataset.valor;
    atualizar();
  });
}

ligarBotoes('[data-direcao]', 'direcao');
ligarBotoes('[data-pintura]', 'pintura');

slider.addEventListener('input', () => {
  estado.degrau = Number(slider.value);
  atualizar();
});

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function montarColunas() {
  const interna = estado.pintura === 'interna';

  linha.innerHTML = Array.from({ length: COLUNAS }, (_, i) =>
    interna
      ? `<div class="col-6 col-lg-3"><div class="bloco">${i + 1}</div></div>`
      : `<div class="col-6 col-lg-3">${i + 1}</div>`
  ).join('');
}

function montarCodigo() {
  const interna = estado.pintura === 'interna';

  const coluna = interna
    ? `  <span class="tag">&lt;div class=</span>"<span class="destaque">col-6 col-lg-3</span>"<span class="tag">&gt;</span>\n` +
      `    <span class="tag">&lt;div class=</span>"<span class="destaque">bloco</span>"<span class="tag">&gt;</span>1<span class="tag">&lt;/div&gt;</span>\n` +
      `  <span class="tag">&lt;/div&gt;</span>`
    : `  <span class="tag">&lt;div class=</span>"<span class="destaque">col-6 col-lg-3 bloco</span>"<span class="tag">&gt;</span>1<span class="tag">&lt;/div&gt;</span>`;

  codigo.innerHTML =
    `<span class="tag">&lt;div class=</span>"<span class="destaque">row ${classeAtual()}</span>"<span class="tag">&gt;</span>\n` +
    `${coluna}\n` +
    `  <span class="tag">&lt;!-- ... --&gt;</span>\n` +
    `<span class="tag">&lt;/div&gt;</span>`;
}

function atualizar() {
  const valor = ESCALA[estado.degrau];
  const px = valor * REM_EM_PX;

  linha.className = `row ${classeAtual()}`;
  montarColunas();

  // Pinta o padding só quando dá para vê-lo (fundo na div interna)
  const interna = estado.pintura === 'interna';
  container.classList.toggle('pinta-padding', interna);
  container.classList.toggle('pinta-coluna', !interna);

  // gx só mexe no horizontal, gy só no vertical — o outro fica no
  // padrão do Bootstrap, que é 1.5rem
  const PADRAO_PX = 24;
  const horizontal = estado.direcao === 'gy' ? PADRAO_PX : px;
  const vertical = estado.direcao === 'gx' ? PADRAO_PX : px;

  saida.classe.textContent = classeAtual();
  saida.px.textContent = `${horizontal}px na horizontal, ${vertical}px na vertical`;
  saida.metade.textContent = `${horizontal / 2}px de padding em cada coluna`;

  marcas.querySelectorAll('span').forEach((m) => {
    m.classList.toggle('ativo', Number(m.dataset.degrau) === estado.degrau);
  });

  if (interna) {
    nota.textContent =
      'O fundo está na div interna: o padding amarelo fica de fora e vira o espaço entre os blocos.';
    nota.className = 'small mb-0 mt-3 nota-ok';
  } else {
    nota.textContent =
      px === 0
        ? 'Com gutter 0 até dá certo — mas some o espaço. É por isso que g-0 costuma vir junto dessa escolha.'
        : 'O fundo está na própria .col: ele ocupa também o padding, então os blocos encostam e o gutter some da vista.';
    nota.className = 'small mb-0 mt-3 nota-erro';
  }

  montarCodigo();
}

atualizar();
