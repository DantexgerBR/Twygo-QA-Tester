import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object da listagem de Aprendizagem ("Learning Students") do Twygo.
 *
 * Rota canônica (validada live 2026-05-27 — rota anterior
 * `/o/{org}/events/{id}/learning_students` retorna 404, descontinuada):
 *   `/e/{eventId}/learning`
 *
 * Acessível na UI via: menu kebab `data-test-id="events-{id}-actions-kebab"`
 * → item "Aprendizagem".
 *
 * Convenções aplicadas:
 *  - `safeGoto` para cobrir NPS Sofia + outros modais oportunistas
 *    (regra dura meta-monorepo).
 *  - Drawer de filtro Chakra slide-in: mesmos IDs canônicos compartilhados
 *    entre listagens Twygo (`#open-filter`, `#clear-filter`,
 *    `#list-filter-apply`, `#form-filter-apply`) — ver skill
 *    `testar-filtro-drawer-twygo`.
 *  - Toasts Chakra: `.first()` no filtro por texto evita strict-mode quando
 *    múltiplos toasts empilham (ver skill `testar-toast-chakra-twygo`).
 *
 * Status data-test-id: nenhum elemento da listagem tem `data-test-id`
 * estável ainda (PR pendente para o time de dev). Fallbacks usam id
 * estável (`#open-filter`, `#clear-filter`), `getByRole`, e seletores
 * por texto literal das opções do filtro. Cada uso fica marcado com
 * `// REVISAR: aguardando data-test-id`.
 */
export class LearningStudentsPage extends BasePage {
  readonly path = '';

  constructor(page: Page) {
    super(page);
  }

  // ─── Navegação ──────────────────────────────────────────────────────

