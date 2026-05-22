# Validação Exploratória — Modelos de conteúdo

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Modelos de conteúdo"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Smoke — Infra Twygo

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (1)

- `https://basedeconhecimento.stage.twygoead.com/play?menu_id=play`
  1/1 interativos visíveis (**100%**) · amostra: link: Voltar para página inicial

<details><summary>📁 Fora do escopo "Modelos de conteúdo" — 4 erro(s) · 4 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (1 ocorrência(s) · 1 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
  `https://basedeconhecimento.stage.twygoead.com/play?menu_id=play`

#### ⚠️ Respostas HTTP de falha (1 no total · 1 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/play?menu_id=play` | 1 |

#### ❌ Acessibilidade — axe-core (6 no total · 6 regra(s) única(s))

- **`document-title`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`html-has-lang`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`image-alt`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `img`
  ```html
  <img src="https://cdn-stage.twygo.com/assets/logo-153ce4f87ac927fa04ec3c58a3845347371d4f6b1456ebac4700843faf12adad.png">
  ```
- **`landmark-one-main`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`page-has-heading-one`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`region`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div style="text-align: center; margin-top: 50px">
  ```

</details>

---
