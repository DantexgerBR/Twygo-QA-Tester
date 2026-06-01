# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\filtro-avancado-status-substituido\tc4-opcao-substituido-nao-aparece-flag-off-regressao.spec.ts >> Filtro Avançado Status Substituído >> TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)
- Location: projects\recertificacao\tests\features\filtro-avancado-status-substituido\tc4-opcao-substituido-nao-aparece-flag-off-regressao.spec.ts:41:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#open-filter')
    - locator resolved to <button type="button" id="open-filter" class="chakra-button css-it72td" data-test-id="filter-control-open-button">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-1u2cvaz">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-1u2cvaz">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    27 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="-1" class="chakra-modal__content-container css-1u2cvaz">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  1   | import type { Locator, Page } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | import { BasePage } from '../../../src/pages/BasePage.js';
  4   | import { safeGoto } from '../../../src/utils/modals.js';
  5   | 
  6   | /**
  7   |  * Page Object da listagem de Aprendizagem ("Learning Students") do Twygo.
  8   |  *
  9   |  * Rota canônica (validada live 2026-05-27 — rota anterior
  10  |  * `/o/{org}/events/{id}/learning_students` retorna 404, descontinuada):
  11  |  *   `/e/{eventId}/learning`
  12  |  *
  13  |  * Acessível na UI via: menu kebab `data-test-id="events-{id}-actions-kebab"`
  14  |  * → item "Aprendizagem".
  15  |  *
  16  |  * Convenções aplicadas:
  17  |  *  - `safeGoto` para cobrir NPS Sofia + outros modais oportunistas
  18  |  *    (regra dura meta-monorepo).
  19  |  *  - Drawer de filtro Chakra slide-in: mesmos IDs canônicos compartilhados
  20  |  *    entre listagens Twygo (`#open-filter`, `#clear-filter`,
  21  |  *    `#list-filter-apply`, `#form-filter-apply`) — ver skill
  22  |  *    `testar-filtro-drawer-twygo`.
  23  |  *  - Toasts Chakra: `.first()` no filtro por texto evita strict-mode quando
  24  |  *    múltiplos toasts empilham (ver skill `testar-toast-chakra-twygo`).
  25  |  *
  26  |  * Status data-test-id: nenhum elemento da listagem tem `data-test-id`
  27  |  * estável ainda (PR pendente para o time de dev). Fallbacks usam id
  28  |  * estável (`#open-filter`, `#clear-filter`), `getByRole`, e seletores
  29  |  * por texto literal das opções do filtro. Cada uso fica marcado com
  30  |  * `// REVISAR: aguardando data-test-id`.
  31  |  */
  32  | export class LearningStudentsPage extends BasePage {
  33  |   readonly path = '';
  34  | 
  35  |   constructor(page: Page) {
  36  |     super(page);
  37  |   }
  38  | 
  39  |   // ─── Navegação ──────────────────────────────────────────────────────
  40  | 
  41  |   /**
  42  |    * Acessa a listagem de aprendizagem de um curso/evento específico.
  43  |    * Rota canônica: `/e/{eventId}/learning` (validada live 2026-05-27).
  44  |    * `orgId` é resolvido server-side pelo eventId.
  45  |    */
  46  |   async goToList(eventId: number | string): Promise<void> {
  47  |     await safeGoto(this.page, `/e/${eventId}/learning`);
  48  |   }
  49  | 
  50  |   // ─── Drawer de filtro avançado ──────────────────────────────────────
  51  | 
  52  |   /**
  53  |    * Botão "Filtrar" (id canônico `#open-filter`) — abre o drawer Chakra
  54  |    * slide-in com a "Lista de filtros" (modo A) ou edição de filtro
  55  |    * existente (modo B). Ver skill `testar-filtro-drawer-twygo`.
  56  |    * REVISAR: aguardando data-test-id.
  57  |    */
  58  |   getFilterButton(): Locator {
  59  |     return this.page.locator('#open-filter');
  60  |   }
  61  | 
  62  |   /**
  63  |    * Botão "Limpar filtro" externo ao drawer — aparece apenas quando há
  64  |    * filtro ativo. Id canônico `#clear-filter`.
  65  |    * REVISAR: aguardando data-test-id.
  66  |    */
  67  |   getClearFilterButton(): Locator {
  68  |     return this.page.locator('#clear-filter');
  69  |   }
  70  | 
  71  |   /**
  72  |    * Abre o drawer de filtro avançado. Idempotente: se já aberto (dialog
  73  |    * Chakra modal visível), retorna sem clicar novamente.
  74  |    */
  75  |   async openFilterDrawer(): Promise<void> {
  76  |     // role=dialog ambíguo: popover de Notificações também usa role=dialog.
  77  |     // Drawer Chakra slide-in pode renderizar fora do viewport — usar heading
  78  |     // específico "Lista de filtros" como sinal de prontidão.
  79  |     const dialog = this.page.getByText('Lista de filtros', { exact: true }).first();
  80  |     if (await dialog.isVisible().catch(() => false)) return;
> 81  |     await this.getFilterButton().click();
      |                                  ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  82  |     // NÃO chamar dismissCommonModals aqui — o último-recurso dele clica
  83  |     // "Close" em QUALQUER dialog visível, incluindo o drawer recém-aberto.
  84  |     // NPS Sofia já foi tratado no safeGoto da navegação anterior.
  85  |     await dialog.waitFor({ state: 'visible', timeout: 10_000 });
  86  |   }
  87  | 
  88  |   /**
  89  |    * Abre o painel de criação de novo filtro avançado (clica "+ Novo" no
  90  |    * drawer "Lista de filtros") e escolhe um critério da seção "Opções de
  91  |    * filtro". Após esse fluxo, as opções do critério (ex: status do
  92  |    * certificado) ficam visíveis no painel de edição do filtro.
  93  |    *
  94  |    * Pré-condição: `openFilterDrawer()` chamado antes (drawer "Lista de
  95  |    * filtros" visível).
  96  |    *
  97  |    * Critérios disponíveis (validados live 2026-05-27): Participante,
  98  |    * Progresso, Desempenho, Pontuação, Aprovação, **Certificado**, E-mail
  99  |    * do participante, CPF do participante, Situação da inscrição, etc.
  100 |    * "Certificado" é o critério canônico para validar a opção "Substituído"
  101 |    * (a AT usava "Status do certificado" — terminologia legada).
  102 |    */
  103 |   async openAdvancedFilterCriteria(criterion: string): Promise<void> {
  104 |     const drawer = this.page.locator('.chakra-modal__content').first();
  105 |     await drawer.waitFor({ state: 'visible', timeout: 5_000 });
  106 |     // Clicar "+ Novo" — é um <p>Novo</p> dentro de div clicável.
  107 |     await drawer.getByText('Novo', { exact: true }).first().click();
  108 |     // Painel abre em modo "Colunas para filtrar" com critérios PADRÃO
  109 |     // (Participante, Progresso, Aprovação). Para adicionar Certificado
  110 |     // (ou outro), clicar no botão "+ Opções de filtro" que expande lista
  111 |     // de checkboxes com todos os critérios disponíveis.
  112 |     const opcoesBtn = drawer.getByRole('button', { name: /Opções de filtro/i }).first();
  113 |     await opcoesBtn.waitFor({ state: 'visible', timeout: 5_000 });
  114 |     await opcoesBtn.click();
  115 |     // Lista de checkboxes aparece — marcar o critério desejado.
  116 |     const criterionLabel = drawer
  117 |       .locator('label.chakra-checkbox')
  118 |       .filter({ hasText: new RegExp(`^${criterion}$`) })
  119 |       .first();
  120 |     await criterionLabel.waitFor({ state: 'attached', timeout: 5_000 });
  121 |     await criterionLabel.scrollIntoViewIfNeeded();
  122 |     const isChecked = (await criterionLabel.getAttribute('data-checked')) !== null;
  123 |     if (!isChecked) {
  124 |       await criterionLabel.click();
  125 |     }
  126 |   }
  127 | 
  128 |   /**
  129 |    * Localiza uma opção do filtro de Status do certificado dentro do
  130 |    * drawer aberto, ancorando no `<label>` Chakra (radio ou checkbox)
  131 |    * com o texto exato da opção. Funciona em modo A (lista de filtros
  132 |    * padrão) ou modo B (edição com accordion expandido).
  133 |    *
  134 |    * Opções esperadas (RN 23): Emitido, Pendente, Expirado, Aguardando
  135 |    * assinatura, Substituído.
  136 |    *
  137 |    * REVISAR: aguardando data-test-id por opção
  138 |    * (ex.: `learning-students-filter-status-substituido`). Hoje o fallback
  139 |    * usa role+name dentro do dialog para evitar bater em texto fora do drawer.
  140 |    */
  141 |   getStatusFilterOption(option: string): Locator {
  142 |     return this.page
  143 |       .locator('.chakra-modal__content')
  144 |       .first()
  145 |       .getByText(option, { exact: true });
  146 |   }
  147 | 
  148 |   /**
  149 |    * Seleciona uma opção de status no drawer (radio/checkbox).
  150 |    * Click no label wrapper — o input Chakra é hidden via clip e não
  151 |    * recebe pointer events direto.
  152 |    *
  153 |    * Pré-condição: drawer aberto via `openFilterDrawer()`.
  154 |    */
  155 |   async selectStatusFilter(statusName: string): Promise<void> {
  156 |     const option = this.getStatusFilterOption(statusName);
  157 |     await option.waitFor({ state: 'visible', timeout: 10_000 });
  158 |     await option.click();
  159 |   }
  160 | 
  161 |   /**
  162 |    * Confirma os filtros aplicados. Twygo expõe 2 botões dependendo do
  163 |    * modo do drawer:
  164 |    *   - Modo A (Lista de filtros): `#list-filter-apply`
  165 |    *   - Modo B (Edição de filtro): `#form-filter-apply`
  166 |    * Aplicamos o primeiro que estiver visível; pós-condição é o drawer
  167 |    * fechar e `#clear-filter` aparecer.
  168 |    */
  169 |   async applyFilters(): Promise<void> {
  170 |     const listApply = this.page.locator('#list-filter-apply');
  171 |     const formApply = this.page.locator('#form-filter-apply');
  172 | 
  173 |     if (await formApply.isVisible().catch(() => false)) {
  174 |       await formApply.click();
  175 |     } else {
  176 |       await listApply.click();
  177 |     }
  178 |     await expect(this.getClearFilterButton()).toBeVisible({ timeout: 10_000 });
  179 |     await this.page.waitForLoadState('networkidle').catch(() => undefined);
  180 |   }
  181 | 
```