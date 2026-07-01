import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { RegistrosAdminPage } from './RegistrosAdminPage.js';
import type { KpiStatus } from './MeuHistoricoPage.js';

export type BatchAction = 'Aprovar registros' | 'Recusar registros' | 'Excluir registros';

/**
 * Page Object da suíte "Ações em massa (elegibilidade, escopos e toasts com ratio)".
 *
 * COMPÕE {@link RegistrosAdminPage} (navegação Admin + KPIs com gate de hidratação)
 * e acrescenta os fluxos do drawer de ações em massa.
 *
 * ## Estrutura real do drawer (recon ao vivo 2026-06-23 — ver
 * `inputs/recon-acoes-em-massa-elegibilidade-escopos-toasts.md`)
 * Várias premissas da AT NÃO batem com o BETA implementado; os métodos abaixo
 * refletem o PRODUTO real (divergências comentadas em cada ponto, // REVISAR):
 *  - "Ação*" é `<select>` nativo com default VAZIO (sem ação pré-selecionada).
 *  - Grupo "Opção de envio*" com radios "Selecionados" / "Todos do filtro atual"
 *    SEM contagem `(N)`/`(M)`; "Selecionados" vem checked/default e NÃO é
 *    desabilitado mesmo com 0 marcados (AT supõe disabled + tooltip).
 *  - Recusar revela textarea "Justificativa*" INLINE no drawer (não um modal à parte).
 *  - "Executar" abre modal "Confirmação de ação em massa" com a regra de
 *    elegibilidade no texto; o resultado é toast GENÉRICO assíncrono (sem o
 *    ratio "X aprovados (Y ignorados)" da AT). Validação real = delta de KPI.
 */
export class AcoesEmMassaPage {
  readonly base: RegistrosAdminPage;

  constructor(private readonly page: Page) {
    this.base = new RegistrosAdminPage(page);
  }

  // ---- Navegação + KPIs (delegado) ----

  goto(): Promise<void> {
    return this.base.goto();
  }

  expectLoaded(): Promise<void> {
    return this.base.expectLoaded();
  }

  getCount(status: KpiStatus): Promise<number> {
    return this.base.getCount(status);
  }

