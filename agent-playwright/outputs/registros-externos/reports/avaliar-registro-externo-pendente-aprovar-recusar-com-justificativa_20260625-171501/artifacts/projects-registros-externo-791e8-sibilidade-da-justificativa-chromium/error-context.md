# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc6-fluxo-completo-recusa-e-historico.spec.ts >> Avaliar registro externo pendente (Aprovar/Recusar com justificativa) >> Validar fluxo completo de recusa e visibilidade da justificativa
- Location: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc6-fluxo-completo-recusa-e-historico.spec.ts:24:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.chakra-modal__content, [role="dialog"]').filter({ hasText: /Histórico/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.chakra-modal__content, [role="dialog"]').filter({ hasText: /Histórico/i }).first()

```

# Test source

```ts
  86  | 
  87  |   cancelarButton(): Locator {
  88  |     return this.page.getByTestId('record-form-cancel-button');
  89  |   }
  90  | 
  91  |   /** Grupo de form-control de um campo pelo label (react-select Twygo). */
  92  |   private comboGroup(label: string): Locator {
  93  |     return this.page
  94  |       .locator('.chakra-form-control')
  95  |       .filter({ has: this.page.locator('label').filter({ hasText: new RegExp('^' + label) }) })
  96  |       .first();
  97  |   }
  98  | 
  99  |   /** Preenche um react-select (Tipo de experiência / Categorias) commitando via Enter. */
  100 |   async fillCombo(label: string, typeText: string): Promise<void> {
  101 |     const group = this.comboGroup(label);
  102 |     await group.locator('.creatable-select-field__control, [class*="select-field__control"]').first().click();
  103 |     await this.page.keyboard.type(typeText, { delay: 20 });
  104 |     await this.page
  105 |       .locator('.creatable-select-field__option, [role="option"]')
  106 |       .first()
  107 |       .waitFor({ timeout: 6_000 })
  108 |       .catch(() => undefined);
  109 |     await this.page.keyboard.press('Enter');
  110 |   }
  111 | 
  112 |   selectTipo(value: string): Promise<void> {
  113 |     return this.fillCombo('Tipo de experiência', value);
  114 |   }
  115 | 
  116 |   addCategoria(value: string): Promise<void> {
  117 |     return this.fillCombo('Categorias', value);
  118 |   }
  119 | 
  120 |   /** Erro de validação do Tipo de experiência ("Campo obrigatório"). */
  121 |   tipoError(): Locator {
  122 |     return this.comboGroup('Tipo de experiência').getByText(/Campo obrigatório/i).first();
  123 |   }
  124 | 
  125 |   /** Um campo (input/select) está desabilitado? Procura por name OU pelo label. */
  126 |   async isInputDisabledByName(name: string): Promise<boolean> {
  127 |     const input = this.page.locator(`input[name="${name}"]`).first();
  128 |     if (!(await input.count())) return true; // ausente conta como não-editável
  129 |     return input.isDisabled();
  130 |   }
  131 | 
  132 |   // ---- Aprovar / Recusar ----
  133 | 
  134 |   /** Clica Aprovar sem esperar navegação (para validar bloqueio). */
  135 |   async clickAprovar(): Promise<void> {
  136 |     await this.aprovarButton().click();
  137 |   }
  138 | 
  139 |   /** Aprova e volta para a lista (fluxo feliz). */
  140 |   approve(): Promise<void> {
  141 |     return this.base.approve();
  142 |   }
  143 | 
  144 |   /** Abre o modal "Recusar registro" (sem completar). */
  145 |   async openRejectModal(): Promise<Locator> {
  146 |     await this.recusarButton().click();
  147 |     const modal = this.page
  148 |       .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
  149 |       .filter({ hasText: /Recusar registro/i })
  150 |       .first();
  151 |     await expect(modal).toBeVisible({ timeout: 10_000 });
  152 |     return modal;
  153 |   }
  154 | 
  155 |   justificativaTextarea(modal: Locator): Locator {
  156 |     return modal.locator('textarea').first();
  157 |   }
  158 | 
  159 |   modalRecusarButton(modal: Locator): Locator {
  160 |     return modal.getByRole('button', { name: /Recusar registro/i });
  161 |   }
  162 | 
  163 |   modalCancelarButton(modal: Locator): Locator {
  164 |     return modal.getByRole('button', { name: /Cancelar/i });
  165 |   }
  166 | 
  167 |   /** Fluxo completo de recusa com justificativa (reusa o helper base). */
  168 |   reject(justificativa: string): Promise<void> {
  169 |     return this.base.reject(justificativa);
  170 |   }
  171 | 
  172 |   /** Cancela a avaliação (rodapé) e volta à lista sem salvar. */
  173 |   async cancel(): Promise<void> {
  174 |     await this.cancelarButton().click();
  175 |     await this.page
  176 |       .waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), { timeout: 15_000 })
  177 |       .catch(() => undefined);
  178 |   }
  179 | 
  180 |   // ---- Histórico ----
  181 | 
  182 |   /** Abre o drawer "Histórico" pelo menu da linha e devolve o drawer. */
  183 |   async openHistorico(marker: string): Promise<Locator> {
  184 |     await this.base.clickRowMenuItem(this.rowByContent(marker), /Histórico/i);
  185 |     const drawer = this.page.locator('.chakra-modal__content, [role="dialog"]').filter({ hasText: /Histórico/i }).first();
> 186 |     await expect(drawer).toBeVisible({ timeout: 10_000 });
      |                          ^ Error: expect(locator).toBeVisible() failed
  187 |     return drawer;
  188 |   }
  189 | }
  190 | 
```