import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { RegistrosAdminPage } from './RegistrosAdminPage.js';

export type ExtractType = 'Dados' | 'Evidências';
export type ExtractScope = 'filtro_atual' | 'todos';
export type ExportFormat = 'csv' | 'pdf';

/**
 * Drawer "Configurações da extração" (botão "Extrair dados" da toolbar Admin),
 * suíte "Extração de dados e evidências (assíncrona com modal de atenção)".
 *
 * COMPÕE {@link RegistrosAdminPage} para navegação + gate de hidratação dos KPIs
 * (a lista popula tarde; a extração opera sobre o filtro server-side, então é
 * essencial abrir o drawer só com a lista carregada — senão o submit não tem
 * escopo). Seletores validados em recon ao vivo 2026-06-23 (ver
 * `inputs/recon-extracao-de-dados-evidencias-assincrona-modal-de-atencao.md`).
 *
 * Comportamento real do BETA (≠ AT) documentado no recon: o submit de **Dados**
 * é inerte (sem rede/toast) e o de **Evidências** posta 201 mas sem toast nem
 * modal "Atenção". Os specs assertam o comportamento AT; os que batem no gap
 * falham vermelho com causa-raiz no topo (Anti-pattern F).
 */
export class ExtracaoDrawerPage {
  private readonly base: RegistrosAdminPage;

  constructor(private readonly page: Page) {
    this.base = new RegistrosAdminPage(page);
  }

  // ---- Navegação (Admin) ----

  /** Abre a tela Admin Registros e espera a lista hidratar (rows > 0). */
  async goto(): Promise<void> {
    await this.base.goto();
    await this.waitForListHydrated();
  }

  /** A extração opera sobre o filtro server-side — só interagir com a lista pronta. */
  async waitForListHydrated(): Promise<void> {
    await expect
      .poll(async () => this.page.locator('table tbody tr').count(), { timeout: 30_000 })
      .toBeGreaterThan(0);
  }

  // ---- Toolbar ----

  extractButton(): Locator {
    return this.page.getByTestId('records-extraction-button');
  }

  async isExtractButtonVisible(): Promise<boolean> {
    return this.extractButton().first().isVisible().catch(() => false);
  }

  // ---- Drawer ----

  drawer(): Locator {
    return this.page.locator('.chakra-modal__content.chakra-slide');
  }

  typeSelect(): Locator {
    return this.page.getByTestId('records-extraction-type-select');
  }

  closeButton(): Locator {
    return this.page.getByTestId('records-extraction-drawer-close');
  }

  /** Clica "Extrair dados" e espera o drawer abrir no branch Dados (select pronto). */
  async open(): Promise<void> {
    await this.extractButton().first().click();
    await expect(this.drawer()).toBeVisible({ timeout: 10_000 });
    await expect(this.typeSelect()).toBeVisible({ timeout: 10_000 });
  }

  async selectType(type: ExtractType): Promise<void> {
    await this.typeSelect().selectOption({ label: type });
    // o branch troca os grupos — pequena espera de re-render
    await this.page.waitForTimeout(300);
  }

  /** Valor textual selecionado no select "Tipo de extração". */
  async getSelectedType(): Promise<string> {
    return this.typeSelect().evaluate((el) => {
      const s = el as HTMLSelectElement;
      return s.options[s.selectedIndex]?.text?.trim() ?? '';
    });
  }

  async closeByX(): Promise<void> {
    await this.closeButton().click();
    await expect(this.drawer()).toBeHidden({ timeout: 10_000 });
  }

  // ---- Branch Dados ----

  formatRadio(value: ExportFormat): Locator {
    return this.drawer().locator(`input[name="exportFormat"][value="${value}"]`);
  }

  rowsRadio(value: ExtractScope): Locator {
    return this.drawer().locator(`input[name="data"][value="${value}"]`);
  }

  columnsRadio(value: ExtractScope): Locator {
    // Colunas usa value 'filtro_atual' | 'todas' (recon: "Todas", não "Todos")
    return this.drawer().locator(`input[name="columns"][value="${value === 'todos' ? 'todas' : value}"]`);
  }

  dadosExtractButton(): Locator {
    return this.page.locator('#drawer-data-export-export');
  }

  dadosCancelButton(): Locator {
    return this.page.locator('#drawer-data-export-cancel');
  }

  /** Labels visíveis dos grupos de radio do branch atual (para validação estrutural). */
  async getVisibleGroupLabels(): Promise<string[]> {
    return this.drawer()
      .locator('label')
      .evaluateAll((els) => els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean));
  }

  // ---- Branch Evidências ----

  evidScopeRadio(scope: ExtractScope): Locator {
    return this.page.getByTestId(scope === 'filtro_atual' ? 'records-extraction-evidences-scope-current' : 'records-extraction-evidences-scope-all');
  }

  evidSubmitButton(): Locator {
    return this.page.getByTestId('records-extraction-evidences-submit');
  }

  evidCancelButton(): Locator {
    return this.page.getByTestId('records-extraction-evidences-cancel');
  }

  /** Marca o escopo e dispara a extração de evidências. */
  async triggerEvidExtract(scope: ExtractScope): Promise<void> {
    await this.evidScopeRadio(scope).check({ force: true });
    await this.evidSubmitButton().click();
  }

  // ---- Modal "Atenção" (evidências faltantes — RN 78) ----

  /**
   * Modal de aviso de registros sem evidência. Escopa por um dialog que contenha
   * o corpo característico — evita casar com o próprio drawer (que tem a palavra
   * "Evidências" no select).
   */
  atencaoModal(): Locator {
    return this.page
      .locator('[role="alertdialog"], [role="dialog"]')
      .filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i });
  }

  atencaoContinueButton(): Locator {
    return this.atencaoModal().getByRole('button', { name: /Continuar/i });
  }

  atencaoCancelButton(): Locator {
    return this.atencaoModal().getByRole('button', { name: /Cancelar/i });
  }

  // ---- Toast / flash ----

  toast(text: RegExp | string): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: text }).first();
  }

  async getToastTexts(): Promise<string[]> {
    return this.page.locator('.chakra-toast').allInnerTexts().catch(() => []);
  }

  flashMessage(text: RegExp | string): Locator {
    return this.page.getByText(text).first();
  }

  // ---- Notificação do sino (TopBar) — TC7 ----

  bellButton(): Locator {
    // sino de notificações da TopBar (fallback por aria-label/título conhecido)
    return this.page.getByRole('button', { name: /Notifica[çc][õo]es|notifications/i }).first();
  }
}
