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

/**
 * O que cada direção mexe — e por qual mecanismo.
 *
 * A pergunta que sempre aparece é por que gy parece não fazer nada
 * em algumas telas: é que ele age no espaço ENTRE fileiras, e com
 * uma fileira só não há entre nenhum.
 */
const DIRECAO = {
  g: {
    titulo: 'g-*',
    texto:
      'Mexe nos dois eixos de uma vez. Na horizontal vira padding nas ' +
      'colunas (metade de cada lado) mais margem negativa na row; na ' +
      'vertical vira margem no topo de cada coluna. É o que você quer ' +
      'na maioria dos casos.',
  },
  gx: {
    titulo: 'gx-*',
    texto:
      'Só o eixo horizontal: o espaço entre colunas lado a lado. Feito ' +
      'com padding nas colunas e margem negativa na row, para as pontas ' +
      'continuarem alinhadas com o resto da página.',
  },
  gy: {
    titulo: 'gy-*',
    texto:
      'Só o eixo vertical: o espaço entre uma fileira e a de baixo. ' +
      'Feito com margin-top em cada coluna — valor inteiro, não metade. ' +
      'Se todas as colunas couberem numa fileira só, não há o que ' +
      'separar e ele parece não fazer nada. Diminua a tela para ver.',
  },
};

const estado = { degrau: 3, direcao: 'g', pintura: 'interna' };

const slider = document.getElementById('degrau');
const linha = document.querySelector('[data-linha]');
const container = document.querySelector('.demo-container');
const marcas = document.querySelector('[data-escala]');
const nota = document.querySelector('[data-nota]');
const codigo = document.querySelector('[data-codigo]');
const explicacao = document.querySelector('[data-explicacao]');

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

  // gx só mexe no horizontal e gy só no vertical. O eixo que não foi
  // tocado fica no padrão do Bootstrap — e os padrões são DIFERENTES:
  // --bs-gutter-x nasce em 1.5rem, --bs-gutter-y nasce em 0.
  const PADRAO_X = 24;
  const PADRAO_Y = 0;
  const horizontal = estado.direcao === 'gy' ? PADRAO_X : px;
  const vertical = estado.direcao === 'gx' ? PADRAO_Y : px;

  saida.classe.textContent = classeAtual();
  saida.px.textContent = `${horizontal}px na horizontal, ${vertical}px na vertical`;
  saida.metade.textContent =
    `${horizontal / 2}px de padding em cada coluna · ` +
    `${vertical}px de margem no topo de cada uma`;

  const escolha = DIRECAO[estado.direcao];
  explicacao.innerHTML = `<strong>${escolha.titulo}</strong><br />${escolha.texto}`;

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
