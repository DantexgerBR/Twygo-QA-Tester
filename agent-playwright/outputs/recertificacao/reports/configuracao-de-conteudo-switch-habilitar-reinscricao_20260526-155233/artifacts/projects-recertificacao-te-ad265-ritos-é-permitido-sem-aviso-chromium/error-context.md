# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts:54:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('label.chakra-switch').filter({ has: getByRole('checkbox', { name: /Habilitar reinscrição/i }) }) to be visible

```

# Page snapshot

```yaml
- heading "We're sorry, but something went wrong." [level=1] [ref=e3]
```

# Test source

```ts
  112 |       await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  113 |       return;
  114 |     }
  115 |     // Caminho 2: kebab Options (HAML). Abre dropdown e clica "Editar".
  116 |     const optionsTrigger = row
  117 |       .locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]')
  118 |       .first();
  119 |     await optionsTrigger.waitFor({ state: 'visible', timeout: 5_000 });
  120 |     await optionsTrigger.click();
  121 |     // Item "Editar" do dropdown — pode ser <a>, <li>, ou role=menuitem.
  122 |     const editarItem = this.page
  123 |       .getByRole('menuitem', { name: /^Editar$/i })
  124 |       .or(this.page.getByRole('link', { name: /^Editar$/i }))
  125 |       .first();
  126 |     await editarItem.waitFor({ state: 'visible', timeout: 5_000 });
  127 |     await editarItem.click();
  128 |     await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  129 |   }
  130 | 
  131 |   // ─── Switch "Habilitar reinscrição" ─────────────────────────────────
  132 | 
  133 |   /**
  134 |    * Locator do `<label>` do switch Chakra "Habilitar reinscrição".
  135 |    * Preferimos o role `checkbox` (semântico, estável entre HAML e React),
  136 |    * mas o click subsequente é via `setSwitch` no label — ver skill
  137 |    * `interagir-switch-chakra-twygo`.
  138 |    *
  139 |    * REVISAR: aguardando `data-test-id` estável (`event-has-recertification-switch`
  140 |    * sugerido). Quando o atributo for adicionado no app, trocar este getter.
  141 |    */
  142 |   getHabilitarReinscricaoSwitch(): Locator {
  143 |     // Fallback semântico — funciona em HAML e React enquanto o data-test-id
  144 |     // não existe. Atalho para o role+name canônico definido pela prosa do MD.
  145 |     return this.page.getByRole('checkbox', { name: /Habilitar reinscrição/i });
  146 |   }
  147 | 
  148 |   /**
  149 |    * Locator do `<label>` (não do `<input>`) — necessário para click no
  150 |    * switch Chakra (skill `interagir-switch-chakra-twygo`). Caminho: subir
  151 |    * pro ancestor `<label>` que envolve o input oculto.
  152 |    */
  153 |   getHabilitarReinscricaoSwitchLabel(): Locator {
  154 |     return this.page
  155 |       .locator('label.chakra-switch')
  156 |       .filter({ has: this.getHabilitarReinscricaoSwitch() });
  157 |   }
  158 | 
  159 |   /**
  160 |    * Locator do ícone de ajuda do switch — geralmente um `<button>` ou
  161 |    * `<span>` com role `button` adjacente ao label, com aria-label ou
  162 |    * tooltip key. Capturamos via filtro pelo label irmão.
  163 |    *
  164 |    * REVISAR: sem `data-test-id` no app hoje; fallback usa proximidade do
  165 |    * label. Quando o data-test-id `event-has-recertification-help-icon`
  166 |    * for adicionado, trocar este getter.
  167 |    */
  168 |   getHabilitarReinscricaoTooltipTrigger(): Locator {
  169 |     // Tooltip-trigger é o ícone/botão sibling do label do switch.
  170 |     return this.page
  171 |       .locator(':is(button, span, [role="button"])')
  172 |       .filter({ has: this.page.locator('[aria-describedby], [data-tooltip], svg') })
  173 |       .filter({
  174 |         has: this.page.locator(
  175 |           'xpath=ancestor::*[self::div or self::label][.//text()[contains(., "Habilitar reinscrição")]]',
  176 |         ),
  177 |       })
  178 |       .first();
  179 |   }
  180 | 
  181 |   /**
  182 |    * Texto visível do tooltip após hover no ícone de ajuda. O texto vem
  183 |    * da chave I18n `activerecord.attributes.event.has_recertification_tooltip`.
  184 |    *
  185 |    * REVISAR-FIGMA: texto exato do tooltip ainda não confirmado — capturamos
  186 |    * o role `tooltip` que aparece após hover.
  187 |    */
  188 |   getHabilitarReinscricaoTooltip(): Locator {
  189 |     return this.page.getByRole('tooltip').first();
  190 |   }
  191 | 
  192 |   /**
  193 |    * Estado atual do switch (lê `data-checked` do label — fonte de verdade
  194 |    * para switches Chakra; ver skill `interagir-switch-chakra-twygo`).
  195 |    */
  196 |   async isHabilitarReinscricaoOn(): Promise<boolean> {
  197 |     const label = this.getHabilitarReinscricaoSwitchLabel();
  198 |     if ((await label.count()) === 0) return false;
  199 |     return (await label.getAttribute('data-checked')) !== null;
  200 |   }
  201 | 
  202 |   /**
  203 |    * Idempotente: só clica se o estado atual diverge do desejado. Usa
  204 |    * `force: true` + `scrollIntoViewIfNeeded` no `<label>` Chakra.
  205 |    *
  206 |    * Skill `interagir-switch-chakra-twygo` documenta o porquê (label
  207 |    * intercepta pointer event do input oculto, scroll necessário em
  208 |    * drawers altos).
  209 |    */
  210 |   async setHabilitarReinscricao(enabled: boolean): Promise<void> {
  211 |     const label = this.getHabilitarReinscricaoSwitchLabel();
> 212 |     await label.waitFor({ state: 'visible' });
      |                 ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  213 |     const isOn = (await label.getAttribute('data-checked')) !== null;
  214 |     if (isOn !== enabled) {
  215 |       await label.scrollIntoViewIfNeeded();
  216 |       await label.click({ force: true });
  217 |     }
  218 |   }
  219 | 
  220 |   // ─── Submit / mensagens ─────────────────────────────────────────────
  221 | 
  222 |   getSaveButton(): Locator {
  223 |     // Tela HAML usa <input type="submit" value="Salvar">; React usa <button>Salvar</button>.
  224 |     // role=button cobre os dois.
  225 |     return this.page.getByRole('button', { name: /^Salvar$/ }).first();
  226 |   }
  227 | 
  228 |   async save(): Promise<void> {
  229 |     await this.getSaveButton().click();
  230 |   }
  231 | 
  232 |   /**
  233 |    * Aguarda confirmação de save bem-sucedido. Twygo usa toast Chakra +
  234 |    * redirect para a listagem (variando entre HAML/React). Asserta a
  235 |    * primeira condição que aparecer (toast OU URL de listagem).
  236 |    *
  237 |    * REVISAR-FIGMA: texto exato do toast de sucesso ainda não confirmado.
  238 |    */
  239 |   async expectSaveSuccess(): Promise<void> {
  240 |     // Toast Chakra de sucesso (status=success) — primeiro sinal pós-submit.
  241 |     const toast = this.page
  242 |       .locator('.chakra-toast, [role="status"]')
  243 |       .filter({ hasText: /salv|sucesso/i })
  244 |       .first();
  245 |     await expect
  246 |       .poll(async () => {
  247 |         const toastVisible = await toast.isVisible().catch(() => false);
  248 |         const url = this.page.url();
  249 |         return (
  250 |           toastVisible ||
  251 |           /\/o\/\d+\/events(\?|$)/.test(url) ||
  252 |           /\/(e\/\d+\/edit|contents\/\d+\/edit)/.test(url)
  253 |         );
  254 |       })
  255 |       .toBe(true);
  256 |   }
  257 | }
  258 | 
```