  /** Vai para o layout embarcado do Aluno (sem ações administrativas na toolbar). */
  async gotoAlunoLayout(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/records?in_use_mode_layout=true`);
    await expect(this.page.getByTestId('tab-records-tab')).toBeVisible({ timeout: 20_000 });
  }

  /** Re-hidrata os cards após o batch (assíncrono — não atualiza ao vivo). */
  async expectCount(status: KpiStatus, target: number, timeout = 30_000): Promise<void> {
    await expect
      .poll(async () => this.getCount(status), { timeout, message: `card ${status} → ${target}` })
      .toBe(target);
  }

  // ---- Toolbar ----

  massButton(): Locator {
    return this.page.getByRole('button', { name: /Ações em massa/i });
  }

  // ---- Linhas / seleção ----

  allRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  rowByContent(marker: string): Locator {
    return this.allRows().filter({ hasText: marker });
  }

  rowCheckbox(row: Locator): Locator {
    return row.locator('input[type="checkbox"]').first();
  }

  headerCheckbox(): Locator {
    return this.page.locator('table thead input[type="checkbox"]').first();
  }

  /** Estado tri-state do checkbox "selecionar todos". */
  async headerCheckboxIndeterminate(): Promise<boolean> {
    return this.headerCheckbox().evaluate((el: HTMLInputElement) => el.indeterminate);
  }

  async selectRow(row: Locator): Promise<void> {
    await this.rowCheckbox(row).check({ force: true });
  }

  /** Marca os registros cujos conteúdos contêm os markers dados (1 linha cada). */
  async selectRowsByMarkers(markers: string[]): Promise<void> {
    for (const m of markers) {
      const row = this.rowByContent(m).first();
      await expect(row).toBeVisible({ timeout: 10_000 });
      await this.selectRow(row);
    }
  }

  /** Marca até `count` linhas com situação "Emitido" (inelegíveis p/ Aprovar). */
  async selectEmittedRows(count: number, excludeMarker = ''): Promise<number> {
    let rows = this.allRows().filter({ hasText: /Emitido/i });
    if (excludeMarker) rows = rows.filter({ hasNotText: excludeMarker });
    const total = await rows.count();
    const pick = Math.min(count, total);
    for (let i = 0; i < pick; i++) await this.selectRow(rows.nth(i));
    return pick;
  }

  async countCheckedRows(): Promise<number> {
    const cbs = this.allRows().locator('input[type="checkbox"]');
    const n = await cbs.count();
    let checked = 0;
    for (let i = 0; i < n; i++) if (await cbs.nth(i).isChecked().catch(() => false)) checked++;
    return checked;
  }

  // ---- Drawer ----

  drawer(): Locator {
    return this.page.locator('.chakra-modal__content.chakra-slide').first();
  }

  async openDrawer(): Promise<void> {
    await this.massButton().click();
    await expect(this.drawer()).toBeVisible({ timeout: 10_000 });
    await expect(this.actionSelect()).toBeVisible({ timeout: 8_000 });
  }

  /** Fecha o drawer pelo botão X (preserva a seleção das linhas). */
  async closeDrawerX(): Promise<void> {
    const x = this.drawer().locator('button.chakra-modal__close-btn').first();
    if (await x.isVisible().catch(() => false)) await x.click();
    else await this.drawer().getByRole('button', { name: /fechar|close/i }).first().click();
    await expect(this.drawer()).toBeHidden({ timeout: 10_000 });
  }

  actionSelect(): Locator {
    return this.drawer().locator('select').first();
  }

  async actionOptions(): Promise<string[]> {
    return this.actionSelect().locator('option').allInnerTexts();
  }

  async selectAction(action: BatchAction): Promise<void> {
    await this.actionSelect().selectOption({ label: action });
  }

  scopeRadios(): Locator {
    return this.drawer().locator('input[type="radio"]');
  }

  scopeRadioSelecionados(): Locator {
    return this.scopeRadios().nth(0);
  }

  scopeRadioTodos(): Locator {
    return this.scopeRadios().nth(1);
  }

  async chooseScopeSelecionados(): Promise<void> {
    await this.scopeRadioSelecionados().check({ force: true });
  }

  async chooseScopeTodos(): Promise<void> {
    await this.scopeRadioTodos().check({ force: true });
  }

  /** Textarea de justificativa que aparece INLINE ao escolher "Recusar registros". */
  justificativaTextarea(): Locator {
    return this.drawer().locator('textarea').first();
  }

  executarButton(): Locator {
    return this.drawer().getByRole('button', { name: /^Executar$/i });
  }

  cancelarButton(): Locator {
    return this.drawer().getByRole('button', { name: /^Cancelar$/i });
  }

  /** Banner amarelo de "sem elegíveis" que a AT supõe (não existe no BETA). */
  drawerAlert(): Locator {
    return this.drawer().locator('[role="alert"], .chakra-alert');
  }

  // ---- Modal de confirmação ----

  confirmModal(): Locator {
    return this.page
      .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
      .filter({ hasText: /Confirmação de ação em massa|Tem certeza que deseja executar/i })
      .last();
  }

  async confirmModalText(): Promise<string> {
    return (await this.confirmModal().innerText()).replace(/\s+/g, ' ').trim();
  }

  async confirmExecution(): Promise<void> {
    await this.confirmModal().getByRole('button', { name: /^Confirmar$/i }).click();
  }

  // ---- Fluxos compostos (Executar → Confirmar → toast genérico) ----

  /**
   * Clica "Executar", confirma no modal e devolve o texto agregado dos toasts.
   * O batch é assíncrono: toast genérico ("...em andamento" → "...concluída").
   */
  async executarEConfirmar(): Promise<string> {
    await this.executarButton().click();
    await expect(this.confirmModal()).toBeVisible({ timeout: 10_000 });
    await this.confirmExecution();
    const toast = this.getToast(/andamento|conclu|aprovad|recusad|exclu/i);
    await toast.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined);
    const done = this.getToast(/conclu/i);
    await done.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => undefined);
    return (await this.page.locator('.chakra-toast').allInnerTexts().catch(() => []))
      .join(' | ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ---- Toasts (ver skill testar-toast-chakra-twygo) ----

  getToast(text: RegExp | string): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: text }).first();
  }

  async waitForToastsToClear(timeout = 5_000): Promise<void> {
    const toast = this.page.locator('.chakra-toast').first();
    if (await toast.isVisible().catch(() => false)) {
      await toast.waitFor({ state: 'hidden', timeout }).catch(() => undefined);
    }
  }
}
