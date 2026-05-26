# Validação Exploratória — Recertificação

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Recertificação"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Reinscrição pelo Aluno (Play e Link Público)

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (3)

- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/play/event/1`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/play/pacote-recertificacao-staging/course_registrations?recertification=true`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 50 erro(s) · 41 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (14 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _6 ocorrência(s) em 1 URL(s)_
  > WebSocket connection to 'wss://chat-staging.twygo.com.br/socket.io/?token=&EIO=4&transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 503
  `https://basedeconhecimento.stage.twygoead.com/dashboard_students`
- **Erro JavaScript no navegador** — _5 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
  `https://basedeconhecimento.stage.twygoead.com/dashboard_students`

#### ⚠️ Respostas HTTP de falha (5 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/play/event/1` | 3 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/play/pacote-recertificacao-staging/course_registrations?recertification=true` | 2 |

#### ❌ Acessibilidade — axe-core (72 no total · 6 regra(s) única(s))

- **`html-has-lang`** _(serious)_ — 18 ocorrência(s) em 3 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`landmark-one-main`** _(moderate)_ — 18 ocorrência(s) em 3 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`document-title`** _(serious)_ — 13 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`page-has-heading-one`** _(moderate)_ — 13 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`color-contrast`** _(serious)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`region`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
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
