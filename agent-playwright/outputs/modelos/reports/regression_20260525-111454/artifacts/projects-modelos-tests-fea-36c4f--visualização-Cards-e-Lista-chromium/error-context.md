# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc03-alternancia-visualizacao-cards-lista.spec.ts >> Listagem e Menu de Modelos >> Alternância entre visualização Cards e Lista
- Location: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc03-alternancia-visualizacao-cards-lista.spec.ts:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for getByTestId('content-models-page')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic: U
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Base de conhecimento" [ref=e4]:
        - img "Logo - Base de conhecimento" [ref=e5]
        - generic:
          - img
      - img "Fechar menu" [ref=e7]
    - link "Logar" [ref=e10] [cursor=pointer]:
      - /url: /users/login
  - text: "0"
  - generic [ref=e13]:
    - generic "Logo - Base de conhecimento" [ref=e15]
    - link "Entrar" [ref=e20] [cursor=pointer]:
      - /url: /users/login
    - text: M * M * *
  - generic [ref=e26]:
    - generic "Logo - Base de conhecimento" [ref=e27]:
      - img "Logo - Base de conhecimento" [ref=e28]
    - generic [ref=e29]:
      - textbox "Login" [ref=e31]
      - textbox "Senha" [ref=e33]
      - button "Entrar" [ref=e35] [cursor=pointer]
      - link "Esqueci minha senha" [ref=e36] [cursor=pointer]:
        - /url: /users/password/new
      - link "Reenviar e-mail de confirmação" [ref=e37] [cursor=pointer]:
        - /url: /users/confirmation/new
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1   | import type { Locator, Page } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | import { safeGoto } from '../../../src/utils/modals.js';
  4   | import { getOrgId } from '../../../src/utils/environment.js';
  5   | 
  6   | export class ContentModelsListPage {
  7   |   constructor(private readonly page: Page) {}
  8   | 
  9   |   // CLAUDE.md §7.5: /play vai pra aluno; admin context exige /o/{orgId}/dashboard.
  10  |   async gotoPlay(): Promise<void> {
  11  |     await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
  12  |   }
  13  | 
  14  |   async goToList(): Promise<void> {
  15  |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  16  |   }
  17  | 
  18  |   // Aprendizagem é <a id="learning"> sem href — dispatchEvent contorna actionability.
  19  |   // Sidebar duplica items (mobile+desktop), escopar com #menu.
  20  |   async openAprendizagemMenu(): Promise<void> {
  21  |     await this.page.locator('#menu a#learning').dispatchEvent('click');
  22  |   }
  23  | 
  24  |   async goToModelosFromMenu(): Promise<void> {
  25  |     await this.page.locator('#menu a#content_models').click();
  26  |   }
  27  | 
  28  |   async expectListingLoaded(): Promise<void> {
> 29  |     await expect(this.page.getByTestId('content-models-page')).toBeVisible({
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  30  |       timeout: 60_000,
  31  |     });
  32  |     await expect(
  33  |       this.page.getByRole('heading', { name: 'Modelos de conteúdo' }),
  34  |     ).toBeVisible({ timeout: 60_000 });
  35  |   }
  36  | 
  37  |   // Botão Adicionar (#content-models-add-button) — redireciona pra /content_models/new
  38  |   addButton(): Locator {
  39  |     return this.page.locator('#content-models-add-button');
  40  |   }
  41  | 
  42  |   async clickAdd(): Promise<void> {
  43  |     await this.addButton().click();
  44  |   }
  45  | 
  46  |   // Input de busca por nome (placeholder "Pesquise aqui pelo nome do modelo")
  47  |   searchInput(): Locator {
  48  |     return this.page.locator('#play-interest-search');
  49  |   }
  50  | 
  51  |   async searchByName(name: string): Promise<void> {
  52  |     await this.searchInput().fill(name);
  53  |     // SPA debounce — espera resultado estabilizar
  54  |     await this.page.waitForTimeout(800);
  55  |   }
  56  | 
  57  |   async clearSearch(): Promise<void> {
  58  |     await this.searchInput().fill('');
  59  |     await this.page.waitForTimeout(800);
  60  |   }
  61  | 
  62  |   // Toggles de visualização — spans com IDs (não buttons).
  63  |   // Quando ativo, classe muda (#grid-view-icon = css-g7ay74 ativo, css-15de166 inativo).
  64  |   gridViewIcon(): Locator {
  65  |     return this.page.locator('#grid-view-icon');
  66  |   }
  67  | 
  68  |   listViewIcon(): Locator {
  69  |     return this.page.locator('#list-icon');
  70  |   }
  71  | 
  72  |   async switchToListView(): Promise<void> {
  73  |     // Click via dispatchEvent — span clicável sem role=button
  74  |     await this.listViewIcon().dispatchEvent('click');
  75  |     await this.page.waitForTimeout(800);
  76  |   }
  77  | 
  78  |   async switchToCardsView(): Promise<void> {
  79  |     await this.gridViewIcon().dispatchEvent('click');
  80  |     await this.page.waitForTimeout(800);
  81  |   }
  82  | 
  83  |   // Cards individuais: cada card tem <p class="chakra-text css-1mjnzuf">{nome}</p>
  84  |   // No estado atual, ID interno é #content_models-{id}-... — usar nome como ancora.
  85  |   cardByName(name: string): Locator {
  86  |     // Container do card é o ancestor mais próximo que tem o p.css-1mjnzuf com o nome
  87  |     return this.page
  88  |       .locator('[data-test-id="content-models-page"] p.css-1mjnzuf')
  89  |       .filter({ hasText: name })
  90  |       .locator('xpath=ancestor::div[contains(@class, "css-fuvrtk")][1]');
  91  |   }
  92  | 
  93  |   // Todos cards visíveis (heurística: container de card = .css-fuvrtk dentro do listing)
  94  |   allCards(): Locator {
  95  |     return this.page.locator('[data-test-id="content-models-page"] .css-fuvrtk');
  96  |   }
  97  | 
  98  |   // Asserção genérica: pelo menos N cards renderizados (invariante por count exato)
  99  |   async expectAtLeastNCards(n: number): Promise<void> {
  100 |     const count = await this.allCards().count();
  101 |     expect(count, `esperava ao menos ${n} cards, encontrei ${count}`).toBeGreaterThanOrEqual(n);
  102 |   }
  103 | 
  104 |   // Visão Lista — column headers reais da UI (AT documentou "Nome do provedor"
  105 |   // mas a coluna real é "Provedor"; coluna Ações não tem header textual).
  106 |   expectedListColumns = [
  107 |     'Nome',
  108 |     'Descrição',
  109 |     'Provedor',
  110 |     'Designs',
  111 |     'Aplicação',
  112 |     'Situação',
  113 |     'Atualizado em',
  114 |   ];
  115 | 
  116 |   async expectListColumnsVisible(): Promise<void> {
  117 |     for (const col of this.expectedListColumns) {
  118 |       await expect(
  119 |         this.page.getByRole('columnheader', { name: col }),
  120 |       ).toBeVisible({ timeout: 10_000 });
  121 |     }
  122 |   }
  123 | 
  124 |   // Drawer de filtros — segue padrão canônico documentado em
  125 |   // .claude/skills/testar-filtro-drawer-twygo. IDs do componente são
  126 |   // compartilhados entre listagens Twygo.
  127 |   filterButton(): Locator {
  128 |     return this.page.locator('#open-filter');
  129 |   }
```