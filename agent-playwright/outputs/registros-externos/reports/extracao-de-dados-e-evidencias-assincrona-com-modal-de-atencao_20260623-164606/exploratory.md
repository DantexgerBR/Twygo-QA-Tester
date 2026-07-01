# Validação Exploratória — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Registros de Aprendizagem"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Extração de dados e evidências (assíncrona com modal de atenção)

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (1)

- `https://registrosf2.stage.twygoead.com/o/37079/records`
  119/315 interativos visíveis (**38%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: knowledge_repositories-menu · link: users-menu · link: companies-menu

<details><summary>📁 Fora do escopo "Registros de Aprendizagem" — 183 erro(s) · 112 aviso(s) · 11 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (76 ocorrência(s) · 5 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _27 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _27 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
- **Erro JavaScript no navegador** — _10 ocorrência(s) em 1 URL(s)_
  > TypeError: Cannot read properties of undefined (reading 'colorScheme')     at K1 (https://cdn-stage.twygo.com/vite/assets/primary-color-DZiMbevb.min.js:17:16432)     at https://cdn-stage.twygo.com/vite/assets/primary-color-DZiMbevb.min.js:17:17288     at Eu (https://cdn-stage.twygo.com/vite/assets/entrypoints/application.ts-D7H-dpwN.min.js:39:16979)     at ac (https://cdn-stage.twygo.com/vite/asse ... [truncado, 1078 chars total]
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro de execução da página** — _10 ocorrência(s) em 1 URL(s)_
  > Cannot read properties of undefined (reading 'colorScheme')
  `https://registrosf2.stage.twygoead.com/o/37079/records`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
  `https://registrosf2.stage.twygoead.com/o/37079/records`

#### ⚠️ Respostas HTTP de falha (27 no total · 1 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | 27 |

#### ❌ Acessibilidade — axe-core (203 no total · 13 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 26 ocorrência(s) em 1 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.brand-hidden > .back-dashboard[href$="dashboard"]`
  ```html
  <a class="back-dashboard" href="/o/37079/dashboard">
  Registros F2
  </a>
  ```
- **`landmark-unique`** _(moderate)_ — 26 ocorrência(s) em 1 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(28) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`meta-viewport`** _(moderate)_ — 26 ocorrência(s) em 1 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`select-name`** _(critical)_ — 26 ocorrência(s) em 1 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```
- **`aria-allowed-attr`** _(critical)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:rf\:`
  ```html
  <div id="popover-trigger-:rf:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:rf:" class="css-tz0gqg">
  ```
- **`empty-table-header`** _(minor)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `#select`
  ```html
  <th id="select" class="css-vxt0e6">
  ```
- **`image-alt`** _(critical)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`label`** _(critical)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.css-1q31bl5 > .chakra-checkbox__input[type="checkbox"][value=""]`
  ```html
  <input class="chakra-checkbox__input" type="checkbox" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: n
  ```
- **`landmark-one-main`** _(moderate)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`list`** _(serious)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`page-has-heading-one`** _(moderate)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Registros F2"][title="Logo - Registros F2"]`
  ```html
  <img title="Logo - Registros F2" alt="Logo - Registros F2" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/assets/twygo-brand-f6d14910670a003a0ff67641a9f5e2cc7661d1f0f9711496dabb7
  ```
- **`role-img-alt`** _(serious)_ — 11 ocorrência(s) em 1 URL(s)
  [a11y/role-img-alt] [role="img"] elements must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/role-img-alt?application=playwright)
  Seletor: `div[data-test-id="records-kpi-card-emitted"] > .css-rdwj84 > .css-15nqf75 > canvas`
  ```html
  <canvas role="img" height="64" width="64" style="display: block; box-sizing: border-box; height: 64px; width: 64px;"></canvas>
  ```

</details>

---
