/**
 * Montador de Componentes — Bootstrap 5
 *
 * Aqui o ganho não é movimento, é a ligação entre três coisas que o
 * aluno costuma ver separadas: a classe que ele liga, o HTML que isso
 * gera e o componente que aparece na tela.
 */
import './componentes.scss';
import 'bootstrap/js/dist/alert.js';

const VARIANTES = [
  { nome: 'primary', cor: '#6366f1' },
  { nome: 'secondary', cor: '#6c757d' },
  { nome: 'success', cor: '#198754' },
  { nome: 'danger', cor: '#dc3545' },
  { nome: 'warning', cor: '#ffc107' },
  { nome: 'info', cor: '#0dcaf0' },
  { nome: 'light', cor: '#f8f9fa' },
  { nome: 'dark', cor: '#212529' },
];

/** Atalho para montar a opção de cor, que é igual em todo componente. */
const opcaoCor = {
  id: 'variante',
  titulo: 'Cor (papel do tema)',
  tipo: 'escolha',
  padrao: 'primary',
  valores: VARIANTES.map((v) => ({
    valor: v.nome,
    rotulo: v.nome,
    cor: v.cor,
  })),
};

// -------------------------------------------------------------
//  Os componentes
//
//  classes(estado) → lista de classes, a primeira sendo a base
//  html(estado, classes) → o HTML final
// -------------------------------------------------------------
const COMPONENTES = [
  {
    id: 'botao',
    nome: 'Botão',
    opcoes: [
      opcaoCor,
      {
        id: 'estilo',
        titulo: 'Estilo',
        dica:
          'O de contorno pinta só a borda e o texto; o fundo fica transparente ' +
          'e só aparece no hover. Use-o para a ação secundária ao lado da ' +
          'principal — dois botões preenchidos lado a lado competem entre si.',
        tipo: 'escolha',
        padrao: 'solido',
        valores: [
          { valor: 'solido', rotulo: 'preenchido' },
          { valor: 'outline', rotulo: 'contorno' },
        ],
      },
      {
        id: 'tamanho',
        titulo: 'Tamanho',
        tipo: 'escolha',
        padrao: '',
        valores: [
          { valor: 'btn-sm', rotulo: 'btn-sm' },
          { valor: '', rotulo: 'normal' },
          { valor: 'btn-lg', rotulo: 'btn-lg' },
        ],
      },
      { id: 'pill', titulo: 'Formato', tipo: 'toggle', classe: 'rounded-pill', rotulo: 'rounded-pill' },
      { id: 'largura', titulo: 'Largura', tipo: 'toggle', classe: 'w-100', rotulo: 'w-100' },
      {
        id: 'estado',
        titulo: 'Estado',
        tipo: 'toggle',
        classe: 'disabled',
        rotulo: 'disabled',
        dica:
          'Em <button> o certo é o ATRIBUTO disabled, que além de apagar o ' +
          'visual impede o clique de verdade. A classe .disabled existe para ' +
          '<a>, que não aceita o atributo. Repare no código: aqui aparecem os ' +
          'dois.',
      },
    ],
    classes(estado) {
      const cor =
        estado.estilo === 'outline'
          ? `btn-outline-${estado.variante}`
          : `btn-${estado.variante}`;

      return ['btn', cor, estado.tamanho, estado.pill, estado.largura, estado.estado];
    },
    html(estado, classes) {
      const desativado = estado.estado ? ' disabled' : '';
      return `<button type="button" class="${classes}"${desativado}>Clique aqui</button>`;
    },
  },

  {
    id: 'alerta',
    nome: 'Alerta',
    opcoes: [
      opcaoCor,
      { id: 'titulo', titulo: 'Título', tipo: 'toggle', classe: 'sim', rotulo: 'alert-heading' },
      {
        id: 'fechar',
        titulo: 'Botão de fechar',
        tipo: 'toggle',
        classe: 'alert-dismissible',
        rotulo: 'alert-dismissible',
        dica:
          'Este é o único aqui que precisa do JavaScript do Bootstrap: sem ele ' +
          'o X aparece mas não fecha nada. O data-bs-dismiss é quem liga o ' +
          'botão ao componente.',
      },
    ],
    classes(estado) {
      return ['alert', `alert-${estado.variante}`, estado.fechar];
    },
    html(estado, classes) {
      const titulo = estado.titulo
        ? '\n  <h4 class="alert-heading">Atenção</h4>'
        : '';
      const botao = estado.fechar
        ? '\n  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>'
        : '';

      return `<div class="${classes}" role="alert">${titulo}\n  Sua inscrição foi registrada.${botao}\n</div>`;
    },
  },

  {
    id: 'badge',
    nome: 'Badge',
    opcoes: [
      opcaoCor,
      {
        id: 'contraste',
        titulo: 'Fundo e cor do texto',
        dica:
          'text-bg-* pinta o fundo E escolhe um texto que contraste. ' +
          'bg-* pinta só o fundo — experimente com warning ou light e veja o texto sumir.',
        tipo: 'escolha',
        padrao: 'text-bg',
        valores: [
          { valor: 'text-bg', rotulo: 'text-bg-*' },
          { valor: 'bg', rotulo: 'bg-*' },
        ],
      },
      { id: 'pill', titulo: 'Formato', tipo: 'toggle', classe: 'rounded-pill', rotulo: 'rounded-pill' },
    ],
    classes(estado) {
      return [
        'badge',
        `${estado.contraste}-${estado.variante}`,
        estado.pill,
      ];
    },
    html(estado, classes) {
      return `<span class="${classes}">Novo</span>`;
    },
  },

  {
    id: 'card',
    nome: 'Card',
    opcoes: [
      opcaoCor,
      {
        id: 'cabecalho',
        titulo: 'Cabeçalho',
        tipo: 'toggle',
        classe: 'sim',
        rotulo: 'card-header',
        dica:
          'O card é montado por partes: header, body e footer são divs com ' +
          'classe própria, não atributos. Você usa só as que precisar, e a ' +
          'ordem no HTML é a ordem na tela.',
      },
      { id: 'rodape', titulo: 'Rodapé', tipo: 'toggle', classe: 'sim', rotulo: 'card-footer' },
      { id: 'centro', titulo: 'Alinhamento', tipo: 'toggle', classe: 'text-center', rotulo: 'text-center' },
    ],
    classes(estado) {
      return ['card', `border-${estado.variante}`, estado.centro];
    },
    html(estado, classes) {
      const cabecalho = estado.cabecalho
        ? `\n  <div class="card-header">Curso</div>`
        : '';
      const rodape = estado.rodape
        ? `\n  <div class="card-footer texto-fraco">Atualizado hoje</div>`
        : '';

      return (
        `<div class="${classes}">${cabecalho}\n` +
        `  <div class="card-body">\n` +
        `    <h5 class="card-title">Desenvolvimento Web</h5>\n` +
        `    <p class="card-text">Bootstrap, grid e componentes.</p>\n` +
        `    <a href="#" class="btn btn-${estado.variante}">Inscrever</a>\n` +
        `  </div>${rodape}\n</div>`
      );
    },
  },
];

