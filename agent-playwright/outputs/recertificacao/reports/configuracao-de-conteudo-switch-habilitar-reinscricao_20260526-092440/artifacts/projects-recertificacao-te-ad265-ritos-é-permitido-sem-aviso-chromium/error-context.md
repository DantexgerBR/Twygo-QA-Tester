# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts:49:3

# Error details

```
Error: [SeedAdminPage.setHabilitarReinscricao] Switch "Habilitar reinscrição" não está visível no form. Verifique se a feature flag :recertificacao está ATIVA na org. Skill: testar-feature-flag-twygo.
```

# Test source

```ts
  115 |     // `about:blank` (newContext recém-aberto), navegar para landing primeiro.
  116 |     if (
  117 |       this.page.url() === 'about:blank' ||
  118 |       this.page.url() === 'chrome://newtab/'
  119 |     ) {
  120 |       await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
  121 |     }
  122 |     // Diagnóstico live 2026-05-26: `switchToViaUrl('Administrador')`
  123 |     // (page.goto direto pra `/o/{orgId}/events?tab=events&profile=admin`) NÃO
  124 |     // muda o perfil de sessão — apenas navega. Backend continua com perfil
  125 |     // Aluno e rejeita POSTs CRUD ("The change you wanted was rejected").
  126 |     // O switch real exige click no link do popover (handler JS dispara
  127 |     // troca de session/cookies). Por isso usamos `switchTo` aqui (popover
  128 |     // path), não `switchToViaUrl`. Skill: trocar-perfil-twygo.
  129 |     await this.profileSwitcher.switchTo('Administrador');
  130 |     this.adminContextReady = true;
  131 |   }
  132 | 
  133 |   /**
  134 |    * Extrai o eventId da URL após o save (regex cobre HAML `/e/{id}/edit`
  135 |    * e React `/contents/{id}/edit`). Lança erro detalhado se a URL não
  136 |    * casar — facilita diagnóstico quando o produto troca a rota.
  137 |    */
  138 |   private extractEventIdFromUrl(): number {
  139 |     const url = this.page.url();
  140 |     const m = url.match(/\/(?:e|contents)\/(\d+)\/edit/);
  141 |     if (!m) {
  142 |       throw new Error(
  143 |         `[SeedAdminPage] Falha ao extrair eventId da URL após save. ` +
  144 |           `URL atual: "${url}". Esperado padrão "/e/{id}/edit" ou ` +
  145 |           `"/contents/{id}/edit". Validar live se a rota mudou.`,
  146 |       );
  147 |     }
  148 |     return Number(m[1]);
  149 |   }
  150 | 
  151 |   /**
  152 |    * Localizador do input de "Nome" no form de evento (curso/trilha) e
  153 |    * no form de pacote. REVISAR-RECON-LIVE: rota `/events/new` usa HAML
  154 |    * com `<input id="event_name">` (padrão Rails) ou React `getByLabel('Nome')`.
  155 |    * Tentamos os 2 com fallback documentado.
  156 |    */
  157 |   private getNameInput(): Locator {
  158 |     // REVISAR: aguardando data-test-id estável `event-form-name-input`.
  159 |     // Fallback 1: id legado HAML do Rails (`event_name`/`learning_path_name`).
  160 |     // Fallback 2: label semântico (React/Chakra). `.or()` resolve o
  161 |     // primeiro que estiver visível.
  162 |     return this.page
  163 |       .locator('#event_name, #learning_path_name, [data-test-id="event-form-name-input"]')
  164 |       .or(this.page.getByLabel(/^Nome$/i))
  165 |       .first();
  166 |   }
  167 | 
  168 |   /**
  169 |    * Localizador do textarea/input de "Descrição" no form de evento.
  170 |    * REVISAR-RECON-LIVE: descrição em HAML legado costuma ser `<textarea
  171 |    * id="event_description">`. Em React pode ser rich-text Plate (skill
  172 |    * `testar-plate-editor-twygo`) — neste caso `fill` direto não funciona.
  173 |    * Por ora, só usa o campo plain; se for Plate, caller pode pular.
  174 |    */
  175 |   private getDescriptionInput(): Locator {
  176 |     // REVISAR: aguardando data-test-id estável.
  177 |     return this.page
  178 |       .locator('#event_description, #learning_path_description')
  179 |       .or(this.page.getByLabel(/^Descrição$/i))
  180 |       .first();
  181 |   }
  182 | 
  183 |   /**
  184 |    * Botão "Salvar" do form. Cobre input[type="submit"] (HAML) e
  185 |    * button (React) via role.
  186 |    */
  187 |   private getSaveButton(): Locator {
  188 |     return this.page.getByRole('button', { name: /^Salvar$/ }).first();
  189 |   }
  190 | 
  191 |   /**
  192 |    * Switch "Habilitar reinscrição" — label.chakra-switch (skill
  193 |    * `interagir-switch-chakra-twygo`). Idempotente: só clica se o estado
  194 |    * atual difere do desejado. Tolerante se o switch não estiver visível
  195 |    * (flag `:recertificacao` OFF na org → não renderiza).
  196 |    */
  197 |   private async setHabilitarReinscricao(enabled: boolean): Promise<void> {
  198 |     // REVISAR: aguardando data-test-id `event-has-recertification-switch`.
  199 |     // Hoje usa fallback semântico via role+name (igual ContentEditPage).
  200 |     const checkbox = this.page.getByRole('checkbox', {
  201 |       name: /Habilitar reinscrição/i,
  202 |     });
  203 |     const label = this.page
  204 |       .locator('label.chakra-switch')
  205 |       .filter({ has: checkbox })
  206 |       .first();
  207 |     // Tolerância: se a flag :recertificacao está OFF, o switch não
  208 |     // renderiza — beforeAll que pede `hasRecertification` em env com
  209 |     // flag OFF não deveria estar rodando. Mas no caminho normal (flag
  210 |     // ON), aguardamos visibilidade curta antes de toggle.
  211 |     const visible = await label.waitFor({ state: 'visible', timeout: 5_000 })
  212 |       .then(() => true)
  213 |       .catch(() => false);
  214 |     if (!visible) {
> 215 |       throw new Error(
      |             ^ Error: [SeedAdminPage.setHabilitarReinscricao] Switch "Habilitar reinscrição" não está visível no form. Verifique se a feature flag :recertificacao está ATIVA na org. Skill: testar-feature-flag-twygo.
  216 |         '[SeedAdminPage.setHabilitarReinscricao] Switch "Habilitar reinscrição" ' +
  217 |           'não está visível no form. Verifique se a feature flag :recertificacao ' +
  218 |           'está ATIVA na org. Skill: testar-feature-flag-twygo.',
  219 |       );
  220 |     }
  221 |     const isOn = (await label.getAttribute('data-checked')) !== null;
  222 |     if (isOn !== enabled) {
  223 |       await label.scrollIntoViewIfNeeded();
  224 |       await label.click({ force: true });
  225 |     }
  226 |   }
  227 | 
  228 |   /**
  229 |    * Submete o form e aguarda redirect canônico `/e/{id}/edit` ou
  230 |    * `/contents/{id}/edit`. Cobre o caso de o produto exibir modal
  231 |    * intermediário (NPS) re-rodando dismiss antes do click.
  232 |    */
  233 |   private async submitAndWaitForEditUrl(): Promise<void> {
  234 |     // Defesa em profundidade contra NPS que pode renderizar entre o
  235 |     // fill do form e o click do Salvar (padrão consolidado em
  236 |     // `PaineisListPage.submitNewPanelForm` — gera modal NPS por
  237 |     // inactivity).
  238 |     await dismissCommonModals(this.page);
  239 |     await this.getSaveButton().click();
  240 |     await this.page.waitForURL(/\/(e|contents)\/\d+\/edit/, { timeout: 30_000 });
  241 |   }
  242 | 
  243 |   // ============================================================
  244 |   // Cursos (Event::KIND_COURSE)
  245 |   // ============================================================
  246 | 
  247 |   /**
  248 |    * Cria um curso (`Event::KIND_COURSE`) via UI admin.
  249 |    *
  250 |    * Rota: `/o/{orgId}/events/new` — form Rails/HAML legado (default no
  251 |    * Twygo até 2026-05). Pós-save redireciona para `/e/{id}/edit`.
  252 |    *
  253 |    * @param data.name             obrigatório, worker-isolated recomendado
  254 |    * @param data.hasRecertification se `true`, liga o switch antes de salvar
  255 |    * @param data.description      opcional, ignora se form usa rich-text Plate
  256 |    * @returns eventId real capturado de `page.url()` após save
  257 |    */
  258 |   async createCurso(data: {
  259 |     name: string;
  260 |     hasRecertification?: boolean;
  261 |     description?: string;
  262 |   }): Promise<number> {
  263 |     await this.ensureAdminProfile();
  264 |     await safeGoto(this.page, `/o/${getOrgId()}/events/new`);
  265 |     await this.getNameInput().waitFor({ state: 'visible', timeout: 15_000 });
  266 |     await this.getNameInput().fill(data.name);
  267 |     if (data.description) {
  268 |       // REVISAR-RECON-LIVE: se o produto migrou a descrição para rich-text
  269 |       // Plate, `fill` falha — caller que precise descrição rica deve
  270 |       // estender este Page Object com helper Plate-aware (skill
  271 |       // `testar-plate-editor-twygo`). Hoje assume textarea/input plain.
  272 |       const desc = this.getDescriptionInput();
  273 |       if (await desc.isVisible().catch(() => false)) {
  274 |         await desc.fill(data.description);
  275 |       }
  276 |     }
  277 |     if (data.hasRecertification === true) {
  278 |       await this.setHabilitarReinscricao(true);
  279 |     }
  280 |     await this.submitAndWaitForEditUrl();
  281 |     return this.extractEventIdFromUrl();
  282 |   }
  283 | 
  284 |   /**
  285 |    * Deleta curso por ID. Variant idempotente: aceita ID inexistente
  286 |    * (404 / botão ausente) sem throw — afterAll robusto.
  287 |    *
  288 |    * Padrão de exclusão Twygo (válido para `Event` em HAML e React):
  289 |    * abre a edição → botão "Excluir" → modal de confirmação → "Confirmar".
  290 |    * Pós-confirmação redireciona para listagem `/o/{orgId}/events`.
  291 |    *
  292 |    * REVISAR-RECON-LIVE: o botão "Excluir" pode estar em dropdown de
  293 |    * "Ações" (kebab) em alguns layouts — fallback tenta os 2 padrões.
  294 |    */
  295 |   async deleteCursoByIdSafe(id: number): Promise<void> {
  296 |     try {
  297 |       await this.ensureAdminProfile();
  298 |       await safeGoto(this.page, `/o/${getOrgId()}/events/${id}/edit`);
  299 |     } catch {
  300 |       // safeGoto/ensureAdminProfile pode falhar com 404 — curso já não existe ou
  301 |       // sessão expirou. Cleanup idempotente: warn no-op.
  302 |       return;
  303 |     }
  304 |     try {
  305 |       // Caminho 1: botão "Excluir" direto na página de edição.
  306 |       const directDelete = this.page
  307 |         .getByRole('button', { name: /^Excluir$/i })
  308 |         .or(this.page.getByRole('link', { name: /^Excluir$/i }))
  309 |         .first();
  310 |       const directVisible = await directDelete
  311 |         .isVisible({ timeout: 3_000 })
  312 |         .catch(() => false);
  313 | 
  314 |       if (directVisible) {
  315 |         await directDelete.click();
```