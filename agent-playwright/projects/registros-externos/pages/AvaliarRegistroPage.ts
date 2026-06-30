import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { AdminRegistrosPage } from './AdminRegistrosPage.js';

/**
 * Fluxo "Avaliar registro externo pendente" (modo `admin-avaliar`) — suíte 1.9.
 *
 * Compõe {@link AdminRegistrosPage} (navegação + lista + kebab + approve/reject
 * + toasts já encapsulados) e acrescenta os getters/ações específicos da
 * avaliação: inspeção do menu, estrutura do form (banner, campos editáveis vs
 * disabled, rodapé), validação do Tipo, modal de recusa e drawer de Histórico.
 */
export class AvaliarRegistroPage {
  private readonly base: AdminRegistrosPage;

  constructor(private readonly page: Page) {
    this.base = new AdminRegistrosPage(page);
  }

  goto(): Promise<void> {
    return this.base.goto();
  }

  rowByContent(marker: string): Locator {
    return this.base.rowByContent(marker);
  }

  /** Busca em tempo real (pessoa/conteúdo/provedor) para trazer o registro à lista. */
  async search(term: string): Promise<void> {
    const input = this.page.getByPlaceholder(/Pesquise por pessoa, conteúdo ou provedor/i).first();
    await input.fill(term);
    await input.press('Enter').catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  getToast(text: RegExp | string): Locator {
    return this.base.getToast(text);
  }

  // ---- Menu da linha ----

  /** Textos dos itens do menu kebab da linha (e fecha o menu em seguida). */
  async menuItemTexts(marker: string): Promise<string[]> {
    const menu = await this.base.openRowMenu(this.rowByContent(marker));
    const texts = (await menu.getByRole('menuitem').allInnerTexts()).map((t) => t.trim());
    await this.page.keyboard.press('Escape').catch(() => undefined);
    return texts;
  }

  /**
   * Abre o form "Avaliar registro" pelo menu da linha (base já espera o botão
   * Aprovar). Retry: o clique no menuitem ocasionalmente não navega — reabre a
   * lista, rebusca e tenta de novo.
   */
  async openEvaluate(marker: string): Promise<void> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.base.openEvaluate(this.rowByContent(marker));
        return;
      } catch (err) {
        if (attempt === 3) throw err;
        await this.goto();
        await this.search(marker);
      }
    }
  }

  /** Situação exibida na linha do registro (texto da linha após busca). */
  async rowText(marker: string): Promise<string> {
    return (await this.rowByContent(marker).innerText()).replace(/\s+/g, ' ').trim();
  }

  // ---- Estrutura do form de avaliação ----

  bannerPendente(): Locator {
    return this.page.getByText(/Avaliação pendente/i).first();
  }

  aprovarButton(): Locator {
    return this.page.getByTestId('record-form-approve-button');
  }

  recusarButton(): Locator {
    return this.page.getByTestId('record-form-reject-button');
  }

  cancelarButton(): Locator {
    return this.page.getByTestId('record-form-cancel-button');
  }

  /** Grupo de form-control de um campo pelo label (react-select Twygo). */
  private comboGroup(label: string): Locator {
    return this.page
      .locator('.chakra-form-control')
      .filter({ has: this.page.locator('label').filter({ hasText: new RegExp('^' + label) }) })
      .first();
  }

  /** Preenche um react-select (Tipo de experiência / Categorias) commitando via Enter. */
  async fillCombo(label: string, typeText: string): Promise<void> {
    const group = this.comboGroup(label);
    await group.locator('.creatable-select-field__control, [class*="select-field__control"]').first().click();
    await this.page.keyboard.type(typeText, { delay: 20 });
    await this.page
      .locator('.creatable-select-field__option, [role="option"]')
      .first()
      .waitFor({ timeout: 6_000 })
      .catch(() => undefined);
    await this.page.keyboard.press('Enter');
  }

  selectTipo(value: string): Promise<void> {
    return this.fillCombo('Tipo de experiência', value);
  }

  addCategoria(value: string): Promise<void> {
    return this.fillCombo('Categorias', value);
  }

  /** Erro de validação do Tipo de experiência ("Campo obrigatório"). */
  tipoError(): Locator {
    return this.comboGroup('Tipo de experiência').getByText(/Campo obrigatório/i).first();
  }

  /** Um campo (input/select) está desabilitado? Procura por name OU pelo label. */
  async isInputDisabledByName(name: string): Promise<boolean> {
    const input = this.page.locator(`input[name="${name}"]`).first();
    if (!(await input.count())) return true; // ausente conta como não-editável
    return input.isDisabled();
  }

  // ---- Aprovar / Recusar ----

  /** Clica Aprovar sem esperar navegação (para validar bloqueio). */
  async clickAprovar(): Promise<void> {
    await this.aprovarButton().click();
  }

  /** Aprova e volta para a lista (fluxo feliz). */
  approve(): Promise<void> {
    return this.base.approve();
  }

  /** Abre o modal "Recusar registro" (sem completar). */
  async openRejectModal(): Promise<Locator> {
    await this.recusarButton().click();
    const modal = this.page
      .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
      .filter({ hasText: /Recusar registro/i })
      .first();
    await expect(modal).toBeVisible({ timeout: 10_000 });
    return modal;
  }

  justificativaTextarea(modal: Locator): Locator {
    return modal.locator('textarea').first();
  }

  modalRecusarButton(modal: Locator): Locator {
    return modal.getByRole('button', { name: /Recusar registro/i });
  }

  modalCancelarButton(modal: Locator): Locator {
    return modal.getByRole('button', { name: /Cancelar/i });
  }

  /** Fluxo completo de recusa com justificativa (reusa o helper base). */
  reject(justificativa: string): Promise<void> {
    return this.base.reject(justificativa);
  }

  /** Cancela a avaliação (rodapé) e volta à lista sem salvar. */
  async cancel(): Promise<void> {
    await this.cancelarButton().click();
    await this.page
      .waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), { timeout: 15_000 })
      .catch(() => undefined);
  }

  // ---- Histórico ----

  /** Abre o drawer "Histórico" pelo menu da linha e devolve o drawer. */
  async openHistorico(marker: string): Promise<Locator> {
    await this.base.clickRowMenuItem(this.rowByContent(marker), /Histórico/i);
    const drawer = this.page.locator('.chakra-modal__content, [role="dialog"]').filter({ hasText: /Histórico/i }).first();
    await expect(drawer).toBeVisible({ timeout: 10_000 });
    return drawer;
  }
}