// -------------------------------------------------------------
//  Estado
// -------------------------------------------------------------
let atual = COMPONENTES[0];
let estado = {};

/** Volta todas as opções do componente para o padrão. */
function reiniciarEstado() {
  estado = {};
  atual.opcoes.forEach((opcao) => {
    estado[opcao.id] = opcao.tipo === 'toggle' ? '' : opcao.padrao;
  });
}

const abas = document.querySelector('[data-componentes]');
const painelOpcoes = document.querySelector('[data-opcoes]');
const vitrine = document.querySelector('[data-vitrine]');
const codigo = document.querySelector('[data-codigo]');

// -------------------------------------------------------------
//  Abas de componente
// -------------------------------------------------------------
abas.innerHTML = COMPONENTES.map(
  (c, i) => `
    <button type="button" class="btn btn-outline-light ${i === 0 ? 'active' : ''}"
            data-componente="${c.id}">${c.nome}</button>`
).join('');

abas.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  abas.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
  botao.classList.add('active');

  atual = COMPONENTES.find((c) => c.id === botao.dataset.componente);
  reiniciarEstado();
  montarOpcoes();
  atualizar();
});

// -------------------------------------------------------------
//  Painéis de opção
// -------------------------------------------------------------
function montarOpcoes() {
  painelOpcoes.innerHTML = atual.opcoes
    .map((opcao) => {
      const botoes =
        opcao.tipo === 'toggle'
          ? `<button type="button" class="btn btn-sm btn-outline-light"
                     data-opcao="${opcao.id}" data-valor="${opcao.classe}">
               ${opcao.rotulo}
             </button>`
          : opcao.valores
              .map((v) => {
                const amostra = v.cor
                  ? `<span class="amostra" style="background:${v.cor}"></span>`
                  : '';
                const ativo = v.valor === opcao.padrao ? 'active' : '';
                return `<button type="button" class="btn btn-sm btn-outline-light ${ativo}"
                                data-opcao="${opcao.id}" data-valor="${v.valor}">
                          ${amostra}${v.rotulo}
                        </button>`;
              })
              .join('');

      const dica = opcao.dica
        ? `<p class="opcao__dica">${opcao.dica}</p>`
        : '';

      return `
        <div class="col-12 col-md-6">
          <p class="opcao__titulo">${opcao.titulo}</p>
          <div class="d-flex flex-wrap gap-2">${botoes}</div>
          ${dica}
        </div>`;
    })
    .join('');
}

painelOpcoes.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { opcao: id, valor } = botao.dataset;
  const opcao = atual.opcoes.find((o) => o.id === id);

  if (opcao.tipo === 'toggle') {
    // liga e desliga
    estado[id] = estado[id] ? '' : valor;
    botao.classList.toggle('active', Boolean(estado[id]));
  } else {
    // só um da família fica ativo
    painelOpcoes
      .querySelectorAll(`[data-opcao="${id}"]`)
      .forEach((b) => b.classList.remove('active'));
    botao.classList.add('active');
    estado[id] = valor;
  }

  atualizar();
});

// -------------------------------------------------------------
//  Destaque do código
//
//  Regra: em cada class="...", a primeira classe é a base do
//  componente (rosa) e as seguintes são modificadores (verde).
// -------------------------------------------------------------
function escapar(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function destacar(html) {
  return escapar(html).replace(/class="([^"]*)"/g, (_, lista) => {
    const partes = lista
      .split(' ')
      .filter(Boolean)
      .map((classe, i) =>
        i === 0
          ? `<span class="base">${classe}</span>`
          : `<span class="mod">${classe}</span>`
      );

    return `<span class="tag">class=</span>"${partes.join(' ')}"`;
  });
}

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar() {
  const classes = atual.classes(estado).filter(Boolean).join(' ');
  const html = atual.html(estado, classes);

  vitrine.innerHTML = html;
  codigo.innerHTML = destacar(html);
}

document.querySelector('[data-copiar]').addEventListener('click', async (e) => {
  const classes = atual.classes(estado).filter(Boolean).join(' ');

  await navigator.clipboard.writeText(atual.html(estado, classes));

  const botao = e.currentTarget;
  botao.textContent = 'Copiado!';
  setTimeout(() => (botao.textContent = 'Copiar'), 1500);
});

reiniciarEstado();
montarOpcoes();
atualizar();
