# Validação Exploratória — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Registros de Aprendizagem"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Preenchimento com IA e crédito de IA (3 estados e modais por perfil)

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (5)

- `https://registrosexternos.stage.twygoead.com/o/37093/ai_consumption_analysis?tab=settings`
  56/140 interativos visíveis (**40%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://registrosexternos.stage.twygoead.com/o/37093/records/new`
  82/203 interativos visíveis (**40%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://registrosexternos.stage.twygoead.com/o/37093/records/44306175/edit`
  78/199 interativos visíveis (**39%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://registrosexternos.stage.twygoead.com/o/37093/events?tab=events&profile=admin`
  86/493 interativos visíveis (**17%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://registrosexternos.stage.twygoead.com/o/37093/records`
  139/317 interativos visíveis (**44%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu

<details><summary>📁 Fora do escopo "Registros de Aprendizagem" — 152 erro(s) · 83 aviso(s) · 3 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (36 ocorrência(s) · 5 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _22 ocorrência(s) em 6 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _8 ocorrência(s) em 3 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 500 (Internal Server Error)
  `https://registrosexternos.stage.twygoead.com/o/37093/records/new`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
  `https://registrosexternos.stage.twygoead.com/o/37093/records/new`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_FAILED
  `https://registrosexternos.stage.twygoead.com/o/37093/records/new`

#### ❌ Respostas HTTP de falha (11 no total · 5 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://registrosexternos.stage.twygoead.com/api/v1/o/37093/beta_test/get_active_beta_test_notification?feature_name=analise_creditos_ia_beta_test&with_notification_history=true` | 4 |
| 500 | POST | `https://registrosexternos.stage.twygoead.com/api/v1/o/37093/records/ai_fill` | 3 |
| 400 | GET | `https://registrosexternos.stage.twygoead.com/api/v1/o/37093/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | 2 |
| 400 | GET | `https://registrosexternos.stage.twygoead.com/api/v1/o/37093/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | 1 |
| 400 | GET | `https://registrosexternos.stage.twygoead.com/api/v1/o/37093/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | 1 |

#### ❌ Acessibilidade — axe-core (191 no total · 18 regra(s) única(s))

- **`aria-allowed-attr`** _(critical)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r9\:`
  ```html
  <div id="popover-trigger-:r9:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r9:" class="css-tz0gqg">
  ```
- **`color-contrast`** _(serious)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.brand-hidden > .back-dashboard[href$="dashboard"]`
  ```html
  <a class="back-dashboard" href="/o/37093/dashboard">
  Registros externos
  </a>
  ```
- **`image-alt`** _(critical)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`landmark-one-main`** _(moderate)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`landmark-unique`** _(moderate)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(28) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`list`** _(serious)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`meta-viewport`** _(moderate)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`page-has-heading-one`** _(moderate)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 15 ocorrência(s) em 5 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Registros externos"][title="Logo - Registros externos"]`
  ```html
  <img title="Logo - Registros externos" alt="Logo - Registros externos" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/assets/twygo-brand-f6d14910670a003a0ff67641a9f5e2cc7661d1f0f
  ```
- **`label`** _(critical)_ — 12 ocorrência(s) em 4 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.chakra-switch__input`
  ```html
  <input class="chakra-switch__input" type="checkbox" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: now
  ```
- **`aria-command-name`** _(serious)_ — 9 ocorrência(s) em 2 URL(s)
  [a11y/aria-command-name] ARIA commands must have an accessible name · _WCAG: cat.aria, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=playwright)
  Seletor: `.tw\:size-full`
  ```html
  <div class="tw:flex tw:size-full tw:items-center tw:justify-center" role="button">
  ```
- **`aria-input-field-name`** _(serious)_ — 9 ocorrência(s) em 2 URL(s)
  [a11y/aria-input-field-name] ARIA input fields must have an accessible name · _WCAG: cat.aria, wcag2a, wcag412, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-input-field-name?application=playwright)
  Seletor: `.slate-editor`
  ```html
  <div role="textbox" aria-multiline="true" class="slate-editor ignore-..." aria-disabled="false" data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1">
  ```
- **`button-name`** _(critical)_ — 9 ocorrência(s) em 2 URL(s)
  [a11y/button-name] Buttons must have discernible text · _WCAG: cat.name-role-value, wcag2a, wcag412, section508, section508.22.a, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)
  Seletor: `.css-p9077h > .tw\:group\/toolbar-group.tw\:has-\[button\]\:flex.tw\:has-\[select\]\:flex:nth-child(1) > .tw\:flex.tw\:items-center > .tw\:gap-2.tw\:min-w-8.tw\:px-1\.5:nth-child(1)`
  ```html
  <button type="button" class="tw:inline-flex tw:cu..." id="undo-toolbar-button" tabindex="0" disabled="" data-orientation="horizontal" data-radix-collectio...="">
  ```
- **`label-title-only`** _(serious)_ — 7 ocorrência(s) em 1 URL(s)
  [a11y/label-title-only] Form elements should have a visible label · _WCAG: cat.forms, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label-title-only?application=playwright)
  Seletor: `#react-select-2-input`
  ```html
  <input class="creatable-select-fie..." autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-2-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-ex
  ```
- **`select-name`** _(critical)_ — 4 ocorrência(s) em 3 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```
- **`empty-table-header`** _(minor)_ — 3 ocorrência(s) em 2 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `.css-8lx8ui`
  ```html
  <th class="css-8lx8ui"></th>
  ```
- **`role-img-alt`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/role-img-alt] [role="img"] elements must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/role-img-alt?application=playwright)
  Seletor: `div[data-test-id="records-kpi-card-emitted"] > .css-rdwj84 > .css-15nqf75 > canvas`
  ```html
  <canvas role="img" height="64" width="64" style="display: block; box-sizing: border-box; height: 64px; width: 64px;"></canvas>
  ```
- **`nested-interactive`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/nested-interactive] Interactive controls must not be nested · _WCAG: cat.keyboard, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=playwright)
  Seletor: `.css-kjvu41.chakra-menu__menu-button[aria-controls="menu-list-:rr:"]`
  ```html
  <button id="menu-button-:rr:" aria-expanded="false" aria-haspopup="menu" aria-controls="menu-list-:rr:" class="chakra-menu__menu-button css-kjvu41">
  ```

</details>

---
