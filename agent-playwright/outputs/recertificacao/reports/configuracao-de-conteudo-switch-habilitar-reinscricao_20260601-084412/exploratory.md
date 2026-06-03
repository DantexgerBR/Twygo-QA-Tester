# Validação Exploratória — Recertificação

[← Voltar ao dashboard](index.md)

Achados capturados pelas probes da fixture exploratória durante a execução: erros JS no navegador, respostas HTTP de falha, violações de acessibilidade (axe-core), imagens quebradas e cobertura observada por URL.

Os KPIs principais consideram apenas findings **dentro do escopo "Recertificação"** (rotas e palavras-chave em `project.config.json` → `exploratory.scopedRoutes`/`exploratory.scopedKeywords`). Findings fora do escopo continuam acessíveis em uma seção colapsada por testsuite.

## Configuração de Conteúdo (Switch "Habilitar reinscrição")

_Sem findings in-scope nesta testsuite._

#### ℹ️ Cobertura observada por URL (5)

- `https://recertificacao-testeqa.stage.twygoead.com/o/37048/contents/807447/edit?tab=identification`
  115/207 interativos visíveis (**56%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu
- `https://recertificacao-testeqa.stage.twygoead.com/contents/807401/edit`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://recertificacao-testeqa.stage.twygoead.com/contents/807446/edit`
  0/0 interativos visíveis (**0%**) · amostra: _(vazio)_
- `https://basedeconhecimento.stage.twygoead.com/e/3/edit`
  1/1 interativos visíveis (**100%**) · amostra: link: Voltar para página inicial
- `https://recertificacao-testeqa.stage.twygoead.com/e/807278/edit`
  85/171 interativos visíveis (**50%**) · amostra: link: dashboard-menu · link: new_contents-menu · link: shared_events-menu · link: records-menu · link: certificates-menu · link: content_models-menu · link: knowledge_repositories-menu · link: users-menu

<details><summary>📁 Fora do escopo "Recertificação" — 29 erro(s) · 24 aviso(s) _(silenciado dos KPIs principais)_</summary>

#### ❌ Erros JavaScript no navegador (16 ocorrência(s) · 5 mensagem(ens) distinta(s))

- **Erro JavaScript no navegador** — _5 ocorrência(s) em 4 URL(s)_
  > Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector
- **Erro JavaScript no navegador** — _4 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 400 ()
  `https://recertificacao-testeqa.stage.twygoead.com/o/37048/events?tab=events&profile=admin`
- **Erro JavaScript no navegador** — _3 ocorrência(s) em 3 URL(s)_
  > Failed to load resource: the server responded with a status of 404 ()
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 2 URL(s)_
  > This CKEditor 4.17.1 version is not secure. Consider upgrading to the latest one, 4.25.1-lts: https://ckeditor.com/ckeditor-4-support/
- **Erro JavaScript no navegador** — _2 ocorrência(s) em 1 URL(s)_
  > Failed to load resource: the server responded with a status of 401 ()
  `https://recertificacao-testeqa.stage.twygoead.com/o/37048/contents/807447/edit?tab=identification`

#### ⚠️ Respostas HTTP de falha (9 no total · 6 únicas)

| Status | Método | URL | Ocorrências |
|---:|---|---|---:|
| 400 | GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | 2 |
| 400 | GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | 2 |
| 401 | GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | 2 |
| 404 | GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807401/edit` | 1 |
| 404 | GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807446/edit` | 1 |
| 404 | GET | `https://basedeconhecimento.stage.twygoead.com/e/3/edit` | 1 |

#### ❌ Acessibilidade — axe-core (28 no total · 12 regra(s) única(s))

- **`region`** _(moderate)_ — 5 ocorrência(s) em 5 URL(s)
  [a11y/region] All page content should be contained by landmarks · _WCAG: cat.keyboard, best-practice, RGAAv4, RGAA-9.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/region?application=playwright)
  Seletor: `#tabs-\:rs\:--tabpanel-0`
  ```html
  <div tabindex="0" role="tabpanel" aria-labelledby="tabs-:rs:--tab-0" id="tabs-:rs:--tabpanel-0" class="chakra-tabs__tab-panel css-47dblg">
  ```
- **`color-contrast`** _(serious)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/color-contrast] Elements must meet minimum color contrast ratio thresholds · _WCAG: cat.color, wcag2aa, wcag143, TTv5, TT13.c, EN-301-549, EN-9.1.4.3, ACT, RGAAv4, RGAA-3.2.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)
  Seletor: `.row > .menu-main > .menu-main > .has-submenu.menu-item:nth-child(7) > .item-submenu-flex[name="skills"] > div > div:nth-child(2) > span`
  ```html
  <span id="beta-badge">
  BETA
  </span>
  ```
- **`landmark-one-main`** _(moderate)_ — 4 ocorrência(s) em 4 URL(s)
  [a11y/landmark-one-main] Document should have one main landmark · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright)
  Seletor: `html`
  ```html
  <html>
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
- **`meta-viewport`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/meta-viewport] Zooming and scaling must not be disabled · _WCAG: cat.sensory-and-visual-cues, wcag2aa, wcag144, EN-301-549, EN-9.1.4.4, ACT, RGAAv4, RGAA-10.4.2_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/meta-viewport?application=playwright)
  Seletor: `meta[name="viewport"]`
  ```html
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" name="viewport">
  ```
- **`image-alt`** _(critical)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/image-alt] Images must have alternative text · _WCAG: cat.text-alternatives, wcag2a, wcag111, section508, section508.22.a, TTv5, TT7.a, TT7.b, EN-301-549, EN-9.1.1.1, ACT, RGAAv4, RGAA-1.1.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/image-alt?application=playwright)
  Seletor: `img`
  ```html
  <img src="https://cdn-stage.twygo.com/assets/logo-153ce4f87ac927fa04ec3c58a3845347371d4f6b1456ebac4700843faf12adad.png">
  ```
- **`page-has-heading-one`** _(moderate)_ — 2 ocorrência(s) em 2 URL(s)
  [a11y/page-has-heading-one] Page should contain a level-one heading · _WCAG: cat.semantics, best-practice_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright)
  Seletor: `html`
  ```html
  <html>
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
- **`list`** _(serious)_ — 1 ocorrência(s) em 1 URL(s)
  [a11y/list] <ul> and <ol> must only directly contain <li>, <script> or <template> elements · _WCAG: cat.structure, wcag2a, wcag131, EN-301-549, EN-9.1.3.1, RGAAv4, RGAA-9.3.1_
  [Como corrigir →](https://dequeuniversity.com/rules/axe/4.11/list?application=playwright)
  Seletor: `.mobile-user-menu > .menu-main`
  ```html
  <ul class="menu-main">
  ```

</details>

---
