/**
 * Simulador de Sticky Footer — Bootstrap 5
 *
 * Dois sliders criam a condição em que o bug aparece (tela alta,
 * pouco conteúdo) e os interruptores deixam ligar e desligar cada
 * peça da solução para ver qual delas faz o quê.
 */
import './sticky-footer.scss';
import { aposAcalmar } from '../../js/motor.js';

const TEXTO =
  'Este é um parágrafo de exemplo para dar volume à página e ' +
  'empurrar o rodapé para baixo conforme o conteúdo cresce.';

/**
 * O que cada caminho faz — e, principalmente, no que eles diferem.
 *
 * flex-grow-1 e mt-auto põem o rodapé exatamente no mesmo lugar. A
 * diferença está em QUEM fica com a sobra: no primeiro o <main>
 * engorda, no segundo a sobra vira margem e o &lt;main&gt; não cresce.
 * Repare no fundo do bloco claro para ver isso acontecendo.
 */
const EMPURRAO = {
  nenhum: {
    titulo: 'Nenhum empurrão',
    texto:
      'O invólucro tem a altura da tela, mas ninguém reivindica a sobra. ' +
      'Os três blocos se empilham a partir do topo e o que resta fica como ' +
      'vão vazio embaixo do rodapé. É o estado do bug.',
  },
  grow: {
    titulo: 'flex-grow-1 no &lt;main&gt;',
    texto:
      'O &lt;main&gt; recebe ordem de crescer e engole toda a sobra. Repare que o ' +
      'bloco claro se estica até encostar no rodapé — quem ficou grande foi ' +
      'o main. Escolha este quando o main tiver fundo, borda ou cor que ' +
      'precise ir até o rodapé.',
  },
  auto: {
    titulo: 'mt-auto no &lt;footer&gt;',
    texto:
      'Margem automática em flexbox absorve todo o espaço livre do eixo. O ' +
      '&lt;main&gt; NÃO cresce: o bloco claro para onde o texto acaba e a sobra ' +
      'vira margem acima do rodapé. O rodapé chega no mesmo lugar, por outro ' +
      'caminho. É o mais enxuto quando o main não tem fundo próprio.',
  },
  fixo: {
    titulo: 'fixed-bottom no &lt;footer&gt;',
    texto:
      'Tira o rodapé do fluxo e gruda na janela. Ele deixa de ocupar lugar, ' +
      'então o conteúdo passa por baixo dele em vez de parar antes. Aumente o ' +
      'conteúdo e role para ver o texto sumindo atrás do rodapé.',
  },
};

const estado = {
  paragrafos: 1,
  alturaTela: 420,
  altura: true, // min-vh-100
  coluna: true, // d-flex flex-column
  empurrao: 'grow', // nenhum | grow | auto | fixo
};

const tela = document.querySelector('[data-tela]');
const pagina = document.querySelector('[data-pagina]');
const main = document.querySelector('[data-main]');
const rodape = document.querySelector('[data-rodape]');
const paragrafos = document.querySelector('[data-paragrafos]');
const veredito = document.querySelector('[data-veredito]');
const codigo = document.querySelector('[data-codigo]');
const explicacao = document.querySelector('[data-explicacao]');

const saida = {
  qtd: document.querySelector('[data-qtd]'),
  alturaTela: document.querySelector('[data-altura-tela]'),
};

// -------------------------------------------------------------
//  As classes de cada elemento, montadas a partir do estado
// -------------------------------------------------------------
function classesPagina() {
  const classes = ['pagina'];
  if (estado.altura) classes.push('min-vh-100');
  if (estado.coluna) classes.push('d-flex', 'flex-column');
  return classes;
}

function classesMain() {
  const classes = ['pagina__main'];
  if (estado.empurrao === 'grow') classes.push('flex-grow-1');
  return classes;
}

function classesRodape() {
  const classes = ['pagina__rodape'];
  if (estado.empurrao === 'auto') classes.push('mt-auto');
  if (estado.empurrao === 'fixo') classes.push('fixed-bottom');
  return classes;
}

// -------------------------------------------------------------
//  Controles
// -------------------------------------------------------------
document.getElementById('conteudo').addEventListener('input', (e) => {
  estado.paragrafos = Number(e.target.value);
  atualizar();
});

document.getElementById('altura').addEventListener('input', (e) => {
  estado.alturaTela = Number(e.target.value);
  atualizar();
});

// As duas peças do invólucro ligam e desligam de forma independente
document.querySelector('[data-pecas]').addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const peca = botao.dataset.peca;
  estado[peca] = !estado[peca];
  botao.classList.toggle('active', estado[peca]);
  atualizar();
});

