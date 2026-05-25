# Validação Exploratória — Widgets

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Widgets"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Feature flag

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (3)

- `https://widgetsdisabled.stage.twygoead.com/o/36989/use_modes`
  64/128 interativos visíveis (**50%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `https://widgetsdisabled.stage.twygoead.com/dashboard_students`
  16/72 interativos visíveis (**22%**) · amostra: link: dashboard-menu · link: my_contents-menu · link: communities-menu · link: team-menu · link: user_panels-menu · link · link · button: Open chat
- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Widgets" — 55 erro(s) · 28 aviso(s) · 2 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (33 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _29 ocorrência(s) em 10 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
  `https://widgetsdisabled.stage.twygoead.com/o/36989/events?tab=events&profile=admin`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 (Bad Request)
  `https://widgetsdisabled.stage.twygoead.com/dashboard_students`

#### ⚠️ Respostas HTTP de falha (4 no total · 3 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://www.clarity.ms/tag/oizme88931` | 2 |
| 400 | GET | `https://widgetsdisabled.stage.twygoead.com/api/v1/o/36989/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | 1 |
| 400 | GET | `https://widgetsdisabled.stage.twygoead.com/api/v1/o/36989/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | 1 |

#### ❌ Acessibilidade — axe-core (48 no total · 15 regra(s) única(s))

- **`landmark-one-main`** _(moderate)_ — 5 ocorrência(s) em 3 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
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
  Seletor: `#popover-trigger-\:r7\:`
  ```html
  <div id="popover-trigger-:r7:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r7:" class="css-tz0gqg">
  ```
- **`color-contrast`** _(serious)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.top-user-name__infor > .name`
  ```html
  <span class="name">
  Claude Agents
  </span>
  ```
- **`image-alt`** _(critical)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`landmark-unique`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(29) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
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
- **`region`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img`
  ```html
  <img title="Logo - widgets-disabled [36989]" alt="Logo - widgets-disabled [36989]" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_36989_medium_logo_17780815
  ```
- **`empty-table-header`** _(minor)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `.css-8lx8ui`
  ```html
  <th class="css-8lx8ui"></th>
  ```
- **`label`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#radio-\:r2j\:`
  ```html
  <input class="chakra-radio__input" id="radio-:r2j:" type="radio" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; whi
  ```
- **`select-name`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```
- **`heading-order`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/heading-order] Heading levels should only increase by one · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/heading-order?application=playwright)
  Seletor: `h5`
  ```html
  <h5 class="xp-text-ranking">
  0
  Pontos de experiência
  </h5>
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
