import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { RegistrosAdminPage } from './RegistrosAdminPage.js';
import type { KpiStatus } from './MeuHistoricoPage.js';

/**
 * Ações administrativas da tela "Aprendizagem > Registros" para a suíte
 * "Atualização de KPIs em tempo real": avaliar (aprovar/recusar), editar,
 * excluir, ações em massa e o form de Adicionar.
 *
 * COMPÕE {@link RegistrosAdminPage} (POM canônico da tela Admin) para navegação
 * e leitura dos KPIs — herdando o retry de carga + o gate de hidratação
 * (`waitForCountsHydrated`: os cards renderizam com "0" e só populam após
 * `records/stats`, >10s; ler antes disso dá falso-vermelho). Esta classe só
 * acrescenta os fluxos de AÇÃO, que são exclusivos desta suíte.
 *
 * Seletores validados em recon ao vivo 2026-06-22 — ver
 * `inputs/recon-atualizacao-de-kpis-em-tempo-real-acoes-expiracao-e-batch.md`.
 */
export class AdminRegistrosPage {
  private readonly base: RegistrosAdminPage;

  constructor(private readonly page: Page) {
    this.base = new RegistrosAdminPage(page);
  }

  // ---- Navegação + KPIs (delegado ao POM canônico com gate de hidratação) ----

  goto(): Promise<void> {
    return this.base.goto();
  }

  expectLoaded(): Promise<void> {
    return this.base.expectLoaded();
  }

  getCount(status: KpiStatus): Promise<number> {
    return this.base.getCount(status);
  }

  getCounts(): Promise<Record<KpiStatus, number>> {
    return this.base.getCounts();
  }

  /**
   * Espera o número de um card atingir o valor alvo SEM navegação manual (o app
   * re-renderiza a faixa após a ação + toast). Cobre "atualiza sem reload"
   * (RN 32). Timeout largo porque a re-hidratação do stats também é assíncrona.
   */
  async expectCount(status: KpiStatus, target: number, timeout = 30_000): Promise<void> {
    await expect
      .poll(async () => this.getCount(status), { timeout, message: `card ${status} → ${target}` })
      .toBe(target);
  }

  // ---- Linhas e menu de ações ----

  /** Linha cuja célula de conteúdo contém o marker (texto único do registro). */
  rowByContent(marker: string): Locator {
    return this.page.locator('table tbody tr').filter({ hasText: marker });
  }

  kebabForRow(row: Locator): Locator {
    return row.locator('[data-test-id$="-actions-kebab"]').first();
  }

  /**
   * Abre o kebab da linha e devolve o menu ABERTO escopado.
   * Chakra monta o menu de TODAS as linhas no DOM; `getByRole('menuitem')` global
   * é ambíguo. O kebab aberto expõe `aria-controls` apontando pro id do menu —
   * escopamos por `[id="..."]` (o id contém `:`, então `#` quebra).
   */
  async openRowMenu(row: Locator): Promise<Locator> {
    const kebab = this.kebabForRow(row);
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();
    const menuId = await kebab.getAttribute('aria-controls');
    const menu = menuId
      ? this.page.locator(`[id="${menuId}"]`)
      : this.page.locator('[role="menu"]').last();
    await expect(menu.getByRole('menuitem').first()).toBeVisible({ timeout: 8_000 });
    return menu;
  }

  async clickRowMenuItem(row: Locator, name: RegExp | string): Promise<void> {
    const menu = await this.openRowMenu(row);
    await menu.getByRole('menuitem', { name }).first().click();
  }

  // ---- Avaliar (Aprovar / Recusar) ----

  approveButton(): Locator {
    return this.page.getByTestId('record-form-approve-button');
  }

  rejectButton(): Locator {
    return this.page.getByTestId('record-form-reject-button');
  }

  /** Abre o form "Avaliar" da linha (rota `?mode=admin-avaliar`). */
  async openEvaluate(row: Locator): Promise<void> {
    await this.clickRowMenuItem(row, /Avaliar/);
    await this.page.waitForURL(/mode=admin-avaliar/, { timeout: 15_000 });
    await expect(this.approveButton()).toBeVisible({ timeout: 15_000 });
  }

