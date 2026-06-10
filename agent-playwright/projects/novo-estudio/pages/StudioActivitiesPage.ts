import { expect, type Locator, type Page } from '@playwright/test';
import { safeGoto, dismissCommonModals } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Page Object da aba "Atividades" do Estúdio de Criação (tela única, 3 colunas).
 *
 * Rota REAL: /o/{orgId}/contents/{contentId}/edit?tab=studio
 * (a AT documenta /events/:id/edit/studio — desatualizado; ver
 * inputs/recon-listar-atividades-cards-badges-scroll.md).
 *
 * Test-ids canônicos catalogados no recon (atributo `data-test-id`).
 */
export class StudioActivitiesPage {
  constructor(private readonly page: Page) {}

  async goto(contentId: number | string): Promise<void> {
    const url = `/o/${getOrgId()}/contents/${contentId}/edit?tab=studio`;
    // O SPA do Estúdio às vezes carrega o shell mas não hidrata o painel de 3
    // colunas (intermitente — backend/load, não só contenção). Reload passa a
    // janela. Retry transparente (skill criar-spec-resiliente-twygo) — 5
    // tentativas, dismiss de modais a cada uma, antes de falhar de fato.
    const ATTEMPTS = 5;
    for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
      try {
        // safeGoto DENTRO do try: o SPA às vezes auto-redireciona durante o load
        // ("interrupted by another navigation to <mesma url>") — erro transitório
        // que deve apenas re-tentar, não falhar a suíte (run 2026-06-05).
        await safeGoto(this.page, url);
        await dismissCommonModals(this.page);
        await this.list.waitFor({ state: 'visible', timeout: 18_000 });
        return;
      } catch {
        if (attempt === ATTEMPTS) {
          throw new Error(`Painel do Estúdio não hidratou após ${ATTEMPTS} tentativas em ${url}`);
        }
        await this.page.waitForTimeout(1000);
      }
    }
  }

  // --- Containers / layout ---
  get threeColumnShell(): Locator {
    return this.page.getByTestId('creation-studio-three-column-shell');
  }
  get list(): Locator {
    return this.page.getByTestId('creation-studio-activities-list');
  }
  get listTitle(): Locator {
    return this.page.getByTestId('creation-studio-activities-list-title');
  }
  get scrollArea(): Locator {
    return this.page.getByTestId('creation-studio-activities-list-scroll');
  }
  /** Botão "Recolher lista de atividades" — só existe quando a lista está expandida. */
  get collapseButton(): Locator {
    return this.page.getByTestId('creation-studio-activities-list-collapse');
  }
  /** Botão "Expandir lista de atividades" — só existe quando a lista está recolhida. */
  get expandButton(): Locator {
    return this.page.getByRole('button', { name: 'Expandir lista de atividades' });
  }
  get addButton(): Locator {
    return this.page.getByTestId('creation-studio-activity-add-button');
  }
  get jumpToInput(): Locator {
    return this.page.getByTestId('creation-studio-activities-jump-to-input');
  }
  get jumpToSubmit(): Locator {
    return this.page.getByTestId('creation-studio-activities-jump-to-submit');
  }

  // --- Cards ---
  /**
   * Cards de atividade. O test-id do card raiz é
   * `creation-studio-activity-card-{idNumerico}` — uso regex de id numérico
   * para NÃO capturar `-drag-handle` (que também tem role=button + prefixo) nem
   * o wrapper `-sortable-{id}`.
   */
  get cards(): Locator {
    return this.page.getByTestId(/^creation-studio-activity-card-\d+$/);
  }
  card(activityId: number | string): Locator {
    return this.page.getByTestId(`creation-studio-activity-card-${activityId}`);
  }

  // sub-locators escopados a um card (passe o Locator do card)
  dragHandle(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-drag-handle');
  }
  position(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-position');
  }
  checkbox(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-checkbox');
  }
  /** O <input type=checkbox> real (visualmente oculto) — use para toBeChecked. */
  checkboxInput(card: Locator): Locator {
    return card.getByRole('checkbox');
  }
  /** Marca/desmarca a seleção do card (clica o label do checkbox). */
  async toggleSelect(card: Locator): Promise<void> {
    await this.checkbox(card).click();
  }
  title(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-title');
  }
  type(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-type');
  }
  statusReleased(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-status-released');
  }
  statusLocked(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-status-locked');
  }

  // --- Badges de etapa / artefatos pendentes (recon 2026-06-05) ---
  /** Badge consolidado "N pendentes" do card (abre o popover ao clicar). */
  pendingBadge(card: Locator): Locator {
    return card.getByTestId('studio-pending-artifacts-badge');
  }
  /**
   * Popover de pendências ABERTO. Há 1 elemento por card pendente no DOM
   * (mesmo test-id), mas só um fica visível por vez — mira o visível com `:visible`
   * para evitar strict-mode quando há múltiplas atividades pendentes.
   */
  get pendingPopover(): Locator {
    return this.page.locator('[data-test-id="studio-pending-artifacts-popover"]:visible');
  }
  /** Linha do popover ABERTO por etapa (escopada ao popover visível). */
  pendingRow(key: string): Locator {
    return this.pendingPopover.getByTestId(`studio-pending-artifacts-row-${key}`);
  }
  get copilotDrawer(): Locator {
    return this.page.getByTestId('copilot-drawer');
  }

  // --- Copiloto / card de validação de geração IA (recon 2026-06-05) ---
  // ⚠️ Clicar numa linha do popover (pendingRow) DISPARA a geração real (o
  // copiloto checa pré-requisitos e enfileira a task — não há confirm-first).
  // Ver inputs/recon-gerar-conteudo-ia.md.
  get copilotDrawerClose(): Locator {
    return this.page.getByTestId('copilot-drawer-close');
  }
  /**
   * Mensagem de validação MAIS RECENTE no thread do copiloto. O thread é por
   * usuário×curso e ACUMULA cards de gerações anteriores (inclusive de
   * atividades já excluídas) — escopar tudo ao último wrapper evita strict-mode
   * "resolved to N elements" (validado no run 2026-06-05). Cada card vive num
   * wrapper `studio-copilot-validation-message-{uuid}`; o disparo atual é o último.
   */
  get latestValidationMessage(): Locator {
    return this.page.locator('[data-test-id^="studio-copilot-validation-message-"]').last();
  }
  /** Card de validação da etapa MAIS RECENTE (aparece após o disparo). */
  get validationCard(): Locator {
    return this.latestValidationMessage.getByTestId('studio-copilot-validation-card');
  }
  /** Corpo do card de validação por etapa (`roteiro`, `slides`, ...) — no card atual. */
  validationBody(stage: string): Locator {
    return this.latestValidationMessage.getByTestId(`studio-copilot-validation-body-${stage}`);
  }
  get validationApprove(): Locator {
    return this.latestValidationMessage.getByTestId('studio-copilot-validation-approve');
  }
  get validationRegenerate(): Locator {
    return this.latestValidationMessage.getByTestId('studio-copilot-validation-regenerate');
  }
  get validationReject(): Locator {
    return this.latestValidationMessage.getByTestId('studio-copilot-validation-reject');
  }

  /**
   * Fecha o drawer do copiloto se estiver aberto. OBRIGATÓRIO antes de voltar a
   * interagir com a lista — o portal `aui-thread-viewport` do copiloto
   * intercepta pointer events nos cards (validado no recon 2026-06-05).
   */
  async closeCopilotIfOpen(): Promise<void> {
    if (await this.copilotDrawerClose.isVisible().catch(() => false)) {
      await this.copilotDrawerClose.click().catch(() => {});
      await this.copilotDrawer.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
    }
  }

  /**
   * Dispara a geração de uma etapa via popover de pendências.
   * ⚠️ EFEITO REAL: enfileira a task de geração no backend. Use apenas para
   * etapas baratas (roteiro = texto) e NUNCA aprove em seguida (aprovar
   * cascateia para slides/imagem/áudio). O chamador deve limpar a seed.
   * Retorna após o card de validação ficar visível (não espera a conclusão).
   */
  async triggerStageGeneration(card: Locator, stage: string): Promise<void> {
    await this.openPendingPopover(card);
    await this.pendingRow(stage).click();
    await expect(this.copilotDrawer).toBeVisible();
    await this.validationBody(stage).first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  // --- Preview: barra de ações de geração (recon 2026-06-05) ---
  get previewPane(): Locator {
    return this.page.getByTestId('creation-studio-preview-pane');
  }
  get previewTitle(): Locator {
    return this.page.getByTestId('creation-studio-preview-title');
  }
  /** Botão "Concluir geração com IA" (aria-label "...inteligência artificial"). */
  get previewCompleteWithAI(): Locator {
    return this.page.getByTestId('creation-studio-preview-complete-with-ai');
  }
  /** Botão "Bloquear atividade" (toggle de status no preview). */
  get previewToggleStatus(): Locator {
    return this.page.getByTestId('creation-studio-preview-toggle-status');
  }

  /** Abre o popover de pendências (click no badge consolidado). */
  async openPendingPopover(card: Locator): Promise<void> {
    const badge = this.pendingBadge(card);
    await badge.scrollIntoViewIfNeeded();
    await badge.click();
    await expect(this.pendingPopover).toBeVisible();
  }
  toggleChildren(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-toggle-children');
  }
  /** Badge "· N sub-atividades" (apenas o rótulo de contagem). */
  subActivitiesBadge(card: Locator): Locator {
    return card.getByTestId('creation-studio-activity-card-sub-activities');
  }

  /** Container real das sub-atividades (árvore com numeração X.Y). */
  childrenContainer(activityId: number | string): Locator {
    return this.page.getByTestId(`creation-studio-activity-children-${activityId}`);
  }

  // --- Ações ---
  /** Contagem exibida no título "Atividades (N)". Retorna N ou null. */
  async titleCount(): Promise<number | null> {
    const txt = (await this.listTitle.textContent())?.trim() ?? '';
    const m = txt.match(/\((\d+)\)/);
    return m ? Number(m[1]) : null;
  }

  /** Pula para a atividade de posição informada via componente "Ir para". */
  async jumpTo(position: number): Promise<void> {
    await this.jumpToInput.fill(String(position));
    await this.jumpToSubmit.click();
  }

  /** Recolhe a lista de atividades (clica "Recolher"). */
  async collapseList(): Promise<void> {
    // Modais oportunistas (NPS, beta-end) podem interceptar o click — dismiss
    // defensivo antes (skill fechar-modais-twygo / tratar-modal-beta-end-twygo).
    await dismissCommonModals(this.page);
    await this.collapseButton.click();
  }

  /** Expande a lista de atividades (clica "Expandir" — botão distinto do recolher). */
  async expandList(): Promise<void> {
    await dismissCommonModals(this.page);
    await this.expandButton.click();
  }

  /** Expande as sub-atividades de um card (se houver toggle). */
  async expandChildren(card: Locator): Promise<void> {
    await this.toggleChildren(card).click();
  }

  // --- Criação / exclusão de atividade ---
  get typeSelectorDrawer(): Locator {
    return this.page.getByTestId('creation-studio-type-selector-drawer');
  }
  get pageForm(): Locator {
    return this.page.getByTestId('studio-activity-form-page');
  }
  get pageSaveButton(): Locator {
    return this.page.getByTestId('creation-studio-activity-page-save');
  }

  /** Card cujo título contém o texto informado. */
  cardByTitle(title: string): Locator {
    return this.cards.filter({ hasText: title });
  }

  /**
   * Cria uma atividade do tipo "Página". OBS: clicar no tipo já cria a
   * atividade ("Nova atividade") imediatamente; o form edita a recém-criada.
   */
  async addPageActivity(title: string): Promise<void> {
    await dismissCommonModals(this.page);
    await this.addButton.click();
    await this.typeSelectorDrawer.waitFor({ state: 'visible' });
    await this.page.getByTestId('creation-studio-type-selector-page').click();
    await this.pageForm.waitFor({ state: 'visible' });
    await this.pageForm.locator('input[name="title"]').fill(title);
    await this.pageSaveButton.click();
    await expect(this.cardByTitle(title).first()).toBeVisible();
  }

  /**
   * Cria uma atividade-seed de qualquer tipo (lesson/page/text/...). Selecionar
   * o tipo já cria a atividade (autosave); preencher o título a identifica.
   * Volta à lista (o beforeunload do editor deve ser aceito por um handler
   * `page.on('dialog', d => d.accept())` registrado pelo chamador).
   * Atividades novas têm etapas PENDENTES → renderizam o badge de pendências.
   */
  async seedActivity(contentId: number | string, type: string, title: string): Promise<void> {
    await dismissCommonModals(this.page);
    await this.addButton.click();
    await this.page.getByTestId(`creation-studio-type-selector-${type}`).click();
    const titleInput = this.page.locator('input[name="title"]').first();
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.fill(title);
    await this.page.waitForTimeout(800);
    // Persistir o TÍTULO: o autosave cria a atividade como "Nova atividade", mas
    // o título digitado só persiste ao Salvar (validado: Lesson não persistia o
    // título sem save). Botão varia por tipo → "Salvar" habilitado, com fallback.
    const save = this.page
      .getByRole('button', { name: /^Salvar$/ })
      .and(this.page.locator('button:enabled'));
    if (await save.count()) {
      await save.first().click().catch(() => {});
    } else {
      await this.pageSaveButton.click().catch(() => {});
    }
    await this.page.waitForTimeout(1500);
    await this.goto(contentId);
    await expect(this.cardByTitle(title).first()).toBeVisible({ timeout: 15_000 });
  }

  // --- Preview / exclusão (fluxo validado via MCP 2026-06-03) ---
  get previewDeleteButton(): Locator {
    return this.page.getByTestId('creation-studio-preview-delete');
  }
  get previewDeleteDialog(): Locator {
    return this.page.getByTestId('creation-studio-preview-delete-dialog');
  }

  get previewEditButton(): Locator {
    return this.page.getByTestId('creation-studio-preview-edit');
  }

  /** Abre a atividade no preview central (clica o título do card). */
  async openActivity(card: Locator): Promise<void> {
    await card.scrollIntoViewIfNeeded();
    await this.title(card).click();
  }

  /** Card top-level cuja posição numérica == n (ex.: "2"). */
  cardAtPosition(n: number | string): Locator {
    return this.cards.filter({
      has: this.page
        .getByTestId('creation-studio-activity-card-position')
        .filter({ hasText: new RegExp(`^${n}$`) }),
    });
  }

  /** Adiciona uma Página com uma atividade previamente SELECIONADA (insere logo após). */
  async addPageActivityAfter(selectedCard: Locator, title: string): Promise<void> {
    await selectedCard.scrollIntoViewIfNeeded();
    await this.toggleSelect(selectedCard);
    await this.addPageActivity(title);
  }

  /**
   * Reordena via drag-and-drop dnd-kit. `dragTo` simples NÃO funciona com
   * dnd-kit (sensores de pointer) — é preciso pointerdown + moves em PASSOS
   * além do threshold de ativação + pointerup (validado 2026-06-03: dragTo não
   * reordenou).
   */
  async reorderByDrag(fromCard: Locator, toCard: Locator): Promise<void> {
    const handle = this.dragHandle(fromCard);
    await handle.scrollIntoViewIfNeeded();
    const hb = await handle.boundingBox();
    const tb = await toCard.boundingBox();
    if (!hb || !tb) throw new Error('boundingBox nulo no reorderByDrag');
    const cx = hb.x + hb.width / 2;
    const cy = hb.y + hb.height / 2;
    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    // ultrapassar o activation constraint do dnd-kit antes de mover ao alvo
    await this.page.mouse.move(cx, cy + 12, { steps: 4 });
    await this.page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 12 });
    await this.page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2 + 8, { steps: 4 });
    await this.page.mouse.up();
  }

  /** Edita o título de uma atividade Página (abrir → Editar → alterar → Salvar). */
  async editPageTitle(card: Locator, newTitle: string): Promise<void> {
    await this.openActivity(card);
    await this.previewEditButton.click();
    await this.pageForm.waitFor({ state: 'visible' });
    await this.pageForm.locator('input[name="title"]').fill(newTitle);
    await this.pageSaveButton.click();
  }

  /**
   * Exclui a atividade pelo título. Fluxo REAL (NÃO é checkbox+bulk):
   * abrir no preview → "Excluir" do preview (`creation-studio-preview-delete`,
   * habilita só com atividade aberta) → CONFIRMAR no dialog
   * `creation-studio-preview-delete-dialog`.
   *
   * ⚠️ A AT (TC18) diz "sem confirmação extra", mas o produto EXIGE confirmação
   * ("Esta ação não pode ser desfeita") — divergência a REVISAR com o AT.
   */
  async deleteActivityByTitle(title: string): Promise<void> {
    const card = this.cardByTitle(title).first();
    await this.openActivity(card);
    await expect(this.previewDeleteButton).toBeEnabled();
    await this.previewDeleteButton.click();
    await expect(this.previewDeleteDialog).toBeVisible();
    await this.previewDeleteDialog.getByRole('button', { name: 'Excluir' }).click();
    await expect(this.cardByTitle(title)).toHaveCount(0, { timeout: 15_000 });
  }

  /** Variant tolerante a falha para cleanup (afterEach/afterAll). */
  async deleteActivityByTitle_safe(title: string): Promise<void> {
    try {
      if ((await this.cardByTitle(title).count()) > 0) {
        await this.deleteActivityByTitle(title);
      }
    } catch {
      /* cleanup best-effort — não falhar o teardown */
    }
  }
}
