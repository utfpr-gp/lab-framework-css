/**
 * Simulador de Vazamento Horizontal — Bootstrap 5
 *
 * O aluno liga cada causa clássica de vazamento e vê, ao vivo, a
 * conta que um profissional faz no DevTools: a borda direita de cada
 * elemento contra a borda direita do container.
 */
import './vazamento.scss';
import { criarPalco, aposAcalmar } from '../../js/motor.js';

const CAUSAS = [
  {
    id: 'fixa',
    nome: 'Largura fixa em pixels',
    detalhe: 'width: 900px',
    correcao: 'max-width: 100% (ou usar col-*)',
  },
  {
    id: 'palavra',
    nome: 'Palavra longa sem quebra',
    detalhe: 'uma URL gigante num parágrafo',
    correcao: 'classe .text-break',
  },
  {
    id: 'imagem',
    nome: 'Imagem sem img-fluid',
    detalhe: 'imagem de 1200px de largura',
    correcao: 'classe .img-fluid',
  },
  {
    id: 'tabela',
    nome: 'Tabela larga solta',
    detalhe: '7 colunas num celular',
    correcao: 'envolver em .table-responsive',
  },
  {
    id: 'viewport',
    nome: '100vw dentro de pai com padding',
    detalhe: 'vw ignora o padding do pai',
    correcao: 'usar width: 100% em vez de 100vw',
  },
];

// Uma imagem larga de verdade, gerada aqui para não depender de rede
const IMAGEM = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="260">
     <rect width="1200" height="260" fill="#334155"/>
     <text x="600" y="140" text-anchor="middle" fill="#cbd5e1"
           font-family="monospace" font-size="34">imagem de 1200px</text>
   </svg>`
)}`;

const ligadas = new Set();
let corrigir = false;

const palco = document.querySelector('[data-palco]');
const pagina = document.querySelector('[data-pagina]');
const painelCausas = document.querySelector('[data-causas]');
const veredito = document.querySelector('[data-veredito]');
const listaCulpados = document.querySelector('[data-culpados]');
const botaoCorrigir = document.querySelector('[data-corrigir]');

document.querySelector('[data-imagem]').src = IMAGEM;

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
};

// -------------------------------------------------------------
//  Painel de causas
// -------------------------------------------------------------
painelCausas.innerHTML = CAUSAS.map(
  (c) => `
    <div class="col-12 col-lg-6">
      <button type="button" class="causa" data-causa="${c.id}">
        <span class="causa__marca"></span>
        <span>
          <span class="causa__nome">${c.nome}</span>
          <span class="causa__fix">${c.detalhe}</span>
        </span>
      </button>
    </div>`
).join('');

painelCausas.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-causa]');
  if (!botao) return;

  const id = botao.dataset.causa;
  if (ligadas.has(id)) ligadas.delete(id);
  else ligadas.add(id);

  atualizar();
});

botaoCorrigir.addEventListener('click', () => {
  corrigir = !corrigir;
  botaoCorrigir.textContent = corrigir
    ? 'Desfazer as correções'
    : 'Aplicar as correções';
  botaoCorrigir.classList.toggle('btn-success', !corrigir);
  botaoCorrigir.classList.toggle('btn-outline-success', corrigir);
  atualizar();
});

// -------------------------------------------------------------
//  Liga e desliga cada causa no palco
// -------------------------------------------------------------
function aplicarCausas() {
  CAUSAS.forEach((c) => {
    document.querySelector(`[data-bloco="${c.id}"]`).hidden = !ligadas.has(c.id);
  });

  // As correções que são classe do Bootstrap
  const paragrafo = document.querySelector('.alvo-palavra');
  paragrafo.classList.toggle('text-break', corrigir);

  const imagem = document.querySelector('[data-imagem]');
  imagem.className = corrigir ? 'img-fluid' : '';

  const envolve = document.querySelector('[data-envolve-tabela]');
  envolve.className = corrigir ? 'table-responsive' : '';

  // As correções que são CSS próprio (largura fixa e 100vw)
  pagina.classList.toggle('corrigido', corrigir);
}

