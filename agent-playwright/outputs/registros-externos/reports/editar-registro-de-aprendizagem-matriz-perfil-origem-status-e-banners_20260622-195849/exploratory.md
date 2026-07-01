# Validação Exploratória — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Registros de Aprendizagem"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Editar registro de aprendizagem (matriz perfil × origem × status e banners)

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (7)

- `https://registrosf2.stage.twygoead.com/o/37079/records/44279799/edit`
  69/182 interativos visíveis (**38%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/records/44279802/edit`
  69/182 interativos visíveis (**38%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/records/44279361/edit`
  72/185 interativos visíveis (**39%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/records/44279812/edit`
  69/182 interativos visíveis (**38%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/records`
  109/324 interativos visíveis (**34%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/events?tab=events&profile=admin`
  77/451 interativos visíveis (**17%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/records/44279383/edit`
  70/183 interativos visíveis (**38%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu

<details><summary>📁 Fora do escopo "Registros de Aprendizagem" — 331 erro(s) · 180 aviso(s) · 5 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (201 ocorrência(s) · 30 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _66 ocorrência(s) em 8 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _53 ocorrência(s) em 3 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
- **Erro JavaScript no navegador** — _32 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _6 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 401 ()
  `https://registrosf2.stage.twygoead.com/o/37079/records/44279361/edit`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/inactivate-user-C_s-C92R.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/inactivate-user-C_s-C92R.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-BQPwCIjw.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _3 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-BQPwCIjw.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > requestStorageAccess: Permission denied.
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/academy-icon-button-Bof2V-Rf.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/academy-icon-button-Bof2V-Rf.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/chat-icon-button-asCplKp-.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/chat-icon-button-asCplKp-.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notificate-icon-button-CPQqm-3o.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notificate-icon-button-CPQqm-3o.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/beta-notification-f0Na25tr.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/beta-notification-f0Na25tr.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-with-pagination-Z534i34l.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-with-pagination-Z534i34l.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-pop-up-m5j9lMzm.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-pop-up-m5j9lMzm.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/confirmation-modal-organization-password-B3Zs2NwX.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/confirmation-modal-organization-password-B3Zs2NwX.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/terms-modal-D4Z_9Twe.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/terms-modal-D4Z_9Twe.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/nps-modal-awTGdwNI.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/nps-modal-awTGdwNI.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/records-list-container-fozA9-6o.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/records-list-container-fozA9-6o.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records`

#### ⚠️ Respostas HTTP de falha (91 no total · 37 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | 48 |
| 401 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/event_sources/get_provider_names?status=active&search_query=&search_field=name&page=1` | 6 |
| 400 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=treinamentos&with_notification_history=true` | 3 |
| 400 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | 1 |
| 400 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-MSA2NPQT-DGiSkoZG.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-6RSEZNRH-BXGhDHBH.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-QINAG4RG-DwGMvuQi.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-OFOVX77R-D2by_ABS.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-UVUR7MCU-D8r0chLg.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-TK6VMDNP-DzXA8ny7.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/academy-icon-button-Bof2V-Rf.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-B5sTt8M8.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-6QYXN73V-lze1pGEJ.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-CCqa6T4e.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-7OLJDQMT-Bm_aaujz.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-DFWC5MHP-COxNiUmT.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-CjT9HjP0.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-DEUJ9az_.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-BZDCPGYF-FKXNBb3N.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-TXZFUZNG-BQK9TbA-.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/disable-account-modal-C5YkGaUF.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/manual-beta-test-survey-modal-Be2dMvs3.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/notification-wrapper-with-pagination-Z534i34l.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/resource-selector-input-IxHrohtr.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-BH_7lbMP.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/beta-testing-event-bus-DPdaQQ-z.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/closest-edge-CYSpFzFi.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-KHDB22PD-CHly_C8G.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/terms-modal-D4Z_9Twe.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-4YMKQ5D4-DJC8AlTB.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/change-CV12SbJc.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/certificate-model-preview-CejNa2wK.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/grid-components-BTe-4l1M.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/contract-block-modal-Bd68QdLJ.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/reorder-CC7uUHd_.min.js` | 1 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/beta-end-modal-container-control-B4Q71ItZ.min.js` | 1 |

#### ❌ Acessibilidade — axe-core (224 no total · 17 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.brand-hidden > .back-dashboard[href$="dashboard"]`
  ```html
  <a class="back-dashboard" href="/o/37079/dashboard">
  Registros F2
  </a>
  ```
- **`image-alt`** _(critical)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`landmark-one-main`** _(moderate)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`list`** _(serious)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`meta-viewport`** _(moderate)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`page-has-heading-one`** _(moderate)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 18 ocorrência(s) em 7 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Registros F2"][title="Logo - Registros F2"]`
  ```html
  <img title="Logo - Registros F2" alt="Logo - Registros F2" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/assets/twygo-brand-f6d14910670a003a0ff67641a9f5e2cc7661d1f0f9711496dabb7
  ```
- **`aria-allowed-attr`** _(critical)_ — 17 ocorrência(s) em 7 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:rh\:`
  ```html
  <div id="popover-trigger-:rh:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:rh:" class="css-tz0gqg">
  ```
- **`landmark-unique`** _(moderate)_ — 17 ocorrência(s) em 7 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(28) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`label`** _(critical)_ — 15 ocorrência(s) em 6 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#react-select-2-input`
  ```html
  <input class="creatable-select-fie..." autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-2-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-ex
  ```
- **`aria-command-name`** _(serious)_ — 11 ocorrência(s) em 5 URL(s)
  [a11y/aria-command-name] ARIA commands must have an accessible name · _WCAG: cat.aria, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=playwright)
  Seletor: `.tw\:size-full`
  ```html
  <div class="tw:flex tw:size-full tw:items-center tw:justify-center" role="button">
  ```
- **`aria-input-field-name`** _(serious)_ — 11 ocorrência(s) em 5 URL(s)
  [a11y/aria-input-field-name] ARIA input fields must have an accessible name · _WCAG: cat.aria, wcag2a, wcag412, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-input-field-name?application=playwright)
  Seletor: `.slate-editor`
  ```html
  <div role="textbox" aria-multiline="true" class="slate-editor ignore-..." aria-disabled="false" data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1">
  ```
- **`button-name`** _(critical)_ — 11 ocorrência(s) em 5 URL(s)
  [a11y/button-name] Buttons must have discernible text · _WCAG: cat.name-role-value, wcag2a, wcag412, section508, section508.22.a, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)
  Seletor: `.css-p9077h > .tw\:group\/toolbar-group.tw\:has-\[button\]\:flex.tw\:has-\[select\]\:flex:nth-child(1) > .tw\:flex.tw\:items-center > .tw\:gap-2.tw\:min-w-8.tw\:px-1\.5:nth-child(1)`
  ```html
  <button type="button" class="tw:inline-flex tw:cu..." id="undo-toolbar-button" tabindex="0" disabled="" data-orientation="horizontal" data-radix-collectio...="">
  ```
- **`empty-table-header`** _(minor)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `#select`
  ```html
  <th id="select" class="css-vxt0e6">
  ```
- **`role-img-alt`** _(serious)_ — 5 ocorrência(s) em 1 URL(s)
  [a11y/role-img-alt] [role="img"] elements must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/role-img-alt?application=playwright)
  Seletor: `div[data-test-id="records-kpi-card-emitted"] > .css-rdwj84 > .css-15nqf75 > canvas`
  ```html
  <canvas role="img" height="64" width="64" style="display: block; box-sizing: border-box; height: 64px; width: 64px;"></canvas>
  ```
- **`select-name`** _(critical)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```
- **`nested-interactive`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/nested-interactive] Interactive controls must not be nested · _WCAG: cat.keyboard, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=playwright)
  Seletor: `.css-kjvu41.chakra-menu__menu-button[aria-controls="menu-list-:rt:"]`
  ```html
  <button id="menu-button-:rt:" aria-expanded="false" aria-haspopup="menu" aria-controls="menu-list-:rt:" class="chakra-menu__menu-button css-kjvu41">
  ```

</details>

---
