# Validação Exploratória — Recertificação

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Recertificação"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Configuração de Conteúdo (Switch "Habilitar reinscrição")

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (4)

- `https://recertificacao-testeqa.stage.twygoead.com/o/37048/events`
  61/471 interativos visíveis (**13%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://recertificacao-testeqa.stage.twygoead.com/contents/807020/edit`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/e/3/edit`
  1/1 interativos visíveis (**100%**) · amostra: link: Voltar para página inicial
- `https://recertificacao-testeqa.stage.twygoead.com/e/807022/edit`
  84/169 interativos visíveis (**50%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu

<details><summary>📁 Fora do escopo "Recertificação" — 26 erro(s) · 17 aviso(s) · 1 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (7 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _4 ocorrência(s) em 3 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > This CKEditor 4.17.1 version is not secure. Consider upgrading to the latest one, 4.25.1-lts: https://ckeditor.com/ckeditor-4-support/
  `https://recertificacao-testeqa.stage.twygoead.com/e/807022/edit`

#### ⚠️ Respostas HTTP de falha (2 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807020/edit` | 1 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/e/3/edit` | 1 |

#### ❌ Acessibilidade — axe-core (35 no total · 18 regra(s) única(s))

- **`landmark-one-main`** _(moderate)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Recertificação"][title="Logo - Recertificação"]`
  ```html
  <img title="Logo - Recertificação" alt="Logo - Recertificação" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_37048_medium_logo_1779798883.jpg?1779798883">
  ```
- **`color-contrast`** _(serious)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.row > .menu-main > .menu-main > .menu-opened.has-submenu.menu-item > .submenu > li:nth-child(3) > .submenu-records[href$="records"][name="records-menu"] > div > .badge-span`
  ```html
  <span class="badge-span" id="beta-badge">
  BETA
  </span>
  ```
- **`image-alt`** _(critical)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `.user-image`
  ```html
  <img class="user-image" src="https://cdn-stage.twygo.com/images/nopic-man.jpg">
  ```
- **`page-has-heading-one`** _(moderate)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`label`** _(critical)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.css-19dei1u.chakra-input[type="date"]:nth-child(2)`
  ```html
  <input type="date" id="eventsFromDate" class="chakra-input css-19dei1u" value="">
  ```
- **`landmark-unique`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(31) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`list`** _(serious)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`meta-viewport`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`html-has-lang`** _(serious)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`aria-allowed-attr`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#menu-button-\:r16\:`
  ```html
  <svg viewBox="0 0 482.575 511.9" focusable="false" class="chakra-icon chakra-menu__menu-button css-1y85x2" aria-label="Options" id="menu-button-:r16:" aria-expanded="false" aria-haspopup="menu" aria-c
  ```
- **`aria-progressbar-name`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-progressbar-name] ARIA progressbar nodes must have an accessible name · _WCAG: cat.aria, wcag2a, wcag111, EN-301-549, EN-9.1.1.1, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name?application=playwright)
  Seletor: `.css-195c7t2 > .css-1j0vutu[aria-valuemax="100"][aria-valuemin="0"]`
  ```html
  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="94" role="progressbar" class="css-1j0vutu" style="width: 94%;"></div>
  ```
- **`button-name`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/button-name] Buttons must have discernible text · _WCAG: cat.name-role-value, wcag2a, wcag412, section508, section508.22.a, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)
  Seletor: `.pagination-previous`
  ```html
  <button type="button" class="chakra-button pagination-previous css-ler30w" disabled="">
  ```
- **`empty-table-header`** _(minor)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `.css-8lx8ui`
  ```html
  <th class="css-8lx8ui"></th>
  ```
- **`nested-interactive`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/nested-interactive] Interactive controls must not be nested · _WCAG: cat.keyboard, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=playwright)
  Seletor: `.css-kjvu41`
  ```html
  <button id="menu-button-:rr:" aria-expanded="false" aria-haspopup="menu" aria-controls="menu-list-:rr:" class="chakra-menu__menu-button css-kjvu41">
  ```
- **`select-name`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `.chakra-select`
  ```html
  <select tag-name="eventsSituations" id="eventsSituations" class="chakra-select css-vvilqh"><option value="">Filtrar por situação</option><option value="0">Em desenvolvimento</option><option value="1">
  ```
- **`document-title`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`label-title-only`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/label-title-only] Form elements should have a visible label · _WCAG: cat.forms, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label-title-only?application=playwright)
  Seletor: `#react-select-3-input`
  ```html
  <input class="creatable-select-fie..." autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-3-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-ex
  ```

</details>

---
