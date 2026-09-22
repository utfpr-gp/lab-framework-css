/**
 * Simulador de Formulário Responsivo — Bootstrap 5
 *
 * Junta tudo: o grid decide quantos campos cabem por linha, os
 * utilitários cuidam do resto e os componentes de formulário entram
 * dentro das colunas.
 */
import './formulario.scss';
import { criarPalco } from '../../js/motor.js';

const CAMPOS = [
  { id: 'nome', rotulo: 'Nome completo', tipo: 'text', dica: 'Maria Silva' },
  { id: 'email', rotulo: 'E-mail', tipo: 'email', dica: 'maria@escola.br' },
  { id: 'telefone', rotulo: 'Telefone', tipo: 'tel', dica: '(42) 90000-0000' },
  { id: 'curso', rotulo: 'Curso', tipo: 'select', opcoes: ['Web', 'Redes', 'Dados'] },
  { id: 'cidade', rotulo: 'Cidade', tipo: 'text', dica: 'Guarapuava' },
  { id: 'nascimento', rotulo: 'Nascimento', tipo: 'date' },
];

const estado = {
  layout: 'col-12 col-md-6',
  rotulo: 'acima',
  validacao: '',
};

/**
 * Explicação de cada escolha. Duas delas têm pegadinha de verdade:
 * a inversão de ordem do form-floating e o fato de is-valid /
 * is-invalid serem só classes, sem nenhuma validação por trás.
 */
const EXPLICACAO = {
  rotulo: {
    acima: {
      titulo: 'label em cima',
      texto:
        'O jeito tradicional: <code>&lt;label&gt;</code> com a classe ' +
        '<code>form-label</code>, depois o campo. O atributo ' +
        '<code>for</code> tem que apontar para o <code>id</code> do campo — ' +
        'é isso que faz clicar no rótulo focar o campo e que permite ao ' +
        'leitor de tela anunciar os dois juntos.',
    },
    flutuante: {
      titulo: 'form-floating',
      texto:
        'O rótulo começa dentro do campo e sobe quando há conteúdo. Repare ' +
        'no código: aqui o <code>&lt;input&gt;</code> vem ANTES do ' +
        '<code>&lt;label&gt;</code>, ao contrário do normal. É proposital — ' +
        'o CSS usa o seletor de irmão para mover o rótulo, e irmão só ' +
        'enxerga quem vem depois. Trocar a ordem quebra o efeito.',
    },
  },
  validacao: {
    '': {
      titulo: 'neutro',
      texto: 'Nenhum estado aplicado. É como o campo nasce.',
    },
    'is-valid': {
      titulo: 'is-valid',
      texto:
        'Pinta a borda de verde e mostra a <code>valid-feedback</code>. ' +
        'Repare que é só uma classe: o Bootstrap não verificou nada. Quem ' +
        'decide que o campo está válido é o seu JavaScript.',
    },
    'is-invalid': {
      titulo: 'is-invalid',
      texto:
        'Pinta a borda de vermelho e revela a <code>invalid-feedback</code>, ' +
        'que fica escondida até esta classe aparecer. De novo: é só classe. ' +
        'A mensagem não sabe qual foi o erro — quem escreve o texto certo ' +
        'é você.',
    },
  },
};

const form = document.querySelector('[data-formulario]');
const codigo = document.querySelector('[data-codigo]');
const explicacao = document.querySelector('[data-explicacao]');

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
};

/** Classes do campo: form-control ou form-select, mais a validação. */
function classesDoCampo(campo) {
  const base = campo.tipo === 'select' ? 'form-select' : 'form-control';
  return estado.validacao ? `${base} ${estado.validacao}` : base;
}

/** O controle em si, sem o rótulo. */
function controle(campo) {
  const classes = classesDoCampo(campo);

  if (campo.tipo === 'select') {
    const opcoes = campo.opcoes
      .map((o) => `<option>${o}</option>`)
      .join('');
    return `<select class="${classes}" id="${campo.id}">${opcoes}</select>`;
  }

  const dica = campo.dica ? ` placeholder="${campo.dica}"` : ' placeholder=" "';
  return `<input type="${campo.tipo}" class="${classes}" id="${campo.id}"${dica} />`;
}