// O empurrão é uma escolha só: um caminho de cada vez
document.querySelector('[data-empurrao]').addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  document
    .querySelectorAll('[data-empurrao] button')
    .forEach((b) => b.classList.remove('active'));
  botao.classList.add('active');

  estado.empurrao = botao.dataset.valor;
  atualizar();
});

// -------------------------------------------------------------
//  Diagnóstico
//
//  Compara o fim do rodapé com o fim da tela. A medida é feita com
//  getBoundingClientRect porque o que interessa aqui é a posição
//  visual dentro da caixa que representa a janela.
// -------------------------------------------------------------
function diagnosticar() {
  const caixaTela = tela.getBoundingClientRect();
  const caixaRodape = rodape.getBoundingClientRect();

  // quanto de tela sobra depois que o rodapé termina
  const sobra = Math.round(caixaTela.bottom - caixaRodape.bottom);
  // a página é mais alta que a tela? então é caso de rolagem
  const rola = pagina.offsetHeight > tela.clientHeight + 1;

  if (estado.empurrao === 'fixo') {
    return {
      tipo: 'cobre',
      texto:
        'Com fixed-bottom o rodapé gruda na janela e fica por cima do conteúdo. ' +
        'Role a tela e veja o texto passando por baixo dele — não é isso que você quer.',
    };
  }

  if (rola) {
    return {
      tipo: 'rolagem',
      texto:
        'O conteúdo é mais alto que a tela, então o rodapé fica abaixo da dobra — ' +
        'e está certo assim. Diminua o conteúdo para ver o problema aparecer.',
    };
  }

  if (sobra > 2) {
    return {
      tipo: 'sobra',
      texto: `O rodapé parou ${sobra}px antes do fim da tela. Aquela faixa hachurada embaixo dele é o bug.`,
    };
  }

  const caminho =
    estado.empurrao === 'grow'
      ? 'o &lt;main&gt; cresceu e ocupou a sobra'
      : estado.empurrao === 'auto'
        ? 'a sobra virou margem acima do rodapé, sem o &lt;main&gt; crescer'
        : 'não sobrou espaço para empurrar';

  return {
    tipo: 'ok',
    texto: `O rodapé está encostado no fim da tela — ${caminho}.`,
  };
}

// -------------------------------------------------------------
//  Código gerado
// -------------------------------------------------------------
function montarCodigo() {
  const classe = (lista) => lista.filter((c) => c !== 'pagina' && !c.startsWith('pagina__'));

  const linha = (indent, tag, classes, miolo) => {
    const lista = classe(classes);
    const attr = lista.length
      ? ` <span class="tag">class=</span>"<span class="destaque">${lista.join(' ')}</span>"`
      : '';
    return `${indent}<span class="tag">&lt;${tag}</span>${attr}<span class="tag">&gt;</span>${miolo}`;
  };

  codigo.innerHTML = [
    linha('', 'body', classesPagina(), ''),
    linha('  ', 'header', [], 'MinhaPágina<span class="tag">&lt;/header&gt;</span>'),
    linha('  ', 'main', classesMain(), ' ... <span class="tag">&lt;/main&gt;</span>'),
    linha('  ', 'footer', classesRodape(), ' © 2026 <span class="tag">&lt;/footer&gt;</span>'),
    '<span class="tag">&lt;/body&gt;</span>',
  ].join('\n');
}

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar() {
  // A tela
  tela.style.height = `${estado.alturaTela}px`;
  saida.alturaTela.textContent = `${estado.alturaTela}px`;

  // O conteúdo
  paragrafos.innerHTML = Array.from(
    { length: estado.paragrafos },
    () => `<p>${TEXTO}</p>`
  ).join('');

  saida.qtd.textContent =
    estado.paragrafos === 0
      ? 'nenhum parágrafo'
      : `${estado.paragrafos} parágrafo${estado.paragrafos > 1 ? 's' : ''}`;

  // As classes
  pagina.className = classesPagina().join(' ');
  main.className = classesMain().join(' ');
  rodape.className = classesRodape().join(' ');

  const escolha = EMPURRAO[estado.empurrao];
  explicacao.innerHTML = `<strong class="mono">${escolha.titulo}</strong><br />${escolha.texto}`;

  montarCodigo();
  mostrarDiagnostico();
}

// O rodapé leva 0.4s para chegar ao lugar novo. Medir antes disso
// devolve a posição do meio do caminho, e o veredito sai errado.
const mostrarDiagnostico = aposAcalmar(() => {
  const d = diagnosticar();
  veredito.innerHTML = `<span class="veredito veredito--${d.tipo}">${d.texto}</span>`;
});

atualizar();
