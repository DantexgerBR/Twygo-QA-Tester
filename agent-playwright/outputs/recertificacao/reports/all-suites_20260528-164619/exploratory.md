# Validação Exploratória — Recertificação

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Recertificação"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Configuração de Conteúdo (Switch "Habilitar reinscrição")

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (5)

- `https://recertificacao-testeqa.stage.twygoead.com/o/37048/contents/807412/edit?tab=access`
  75/166 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://recertificacao-testeqa.stage.twygoead.com/contents/807401/edit`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://recertificacao-testeqa.stage.twygoead.com/contents/807411/edit`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/e/3/edit`
  1/1 interativos visíveis (**100%**) · amostra: link: Voltar para página inicial
- `https://recertificacao-testeqa.stage.twygoead.com/e/807278/edit`
  85/171 interativos visíveis (**50%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu

<details><summary>📁 Fora do escopo "Recertificação" — 30 erro(s) · 24 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (14 ocorrência(s) · 4 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _5 ocorrência(s) em 4 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
  `https://recertificacao-testeqa.stage.twygoead.com/o/37048/events?tab=events&profile=admin`
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 3 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 2 URL(s)_
  > This CKEditor 4.17.1 version is not secure. Consider upgrading to the latest one, 4.25.1-lts: https://ckeditor.com/ckeditor-4-support/

#### ⚠️ Respostas HTTP de falha (7 no total · 5 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | 2 |
| 400 | GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | 2 |
| 404 | GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807401/edit` | 1 |
| 404 | GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807411/edit` | 1 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/e/3/edit` | 1 |

#### ❌ Acessibilidade — axe-core (33 no total · 13 regra(s) única(s))

- **`landmark-one-main`** _(moderate)_ — 5 ocorrência(s) em 5 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 5 ocorrência(s) em 5 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Recertificação"][title="Logo - Recertificação"]`
  ```html
  <img title="Logo - Recertificação" alt="Logo - Recertificação" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_37048_medium_logo_1779798883.jpg?1779798883">
  ```
- **`color-contrast`** _(serious)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.css-1ow1udt.chakra-text:nth-child(1)`
  ```html
  <span class="chakra-text css-1ow1udt">BETA</span>
  ```
- **`image-alt`** _(critical)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`page-has-heading-one`** _(moderate)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`html-has-lang`** _(serious)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`landmark-unique`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(28) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
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
- **`aria-allowed-attr`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r7\:`
  ```html
  <div id="popover-trigger-:r7:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r7:" class="css-tz0gqg">
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
- **`label`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#react-select-2-input`
  ```html
  <input class="creatable-select-fie..." autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-2-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-ex
  ```

</details>

---

## Filtro Avançado Status Substituído

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (3)

- `https://recertificacao-testeqa.stage.twygoead.com/e/806852/learning`
  131/286 interativos visíveis (**46%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://recertificacao-testeqa.stage.twygoead.com/e/807287/learning`
  99/271 interativos visíveis (**37%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu

<details><summary>📁 Fora do escopo "Recertificação" — 55 erro(s) · 25 aviso(s) · 2 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (23 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _15 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_NAME_NOT_RESOLVED
- **Erro JavaScript no navegador** — _5 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
  `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students`

#### ⚠️ Respostas HTTP de falha (3 no total · 1 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students` | 3 |

#### ❌ Acessibilidade — axe-core (56 no total · 16 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 8 ocorrência(s) em 3 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.row > .menu-main > .menu-main > .has-submenu.menu-item:nth-child(7) > .item-submenu-flex[name="skills"] > div > div:nth-child(2) > span`
  ```html
  <span id="beta-badge">
  BETA
  </span>
  ```
- **`label`** _(critical)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#react-select-2-input`
  ```html
  <input class="select__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-2-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expanded="fa
  ```
- **`landmark-unique`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(22) > div[aria-label="Notifications-top"][aria-live="polite"][role="region"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`meta-viewport`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`landmark-one-main`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`region`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```
- **`aria-dialog-name`** _(serious)_ — 3 ocorrência(s) em 1 URL(s)
  [a11y/aria-dialog-name] ARIA dialog and alertdialog nodes should have an accessible name · _WCAG: cat.aria, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-dialog-name?application=playwright)
  Seletor: `#chakra-modal-\:rr\:`
  ```html
  <div role="dialog" id="chakra-modal-:rr:" tabindex="-1" aria-modal="true" class="chakra-slide chakra-..." style="position: fixed; rig..." aria-describedby="chakra-modal--body-:...">
  ```
- **`label-title-only`** _(serious)_ — 3 ocorrência(s) em 1 URL(s)
  [a11y/label-title-only] Form elements should have a visible label · _WCAG: cat.forms, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label-title-only?application=playwright)
  Seletor: `#react-select-2-input`
  ```html
  <input class="select__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-2-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expanded="fa
  ```
- **`html-has-lang`** _(serious)_ — 3 ocorrência(s) em 1 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`aria-allowed-attr`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r9\:`
  ```html
  <div id="popover-trigger-:r9:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r9:" class="css-tz0gqg">
  ```
- **`aria-progressbar-name`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/aria-progressbar-name] ARIA progressbar nodes must have an accessible name · _WCAG: cat.aria, wcag2a, wcag111, EN-301-549, EN-9.1.1.1, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name?application=playwright)
  Seletor: `#td-progress_score-0 > .css-fqllj7.chakra-stack > .css-c02efi > .css-83oy7k[aria-valuemax="100"][aria-valuemin="0"]`
  ```html
  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="css-83oy7k" style="width: 0%;"></div>
  ```
- **`empty-table-header`** _(minor)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `#select`
  ```html
  <th id="select" class="css-vxt0e6">
  ```
- **`image-alt`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`list`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`page-has-heading-one`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
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

## Isolamento de Progresso, Score e Attendance por Inscrição

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (4)

- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://recertificacao-testeqa.stage.twygoead.com/e/806755/learning`
  131/367 interativos visíveis (**36%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1`
  1/1 interativos visíveis (**100%**) · amostra: link: Voltar para página inicial
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2`
  1/1 interativos visíveis (**100%**) · amostra: link: Voltar para página inicial

<details><summary>📁 Fora do escopo "Recertificação" — 40 erro(s) · 32 aviso(s) · 2 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (8 ocorrência(s) · 4 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
  `https://recertificacao-testeqa.stage.twygoead.com/e/806755/learning`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_NAME_NOT_RESOLVED
  `https://recertificacao-testeqa.stage.twygoead.com/e/806755/learning`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 422 ()
  `https://recertificacao-testeqa.stage.twygoead.com/e/806755/learning`
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()

#### ⚠️ Respostas HTTP de falha (4 no total · 3 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 422 | POST | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/contents/806755/event_participants` | 2 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1` | 1 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2` | 1 |

#### ❌ Acessibilidade — axe-core (62 no total · 15 regra(s) única(s))

- **`landmark-one-main`** _(moderate)_ — 10 ocorrência(s) em 4 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`page-has-heading-one`** _(moderate)_ — 10 ocorrência(s) em 4 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`document-title`** _(serious)_ — 8 ocorrência(s) em 3 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`html-has-lang`** _(serious)_ — 8 ocorrência(s) em 3 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`image-alt`** _(critical)_ — 4 ocorrência(s) em 3 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`region`** _(moderate)_ — 4 ocorrência(s) em 3 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Recertificação"][title="Logo - Recertificação"]`
  ```html
  <img title="Logo - Recertificação" alt="Logo - Recertificação" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_37048_medium_logo_1779798883.jpg?1779798883">
  ```
- **`aria-allowed-attr`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r7\:`
  ```html
  <div id="popover-trigger-:r7:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r7:" class="css-tz0gqg">
  ```
- **`aria-progressbar-name`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/aria-progressbar-name] ARIA progressbar nodes must have an accessible name · _WCAG: cat.aria, wcag2a, wcag111, EN-301-549, EN-9.1.1.1, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-progressbar-name?application=playwright)
  Seletor: `#td-progress_score-0 > .css-fqllj7.chakra-stack > .css-c02efi > .css-83oy7k[aria-valuemax="100"][aria-valuemin="0"]`
  ```html
  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="css-83oy7k" style="width: 0%;"></div>
  ```
- **`color-contrast`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.css-1ow1udt.chakra-text:nth-child(1)`
  ```html
  <span class="chakra-text css-1ow1udt">BETA</span>
  ```
- **`empty-table-header`** _(minor)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `#select`
  ```html
  <th id="select" class="css-vxt0e6">
  ```
- **`label`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `.css-1q31bl5 > .chakra-checkbox__input[type="checkbox"][value=""]`
  ```html
  <input class="chakra-checkbox__input" type="checkbox" value="" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; width: 1px; margin: -1px; padding: 0px; overflow: hidden; white-space: n
  ```
- **`landmark-unique`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(24) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
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
- **`select-name`** _(critical)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/select-name] Select element must have an accessible name · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright)
  Seletor: `#select_pages`
  ```html
  <select id="select_pages" class="chakra-select css-1gq5ikj"><option value="25" id="id_select_25">25 por página </option><option value="50" id="id_select_50">50 por página </option><option value="100" 
  ```

</details>

---

## Reinscrição em Massa pelo Admin

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (2)

- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/3/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/4/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 9 erro(s) · 9 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (3 ocorrência(s) · 1 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _3 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()

#### ⚠️ Respostas HTTP de falha (3 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/3/learning_students` | 2 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/4/learning_students` | 1 |

#### ❌ Acessibilidade — axe-core (12 no total · 4 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 3 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`html-has-lang`** _(serious)_ — 3 ocorrência(s) em 2 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`landmark-one-main`** _(moderate)_ — 3 ocorrência(s) em 2 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`region`** _(moderate)_ — 3 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```

</details>

---

## Reinscrição Individual pelo Admin

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (3)

- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/learning_students`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 16 erro(s) · 16 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (4 ocorrência(s) · 1 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _4 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()

#### ⚠️ Respostas HTTP de falha (4 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students` | 3 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/learning_students` | 1 |

#### ❌ Acessibilidade — axe-core (24 no total · 6 regra(s) única(s))

- **`html-has-lang`** _(serious)_ — 6 ocorrência(s) em 3 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`landmark-one-main`** _(moderate)_ — 6 ocorrência(s) em 3 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`color-contrast`** _(serious)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`region`** _(moderate)_ — 4 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```
- **`document-title`** _(serious)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`page-has-heading-one`** _(moderate)_ — 2 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```

</details>

---

## Reinscrição pelo Aluno (Play e Link Público)

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (3)

- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/play/event/1`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/play/pacote-recertificacao-staging/course_registrations?recertification=true`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 60 erro(s) · 51 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (14 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _6 ocorrência(s) em 1 URL(s)_
  > WebSocket connection to 'wss://chat-staging.twygo.com.br/socket.io/?token=&EIO=4&transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 503
  `https://basedeconhecimento.stage.twygoead.com/dashboard_students`
- **Erro JavaScript no navegador** — _5 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
  `https://basedeconhecimento.stage.twygoead.com/dashboard_students`

#### ⚠️ Respostas HTTP de falha (5 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/play/event/1` | 3 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/play/pacote-recertificacao-staging/course_registrations?recertification=true` | 2 |

#### ❌ Acessibilidade — axe-core (92 no total · 6 regra(s) única(s))

- **`html-has-lang`** _(serious)_ — 23 ocorrência(s) em 3 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`landmark-one-main`** _(moderate)_ — 23 ocorrência(s) em 3 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`document-title`** _(serious)_ — 18 ocorrência(s) em 1 URL(s)
  [a11y/document-title] Documents must have <title> element to aid in navigation · _WCAG: cat.text-alternatives, wcag2a, wcag242, TTv5, TT12.a, EN-301-549, EN-9.2.4.2, ACT, RGAAv4, RGAA-8.5.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/document-title?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`page-has-heading-one`** _(moderate)_ — 18 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html><head></head><body></body></html>
  ```
- **`color-contrast`** _(serious)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`region`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```

</details>

---

## Reinscrição via Importação CSV

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (2)

- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/import_participants`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/o/37007/events/3/import_participants`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_

<details><summary>📁 Fora do escopo "Recertificação" — 15 erro(s) · 15 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (5 ocorrência(s) · 1 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _5 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()

#### ⚠️ Respostas HTTP de falha (5 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/import_participants` | 4 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/3/import_participants` | 1 |

#### ❌ Acessibilidade — axe-core (20 no total · 4 regra(s) única(s))

- **`color-contrast`** _(serious)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `h1`
  ```html
  <h1>The page you were looking for doesn't exist.</h1>
  ```
- **`html-has-lang`** _(serious)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/html-has-lang] <html> element must have a lang attribute · _WCAG: cat.language, wcag2a, wcag311, TTv5, TT11.a, EN-301-549, EN-9.3.1.1, ACT, RGAAv4, RGAA-8.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/html-has-lang?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`landmark-one-main`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
  ```
- **`region`** _(moderate)_ — 5 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `div`
  ```html
  <div class="dialog">
      <h1>The page you were looking for doesn't exist.</h1>
      <p>You may have mistyped the address or the page may have moved.</p>
    </div>
  ```

</details>

---

## Smoke — Infra Twygo

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (1)

- `https://recertificacao-testeqa.stage.twygoead.com/play?menu_id=play`
  24/83 interativos visíveis (**29%**) · amostra: link: custom_url-menu · link: user_panels-menu · link: my_contents-menu · link: play-menu · link: communities-menu · link · button: Twygo Academy · link

<details><summary>📁 Fora do escopo "Recertificação" — 17 erro(s) · 5 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (13 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _6 ocorrência(s) em 1 URL(s)_
  > Error: <svg> attribute height: Expected length, "lg".
  `https://recertificacao-testeqa.stage.twygoead.com/play?menu_id=play`
- **Erro JavaScript no navegador** — _6 ocorrência(s) em 1 URL(s)_
  > Error: <svg> attribute width: Expected length, "lg".
  `https://recertificacao-testeqa.stage.twygoead.com/play?menu_id=play`
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
  `https://recertificacao-testeqa.stage.twygoead.com/play?menu_id=play`

#### ❌ Acessibilidade — axe-core (9 no total · 9 regra(s) única(s))

- **`aria-allowed-attr`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:rf\:`
  ```html
  <div id="popover-trigger-:rf:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:rf:" class="css-tz0gqg">
  ```
- **`color-contrast`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `#btn-profile`
  ```html
  <button class="btn btn-aluno menu-target br color" id="btn-profile" name="btn-profile">
  Colaborador
  <i class="arrow-target"></i>
  </button>
  ```
- **`image-alt`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`landmark-one-main`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`landmark-unique`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(26) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`list`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-aluno.menu-main`
  ```html
  <ul class="menu-main menu-aluno">
  ```
- **`meta-viewport`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`page-has-heading-one`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Recertificação"][title="Logo - Recertificação"]`
  ```html
  <img title="Logo - Recertificação" alt="Logo - Recertificação" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_37048_medium_logo_1779798883.jpg?1779798883">
  ```

</details>

---

## Smoke: matricularAluno

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (1)

- `https://recertificacao-testeqa.stage.twygoead.com/o/37048/events?tab=events&profile=admin`
  62/228 interativos visíveis (**27%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu

<details><summary>📁 Fora do escopo "Recertificação" — 15 erro(s) · 9 aviso(s) · 1 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (8 ocorrência(s) · 3 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
  `https://recertificacao-testeqa.stage.twygoead.com/o/37048/events?tab=events&profile=admin`
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _1 ocorrência(s) em 1 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 
  `https://recertificacao-testeqa.stage.twygoead.com/o/37048/events?tab=events&profile=admin`

#### ⚠️ Respostas HTTP de falha (4 no total · 2 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | 2 |
| 400 | GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | 2 |

#### ❌ Acessibilidade — axe-core (13 no total · 13 regra(s) única(s))

- **`aria-allowed-attr`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r7\:`
  ```html
  <div id="popover-trigger-:r7:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r7:" class="css-tz0gqg">
  ```
- **`button-name`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/button-name] Buttons must have discernible text · _WCAG: cat.name-role-value, wcag2a, wcag412, section508, section508.22.a, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.9.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/button-name?application=playwright)
  Seletor: `#filter-button`
  ```html
  <button id="filter-button">
  <i class="fas fa-filter" style="color: #FFF;"></i>
  </button>
  ```
- **`color-contrast`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.row > .menu-main > .menu-main > .menu-opened.has-submenu.menu-item > .submenu > li:nth-child(3) > .submenu-records[href$="records"][name="records-menu"] > div > .badge-span`
  ```html
  <span class="badge-span" id="beta-badge">
  BETA
  </span>
  ```
- **`empty-table-header`** _(minor)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `div:nth-child(3) > table > thead > tr > th:nth-child(1)`
  ```html
  <th style="width: 50px"></th>
  ```
- **`image-alt`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`label`** _(critical)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#participant44272423`
  ```html
  <input type="checkbox" name="participant44272423" id="participant44272423" value="44272423">
  ```
- **`landmark-one-main`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`landmark-unique`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(31) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
  ```html
  <div role="region" aria-live="polite" aria-label="Notifications-top" id="chakra-toast-manager..." style="position: fixed; z-i...">
  ```
- **`list`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```
- **`listitem`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/listitem] <li> elements must be contained in a <ul> or <ol> · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/listitem?application=playwright)
  Seletor: `#paginate-participants-confirmed > .content_page > .participant_buttons`
  ```html
  <li class="participant_buttons">
  ```
- **`meta-viewport`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`page-has-heading-one`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`region`** _(moderate)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - Recertificação"][title="Logo - Recertificação"]`
  ```html
  <img title="Logo - Recertificação" alt="Logo - Recertificação" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_37048_medium_logo_1779798883.jpg?1779798883">
  ```

</details>

---
