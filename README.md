# Laboratório de Frameworks CSS

Portal de Simuladores Web — conceitos abstratos de CSS transformados em
interfaces que o aluno manipula e vê reagindo em tempo real.

## Rodando

```bash
npm install
npm run dev
```

## Estrutura

```
index.html                              página central, lista os simuladores
vite.config.js                          MPA: cada página é registrada aqui
public/                                 arquivos estáticos
src/
  scss/main.scss                        Bootstrap 5 + tema do laboratório
  simuladores/
    bootstrap-grid/
      index.html                        explicação didática + simulação
      grid-simulator.scss
      grid-simulator.js
```

## Como adicionar um simulador

1. Crie `src/simuladores/<nome>/` com `index.html`, `<nome>.scss` e `<nome>.js`.
2. No `.scss`, comece com `@use '../../scss/main';`.
3. Registre a página no `input` do `vite.config.js`.
4. Adicione um card na home (`index.html`).

Cada página segue o mesmo roteiro: primeiro **explica o conceito**, depois
**deixa o aluno mexer nele**.

## Publicação

O site é publicado no GitHub Pages a cada push na `main`, pelo workflow
`.github/workflows/deploy.yml`.

Para ligar (uma vez só): **Settings → Pages → Source: GitHub Actions**.

URL: https://utfpr-gp.github.io/lab-framework-css/

O `base: './'` no `vite.config.js` gera caminhos relativos, então o mesmo
build funciona tanto localmente quanto no subdiretório do Pages.