  /** No form Avaliar, aprova o registro. Volta para a lista. */
  async approve(): Promise<void> {
    await this.approveButton().click();
    await this.page.waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), {
      timeout: 15_000,
    });
    await this.expectLoaded();
  }

  /** No form Avaliar, recusa com justificativa (modal "Recusar registro"). */
  async reject(justificativa: string): Promise<void> {
    await this.rejectButton().click();
    const modal = this.page
      .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
      .filter({ hasText: /Recusar registro/i })
      .first();
    await expect(modal).toBeVisible({ timeout: 10_000 });
    await modal.locator('textarea').first().fill(justificativa);
    await modal.getByRole('button', { name: /Recusar registro/i }).click();
    await expect(modal).toBeHidden({ timeout: 10_000 });
    await this.page
      .waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), { timeout: 15_000 })
      .catch(() => undefined);
    await this.expectLoaded();
  }

  // ---- Editar ----

  saveButton(): Locator {
    return this.page.getByTestId('record-form-save-button');
  }

  /** Abre o form de edição (kebab → Editar) e espera o form carregar. */
  async openEdit(row: Locator): Promise<void> {
    await this.clickRowMenuItem(row, /Editar/);
    await this.page.waitForURL(/\/edit/, { timeout: 15_000 });
    await expect(this.saveButton()).toBeVisible({ timeout: 15_000 });
  }

  /** Define a Data de validade (formato yyyy-mm-dd p/ input date) e salva. */
  async setExpirationAndSave(isoDate: string): Promise<void> {
    await this.page.locator('input[name="expirationDate"]').first().fill(isoDate);
    await this.saveButton().click();
    await this.page
      .waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), { timeout: 15_000 })
      .catch(() => undefined);
    await this.expectLoaded();
  }

  // ---- Excluir ----

  /**
   * Exclui a linha: kebab → Excluir → modal de confirmação → botão de confirmar.
   * IMPORTANTE: só registros ELEGÍVEIS (Emitido/Recusado/Expirado) são
   * excluíveis — em Pendente o item "Excluir" fica desabilitado (com tooltip
   * explicativo) e nenhum click o aciona. Passe sempre uma linha elegível.
   */
  async deleteRow(row: Locator): Promise<void> {
    const menu = await this.openRowMenu(row);
    // O menuitem "Excluir" tem um tooltip que sobrepõe e intercepta o pointer
    // (click real não chega ao handler; dispatchEvent só de 'click' também não
    // dispara — o handler reage à sequência de pointer). Escondemos tooltips
    // (e o chat widget) via CSS p/ o click real cair no item — padrão hideChatWidget.
    await this.page
      .addStyleTag({
        content:
          '[role="tooltip"], .chakra-tooltip, #hubspot-messages-iframe-container { display:none !important; pointer-events:none !important; }',
      })
      .catch(() => undefined);
    await menu.getByRole('menuitem', { name: /Excluir/ }).first().click();
    const modal = this.page
      .locator('[role="alertdialog"], [role="dialog"], .chakra-modal__content')
      .filter({ hasText: /Excluir registro|desfeita|Tem certeza|Confirmação/i })
      .first();
    await expect(modal).toBeVisible({ timeout: 10_000 });
    await modal.getByRole('button', { name: /^Excluir$|Confirmar/i }).first().click();
    await expect(modal).toBeHidden({ timeout: 10_000 });
  }

  // ---- Ações em massa ----

  rowCheckbox(row: Locator): Locator {
    return row.locator('input[type="checkbox"]').first();
  }

  async selectRow(row: Locator): Promise<void> {
    await this.rowCheckbox(row).check({ force: true });
  }

  /**
   * Seleciona até `count` linhas de registros já Emitidos (situação "Emitido"),
   * excluindo as que contêm `excludeMarker`. Usado no batch parcial (TC7): esses
   * registros são INELEGÍVEIS para "Aprovar" → entram no ratio "ignorados" sem
   * sofrer mutação. Devolve quantas linhas foram efetivamente marcadas.
   */
  async selectEmittedRows(count: number, excludeMarker: string): Promise<number> {
    const rows = this.page
      .locator('table tbody tr')
      .filter({ hasText: /Emitido/i })
      .filter({ hasNotText: excludeMarker });
    const total = await rows.count();
    const pick = Math.min(count, total);
    for (let i = 0; i < pick; i++) await this.selectRow(rows.nth(i));
    return pick;
  }

  batchButton(): Locator {
    return this.page.getByRole('button', { name: /Ações em massa/i });
  }

  batchDrawer(): Locator {
    return this.page.locator('.chakra-modal__content.chakra-slide');
  }

  async openBatchDrawer(): Promise<void> {
    await this.batchButton().click();
    await expect(this.batchDrawer()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * No drawer de ações em massa: seleciona "Aprovar registros" (campo "Ação" é
   * <select> nativo, obrigatório e SEM default), garante o escopo "Selecionados",
   * clica "Executar" e confirma no modal "Confirmação de ação em massa".
   *
   * A aprovação em massa é ASSÍNCRONA: o produto emite toasts genéricos
   * ("Registros aprovados em andamento" → "Ação em massa concluída"), NÃO um
   * toast com o ratio "N aprovados (M ignorados)" que a AT supunha. Por isso a
   * validação real é o DELTA do KPI (feita no spec); aqui só disparamos a ação e
   * esperamos a conclusão. Devolve o texto do(s) toast(s).
   * (UI usa "Executar"; a AT diz "Aplicar" — divergência registrada no recon.)
   */
  async applyBatchApprove(): Promise<string> {
    const drawer = this.batchDrawer();
    const select = drawer.locator('select').first();
    const labels = await select.locator('option').allInnerTexts();
    const target = labels.find((l) => /aprovar/i.test(l));
    if (target) await select.selectOption({ label: target });
    const scope = drawer.getByText('Selecionados', { exact: false }).first();
    if (await scope.isVisible().catch(() => false)) await scope.click().catch(() => undefined);
    await drawer.getByRole('button', { name: /Executar|Aplicar/i }).click();
    const confirm = this.page
      .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
      .filter({ hasText: /Confirmação de ação em massa|Tem certeza/i })
      .first();
    if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await confirm.getByRole('button', { name: /Confirmar/i }).click();
    }
    // Toast de disparo (em andamento) e, quando aparecer, o de conclusão.
    const toast = this.getToast(/aprovad|andamento|conclu/i);
    await expect(toast).toBeVisible({ timeout: 15_000 });
    const done = this.getToast(/conclu/i);
    await done.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => undefined);
    return (await this.page.locator('.chakra-toast').allInnerTexts().catch(() => []))
      .join(' | ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ---- Form Adicionar (UI create — usado pelo TC1) ----

  /** Clica "Adicionar" na lista e espera o form de novo registro carregar. */
  async openAddForm(): Promise<void> {
    await this.page.getByRole('button', { name: /^Adicionar$/ }).first().click();
    await this.page.waitForURL(/\/records\/new/, { timeout: 15_000 });
    await expect(this.saveButton()).toBeVisible({ timeout: 15_000 });
  }

  /** Seleciona uma pessoa pelo drawer "Vincular pessoas" (busca + 1º resultado). */
  private async pickPerson(query: string): Promise<void> {
    await this.page.getByTestId('people-selector-input').click();
    const search = this.page.getByTestId('resource-selector-drawer-search-input');
    await search.waitFor({ timeout: 10_000 });
    await search.fill(query);
    const firstCheckbox = this.page.locator('[data-test-id^="people-selector-checkbox-"]').first();
    await expect(firstCheckbox).toBeVisible({ timeout: 10_000 });
    await firstCheckbox.click({ force: true });
    await this.page.getByTestId('resource-selector-drawer-confirm-button').click();
  }

  /**
   * Preenche um campo react-select (Provedor/Conteúdo/Tipo/Categorias) por label.
   * Espera o menu popular e commita a opção FOCADA via Enter — funciona tanto
   * para match existente (Alura/Curso/Tecnologia) quanto para valor novo
   * "creatable" (Conteúdo), cujo `Criar "X"` fica focado. Clicar a opção não
   * commitava o valor novo (deixava o texto solto → "Conteúdo é obrigatório").
   */
  private async fillCombo(label: string, typeText: string): Promise<void> {
    const group = this.page
      .locator('.chakra-form-control')
      .filter({ has: this.page.locator('label').filter({ hasText: new RegExp('^' + label) }) })
      .first();
    await group.locator('.creatable-select-field__control').first().click();
    await this.page.keyboard.type(typeText, { delay: 20 });
    await this.page
      .locator('.creatable-select-field__option, [role="option"]')
      .first()
      .waitFor({ timeout: 6_000 })
      .catch(() => undefined);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Preenche o form de novo registro externo com conteúdo = marker.
   * Carga horária usa máscara HH:MM:SS preenchida da direita: "400000" → 40h
   * (digitar "40" daria 40 SEGUNDOS — gotcha documentado no recon).
   */
  async fillExternalRecordForm(marker: string): Promise<void> {
    await this.pickPerson('QA11');
    await this.fillCombo('Provedor', 'Alura');
    await this.fillCombo('Conteúdo', marker);
    await this.fillCombo('Tipo de experiência', 'Curso');
    await this.fillCombo('Categorias', 'Tecnologia');
    const workload = this.page.locator('input[name="workload_seconds"]').first();
    await workload.click();
    await this.page.keyboard.type('400000', { delay: 20 });
    await this.page.locator('input[name="endDate"]').first().fill('2026-05-10');
  }

  /** Salva o form e volta para a lista. */
  async submitRecordForm(): Promise<void> {
    await this.saveButton().click();
    await this.page.waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/(new|edit)/.test(u.toString()), {
      timeout: 20_000,
    });
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
