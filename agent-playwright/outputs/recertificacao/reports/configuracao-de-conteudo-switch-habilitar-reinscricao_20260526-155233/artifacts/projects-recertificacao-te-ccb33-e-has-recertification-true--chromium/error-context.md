# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc3-ativar-e-salvar-persiste.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC3 — Ativar e salvar o switch persiste `has_recertification = true`
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc3-ativar-e-salvar-persiste.spec.ts:46:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: /^Nome \*/ }) to be visible

```

# Test source

```ts
  186 |       name: /Habilitar reinscrição/i,
  187 |     });
  188 |     const label = this.page
  189 |       .locator('label.chakra-switch')
  190 |       .filter({ has: checkbox })
  191 |       .first();
  192 |     // Tolerância: se a flag :recertificacao está OFF, o switch não
  193 |     // renderiza — beforeAll que pede `hasRecertification` em env com
  194 |     // flag OFF não deveria estar rodando. Mas no caminho normal (flag
  195 |     // ON), aguardamos visibilidade curta antes de toggle.
  196 |     const visible = await label.waitFor({ state: 'visible', timeout: 5_000 })
  197 |       .then(() => true)
  198 |       .catch(() => false);
  199 |     if (!visible) {
  200 |       throw new Error(
  201 |         '[SeedAdminPage.setHabilitarReinscricao] Switch "Habilitar reinscrição" ' +
  202 |           'não está visível no form. Verifique se a feature flag :recertificacao ' +
  203 |           'está ATIVA na org. Skill: testar-feature-flag-twygo.',
  204 |       );
  205 |     }
  206 |     const isOn = (await label.getAttribute('data-checked')) !== null;
  207 |     if (isOn !== enabled) {
  208 |       await label.scrollIntoViewIfNeeded();
  209 |       await label.click({ force: true });
  210 |     }
  211 |   }
  212 | 
  213 |   /**
  214 |    * Submete o form e aguarda redirect canônico `/e/{id}/edit` ou
  215 |    * `/contents/{id}/edit`. Cobre o caso de o produto exibir modal
  216 |    * intermediário (NPS) re-rodando dismiss antes do click.
  217 |    */
  218 |   private async submitAndWaitForEditUrl(): Promise<void> {
  219 |     // Defesa em profundidade contra NPS que pode renderizar entre o
  220 |     // fill do form e o click do Salvar (padrão consolidado em
  221 |     // `PaineisListPage.submitNewPanelForm` — gera modal NPS por
  222 |     // inactivity).
  223 |     await dismissCommonModals(this.page);
  224 |     await this.getSaveButton().click();
  225 |     await this.page.waitForURL(/\/(e|contents)\/\d+\/edit/, { timeout: 30_000 });
  226 |   }
  227 | 
  228 |   // ============================================================
  229 |   // Cursos (Event::KIND_COURSE)
  230 |   // ============================================================
  231 | 
  232 |   /**
  233 |    * Cria um curso (`Event::KIND_COURSE` / `kind=0`) via UI admin.
  234 |    *
  235 |    * **Rota canônica facelift React** (skill `provisionar-seed` v1.3,
  236 |    * validada live 2026-05-26): `/o/{orgId}/contents/new?kind=0`.
  237 |    * Pós-save redireciona para `/contents/{id}/edit`.
  238 |    *
  239 |    * **NÃO** usar `/o/{orgId}/events/new` (rota HAML legada) — retorna
  240 |    * HTTP 422 silencioso ("The change you wanted was rejected"). A rota
  241 |    * HAML ainda renderiza o form, mas o POST `/e` está desativado pra
  242 |    * admins no facelift novo.
  243 |    *
  244 |    * Form facelift exige (validado live):
  245 |    *  - Nome * (textbox com asterisco no accessible name)
  246 |    *  - Tipo de experiência * (combobox autocomplete — env precisa ter
  247 |    *    ≥1 cadastrado; em `staging-recertificacao` existe "Suite Everton CSV")
  248 |    *  - Descrição * (rich-text dentro de `<iframe title="Editor de Rich Text">`)
  249 |    *  - Situação * (default "Em desenvolvimento" — não mexer)
  250 |    *  - Quem pode ver * (default "Usuários" — não mexer)
  251 |    *
  252 |    * @param data.name             obrigatório, worker-isolated recomendado
  253 |    * @param data.tipoExperiencia  opcional; se omitido, escolhe a primeira
  254 |    *                              opção da listbox do combobox
  255 |    * @param data.description      opcional; default = texto auto-gerado
  256 |    * @param data.hasRecertification **DEPRECATED/NO-OP** — switch "Habilitar
  257 |    *                              reinscrição" no facelift NÃO está na tab
  258 |    *                              "Identificação" do form de CRIAÇÃO; vive
  259 |    *                              em tab posterior do form de EDIÇÃO
  260 |    *                              (provavelmente "Aprovação", a confirmar
  261 |    *                              via recon live). Caller que precise `true`
  262 |    *                              deve chamar `ContentEditPage.setHabilitarReinscricao(true)`
  263 |    *                              + `save()` após `createCurso` retornar.
  264 |    * @returns eventId real capturado de `page.url()` após save
  265 |    */
  266 |   async createCurso(data: {
  267 |     name: string;
  268 |     hasRecertification?: boolean;
  269 |     description?: string;
  270 |     tipoExperiencia?: string;
  271 |   }): Promise<number> {
  272 |     if (data.hasRecertification === true) {
  273 |       // eslint-disable-next-line no-console -- aviso útil em seed
  274 |       console.warn(
  275 |         '[SeedAdminPage.createCurso] hasRecertification=true é NO-OP no v1.3 ' +
  276 |           '(switch vive em tab posterior do edit, não no form de criação). ' +
  277 |           'Ative manualmente: contentEditPage.setHabilitarReinscricao(true) + save() após o create.',
  278 |       );
  279 |     }
  280 | 
  281 |     await this.ensureAdminProfile();
  282 |     await safeGoto(this.page, `/o/${getOrgId()}/contents/new?kind=0`);
  283 | 
  284 |     // 1. Nome (obrigatório)
  285 |     const nameInput = this.page.getByRole('textbox', { name: /^Nome \*/ });
> 286 |     await nameInput.waitFor({ state: 'visible', timeout: 15_000 });
      |                     ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  287 |     await nameInput.fill(data.name);
  288 | 
  289 |     // 2. Tipo de experiência (obrigatório, combobox autocomplete).
  290 |     // O label do form facelift NÃO tem `htmlFor` vinculando ao input
  291 |     // — `getByLabel` falha. O texto "Digite ou selecione..." é
  292 |     // aria-describedby (não placeholder). Estratégia robusta: seletor
  293 |     // por atributos do DOM. "Tipo de experiência" é o 1º combobox
  294 |     // autocomplete no form Identificação (vem antes de Classificação
  295 |     // e Categorias, que também são autocomplete).
  296 |     // REVISAR: aguardando data-test-id estável `event-form-type-combobox`.
  297 |     const tipoCombobox = this.page
  298 |       .locator('input[role="combobox"][aria-autocomplete="list"]')
  299 |       .first();
  300 |     await tipoCombobox.waitFor({ state: 'visible', timeout: 10_000 });
  301 |     await tipoCombobox.click();
  302 |     const tipoOpcao = data.tipoExperiencia
  303 |       ? this.page.getByRole('option', { name: data.tipoExperiencia, exact: true })
  304 |       : this.page.getByRole('listbox').getByRole('option').first();
  305 |     await tipoOpcao.waitFor({ state: 'visible', timeout: 5_000 });
  306 |     await tipoOpcao.click();
  307 | 
  308 |     // 3. Descrição (obrigatório, rich-text dentro de iframe).
  309 |     // `fill` no body do iframe muta o DOM mas NÃO dispara onChange do
  310 |     // componente React — backend valida e devolve "Descrição é
  311 |     // obrigatório". Precisa simular digitação real: click pra focar,
  312 |     // pressSequentially pra disparar input events, blur (Tab) pra
  313 |     // disparar onBlur/validação.
  314 |     const descricaoText =
  315 |       data.description ?? `Seed automatizado — ${data.name} (createCurso v1.3).`;
  316 |     const descricaoFrame = this.page.frameLocator(
  317 |       'iframe[title^="Editor de Rich Text"]',
  318 |     );
  319 |     const descricaoBody = descricaoFrame.locator('body');
  320 |     await descricaoBody.click();
  321 |     await descricaoBody.pressSequentially(descricaoText, { delay: 10 });
  322 |     // Blur disparando onChange do wrapper React (sem isso, validação inline
  323 |     // "Descrição é obrigatório" persiste).
  324 |     await this.page.keyboard.press('Tab');
  325 | 
  326 |     // 4. Situação e Quem pode ver: defaults OK ("Em desenvolvimento" / "Usuários").
  327 | 
  328 |     // 5. Salvar
  329 |     await dismissCommonModals(this.page);
  330 |     await this.getSaveButton().click();
  331 |     await this.page.waitForURL(/\/o\/\d+\/contents\/\d+\/edit/, {
  332 |       timeout: 30_000,
  333 |     });
  334 | 
  335 |     return this.extractEventIdFromUrl();
  336 |   }
  337 | 
  338 |   /**
  339 |    * Deleta curso por ID. Variant idempotente: aceita ID inexistente
  340 |    * (404 / botão ausente) sem throw — afterAll robusto.
  341 |    *
  342 |    * Padrão de exclusão Twygo (válido para `Event` em HAML e React):
  343 |    * abre a edição → botão "Excluir" → modal de confirmação → "Confirmar".
  344 |    * Pós-confirmação redireciona para listagem `/o/{orgId}/events`.
  345 |    *
  346 |    * REVISAR-RECON-LIVE: o botão "Excluir" pode estar em dropdown de
  347 |    * "Ações" (kebab) em alguns layouts — fallback tenta os 2 padrões.
  348 |    */
  349 |   async deleteCursoByIdSafe(id: number): Promise<void> {
  350 |     try {
  351 |       await this.ensureAdminProfile();
  352 |       await safeGoto(this.page, `/o/${getOrgId()}/events/${id}/edit`);
  353 |     } catch {
  354 |       // safeGoto/ensureAdminProfile pode falhar com 404 — curso já não existe ou
  355 |       // sessão expirou. Cleanup idempotente: warn no-op.
  356 |       return;
  357 |     }
  358 |     try {
  359 |       // Caminho 1: botão "Excluir" direto na página de edição.
  360 |       const directDelete = this.page
  361 |         .getByRole('button', { name: /^Excluir$/i })
  362 |         .or(this.page.getByRole('link', { name: /^Excluir$/i }))
  363 |         .first();
  364 |       const directVisible = await directDelete
  365 |         .isVisible({ timeout: 3_000 })
  366 |         .catch(() => false);
  367 | 
  368 |       if (directVisible) {
  369 |         await directDelete.click();
  370 |       } else {
  371 |         // Caminho 2: dropdown "Ações"/"Opções" → "Excluir".
  372 |         // REVISAR: aguardando data-test-id `event-edit-actions-trigger`.
  373 |         const actionsTrigger = this.page
  374 |           .getByRole('button', { name: /(Ações|Opções|Mais opções)/i })
  375 |           .first();
  376 |         const triggerVisible = await actionsTrigger
  377 |           .isVisible({ timeout: 3_000 })
  378 |           .catch(() => false);
  379 |         if (!triggerVisible) {
  380 |           // eslint-disable-next-line no-console -- diagnóstico em afterAll
  381 |           console.warn(
  382 |             `[deleteCursoByIdSafe] Botão "Excluir" não encontrado para curso id=${id}. ` +
  383 |               `Possível mudança de UI ou curso já deletado — cleanup no-op.`,
  384 |           );
  385 |           return;
  386 |         }
```