/**
 * Monta um campo inteiro.
 *
 * Repare na inversão: no form-floating o input vem ANTES da label.
 * É assim que o CSS consegue mover o rótulo quando o campo tem valor.
 */
function montarCampo(campo) {
  const retorno =
    estado.validacao === 'is-invalid'
      ? '<div class="invalid-feedback">Preencha este campo.</div>'
      : '';

  if (estado.rotulo === 'flutuante') {
    return `
      <div class="${estado.layout}">
        <div class="form-floating">
          ${controle(campo)}
          <label for="${campo.id}">${campo.rotulo}</label>
          ${retorno}
        </div>
      </div>`;
  }

  return `
    <div class="${estado.layout}">
      <label for="${campo.id}" class="form-label">${campo.rotulo}</label>
      ${controle(campo)}
      ${retorno}
    </div>`;
}

function montarFormulario() {
  form.innerHTML =
    CAMPOS.map(montarCampo).join('') +
    `
    <div class="col-12 d-flex flex-column flex-md-row gap-2 justify-content-md-end">
      <button type="button" class="btn btn-outline-secondary">Cancelar</button>
      <button type="submit" class="btn btn-primary">Enviar inscrição</button>
    </div>`;
}

// -------------------------------------------------------------
//  Código de exemplo, sempre do primeiro campo
// -------------------------------------------------------------
/** Mostra a explicação das duas escolhas que têm pegadinha. */
function montarExplicacao() {
  const partes = [
    EXPLICACAO.rotulo[estado.rotulo],
    EXPLICACAO.validacao[estado.validacao],
  ];

  explicacao.innerHTML = partes
    .map((p) => `<strong>${p.titulo}</strong> — ${p.texto}`)
    .join('<br /><br />');
}

function montarCodigo() {
  const campo = CAMPOS[0];
  const classes = classesDoCampo(campo);

  const abre = (classe) =>
    `<span class="tag">&lt;div class=</span>"<span class="destaque">${classe}</span>"<span class="tag">&gt;</span>`;
  const fecha = '<span class="tag">&lt;/div&gt;</span>';

  const label = `<span class="tag">&lt;label</span> <span class="atributo">for</span>="${campo.id}"${
    estado.rotulo === 'flutuante' ? '' : ' class="form-label"'
  }<span class="tag">&gt;</span>${campo.rotulo}<span class="tag">&lt;/label&gt;</span>`;

  const input = `<span class="tag">&lt;input</span> <span class="atributo">type</span>="${campo.tipo}" <span class="atributo">class</span>="<span class="destaque">${classes}</span>" <span class="atributo">id</span>="${campo.id}"<span class="tag"> /&gt;</span>`;

  const miolo =
    estado.rotulo === 'flutuante'
      ? [`  ${abre('form-floating')}`, `    ${input}`, `    ${label}`, `  ${fecha}`]
      : [`  ${label}`, `  ${input}`];

  codigo.innerHTML = [abre(estado.layout), ...miolo, fecha].join('\n');
}

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
    montarFormulario();
    montarCodigo();
    montarExplicacao();
    atualizar();
  });
}

ligarBotoes('[data-layout]', 'layout');
ligarBotoes('[data-rotulo]', 'rotulo');
ligarBotoes('[data-validacao]', 'validacao');

montarFormulario();
montarCodigo();
montarExplicacao();

const { atualizar } = criarPalco({
  slider: document.getElementById('largura'),
  janela: document.querySelector('[data-janela]'),
  palco: document.querySelector('[data-palco]'),
  regua: document.querySelector('[data-regua]'),
  elementos: () => [...form.children],

  aoAtualizar({ largura, bp }) {
    saida.largura.textContent = largura;
    saida.sigla.textContent = bp.sigla;
    saida.regra.textContent =
      bp.min === 0 ? 'padrão, sem media query' : `a partir de ${bp.min}px`;
  },
});
