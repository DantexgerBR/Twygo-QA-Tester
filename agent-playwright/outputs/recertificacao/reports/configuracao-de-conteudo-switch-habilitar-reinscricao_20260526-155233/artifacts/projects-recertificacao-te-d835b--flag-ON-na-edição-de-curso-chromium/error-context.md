# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts:52:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for getByRole('row', { name: /Curso Recertificação TC1 w0-1779821457369/i }).first().locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]').first() to be visible

```

# Page snapshot

```yaml
- heading "We're sorry, but something went wrong." [level=1] [ref=e3]
```

# Test source

```ts
  19  |  *  - `safeGoto` em todas as navegações (regra dura meta-monorepo: cobre NPS
  20  |  *    Sofia + outros modais oportunistas que travam o evento `load`).
  21  |  *  - Switch Chakra: padrão `setSwitch` (skill `interagir-switch-chakra-twygo`)
  22  |  *    — `scrollIntoViewIfNeeded` + `click({ force: true })` no label,
  23  |  *    idempotente via comparação de estado antes do toggle.
  24  |  *  - `data-checked` no label como fonte de verdade do estado (em vez de
  25  |  *    `toBeChecked()`, que resolve no `<input>` interno oculto).
  26  |  */
  27  | export class ContentEditPage extends BasePage {
  28  |   readonly path = '';
  29  | 
  30  |   constructor(page: Page) {
  31  |     super(page);
  32  |   }
  33  | 
  34  |   // ─── Navegação ──────────────────────────────────────────────────────
  35  | 
  36  |   /**
  37  |    * Listagem de conteúdos (cursos) da organização do env atual.
  38  |    * URL canônica: `/o/{orgId}/events`.
  39  |    */
  40  |   async goToContentList(): Promise<void> {
  41  |     await safeGoto(this.page, `/o/${getOrgId()}/events`);
  42  |   }
  43  | 
  44  |   /** Edição HAML (formulário legado `_form_details.haml`). */
  45  |   async openEditHamlById(eventId: number | string): Promise<void> {
  46  |     await safeGoto(this.page, `/e/${eventId}/edit`);
  47  |   }
  48  | 
  49  |   /** Edição React (formulário facelift `event-form.tsx`). */
  50  |   async openEditReactById(eventId: number | string): Promise<void> {
  51  |     await safeGoto(this.page, `/contents/${eventId}/edit`);
  52  |   }
  53  | 
  54  |   /**
  55  |    * Default canônico de "abrir edição" usado pelos specs. Hoje aponta para
  56  |    * a tela HAML — é onde a maior parte dos campos vive (Detalhes). TC5
  57  |    * usa explicitamente os 2 helpers acima para validar paridade.
  58  |    */
  59  |   async openEditById(eventId: number | string): Promise<void> {
  60  |     await this.openEditHamlById(eventId);
  61  |   }
  62  | 
  63  |   /**
  64  |    * Abre a edição de um conteúdo a partir da listagem clicando no ação
  65  |    * "Editar" do registro com o nome dado. Caminho usado pelos TCs que
  66  |    * descrevem o fluxo "Listagem → Editar" textualmente (TC1, TC4).
  67  |    *
  68  |    * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
  69  |    * "Editar" direto na linha; usa kebab `img "Options"` que abre dropdown
  70  |    * com a ação. Adicionar data-test-id estável no app via PR.
  71  |    */
  72  |   async openEditByName(name: string): Promise<void> {
  73  |     await this.goToContentList();
  74  |     const row = this.page.getByRole('row', { name: new RegExp(name, 'i') }).first();
  75  |     await row.waitFor({ state: 'visible' });
  76  |     await this.clickEditarFromRow(row);
  77  |   }
  78  | 
  79  |   /**
  80  |    * Abre a edição da PRIMEIRA linha de curso visível na listagem.
  81  |    * Usado por TCs cuja pré-condição é só "existe ≥1 curso pré-existente"
  82  |    * (TC1) sem fixar nome específico.
  83  |    *
  84  |    * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
  85  |    * "Editar" direto na linha; usa kebab `img "Options"` que abre
  86  |    * dropdown com a ação "Editar". Adicionar data-test-id estável no app
  87  |    * via PR (`event-row-edit-link` sugerido).
  88  |    */
  89  |   async openEditFromFirstRow(): Promise<void> {
  90  |     await this.goToContentList();
  91  |     // Primeira linha de dados (exclui header em <thead>).
  92  |     const firstRow = this.page.locator('tbody tr').first();
  93  |     await firstRow.waitFor({ state: 'visible', timeout: 10_000 });
  94  |     await this.clickEditarFromRow(firstRow);
  95  |   }
  96  | 
  97  |   /**
  98  |    * Clica em "Editar" dentro de uma linha da listagem. Cobre os 2 padrões
  99  |    * de UI observados no Twygo:
  100 |    *   1. Tela legada (HAML): kebab `img "Options"` → dropdown → "Editar".
  101 |    *   2. Tela facelift: `<a>Editar</a>` direto na célula de ações.
  102 |    *
  103 |    * REVISAR: seletor `img[alt="Options"]` foi descoberto via heal (error-context
  104 |    * de TC1 mostrou `img "Options" [cursor=pointer]` como única affordance de ação).
  105 |    * Substituir por `data-test-id` estável quando dev adicionar (PR pendente).
  106 |    */
  107 |   private async clickEditarFromRow(row: Locator): Promise<void> {
  108 |     // Caminho 1: link "Editar" direto (facelift).
  109 |     const directLink = row.getByRole('link', { name: /Editar/i }).first();
  110 |     if (await directLink.isVisible().catch(() => false)) {
  111 |       await directLink.click();
  112 |       await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  113 |       return;
  114 |     }
  115 |     // Caminho 2: kebab Options (HAML). Abre dropdown e clica "Editar".
  116 |     const optionsTrigger = row
  117 |       .locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]')
  118 |       .first();
> 119 |     await optionsTrigger.waitFor({ state: 'visible', timeout: 5_000 });
      |                          ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
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
  212 |     await label.waitFor({ state: 'visible' });
  213 |     const isOn = (await label.getAttribute('data-checked')) !== null;
  214 |     if (isOn !== enabled) {
  215 |       await label.scrollIntoViewIfNeeded();
  216 |       await label.click({ force: true });
  217 |     }
  218 |   }
  219 | 
```