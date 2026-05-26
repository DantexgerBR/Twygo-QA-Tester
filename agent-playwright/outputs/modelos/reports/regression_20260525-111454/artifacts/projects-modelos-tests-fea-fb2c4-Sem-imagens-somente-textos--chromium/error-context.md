# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\criacao-de-modelo-aba-imagem\tc03-default-sem-imagens.spec.ts >> Criação de Modelo - Aba Imagem >> Default "Sem imagens, somente textos"
- Location: projects\modelos\tests\features\criacao-de-modelo-aba-imagem\tc03-default-sem-imagens.spec.ts:6:3

# Error details

```
TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-page"] [id*="-edit-element-"]').first()

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
  185 |     await this.page.locator('#play-interest-search').fill(seedNameSubstring);
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
> 265 |     await editIcon.evaluate((el: HTMLElement) => el.click());
      |                    ^ TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
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
  286 |     'Sem imagens, somente textos',
  287 |     'Banco de imagens aberto',
  288 |     'Gerador autoral por IA com DALL-E (OpenAI)',
  289 |     'Gerador autoral por IA com Imagen 4 (Google)',
  290 |   ] as const;
  291 | 
  292 |   // ─── Aba Áudio ───
  293 |   async gotoFirstModelEditAudio(): Promise<void> {
  294 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  295 |     await this.page.waitForTimeout(1500);
  296 |     const editIcon = this.page
  297 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  298 |       .first();
  299 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  300 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  301 |     await this.tab('Áudio').click();
  302 |     await expect(this.tab('Áudio')).toHaveAttribute('aria-selected', 'true', { timeout: 10_000 });
  303 |   }
  304 | 
  305 |   audioTitle(): Locator {
  306 |     return this.page.locator('[data-test-id="content-models-audio-title"]');
  307 |   }
  308 | 
  309 |   audioDescription(): Locator {
  310 |     return this.page.locator('[data-test-id="content-models-audio-description"]');
  311 |   }
  312 | 
  313 |   audioVoiceCard(voice: 'ana' | 'cris' | 'carlos' | 'morgan'): Locator {
  314 |     return this.page.locator(`[data-test-id="modelos-de-conteudo-audio-voice-${voice}"]`);
  315 |   }
  316 | 
  317 |   audioPlayButton(voice: 'ana' | 'cris' | 'carlos' | 'morgan'): Locator {
  318 |     return this.page.locator(`[data-test-id="modelos-de-conteudo-audio-play-${voice}"]`);
  319 |   }
  320 | 
  321 |   audioRadioByValue(value: 'Ana' | 'Cris' | 'Carlos' | 'Morgan'): Locator {
  322 |     return this.page.locator(`input[type="radio"][value="${value}"]`);
  323 |   }
  324 | 
  325 |   audioVoices = ['Ana', 'Cris', 'Carlos', 'Morgan'] as const;
  326 | 
  327 |   // Cleanup helper: deletar modelo pelo nome via UI listagem.
  328 |   // Idempotente — usa try/catch + se modal de confirmação aparecer, confirma.
  329 |   async deleteByNameSafe(nome: string): Promise<void> {
  330 |     try {
  331 |       await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  332 |       await this.page.waitForTimeout(1500);
  333 |       await this.page.locator('#play-interest-search').fill(nome);
  334 |       await this.page.waitForTimeout(800);
  335 |       // Card delete icon — content_models-{id}-destroy-element-*-button-3
  336 |       const deleteIcon = this.page
  337 |         .locator('[data-test-id="content-models-page"] [id*="-destroy-element-"]')
  338 |         .first();
  339 |       if (!(await deleteIcon.isVisible().catch(() => false))) return;
  340 |       await deleteIcon.evaluate((el: HTMLElement) => el.click());
  341 |       await this.page.waitForTimeout(500);
  342 |       // Modal de confirmação Chakra — botão "Excluir" ou "Confirmar"
  343 |       for (const label of ['Excluir', 'Confirmar', 'Sim']) {
  344 |         const btn = this.page.getByRole('button', { name: label, exact: true }).first();
  345 |         if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
  346 |           await btn.evaluate((el: HTMLElement) => el.click());
  347 |           await this.page.waitForTimeout(1000);
  348 |           break;
  349 |         }
  350 |       }
  351 |     } catch {
  352 |       // best-effort — cleanup não bloqueia próximo TC
  353 |     }
  354 |   }
  355 | 
  356 |   /**
  357 |    * Deleta TODOS os modelos cujo nome começa com `prefix`. Útil pra cleanup
  358 |    * massivo após matrices que criam N modelos por execução (TC4 Identificação).
  359 |    * Itera até a busca pelo prefix não retornar mais cards.
  360 |    */
  361 |   async deleteAllByNamePrefix(prefix: string, maxIterations = 20): Promise<number> {
  362 |     let deleted = 0;
  363 |     for (let i = 0; i < maxIterations; i++) {
  364 |       try {
  365 |         await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
```