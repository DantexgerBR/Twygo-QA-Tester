# Validação Exploratória — Widgets

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Widgets"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Importar abas

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (11)

- `https://widgets.stage.twygoead.com/o/36988/panels/803554/edit?tab=layouts`
  58/135 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803556/edit?tab=layouts`
  62/139 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803557/edit?tab=layouts`
  54/131 interativos visíveis (**41%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803559/edit?tab=layouts`
  66/143 interativos visíveis (**46%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://widgets.stage.twygoead.com/o/36988/panels/803561/edit?tab=layouts`
  64/141 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803563/edit?tab=layouts`
  62/139 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803565/edit?tab=layouts`
  59/136 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803566/edit?tab=layouts`
  58/135 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803568/edit?tab=layouts`
  62/139 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803569/edit?tab=layouts`
  58/135 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu

<details><summary>📁 Fora do escopo "Widgets" — 203 erro(s) · 40 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (165 ocorrência(s) · 6 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _109 ocorrência(s) em 21 URL(s)_
  > WebSocket connection to 'wss://chat-staging.twygo.com.br/socket.io/?token=&EIO=4&transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 503
- **Erro JavaScript no navegador** — _48 ocorrência(s) em 33 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Access to XMLHttpRequest at 'https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25' from origin 'https://widgets.stage.twygoead.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  `https://widgets.stage.twygoead.com/o/36988/panels/803559/edit?tab=layouts`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_FAILED
  `https://widgets.stage.twygoead.com/o/36988/panels/803559/edit?tab=layouts`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 2 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 401 ()
  `https://widgets.stage.twygoead.com/o/36988/panels/803564/edit?tab=layouts`

#### ⚠️ Respostas HTTP de falha (2 no total · 1 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 401 | GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | 2 |

#### ❌ Acessibilidade — axe-core (76 no total · 15 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 10 ocorrência(s) em 10 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.top-user-name__infor > .name`
  ```html
  <span class="name">
  Claude Agents
  </span>
  ```
- **`landmark-unique`** _(moderate)_ — 10 ocorrência(s) em 10 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(29) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`meta-viewport`** _(moderate)_ — 10 ocorrência(s) em 10 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`region`** _(moderate)_ — 10 ocorrência(s) em 10 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#tabs-\:rq\:--tabpanel-1`
  ```html
  <div tabindex="0" role="tabpanel" aria-labelledby="tabs-:rq:--tab-1" id="tabs-:rq:--tabpanel-1" class="chakra-tabs__tab-panel css-47dblg">
  ```
- **`label`** _(critical)_ — 9 ocorrência(s) em 9 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#react-select-3-input`
  ```html
  <input class="select-field__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-3-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expand
  ```
- **`landmark-one-main`** _(moderate)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`page-has-heading-one`** _(moderate)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`label-title-only`** _(serious)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/label-title-only] Form elements should have a visible label · _WCAG: cat.forms, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label-title-only?application=playwright)
  Seletor: `#react-select-3-input`
  ```html
  <input class="select-field__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-3-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expand
  ```
- **`select-name`** _(critical)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `select`
  ```html
  <select class="chakra-select css-1gq5ikj"><option value="0">Aprendizagem</option></select>
  ```
- **`aria-allowed-attr`** _(critical)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r7\:`
  ```html
  <div id="popover-trigger-:r7:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r7:" class="css-tz0gqg">
  ```
- **`image-alt`** _(critical)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`list`** _(serious)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`aria-progressbar-name`** _(serious)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/aria-progressbar-name] ARIA progressbar nodes must have an accessible name · _WCAG: cat.aria, wcag2a, wcag111, EN-301-549, EN-9.1.1.1, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name?application=playwright)
  Seletor: `.css-1iassa2.chakra-stack:nth-child(1) > .chakra-progress.css-2sdpfm[aria-valuemax="100"]`
  ```html
  <div class="chakra-progress css-2sdpfm" aria-valuemax="100" aria-valuemin="0" aria-valuenow="85" role="progressbar">
  ```
- **`document-title`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`html-has-lang`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```

</details>

---
