/**
 * Simulador de Cores do Tema — Bootstrap 5
 *
 * O aluno mexe numa cor e vê a página inteira acompanhar. As cores
 * derivadas (hover, clique, texto por cima) são calculadas do mesmo
 * jeito que o Sass do Bootstrap calcula.
 */
import './cores.scss';

const PAPEIS = [
  { id: 'primary', nome: '$primary', original: '#6366f1', papel: 'a cor principal' },
  { id: 'secondary', nome: '$secondary', original: '#6c757d', papel: 'apoio, neutro' },
  { id: 'success', nome: '$success', original: '#198754', papel: 'deu certo' },
  { id: 'danger', nome: '$danger', original: '#dc3545', papel: 'deu errado' },
  { id: 'warning', nome: '$warning', original: '#ffc107', papel: 'atenção' },
  { id: 'info', nome: '$info', original: '#0dcaf0', papel: 'informação' },
];

// Percentuais que o Bootstrap usa em button-variant()
const SOMBRA_HOVER = 0.15;
const SOMBRA_ATIVO = 0.2;
const CLAREADA = 0.4;

let cores = {};

// -------------------------------------------------------------
//  Contas de cor — as mesmas que o Sass faz na compilação
// -------------------------------------------------------------
function paraRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function paraHex({ r, g, b }) {
  const dois = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${dois(r)}${dois(g)}${dois(b)}`;
}

/** Mistura duas cores. peso = quanto da segunda entra. */
function misturar(cor, outra, peso) {
  return {
    r: cor.r + (outra.r - cor.r) * peso,
    g: cor.g + (outra.g - cor.g) * peso,
    b: cor.b + (outra.b - cor.b) * peso,
  };
}

const PRETO = { r: 0, g: 0, b: 0 };
const BRANCO = { r: 255, g: 255, b: 255 };

/** Luminância relativa, fórmula da WCAG. */
function luminancia({ r, g, b }) {
  const canal = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

/** Razão de contraste entre duas cores: de 1 (igual) a 21 (preto/branco). */
function contraste(a, b) {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * É assim que o `color-contrast()` do Bootstrap escolhe entre texto
 * preto e branco.
 *
 * A ordem importa e surpreende: ele NÃO pega o que contrasta mais.
 * Ele testa o branco primeiro e fica com ele se passar da razão
 * mínima (4.5:1); só então tenta o preto. Por isso o azul padrão
 * #0d6efd sai com texto branco, mesmo o preto contrastando um
 * pouquinho mais.
 */
const MIN_CONTRASTE = 4.5; // $min-contrast-ratio

function textoPorCima(fundo) {
  const comBranco = contraste(fundo, BRANCO);
  if (comBranco > MIN_CONTRASTE) return { cor: '#ffffff', razao: comBranco };

  const comPreto = contraste(fundo, PRETO);
  if (comPreto > MIN_CONTRASTE) return { cor: '#000000', razao: comPreto };

  // Nenhum dos dois alcança: fica com o menos ruim
  return comPreto >= comBranco
    ? { cor: '#000000', razao: comPreto }
    : { cor: '#ffffff', razao: comBranco };
}

/** Tudo que o Bootstrap deriva a partir de uma cor base. */
function derivar(hex) {
  const base = paraRgb(hex);
  const texto = textoPorCima(base);

  return {
    base: hex,
    hover: paraHex(misturar(base, PRETO, SOMBRA_HOVER)),
    ativo: paraHex(misturar(base, PRETO, SOMBRA_ATIVO)),
    // versão clara, para texto colorido em fundo escuro
    claro: paraHex(misturar(base, BRANCO, CLAREADA)),
    texto: texto.cor,
    razao: texto.razao,
    rgb: `${base.r}, ${base.g}, ${base.b}`,
  };
}

// -------------------------------------------------------------
//  Elementos
// -------------------------------------------------------------
const tema = document.querySelector('[data-tema]');
const painel = document.querySelector('[data-controles]');
const derivacao = document.querySelector('[data-derivacao]');
const codigo = document.querySelector('[data-codigo]');
const galeria = (nome) => document.querySelector(`[data-galeria="${nome}"]`);

function reiniciarCores() {
  cores = {};
  PAPEIS.forEach((p) => (cores[p.id] = p.original));
}

// -------------------------------------------------------------
//  Controles e galeria, montados uma vez
// -------------------------------------------------------------
function montarControles() {
  painel.innerHTML = PAPEIS.map(
    (p) => `
      <div class="col-12 col-md-6 col-xl-4">
        <label class="papel" for="cor-${p.id}">
          <input type="color" id="cor-${p.id}" value="${cores[p.id]}"
                 data-papel="${p.id}" />
          <span>
            <span class="papel__nome d-block">${p.nome}</span>
            <span class="texto-fraco small">${p.papel}</span>
            <span class="papel__hex d-block" data-hex="${p.id}">${cores[p.id]}</span>
          </span>
        </label>
      </div>`
  ).join('');
}

function montarGaleria() {
  galeria('solidos').innerHTML = PAPEIS.map(
    (p) => `<button type="button" class="btn btn-${p.id}">${p.id}</button>`
  ).join('');

  galeria('contorno').innerHTML = PAPEIS.map(
    (p) => `<button type="button" class="btn btn-outline-${p.id}">${p.id}</button>`
  ).join('');

  galeria('badges').innerHTML = PAPEIS.map(
    (p) => `<span class="badge text-bg-${p.id}">${p.id}</span>`
  ).join('');

  galeria('alertas').innerHTML = PAPEIS.slice(0, 3)
    .map(
      (p) =>
        `<div class="alert alert-${p.id} py-2 mb-2">Este é um alerta <strong>${p.id}</strong>.</div>`
    )
    .join('');

  galeria('textos').innerHTML = PAPEIS.map(
    (p) =>
      `<span class="amostra-borda border-${p.id} text-${p.id}">texto ${p.id}</span>`
  ).join('');
}

painel.addEventListener('input', (evento) => {
  const entrada = evento.target.closest('input[type="color"]');
  if (!entrada) return;

  cores[entrada.dataset.papel] = entrada.value;
  atualizar();
});

// -------------------------------------------------------------
//  Atualiza tudo
// -------------------------------------------------------------
function atualizar() {
  const derivadas = {};

  PAPEIS.forEach((p) => {
    const d = derivar(cores[p.id]);
    derivadas[p.id] = d;

    // É por aqui que a galeria inteira recebe as cores novas
    tema.style.setProperty(`--lab-${p.id}`, d.base);
    tema.style.setProperty(`--lab-${p.id}-hover`, d.hover);
    tema.style.setProperty(`--lab-${p.id}-ativo`, d.ativo);
    tema.style.setProperty(`--lab-${p.id}-claro`, d.claro);
    tema.style.setProperty(`--lab-${p.id}-texto`, d.texto);
    tema.style.setProperty(`--lab-${p.id}-rgb`, d.rgb);

    const hex = painel.querySelector(`[data-hex="${p.id}"]`);
    if (hex) hex.textContent = d.base;
  });

  // Tabela de derivação
  derivacao.innerHTML = PAPEIS.map((p) => {
    const d = derivadas[p.id];
    const bom = d.razao >= 4.5;

    const pastilha = (cor) =>
      `<span class="pastilha" style="background:${cor}"></span><span class="mono">${cor}</span>`;

    return `
      <tr>
        <td class="mono">${p.nome}</td>
        <td>${pastilha(d.base)}</td>
        <td>${pastilha(d.hover)}</td>
        <td>${pastilha(d.ativo)}</td>
        <td>${pastilha(d.texto)}</td>
        <td class="text-end ${bom ? 'contraste-ok' : 'contraste-fraco'}">
          ${d.razao.toFixed(1)}:1
        </td>
      </tr>`;
  }).join('');

  // Sass equivalente
  const linhas = PAPEIS.map(
    (p) =>
      `  <span class="variavel">${p.nome}</span>: <span class="texto">${cores[p.id]}</span>,`
  );
  linhas[linhas.length - 1] = linhas[linhas.length - 1].replace(/,$/, '');

  codigo.innerHTML = [
    `<span class="comentario">// src/scss/main.scss</span>`,
    `<span class="tag">@use</span> <span class="texto">'bootstrap/scss/bootstrap'</span> <span class="tag">with</span> (`,
    ...linhas,
    `);`,
  ].join('\n');
}

document.querySelector('[data-reiniciar]').addEventListener('click', () => {
  reiniciarCores();
  montarControles();
  atualizar();
});

document.querySelector('[data-copiar]').addEventListener('click', async (e) => {
  const texto = [
    "@use 'bootstrap/scss/bootstrap' with (",
    ...PAPEIS.map((p, i) => `  ${p.nome}: ${cores[p.id]}${i < PAPEIS.length - 1 ? ',' : ''}`),
    ');',
  ].join('\n');

  await navigator.clipboard.writeText(texto);

  const botao = e.currentTarget;
  botao.textContent = 'Copiado!';
  setTimeout(() => (botao.textContent = 'Copiar'), 1500);
});

reiniciarCores();
montarControles();
montarGaleria();
atualizar();
