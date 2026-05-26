# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\criacao-de-modelo-aba-identificacao\tc06-switch-usar-designs-somente-criacao.spec.ts >> Criação de Modelo - Aba Identificação >> Switch "Usar designs sugeridos" exibido somente na criação
- Location: projects\modelos\tests\features\criacao-de-modelo-aba-identificacao\tc06-switch-usar-designs-somente-criacao.spec.ts:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Identificação', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for getByRole('tab', { name: 'Identificação', exact: true })

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
  6   | type TabName = 'Identificação' | 'Estilo' | 'Estrutura' | 'Imagem' | 'Áudio' | 'Design' | 'Compartilhar';
  7   | 
  8   | export class ContentModelEditPage {
  9   |   constructor(private readonly page: Page) {}
  10  | 
  11  |   // Helper unificado pras 7 abas de edição. Antes usávamos
  12  |   // `[data-test-id="tab-X"]` mas em 2026-05-22 confirmamos via chrome-devtools-mcp
  13  |   // que o produto Twygo removeu esses atributos (regressão reportada). Mudança
  14  |   // pra getByRole + name é defensiva — aria-selected funciona igual.
  15  |   tab(name: TabName): Locator {
  16  |     return this.page.getByRole('tab', { name, exact: true });
  17  |   }
  18  | 
  19  |   async gotoNew(): Promise<void> {
  20  |     await safeGoto(this.page, `/o/${getOrgId()}/content_models/new`);
  21  |     await this.expectIdentificationTabActive();
  22  |   }
  23  | 
  24  |   async gotoEdit(id: number | string): Promise<void> {
  25  |     await safeGoto(this.page, `/o/${getOrgId()}/content_models/${id}/edit`);
  26  |     await this.expectIdentificationTabActive();
  27  |   }
  28  | 
  29  |   async expectIdentificationTabActive(): Promise<void> {
  30  |     const tab = this.tab('Identificação');
> 31  |     await expect(tab).toBeVisible({ timeout: 30_000 });
      |                       ^ Error: expect(locator).toBeVisible() failed
  32  |     await expect(tab).toHaveAttribute('aria-selected', 'true');
  33  |   }
  34  | 
  35  |   // Inputs da aba Identificação
  36  |   nameInput(): Locator {
  37  |     return this.page.locator('#content-models-name-input');
  38  |   }
  39  | 
  40  |   descriptionTextarea(): Locator {
  41  |     return this.page.locator('#content-models-description-textarea');
  42  |   }
  43  | 
  44  |   kitDeMarcaInput(): Locator {
  45  |     // react-select; id estável do input interno
  46  |     return this.page.locator('#react-select-2-input');
  47  |   }
  48  | 
  49  |   // Switches (Chakra renderiza input hidden — interagir via label)
  50  |   usarComoPadraoLabel(): Locator {
  51  |     return this.page.locator('label[for="is_default"]');
  52  |   }
  53  | 
  54  |   usarDesignsSugeridosLabel(): Locator {
  55  |     return this.page.locator('label[for="use_suggested_designs"]');
  56  |   }
  57  | 
  58  |   ativoLabel(): Locator {
  59  |     return this.page.locator('label[for="situation"]');
  60  |   }
  61  | 
  62  |   usarComoPadraoChecked(): Promise<boolean> {
  63  |     return this.page.locator('#is_default').isChecked();
  64  |   }
  65  | 
  66  |   usarDesignsSugeridosChecked(): Promise<boolean> {
  67  |     return this.page.locator('#use_suggested_designs').isChecked();
  68  |   }
  69  | 
  70  |   ativoChecked(): Promise<boolean> {
  71  |     return this.page.locator('#situation').isChecked();
  72  |   }
  73  | 
  74  |   // Botões
  75  |   saveButton(): Locator {
  76  |     return this.page.locator('[data-test-id="content-models-identification-submit-button"]');
  77  |   }
  78  | 
  79  |   backButton(): Locator {
  80  |     return this.page.locator('#content-models-form-back-button');
  81  |   }
  82  | 
  83  |   // Salvar via JS click (botão fica no canto inferior direito, coberto pelo chat widget HubSpot).
  84  |   async save(): Promise<void> {
  85  |     const btn = this.saveButton();
  86  |     await btn.scrollIntoViewIfNeeded();
  87  |     await btn.evaluate((el: HTMLButtonElement) => el.click());
  88  |   }
  89  | 
  90  |   // Preenchimento Kit de marca via keyboard (dropdown react-select)
  91  |   async selectKitDeMarca(option?: string): Promise<void> {
  92  |     const input = this.kitDeMarcaInput();
  93  |     await input.focus();
  94  |     if (option) {
  95  |       await input.fill(option);
  96  |       await this.page.waitForTimeout(300);
  97  |     }
  98  |     await this.page.keyboard.press('ArrowDown');
  99  |     await this.page.waitForTimeout(200);
  100 |     await this.page.keyboard.press('Enter');
  101 |     await this.page.waitForTimeout(300);
  102 |   }
  103 | 
  104 |   // Fluxo completo de criação (TC1 happy path)
  105 |   async fillIdentificationAndSave(opts: {
  106 |     nome: string;
  107 |     descricao?: string;
  108 |     kitDeMarca?: string;
  109 |   }): Promise<void> {
  110 |     await this.nameInput().fill(opts.nome);
  111 |     if (opts.descricao) {
  112 |       await this.descriptionTextarea().fill(opts.descricao);
  113 |     }
  114 |     await this.selectKitDeMarca(opts.kitDeMarca);
  115 |     await this.save();
  116 |   }
  117 | 
  118 |   // Badge "Dica" (só renderiza na criação — RN 9)
  119 |   dicaBadge(): Locator {
  120 |     return this.page.locator('[data-test-id="content-models-duplicate-tip-alert"]');
  121 |   }
  122 | 
  123 |   // Toast Chakra (sucesso/erro)
  124 |   toastSuccess(): Locator {
  125 |     return this.page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).first();
  126 |   }
  127 | 
  128 |   // ─── Aba Estilo ───
  129 |   async gotoEditStyleTab(id: number | string): Promise<void> {
  130 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models/${id}/edit?tab=style`);
  131 |     await expect(this.tab('Estilo')).toHaveAttribute('aria-selected', 'true', { timeout: 15_000 });
```