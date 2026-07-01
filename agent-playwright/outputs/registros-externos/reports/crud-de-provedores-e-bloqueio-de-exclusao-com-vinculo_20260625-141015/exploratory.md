# Validação Exploratória — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Registros de Aprendizagem"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## CRUD de Provedores e bloqueio de exclusão com vínculo

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (2)

- `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
  105/173 interativos visíveis (**61%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu
- `https://registrosf2.stage.twygoead.com/o/37079/event_sources/new`
  48/118 interativos visíveis (**41%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu

<details><summary>📁 Fora do escopo "Registros de Aprendizagem" — 737 erro(s) · 389 aviso(s) · 19 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (584 ocorrência(s) · 43 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _151 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _136 ocorrência(s) em 6 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _88 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _16 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/inactivate-user-X1w_zFxs.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _16 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/inactivate-user-X1w_zFxs.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _12 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-BtDuJTjq.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _12 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-BtDuJTjq.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _8 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/academy-icon-button-CGeSsUn_.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _8 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/academy-icon-button-CGeSsUn_.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _8 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/chat-icon-button-BVmPgIzQ.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _8 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/chat-icon-button-BVmPgIzQ.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _8 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notificate-icon-button-DafL5rY8.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _8 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notificate-icon-button-DafL5rY8.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _7 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_CONNECTION_RESET
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _6 ocorrência(s) em 2 URL(s)_
  > requestStorageAccess: Permission denied.
- **Erro de execução da página** — _6 ocorrência(s) em 1 URL(s)_
  > TwygoApplication is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _5 ocorrência(s) em 1 URL(s)_
  > $ is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/beta-notification-CkQ_a98L.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/beta-notification-CkQ_a98L.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-with-pagination-4PKuGTGl.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-wrapper-with-pagination-4PKuGTGl.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/records-list-container-Dhi2xRXW.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/records-list-container-Dhi2xRXW.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/confirmation-modal-organization-password-Cw3GYNgL.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/confirmation-modal-organization-password-Cw3GYNgL.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-pop-up-BrGoYb4B.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/notification-pop-up-BrGoYb4B.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/terms-modal-BEqPb7pP.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/terms-modal-BEqPb7pP.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > TypeError: Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/nps-modal-BMpaJeqN.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to fetch dynamically imported module: https://cdn-stage.twygo.com/vite/assets/nps-modal-BMpaJeqN.min.js
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 2 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
- **Erro de execução da página** — _3 ocorrência(s) em 1 URL(s)_
  > t is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _3 ocorrência(s) em 1 URL(s)_
  > TwygoMenu is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _3 ocorrência(s) em 1 URL(s)_
  > TwygoCommon is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 422 ()
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _2 ocorrência(s) em 1 URL(s)_
  > $(...).menu is not a function
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro de execução da página** — _2 ocorrência(s) em 1 URL(s)_
  > TwygoRecommend is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 (Bad Request)
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 500 ()
  `https://registrosf2.stage.twygoead.com/o/37079/event_sources/new`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > jQuery is not defined
  `https://registrosf2.stage.twygoead.com/o/37079/records?tab=event-sources-tab`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > This CKEditor 4.17.1 version is not secure. Consider upgrading to the latest one, 4.25.1-lts: https://ckeditor.com/ckeditor-4-support/
  `https://registrosf2.stage.twygoead.com/o/37079/edit?profile=admin`
- **Erro de execução da página** — _1 ocorrência(s) em 1 URL(s)_
  > not_found
  `https://registrosf2.stage.twygoead.com/o/37079/edit?profile=admin`

#### ❌ Respostas HTTP de falha (245 no total · 56 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | 88 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-2OOHT3W5-RKsvE71e.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-DMO4EI7P-DEN2Om2Y.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-4FCEGNGT-CaCmNIuS.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-6QYXN73V-DAbHBNyP.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/application-container-Dx-H_itD.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/moment-C0Zk_lh6.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-6CVSDS6C-v_2IVaB2.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/disable-account-modal-C0luR49C.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/form-BWkWf6kv.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-KRPLQIP4-BMbHgbJQ.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/beta-testing-event-bus-B4MZTd8R.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/list-control-provider-Dp4MLmnG.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/pagination-BR4FbiCE.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-wHXqJM9p.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-W7A7QDAK-CPSgaMGW.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/search-input-CPHDqLRg.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/records-list-container-Dhi2xRXW.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-BZDCPGYF-DuJoqWoH.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/certificate-model-preview-BAq-XbIu.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/create-chat-conversation-factory-BwHj_GUM.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-C-6jh7vt.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/custom-workload-seconds-BojMpIqt.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/evidences-value-DK5yRHa7.min.js` | 4 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-MGVPL3OH-DWlfTR2j.min.js` | 4 |
| 422 | DELETE | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/event_sources/1057` | 3 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-JQMJHPZH-CDXHFMvn.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-RAWN7VJ3-BgLkA0zX.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-K7XRJ7NL-DsGS2lF3.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-57I6FYPZ-DhBLqNOL.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-Ci_YvRnJ.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/beta-notification-CkQ_a98L.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/beta-survey-COMf7Yx4.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/inactivate-user-X1w_zFxs.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/notification-wrapper-with-pagination-4PKuGTGl.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/Calendar-Cqvrfil4.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-5TWLKMYI-2qSjzx_T.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/filter-control-CjvObq_e.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/manual-beta-test-survey-modal-CWygFnxH.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-BqN8rmHM.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/desktop-tabs-n5R7_Lcz.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-IAXSQ4X2-DFhfbQPe.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-2ZHRCML3-yqwu0KVe.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-EjIxUpl7.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-7OLJDQMT-CgnRcZ_M.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/index-DRhVUbjf.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/grid-components-F0c466kx.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/utils-DKnl9mSB.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/reorder-Bpvjt0cY.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/contract-block-card-DjpfqUA1.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/chunk-T2WCTPDH-B_li7adE.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/store-archive-factory-4agh68ku.min.js` | 2 |
| 404 | GET | `https://cdn-stage.twygo.com/vite/assets/thread-list-BafexytE.min.js` | 2 |
| 400 | GET | `https://www.clarity.ms/tag/oizme88931` | 2 |
| 500 | POST | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/event_sources` | 1 |
| 404 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/share_certificate_configs` | 1 |

#### ❌ Acessibilidade — axe-core (316 no total · 12 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 32 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.brand-hidden > .back-dashboard[href$="dashboard"]`
  ```html
  <a class="back-dashboard" href="/o/37079/dashboard">
  Registros F2
  </a>
  ```
- **`landmark-unique`** _(moderate)_ — 32 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(30) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`meta-viewport`** _(moderate)_ — 32 ocorrência(s) em 2 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`aria-allowed-attr`** _(critical)_ — 27 ocorrência(s) em 2 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:rf\:`
  ```html
  <div id="popover-trigger-:rf:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:rf:" class="css-tz0gqg">
  ```
- **`image-alt`** _(critical)_ — 27 ocorrência(s) em 2 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`landmark-one-main`** _(moderate)_ — 27 ocorrência(s) em 2 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`list`** _(serious)_ — 27 ocorrência(s) em 2 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`page-has-heading-one`** _(moderate)_ — 27 ocorrência(s) em 2 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 27 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Registros F2"][title="Logo - Registros F2"]`
  ```html
  <img title="Logo - Registros F2" alt="Logo - Registros F2" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/assets/twygo-brand-f6d14910670a003a0ff67641a9f5e2cc7661d1f0f9711496dabb7
  ```
- **`label`** _(critical)_ — 21 ocorrência(s) em 1 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.css-1q31bl5 > .chakra-checkbox__input[type="checkbox"][value=""]`
  ```html
  <input class="chakra-checkbox__input" type="checkbox" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: n
  ```
- **`empty-table-header`** _(minor)_ — 19 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `#select`
  ```html
  <th id="select" class="css-vxt0e6">
  ```
- **`select-name`** _(critical)_ — 18 ocorrência(s) em 1 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```

</details>

---
