/**
 * Simulador de Containers — Bootstrap 5
 *
 * Três containers lado a lado dentro do mesmo palco. Arrastando a
 * largura dá para ver qual deles trava, quando trava e quanto espaço
 * sobra dos lados.
 */
import './containers.scss';
import { criarPalco } from '../../js/motor.js';

const CAIXAS = [
  { chave: 'a', classe: '.container' },
  { chave: 'b', classe: '.container-fluid' },
  { chave: 'c', classe: '.container-lg' },
];

const palco = document.querySelector('[data-palco]');
const medidas = document.querySelector('[data-medidas]');

// Linhas da tabela, montadas uma vez
medidas.innerHTML = CAIXAS.map(
  (c) => `
    <tr>
      <td class="mono">${c.classe}</td>
      <td class="text-end mono" data-saida="largura-${c.chave}"></td>
      <td class="text-end mono" data-saida="sobra-${c.chave}"></td>
      <td class="text-end" data-saida="estado-${c.chave}"></td>
    </tr>`
).join('');

const saida = {
  largura: document.querySelector('[data-largura]'),
  sigla: document.querySelector('[data-bp-sigla]'),
  regra: document.querySelector('[data-bp-regra]'),
};

const campo = (nome) => document.querySelector(`[data-saida="${nome}"]`);

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

    // A faixa é a largura útil do palco — a "tela" de verdade da simulação
    const faixa = palco.querySelector('.faixa').offsetWidth;

    CAIXAS.forEach((c) => {
      // offsetWidth ignora o zoom do palco, então dá o valor real em px
      const ocupada = palco.querySelector(`[data-caixa="${c.chave}"]`).offsetWidth;
      const sobra = Math.round((faixa - ocupada) / 2);
      const travado = sobra > 0;

      campo(`largura-${c.chave}`).textContent = `${ocupada}px`;
      campo(`sobra-${c.chave}`).textContent = travado ? `${sobra}px` : '—';

      const estado = campo(`estado-${c.chave}`);
      estado.textContent = travado ? 'travado' : 'ocupa tudo';
      estado.className = `text-end ${travado ? 'travado' : 'solto'}`;
    });
  },
});
