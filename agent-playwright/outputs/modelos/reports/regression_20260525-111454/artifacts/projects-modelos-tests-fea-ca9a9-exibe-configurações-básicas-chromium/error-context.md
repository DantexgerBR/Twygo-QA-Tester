# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc06-switch-incluir-questionarios.spec.ts >> Criação de Modelo - Aba Estrutura do Conteúdo >> Switch "Incluir questionários" exibe configurações básicas
- Location: projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc06-switch-incluir-questionarios.spec.ts:6:3

# Error details

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

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
  132 |   }
  133 | 
  134 |   // Abre edição do 1º modelo da listagem e troca pra aba style.
  135 |   // Mais robusto que hardcodar ID (que muda entre envs).
  136 |   async gotoFirstModelEditStyle(): Promise<void> {
  137 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  138 |     await this.page.waitForTimeout(1500);
  139 |     const editIcon = this.page
  140 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  141 |       .first();
  142 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  143 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  144 |     // Click tab style
  145 |     await this.tab('Estilo').click();
  146 |     await expect(this.tab('Estilo')).toHaveAttribute('aria-selected', 'true', { timeout: 10_000 });
  147 |   }
  148 | 
  149 |   styleAddMoreDataButton(): Locator {
  150 |     return this.page.locator('[data-test-id="content-models-style-add-more-data-button"]');
  151 |   }
  152 | 
  153 |   styleAddOptionByTestId = {
  154 |     'Idade': 'content-models-style-add-style-age-range',
  155 |     'Dificuldade': 'content-models-style-add-style-difficulty',
  156 |     'Tom de voz': 'content-models-style-add-style-voice-tone',
  157 |     'Perfil do público': 'content-models-style-add-style-audience-profile',
  158 |     'Idioma': 'content-models-style-add-style-language',
  159 |     'Informações adicionais': 'content-models-style-add-style-additional-info',
  160 |   } as const;
  161 | 
  162 |   async openStyleAddMenu(): Promise<void> {
  163 |     // Botão fica próximo ao centro/topo da aba — não precisa de força
  164 |     await this.styleAddMoreDataButton().click();
  165 |     // Espera ao menos 1 menuitem aparecer
  166 |     await expect(
  167 |       this.page.locator('[data-test-id="content-models-style-add-style-age-range"]'),
  168 |     ).toBeVisible({ timeout: 5_000 });
  169 |   }
  170 | 
  171 |   async clickStyleAddOption(option: keyof typeof this.styleAddOptionByTestId): Promise<void> {
  172 |     const tid = this.styleAddOptionByTestId[option];
  173 |     await this.page.locator(`[data-test-id="${tid}"]`).click();
  174 |   }
  175 | 
  176 |   // ─── Aba Estrutura ───
  177 |   // Antes clicava no "1º card visual" — frágil porque órfãos de testes manuais
  178 |   // (em estado quebrado, sem tabs) ficam no topo da listagem. Agora busca um
  179 |   // seed nominal ("Modelo Seed Ativo" por padrão) e clica no edit dele. Robusto
  180 |   // contra ordenação e contra órfãos. Aceita substring match (seed renomeado
  181 |   // com sufixo timestamp ainda casa).
  182 |   async gotoFirstModelEditStructure(seedNameSubstring = 'Modelo Seed Ativo'): Promise<void> {
  183 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  184 |     await this.page.waitForTimeout(1500);
> 185 |     await this.page.locator('#play-interest-search').fill(seedNameSubstring);
      |                                                      ^ TimeoutError: locator.fill: Timeout 30000ms exceeded.
  186 |     await this.page.waitForTimeout(1200);
  187 |     const editIcon = this.page
  188 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  189 |       .first();
  190 |     await expect(
  191 |       editIcon,
  192 |       `seed "${seedNameSubstring}" não encontrado na listagem — verifique env`,
  193 |     ).toBeVisible({ timeout: 10_000 });
  194 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  195 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  196 |     await this.tab('Estrutura').click();
  197 |     await expect(this.tab('Estrutura')).toHaveAttribute('aria-selected', 'true', { timeout: 10_000 });
  198 |   }
  199 | 
  200 |   // Tipo de estrutura: <select id="structure_type"> nativo.
  201 |   // (htmlFor do label aponta pra "content-models-structure-type-select" que não
  202 |   // existe no DOM — divergência AT vs UI; o select real usa id snake_case.)
  203 |   tipoEstruturaSelect(): Locator {
  204 |     return this.page.locator('#structure_type');
  205 |   }
  206 | 
  207 |   async selectTipoEstrutura(label: 'Atividades sequenciais (1 nível)' | 'Atividades agrupadas por módulos (2 níveis)'): Promise<void> {
  208 |     await this.tipoEstruturaSelect().selectOption({ label });
  209 |     await this.page.waitForTimeout(500);
  210 |   }
  211 | 
  212 |   async tipoEstruturaOptions(): Promise<string[]> {
  213 |     return this.tipoEstruturaSelect().locator('option').allTextContents();
  214 |   }
  215 | 
  216 |   // Carga horária: <select id="structure_workload"> nativo. UI mostra labels CURTOS
  217 |   // ("Micro", "Curto", etc) — AT documentou completos ("Micro (30s a 5min)") por
  218 |   // engano. AT canônico será atualizado pra refletir UI real.
  219 |   cargaHorariaSelect(): Locator {
  220 |     return this.page.locator('#structure_workload');
  221 |   }
  222 | 
  223 |   async cargaHorariaOptionsLabels(): Promise<string[]> {
  224 |     return this.cargaHorariaSelect().locator('option').allTextContents();
  225 |   }
  226 | 
  227 |   cargaHorariaOptions = ['Micro', 'Curto', 'Médio', 'Estendido', 'Longo'] as const;
  228 | 
  229 |   // Switches da aba Estrutura
  230 |   incluirQuestionariosSwitch(): Locator {
  231 |     return this.page.locator('label[for="structure_include_quiz"]');
  232 |   }
  233 |   incluirQuestionariosChecked(): Promise<boolean> {
  234 |     return this.page.locator('#structure_include_quiz').isChecked();
  235 |   }
  236 | 
  237 |   incluirProvaFinalSwitch(): Locator {
  238 |     return this.page.locator('label[for="structure_include_final_exam"]');
  239 |   }
  240 |   incluirProvaFinalChecked(): Promise<boolean> {
  241 |     return this.page.locator('#structure_include_final_exam').isChecked();
  242 |   }
  243 | 
  244 |   atividadesPorModuloInput(): Locator {
  245 |     return this.page.locator('#structure_activities_count');
  246 |   }
  247 | 
  248 |   structureSaveButton(): Locator {
  249 |     return this.page.locator('[data-test-id="content-models-structure-submit-button"]');
  250 |   }
  251 | 
  252 |   async structureSave(): Promise<void> {
  253 |     const btn = this.structureSaveButton();
  254 |     await btn.scrollIntoViewIfNeeded();
  255 |     await btn.evaluate((el: HTMLButtonElement) => el.click());
  256 |   }
  257 | 
  258 |   // ─── Aba Imagem ───
  259 |   async gotoFirstModelEditImage(): Promise<void> {
  260 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  261 |     await this.page.waitForTimeout(1500);
  262 |     const editIcon = this.page
  263 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  264 |       .first();
  265 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  266 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  267 |     await this.tab('Imagem').click();
  268 |     await expect(this.tab('Imagem')).toHaveAttribute('aria-selected', 'true', { timeout: 10_000 });
  269 |   }
  270 | 
  271 |   imageTitle(): Locator {
  272 |     return this.page.locator('[data-test-id="content-models-image-title"]');
  273 |   }
  274 | 
  275 |   imageDescription(): Locator {
  276 |     return this.page.locator('[data-test-id="content-models-image-description"]');
  277 |   }
  278 | 
  279 |   imageOptionRadio(idx: 0 | 1 | 2 | 3): Locator {
  280 |     return this.page.locator(`#image-option-radio-${idx}`);
  281 |   }
  282 | 
  283 |   // UI mostra labels com prefixo "Gerador autoral por IA com..." pros TC3 e TC4.
  284 |   // AT documentava nomes curtos; AT canônico será atualizado.
  285 |   imageOptionLabels = [
```