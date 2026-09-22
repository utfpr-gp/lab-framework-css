/**
 * Simulador de Escala de Espaçamento — Bootstrap 5
 *
 * O aluno escolhe margin ou padding, escolhe o lado, arrasta o degrau
 * e vê ao mesmo tempo: a classe que isso gera, o valor em rem, o valor
 * em pixels e o efeito no bloco.
 */
import './espacamento.scss';

// A escala do Bootstrap: múltiplos de $spacer, que vale 1rem.
// Os degraus 4 e 5 fogem da progressão — por isso a tabela mostra a conta.
const ESCALA = [
  { degrau: 0, fator: 0, conta: '0' },
  { degrau: 1, fator: 0.25, conta: '$spacer × .25' },
  { degrau: 2, fator: 0.5, conta: '$spacer × .5' },
  { degrau: 3, fator: 1, conta: '$spacer' },
  { degrau: 4, fator: 1.5, conta: '$spacer × 1.5' },
  { degrau: 5, fator: 3, conta: '$spacer × 3' },
];

const REM_EM_PX = 16;

/** A diferença que o bloco colorido mostra, dita em palavras. */
const PROPRIEDADE = {
  m: {
    titulo: 'm · margin',
    texto:
      'Espaço por FORA do elemento. Ele empurra o próprio elemento para ' +
      'longe dos vizinhos e das bordas do pai. O fundo colorido do ' +
      'elemento NÃO acompanha: a margem é área vazia.',
  },
  p: {
    titulo: 'p · padding',
    texto:
      'Espaço por DENTRO do elemento. O elemento continua do mesmo tamanho ' +
      'por fora e empurra o próprio conteúdo para o miolo. O fundo colorido ' +
      'acompanha — é por isso que o anel roxo aparece.',
  },
};

const LADO = {
  '': 'todos os quatro lados',
  t: 'só em cima (top)',
  b: 'só embaixo (bottom)',
  s: 'só no início da linha (start) — à esquerda em português',
  e: 'só no fim da linha (end) — à direita em português',
  x: 'esquerda e direita ao mesmo tempo',
  y: 'em cima e embaixo ao mesmo tempo',
};

const estado = { propriedade: 'm', lado: '', degrau: 3 };

const slider = document.getElementById('degrau');
const elemento = document.querySelector('[data-elemento]');
const marcasEscala = document.querySelector('[data-escala]');
const tabela = document.querySelector('[data-tabela]');
const explicacao = document.querySelector('[data-explicacao]');

const saida = {
  classe: document.querySelector('[data-classe]'),
  rem: document.querySelector('[data-valor-rem]'),
  px: document.querySelector('[data-valor-px]'),
};

/** Monta o nome da classe a partir do estado atual. */
function classeAtual() {
  return `${estado.propriedade}${estado.lado}-${estado.degrau}`;
}

// -------------------------------------------------------------
//  Marcas embaixo do slider e tabela da escala (montadas uma vez)
// -------------------------------------------------------------
marcasEscala.innerHTML = ESCALA.map(
  (item) =>
    `<span style="left: ${(item.degrau / 5) * 100}%" data-degrau="${item.degrau}">
       ${item.degrau}
     </span>`
).join('');

tabela.innerHTML = ESCALA.map(
  (item) => `
    <tr data-linha="${item.degrau}">
      <td class="mono">${item.degrau}</td>
      <td class="mono texto-fraco">${item.conta}</td>
      <td class="mono">${item.fator}rem</td>
      <td class="mono">${item.fator * REM_EM_PX}px</td>
    </tr>`
).join('');

// -------------------------------------------------------------
//  Botões de propriedade e de lado
// -------------------------------------------------------------
function ligarBotoes(container, campo) {
  const grupo = document.querySelector(container);

  grupo.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button');
    if (!botao) return;

    grupo.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    botao.classList.add('active');

    estado[campo] = botao.dataset.valor;
    atualizar();
  });
}

ligarBotoes('[data-propriedade]', 'propriedade');
ligarBotoes('[data-lado]', 'lado');

slider.addEventListener('input', () => {
  estado.degrau = Number(slider.value);
  atualizar();
});

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar() {
  const item = ESCALA[estado.degrau];
  const classe = classeAtual();

  // Aplica a classe de verdade do Bootstrap no elemento
  elemento.className = `demo-elemento ${classe}`;

  saida.classe.textContent = classe;
  saida.rem.textContent = `${item.fator}rem`;
  saida.px.textContent = `${item.fator * REM_EM_PX}px`;

  const prop = PROPRIEDADE[estado.propriedade];
  explicacao.innerHTML =
    `<strong>${prop.titulo}</strong> — ${prop.texto}<br /><br />` +
    `<strong>${classe}</strong> aplica isso em ${LADO[estado.lado]}.`;

  marcasEscala.querySelectorAll('span').forEach((marca) => {
    marca.classList.toggle(
      'ativo',
      Number(marca.dataset.degrau) === estado.degrau
    );
  });

  tabela.querySelectorAll('tr').forEach((linha) => {
    linha.classList.toggle(
      'ativo',
      Number(linha.dataset.linha) === estado.degrau
    );
  });
}

atualizar();
