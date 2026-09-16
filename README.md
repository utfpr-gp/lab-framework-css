# Laboratório de Frameworks CSS

Portal de Simuladores Web — conceitos abstratos de CSS transformados em
interfaces que o aluno manipula e vê reagindo em tempo real.

Site: https://utfpr-gp.github.io/lab-framework-css/

## Rodando

```bash
npm install
npm run dev
```

## Os simuladores

| Simulador | O que ele resolve |
| --- | --- |
| **Grid Responsivo** | Breakpoints e as classes `col-md-6` / `col-lg-4` / `col-xl-3` |
| **Grid Avançado** | A soma de 12, `offset-*`, `order-*` e o `col` sem número |
| **Utilitários Responsivos** | `d-none d-md-block`, `flex-column flex-md-row`, `text-center text-lg-start` |
| **Escala de Espaçamento** | Os seis degraus de `m-*` e `p-*` em rem e pixels |
| **Montador de Componentes** | A relação classe → HTML → resultado |

Cada página segue o mesmo roteiro: primeiro **explica o conceito**, depois
**deixa o aluno mexer nele**.

## Estrutura

```
index.html                              página central, lista os simuladores
vite.config.js                          MPA: cada página é registrada aqui
public/                                 arquivos estáticos
src/
  scss/
    main.scss                           Bootstrap 5 + tema do laboratório
    _motor.scss                         peças dos simuladores com palco
  js/
    motor.js                            slider de largura, zoom e animação FLIP
  simuladores/
    <nome>/
      index.html                        explicação didática + simulação
      <nome>.scss
      <nome>.js
```

## Como isso funciona por dentro

Dois problemas apareceram ao construir os simuladores, e a solução dos dois
está em [`src/scss/_motor.scss`](src/scss/_motor.scss) e
[`src/js/motor.js`](src/js/motor.js):

**1. As classes responsivas reagem ao navegador, não a uma div.** Arrastar um
slider não faria `col-md-6` mudar de ideia. O mixin `cascata` reescreve as
mesmas regras do Bootstrap ativadas por um atributo `data-bp` que o JavaScript
coloca no palco, respeitando a ordem mobile-first. Os utilitários precisam de
`!important` nessa reescrita, porque os originais do Bootstrap também têm.

**2. Mudar de 3 para 4 blocos por linha altera a posição no fluxo, e
`transition` não anima isso.** A função `animarMudanca` faz uma animação FLIP:
mede onde os elementos estavam, aplica a mudança, mede onde foram parar, joga
de volta com `transform` e solta. Os blocos deslizam em vez de piscar.

## Como adicionar um simulador

1. Crie `src/simuladores/<nome>/` com `index.html`, `<nome>.scss` e `<nome>.js`.
2. No `.scss`, comece com `@use '../../scss/main';` (e `motor` se tiver palco).
3. Registre a página no `input` do `vite.config.js`.
4. Adicione um card na home (`index.html`).

## Publicação

O site é publicado no GitHub Pages a cada push na `main`, pelo workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

O `base: './'` no `vite.config.js` gera caminhos relativos, então o mesmo build
funciona tanto localmente quanto no subdiretório do Pages.
