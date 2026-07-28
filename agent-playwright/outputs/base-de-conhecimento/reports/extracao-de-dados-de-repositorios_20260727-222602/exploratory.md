# Validação Exploratória — Base de Conhecimento

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Base de Conhecimento"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Extração de dados de repositórios

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (1)

- `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`
  60/135 interativos visíveis (**44%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: new_library-menu · link: users-menu

<details><summary>📁 Fora do escopo "Base de Conhecimento" — 43 erro(s) · 8 aviso(s) · 2 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (31 ocorrência(s) · 6 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _14 ocorrência(s) em 1 URL(s)_
  > WebSocket connection to 'wss://chat-staging.twygo.com.br/socket.io/?token=&EIO=4&transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 503
  `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`
- **Erro JavaScript no navegador** — _7 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_CONNECTION_RESET
  `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > requestStorageAccess: Permission denied.
  `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
  `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Access to XMLHttpRequest at 'https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25' from origin 'https://twygo1772627238.stage.twygoead.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
  `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_FAILED
  `https://twygo1772627238.stage.twygoead.com/o/37007/knowledge_repositories`

#### ❌ Acessibilidade — axe-core (22 no total · 11 regra(s) única(s))

- **`aria-allowed-attr`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:rd\:`
  ```html
  <div id="popover-trigger-:rd:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:rd:" class="css-tz0gqg">
  ```
- **`button-name`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/button-name] Buttons must have discernible text · _WCAG: cat.name-role-value, wcag2a, wcag412, section508, section508.22.a, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)
  Seletor: `#open-filter`
  ```html
  <button type="button" class="chakra-button css-1py8e62" id="open-filter" data-test-id="filter-control-open-button">
  ```
- **`color-contrast`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.brand-hidden > .back-dashboard[href$="dashboard"]`
  ```html
  <a class="back-dashboard" href="/o/36675/dashboard">
  Twygo
  </a>
  ```
- **`empty-table-header`** _(minor)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `.css-8lx8ui`
  ```html
  <th class="css-8lx8ui"></th>
  ```
- **`image-alt`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`landmark-one-main`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`landmark-unique`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(30) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`list`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`meta-viewport`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`region`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Twygo"][title="Logo - Twygo"]`
  ```html
  <img title="Logo - Twygo" alt="Logo - Twygo" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/assets/twygo-brand-f6d14910670a003a0ff67641a9f5e2cc7661d1f0f9711496dabb7f8d458fe889.pn
  ```
- **`select-name`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```

</details>

---