// -------------------------------------------------------------
//  A conta que o DevTools faz
//
//  Percorre os descendentes e compara a borda direita de cada um com
//  a borda direita do container. Quem passar, é culpado. Só o
//  elemento mais externo de cada ramo é reportado, senão a lista
//  encheria de filhos que só vazam porque o pai vaza.
// -------------------------------------------------------------
function acharCulpados() {
  const limite = pagina.getBoundingClientRect().right;
  const culpados = [];

  /** Um elemento com rolagem própria segura o transbordo dele. */
  const contemSozinho = (el) => {
    const overflow = getComputedStyle(el).overflowX;
    return overflow === 'auto' || overflow === 'scroll' || overflow === 'hidden';
  };

  const visitar = (elemento) => {
    for (const filho of elemento.children) {
      if (filho.hidden) continue;

      const caixa = filho.getBoundingClientRect();

      // 1px de tolerância para arredondamento do navegador
      if (caixa.right > limite + 1) {
        culpados.push({
          elemento: filho,
          excesso: Math.round(caixa.right - limite),
        });
        // não desce mais neste ramo: o pai já explica o vazamento
        continue;
      }

      // É exatamente isto que .table-responsive faz: a tabela lá
      // dentro continua larga, mas quem rola é o invólucro, não a
      // página. Então não é vazamento e não se desce mais aqui.
      if (contemSozinho(filho)) continue;

      visitar(filho);
    }
  };

  visitar(pagina);
  return culpados;
}

/** Um nome curto e legível para o elemento, como no DevTools. */
function identificar(el) {
  const tag = el.tagName.toLowerCase();
  const classes = [...el.classList]
    .filter((c) => c !== 'vazando')
    .map((c) => `.${c}`)
    .join('');
  return classes ? `${tag}${classes}` : tag;
}

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar({ largura } = {}) {
  aplicarCausas();

  // Estado visual dos botões de causa
  CAUSAS.forEach((c) => {
    const botao = painelCausas.querySelector(`[data-causa="${c.id}"]`);
    const ligada = ligadas.has(c.id);

    botao.classList.toggle('ligada', ligada);
    botao.classList.toggle('corrigida', ligada && corrigir);
    botao.querySelector('.causa__marca').textContent = ligada ? '✓' : '';
    botao.querySelector('.causa__fix').textContent =
      ligada && corrigir ? `corrigido com ${c.correcao}` : c.detalhe;
  });

  diagnosticarDepois();
}

// O palco leva 0.3s para chegar na largura nova. Medir antes disso
// acusa a largura do meio da animação — e o diagnóstico sai errado.
const diagnosticarDepois = aposAcalmar(() => {
  {
    pagina
      .querySelectorAll('.vazando')
      .forEach((el) => el.classList.remove('vazando'));

    const culpados = acharCulpados();
    culpados.forEach((c) => c.elemento.classList.add('vazando'));

    if (!culpados.length) {
      veredito.innerHTML =
        '<span class="veredito veredito--ok">Nada vaza: tudo cabe na largura da tela.</span>';
      listaCulpados.innerHTML = ligadas.size
        ? '<p class="small texto-fraco mb-0">As causas ligadas estão contidas nesta largura. Diminua a tela para ver quais delas quebram primeiro.</p>'
        : '<p class="small texto-fraco mb-0">Ligue uma causa acima para começar.</p>';
      return;
    }

    const pior = Math.max(...culpados.map((c) => c.excesso));
    veredito.innerHTML = `<span class="veredito veredito--vazou">
      Vazou: ${culpados.length} elemento${culpados.length > 1 ? 's passam' : ' passa'}
      da borda direita, o pior em ${pior}px.
    </span>`;

    listaCulpados.innerHTML = culpados
      .map(
        (c) => `
        <div class="culpado">
          <strong>${identificar(c.elemento)}</strong> — ultrapassa em ${c.excesso}px
        </div>`
      )
      .join('');
  }
});

criarPalco({
  slider: document.getElementById('largura'),
  janela: document.querySelector('[data-janela]'),
  palco,
  regua: document.querySelector('[data-regua]'),

  aoAtualizar({ largura, bp }) {
    saida.largura.textContent = largura;
    saida.sigla.textContent = bp.sigla;
    saida.regra.textContent =
      bp.min === 0 ? 'padrão, sem media query' : `a partir de ${bp.min}px`;

    // a causa do 100vw precisa saber a largura simulada
    palco.style.setProperty('--tela', `${largura}px`);

    atualizar({ largura });
  },
});
