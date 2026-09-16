/**
 * Simulador de Flexbox — Bootstrap 5
 *
 * Os eixos são desenhados por cima da caixa e giram junto com o
 * flex-direction. É a peça que falta para entender por que
 * justify-content "muda de lado" quando a direção vira column.
 */
import './flexbox.scss';
import { animarMudanca } from '../../js/motor.js';

// Cada grupo vira uma fileira de botões. O valor é a classe do Bootstrap.
const OPCOES = [
  {
    id: 'direcao',
    titulo: 'flex-direction',
    padrao: 'flex-row',
    valores: ['flex-row', 'flex-column'],
  },
  {
    id: 'justify',
    titulo: 'justify-content · eixo principal',
    padrao: 'justify-content-start',
    valores: [
      'justify-content-start',
      'justify-content-center',
      'justify-content-end',
      'justify-content-between',
      'justify-content-around',
      'justify-content-evenly',
    ],
  },
  {
    id: 'align',
    titulo: 'align-items · eixo cruzado',
    padrao: 'align-items-stretch',
    valores: [
      'align-items-stretch',
      'align-items-start',
      'align-items-center',
      'align-items-end',
    ],
  },
  {
    id: 'wrap',
    titulo: 'flex-wrap',
    padrao: 'flex-nowrap',
    valores: ['flex-nowrap', 'flex-wrap'],
  },
];

const caixa = document.querySelector('[data-caixa]');
const eixos = document.querySelector('[data-eixos]');
const codigo = document.querySelector('[data-codigo]');
const painel = document.querySelector('[data-controles]');
const sliderItens = document.getElementById('itens');
const sliderLargura = document.getElementById('largura-item');
const total = document.querySelector('[data-total]');
const saidaLargura = document.querySelector('[data-largura-item]');
const situacao = document.querySelector('[data-situacao]');

let estado = {};

function reiniciarEstado() {
  estado = {};
  OPCOES.forEach((o) => (estado[o.id] = o.padrao));
}

// -------------------------------------------------------------
//  Botões
// -------------------------------------------------------------
function montarControles() {
  painel.innerHTML = OPCOES.map(
    (opcao) => `
      <div class="col-12 col-lg-6">
        <p class="opcao__titulo">${opcao.titulo}</p>
        <div class="d-flex flex-wrap gap-2">
          ${opcao.valores
            .map(
              (v) => `
              <button type="button"
                      class="btn btn-sm btn-outline-light ${
                        v === estado[opcao.id] ? 'active' : ''
                      }"
                      data-opcao="${opcao.id}" data-valor="${v}">
                ${v}
              </button>`
            )
            .join('')}
        </div>
      </div>`
  ).join('');
}

painel.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { opcao: id, valor } = botao.dataset;

  painel
    .querySelectorAll(`[data-opcao="${id}"]`)
    .forEach((b) => b.classList.remove('active'));
  botao.classList.add('active');

  estado[id] = valor;
  atualizar();
});

// -------------------------------------------------------------
//  Itens da caixa
// -------------------------------------------------------------
function montarItens() {
  const quantidade = Number(sliderItens.value);
  const atuais = caixa.children.length;

  // só cria ou remove a diferença, para não recriar o que já está lá
  for (let i = atuais; i < quantidade; i++) {
    const item = document.createElement('div');
    item.className = `item item--${i + 1}`;
    item.textContent = i + 1;
    caixa.appendChild(item);
  }
  while (caixa.children.length > quantidade) {
    caixa.lastElementChild.remove();
  }

  total.textContent = quantidade;
}

sliderItens.addEventListener('input', () => {
  montarItens();
  atualizar();
});

sliderLargura.addEventListener('input', atualizar);

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function classesAtuais() {
  return ['d-flex', ...OPCOES.map((o) => estado[o.id])];
}

/**
 * Diz o que aconteceu com o espaço: coube, quebrou em faixas ou
 * transbordou. É isto que torna flex-wrap visível — sem apertar os
 * itens, wrap e nowrap dão exatamente na mesma.
 *
 * Tudo aqui é medido com offsetLeft/offsetTop, que são posições de
 * layout. scrollWidth também serviria, mas ele conta o transform que
 * a animação aplica nos itens — e aí a leitura sai errada no meio da
 * animação.
 */
function descreverSituacao(itens) {
  if (!itens.length) return;

  const coluna = estado.direcao === 'flex-column';
  const eixo = (el) => (coluna ? el.offsetTop : el.offsetLeft);
  const tamanho = (el) => (coluna ? el.offsetHeight : el.offsetWidth);

  // quantas faixas distintas os itens ocupam no eixo cruzado
  const faixas = new Set(
    itens.map((el) => (coluna ? el.offsetLeft : el.offsetTop))
  ).size;

  // offsetLeft/Top são medidos a partir da borda interna do pai,
  // então o limite é o padding de um lado até clientWidth menos o outro
  const estilo = getComputedStyle(caixa);
  const padInicio = parseFloat(coluna ? estilo.paddingTop : estilo.paddingLeft);
  const padFim = parseFloat(coluna ? estilo.paddingBottom : estilo.paddingRight);
  const limite = (coluna ? caixa.clientHeight : caixa.clientWidth) - padFim;

  const inicio = Math.min(...itens.map(eixo));
  const fim = Math.max(...itens.map((el) => eixo(el) + tamanho(el)));
  const transbordou = fim > limite + 1 || inicio < padInicio - 1;

  let texto;
  let tipo;

  if (transbordou) {
    texto =
      'Transbordou: com flex-nowrap os itens não quebram, eles saem da caixa. Ligue flex-wrap ou diminua a largura.';
    tipo = 'transbordou';
  } else if (faixas > 1) {
    texto = `Quebrou em ${faixas} ${coluna ? 'colunas' : 'linhas'}: o flex-wrap está fazendo efeito.`;
    tipo = 'quebrou';
  } else {
    texto =
      'Tudo cabe numa faixa só — aqui flex-wrap e flex-nowrap dão no mesmo. Aumente a quantidade ou a largura dos itens para ver a diferença.';
    tipo = 'cabe';
  }

  situacao.innerHTML = `<span class="situacao situacao--${tipo}">${texto}</span>`;
}

function atualizar() {
  const itens = [...caixa.children];
  const largura = Number(sliderLargura.value);

  animarMudanca(itens, () => {
    caixa.className = `caixa-flex ${classesAtuais().join(' ')}`;
    caixa.style.setProperty('--largura-item', `${largura}px`);
    descreverSituacao(itens);
  });

  // Os eixos giram junto com a direção
  eixos.dataset.direcao =
    estado.direcao === 'flex-column' ? 'column' : 'row';

  saidaLargura.textContent = `${largura}px`;

  codigo.innerHTML =
    `<span class="tag">&lt;div class=</span>` +
    `"<span class="destaque">${classesAtuais().join(' ')}</span>"` +
    `<span class="tag">&gt;</span>`;
}

document.querySelector('[data-reiniciar]').addEventListener('click', () => {
  reiniciarEstado();
  sliderItens.value = '4';
  sliderLargura.value = '110';
  montarControles();
  montarItens();
  atualizar();
});

reiniciarEstado();
montarControles();
montarItens();
atualizar();
