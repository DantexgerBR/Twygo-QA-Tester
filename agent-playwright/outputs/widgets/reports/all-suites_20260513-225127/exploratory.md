# Validação Exploratória — Widgets

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Widgets"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Adicionar widgets

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (11)

- `https://widgets.stage.twygoead.com/o/36988/panels/803391/edit?tab=layouts`
  57/135 interativos visíveis (**42%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803394/edit?tab=layouts`
  69/146 interativos visíveis (**47%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803392/edit?tab=layouts`
  58/135 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803393/edit?tab=layouts`
  63/140 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803395/edit?tab=layouts`
  58/135 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803397/edit?tab=layouts`
  59/136 interativos visíveis (**43%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/new`
  63/179 interativos visíveis (**35%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803398/edit?tab=layouts`
  57/135 interativos visíveis (**42%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803399/edit?tab=layouts`
  57/135 interativos visíveis (**42%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803400/edit?tab=layouts`
  57/135 interativos visíveis (**42%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgets.stage.twygoead.com/o/36988/panels/803401/edit?tab=layouts`
  57/135 interativos visíveis (**42%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu

<details><summary>📁 Fora do escopo "Widgets" — 130 erro(s) · 34 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (89 ocorrência(s) · 5 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _82 ocorrência(s) em 21 URL(s)_
  > WebSocket connection to 'wss://chat-staging.twygo.com.br/socket.io/?token=&EIO=4&transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 503
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
  `https://widgets.stage.twygoead.com/o/36988/panels/new`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Access to XMLHttpRequest at 'https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25' from origin 'https://widgets.stage.twygoead.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  `https://widgets.stage.twygoead.com/o/36988/panels/new`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_FAILED
  `https://widgets.stage.twygoead.com/o/36988/panels/new`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 422 ()
  `https://widgets.stage.twygoead.com/o/36988/panels/new`

#### ⚠️ Respostas HTTP de falha (1 no total · 1 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 422 | POST | `https://widgets.stage.twygoead.com/api/v1/o/36988/panels` | 1 |

#### ❌ Acessibilidade — axe-core (74 no total · 12 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 11 ocorrência(s) em 11 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.top-user-name__infor > .name`
  ```html
  <span class="name">
  Claude Agents
  </span>
  ```
- **`landmark-unique`** _(moderate)_ — 11 ocorrência(s) em 11 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(33) > div[aria-label="Notifications-top"][aria-live="polite"][role="region"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`meta-viewport`** _(moderate)_ — 11 ocorrência(s) em 11 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`region`** _(moderate)_ — 11 ocorrência(s) em 11 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#tabs-\:rq\:--tabpanel-1`
  ```html
  <div tabindex="0" role="tabpanel" aria-labelledby="tabs-:rq:--tab-1" id="tabs-:rq:--tabpanel-1" class="chakra-tabs__tab-panel css-47dblg">
  ```
- **`aria-allowed-attr`** _(critical)_ — 6 ocorrência(s) em 6 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r7\:`
  ```html
  <div id="popover-trigger-:r7:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r7:" class="css-tz0gqg">
  ```
- **`image-alt`** _(critical)_ — 6 ocorrência(s) em 6 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`label`** _(critical)_ — 6 ocorrência(s) em 6 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.chakra-switch__input`
  ```html
  <input class="chakra-switch__input" type="checkbox" aria-disabled="false" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hi
  ```
- **`list`** _(serious)_ — 6 ocorrência(s) em 6 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`aria-progressbar-name`** _(serious)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/aria-progressbar-name] ARIA progressbar nodes must have an accessible name · _WCAG: cat.aria, wcag2a, wcag111, EN-301-549, EN-9.1.1.1, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name?application=playwright)
  Seletor: `.css-1iassa2.chakra-stack:nth-child(1) > .chakra-progress.css-2sdpfm[aria-valuemax="100"]`
  ```html
  <div class="chakra-progress css-2sdpfm" aria-valuemax="100" aria-valuemin="0" aria-valuenow="85" role="progressbar">
  ```
- **`aria-command-name`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-command-name] ARIA commands must have an accessible name · _WCAG: cat.aria, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=playwright)
  Seletor: `.tw\:size-full`
  ```html
  <div class="tw:flex tw:size-full tw:items-center tw:justify-center" role="button">
  ```
- **`aria-input-field-name`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-input-field-name] ARIA input fields must have an accessible name · _WCAG: cat.aria, wcag2a, wcag412, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-input-field-name?application=playwright)
  Seletor: `.slate-editor`
  ```html
  <div role="textbox" aria-multiline="true" class="slate-editor ignore-..." aria-disabled="false" data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1">
  ```
- **`button-name`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/button-name] Buttons must have discernible text · _WCAG: cat.name-role-value, wcag2a, wcag412, section508, section508.22.a, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)
  Seletor: `.css-p9077h > .tw\:group\/toolbar-group.tw\:has-\[button\]\:flex.tw\:hidden:nth-child(1) > .tw\:flex.tw\:items-center > .tw\:gap-2.tw\:min-w-8.tw\:px-1\.5:nth-child(1)`
  ```html
  <button type="button" class="tw:inline-flex tw:cu..." id="undo-toolbar-button" tabindex="0" data-orientation="horizontal" data-radix-collectio...="">
  ```

</details>

---
