# Validação Exploratória — Recertificação

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Recertificação"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Reinscrição Individual pelo Admin

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (5)

- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://recertificacao-testeqa.stage.twygoead.com/e/807287/learning`
  110/281 interativos visíveis (**39%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://recertificacao-testeqa.stage.twygoead.com/e/807416/learning`
  66/159 interativos visíveis (**42%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 58 erro(s) · 34 aviso(s) · 4 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (20 ocorrência(s) · 6 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _4 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_NAME_NOT_RESOLVED
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > WebSocket connection to 'wss://chat-staging.twygo.com.br/socket.io/?token=&EIO=4&transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 503
  `https://recertificacao-testeqa.stage.twygoead.com/e/807287/learning`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Access to XMLHttpRequest at 'https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25' from origin 'https://recertificacao-testeqa.stage.twygoead.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  `https://recertificacao-testeqa.stage.twygoead.com/e/807287/learning`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_FAILED
  `https://recertificacao-testeqa.stage.twygoead.com/e/807287/learning`

#### ⚠️ Respostas HTTP de falha (4 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students` | 3 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/learning_students` | 1 |

#### ❌ Acessibilidade — axe-core (72 no total · 15 regra(s) única(s))

- **`landmark-one-main`** _(moderate)_ — 9 ocorrência(s) em 5 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`color-contrast`** _(serious)_ — 8 ocorrência(s) em 4 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`region`** _(moderate)_ — 8 ocorrência(s) em 4 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```
- **`html-has-lang`** _(serious)_ — 5 ocorrência(s) em 3 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`page-has-heading-one`** _(moderate)_ — 5 ocorrência(s) em 3 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`aria-allowed-attr`** _(critical)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r3\:`
  ```html
  <div id="popover-trigger-:r3:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r3:" class="css-tz0gqg">
  ```
- **`aria-progressbar-name`** _(serious)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/aria-progressbar-name] ARIA progressbar nodes must have an accessible name · _WCAG: cat.aria, wcag2a, wcag111, EN-301-549, EN-9.1.1.1, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name?application=playwright)
  Seletor: `#td-progress_score-0 > .css-fqllj7.chakra-stack > .css-c02efi > .css-83oy7k[aria-valuemax="100"][aria-valuemin="0"]`
  ```html
  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="css-83oy7k" style="width: 0%;"></div>
  ```
- **`empty-table-header`** _(minor)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `#select`
  ```html
  <th id="select" class="css-vxt0e6">
  ```
- **`image-alt`** _(critical)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`label`** _(critical)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.css-1q31bl5 > .chakra-checkbox__input[type="checkbox"][value=""]`
  ```html
  <input class="chakra-checkbox__input" type="checkbox" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: n
  ```
- **`landmark-unique`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(24) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`list`** _(serious)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`meta-viewport`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`select-name`** _(critical)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```
- **`document-title`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```

</details>

---
