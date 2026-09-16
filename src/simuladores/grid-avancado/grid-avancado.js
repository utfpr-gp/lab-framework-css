/**
 * Simulador de Grid Avançado — Bootstrap 5
 *
 * Quatro blocos, três sliders cada: quanto ocupa, quanto empurra
 * (offset) e em que ordem aparece (order). A soma das 12 colunas fica
 * visível o tempo todo — quando passa de 12, a linha quebra na frente
 * do aluno.
 */
import './grid-avancado.scss';
import { animarMudanca } from '../../js/motor.js';

// O slider de largura vai de 0 a 13: os extremos são os dois casos
// especiais do Bootstrap, o miolo são as 12 colunas.
const AUTO_LAYOUT = 0;
const AUTO_CONTEUDO = 13;

const PADRAO = [
  { largura: 3, offset: 0, order: 0 },
  { largura: 3, offset: 0, order: 0 },
  { largura: 3, offset: 0, order: 0 },
  { largura: 3, offset: 0, order: 0 },
];

let blocos = PADRAO.map((b) => ({ ...b }));

const painelControles = document.querySelector('[data-controles]');
const linha = document.querySelector('[data-linha]');
const somaTexto = document.querySelector('[data-soma-texto]');
const codigo = document.querySelector('[data-codigo]');

/** Traduz o valor do slider na classe de largura correspondente. */
function classeLargura(valor) {
  if (valor === AUTO_LAYOUT) return 'col';
  if (valor === AUTO_CONTEUDO) return 'col-auto';
  return `col-${valor}`;
}

/** Explica em português o que aquela largura faz. */
function explicacaoLargura(valor) {
  if (valor === AUTO_LAYOUT) return 'divide o espaço que sobrar';
  if (valor === AUTO_CONTEUDO) return 'só a largura do conteúdo';
  return `${valor} de 12 colunas`;
}

/** Monta a lista de classes de um bloco. */
function classesDe(bloco) {
  const classes = [classeLargura(bloco.largura)];
  if (bloco.offset > 0) classes.push(`offset-${bloco.offset}`);
  if (bloco.order > 0) classes.push(`order-${bloco.order}`);
  return classes;
}

// -------------------------------------------------------------
//  Painéis de controle
// -------------------------------------------------------------
function montarControles() {
  painelControles.innerHTML = blocos
    .map(
      (bloco, i) => `
      <div class="col-12 col-md-6 col-xl-3">
        <div class="painel controle controle--${i + 1} p-3 h-100" data-bloco="${i}">
          <h3 class="h6 fw-bold mb-3">Bloco ${i + 1}</h3>

          <label for="largura-${i}">Largura</label>
          <input type="range" class="form-range" id="largura-${i}"
                 min="0" max="13" step="1" value="${bloco.largura}"
                 data-campo="largura" />
          <p class="small mb-3">
            <span class="mono fw-semibold" data-saida="classe">col</span>
            <span class="texto-fraco d-block" data-saida="explicacao"></span>
          </p>

          <label for="offset-${i}">Offset (empurra para a direita)</label>
          <input type="range" class="form-range" id="offset-${i}"
                 min="0" max="6" step="1" value="${bloco.offset}"
                 data-campo="offset" />
          <p class="small mono mb-3" data-saida="offset">nenhum</p>

          <label for="order-${i}">Order (ordem visual)</label>
          <input type="range" class="form-range" id="order-${i}"
                 min="0" max="5" step="1" value="${bloco.order}"
                 data-campo="order" />
          <p class="small mono mb-0" data-saida="order">ordem do HTML</p>
        </div>
      </div>`
    )
    .join('');

  painelControles.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('input', () => {
      const i = Number(input.closest('[data-bloco]').dataset.bloco);
      blocos[i][input.dataset.campo] = Number(input.value);
      atualizar();
    });
  });
}

// -------------------------------------------------------------
//  Blocos no palco
// -------------------------------------------------------------
function montarBlocos() {
  linha.innerHTML = blocos
    .map(
      (_, i) => `
      <div>
        <div class="bloco bloco--${i + 1}">
          ${i + 1}
          <span class="bloco__classe"></span>
        </div>
      </div>`
    )
    .join('');
}

// -------------------------------------------------------------
//  Soma das colunas
// -------------------------------------------------------------
function descreverSoma() {
  let fixas = 0;
  let flexiveis = 0;

  blocos.forEach((bloco) => {
    fixas += bloco.offset;
    if (bloco.largura === AUTO_LAYOUT || bloco.largura === AUTO_CONTEUDO) {
      flexiveis += 1;
    } else {
      fixas += bloco.largura;
    }
  });

  const estourou = fixas > 12;
  let texto = `Soma: ${fixas} de 12`;

  if (flexiveis > 0) {
    texto += ` + ${flexiveis} flexível${flexiveis > 1 ? 'is' : ''}`;
  }
  if (estourou) {
    texto += ' → não cabe tudo em uma linha';
  }

  return { texto, estourou };
}

// -------------------------------------------------------------
//  Código gerado
// -------------------------------------------------------------
function montarCodigo() {
  const linhas = blocos.map((bloco, i) => {
    const classes = classesDe(bloco).join(' ');
    return (
      `  <span class="tag">&lt;div class=</span>` +
      `"<span class="destaque">${classes}</span>"<span class="tag">&gt;</span>` +
      `${i + 1}<span class="tag">&lt;/div&gt;</span>`
    );
  });

  codigo.innerHTML = [
    '<span class="tag">&lt;div class=</span>"<span class="destaque">row</span>"<span class="tag">&gt;</span>',
    ...linhas,
    '<span class="tag">&lt;/div&gt;</span>',
  ].join('\n');
}

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar() {
  const colunas = [...linha.children];

  animarMudanca(colunas, () => {
    blocos.forEach((bloco, i) => {
      colunas[i].className = classesDe(bloco).join(' ');
      colunas[i].querySelector('.bloco__classe').textContent =
        classesDe(bloco).join(' ');
    });
  });

  // Textos de cada painel de controle
  painelControles.querySelectorAll('[data-bloco]').forEach((painel, i) => {
    const bloco = blocos[i];
    const saida = (nome) => painel.querySelector(`[data-saida="${nome}"]`);

    saida('classe').textContent = classeLargura(bloco.largura);
    saida('explicacao').textContent = explicacaoLargura(bloco.largura);
    saida('offset').textContent =
      bloco.offset > 0 ? `offset-${bloco.offset}` : 'nenhum';
    saida('order').textContent =
      bloco.order > 0 ? `order-${bloco.order}` : 'ordem do HTML';
  });

  const soma = descreverSoma();
  somaTexto.textContent = soma.texto;
  somaTexto.classList.toggle('estourou', soma.estourou);

  montarCodigo();
}

document.querySelector('[data-reiniciar]').addEventListener('click', () => {
  blocos = PADRAO.map((b) => ({ ...b }));
  montarControles();
  atualizar();
});

montarControles();
montarBlocos();
atualizar();