  /**
   * Acessa a listagem de aprendizagem de um curso/evento específico.
   * Rota canônica: `/e/{eventId}/learning` (validada live 2026-05-27).
   * `orgId` é resolvido server-side pelo eventId.
   */
  async goToList(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/e/${eventId}/learning`);
  }

  // ─── Drawer de filtro avançado ──────────────────────────────────────

  /**
   * Botão "Filtrar" (id canônico `#open-filter`) — abre o drawer Chakra
   * slide-in com a "Lista de filtros" (modo A) ou edição de filtro
   * existente (modo B). Ver skill `testar-filtro-drawer-twygo`.
   * REVISAR: aguardando data-test-id.
   */
  getFilterButton(): Locator {
    return this.page.locator('#open-filter');
  }

  /**
   * Botão "Limpar filtro" externo ao drawer — aparece apenas quando há
   * filtro ativo. Id canônico `#clear-filter`.
   * REVISAR: aguardando data-test-id.
   */
  getClearFilterButton(): Locator {
    return this.page.locator('#clear-filter');
  }

  /**
   * Abre o drawer de filtro avançado. Idempotente: se já aberto (dialog
   * Chakra modal visível), retorna sem clicar novamente.
   */
  async openFilterDrawer(): Promise<void> {
    // role=dialog ambíguo: popover de Notificações também usa role=dialog.
    // Drawer Chakra slide-in pode renderizar fora do viewport — usar heading
    // específico "Lista de filtros" como sinal de prontidão.
    const dialog = this.page.getByText('Lista de filtros', { exact: true }).first();
    if (await dialog.isVisible().catch(() => false)) return;
    await this.getFilterButton().click();
    // NÃO chamar dismissCommonModals aqui — o último-recurso dele clica
    // "Close" em QUALQUER dialog visível, incluindo o drawer recém-aberto.
    // NPS Sofia já foi tratado no safeGoto da navegação anterior.
    await dialog.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Abre o painel de criação de novo filtro avançado (clica "+ Novo" no
   * drawer "Lista de filtros") e escolhe um critério da seção "Opções de
   * filtro". Após esse fluxo, as opções do critério (ex: status do
   * certificado) ficam visíveis no painel de edição do filtro.
   *
   * Pré-condição: `openFilterDrawer()` chamado antes (drawer "Lista de
   * filtros" visível).
   *
   * Critérios disponíveis (validados live 2026-05-27): Participante,
   * Progresso, Desempenho, Pontuação, Aprovação, **Certificado**, E-mail
   * do participante, CPF do participante, Situação da inscrição, etc.
   * "Certificado" é o critério canônico para validar a opção "Substituído"
   * (a AT usava "Status do certificado" — terminologia legada).
   */
  async openAdvancedFilterCriteria(criterion: string): Promise<void> {
    const drawer = this.page.locator('.chakra-modal__content').first();
    await drawer.waitFor({ state: 'visible', timeout: 5_000 });
    // Clicar "+ Novo" — é um <p>Novo</p> dentro de div clicável.
    await drawer.getByText('Novo', { exact: true }).first().click();
    // Painel abre em modo "Colunas para filtrar" com critérios PADRÃO
    // (Participante, Progresso, Aprovação). Para adicionar Certificado
    // (ou outro), clicar no botão "+ Opções de filtro" que expande lista
    // de checkboxes com todos os critérios disponíveis.
    const opcoesBtn = drawer.getByRole('button', { name: /Opções de filtro/i }).first();
    await opcoesBtn.waitFor({ state: 'visible', timeout: 5_000 });
    await opcoesBtn.click();
    // Lista de checkboxes aparece — marcar o critério desejado.
    const criterionLabel = drawer
      .locator('label.chakra-checkbox')
      .filter({ hasText: new RegExp(`^${criterion}$`) })
      .first();
    await criterionLabel.waitFor({ state: 'attached', timeout: 5_000 });
    await criterionLabel.scrollIntoViewIfNeeded();
    const isChecked = (await criterionLabel.getAttribute('data-checked')) !== null;
    if (!isChecked) {
      await criterionLabel.click();
    }
  }

  /**
   * Localiza uma opção do filtro de Status do certificado dentro do
   * drawer aberto, ancorando no `<label>` Chakra (radio ou checkbox)
   * com o texto exato da opção. Funciona em modo A (lista de filtros
   * padrão) ou modo B (edição com accordion expandido).
   *
   * Opções esperadas (RN 23): Emitido, Pendente, Expirado, Aguardando
   * assinatura, Substituído.
   *
   * REVISAR: aguardando data-test-id por opção
   * (ex.: `learning-students-filter-status-substituido`). Hoje o fallback
   * usa role+name dentro do dialog para evitar bater em texto fora do drawer.
   */
  getStatusFilterOption(option: string): Locator {
    return this.page
      .locator('.chakra-modal__content')
      .first()
      .getByText(option, { exact: true });
  }

  /**
   * Seleciona uma opção de status no drawer (radio/checkbox).
   * Click no label wrapper — o input Chakra é hidden via clip e não
   * recebe pointer events direto.
   *
   * Pré-condição: drawer aberto via `openFilterDrawer()`.
   */
  async selectStatusFilter(statusName: string): Promise<void> {
    const option = this.getStatusFilterOption(statusName);
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();
  }

  /**
   * Confirma os filtros aplicados. Twygo expõe 2 botões dependendo do
   * modo do drawer:
   *   - Modo A (Lista de filtros): `#list-filter-apply`
   *   - Modo B (Edição de filtro): `#form-filter-apply`
   * Aplicamos o primeiro que estiver visível; pós-condição é o drawer
   * fechar e `#clear-filter` aparecer.
   */
  async applyFilters(): Promise<void> {
    const listApply = this.page.locator('#list-filter-apply');
    const formApply = this.page.locator('#form-filter-apply');

    if (await formApply.isVisible().catch(() => false)) {
      await formApply.click();
    } else {
      await listApply.click();
    }
    await expect(this.getClearFilterButton()).toBeVisible({ timeout: 10_000 });
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  /**
   * Limpa filtro ativo. Idempotente: só clica se `#clear-filter` visível.
   * Aguarda o botão desaparecer (condition-based).
   */
  async clearFilters(): Promise<void> {
    const clearBtn = this.getClearFilterButton();
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click();
      await expect(clearBtn).toHaveCount(0, { timeout: 5_000 });
    }
  }

  /**
   * Assert: opção do filtro está visível (ou não) no drawer aberto.
   * Usada por TC1 (flag ON ⇒ "Substituído" visível) e TC4 (flag OFF ⇒
   * "Substituído" ausente).
   *
   * Pré-condição: drawer aberto via `openFilterDrawer()`.
   */
  async expectFilterOptionVisible(option: string, visible: boolean): Promise<void> {
    const opt = this.getStatusFilterOption(option);
    if (visible) {
      await expect(opt).toBeVisible({ timeout: 10_000 });
    } else {
      await expect(opt).toHaveCount(0, { timeout: 10_000 });
    }
  }

  // ─── Linhas / badges da listagem ────────────────────────────────────

  /**
   * Locator das linhas de participants na tabela (após filtro/listagem
   * inicial). Ancora em `tbody tr` dentro do container principal — exclui
   * cabeçalho e linhas de empty state (que têm `td[colspan]`).
   */
  getParticipantRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td[colspan]'),
    });
  }

  /**
   * Linha do participant identificado por e-mail (preferido) ou nome.
   * Ancora em `tbody tr` que contenha o texto.
   */
  getParticipantRow(identifier: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: identifier }).first();
  }

  /**
   * Badge de status do certificado para um participant específico, na
   * coluna "Status do certificado".
   *
   * Componente: `certificate-student-badge.tsx` (RN 23.2). Renderiza um
   * `<span>`/`<div>` Chakra com `data-testid="certificate-student-badge"`
   * idealmente — fallback hoje captura por texto literal do label dentro
   * da linha.
   *
   * REVISAR: aguardando data-test-id estável no componente badge.
   */
  getStatusBadgeForParticipant(identifier: string): Locator {
    return this.getParticipantRow(identifier).locator(
      '[data-testid*="certificate"], [data-test-id*="certificate"], .chakra-badge, [class*="badge"]',
    ).first();
  }

  /**
   * Iterador de status visíveis no `<tbody>`. Após filtrar por
   * "Substituído", todos os badges devem conter o texto "Substituído".
   * Usado pelo TC2 para asserir a invariante de query do filtro.
   */
  async getAllVisibleStatusTexts(): Promise<string[]> {
    const rows = this.getParticipantRows();
    const count = await rows.count();
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      // Pega o texto da célula de status — fallback: texto inteiro da linha.
      const badgeText = await row
        .locator('.chakra-badge, [class*="badge"]')
        .first()
        .textContent()
        .catch(() => null);
      if (badgeText) {
        out.push(badgeText.trim());
      } else {
        const fallback = await row.textContent().catch(() => '');
        out.push((fallback ?? '').trim());
      }
    }
    return out;
  }

  // ─── Seleção de alunos + drawer de ações em massa ───────────────────
  //
  // Suite 03 "Reinscrição em Massa pelo Admin" (MD §430-555). A listagem
  // expõe checkboxes (um por linha + um no header pra "selecionar todos")
  // e, quando ≥1 aluno marcado, abre um drawer lateral com ações em
  // massa (ex: "Reinscrição em massa"). Drawer renderiza no canto
  // direito/inferior conforme breakpoint.
  //
  // REVISAR: aguardando `data-test-id` estável nos checkboxes
  // (`learning-students-row-checkbox-{participantId}` sugerido) e no
  // drawer (`learning-students-mass-actions-drawer`). Hoje fallback
  // depende de role+name + ancoragem por linha (`tr`).

  /**
   * Checkbox no header da tabela — seleciona TODOS os alunos visíveis na
   * página atual. Em listagens paginadas, marca apenas a página atual
   * (comportamento padrão Twygo).
   *
   * REVISAR: aguardando data-test-id `learning-students-select-all`.
   */
  getSelectAllCheckbox(): Locator {
    return this.page.locator('thead input[type="checkbox"]').first();
  }

  /**
   * Checkbox de uma linha específica de aluno (identificado por e-mail
   * ou nome). Necessário pra seleção parcial (TC1 pede 3 alunos, TC3
   * pede 5).
   */
  getStudentCheckbox(identifier: string): Locator {
    return this.getParticipantRow(identifier).locator('input[type="checkbox"]').first();
  }

  /**
   * Seleciona todos os alunos visíveis na página marcando o checkbox
   * do header. Idempotente: se já marcado, retorna sem clicar.
   */
  async selectAllStudents(): Promise<void> {
    const cb = this.getSelectAllCheckbox();
    await cb.waitFor({ state: 'visible' });
    if (!(await cb.isChecked().catch(() => false))) {
      // Chakra checkbox: input hidden via clip — click no <label> pai.
      const label = this.page.locator('thead label.chakra-checkbox').first();
      if (await label.isVisible().catch(() => false)) {
        await label.click();
      } else {
        await cb.click({ force: true });
      }
    }
  }

  /**
   * Seleciona N alunos por identificadores (e-mails ou nomes).
   * Idempotente por aluno: se já marcado, pula sem clicar.
   *
   * Pré-condição: identificadores precisam estar visíveis na página
   * atual (sem paginação extra). Caller é responsável por garantir
   * isso via filtro/seed.
   */
  async selectStudents(identifiers: readonly string[]): Promise<void> {
    for (const id of identifiers) {
      const row = this.getParticipantRow(id);
      await row.waitFor({ state: 'visible', timeout: 10_000 });
      const cb = this.getStudentCheckbox(id);
      if (!(await cb.isChecked().catch(() => false))) {
        // Click no label pai (Chakra esconde o input via clip).
        const label = row.locator('label.chakra-checkbox').first();
        if (await label.isVisible().catch(() => false)) {
          await label.click();
        } else {
          await cb.click({ force: true });
        }
      }
    }
  }

  /**
   * Seleciona as primeiras N linhas da listagem (sem ancorar em
   * identificador). Útil para TCs onde o seed garante elegibilidade
   * mas não nomes específicos.
   *
   * Pré-condição: ≥ count linhas visíveis na página atual.
   */
  async selectFirstNStudents(count: number): Promise<void> {
    const rows = this.getParticipantRows();
    const total = await rows.count();
    if (total < count) {
      throw new Error(
        `selectFirstNStudents: pediu ${count} mas só há ${total} linhas visíveis. ` +
          `Verifique seed do env / filtros aplicados.`,
      );
    }
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cb = row.locator('input[type="checkbox"]').first();
      if (!(await cb.isChecked().catch(() => false))) {
        const label = row.locator('label.chakra-checkbox').first();
        if (await label.isVisible().catch(() => false)) {
          await label.click();
        } else {
          await cb.click({ force: true });
        }
      }
    }
  }

  /**
   * Drawer de ações em massa — `role="dialog"` ou container fixo na
   * lateral direita. Aparece sozinho quando ≥1 aluno selecionado.
   *
   * REVISAR: aguardando data-test-id `learning-students-mass-actions-drawer`.
   * Fallback por role+contagem visível textual ("selecionados").
   */
  getMassActionsDrawer(): Locator {
    return this.page
      .locator('[role="dialog"], [role="region"], aside, [class*="drawer" i]')
      .filter({ hasText: /selecionad/i })
      .first();
  }

  /**
   * Espera o drawer abrir e exibir a contagem esperada. Não clica em
   * nada — é o equivalente ao "→ Drawer de ações em massa é exibido
   * na lateral com a contagem "N selecionados"" do MD.
   */
  async openMassActionsDrawer(expectedCount?: number): Promise<void> {
    const drawer = this.getMassActionsDrawer();
    await drawer.waitFor({ state: 'visible', timeout: 10_000 });
    if (typeof expectedCount === 'number') {
      await expect(drawer).toContainText(
        new RegExp(`\\b${expectedCount}\\b.*selecionad`, 'i'),
        { timeout: 5_000 },
      );
    }
  }

  /**
   * Opção "Reinscrição em massa" dentro do drawer. Pode ser `<button>`,
   * `<a>` ou `<li>` clicável dependendo do componente.
   *
   * REVISAR: aguardando data-test-id `mass-action-mass-reenroll`.
   * REVISAR-FIGMA: texto exato — MD §88 indica "Reinscrição em massa"
   * mas marca o texto como suscetível a variação.
   */
  getMassReenrollAction(): Locator {
    return this.getMassActionsDrawer().getByText(/Reinscrição em massa/i).first();
  }

  /**
   * Clica na ação "Reinscrição em massa" dentro do drawer. Pré-condição:
   * drawer aberto via `openMassActionsDrawer`.
   */
  async clickMassReenroll(): Promise<void> {
    const action = this.getMassReenrollAction();
    await action.waitFor({ state: 'visible', timeout: 5_000 });
    await action.click();
  }

  // ─── Modal de confirmação "Reinscrição em massa" ────────────────────

  /**
   * Modal de confirmação que abre ao clicar em "Reinscrição em massa".
   * Header literal esperado: "Reinscrição em massa" (REVISAR-FIGMA §131).
   */
  getMassReenrollConfirmModal(): Locator {
    return this.page
      .getByRole('dialog')
      .filter({ hasText: /Reinscrição em massa/i })
      .first();
  }

  /**
   * Botão "Confirmar" dentro do modal. Após click → modal fecha + toast
   * "Reinscrição em massa iniciada" (MD §111).
   */
  getMassReenrollConfirmButton(): Locator {
    return this.getMassReenrollConfirmModal()
      .getByRole('button', { name: /^Confirmar$/i })
      .first();
  }

  /**
   * Fluxo: assert modal aberto com a contagem correta + click em Confirmar.
   * `count` é o número de alunos selecionados ("Você está prestes a
   * reinscrever N aluno(s)" — MD §134, REVISAR-FIGMA).
   */
  async confirmMassReenrollModal(count: number): Promise<void> {
    const modal = this.getMassReenrollConfirmModal();
    await modal.waitFor({ state: 'visible', timeout: 10_000 });
    // REVISAR-FIGMA: body literal não confirmado — asserta apenas que
    // a contagem aparece no corpo.
    await expect(modal).toContainText(new RegExp(`\\b${count}\\b`));
    await this.getMassReenrollConfirmButton().click();
    await modal.waitFor({ state: 'hidden', timeout: 10_000 });
  }

  // ─── Toast pós-disparo ───────────────────────────────────────────────

  /**
   * Toast Chakra de sucesso após disparar a reinscrição em massa.
   * Texto literal esperado: "Reinscrição em massa iniciada" (MD §111,
   * REVISAR-FIGMA).
   *
   * `.first()` resolve strict-mode em caso de múltiplos toasts
   * empilhados (skill `testar-toast-chakra-twygo`).
   */
  getMassReenrollToast(): Locator {
    return this.page
      .locator('.chakra-toast, [role="status"], [role="alert"]')
      .filter({ hasText: /Reinscrição em massa iniciada|massa iniciada|sucesso/i })
      .first();
  }

  /**
   * Assert: toast de sucesso pós-confirmação apareceu. Padrão canônico
   * com `.first()` (skill `testar-toast-chakra-twygo`).
   */
  async expectMassToastSuccess(): Promise<void> {
    await expect(this.getMassReenrollToast()).toBeVisible({ timeout: 10_000 });
  }

  // ─── Reinscrição individual pelo Admin (Suite 02) ───────────────────
  //
  // Convenções do menu de ações por linha (validado live 2026-05-27 em
  // /e/{id}/learning, env 37048):
  //  - O trigger é o botão kebab com accessible name literal `more_vert`
  //    (ícone Material). NÃO é "Ações"/"Opções" — esses nomes nunca
  //    existiram no facelift.
  //  - O dropdown abre como `<div role="menu">` (portal Chakra) — items
  //    têm `role="menuitem"`. Item de reinscrição é **"Iniciar reinscrição"**
  //    (ícone `replay`), NÃO "Reinscrever".
  //  - NÃO há modal de confirmação — o click em "Iniciar reinscrição"
  //    dispara imediatamente `POST /api/v1/o/{org}/contents/{id}/event_participants`
  //    com payload `{"recertification":true,"user":{"id":N}}`. Sucesso →
  //    toast; falha → toast "Erro ao reinscrever participante".
  //
  // REVISAR: aguardando data-test-ids estáveis no app para:
  //   - `learning-student-row-actions-{userId}` (trigger por linha)
  //   - `learning-student-action-reenroll` (item "Iniciar reinscrição")
  // Quando os atributos forem adicionados, trocar os getters semânticos.

  /**
   * Linha do participant identificada por e-mail. Wrapper semântico em
   * cima de `getParticipantRow` mais explícito sobre o critério de match
   * (e-mail vs nome). Suite 02 usa exclusivamente e-mail.
   */
  getRowByEmail(email: string): Locator {
    return this.getParticipantRow(email);
  }

  /**
   * Trigger do menu de ações (kebab) na linha do aluno. No facelift
   * /e/{id}/learning o botão tem accessible name literal `more_vert`
   * (validado live 2026-05-27).
   */
  getRowActionsMenuTrigger(email: string): Locator {
    return this.getRowByEmail(email)
      .getByRole('button', { name: 'more_vert' })
      .first();
  }

  /**
   * Item "Iniciar reinscrição" (ícone `replay`) no menu de ações aberto.
   * Validado live 2026-05-27 — o item NÃO se chama "Reinscrever".
   */
  getReinscreverMenuItem(): Locator {
    return this.page.getByRole('menuitem', { name: /Iniciar reinscrição/i });
  }

  /**
   * Toast de ERRO da reinscrição individual. Texto literal observado live
   * 2026-05-27: "Erro ao reinscrever participante" (disparado quando o
   * `POST .../event_participants` retorna 422). `.first()` resolve
   * strict-mode com toasts empilhados (skill `testar-toast-chakra-twygo`).
   */
  getReinscreverErrorToast(): Locator {
    return this.page
      .locator('.chakra-toast, [role="status"], [role="alert"]')
      .filter({ hasText: /Erro ao reinscrever/i })
      .first();
  }

  /**
   * Atalho semântico para asserts de presença/estado. Pré-condição:
   * menu já aberto via `openRowActionsMenu(email)`. Specs que precisam
   * só asserir presença/state devem usar `expectReinscreverButtonState`
   * (cuida do abrir/fechar do menu automaticamente).
   */
  getReinscreverButton(_email: string): Locator {
    return this.getReinscreverMenuItem();
  }

  /**
   * Abre o menu de ações da linha do aluno. Idempotente: se algum menu
   * já está aberto, retorna sem re-clicar (caller deve ter fechado o
   * anterior se quer abrir outro). Cobre case do MD passo 3 "Clicar
   * fora para fechar o menu e abrir o menu da linha do aluno (b)".
   */
  async openRowActionsMenu(email: string): Promise<void> {
    const anyMenu = this.page.getByRole('menu').first();
    if (await anyMenu.isVisible().catch(() => false)) {
      return;
    }
    const trigger = this.getRowActionsMenuTrigger(email);
    await trigger.waitFor({ state: 'visible', timeout: 10_000 });
    await trigger.click();
    await this.page
      .getByRole('menu')
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 });
  }

  /**
   * Fecha o menu de ações via tecla Escape — mais robusto que click em
   * body (que pode bater em overlay Chakra invisível). No-op se nenhum
   * menu está aberto.
   */
  async closeRowActionsMenu(): Promise<void> {
    const openMenu = this.page.getByRole('menu').first();
    if (await openMenu.isVisible().catch(() => false)) {
      await this.page.keyboard.press('Escape');
      await openMenu.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
    }
  }

  /**
   * Fluxo de negócio "clicar Reinscrever":
   *   1. Abre menu de ações da linha do aluno.
   *   2. Clica no item "Reinscrever".
   *
   * NÃO confirma o modal — caller decide (permite testar a UI do modal
   * antes de confirmar). Para o fluxo completo, ver `confirmReinscreverModal`.
   */
  async clickReinscrever(email: string): Promise<void> {
    await this.openRowActionsMenu(email);
    const item = this.getReinscreverMenuItem();
    await item.waitFor({ state: 'visible', timeout: 5_000 });
    await item.click();
  }

  /**
   * Modal Chakra "Confirmar reinscrição" — abre após `clickReinscrever`.
   *
   * REVISAR-FIGMA: header e body exatos pendentes. Regex casa "Confirmar
   * reinscrição" / "Reinscrição" no header pra robustez.
   */
  getConfirmReinscreverModal(): Locator {
    return this.page
      .getByRole('dialog')
      .filter({ hasText: /Confirmar reinscrição|Reinscrição/i })
      .first();
  }

  /**
   * Botão "Confirmar" / "Reinscrever" / "Sim" do modal de confirmação.
   * REVISAR-FIGMA: texto exato pendente.
   */
  getConfirmReinscreverButton(): Locator {
    return this.getConfirmReinscreverModal()
      .getByRole('button', { name: /^(Confirmar|Reinscrever|Sim)$/i })
      .first();
  }

  /**
   * Confirma o modal de reinscrição. Pré-condição: `clickReinscrever`
   * chamado antes (modal aberto). Aguarda o modal fechar (post-condition
   * do RN — toast aparece em seguida via `expectToastSuccess`).
   */
  async confirmReinscreverModal(): Promise<void> {
    const modal = this.getConfirmReinscreverModal();
    await modal.waitFor({ state: 'visible', timeout: 10_000 });
    await this.getConfirmReinscreverButton().click();
    await modal.waitFor({ state: 'hidden', timeout: 10_000 });
  }

  /**
   * Asserta o estado do item "Reinscrever" no menu da linha do aluno:
   *   - `enabled`: visível e não-disabled (aria-disabled !== 'true').
   *   - `disabled`: visível mas com aria-disabled='true' (Chakra Menu).
   *   - `absent`: item não está presente no menu (não renderiza).
   *
   * Abre o menu automaticamente e fecha ao final — caller não precisa
   * gerenciar o ciclo open/close do menu.
   */
  async expectReinscreverButtonState(
    email: string,
    state: 'enabled' | 'disabled' | 'absent',
  ): Promise<void> {
    await this.openRowActionsMenu(email);
    try {
      const item = this.getReinscreverMenuItem();
      if (state === 'absent') {
        await expect(item).toHaveCount(0);
        return;
      }
      await expect(item).toBeVisible({ timeout: 5_000 });
      const ariaDisabled = await item.getAttribute('aria-disabled');
      const playwrightDisabled = await item.isDisabled().catch(() => false);
      const isDisabled = ariaDisabled === 'true' || playwrightDisabled;
      if (state === 'enabled') {
        expect(isDisabled).toBe(false);
      } else {
        expect(isDisabled).toBe(true);
      }
    } finally {
      await this.closeRowActionsMenu();
    }
  }

  /**
   * Toast Chakra de sucesso pós-reinscrição individual.
   *
   * Padrão canônico `.first()` (skill `testar-toast-chakra-twygo`) —
   * toasts Chakra acumulam, strict-mode estoura sem `.first()`.
   *
   * REVISAR-FIGMA: texto exato pendente — regex casa "Reinscrição",
   * "reinscrito", "sucesso" pra resiliência.
   */
  getReinscreverToast(text: string | RegExp = /Reinscri|sucesso/i): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: text }).first();
  }

  async expectToastSuccess(): Promise<void> {
    const toast = this.getReinscreverToast();
    await expect(toast).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Badge de status do certificado/inscrição na linha do aluno
   * (Suite 02 TC3 valida badge "Pendente" pós-reinscrição).
   *
   * REVISAR-FIGMA: textos exatos do badge pendente — regex casa as
   * variantes conhecidas. Wrapper sobre `getStatusBadgeForParticipant`
   * que ancora por email.
   */
  getStatusCertificadoBadge(email: string): Locator {
    return this.getStatusBadgeForParticipant(email);
  }

  /**
   * Conta quantas linhas (`<tr>`) casam o e-mail informado. Útil pro
   * TC2: listagem padrão deve exibir apenas a inscrição com maior
   * `recertification_number` (count === 1); após filtro de histórico,
   * deve exibir todas (count > 1).
   */
  async countRowsForEmail(email: string): Promise<number> {
    return await this.page.locator('tbody tr').filter({ hasText: email }).count();
  }

  /**
   * Tooltip exibido ao posicionar o cursor sobre o item "Reinscrever"
   * desabilitado (Suite 02 TC4 + RN 4.2).
   *
   * REVISAR-FIGMA: texto exato pendente — Suite 02 TC4 passo 4 indica
   * "conteúdo não permite reinscrição" como provável.
   */
  getReinscreverDisabledTooltip(): Locator {
    return this.page.getByRole('tooltip').first();
  }
}
