# Validação Exploratória — Widgets

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Widgets"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Modo de uso - Painéis do usuário

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (3)

- `https://widgets.stage.twygoead.com/o/36988/use_modes/70077/use_mode_itens/new`
  46/123 interativos visíveis (**37%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu
- `about:blank`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://widgets.stage.twygoead.com/o/36988/use_modes/70077/edit?tab=items`
  62/138 interativos visíveis (**45%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: users-menu · link: companies-menu · link: question_lists-menu

<details><summary>📁 Fora do escopo "Widgets" — 21 erro(s) · 12 aviso(s) · 1 info _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (7 ocorrência(s) · 2 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _5 ocorrência(s) em 2 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 2 URL(s)_
  > Framing 'https://www.recaptcha.net/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'". The violation has been logged, but no further action has been taken. 

#### ❌ Acessibilidade — axe-core (27 no total · 15 regra(s) única(s))

- **`landmark-one-main`** _(moderate)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`page-has-heading-one`** _(moderate)_ — 3 ocorrência(s) em 3 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" class="wf-materialicons-n4-inactive wf-materialsymbolsoutlined-n4-inactive wf-inactive" data-theme="light" style="color-scheme: light
  ```
- **`aria-allowed-attr`** _(critical)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/aria-allowed-attr] Elements must only use supported ARIA attributes · _WCAG: cat.aria, wcag2a, wcag412, EN-301-549, EN-9.4.1.2, RGAAv4, RGAA-7.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/aria-allowed-attr?application=playwright)
  Seletor: `#popover-trigger-\:r5\:`
  ```html
  <div id="popover-trigger-:r5:" aria-haspopup="dialog" aria-expanded="false" aria-controls="popover-content-:r5:" class="css-tz0gqg">
  ```
- **`color-contrast`** _(serious)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.top-user-name__infor > .name`
  ```html
  <span class="name">
  Claude Agents
  </span>
  ```
- **`image-alt`** _(critical)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `#mobile-close-menu > img`
  ```html
  <img src="/assets/svg/mobile-close-menu.svg">
  ```
- **`label`** _(critical)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/label] Form elements must have labels · _WCAG: cat.forms, wcag2a, wcag412, section508, section508.22.n, TTv5, TT5.c, EN-301-549, EN-9.4.1.2, ACT, RGAAv4, RGAA-11.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label?application=playwright)
  Seletor: `#react-select-3-input`
  ```html
  <input class="select-field__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-3-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expand
  ```
- **`landmark-unique`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/landmark-unique] Landmarks should have a unique role or role/label/title (i.e. accessible name) combination · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-unique?application=playwright)
  Seletor: `.chakra-portal:nth-child(29) > div[aria-label="Notifications-top"][role="region"][aria-live="polite"]`
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
- **`region`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#mobile-logo > img[alt="Logo - widgets [36988]"][title="Logo - widgets [36988]"]`
  ```html
  <img title="Logo - widgets [36988]" alt="Logo - widgets [36988]" style="height: 50px; align: center" src="https://cdn-stage.twygo.com/uploads/organizations_36988_medium_logo_1778081380.png?1778081380"
  ```
- **`label-title-only`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/label-title-only] Form elements should have a visible label · _WCAG: cat.forms, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/label-title-only?application=playwright)
  Seletor: `#react-select-3-input`
  ```html
  <input class="select-field__input" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-3-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expand
  ```
- **`scrollable-region-focusable`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/scrollable-region-focusable] Scrollable region must have keyboard access · _WCAG: cat.keyboard, wcag2a, wcag211, wcag213, TTv5, TT4.a, EN-301-549, EN-9.2.1.1, EN-9.2.1.3, RGAAv4, RGAA-7.3.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable?application=playwright)
  Seletor: `.css-1wwh21j`
  ```html
  <div class="css-1wwh21j">
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
- **`empty-table-header`** _(minor)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/empty-table-header] Table header text should not be empty · _WCAG: cat.name-role-value, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=playwright)
  Seletor: `.css-1rwtqq5`
  ```html
  <th class="css-1rwtqq5"></th>
  ```

</details>

---
