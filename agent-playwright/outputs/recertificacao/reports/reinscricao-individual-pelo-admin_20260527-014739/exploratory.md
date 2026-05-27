# Validação Exploratória — Recertificação

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Recertificação"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Reinscrição Individual pelo Admin

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (2)

- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 12 erro(s) · 12 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (4 ocorrência(s) · 1 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _4 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()

#### ⚠️ Respostas HTTP de falha (4 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students` | 3 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/learning_students` | 1 |

#### ❌ Acessibilidade — axe-core (16 no total · 4 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`html-has-lang`** _(serious)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`landmark-one-main`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`region`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```

</details>

---
